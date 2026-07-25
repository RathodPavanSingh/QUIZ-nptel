import { NextResponse } from "next/server";
import {
  parseTextToQuestions,
  parseJsonQuestions,
  parseRowsToQuestions,
  type ParsedQuestion,
} from "@/lib/universal-parser";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

// --- Extract text from PDF ---
async function extractPdf(buf: Buffer): Promise<string> {
  const { extractText, getDocumentProxy } = await import("unpdf");
  const pdf = await getDocumentProxy(new Uint8Array(buf));
  const { text } = await extractText(pdf, { mergePages: false });
  const pages = Array.isArray(text) ? text : [text];
  return pages.join("\n");
}

// --- Extract text from DOCX ---
async function extractDocx(buf: Buffer): Promise<string> {
  const mammoth = await import("mammoth");
  const r = await mammoth.extractRawText({ buffer: buf });
  return r.value;
}

// --- Parse Excel (xls/xlsx) ---
async function parseExcel(
  buf: Buffer,
): Promise<Record<string, string>[]> {
  const XLSX = await import("xlsx");
  const wb = XLSX.read(buf, { type: "buffer" });
  const sheetName = wb.SheetNames[0];
  if (!sheetName) return [];
  const ws = wb.Sheets[sheetName];
  if (!ws) return [];
  return XLSX.utils.sheet_to_json<Record<string, string>>(ws, {
    defval: "",
    raw: false,
  });
}

// --- Parse CSV robustly ---
function parseCsvText(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const parseLine = (line: string): string[] => {
    const out: string[] = [];
    let cur = "";
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQ && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQ = !inQ;
        }
      } else if (ch === "," && !inQ) {
        out.push(cur);
        cur = "";
      } else {
        cur += ch;
      }
    }
    out.push(cur);
    return out.map((c) => c.trim());
  };

  const headers = parseLine(lines[0]);
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, j) => {
      row[h] = cols[j] ?? "";
    });
    rows.push(row);
  }
  return rows;
}

// --- Fetch URL content ---
async function fetchUrl(url: string): Promise<string> {
  const r = await fetch(url, {
    headers: { "User-Agent": "NPTELQuizBot/1.0" },
    signal: AbortSignal.timeout(15000),
  });
  if (!r.ok) throw new Error(`Failed to fetch URL: ${r.status}`);
  const ct = r.headers.get("content-type") ?? "";
  if (ct.includes("json")) {
    return JSON.stringify(await r.json());
  }
  return await r.text();
}

// --- Detect and parse JSON from string ---
function tryParseJson(text: string): unknown | null {
  const trimmed = text.trim();
  if (
    (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
    (trimmed.startsWith("{") && trimmed.endsWith("}"))
  ) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return null;
    }
  }
  return null;
}

type UploadResult = {
  questions: ParsedQuestion[];
  format: string;
  rawPreview?: string;
  totalChars: number;
};

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") ?? "";
    let defaults = { year: new Date().getFullYear(), unit: 1 };

    // --- JSON body (API / paste) ---
    if (contentType.includes("application/json")) {
      const body = await req.json();

      // Extract defaults
      if (body.year) defaults.year = parseInt(body.year, 10) || defaults.year;
      if (body.unit) defaults.unit = parseInt(body.unit, 10) || defaults.unit;

      // If raw text is pasted
      if (typeof body.text === "string" && body.text.trim()) {
        const text = body.text.trim();
        // Try JSON first
        const jsonParsed = tryParseJson(text);
        if (jsonParsed) {
          const qs = parseJsonQuestions(jsonParsed, defaults);
          return NextResponse.json({ questions: qs, format: "json-paste", totalChars: text.length });
        }
        // Try CSV (has headers with comma)
        const lines = text.split(/\r?\n/).filter((l: string) => l.trim());
        const firstLine = lines[0]?.toLowerCase() ?? "";
        if (
          lines.length >= 2 &&
          (firstLine.includes("question") || firstLine.includes("option")) &&
          firstLine.includes(",")
        ) {
          const rows = parseCsvText(text);
          const qs = parseRowsToQuestions(rows, defaults);
          return NextResponse.json({ questions: qs, format: "csv-paste", totalChars: text.length });
        }
        // Default: treat as freeform text
        const qs = parseTextToQuestions(text, defaults);
        return NextResponse.json({
          questions: qs,
          format: "text-paste",
          totalChars: text.length,
          rawPreview: qs.length === 0 ? text.slice(0, 2000) : undefined,
        });
      }

      // If URL
      if (typeof body.url === "string" && body.url.trim()) {
        const url = body.url.trim();
        const content = await fetchUrl(url);
        const jsonParsed = tryParseJson(content);
        if (jsonParsed) {
          const qs = parseJsonQuestions(jsonParsed, defaults);
          return NextResponse.json({ questions: qs, format: "url-json", totalChars: content.length });
        }
        // Try as HTML / plain text
        // Strip HTML tags for parsing
        const cleanText = content
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
          .replace(/<[^>]+>/g, "\n")
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&#\d+;/g, "");
        const qs = parseTextToQuestions(cleanText, defaults);
        return NextResponse.json({
          questions: qs,
          format: "url-text",
          totalChars: content.length,
          rawPreview: qs.length === 0 ? cleanText.slice(0, 2000) : undefined,
        });
      }

      // If questions array directly
      if (body.questions || Array.isArray(body)) {
        const data = body.questions ?? body;
        const qs = parseJsonQuestions(data, defaults);
        return NextResponse.json({ questions: qs, format: "json-api", totalChars: JSON.stringify(body).length });
      }

      return NextResponse.json({ error: "Provide text, url, or questions array" }, { status: 400 });
    }

    // --- FormData (file upload) ---
    const fd = await req.formData();
    const file = fd.get("file");
    const yearStr = fd.get("year");
    const unitStr = fd.get("unit");
    if (yearStr) defaults.year = parseInt(String(yearStr), 10) || defaults.year;
    if (unitStr) defaults.unit = parseInt(String(unitStr), 10) || defaults.unit;

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const maxBytes = 20 * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json({ error: "File too large (max 20 MB)" }, { status: 400 });
    }

    const name = file.name.toLowerCase();
    const buf = Buffer.from(await file.arrayBuffer());

    let result: UploadResult;

    if (name.endsWith(".json") || file.type === "application/json") {
      const text = buf.toString("utf-8");
      const parsed = JSON.parse(text);
      const qs = parseJsonQuestions(parsed, defaults);
      result = { questions: qs, format: "json", totalChars: text.length };
    } else if (name.endsWith(".csv") || file.type === "text/csv") {
      const text = buf.toString("utf-8");
      const rows = parseCsvText(text);
      const qs = parseRowsToQuestions(rows, defaults);
      result = { questions: qs, format: "csv", totalChars: text.length };
    } else if (
      name.endsWith(".xlsx") ||
      name.endsWith(".xls") ||
      file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel"
    ) {
      const rows = await parseExcel(buf);
      const qs = parseRowsToQuestions(rows, defaults);
      result = { questions: qs, format: "excel", totalChars: JSON.stringify(rows).length };
    } else if (name.endsWith(".pdf") || file.type === "application/pdf") {
      const text = await extractPdf(buf);
      const qs = parseTextToQuestions(text, defaults);
      result = {
        questions: qs,
        format: "pdf",
        totalChars: text.length,
        rawPreview: qs.length === 0 ? text.slice(0, 2000) : undefined,
      };
    } else if (
      name.endsWith(".docx") ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const text = await extractDocx(buf);
      const qs = parseTextToQuestions(text, defaults);
      result = {
        questions: qs,
        format: "docx",
        totalChars: text.length,
        rawPreview: qs.length === 0 ? text.slice(0, 2000) : undefined,
      };
    } else if (
      name.endsWith(".txt") ||
      name.endsWith(".md") ||
      name.endsWith(".markdown") ||
      file.type.startsWith("text/")
    ) {
      const text = buf.toString("utf-8");
      // Auto-detect if it's JSON
      const jsonParsed = tryParseJson(text);
      if (jsonParsed) {
        const qs = parseJsonQuestions(jsonParsed, defaults);
        result = { questions: qs, format: "json", totalChars: text.length };
      } else {
        // Check if CSV-like
        const lines = text.split(/\r?\n/).filter((l) => l.trim());
        const firstLine = lines[0]?.toLowerCase() ?? "";
        if (
          lines.length >= 2 &&
          (firstLine.includes("question") || firstLine.includes("option")) &&
          firstLine.includes(",")
        ) {
          const rows = parseCsvText(text);
          const qs = parseRowsToQuestions(rows, defaults);
          result = { questions: qs, format: "csv", totalChars: text.length };
        } else {
          const qs = parseTextToQuestions(text, defaults);
          result = {
            questions: qs,
            format: "text",
            totalChars: text.length,
            rawPreview: qs.length === 0 ? text.slice(0, 2000) : undefined,
          };
        }
      }
    } else if (name.endsWith(".doc")) {
      return NextResponse.json(
        { error: "Legacy .doc is not supported. Please save as .docx or PDF." },
        { status: 400 },
      );
    } else if (name.endsWith(".html") || name.endsWith(".htm")) {
      const text = buf.toString("utf-8");
      const cleanText = text
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, "\n")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
      const qs = parseTextToQuestions(cleanText, defaults);
      result = {
        questions: qs,
        format: "html",
        totalChars: text.length,
        rawPreview: qs.length === 0 ? cleanText.slice(0, 2000) : undefined,
      };
    } else {
      // Try as text
      const text = buf.toString("utf-8");
      const qs = parseTextToQuestions(text, defaults);
      result = {
        questions: qs,
        format: "unknown",
        totalChars: text.length,
        rawPreview: qs.length === 0 ? text.slice(0, 2000) : undefined,
      };
    }

    return NextResponse.json({
      fileName: file.name,
      ...result,
      parsedCount: result.questions.length,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to process";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
