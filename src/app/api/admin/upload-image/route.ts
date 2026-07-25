import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ALLOWED = new Set(["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif", "image/svg+xml"]);
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: Request) {
  try {
    const fd = await req.formData();
    const file = fd.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json({ error: "Unsupported image type" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Image too large (max 5 MB)" }, { status: 400 });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const ext = extForType(file.type, file.name);
    const dir = path.join(process.cwd(), "public", "uploads", "questions");
    await mkdir(dir, { recursive: true });
    const id = crypto.randomBytes(10).toString("hex");
    const fileName = `${Date.now()}-${id}${ext}`;
    const full = path.join(dir, fileName);
    await writeFile(full, buf);
    const url = `/uploads/questions/${fileName}`;
    return NextResponse.json({ url, size: file.size, type: file.type });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function extForType(t: string, name: string): string {
  if (t === "image/png") return ".png";
  if (t === "image/jpeg" || t === "image/jpg") return ".jpg";
  if (t === "image/webp") return ".webp";
  if (t === "image/gif") return ".gif";
  if (t === "image/svg+xml") return ".svg";
  const m = name.match(/\.[a-z0-9]{2,5}$/i);
  return m ? m[0].toLowerCase() : ".bin";
}
