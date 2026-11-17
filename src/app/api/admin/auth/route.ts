import { NextResponse } from "next/server";
import { saveSiteData } from "@/lib/data";
import {
  SESSION_COOKIE,
  canChangePasswordInPanel,
  createSessionToken,
  getAdminPassword,
  isAuthenticated,
  safeEqual,
  sessionCookieOptions,
} from "@/lib/auth";
import { StorageUnavailableError } from "@/lib/storage";

/** Session status, so the admin page knows whether to show the login screen. */
export async function GET(req: Request) {
  const password = await getAdminPassword();
  return NextResponse.json({
    authenticated: await isAuthenticated(req),
    loginEnabled: Boolean(password),
    canChangePassword: canChangePasswordInPanel(),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const correctPassword = await getAdminPassword();
    if (!correctPassword) {
      return NextResponse.json(
        { error: "Admin login is turned off. Set ADMIN_PASSWORD in Vercel → Settings → Environment Variables, then redeploy." },
        { status: 503 }
      );
    }

    if (body.action === "changePassword") {
      if (!(await isAuthenticated(req))) {
        return NextResponse.json({ error: "Please log in again." }, { status: 401 });
      }
      if (!canChangePasswordInPanel()) {
        return NextResponse.json(
          { error: "On the live site, change the password in Vercel → Settings → Environment Variables (ADMIN_PASSWORD), then redeploy." },
          { status: 400 }
        );
      }
      const { oldPassword, newPassword } = body;
      if (typeof oldPassword !== "string" || !safeEqual(oldPassword, correctPassword)) {
        return NextResponse.json({ error: "Incorrect current password" }, { status: 401 });
      }
      if (typeof newPassword !== "string" || newPassword.trim().length < 8) {
        return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 });
      }
      await saveSiteData({ settings: { adminPassword: newPassword.trim() } as never });
      // The session key is derived from the password, so issue a fresh cookie.
      const { token, maxAge } = createSessionToken(newPassword.trim());
      const res = NextResponse.json({ success: true, message: "Password updated successfully" });
      res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(maxAge));
      return res;
    }

    // Login
    if (typeof body.password === "string" && safeEqual(body.password, correctPassword)) {
      const { token, maxAge } = createSessionToken(correctPassword);
      const res = NextResponse.json({ success: true });
      res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(maxAge));
      return res;
    }

    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  } catch (err: unknown) {
    if (err instanceof StorageUnavailableError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    console.error("Admin auth error:", err);
    return NextResponse.json({ error: "Authentication error" }, { status: 500 });
  }
}

/** Log out. */
export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(SESSION_COOKIE, "", sessionCookieOptions(0));
  return res;
}
