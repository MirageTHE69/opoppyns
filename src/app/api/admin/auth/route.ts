import { NextResponse } from "next/server";
import { getSiteSettings, saveSiteData } from "@/lib/data";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const settings = await getSiteSettings();
    const correctPassword = settings.adminPassword || "admin123";

    if (body.action === "changePassword") {
      const { oldPassword, newPassword } = body;
      if (oldPassword !== correctPassword) {
        return NextResponse.json({ error: "Incorrect current password" }, { status: 401 });
      }
      if (!newPassword || newPassword.trim().length < 4) {
        return NextResponse.json({ error: "New password must be at least 4 characters" }, { status: 400 });
      }

      await saveSiteData({ settings: { ...settings, adminPassword: newPassword.trim() } });
      return NextResponse.json({ success: true, message: "Password updated successfully" });
    }

    // Normal login
    const { password } = body;
    if (password === correctPassword) {
      // In production/local we issue a session token
      const token = Buffer.from(`poppyns-admin-${Date.now()}`).toString("base64");
      const res = NextResponse.json({ success: true, token });
      res.cookies.set("poppyns_admin_token", token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      return res;
    }

    return NextResponse.json({ error: "Invalid password. Default is admin123" }, { status: 401 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Authentication error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
