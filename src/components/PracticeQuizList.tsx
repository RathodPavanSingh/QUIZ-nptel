"use client";

import { useMemo, useState } from "react";
import type { PracticeQDTO } from "@/lib/practice-meta";

export function PracticeQuizList({
  questions,
  title,
}: {
  questions: PracticeQDTO[];
  title?: string;
}) {
  const [search, setSearch] = useState("");
  const [diff, setDiff] = useState("all");
  const [topic, setTopic] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [pyqOnly, setPyqOnly] = useState(false);
  const [openId, setOpenId] = useState<number | null>(questions[0]?.id ?? null);

  const topics = useMemo(() => {
    const s = new Set(questions.map((q) => q.topic));
    return Array.from(s).sort();
  }, [questions]);

  const years = useMemo(() => {
    const s = new Set(questions.map((q) => q.year).filter((y): y is number => y !== null));
    return Array.from(s).sort((a, b) => b - a);
  }, [questions]);

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      if (diff !== "all" && q.difficulty !== diff) return false;
      if (topic !== "all" && q.topic !== topic) return false;
      if (selectedYear !== "all" && String(q.year) !== selectedYear) return false;
      if (pyqOnly && !q.isPyq) return false;
      if (search.trim()) {
        const t = search.toLowerCase();
        return (
          q.questionText.toLowerCase().includes(t) ||
          q.topic.toLowerCase().includes(t) ||
          q.tags.some((tag) => tag.toLowerCase().includes(t))
        );
      }
      return true;
    });
  }, [questions, diff, topic, selectedYear, pyqOnly, search]);

  return (
    <div>
      {title && <h1 className="mb-4 text-2xl font-bold text-slate-900">{title}</h1>}

      {/* Advanced Filters: Diff, Year, PYQ */}
      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        {/* Search */}
        <div className="relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions by keyword..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-4 pr-10 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        </div>

        {/* Multi selection filter row */}
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex flex-col text-xs font-semibold text-slate-500">
            Difficulty Level
            <select
              value={diff}
              onChange={(e) => setDiff(e.target.value)}
              className="mt-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 outline-none"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </label>

          <label className="flex flex-col text-xs font-semibold text-slate-500">
            Year Selection
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="mt-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 outline-none"
            >
              <option value="all">All Years</option>
              {years.map((y) => (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col text-xs font-semibold text-slate-500">
            Topics
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="mt-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 outline-none max-w-[200px]"
            >
              <option value="all">All Topics</option>
              {topics.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          {/* PYQ Switcher */}
          <button
            type="button"
            onClick={() => setPyqOnly(!pyqOnly)}
            className={`mt-4 inline-flex items-center gap-2 rounded-xl border px-4 py-1.5 text-xs font-bold transition ${
              pyqOnly
                ? "border-cyan-500 bg-cyan-50 text-cyan-700 ring-2 ring-cyan-100"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${pyqOnly ? "bg-cyan-500" : "bg-slate-300"}`} />
            Only PYQs
          </button>

          <span className="ml-auto mt-4 text-xs font-semibold text-slate-500">
            {filtered.length} questions
          </span>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filtered.map((q) => (
          <QuestionCard
            key={q.id}
            q={q}
            expanded={openId === q.id}
            onToggle={() => setOpenId(openId === q.id ? null : q.id)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            No questions match your filters.
          </div>
        )}
      </div>
    </div>
  );
}

function QuestionCard({
  q,
  expanded,
  onToggle,
}: {
  q: PracticeQDTO;
  expanded: boolean;
  onToggle: () => void;
}) {
  const type = q.questionType ?? "mcq";
  const isMsq = type === "msq";
  const isNumerical = type === "numerical";

  const [selectedSingle, setSelectedSingle] = useState<number | null>(null);
  const [selectedMulti, setSelectedMulti] = useState<number[]>([]);
  const [numericalVal, setNumericalVal] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Check answers
  const correct = useMemo(() => {
    if (!submitted) return false;
    if (isNumerical) {
      const v = parseFloat(numericalVal);
      if (isNaN(v) || q.numericalAnswer == null) return false;
      const tol = q.numericalTolerance ?? 0;
      return Math.abs(v - q.numericalAnswer) <= tol;
    }
    if (isMsq) {
      const cor = new Set(q.correctIndices ?? []);
      const sel = new Set(selectedMulti);
      if (cor.size !== sel.size) return false;
      for (const x of cor) if (!sel.has(x)) return false;
      return true;
    }
    return selectedSingle === q.correctIndex;
  }, [submitted, selectedSingle, selectedMulti, numericalVal, isMsq, isNumerical, q]);

  function handleMultiToggle(i: number) {
    if (submitted) return;
    setSelectedMulti((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i].sort((a, b) => a - b)
    );
  }

  const hasSelected = useMemo(() => {
    if (isNumerical) return numericalVal.trim().length > 0;
    if (isMsq) return selectedMulti.length > 0;
    return selectedSingle !== null;
  }, [isNumerical, isMsq, numericalVal, selectedMulti, selectedSingle]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex">
        <div className="w-1.5 shrink-0 bg-emerald-500" />
        <div className="min-w-0 flex-1 p-4 sm:p-5">
          <button type="button" onClick={onToggle} className="w-full text-left">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600">
                {q.number}
              </span>
              <DiffBadge d={q.difficulty} />
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-100">
                {q.topic}
              </span>
              {q.isPyq && (
                <span className="rounded-full bg-cyan-50 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-700 ring-1 ring-cyan-100">
                  PYQ
                </span>
              )}
              <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-[11px] font-semibold text-violet-700 ring-1 ring-violet-100">
                {q.timeSeconds} seconds
              </span>
              <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-bold text-purple-700 capitalize">
                {type}
              </span>
            </div>
            <p className="mt-3 text-[15px] font-medium leading-relaxed text-slate-900">
              {q.questionText}
            </p>
          </button>

          {expanded && (
            <>
              {/* Render MCQ / MSQ Options */}
              {!isNumerical ? (
                <div className="mt-4 space-y-2.5">
                  {q.options.map((opt, i) => {
                    const isSel = isMsq ? selectedMulti.includes(i) : selectedSingle === i;
                    const isCorrectOpt =
                      submitted &&
                      (isMsq
                        ? (q.correctIndices ?? []).includes(i)
                        : i === q.correctIndex);
                    const isWrong = submitted && isSel && !isCorrectOpt;

                    return (
                      <button
                        key={i}
                        type="button"
                        disabled={submitted}
                        onClick={() => (isMsq ? handleMultiToggle(i) : setSelectedSingle(i))}
                        className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left text-[15px] transition ${
                          isCorrectOpt
                            ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                            : isWrong
                            ? "border-rose-500 bg-rose-50 text-rose-900"
                            : isSel
                            ? "border-blue-500 bg-blue-50 text-slate-900"
                            : "border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-300"
                        }`}
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center text-xs font-bold ${
                            isMsq ? "rounded-lg" : "rounded-full"
                          } ${
                            isCorrectOpt
                              ? "bg-emerald-600 text-white"
                              : isWrong
                              ? "bg-rose-600 text-white"
                              : isSel
                              ? "bg-blue-600 text-white"
                              : "bg-white text-slate-500 ring-1 ring-slate-200"
                          }`}
                        >
                          {String.fromCharCode(65 + i)})
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* Render Numerical Input */
                <div className="mt-4 rounded-xl bg-slate-50 p-4 border border-slate-200">
                  <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Numerical Answer Input {q.numericalUnit ? `(${q.numericalUnit})` : ""}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="number"
                      step="any"
                      disabled={submitted}
                      value={numericalVal}
                      onChange={(e) => setNumericalVal(e.target.value)}
                      placeholder="Type your numeric response here..."
                      className={`flex-1 rounded-xl border px-4 py-3 text-base font-semibold outline-none ${
                        submitted
                          ? correct
                            ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                            : "border-rose-500 bg-rose-50 text-rose-900"
                          : "border-slate-300 bg-white text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      }`}
                    />
                    {q.numericalUnit && (
                      <span className="rounded-xl bg-slate-200 px-4 py-3 font-semibold text-slate-600 text-sm">
                        {q.numericalUnit}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Submit trigger button */}
              <button
                type="button"
                onClick={() => setSubmitted(true)}
                disabled={!hasSelected || submitted}
                className={`mt-5 rounded-2xl px-6 py-3 text-sm font-semibold shadow-sm transition ${
                  !hasSelected || submitted
                    ? "cursor-not-allowed bg-slate-200 text-slate-500"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {submitted ? (correct ? "✓ Correct!" : "✗ Incorrect") : "Submit Answer"}
              </button>

              {submitted && (
                <div
                  className={`mt-4 rounded-xl border p-4 text-sm ${
                    correct
                      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                      : "border-rose-200 bg-rose-50 text-rose-900"
                  }`}
                >
                  <div className="font-semibold">
                    {correct ? "Correct!" : "Not quite."} Correct Answer:{" "}
                    {isNumerical ? (
                      <span className="font-bold">
                        {q.numericalAnswer} {q.numericalUnit ?? ""}
                        {q.numericalTolerance && q.numericalTolerance > 0
                          ? ` (± ${q.numericalTolerance})`
                          : ""}
                      </span>
                    ) : isMsq ? (
                      <span className="font-bold">
                        {(q.correctIndices ?? [])
                          .map((x) => String.fromCharCode(65 + x))
                          .join(", ")}
                      </span>
                    ) : (
                      <span className="font-bold">
                        {String.fromCharCode(65 + q.correctIndex)}) {q.options[q.correctIndex]}
                      </span>
                    )}
                  </div>
                  {q.explanation && <p className="mt-1.5 opacity-90 leading-relaxed">{q.explanation}</p>}
                </div>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-4">
                {q.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600"
                  >
                    {t}
                  </span>
                ))}
                {q.year && (
                  <span className="ml-auto text-[11px] font-medium text-slate-400">Year {q.year}</span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function DiffBadge({ d }: { d: string }) {
  const map: Record<string, string> = {
    Easy: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    Medium: "bg-amber-50 text-amber-700 ring-amber-100",
    Hard: "bg-rose-50 text-rose-700 ring-rose-100",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${map[d] ?? map.Easy}`}>
      {d}
    </span>
  );
}
