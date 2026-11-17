import { NextResponse } from "next/server";
import { defaultDatabase, saveSiteData } from "@/lib/data";
import { isAuthenticated } from "@/lib/auth";
import { StorageUnavailableError } from "@/lib/storage";

export async function POST(req: Request) {
  if (!(await isAuthenticated(req))) {
    return NextResponse.json({ error: "Please log in again." }, { status: 401 });
  }
  try {
    // Keep the current password: reset content, not the login.
    const { adminPassword: _omit, ...settings } = defaultDatabase.settings;
    void _omit;
    const resetData = await saveSiteData({ ...defaultDatabase, settings });
    const { adminPassword: _omit2, ...safeSettings } = resetData.settings;
    void _omit2;
    return NextResponse.json({
      success: true,
      message: "Content reset to default successfully",
      data: { ...resetData, settings: safeSettings },
    });
  } catch (err: unknown) {
    if (err instanceof StorageUnavailableError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    console.error("Admin reset error:", err);
    return NextResponse.json({ error: "Failed to reset data" }, { status: 500 });
  }
}
