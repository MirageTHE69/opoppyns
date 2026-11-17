import fs from "fs/promises";
import path from "path";
import { get, put } from "@vercel/blob";

/*
 * Where admin-edited content and uploaded images live.
 *
 * - Vercel Blob, when the project has a Blob store connected (Vercel then sets
 *   BLOB_READ_WRITE_TOKEN). Survives redeploys. Required on the live site,
 *   because Vercel's server filesystem is read-only.
 * - Local files (src/data/content.json, public/uploads) everywhere else, i.e.
 *   when running on your own computer.
 *
 * Nothing secret is ever written here: the store is public, like the website.
 */

const CONTENT_PATHNAME = "content/content.json";
const LOCAL_CONTENT = path.join(process.cwd(), "src", "data", "content.json");
const LOCAL_UPLOADS = path.join(process.cwd(), "public", "uploads");

export const blobEnabled = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

export class StorageUnavailableError extends Error {
  constructor() {
    super(
      "Saving isn't set up on the live site yet: connect a Vercel Blob store to this project " +
        "(Vercel → Storage → Create → Blob), then redeploy."
    );
    this.name = "StorageUnavailableError";
  }
}

/** True when running on Vercel without a Blob store, where nothing can be saved. */
const writesUnavailable = () => !blobEnabled() && process.env.VERCEL === "1";

/** Read the saved content JSON, or null if nothing has been saved yet. */
export async function readContent(): Promise<unknown | null> {
  if (blobEnabled()) {
    // useCache:false reads from origin, so the site shows an admin save immediately.
    const res = await get(CONTENT_PATHNAME, { access: "public", useCache: false });
    if (!res || res.statusCode !== 200) return null;
    return JSON.parse(await new Response(res.stream).text());
  }
  try {
    return JSON.parse(await fs.readFile(LOCAL_CONTENT, "utf-8"));
  } catch {
    return null;
  }
}

export async function writeContent(data: unknown): Promise<void> {
  const json = JSON.stringify(data, null, 2);
  if (blobEnabled()) {
    await put(CONTENT_PATHNAME, json, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: 60,
    });
    return;
  }
  if (writesUnavailable()) throw new StorageUnavailableError();
  await fs.writeFile(LOCAL_CONTENT, json, "utf-8");
}

/** Store an uploaded file and return its public URL. */
export async function saveUpload(name: string, file: File): Promise<string> {
  const safeName = name.replace(/[^a-zA-Z0-9.-]/g, "_").slice(-80) || "upload";
  if (blobEnabled()) {
    const blob = await put(`uploads/${safeName}`, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type || undefined,
    });
    return blob.url;
  }
  if (writesUnavailable()) throw new StorageUnavailableError();
  const uniqueName = `${Date.now()}-${safeName}`;
  await fs.mkdir(LOCAL_UPLOADS, { recursive: true });
  await fs.writeFile(path.join(LOCAL_UPLOADS, uniqueName), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${uniqueName}`;
}
