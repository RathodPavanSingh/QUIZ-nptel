"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type AdminCourse = {
  id: number;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  totalUnits: number;
  questionCount: number;
};

type AdminQuestion = {
  id: number;
  courseId: number;
  courseName: string;
  courseSlug: string;
  year: number;
  unit: number;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string | null;
};

type Tab = "single" | "bulk" | "file" | "general" | "manage";

const ICON_OPTIONS = ["cloud", "network", "chart", "activity", "brain", "database"];
const COLOR_OPTIONS = ["blue", "sky", "green", "gray", "purple", "amber", "rose", "indigo"];

export default function AdminPanel() {
  const [tab, setTab] = useState<Tab>("single");
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  const loadCourses = async () => {
    const r = await fetch("/api/admin/courses");
    const d = await r.json();
    setCourses(d.courses ?? []);
  };

  useEffect(() => {
    let active = true;

    async function fetchInitialCourses() {
      const r = await fetch("/api/admin/courses");
      const d = await r.json();
      if (active) setCourses(d.courses ?? []);
    }

    fetchInitialCourses();
    return () => {
      active = false;
    };
  }, []);

  const showToast = (t: { type: "ok" | "err"; msg: string }) => {
    setToast(t);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 text-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <div className="leading-tight">
              <div className="text-[15px] font-semibold text-slate-900">NPTEL Quiz</div>
              <div className="text-[11px] text-slate-500">Admin Panel</div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/devbox"
              className="inline-flex items-center gap-1.5 rounded-lg bg-linear-to-r from-fuchsia-600 to-violet-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:from-fuchsia-500 hover:to-violet-500"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
              </svg>
              Open DevBox
            </Link>
            <Link
              href="/"
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              ← Back to Site
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 pb-24">
        {/* Title */}
        <div className="rounded-2xl border border-slate-200 bg-linear-to-br from-slate-900 to-slate-800 p-6 text-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-amber-400 to-orange-500 text-slate-900">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Admin Panel</h1>
              <p className="text-sm text-slate-300">
                Upload MCQ questions, create new question sets, and manage content.
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatBox label="Courses" value={courses.length} />
            <StatBox
              label="Total Questions"
              value={courses.reduce((s, c) => s + c.questionCount, 0)}
            />
            <StatBox label="Active Sets" value={courses.filter((c) => c.questionCount > 0).length} />
            <StatBox label="Empty Sets" value={courses.filter((c) => c.questionCount === 0).length} />
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <TabButton active={tab === "single"} onClick={() => setTab("single")} label="Add MCQ" icon="plus" />
          <TabButton active={tab === "file"} onClick={() => setTab("file")} label="Upload PDF / DOC" icon="file" />
          <TabButton active={tab === "bulk"} onClick={() => setTab("bulk")} label="Bulk JSON / CSV" icon="upload" />
          <TabButton active={tab === "general"} onClick={() => setTab("general")} label="New Question Set" icon="folder" />
          <TabButton active={tab === "manage"} onClick={() => setTab("manage")} label="Manage" icon="list" />
        </div>

        {/* Panels */}
        <div className="mt-5">
          {tab === "single" && (
            <SingleForm courses={courses} onSaved={() => { loadCourses(); showToast({ type: "ok", msg: "Question added successfully." }); }} onError={(m) => showToast({ type: "err", msg: m })} />
          )}
          {tab === "bulk" && (
            <BulkForm courses={courses} onSaved={(n) => { loadCourses(); showToast({ type: "ok", msg: `${n} question(s) uploaded.` }); }} onError={(m) => showToast({ type: "err", msg: m })} />
          )}
          {tab === "file" && (
            <FileUploadForm courses={courses} onSaved={(n) => { loadCourses(); showToast({ type: "ok", msg: `${n} question(s) saved from file.` }); }} onError={(m) => showToast({ type: "err", msg: m })} />
          )}
          {tab === "general" && (
            <NewCourseForm onSaved={() => { loadCourses(); showToast({ type: "ok", msg: "Question set created." }); }} onError={(m) => showToast({ type: "err", msg: m })} />
          )}
          {tab === "manage" && (
            <ManagePanel courses={courses} onChange={loadCourses} onToast={showToast} />
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2">
          <div
            className={`rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg ${
              toast.type === "ok" ? "bg-emerald-600" : "bg-rose-600"
            }`}
          >
            {toast.msg}
          </div>
        </div>
      )}
    </main>
  );
}

/* ------------------------- Sub Components ------------------------- */

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-white/10 px-3 py-3 ring-1 ring-white/10">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-[11px] uppercase tracking-wide text-slate-300">{label}</div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: "plus" | "upload" | "folder" | "list" | "file";
}) {
  const icons = {
    file: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3" />
      </svg>
    ),
    plus: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
    upload: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
      </svg>
    ),
    folder: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
    list: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
      </svg>
    ),
  } as const;
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
        active
          ? "bg-blue-600 text-white shadow-sm"
          : "text-slate-700 hover:bg-slate-100"
      }`}
    >
      {icons[icon]}
      {label}
    </button>
  );
}

/* ---- Single MCQ Form ---- */

function SingleForm({
  courses,
  onSaved,
  onError,
}: {
  courses: AdminCourse[];
  onSaved: () => void;
  onError: (m: string) => void;
}) {
  const [courseId, setCourseId] = useState<number | "">("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [unit, setUnit] = useState(1);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [explanation, setExplanation] = useState("");
  const [saving, setSaving] = useState(false);

  const selectedCourse = useMemo(
    () => courses.find((c) => c.id === courseId),
    [courses, courseId],
  );

  function updateOption(i: number, v: string) {
    setOptions((prev) => prev.map((o, idx) => (idx === i ? v : o)));
  }

  function addOption() {
    if (options.length < 8) setOptions((p) => [...p, ""]);
  }

  function removeOption(i: number) {
    if (options.length <= 2) return;
    setOptions((prev) => prev.filter((_, idx) => idx !== i));
    if (correctIndex >= options.length - 1) setCorrectIndex(0);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!courseId) return onError("Please select a course.");
    const trimmedOpts = options.map((o) => o.trim()).filter((o) => o.length > 0);
    if (trimmedOpts.length < 2) return onError("Provide at least 2 options.");
    if (correctIndex >= trimmedOpts.length) return onError("Correct index invalid.");
    if (!questionText.trim()) return onError("Question text is required.");
    setSaving(true);
    try {
      const res = await fetch("/api/admin/questions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          courseId,
          year,
          unit,
          questionText: questionText.trim(),
          options: trimmedOpts,
          correctIndex,
          explanation: explanation.trim() || null,
        }),
      });
      const d = await res.json();
      if (!res.ok || d.error) {
        onError(d.error ?? "Failed to save");
      } else if (d.failed > 0) {
        onError(d.errors?.[0]?.error ?? "Validation failed");
      } else {
        // reset form except course/year/unit
        setQuestionText("");
        setOptions(["", "", "", ""]);
        setCorrectIndex(0);
        setExplanation("");
        onSaved();
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <h2 className="text-lg font-bold text-slate-900">Add a single MCQ question</h2>
      <p className="mt-1 text-sm text-slate-600">
        Fill in the details and save. The question will appear in the selected course quiz immediately.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <Field label="Course *">
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value ? parseInt(e.target.value, 10) : "")}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="">-- Select Course --</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Year *">
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value, 10) || 0)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            min={1900}
            max={3000}
          />
        </Field>
        <Field label={`Unit * ${selectedCourse ? `(max ${selectedCourse.totalUnits})` : ""}`}>
          <input
            type="number"
            value={unit}
            onChange={(e) => setUnit(parseInt(e.target.value, 10) || 1)}
            min={1}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Question *">
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            rows={3}
            placeholder="e.g. What is the primary purpose of a Cloud Service Provider?"
            className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </Field>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-800">Options *</div>
          <button
            type="button"
            onClick={addOption}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            + Add option
          </button>
        </div>
        <div className="space-y-2">
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <input
                  type="radio"
                  name="correct"
                  checked={correctIndex === i}
                  onChange={() => setCorrectIndex(i)}
                  className="h-4 w-4 accent-emerald-600"
                />
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                    correctIndex === i
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {String.fromCharCode(65 + i)}
                </span>
              </label>
              <input
                value={opt}
                onChange={(e) => updateOption(i, e.target.value)}
                placeholder={`Option ${String.fromCharCode(65 + i)}`}
                className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(i)}
                  className="rounded-lg border border-slate-300 bg-white p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                  aria-label="Remove option"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="mt-1 text-xs text-slate-500">
          Select the radio next to the correct option.
        </div>
      </div>

      <div className="mt-4">
        <Field label="Explanation (optional)">
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            rows={2}
            placeholder="Explain why the correct answer is correct."
            className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </Field>
      </div>

      <div className="mt-5 flex items-center justify-end gap-3">
        <button
          type="submit"
          disabled={saving}
          className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition ${
            saving ? "cursor-not-allowed bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {saving ? "Saving…" : "Save Question"}
        </button>
      </div>
    </form>
  );
}

/* ---- Bulk Upload Form ---- */

function BulkForm({
  courses,
  onSaved,
  onError,
}: {
  courses: AdminCourse[];
  onSaved: (n: number) => void;
  onError: (m: string) => void;
}) {
  const [courseId, setCourseId] = useState<number | "">("");
  const [defaultYear, setDefaultYear] = useState(new Date().getFullYear());
  const [defaultUnit, setDefaultUnit] = useState(1);
  const [format, setFormat] = useState<"json" | "csv">("json");
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  const jsonExample = `[
  {
    "year": 2024,
    "unit": 1,
    "questionText": "What is 2 + 2?",
    "options": ["3", "4", "5", "6"],
    "correctIndex": 1,
    "explanation": "Basic arithmetic."
  },
  {
    "year": 2024,
    "unit": 2,
    "questionText": "Which is a cloud provider?",
    "options": ["AWS", "Nginx", "Redis", "Bash"],
    "correctIndex": 0
  }
]`;

  const csvExample = `year,unit,question,option1,option2,option3,option4,correctIndex,explanation
2024,1,What is 2 + 2?,3,4,5,6,1,Basic arithmetic
2024,2,Which is a cloud provider?,AWS,Nginx,Redis,Bash,0,`;

  function loadExample() {
    setText(format === "json" ? jsonExample : csvExample);
  }

  function parseCsv(input: string) {
    const lines = input.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) throw new Error("CSV needs a header + at least 1 row");
    // Robust CSV parser handling quoted commas
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
    const header = parseLine(lines[0]).map((h) => h.toLowerCase());
    const yearI = header.indexOf("year");
    const unitI = header.indexOf("unit");
    const qI = header.findIndex((h) => h === "question" || h === "questiontext");
    const optCols: number[] = [];
    for (let i = 1; i <= 8; i++) {
      const idx = header.indexOf(`option${i}`);
      if (idx >= 0) optCols.push(idx);
    }
    const ciI = header.findIndex((h) => h === "correctindex" || h === "correct");
    const exI = header.indexOf("explanation");

    if (qI < 0 || ciI < 0 || optCols.length < 2)
      throw new Error("CSV must include question, at least option1/option2, and correctIndex");

    const items = [] as Array<{
      year: number;
      unit: number;
      questionText: string;
      options: string[];
      correctIndex: number;
      explanation?: string | null;
    }>;
    for (let r = 1; r < lines.length; r++) {
      const cols = parseLine(lines[r]);
      const options = optCols
        .map((c) => cols[c] ?? "")
        .filter((o) => o.length > 0);
      const item = {
        year: yearI >= 0 ? parseInt(cols[yearI], 10) : defaultYear,
        unit: unitI >= 0 ? parseInt(cols[unitI], 10) : defaultUnit,
        questionText: cols[qI],
        options,
        correctIndex: parseInt(cols[ciI], 10),
        explanation: exI >= 0 ? cols[exI] || null : null,
      };
      items.push(item);
    }
    return items;
  }

  async function submit() {
    if (!courseId) return onError("Select a course.");
    if (!text.trim()) return onError("Paste your data first.");
    setSaving(true);
    try {
      let items: unknown[];
      if (format === "json") {
        const parsed = JSON.parse(text);
        items = Array.isArray(parsed) ? parsed : [parsed];
      } else {
        items = parseCsv(text);
      }
      // Apply defaults & attach courseId
      const questions = items.map((raw) => {
        const q = raw as Record<string, unknown>;
        return {
          courseId,
          year: (q.year as number) ?? defaultYear,
          unit: (q.unit as number) ?? defaultUnit,
          questionText: (q.questionText ?? q.question) as string,
          options: q.options as string[],
          correctIndex: q.correctIndex as number,
          explanation: (q.explanation as string) ?? null,
        };
      });

      const res = await fetch("/api/admin/questions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ questions }),
      });
      const d = await res.json();
      if (!res.ok || d.error) {
        onError(d.error ?? "Upload failed");
      } else {
        onSaved(d.inserted ?? 0);
        if (d.failed > 0) {
          onError(`${d.failed} row(s) had validation errors; ${d.inserted} inserted.`);
        }
        if ((d.inserted ?? 0) > 0) setText("");
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : "Parse error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-bold text-slate-900">Bulk Upload Questions</h2>
      <p className="mt-1 text-sm text-slate-600">
        Paste JSON or CSV containing multiple MCQs to upload them all at once.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <Field label="Course *">
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value ? parseInt(e.target.value, 10) : "")}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="">-- Select Course --</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Default Year">
          <input
            type="number"
            value={defaultYear}
            onChange={(e) => setDefaultYear(parseInt(e.target.value, 10) || 0)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </Field>
        <Field label="Default Unit">
          <input
            type="number"
            value={defaultUnit}
            onChange={(e) => setDefaultUnit(parseInt(e.target.value, 10) || 1)}
            min={1}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </Field>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
          <button
            onClick={() => setFormat("json")}
            className={`rounded-md px-3 py-1 text-xs font-semibold ${
              format === "json" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
            }`}
          >
            JSON
          </button>
          <button
            onClick={() => setFormat("csv")}
            className={`rounded-md px-3 py-1 text-xs font-semibold ${
              format === "csv" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
            }`}
          >
            CSV
          </button>
        </div>
        <div className="flex items-center gap-2">
          <label className="cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
            Upload File
            <input
              type="file"
              className="hidden"
              accept={format === "json" ? ".json,application/json" : ".csv,text/csv"}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const reader = new FileReader();
                reader.onload = () => setText(String(reader.result ?? ""));
                reader.readAsText(f);
              }}
            />
          </label>
          <button
            onClick={loadExample}
            type="button"
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Load Example
          </button>
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={14}
        spellCheck={false}
        placeholder={format === "json" ? jsonExample : csvExample}
        className="mt-3 w-full resize-y rounded-lg border border-slate-300 bg-slate-950 px-3 py-2 font-mono text-xs text-emerald-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      />

      <div className="mt-4 flex items-center justify-end">
        <button
          onClick={submit}
          disabled={saving}
          className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition ${
            saving ? "cursor-not-allowed bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {saving ? "Uploading…" : "Upload Questions"}
        </button>
      </div>
    </div>
  );
}

/* ---- File Upload (PDF / DOCX / TXT) Form ---- */

type ParsedItem = {
  questionText: string;
  options: string[];
  correctIndex: number; // -1 = not detected
  explanation: string | null;
  year: number;
  unit: number;
  include: boolean;
};

function FileUploadForm({
  courses,
  onSaved,
  onError,
}: {
  courses: AdminCourse[];
  onSaved: (n: number) => void;
  onError: (m: string) => void;
}) {
  const [courseId, setCourseId] = useState<number | "">("");
  const [defaultYear, setDefaultYear] = useState(new Date().getFullYear());
  const [defaultUnit, setDefaultUnit] = useState(1);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<ParsedItem[]>([]);
  const [rawPreview, setRawPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const includedCount = items.filter((i) => i.include).length;
  const missingAnswer = items.filter((i) => i.include && i.correctIndex < 0).length;

  async function handleFile(file: File) {
    setUploading(true);
    setRawPreview(null);
    setFileName(file.name);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const d = await res.json();
      if (!res.ok || d.error) {
        onError(d.error ?? "Failed to process file");
        setItems([]);
        return;
      }
      const parsed = (d.questions ?? []) as Array<{
        questionText: string;
        options: string[];
        correctIndex: number;
        explanation: string | null;
      }>;
      if (parsed.length === 0) {
        setItems([]);
        setRawPreview(d.rawPreview ?? null);
        onError("No MCQs detected in the file. Check the format guide below.");
        return;
      }
      setItems(
        parsed.map((p) => ({
          ...p,
          year: defaultYear,
          unit: defaultUnit,
          include: true,
        })),
      );
    } catch (err) {
      onError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function updateItem(idx: number, patch: Partial<ParsedItem>) {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }

  function applyDefaultsToAll() {
    setItems((prev) => prev.map((it) => ({ ...it, year: defaultYear, unit: defaultUnit })));
  }

  async function saveAll() {
    if (!courseId) return onError("Select a course first.");
    const toSave = items.filter((i) => i.include);
    if (toSave.length === 0) return onError("No questions selected.");
    const invalid = toSave.filter((i) => i.correctIndex < 0);
    if (invalid.length > 0)
      return onError(`${invalid.length} question(s) have no correct answer marked. Fix them or untick them.`);

    setSaving(true);
    try {
      const res = await fetch("/api/admin/questions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          questions: toSave.map((i) => ({
            courseId,
            year: i.year,
            unit: i.unit,
            questionText: i.questionText,
            options: i.options,
            correctIndex: i.correctIndex,
            explanation: i.explanation,
          })),
        }),
      });
      const d = await res.json();
      if (!res.ok || d.error) {
        onError(d.error ?? "Save failed");
      } else {
        onSaved(d.inserted ?? 0);
        if (d.failed > 0) onError(`${d.failed} question(s) failed validation.`);
        if ((d.inserted ?? 0) > 0) {
          setItems([]);
          setFileName(null);
        }
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-bold text-slate-900">Upload MCQ Questions from PDF / Document</h2>
        <p className="mt-1 text-sm text-slate-600">
          Upload a <b>PDF</b>, <b>Word (.docx)</b>, or <b>TXT</b> file. Questions, options,
          answers, and explanations are detected automatically. Review the preview, fix anything, then save.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <Field label="Course *">
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value ? parseInt(e.target.value, 10) : "")}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="">-- Select Course --</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Default Year">
            <input
              type="number"
              value={defaultYear}
              onChange={(e) => setDefaultYear(parseInt(e.target.value, 10) || 0)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </Field>
          <Field label="Default Unit">
            <input
              type="number"
              value={defaultUnit}
              min={1}
              onChange={(e) => setDefaultUnit(parseInt(e.target.value, 10) || 1)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </Field>
        </div>

        {/* Dropzone */}
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer.files?.[0];
            if (f) handleFile(f);
          }}
          className={`mt-5 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
            dragOver
              ? "border-blue-500 bg-blue-50"
              : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50"
          }`}
        >
          <input
            type="file"
            className="hidden"
            accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.currentTarget.value = "";
            }}
          />
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            {uploading ? (
              <svg className="h-6 w-6 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="9" strokeOpacity={0.25} />
                <path d="M21 12a9 9 0 0 0-9-9" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
              </svg>
            )}
          </div>
          <div className="text-sm font-semibold text-slate-800">
            {uploading
              ? "Extracting questions…"
              : fileName
              ? `Selected: ${fileName} — click to replace`
              : "Click to browse or drag & drop your file here"}
          </div>
          <div className="text-xs text-slate-500">PDF, DOCX, or TXT · up to 15 MB</div>
        </label>

        {/* Format guide */}
        <details className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <summary className="cursor-pointer font-semibold text-slate-800">
            📄 Supported document format (click to view)
          </summary>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs leading-relaxed text-emerald-200">{`Q1. What is the capital of France?
A) London
B) Paris
C) Berlin
D) Madrid
Answer: B
Explanation: Paris is the capital of France.

Q2. Which planet is known as the Red Planet?
(a) Venus
(b) Mars
(c) Jupiter
(d) Saturn
Ans: b`}</pre>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-slate-600">
            <li>Questions can start with <b>Q1.</b>, <b>1.</b>, <b>1)</b>, or <b>Question 1:</b></li>
            <li>Options can use <b>A)</b> <b>a.</b> <b>(b)</b> <b>(i)</b> or bullets</li>
            <li>Answer line: <b>Answer: B</b>, <b>Ans: (c)</b>, or the full option text</li>
            <li>Explanation / Solution lines are optional</li>
            <li>Scanned (image-only) PDFs are not supported — text must be selectable</li>
          </ul>
        </details>

        {rawPreview && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="text-sm font-semibold text-amber-800">
              Extracted text preview (no MCQs detected):
            </div>
            <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded-lg bg-white p-3 text-xs text-slate-600">
              {rawPreview}
            </pre>
          </div>
        )}
      </div>

      {/* Preview & edit parsed questions */}
      {items.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Preview — {items.length} question(s) detected
              </h3>
              <p className="text-xs text-slate-600">
                {includedCount} selected
                {missingAnswer > 0 && (
                  <span className="ml-2 font-semibold text-amber-600">
                    ⚠ {missingAnswer} missing correct answer — click an option to mark it
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={applyDefaultsToAll}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Apply Year/Unit to All
              </button>
              <button
                onClick={saveAll}
                disabled={saving || includedCount === 0}
                className={`rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition ${
                  saving || includedCount === 0
                    ? "cursor-not-allowed bg-blue-300"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {saving ? "Saving…" : `Save ${includedCount} Question(s)`}
              </button>
            </div>
          </div>

          <ul className="mt-4 space-y-4">
            {items.map((it, idx) => (
              <li
                key={idx}
                className={`rounded-xl border p-4 transition ${
                  !it.include
                    ? "border-slate-200 bg-slate-50 opacity-60"
                    : it.correctIndex < 0
                    ? "border-amber-300 bg-amber-50/50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={it.include}
                    onChange={(e) => updateItem(idx, { include: e.target.checked })}
                    className="mt-1 h-4 w-4 accent-blue-600"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-700">
                        Q{idx + 1}
                      </span>
                      <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-600">
                        Year
                        <input
                          type="number"
                          value={it.year}
                          onChange={(e) => updateItem(idx, { year: parseInt(e.target.value, 10) || 0 })}
                          className="w-20 rounded-md border border-slate-300 px-2 py-0.5 text-xs"
                        />
                      </label>
                      <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-600">
                        Unit
                        <input
                          type="number"
                          value={it.unit}
                          min={1}
                          onChange={(e) => updateItem(idx, { unit: parseInt(e.target.value, 10) || 1 })}
                          className="w-16 rounded-md border border-slate-300 px-2 py-0.5 text-xs"
                        />
                      </label>
                      {it.correctIndex < 0 && it.include && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700">
                          No answer marked
                        </span>
                      )}
                    </div>

                    <textarea
                      value={it.questionText}
                      onChange={(e) => updateItem(idx, { questionText: e.target.value })}
                      rows={2}
                      className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-900 outline-none focus:border-blue-500"
                    />

                    <div className="mt-2 space-y-1.5">
                      {it.options.map((opt, oi) => (
                        <div key={oi} className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateItem(idx, { correctIndex: oi })}
                            title="Mark as correct"
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition ${
                              it.correctIndex === oi
                                ? "bg-emerald-600 text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-emerald-100"
                            }`}
                          >
                            {String.fromCharCode(65 + oi)}
                          </button>
                          <input
                            value={opt}
                            onChange={(e) =>
                              updateItem(idx, {
                                options: it.options.map((o, i2) => (i2 === oi ? e.target.value : o)),
                              })
                            }
                            className={`flex-1 rounded-lg border px-3 py-1.5 text-sm outline-none focus:border-blue-500 ${
                              it.correctIndex === oi
                                ? "border-emerald-300 bg-emerald-50 font-semibold text-emerald-900"
                                : "border-slate-300 bg-white text-slate-800"
                            }`}
                          />
                        </div>
                      ))}
                    </div>

                    {it.explanation !== null && (
                      <input
                        value={it.explanation}
                        onChange={(e) => updateItem(idx, { explanation: e.target.value })}
                        placeholder="Explanation (optional)"
                        className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 outline-none focus:border-blue-500"
                      />
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex justify-end">
            <button
              onClick={saveAll}
              disabled={saving || includedCount === 0}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition ${
                saving || includedCount === 0
                  ? "cursor-not-allowed bg-blue-300"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {saving ? "Saving…" : `Save ${includedCount} Question(s)`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---- New Course / General Set Form ---- */

function NewCourseForm({
  onSaved,
  onError,
}: {
  onSaved: () => void;
  onError: (m: string) => void;
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("cloud");
  const [color, setColor] = useState("blue");
  const [totalUnits, setTotalUnits] = useState(12);
  const [saving, setSaving] = useState(false);

  function autoSlug(v: string) {
    return v
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return onError("Name is required.");
    const finalSlug = slug.trim() ? autoSlug(slug) : autoSlug(name);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          slug: finalSlug,
          description: description.trim(),
          icon,
          color,
          totalUnits,
        }),
      });
      const d = await res.json();
      if (!res.ok || d.error) {
        onError(d.error ?? "Failed");
      } else {
        setName("");
        setSlug("");
        setDescription("");
        onSaved();
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <h2 className="text-lg font-bold text-slate-900">Create a New Question Set</h2>
      <p className="mt-1 text-sm text-slate-600">
        Add a new course / topic / general set. You can then upload questions for it under the Add MCQ or Bulk Upload tab.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Name *">
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!slug) setSlug(autoSlug(e.target.value));
            }}
            placeholder="e.g. General Knowledge"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </Field>
        <Field label="Slug (URL)">
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="general-knowledge"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Description">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Short description shown on the course card."
            className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </Field>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Field label="Icon">
          <select
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            {ICON_OPTIONS.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Color">
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            {COLOR_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Total Units">
          <input
            type="number"
            value={totalUnits}
            min={1}
            max={30}
            onChange={(e) => setTotalUnits(parseInt(e.target.value, 10) || 1)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </Field>
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition ${
            saving ? "cursor-not-allowed bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {saving ? "Creating…" : "Create Question Set"}
        </button>
      </div>
    </form>
  );
}

/* ---- Manage Panel ---- */

function ManagePanel({
  courses,
  onChange,
  onToast,
}: {
  courses: AdminCourse[];
  onChange: () => void;
  onToast: (t: { type: "ok" | "err"; msg: string }) => void;
}) {
  const [selectedCourse, setSelectedCourse] = useState<number | "">("");
  const [items, setItems] = useState<AdminQuestion[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!selectedCourse) {
      setItems([]);
      return;
    }
    setLoading(true);
    const r = await fetch(`/api/admin/questions?courseId=${selectedCourse}&limit=200`);
    const d = await r.json();
    setItems(d.questions ?? []);
    setLoading(false);
  }, [selectedCourse]);

  useEffect(() => {
    if (!selectedCourse) return;
    const timer = setTimeout(() => {
      load();
    }, 0);
    return () => clearTimeout(timer);
  }, [load, selectedCourse]);

  async function deleteQuestion(id: number) {
    if (!confirm("Delete this question?")) return;
    const r = await fetch(`/api/admin/questions/${id}`, { method: "DELETE" });
    if (r.ok) {
      onToast({ type: "ok", msg: "Question deleted." });
      load();
      onChange();
    } else {
      onToast({ type: "err", msg: "Failed to delete." });
    }
  }

  async function deleteCourse(id: number) {
    if (!confirm("Delete this course and ALL its questions?")) return;
    const r = await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });
    if (r.ok) {
      onToast({ type: "ok", msg: "Course deleted." });
      onChange();
      if (selectedCourse === id) {
        setSelectedCourse("");
        setItems([]);
      }
    } else {
      onToast({ type: "err", msg: "Failed to delete." });
    }
  }

  return (
    <div className="space-y-4">
      {/* Courses list */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Manage Question Sets</h2>
        <p className="mt-1 text-sm text-slate-600">
          View, filter, and delete existing courses and questions.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-3">Course</th>
                <th className="py-2 pr-3">Slug</th>
                <th className="py-2 pr-3">Units</th>
                <th className="py-2 pr-3">Questions</th>
                <th className="py-2 pr-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500">
                    No courses yet — create one under &quot;New Question Set&quot;.
                  </td>
                </tr>
              )}
              {courses.map((c) => (
                <tr key={c.id} className="border-b border-slate-100 last:border-0">
                  <td className="py-2 pr-3 font-semibold text-slate-800">{c.name}</td>
                  <td className="py-2 pr-3 text-slate-500">{c.slug}</td>
                  <td className="py-2 pr-3 text-slate-700">{c.totalUnits}</td>
                  <td className="py-2 pr-3 text-slate-700">{c.questionCount}</td>
                  <td className="py-2 pr-3 text-right">
                    <button
                      onClick={() => setSelectedCourse(c.id)}
                      className="mr-2 rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      View
                    </button>
                    <button
                      onClick={() => deleteCourse(c.id)}
                      className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Questions list */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base font-bold text-slate-900">Questions</h3>
          <div className="flex items-center gap-2">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value ? parseInt(e.target.value, 10) : "")}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="">All (select a course)</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-8 text-center text-sm text-slate-500">Loading…</div>
        ) : items.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-500">
            {selectedCourse ? "No questions yet in this course." : "Select a course to see its questions."}
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {items.map((q) => (
              <li key={q.id} className="py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 font-semibold text-blue-700">
                        {q.courseName}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-600">
                        Year {q.year}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-600">
                        Unit {q.unit}
                      </span>
                    </div>
                    <div className="mt-1 text-sm font-semibold text-slate-900">
                      Q: {q.questionText}
                    </div>
                    <ol className="mt-1 list-inside space-y-0.5 text-xs text-slate-600">
                      {q.options.map((o, i) => (
                        <li
                          key={i}
                          className={
                            i === q.correctIndex ? "font-semibold text-emerald-700" : ""
                          }
                        >
                          {String.fromCharCode(65 + i)}. {o}
                          {i === q.correctIndex && " ✓"}
                        </li>
                      ))}
                    </ol>
                  </div>
                  <button
                    onClick={() => deleteQuestion(q.id)}
                    className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
        {label}
      </div>
      {children}
    </label>
  );
}
