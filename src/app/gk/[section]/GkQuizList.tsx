"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { GK_SECTIONS } from "@/db/seed-gk";

type GkQ = {
  id: number;
  number: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  timeSeconds: number;
  isPyq: boolean;
  year: number;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  tags: string[];

  questionType: "mcq" | "msq" | "numerical";
  correctIndices: number[] | null;
  numericalAnswer: number | null;
  numericalTolerance: number | null;
  numericalUnit: string | null;
};

export function GkQuizList({
  questions,
  activeSection,
  counts,
}: {
  questions: GkQ[];
  activeSection: string;
  counts: Record<string, number>;
}) {
  const [search, setSearch] = useState("");
  const [diff, setDiff] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [pyqOnly, setPyqOnly] = useState<boolean>(false);
  const [openId, setOpenId] = useState<number | null>(questions[0]?.id ?? null);

  const [selectedOpt, setSelectedOpt] = useState<Record<number, number | null>>({});
  const [selectedOptsMulti, setSelectedOptsMulti] = useState<Record<number, Set<number>>>({});
  const [numericalInput, setNumericalInput] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});

  const years = useMemo(() => {
    return Array.from(new Set(questions.map((q) => q.year))).sort((a, b) => b - a);
  }, [questions]);

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      if (diff !== "all" && q.difficulty !== diff) return false;
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
  }, [questions, diff, selectedYear, pyqOnly, search]);

  function handleMultiSelect(qid: number, idx: number) {
    setSelectedOptsMulti((prev) => {
      const next = new Set(prev[qid] ?? []);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return { ...prev, [qid]: next };
    });
  }

  function checkMultiCorrect(q: GkQ): boolean {
    const userSel = selectedOptsMulti[q.id] ?? new Set();
    const correctSet = new Set(q.correctIndices ?? []);
    if (userSel.size !== correctSet.size) return false;
    for (const v of userSel) {
      if (!correctSet.has(v)) return false;
    }
    return true;
  }

  return (
    <div className="space-y-5">
      {/* GK Section Tabs */}
      <div className="flex gap-1.5 overflow-x-auto rounded-3xl border border-slate-200 bg-white p-2 shadow-sm scrollbar-none">
        {GK_SECTIONS.map((t) => {
          const active = t.key === activeSection;
          return (
            <Link
              key={t.key}
              href={`/gk/${t.key}`}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-5 py-3 text-sm font-semibold transition ${
                active
                  ? "bg-linear-to-br from-blue-600 to-indigo-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span>{t.emoji}</span>
              <span>{t.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {counts[t.key] ?? 150}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Filters (with PYQ, Year, and Level selection) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        {/* Search */}
        <div className="relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search GK questions..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-4 pr-10 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        </div>

        {/* Level, Year & PYQ Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex flex-col text-xs font-semibold text-slate-500">
            Difficulty Level
            <select
              value={diff}
              onChange={(e) => setDiff(e.target.value)}
              className="mt-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">All Levels</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </label>

          <label className="flex flex-col text-xs font-semibold text-slate-500">
            PYQ Year
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="mt-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">All Years</option>
              {years.map((y) => (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              ))}
            </select>
          </label>

          {/* PYQ Toggle */}
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
            Showing {filtered.length} of {questions.length} questions
          </span>
        </div>
      </div>

      {/* GK Questions */}
      <div className="space-y-4">
        {filtered.map((q) => {
          const isOpen = openId === q.id;
          const isSub = submitted[q.id] ?? false;

          let isUserCorrect = false;
          if (isSub) {
            if (q.questionType === "numerical") {
              const uVal = parseFloat(numericalInput[q.id] ?? "");
              isUserCorrect = q.numericalAnswer != null && Math.abs(uVal - q.numericalAnswer) <= (q.numericalTolerance ?? 0);
            } else if (q.questionType === "msq") {
              isUserCorrect = checkMultiCorrect(q);
            } else {
              isUserCorrect = selectedOpt[q.id] === q.correctIndex;
            }
          }

          const badgeColor =
            q.questionType === "mcq"
              ? "bg-blue-600"
              : q.questionType === "msq"
              ? "bg-emerald-600"
              : "bg-amber-500";

          return (
            <div
              key={q.id}
              className={`overflow-hidden rounded-2xl border transition shadow-sm ${
                isOpen ? "border-blue-200 bg-white" : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex">
                <div className="w-1.5 shrink-0 bg-blue-600" />
                <div className="min-w-0 flex-1 p-4 sm:p-5">
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : q.id)}
                    className="w-full text-left"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-bold text-slate-600">
                        {q.number}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 font-semibold ${
                          q.difficulty === "Easy"
                            ? "bg-emerald-50 text-emerald-700"
                            : q.difficulty === "Medium"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {q.difficulty}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 font-bold text-white ${badgeColor}`}>
                        {q.questionType.toUpperCase()}
                      </span>
                      <span className="rounded-full bg-blue-50 px-2.5 py-0.5 font-semibold text-blue-700">
                        {q.topic}
                      </span>
                      {q.isPyq && (
                        <span className="rounded-full bg-cyan-100 px-2.5 py-0.5 font-bold text-cyan-700">
                          PYQ
                        </span>
                      )}
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-semibold text-slate-600">
                        Year {q.year}
                      </span>
                    </div>
                    <p className="mt-3 text-[15px] font-bold leading-relaxed text-slate-900">
                      {q.questionText}
                    </p>
                  </button>

                  {isOpen && (
                    <div className="mt-4">
                      {/* Numerical input */}
                      {q.questionType === "numerical" ? (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                            Your Numerical Answer {q.numericalUnit ? `(${q.numericalUnit})` : ""}
                          </label>
                          <div className="mt-2 flex items-center gap-2">
                            <input
                              type="number"
                              disabled={isSub}
                              value={numericalInput[q.id] ?? ""}
                              onChange={(e) => setNumericalInput((p) => ({ ...p, [q.id]: e.target.value }))}
                              placeholder="Type numeric value"
                              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none"
                            />
                            {q.numericalUnit && (
                              <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold">
                                {q.numericalUnit}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        /* Options (MCQ or MSQ) */
                        <div className="space-y-2.5">
                          {q.options.map((opt, oi) => {
                            const isMsq = q.questionType === "msq";
                            const isSel = isMsq
                              ? (selectedOptsMulti[q.id] ?? new Set()).has(oi)
                              : selectedOpt[q.id] === oi;

                            const isCorrectOpt = isSub && (isMsq ? (q.correctIndices ?? []).includes(oi) : oi === q.correctIndex);
                            const isWrong = isSub && isSel && !isCorrectOpt;

                            return (
                              <button
                                key={oi}
                                type="button"
                                disabled={isSub}
                                onClick={() => {
                                  if (isMsq) handleMultiSelect(q.id, oi);
                                  else setSelectedOpt((prev) => ({ ...prev, [q.id]: oi }));
                                }}
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
                                  {isMsq && isSel ? "✓" : String.fromCharCode(65 + oi)}
                                </span>
                                <span>{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Submit */}
                      <button
                        type="button"
                        onClick={() => setSubmitted((prev) => ({ ...prev, [q.id]: true }))}
                        disabled={
                          isSub ||
                          (q.questionType === "numerical" && !numericalInput[q.id]) ||
                          (q.questionType === "msq" && (selectedOptsMulti[q.id] ?? new Set()).size === 0) ||
                          (q.questionType === "mcq" && selectedOpt[q.id] === undefined)
                        }
                        className={`mt-4 rounded-2xl px-6 py-2.5 text-sm font-bold shadow-sm transition ${
                          isSub
                            ? "cursor-not-allowed bg-slate-200 text-slate-500"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {isSub ? (isUserCorrect ? "✓ Correct!" : "✗ Incorrect") : "Submit Answer"}
                      </button>

                      {/* Explanation */}
                      {isSub && (
                        <div
                          className={`mt-4 rounded-xl border p-4 text-sm ${
                            isUserCorrect
                              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                              : "border-rose-200 bg-rose-50 text-rose-900"
                          }`}
                        >
                          <div className="font-bold">
                            {isUserCorrect ? "Correct!" : "Not quite."} Answer:{" "}
                            {q.questionType === "numerical" ? (
                              <span className="font-semibold">{q.numericalAnswer}</span>
                            ) : q.questionType === "msq" ? (
                              <span className="font-semibold">
                                {q.correctIndices?.map((idx) => String.fromCharCode(65 + idx)).join(", ")}
                              </span>
                            ) : (
                              <span className="font-semibold">
                                {String.fromCharCode(65 + q.correctIndex)}) {q.options[q.correctIndex]}
                              </span>
                            )}
                          </div>
                          <p className="mt-1.5 leading-relaxed opacity-90">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            No GK questions match the selected filters.
          </div>
        )}
      </div>
    </div>
  );
}
