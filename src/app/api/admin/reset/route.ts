import { NextResponse } from "next/server";
import { defaultDatabase, saveSiteData } from "@/lib/data";

export async function POST() {
  try {
    const resetData = await saveSiteData(defaultDatabase);
    return NextResponse.json({ success: true, message: "Content reset to default successfully", data: resetData });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to reset data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
