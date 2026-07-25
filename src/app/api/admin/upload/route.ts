import { NextResponse } from "next/server";
import { parseMcqText } from "@/lib/mcq-parser";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

async function extractPdfText(buf: Buffer): Promise<string> {
  const { extractText, getDocumentProxy } = await import("unpdf");
  const pdf = await getDocumentProxy(new Uint8Array(buf));
  const { text } = await extractText(pdf, { mergePages: false });
  // text is an array of page strings when mergePages: false
  const pages = Array.isArray(text) ? text : [text];
  return pages.join("\n");
}

async function extractDocxText(buf: Buffer): Promise<string> {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer: buf });
  return result.value;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const maxBytes = 15 * 1024 * 1024; // 15 MB
    if (file.size > maxBytes) {
      return NextResponse.json({ error: "File too large (max 15 MB)" }, { status: 400 });
    }

    const name = (file.name || "").toLowerCase();
    const buf = Buffer.from(await file.arrayBuffer());

    let text = "";
    if (name.endsWith(".pdf") || file.type === "application/pdf") {
      text = await extractPdfText(buf);
    } else if (
      name.endsWith(".docx") ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      text = await extractDocxText(buf);
    } else if (name.endsWith(".txt") || file.type.startsWith("text/")) {
      text = buf.toString("utf-8");
    } else if (name.endsWith(".doc")) {
      return NextResponse.json(
        {
          error:
            "Legacy .doc format is not supported. Please save the file as .docx or PDF and try again.",
        },
        { status: 400 },
      );
    } else {
      return NextResponse.json(
        { error: "Unsupported file type. Upload a PDF, DOCX, or TXT file." },
        { status: 400 },
      );
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Could not extract any text from the file. If it's a scanned PDF, OCR is required." },
        { status: 422 },
      );
    }

    const questions = parseMcqText(text);

    return NextResponse.json({
      fileName: file.name,
      characters: text.length,
      parsedCount: questions.length,
      questions,
      // Include a snippet of raw text so admin can debug when parsing finds nothing
      rawPreview: questions.length === 0 ? text.slice(0, 2000) : undefined,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to process file";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
