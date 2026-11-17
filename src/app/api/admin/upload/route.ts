import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { StorageUnavailableError, saveUpload } from "@/lib/storage";

// Vercel rejects request bodies over 4.5 MB, so cap uploads just below that.
const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "image/svg+xml"];

export async function POST(req: Request) {
  if (!(await isAuthenticated(req))) {
    return NextResponse.json({ error: "Please log in again." }, { status: 401 });
  }
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Please upload an image (JPG, PNG, WebP, GIF, AVIF or SVG)." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Image is too large. Please keep uploads under 4 MB." }, { status: 413 });
    }

    const url = await saveUpload(file.name, file);
    return NextResponse.json({ success: true, url, filename: url.split("/").pop() });
  } catch (err: unknown) {
    if (err instanceof StorageUnavailableError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    console.error("Admin upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
