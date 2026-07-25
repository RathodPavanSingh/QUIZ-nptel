"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Q = {
  id: number;
  year: number;
  unit: number;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string | null;
  questionType?: "mcq" | "msq" | "numerical" | "figure" | null;
  correctIndices?: number[] | null;
  numericalAnswer?: number | null;
  numericalTolerance?: number | null;
  numericalUnit?: string | null;
  imageUrl?: string | null;
};

type Answer =
  | { kind: "single"; value: number | null }
  | { kind: "multi"; values: number[] }
  | { kind: "numeric"; value: string };

export default function QuizRunner({
  slug,
  courseName,
  mode,
  year,
  units,
}: {
  slug: string;
  courseName: string;
  mode: "year-wise" | "unit-wise";
  year: string;
  units: string;
}) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Q[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams();
    if (year) p.set("year", year);
    if (units) p.set("units", units);
    fetch(`/api/courses/${slug}/questions?${p.toString()}`)
      .then((r) => r.json())
      .then((d) => setQuestions((d.questions as Q[]) ?? []))
      .catch(() => setError("Failed to load questions."));
  }, [slug, year, units]);

  const total = questions?.length ?? 0;

  function isCorrect(q: Q, a: Answer | undefined): boolean {
    if (!a) return false;
    const type = q.questionType ?? "mcq";
    if (type === "numerical") {
      if (a.kind !== "numeric" || a.value.trim() === "") return false;
      const v = parseFloat(a.value);
      if (Number.isNaN(v) || q.numericalAnswer == null) return false;
      const tol = q.numericalTolerance ?? 0;
      return Math.abs(v - q.numericalAnswer) <= tol + 1e-9;
    }
    if (type === "msq" || (type === "figure" && Array.isArray(q.correctIndices) && q.correctIndices.length > 0)) {
      if (a.kind !== "multi") return false;
      const cor = new Set(q.correctIndices ?? []);
      const sel = new Set(a.values);
      if (cor.size !== sel.size) return false;
      for (const v of cor) if (!sel.has(v)) return false;
      return true;
    }
    if (a.kind !== "single") return false;
    return a.value === q.correctIndex;
  }

  const score = useMemo(() => {
    if (!questions) return 0;
    let s = 0;
    for (let i = 0; i < questions.length; i++) {
      if (checked[i] && isCorrect(questions[i], answers[i])) s++;
    }
    return s;
  }, [questions, answers, checked]);

  const answeredTotal = useMemo(() => {
    if (!questions) return 0;
    let n = 0;
    for (let i = 0; i < questions.length; i++) if (checked[i]) n++;
    return n;
  }, [questions, checked]);

  if (error) {
    return (
      <Shell>
        <div className="mx-auto max-w-3xl px-5 py-10">
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700">
            {error}
          </div>
        </div>
      </Shell>
    );
  }
  if (!questions) {
    return (
      <Shell>
        <div className="mx-auto max-w-3xl px-5 py-10">
          <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
            Loading quiz…
          </div>
        </div>
      </Shell>
    );
  }
  if (questions.length === 0) {
    return (
      <Shell>
        <div className="mx-auto max-w-3xl px-5 py-10">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
            <div className="text-lg font-semibold text-amber-800">
              No questions found for this selection.
            </div>
            <Link
              href={`/quiz/${slug}/${mode}`}
              className="mt-4 inline-flex rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Change Filters
            </Link>
          </div>
        </div>
      </Shell>
    );
  }
  if (finished) {
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    return (
      <Shell>
        <div className="mx-auto max-w-3xl px-5 py-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <path d="M22 4 12 14.01l-3-3" />
              </svg>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-slate-900">Quiz Completed!</h2>
            <p className="mt-1 text-slate-600">{courseName} · {mode === "year-wise" ? "Year-wise" : "Unit-wise"} Practice</p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              <StatBox label="Score" value={`${score}/${total}`} tone="blue" />
              <StatBox label="Accuracy" value={`${pct}%`} tone="emerald" />
              <StatBox label="Attempted" value={`${answeredTotal}/${total}`} tone="amber" />
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => {
                  setAnswers({});
                  setChecked({});
                  setFinished(false);
                  setIdx(0);
                }}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Retry Quiz
              </button>
              <Link href={`/quiz/${slug}/${mode}`} className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Change Filters
              </Link>
              <Link href={`/course/${slug}`} className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Back to Course
              </Link>
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  const q = questions[idx];
  const type = q.questionType ?? "mcq";
  const isMulti = type === "msq" || (type === "figure" && Array.isArray(q.correctIndices) && q.correctIndices.length > 0);
  const isNumeric = type === "numerical";
  const ans = answers[idx];
  const isChk = !!checked[idx];
  const correct = isChk && isCorrect(q, ans);

  function setSingle(v: number) {
    if (isChk) return;
    setAnswers((a) => ({ ...a, [idx]: { kind: "single", value: v } }));
  }
  function toggleMulti(v: number) {
    if (isChk) return;
    setAnswers((a) => {
      const cur = (a[idx]?.kind === "multi" ? (a[idx] as { kind: "multi"; values: number[] }).values : []) as number[];
      const set = new Set(cur);
      if (set.has(v)) set.delete(v);
      else set.add(v);
      return { ...a, [idx]: { kind: "multi", values: Array.from(set).sort((a2, b) => a2 - b) } };
    });
  }
  function setNumeric(v: string) {
    if (isChk) return;
    setAnswers((a) => ({ ...a, [idx]: { kind: "numeric", value: v } }));
  }
  function hasAnswer(): boolean {
    if (!ans) return false;
    if (ans.kind === "single") return ans.value !== null;
    if (ans.kind === "multi") return ans.values.length > 0;
    return ans.value.trim().length > 0;
  }
  function check() {
    if (!hasAnswer()) return;
    setChecked((c) => ({ ...c, [idx]: true }));
  }
  function next() {
    if (idx + 1 < total) setIdx(idx + 1);
    else setFinished(true);
  }
  function prev() {
    if (idx > 0) setIdx(idx - 1);
  }

  const typeLabel =
    type === "mcq" ? "MCQ" : type === "msq" ? "MSQ" : type === "numerical" ? "Numerical" : "Figure";
  const typeTone =
    type === "mcq" ? "bg-blue-600" : type === "msq" ? "bg-emerald-600" : type === "numerical" ? "bg-amber-500" : "bg-purple-600";

  return (
    <Shell>
      <div className="mx-auto max-w-3xl px-5 py-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[15px] font-semibold text-slate-900">
              Question {idx + 1} of {total}
            </div>
            <div className="text-xs text-slate-500">
              {courseName} · {mode === "year-wise" ? "Year-wise" : "Unit-wise"}
              {year ? ` · ${year}` : ""}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm font-semibold text-slate-700">
              Score: {score}/{answeredTotal}
            </div>
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="m3 12 9-9 9 9M5 10v10h14V10" />
              </svg>
              Home
            </button>
          </div>
        </div>

        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${((idx + 1) / total) * 100}%` }} />
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="rounded-xl bg-blue-50 p-4">
            <div className="text-[15px] font-semibold text-slate-900">
              <span className="text-blue-700">Q{idx + 1}:</span> {q.questionText}
              {isMulti && (
                <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  Select all that apply
                </span>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
              <span className={`rounded-full px-2 py-0.5 font-semibold text-white ${typeTone}`}>{typeLabel}</span>
              <span className="rounded-full bg-white/70 px-2 py-0.5 font-semibold text-slate-600 ring-1 ring-slate-200">Year {q.year}</span>
              <span className="rounded-full bg-white/70 px-2 py-0.5 font-semibold text-slate-600 ring-1 ring-slate-200">Unit {q.unit}</span>
            </div>
          </div>

          {q.imageUrl && (
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              <Image
                src={q.imageUrl}
                alt="Figure"
                width={800}
                height={500}
                className="mx-auto max-h-96 w-auto object-contain"
                unoptimized
              />
            </div>
          )}

          {/* Answer input based on type */}
          {isNumeric ? (
            <div className="mt-5">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Your Answer {q.numericalUnit ? `(${q.numericalUnit})` : ""}
                </label>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="number"
                    step="any"
                    disabled={isChk}
                    value={ans && ans.kind === "numeric" ? ans.value : ""}
                    onChange={(e) => setNumeric(e.target.value)}
                    placeholder="Type numeric answer"
                    className={`flex-1 rounded-lg border px-4 py-2.5 text-base font-semibold outline-none ${
                      isChk
                        ? correct
                          ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                          : "border-rose-500 bg-rose-50 text-rose-900"
                        : "border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    }`}
                  />
                  {q.numericalUnit && (
                    <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                      {q.numericalUnit}
                    </span>
                  )}
                </div>
                {isChk && !correct && (
                  <div className="mt-2 text-xs text-rose-700">
                    Correct answer:{" "}
                    <span className="font-semibold">
                      {q.numericalAnswer}
                      {q.numericalTolerance && q.numericalTolerance > 0 ? ` ± ${q.numericalTolerance}` : ""}
                      {q.numericalUnit ? ` ${q.numericalUnit}` : ""}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-2.5">
              {q.options.map((opt, i) => {
                const sel =
                  ans?.kind === "single"
                    ? ans.value === i
                    : ans?.kind === "multi"
                    ? ans.values.includes(i)
                    : false;
                const isCorrectOpt = isChk && (isMulti ? (q.correctIndices ?? []).includes(i) : i === q.correctIndex);
                const isWrongPick = isChk && sel && !isCorrectOpt;

                return (
                  <button
                    key={i}
                    onClick={() => (isMulti ? toggleMulti(i) : setSingle(i))}
                    disabled={isChk}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-[15px] transition ${
                      isCorrectOpt
                        ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                        : isWrongPick
                        ? "border-rose-500 bg-rose-50 text-rose-900"
                        : sel
                        ? "border-blue-500 bg-blue-50 text-slate-900"
                        : "border-slate-300 bg-white text-slate-800 hover:border-slate-400"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center text-xs font-bold ${
                          isMulti ? "rounded-md" : "rounded-full"
                        } ${
                          isCorrectOpt
                            ? "bg-emerald-600 text-white"
                            : isWrongPick
                            ? "bg-rose-600 text-white"
                            : sel
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {isMulti && sel ? "✓" : String.fromCharCode(65 + i)}
                      </span>
                      <span>{opt}</span>
                    </span>
                    {isCorrectOpt && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-emerald-600">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    )}
                    {isWrongPick && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-rose-600">
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {isChk && (
            <div
              className={`mt-4 rounded-xl border p-4 text-sm ${
                correct ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-rose-200 bg-rose-50 text-rose-900"
              }`}
            >
              <div className="mb-1 font-semibold">{correct ? "Correct!" : "Not quite."}</div>
              {q.explanation && <div className="opacity-90">{q.explanation}</div>}
            </div>
          )}

          <div className="my-5 h-px bg-slate-200" />

          <button
            onClick={check}
            disabled={!hasAnswer() || isChk}
            className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-[15px] font-semibold shadow-sm transition ${
              !hasAnswer() || isChk
                ? "cursor-not-allowed bg-amber-200 text-amber-800"
                : "bg-amber-400 text-amber-950 hover:bg-amber-500"
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="M22 4 12 14.01l-3-3" />
            </svg>
            {isChk ? "Answer Checked" : "Check Answer"}
          </button>

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={prev}
              disabled={idx === 0}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-semibold shadow-sm transition ${
                idx === 0
                  ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="m15 18-6-6 6-6" />
              </svg>
              Previous
            </button>
            <button
              onClick={next}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              {idx + 1 === total ? "Finish" : "Next"}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function StatBox({ label, value, tone }: { label: string; value: string; tone: "blue" | "emerald" | "amber" }) {
  const map = {
    blue: "bg-blue-50 text-blue-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
  } as const;
  return (
    <div className={`rounded-xl px-3 py-4 ${map[tone]}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="mt-0.5 text-xs font-medium uppercase tracking-wide opacity-80">{label}</div>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 text-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <div className="leading-tight">
              <div className="text-[15px] font-semibold text-slate-900">NPTEL Quiz</div>
              <div className="text-[11px] text-slate-500">Previous Year Practice</div>
            </div>
          </Link>
        </div>
      </header>
      {children}
    </main>
  );
}
