"use client";

import Link from "next/link";
import { useState } from "react";
import type { CodeSolution } from "@/db/schema";

type Problem = {
  id: number;
  number: number;
  title: string;
  slug: string;
  difficulty: string;
  topic: string;
  isPyq: boolean;
  statement: string;
  constraints: string;
  inputFormat: string;
  outputFormat: string;
  sampleInput: string;
  sampleOutput: string;
  sampleExplanation: string | null;
  solutions: CodeSolution[];
  commonMistakes: string[];
  similarProblems: string[];
  proTip: string | null;
};

const LANG_ICON: Record<string, string> = {
  Python: "🐍",
  Java: "☕",
  "C++": "⚡",
  C: "🔧",
};

export default function CodingProblemClient({
  problem: p,
  prevSlug,
  nextSlug,
}: {
  problem: Problem;
  prevSlug: string | null;
  nextSlug: string | null;
}) {
  const langs = p.solutions.map((s) => s.language);
  const [lang, setLang] = useState(langs[0] ?? "Python");
  const [copied, setCopied] = useState(false);
  const sol = p.solutions.find((s) => s.language === lang) ?? p.solutions[0];

  function copyCode() {
    if (!sol) return;
    navigator.clipboard.writeText(sol.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex">
        <div className="w-1.5 shrink-0 bg-emerald-500" />
        <div className="min-w-0 flex-1 p-5">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg font-bold text-slate-400">#{p.number}</span>
            <h1 className="text-xl font-bold text-slate-900">{p.title}</h1>
            <DiffBadge d={p.difficulty} />
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-100">
              {p.topic}
            </span>
            {p.isPyq && (
              <span className="rounded-full bg-cyan-50 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-700 ring-1 ring-cyan-100">
                PYQ
              </span>
            )}
          </div>

          {/* Statement */}
          <div className="mt-6">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Problem Statement
            </div>
            <p className="mt-2 text-[15px] leading-relaxed text-slate-700">{p.statement}</p>
          </div>

          {/* Constraints */}
          <div className="mt-4 rounded-xl bg-blue-50 px-4 py-3 text-sm leading-relaxed text-blue-800">
            {p.constraints.split("\n").map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>

          {/* IO blocks */}
          <DarkBlock title="Input Format" body={p.inputFormat} />
          <DarkBlock title="Output Format" body={p.outputFormat} />
          <DarkBlock title="Sample Input" body={p.sampleInput} mono />
          <DarkBlock title="Sample Output" body={p.sampleOutput} mono />

          {p.sampleExplanation && (
            <p className="mt-3 text-sm text-slate-600">{p.sampleExplanation}</p>
          )}

          {/* Solution */}
          <div className="mt-8">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Solution
            </div>

            {/* Language tabs */}
            <div className="mt-3 flex flex-wrap gap-2">
              {p.solutions.map((s) => {
                const active = s.language === lang;
                return (
                  <button
                    key={s.language}
                    onClick={() => setLang(s.language)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition ${
                      active
                        ? "bg-blue-600 text-white shadow-sm"
                        : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <span>{LANG_ICON[s.language] ?? "💻"}</span>
                    {s.language}
                  </button>
                );
              })}
            </div>

            {sol && (
              <>
                <div className="relative mt-3 overflow-hidden rounded-xl bg-slate-900">
                  <button
                    onClick={copyCode}
                    className="absolute right-2 top-2 rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur hover:bg-white/20"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <pre className="overflow-x-auto p-4 pr-16 font-mono text-[13px] leading-relaxed text-cyan-100">
                    <code>{sol.code}</code>
                  </pre>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-violet-50 px-3 py-1 text-[11px] font-semibold text-violet-700 ring-1 ring-violet-100">
                    Time: {sol.timeComplexity}
                  </span>
                  <span className="rounded-full bg-violet-50 px-3 py-1 text-[11px] font-semibold text-violet-700 ring-1 ring-violet-100">
                    Space: {sol.spaceComplexity}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {sol.explanation}
                </p>
              </>
            )}
          </div>

          {/* Common mistakes */}
          {p.commonMistakes.length > 0 && (
            <div className="mt-8">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Common Mistakes
              </div>
              <ul className="mt-2 divide-y divide-slate-100">
                {p.commonMistakes.map((m, i) => (
                  <li key={i} className="flex items-start gap-2 py-2.5 text-sm text-slate-700">
                    <span className="mt-0.5 text-amber-500">!</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Similar */}
          {p.similarProblems.length > 0 && (
            <div className="mt-6">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Similar Problems
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {p.similarProblems.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Pro tip */}
          {p.proTip && (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
              <span className="mr-1">🔥</span>
              <span className="font-bold">Pro Tip:</span> {p.proTip}
            </div>
          )}

          {/* Nav */}
          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
            {prevSlug ? (
              <Link href={`/coding/${prevSlug}`} className="text-sm font-semibold text-blue-600 hover:underline">
                ← Previous
              </Link>
            ) : (
              <span />
            )}
            <Link href="/coding" className="text-sm font-semibold text-slate-500 hover:underline">
              All problems
            </Link>
            {nextSlug ? (
              <Link href={`/coding/${nextSlug}`} className="text-sm font-semibold text-blue-600 hover:underline">
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

function DarkBlock({ title, body, mono }: { title: string; body: string; mono?: boolean }) {
  return (
    <div className="mt-3 rounded-xl bg-slate-900 px-4 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </div>
      <pre
        className={`mt-1.5 whitespace-pre-wrap text-[13px] leading-relaxed text-cyan-200 ${
          mono ? "font-mono" : ""
        }`}
      >
        {body}
      </pre>
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
