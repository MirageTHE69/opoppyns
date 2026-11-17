import { createHash, createHmac, timingSafeEqual } from "crypto";
import { getSiteSettings } from "@/lib/data";

/*
 * Admin authentication.
 *
 * Live site (Vercel): the password comes ONLY from the ADMIN_PASSWORD
 * environment variable. The repository is public, so any password stored in
 * the repo (like the local default) must never unlock the live admin. If
 * ADMIN_PASSWORD is not set, admin login is disabled.
 *
 * Local development: ADMIN_PASSWORD if set, otherwise the password saved in
 * src/data/content.json (default "admin123"), which can be changed from the
 * admin panel.
 *
 * A successful login sets an httpOnly cookie holding an expiry time signed
 * with an HMAC. The key is derived from the current password, so changing the
 * password signs everyone out.
 */

export const SESSION_COOKIE = "poppyns_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export const isLiveDeployment = () => process.env.VERCEL === "1" || process.env.NODE_ENV === "production";

/** Password changes from the panel only work locally; live, it's an env var. */
export const canChangePasswordInPanel = () => !isLiveDeployment() && !process.env.ADMIN_PASSWORD;

/** The password that currently unlocks the admin, or null if login is disabled. */
export async function getAdminPassword(): Promise<string | null> {
  const fromEnv = process.env.ADMIN_PASSWORD?.trim();
  if (fromEnv) return fromEnv;
  if (isLiveDeployment()) return null;
  const settings = await getSiteSettings();
  return settings.adminPassword || "admin123";
}

const sha256 = (s: string) => createHash("sha256").update(s).digest();

/** Constant-time string comparison. */
export function safeEqual(a: string, b: string): boolean {
  // Hash first so inputs of different lengths can still be compared in constant time.
  return timingSafeEqual(sha256(a), sha256(b));
}

const signingKey = (password: string) =>
  sha256(`poppyns-admin-session|${process.env.ADMIN_SESSION_SECRET ?? ""}|${password}`);

const sign = (payload: string, password: string) =>
  createHmac("sha256", signingKey(password)).update(payload).digest("base64url");

export function createSessionToken(password: string): { token: string; maxAge: number } {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = String(exp);
  return { token: `${payload}.${sign(payload, password)}`, maxAge: SESSION_TTL_SECONDS };
}

function readCookie(req: Request, name: string): string | null {
  const header = req.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return null;
}

/** True if the request carries a valid, unexpired admin session cookie. */
export async function isAuthenticated(req: Request): Promise<boolean> {
  const token = readCookie(req, SESSION_COOKIE);
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const exp = Number(payload);
  if (!Number.isFinite(exp) || exp < Date.now() / 1000) return false;
  const password = await getAdminPassword();
  if (!password) return false;
  return safeEqual(sig, sign(payload, password));
}

export const sessionCookieOptions = (maxAge: number) => ({
  httpOnly: true,
  // Vercel always serves HTTPS; a local `npm start` is plain http.
  secure: process.env.VERCEL === "1",
  sameSite: "strict" as const,
  path: "/",
  maxAge,
});
