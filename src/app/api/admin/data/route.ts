import { NextResponse } from "next/server";
import { getSiteData, saveSiteData } from "@/lib/data";

export async function GET() {
  try {
    const data = await getSiteData();
    // Do not leak password in plain response
    const safeData = {
      ...data,
      settings: {
        ...data.settings,
        adminPassword: data.settings.adminPassword ? "••••••••" : "admin123",
      },
    };
    return NextResponse.json(safeData);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // If settings are passed without a new password, keep current password
    if (payload.settings && (payload.settings.adminPassword === "••••••••" || !payload.settings.adminPassword)) {
      delete payload.settings.adminPassword;
    }

    const updated = await saveSiteData(payload);
    return NextResponse.json({ success: true, data: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
