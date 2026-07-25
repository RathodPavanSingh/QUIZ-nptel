"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

type AdminCourse = {
  id: number; slug: string; name: string; description: string; totalUnits: number; questionCount: number;
};
type QType = "mcq" | "msq" | "numerical" | "figure";
type ParsedQ = {
  questionText: string; questionType: QType; options: string[]; correctIndex: number; correctIndices: number[];
  numericalAnswer: number | null; numericalTolerance: number; numericalUnit: string;
  explanation: string | null; imageUrl: string | null; year: number; unit: number; include: boolean;
};
type Tab = "upload" | "single";

const TYPE_META: Record<QType, { label: string; color: string; short: string }> = {
  mcq: { label: "MCQ – Single Correct", color: "bg-blue-600", short: "MCQ" },
  msq: { label: "MSQ – Multi Correct", color: "bg-emerald-600", short: "MSQ" },
  numerical: { label: "Numerical", color: "bg-amber-500", short: "NUM" },
  figure: { label: "Figure-based", color: "bg-purple-600", short: "FIG" },
};

const INPUT_MODES = [
  { key: "file", label: "Upload File", icon: "📁", desc: "PDF, DOCX, TXT, JSON, CSV, Excel, HTML" },
  { key: "paste", label: "Paste Text", icon: "📋", desc: "Paste raw questions, JSON array, or CSV" },
  { key: "url", label: "Fetch URL", icon: "🔗", desc: "Scrape questions from a web page" },
] as const;

type InputMode = (typeof INPUT_MODES)[number]["key"];

export default function DevBox() {
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [tab, setTab] = useState<Tab>("upload");
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const loadCourses = useCallback(async () => {
    const r = await fetch("/api/admin/courses");
    const j = await r.json();
    setCourses(j.courses ?? []);
  }, []);
  useEffect(() => {
    void Promise.resolve().then(loadCourses);
  }, [loadCourses]);
  const showToast = (t: { type: "ok" | "err"; msg: string }) => { setToast(t); setTimeout(() => setToast(null), 4000); };

  return (
    <main className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-6xl px-5 py-6 pb-24">
        {/* Hero */}
        <div className="rounded-2xl border border-slate-200 bg-linear-to-br from-fuchsia-900 via-violet-900 to-indigo-900 p-6 text-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold">DevBox</h1>
              <p className="text-sm text-violet-200">Universal Question Upload · Any format · Auto-detection</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(["mcq", "msq", "numerical", "figure"] as QType[]).map(t => (
              <div key={t} className="rounded-xl bg-white/10 px-3 py-2 ring-1 ring-white/10">
                <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold ${TYPE_META[t].color}`}>{TYPE_META[t].short}</span>
                <div className="mt-1 text-xs text-violet-200">{TYPE_META[t].label}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-[10px] text-violet-300">
            <span className="rounded-full bg-white/10 px-2 py-0.5">PDF</span>
            <span className="rounded-full bg-white/10 px-2 py-0.5">DOCX</span>
            <span className="rounded-full bg-white/10 px-2 py-0.5">TXT</span>
            <span className="rounded-full bg-white/10 px-2 py-0.5">JSON</span>
            <span className="rounded-full bg-white/10 px-2 py-0.5">CSV</span>
            <span className="rounded-full bg-white/10 px-2 py-0.5">Excel</span>
            <span className="rounded-full bg-white/10 px-2 py-0.5">HTML</span>
            <span className="rounded-full bg-white/10 px-2 py-0.5">URL</span>
            <span className="rounded-full bg-white/10 px-2 py-0.5">Markdown</span>
            <span className="rounded-full bg-white/10 px-2 py-0.5">Paste</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-5 flex gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <TabBtn active={tab === "upload"} onClick={() => setTab("upload")} label="Universal Upload" icon="🚀" />
          <TabBtn active={tab === "single"} onClick={() => setTab("single")} label="Single Question" icon="✏️" />
        </div>

        {tab === "upload" && <UniversalUpload courses={courses} onSaved={(n) => { loadCourses(); showToast({ type: "ok", msg: `${n} question(s) saved!` }); }} onError={(m) => showToast({ type: "err", msg: m })} />}
        {tab === "single" && <SingleEditor courses={courses} onSaved={() => { loadCourses(); showToast({ type: "ok", msg: "Question saved!" }); }} onError={(m) => showToast({ type: "err", msg: m })} />}
      </div>

      {toast && (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2">
          <div className={`rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-lg ${toast.type === "ok" ? "bg-emerald-600" : "bg-rose-600"}`}>{toast.msg}</div>
        </div>
      )}
    </main>
  );
}

/* ========================= UNIVERSAL UPLOAD ========================= */

function UniversalUpload({ courses, onSaved, onError }: { courses: AdminCourse[]; onSaved: (n: number) => void; onError: (m: string) => void }) {
  const [courseId, setCourseId] = useState<number | "">("");
  const [defaultYear, setDefaultYear] = useState(new Date().getFullYear());
  const [defaultUnit, setDefaultUnit] = useState(1);
  const [inputMode, setInputMode] = useState<InputMode>("file");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<ParsedQ[]>([]);
  const [format, setFormat] = useState("");
  const [rawPreview, setRawPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");

  const counts = useMemo(() => {
    const c = { total: 0, mcq: 0, msq: 0, numerical: 0, figure: 0, included: 0, noAnswer: 0 };
    for (const it of items) {
      c.total++;
      c[it.questionType]++;
      if (it.include) {
        c.included++;
        if (it.questionType === "mcq" && it.correctIndex < 0) c.noAnswer++;
        if (it.questionType === "msq" && it.correctIndices.length === 0) c.noAnswer++;
        if (it.questionType === "numerical" && it.numericalAnswer === null) c.noAnswer++;
      }
    }
    return c;
  }, [items]);

  async function processFile(file: File) {
    setLoading(true); setRawPreview(null); setItems([]);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("year", String(defaultYear));
      fd.append("unit", String(defaultUnit));
      const res = await fetch("/api/admin/universal-upload", { method: "POST", body: fd });
      handleResult(await res.json(), res.ok);
    } catch (e) { onError(e instanceof Error ? e.message : "Upload failed"); }
    finally { setLoading(false); }
  }

  async function processText() {
    if (!text.trim()) return onError("Paste some content first.");
    setLoading(true); setRawPreview(null); setItems([]);
    try {
      const res = await fetch("/api/admin/universal-upload", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text, year: defaultYear, unit: defaultUnit }),
      });
      handleResult(await res.json(), res.ok);
    } catch (e) { onError(e instanceof Error ? e.message : "Parse failed"); }
    finally { setLoading(false); }
  }

  async function processUrl() {
    if (!url.trim()) return onError("Enter a URL.");
    setLoading(true); setRawPreview(null); setItems([]);
    try {
      const res = await fetch("/api/admin/universal-upload", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url, year: defaultYear, unit: defaultUnit }),
      });
      handleResult(await res.json(), res.ok);
    } catch (e) { onError(e instanceof Error ? e.message : "Fetch failed"); }
    finally { setLoading(false); }
  }

  function handleResult(d: Record<string, unknown>, ok: boolean) {
    if (!ok || d.error) { onError(String(d.error ?? "Processing failed")); return; }
    const qs = (d.questions ?? []) as ParsedQ[];
    setItems(qs.map(q => ({ ...q, year: q.year || defaultYear, unit: q.unit || defaultUnit, include: q.questionText.length > 0 })));
    setFormat(String(d.format ?? ""));
    setRawPreview(typeof d.rawPreview === "string" ? d.rawPreview : null);
    if (qs.length === 0) onError("No questions detected. Check the format guide.");
  }

  function updateItem(idx: number, patch: Partial<ParsedQ>) {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, ...patch } : it));
  }

  function applyDefaults() {
    setItems(prev => prev.map(it => ({ ...it, year: defaultYear, unit: defaultUnit })));
  }

  async function saveAll() {
    if (!courseId) return onError("Select a course.");
    const toSave = items.filter(i => i.include);
    if (toSave.length === 0) return onError("No questions selected.");
    const missing = toSave.filter(i => {
      if (i.questionType === "mcq" && i.correctIndex < 0) return true;
      if (i.questionType === "msq" && i.correctIndices.length === 0) return true;
      if (i.questionType === "numerical" && i.numericalAnswer === null) return true;
      if (i.questionType === "figure" && i.correctIndex < 0 && i.correctIndices.length === 0) return true;
      return false;
    });
    if (missing.length > 0) return onError(`${missing.length} question(s) have no correct answer. Fix or exclude them.`);

    setSaving(true);
    try {
      const payload = toSave.map(i => ({
        courseId, year: i.year, unit: i.unit, questionType: i.questionType,
        questionText: i.questionText, options: i.options, correctIndex: i.correctIndex >= 0 ? i.correctIndex : 0,
        correctIndices: i.correctIndices.length > 0 ? i.correctIndices : undefined,
        numericalAnswer: i.numericalAnswer, numericalTolerance: i.numericalTolerance || 0,
        numericalUnit: i.numericalUnit || null, explanation: i.explanation, imageUrl: i.imageUrl,
      }));
      const res = await fetch("/api/admin/questions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ questions: payload }),
      });
      const d = await res.json();
      if (!res.ok || d.error) onError(String(d.error ?? "Save failed"));
      else {
        onSaved(d.inserted ?? 0);
        if (d.failed > 0) onError(`${d.failed} question(s) had errors.`);
        if ((d.inserted ?? 0) > 0) { setItems([]); setRawPreview(null); setText(""); setUrl(""); }
      }
    } catch (e) { onError(e instanceof Error ? e.message : "Save failed"); }
    finally { setSaving(false); }
  }

  return (
    <div className="mt-5 space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Universal Upload</h2>
        <p className="text-sm text-slate-600">Upload <b>any file</b>, paste text, or fetch from a URL. Questions are auto-detected and classified as MCQ, MSQ, Numerical, or Figure.</p>

        {/* Defaults */}
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Field label="Course *">
            <select value={courseId} onChange={e => setCourseId(e.target.value ? parseInt(e.target.value, 10) : "")} className="inp">
              <option value="">-- Select --</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Default Year">
            <input type="number" value={defaultYear} onChange={e => setDefaultYear(parseInt(e.target.value, 10) || 0)} className="inp" />
          </Field>
          <Field label="Default Unit">
            <input type="number" min={1} value={defaultUnit} onChange={e => setDefaultUnit(parseInt(e.target.value, 10) || 1)} className="inp" />
          </Field>
        </div>

        {/* Input mode selector */}
        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          {INPUT_MODES.map(m => (
            <button key={m.key} onClick={() => setInputMode(m.key)} className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${inputMode === m.key ? "border-violet-500 bg-violet-50 ring-2 ring-violet-200" : "border-slate-200 hover:border-slate-400"}`}>
              <span className="text-2xl">{m.icon}</span>
              <div>
                <div className="text-sm font-semibold text-slate-900">{m.label}</div>
                <div className="text-[11px] text-slate-500">{m.desc}</div>
              </div>
            </button>
          ))}
        </div>

        {/* File input */}
        {inputMode === "file" && (
          <label
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) processFile(f); }}
            className={`mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-12 text-center transition ${dragOver ? "border-violet-500 bg-violet-50" : "border-slate-300 bg-slate-50 hover:border-violet-400 hover:bg-violet-50/50"}`}
          >
            <input type="file" className="hidden" accept=".pdf,.docx,.txt,.json,.csv,.xlsx,.xls,.html,.htm,.md,.markdown" onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f); e.currentTarget.value = ""; }} />
            <div className="text-4xl">{loading ? "⏳" : "📂"}</div>
            <div className="text-sm font-semibold text-slate-800">{loading ? "Processing file…" : "Drop any file or click to browse"}</div>
            <div className="max-w-xs text-xs text-slate-500">PDF · DOCX · TXT · JSON · CSV · Excel (xlsx/xls) · HTML · Markdown · up to 20 MB</div>
          </label>
        )}

        {/* Paste input */}
        {inputMode === "paste" && (
          <div className="mt-4">
            <textarea value={text} onChange={e => setText(e.target.value)} rows={12} spellCheck={false} placeholder={"Paste questions in any format:\n\nQ1. What is 2+2?\nA) 3\nB) 4\nC) 5\nD) 6\nAnswer: B\n\nOr paste JSON: [{\"questionText\":\"...\", \"options\":[...], ...}]\n\nOr paste CSV with headers: question, option1, option2, ..."}
              className="w-full resize-y rounded-xl border border-slate-300 bg-slate-950 px-4 py-3 font-mono text-xs leading-relaxed text-emerald-200 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200" />
            <div className="mt-2 flex justify-end">
              <button onClick={processText} disabled={loading} className="btn-primary">{loading ? "Processing…" : "Parse Text"}</button>
            </div>
          </div>
        )}

        {/* URL input */}
        {inputMode === "url" && (
          <div className="mt-4">
            <div className="flex gap-2">
              <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com/questions.json or any webpage" className="inp flex-1" />
              <button onClick={processUrl} disabled={loading} className="btn-primary">{loading ? "Fetching…" : "Fetch"}</button>
            </div>
            <div className="mt-1 text-[11px] text-slate-500">Supports: JSON API endpoints, HTML pages, plain text URLs</div>
          </div>
        )}

        {/* Format guide */}
        <details className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <summary className="cursor-pointer font-semibold text-slate-800">📖 Supported Formats & Auto-Detection Guide</summary>
          <div className="mt-3 space-y-4 text-xs">
            <div>
              <b className="text-blue-700">MCQ (auto-detected)</b>: Standard questions with options A-D and a single answer.
              <pre className="mt-1 overflow-x-auto rounded-lg bg-slate-900 p-3 text-emerald-200">{`Q1. What is the capital of France?\nA) London\nB) Paris\nC) Berlin\nD) Madrid\nAnswer: B`}</pre>
            </div>
            <div>
              <b className="text-emerald-700">MSQ (auto-detected)</b>: keywords like &quot;select all&quot;, &quot;choose multiple&quot;, or multiple answers like &quot;Answer: A, C&quot;
              <pre className="mt-1 overflow-x-auto rounded-lg bg-slate-900 p-3 text-emerald-200">{`Q1. Which are HTTP methods? (Select all)\nA) GET\nB) FETCH\nC) POST\nD) REMOVE\nAnswer: A, C`}</pre>
            </div>
            <div>
              <b className="text-amber-700">Numerical (auto-detected)</b>: &quot;calculate&quot;, &quot;find the value&quot;, no options, answer is a number.
              <pre className="mt-1 overflow-x-auto rounded-lg bg-slate-900 p-3 text-emerald-200">{`Q1. Calculate 25% of 200.\nAnswer: 50\nTolerance: 0.5`}</pre>
            </div>
            <div>
              <b className="text-purple-700">Figure (auto-detected)</b>: Has image/figure line or imageUrl in JSON.
              <pre className="mt-1 overflow-x-auto rounded-lg bg-slate-900 p-3 text-emerald-200">{`Q1. Identify the shape shown below.\nImage: https://example.com/shape.png\nA) Circle\nB) Square\nAnswer: B`}</pre>
            </div>
            <div>
              <b className="text-slate-800">JSON format</b>:
              <pre className="mt-1 overflow-x-auto rounded-lg bg-slate-900 p-3 text-emerald-200">{`[{ "questionText": "...", "questionType": "mcq|msq|numerical|figure",\n   "options": ["A","B","C","D"], "correctIndex": 1,\n   "correctIndices": [0,2], "numericalAnswer": 42,\n   "numericalTolerance": 0.5, "imageUrl": "/img.png" }]`}</pre>
            </div>
            <div>
              <b className="text-slate-800">CSV / Excel columns</b>:
              <code className="rounded bg-slate-200 px-1">question, option1, option2, option3, option4, correctIndex, questionType, correctIndices, numericalAnswer, tolerance, imageUrl, explanation, year, unit</code>
            </div>
          </div>
        </details>

        {rawPreview && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="text-sm font-semibold text-amber-800">Extracted text (no questions detected):</div>
            <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded-lg bg-white p-3 text-xs text-slate-600">{rawPreview}</pre>
          </div>
        )}
      </div>

      {/* ===== Preview Results ===== */}
      {items.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{items.length} Questions Detected</h3>
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                {format && <span className="rounded-full bg-violet-100 px-2 py-0.5 font-semibold text-violet-700 uppercase">{format}</span>}
                <span className="rounded-full bg-blue-100 px-2 py-0.5 font-semibold text-blue-700">{counts.mcq} MCQ</span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-700">{counts.msq} MSQ</span>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-700">{counts.numerical} Numerical</span>
                <span className="rounded-full bg-purple-100 px-2 py-0.5 font-semibold text-purple-700">{counts.figure} Figure</span>
                {counts.noAnswer > 0 && <span className="rounded-full bg-rose-100 px-2 py-0.5 font-semibold text-rose-700">⚠ {counts.noAnswer} missing answer</span>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={applyDefaults} className="btn-sm border border-slate-300 bg-white text-slate-700 hover:bg-slate-50">Apply Year/Unit All</button>
              <button onClick={saveAll} disabled={saving || counts.included === 0} className={`btn-primary ${saving || counts.included === 0 ? "opacity-50 cursor-not-allowed" : ""}`}>
                {saving ? "Saving…" : `Save ${counts.included} Question(s)`}
              </button>
            </div>
          </div>

          <ul className="mt-4 space-y-3">
            {items.map((it, idx) => (
              <ParsedQuestionCard key={idx} item={it} idx={idx} onUpdate={patch => updateItem(idx, patch)} />
            ))}
          </ul>

          <div className="mt-5 flex justify-end">
            <button onClick={saveAll} disabled={saving || counts.included === 0} className={`btn-primary ${saving || counts.included === 0 ? "opacity-50 cursor-not-allowed" : ""}`}>
              {saving ? "Saving…" : `Save ${counts.included} Question(s)`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== PARSED QUESTION CARD ===== */

function ParsedQuestionCard({ item: it, idx, onUpdate }: { item: ParsedQ; idx: number; onUpdate: (p: Partial<ParsedQ>) => void }) {
  const tm = TYPE_META[it.questionType];
  const hasIssue = it.include && (
    (it.questionType === "mcq" && it.correctIndex < 0) ||
    (it.questionType === "msq" && it.correctIndices.length === 0) ||
    (it.questionType === "numerical" && it.numericalAnswer === null) ||
    (it.questionType === "figure" && it.correctIndex < 0 && it.correctIndices.length === 0)
  );

  return (
    <li className={`rounded-xl border p-4 transition ${!it.include ? "border-slate-200 bg-slate-50 opacity-50" : hasIssue ? "border-amber-300 bg-amber-50/40" : "border-slate-200 bg-white"}`}>
      <div className="flex items-start gap-3">
        <input type="checkbox" checked={it.include} onChange={e => onUpdate({ include: e.target.checked })} className="mt-1 h-4 w-4 accent-blue-600" />
        <div className="min-w-0 flex-1">
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">Q{idx + 1}</span>
            {/* Type selector */}
            <select value={it.questionType} onChange={e => onUpdate({ questionType: e.target.value as QType })} className={`rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${tm.color} border-0 outline-none cursor-pointer`}>
              <option value="mcq">MCQ</option>
              <option value="msq">MSQ</option>
              <option value="numerical">Numerical</option>
              <option value="figure">Figure</option>
            </select>
            <label className="flex items-center gap-1 text-[11px] text-slate-600">
              Year <input type="number" value={it.year} onChange={e => onUpdate({ year: parseInt(e.target.value, 10) || 0 })} className="w-20 rounded-md border border-slate-300 px-1.5 py-0.5 text-xs" />
            </label>
            <label className="flex items-center gap-1 text-[11px] text-slate-600">
              Unit <input type="number" value={it.unit} min={1} onChange={e => onUpdate({ unit: parseInt(e.target.value, 10) || 1 })} className="w-16 rounded-md border border-slate-300 px-1.5 py-0.5 text-xs" />
            </label>
            {hasIssue && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">⚠ Fix answer</span>}
          </div>

          {/* Question text */}
          <textarea value={it.questionText} onChange={e => onUpdate({ questionText: e.target.value })} rows={2}
            className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-900 outline-none focus:border-blue-500" />

          {/* Image */}
          {it.imageUrl && (
            <div className="mt-2 flex items-center gap-2">
              <Image src={it.imageUrl} alt="Figure" width={120} height={80} className="rounded-lg border border-slate-200 object-contain" unoptimized />
              <button onClick={() => onUpdate({ imageUrl: null })} className="text-[10px] font-semibold text-rose-600 hover:underline">Remove</button>
            </div>
          )}

          {/* Type-specific answer editor */}
          {it.questionType === "numerical" ? (
            <div className="mt-2 grid grid-cols-3 gap-2">
              <input type="number" step="any" value={it.numericalAnswer ?? ""} onChange={e => onUpdate({ numericalAnswer: e.target.value ? parseFloat(e.target.value) : null })} placeholder="Correct value *" className="rounded-lg border border-slate-300 px-2 py-1 text-xs outline-none focus:border-blue-500" />
              <input type="number" step="any" min={0} value={it.numericalTolerance || ""} onChange={e => onUpdate({ numericalTolerance: parseFloat(e.target.value) || 0 })} placeholder="± Tolerance" className="rounded-lg border border-slate-300 px-2 py-1 text-xs outline-none focus:border-blue-500" />
              <input value={it.numericalUnit} onChange={e => onUpdate({ numericalUnit: e.target.value })} placeholder="Unit (optional)" className="rounded-lg border border-slate-300 px-2 py-1 text-xs outline-none focus:border-blue-500" />
            </div>
          ) : (
            <div className="mt-2 space-y-1">
              {it.options.map((opt, oi) => {
                const isMsq = it.questionType === "msq" || (it.questionType === "figure" && it.correctIndices.length > 0);
                const isCorrect = isMsq ? it.correctIndices.includes(oi) : it.correctIndex === oi;
                return (
                  <div key={oi} className="flex items-center gap-1.5">
                    <button onClick={() => {
                      if (isMsq) {
                        const next = isCorrect ? it.correctIndices.filter(i => i !== oi) : [...it.correctIndices, oi];
                        onUpdate({ correctIndices: next.sort((a, b) => a - b) });
                      } else {
                        onUpdate({ correctIndex: oi });
                      }
                    }} className={`flex h-5 w-5 shrink-0 items-center justify-center text-[10px] font-bold transition ${isMsq ? "rounded" : "rounded-full"} ${isCorrect ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-emerald-100"}`}>
                      {isMsq && isCorrect ? "✓" : String.fromCharCode(65 + oi)}
                    </button>
                    <input value={opt} onChange={e => onUpdate({ options: it.options.map((o, j) => j === oi ? e.target.value : o) })}
                      className={`flex-1 rounded-md border px-2 py-1 text-xs outline-none focus:border-blue-500 ${isCorrect ? "border-emerald-300 bg-emerald-50" : "border-slate-200"}`} />
                  </div>
                );
              })}
            </div>
          )}

          {/* Explanation */}
          {it.explanation && (
            <input value={it.explanation} onChange={e => onUpdate({ explanation: e.target.value })} placeholder="Explanation" className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-600 outline-none focus:border-blue-500" />
          )}
        </div>
      </div>
    </li>
  );
}

/* ========================= SINGLE QUESTION EDITOR ========================= */

function SingleEditor({ courses, onSaved, onError }: { courses: AdminCourse[]; onSaved: () => void; onError: (m: string) => void }) {
  const [courseId, setCourseId] = useState<number | "">("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [unit, setUnit] = useState(1);
  const [questionType, setQuestionType] = useState<QType>("mcq");
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [correctIndices, setCorrectIndices] = useState<number[]>([]);
  const [numericalAnswer, setNumericalAnswer] = useState("");
  const [numericalTolerance, setNumericalTolerance] = useState("0");
  const [numericalUnit, setNumericalUnit] = useState("");
  const [explanation, setExplanation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  const isMsq = questionType === "msq" || (questionType === "figure" && correctIndices.length > 0);

  async function handleImage(file: File) {
    setUploadingImg(true);
    try {
      const fd = new FormData(); fd.append("file", file);
      const r = await fetch("/api/admin/upload-image", { method: "POST", body: fd });
      const j = await r.json();
      if (!r.ok || j.error) onError(j.error ?? "Image upload failed");
      else setImageUrl(j.url);
    } finally { setUploadingImg(false); }
  }

  async function submit() {
    if (!courseId) return onError("Select a course.");
    if (!questionText.trim()) return onError("Question text required.");
    if (questionType === "figure" && !imageUrl) return onError("Upload an image for figure.");
    const payload: Record<string, unknown> = {
      courseId, year, unit, questionText: questionText.trim(),
      explanation: explanation.trim() || null, questionType, imageUrl: imageUrl || null,
    };
    if (questionType === "numerical") {
      const n = parseFloat(numericalAnswer);
      if (isNaN(n)) return onError("Numerical answer must be a number.");
      payload.numericalAnswer = n;
      payload.numericalTolerance = parseFloat(numericalTolerance || "0") || 0;
      payload.numericalUnit = numericalUnit.trim() || null;
    } else {
      const opts = options.map(o => o.trim()).filter(o => o.length > 0);
      if (opts.length < 2) return onError("Need at least 2 options.");
      payload.options = opts;
      if (isMsq) {
        if (correctIndices.length === 0) return onError("Mark at least one correct.");
        payload.correctIndices = correctIndices;
      } else {
        payload.correctIndex = correctIndex;
      }
    }
    setSaving(true);
    try {
      const r = await fetch("/api/admin/questions", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const d = await r.json();
      if (!r.ok || d.error) onError(d.error ?? "Failed");
      else if (d.failed > 0) onError(d.errors?.[0]?.error ?? "Validation failed");
      else { onSaved(); setQuestionText(""); setOptions(["", "", "", ""]); setCorrectIndex(0); setCorrectIndices([]); setNumericalAnswer(""); setExplanation(""); setImageUrl(""); }
    } catch (e) { onError(e instanceof Error ? e.message : "Failed"); }
    finally { setSaving(false); }
  }

  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">Add Single Question</h2>
      <p className="text-sm text-slate-600">Pick a type and fill in the details.</p>
      {/* Type picker */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {(["mcq", "msq", "numerical", "figure"] as QType[]).map(t => {
          const m = TYPE_META[t];
          return <button key={t} onClick={() => setQuestionType(t)} className={`rounded-xl border p-2.5 text-left transition ${questionType === t ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 hover:border-slate-400"}`}>
            <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold text-white ${m.color}`}>{m.short}</span>
            <div className={`mt-1 text-xs font-semibold ${questionType === t ? "text-white" : "text-slate-700"}`}>{m.label}</div>
          </button>;
        })}
      </div>
      {/* Fields */}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Field label="Course *"><select value={courseId} onChange={e => setCourseId(e.target.value ? parseInt(e.target.value, 10) : "")} className="inp"><option value="">--</option>{courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
        <Field label="Year"><input type="number" value={year} onChange={e => setYear(parseInt(e.target.value, 10) || 0)} className="inp" /></Field>
        <Field label="Unit"><input type="number" min={1} value={unit} onChange={e => setUnit(parseInt(e.target.value, 10) || 1)} className="inp" /></Field>
      </div>
      <div className="mt-3"><Field label="Question *"><textarea value={questionText} onChange={e => setQuestionText(e.target.value)} rows={3} className="inp resize-y" /></Field></div>
      {/* Image */}
      {(questionType === "figure" || imageUrl) && (
        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
          {imageUrl ? (
            <div className="flex items-center gap-3">
              <Image src={imageUrl} alt="Fig" width={120} height={80} className="rounded-lg border border-slate-200 object-contain" unoptimized />
              <button onClick={() => setImageUrl("")} className="text-xs font-semibold text-rose-600 hover:underline">Remove</button>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center gap-1 rounded-lg border-2 border-dashed border-slate-300 bg-white px-4 py-6 text-center hover:border-purple-400">
              <input type="file" className="hidden" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) handleImage(f); e.currentTarget.value = ""; }} />
              <div className="text-xs font-semibold text-slate-700">{uploadingImg ? "Uploading…" : "Upload image"}</div>
            </label>
          )}
        </div>
      )}
      {/* Type-specific */}
      {questionType === "numerical" ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <Field label="Correct Value *"><input type="number" step="any" value={numericalAnswer} onChange={e => setNumericalAnswer(e.target.value)} className="inp" /></Field>
          <Field label="± Tolerance"><input type="number" step="any" min={0} value={numericalTolerance} onChange={e => setNumericalTolerance(e.target.value)} className="inp" /></Field>
          <Field label="Unit"><input value={numericalUnit} onChange={e => setNumericalUnit(e.target.value)} placeholder="Mbps, kg, %" className="inp" /></Field>
        </div>
      ) : (
        <div className="mt-3 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Options * {isMsq ? "(multi-select)" : "(single-select)"}</span>
            <button onClick={() => { if (options.length < 8) setOptions([...options, ""]); }} className="text-blue-600 hover:underline">+ Add</button>
          </div>
          {options.map((opt, i) => {
            const isC = isMsq ? correctIndices.includes(i) : correctIndex === i;
            return (
              <div key={i} className="flex items-center gap-2">
                <button onClick={() => { if (isMsq) { setCorrectIndices(prev => isC ? prev.filter(x => x !== i) : [...prev, i].sort((a, b) => a - b)); } else { setCorrectIndex(i); } }}
                  className={`flex h-6 w-6 shrink-0 items-center justify-center text-[11px] font-bold ${isMsq ? "rounded" : "rounded-full"} ${isC ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-emerald-100"}`}>
                  {isMsq && isC ? "✓" : String.fromCharCode(65 + i)}
                </button>
                <input value={opt} onChange={e => setOptions(options.map((o, j) => j === i ? e.target.value : o))} placeholder={`Option ${String.fromCharCode(65 + i)}`} className={`flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500 ${isC ? "border-emerald-300 bg-emerald-50" : "border-slate-300"}`} />
                {options.length > 2 && <button onClick={() => { const n = options.filter((_, j) => j !== i); setOptions(n); if (correctIndex >= n.length) setCorrectIndex(0); setCorrectIndices(prev => prev.filter(x => x !== i).map(x => x > i ? x - 1 : x)); }} className="rounded border border-slate-300 p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600">✕</button>}
              </div>
            );
          })}
        </div>
      )}
      <div className="mt-3"><Field label="Explanation"><textarea value={explanation} onChange={e => setExplanation(e.target.value)} rows={2} className="inp resize-y" placeholder="Optional" /></Field></div>
      <div className="mt-4 flex items-center justify-end gap-2">
        <button onClick={() => { setQuestionText(""); setOptions(["","","",""]); setCorrectIndex(0); setCorrectIndices([]); setNumericalAnswer(""); setExplanation(""); setImageUrl(""); }} className="btn-sm border border-slate-300 bg-white text-slate-700">Reset</button>
        <button onClick={submit} disabled={saving} className={`btn-primary ${saving ? "opacity-50 cursor-not-allowed" : ""}`}>{saving ? "Saving…" : "Save"}</button>
      </div>
    </div>
  );
}

/* ========================= SHARED ========================= */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-600">{label}</div>{children}</label>;
}
function TabBtn({ active, onClick, label, icon }: { active: boolean; onClick: () => void; label: string; icon: string }) {
  return <button onClick={onClick} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${active ? "bg-violet-600 text-white shadow-sm" : "text-slate-700 hover:bg-slate-100"}`}>{icon} {label}</button>;
}
function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/admin/devbox" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-fuchsia-600 to-violet-600 text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="m16 18 6-6-6-6M8 6l-6 6 6 6" /></svg>
          </div>
          <div className="leading-tight">
            <div className="text-[15px] font-semibold text-slate-900">DevBox</div>
            <div className="text-[11px] text-slate-500">Universal Question Upload</div>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/admin" className="btn-sm border border-slate-300 bg-white text-slate-700 hover:bg-slate-50">← Admin</Link>
          <Link href="/" className="btn-sm border border-slate-300 bg-white text-slate-700 hover:bg-slate-50">Home</Link>
        </div>
      </div>
    </header>
  );
}
