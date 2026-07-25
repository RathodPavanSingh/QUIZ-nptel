"use client";

import Link from "next/link";
import { useState } from "react";

type Q = {
  id: number;
  number: string;
  title: string;
  difficulty: string;
  topic: string;
  language: string;
  timeSeconds: number;
  isPyq: boolean;
  year: number | null;
  questionText: string;
  codeSnippet: string | null;
  options: string[];
  correctIndex: number;
  explanation: string | null;
  tags: string[];
};

export default function ProgQuizClient({
  question: q,
  prevId,
  nextId,
}: {
  question: Q;
  prevId: number | null;
  nextId: number | null;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const correct = submitted && selected === q.correctIndex;

  function copyCode() {
    if (!q.codeSnippet) return;
    navigator.clipboard.writeText(q.codeSnippet).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Green accent bar */}
      <div className="flex">
        <div className="w-1.5 shrink-0 bg-emerald-500" />
        <div className="min-w-0 flex-1 p-5">
          {/* Badges */}
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
            <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-[11px] font-semibold text-purple-700 ring-1 ring-purple-100">
              {q.language}
            </span>
            <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-[11px] font-semibold text-violet-700 ring-1 ring-violet-100">
              {q.timeSeconds} seconds
            </span>
          </div>

          <h1 className="mt-4 text-lg font-semibold leading-snug text-slate-900">
            {q.questionText}
          </h1>

          {/* Code block */}
          {q.codeSnippet && (
            <div className="relative mt-4 overflow-hidden rounded-xl bg-slate-900">
              <button
                onClick={copyCode}
                className="absolute right-2 top-2 rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur hover:bg-white/20"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
              <pre className="overflow-x-auto p-4 pr-16 font-mono text-[13px] leading-relaxed text-cyan-100">
                <code>{q.codeSnippet}</code>
              </pre>
            </div>
          )}

          {/* Options */}
          <div className="mt-5 space-y-2.5">
            {q.options.map((opt, i) => {
              const isSel = selected === i;
              const isCorrectOpt = submitted && i === q.correctIndex;
              const isWrong = submitted && isSel && i !== q.correctIndex;
              return (
                <button
                  key={i}
                  disabled={submitted}
                  onClick={() => setSelected(i)}
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
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
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

          {/* Submit */}
          <button
            onClick={() => selected !== null && setSubmitted(true)}
            disabled={selected === null || submitted}
            className={`mt-5 w-full rounded-2xl px-4 py-3.5 text-sm font-semibold shadow-sm transition sm:w-auto sm:min-w-[180px] ${
              selected === null || submitted
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
                {correct ? "Correct!" : "Not quite."} Answer:{" "}
                {String.fromCharCode(65 + q.correctIndex)}) {q.options[q.correctIndex]}
              </div>
              {q.explanation && <p className="mt-1 opacity-90">{q.explanation}</p>}
            </div>
          )}

          {/* Tags footer */}
          <div className="mt-6 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-4">
            {q.tags.map((t) => (
              <span key={t} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                {t}
              </span>
            ))}
            {q.year && (
              <span className="ml-auto text-[11px] font-medium text-slate-400">{q.year}</span>
            )}
          </div>

          {/* Nav */}
          <div className="mt-4 flex items-center justify-between">
            {prevId ? (
              <Link href={`/programming/${prevId}`} className="text-sm font-semibold text-blue-600 hover:underline">
                ← Previous
              </Link>
            ) : (
              <span />
            )}
            <Link href="/programming" className="text-sm font-semibold text-slate-500 hover:underline">
              All questions
            </Link>
            {nextId ? (
              <Link href={`/programming/${nextId}`} className="text-sm font-semibold text-blue-600 hover:underline">
                Next →
              </Link>
            ) : (
              <span />
            )}
          </div>
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
