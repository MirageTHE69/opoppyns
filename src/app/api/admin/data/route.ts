import { NextResponse } from "next/server";
import { getSiteData, saveSiteData } from "@/lib/data";
import { isAuthenticated } from "@/lib/auth";
import { StorageUnavailableError } from "@/lib/storage";

const unauthorized = () => NextResponse.json({ error: "Please log in again." }, { status: 401 });

export async function GET(req: Request) {
  if (!(await isAuthenticated(req))) return unauthorized();
  try {
    const data = await getSiteData();
    // Never send the password to the browser.
    const { adminPassword: _omit, ...settings } = data.settings;
    void _omit;
    return NextResponse.json({ ...data, settings });
  } catch (err: unknown) {
    console.error("Admin data load error:", err);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await isAuthenticated(req))) return unauthorized();
  try {
    const payload = await req.json();
    // The password only changes through /api/admin/auth.
    if (payload?.settings) delete payload.settings.adminPassword;

    const updated = await saveSiteData(payload);
    const { adminPassword: _omit, ...settings } = updated.settings;
    void _omit;
    return NextResponse.json({ success: true, data: { ...updated, settings } });
  } catch (err: unknown) {
    if (err instanceof StorageUnavailableError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    console.error("Admin data save error:", err);
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}
