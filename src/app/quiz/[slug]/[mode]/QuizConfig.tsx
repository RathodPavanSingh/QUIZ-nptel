"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Meta = {
  years: number[];
  availableUnits: number[];
  counts: Record<string, number>;
  total: number;
};

export default function QuizConfig({
  slug,
  courseName,
  totalUnits,
  mode,
}: {
  slug: string;
  courseName: string;
  totalUnits: number;
  mode: "year-wise" | "unit-wise";
}) {
  const router = useRouter();
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);

  const [year, setYear] = useState<string>("");
  const [units, setUnits] = useState<Set<number>>(new Set());

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/courses/${slug}/meta`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setMeta(d);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const questionCount = useMemo(() => {
    if (!meta) return 0;
    if (mode === "year-wise") {
      if (!year) return 0;
      if (units.size === 0) return meta.counts[`y:${year}`] ?? 0;
      let s = 0;
      for (const u of units) s += meta.counts[`y:${year}|u:${u}`] ?? 0;
      return s;
    } else {
      if (units.size === 0) return 0;
      let s = 0;
      for (const u of units) s += meta.counts[`u:${u}`] ?? 0;
      return s;
    }
  }, [meta, mode, year, units]);

  const canStart = questionCount > 0;
  const modeLabel = mode === "year-wise" ? "Year-wise Practice" : "Unit-wise Practice";

  function toggleUnit(u: number) {
    setUnits((prev) => {
      const next = new Set(prev);
      if (next.has(u)) next.delete(u);
      else next.add(u);
      return next;
    });
  }

  function selectAllUnits() {
    if (!meta) return;
    setUnits(new Set(meta.availableUnits.length > 0 ? meta.availableUnits : Array.from({ length: totalUnits }, (_, i) => i + 1)));
  }

  function clearUnits() {
    setUnits(new Set());
  }

  function startQuiz() {
    if (!canStart) return;
    const params = new URLSearchParams();
    if (mode === "year-wise" && year) params.set("year", year);
    if (units.size > 0) params.set("units", Array.from(units).sort((a, b) => a - b).join(","));
    router.push(`/quiz/${slug}/${mode}/take?${params.toString()}`);
  }

  const unitList = useMemo(() => Array.from({ length: totalUnits }, (_, i) => i + 1), [totalUnits]);

  return (
    <main className="min-h-screen">
      <SubHeader />
      <div className="mx-auto max-w-3xl px-5 py-6 pb-24">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          {/* Title bar */}
          <div className="rounded-xl bg-blue-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-blue-600">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              <div className="text-lg font-semibold text-slate-900">
                {courseName} <span className="text-slate-500">—</span> {modeLabel}
              </div>
            </div>
          </div>

          {/* Year selector (only year-wise) */}
          {mode === "year-wise" && (
            <div className="mt-6">
              <div className="mb-2 flex items-center gap-2 text-[15px] font-semibold text-slate-800">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-blue-600">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                Select Year
              </div>
              <div className="relative">
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 pr-10 text-[15px] text-slate-800 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="">-- Select Year --</option>
                  {meta?.years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
              {year && (
                <div className="mt-2 text-sm text-slate-600">
                  Selected:{" "}
                  <span className="ml-1 inline-block rounded-md bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">
                    {year}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Units selector */}
          {(mode === "unit-wise" || (mode === "year-wise" && year)) && (
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[15px] font-semibold text-slate-800">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-blue-600">
                    <path d="M12 2 2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  Select Units
                  {mode === "year-wise" && (
                    <span className="ml-1 text-xs font-normal text-slate-500">(optional)</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <button
                    type="button"
                    onClick={selectAllUnits}
                    className="font-semibold text-blue-600 underline-offset-2 hover:underline"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={clearUnits}
                    className="font-semibold text-slate-500 underline-offset-2 hover:underline"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {unitList.map((u) => {
                    const checked = units.has(u);
                    return (
                      <label
                        key={u}
                        className="flex cursor-pointer items-center gap-3 text-[15px] text-slate-800"
                      >
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-md border transition ${
                            checked
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {checked && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          )}
                        </span>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={checked}
                          onChange={() => toggleUnit(u)}
                        />
                        Unit {u}
                      </label>
                    );
                  })}
                </div>
              </div>

              {units.size > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-1 text-sm text-slate-600">
                  Selected:
                  {Array.from(units)
                    .sort((a, b) => a - b)
                    .map((u) => (
                      <span
                        key={u}
                        className="ml-1 inline-block rounded-md bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white"
                      >
                        Unit {u}
                      </span>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Quiz Summary */}
          <div className="mt-8 rounded-2xl bg-slate-50 p-6">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">Quiz Summary</h3>
              <div className="mt-3 space-y-1 text-[15px] text-slate-700">
                <div>
                  Course: <span className="font-bold">{courseName}</span>
                </div>
                <div>
                  Mode: <span className="font-bold">{modeLabel}</span>
                </div>
                {mode === "year-wise" && year && (
                  <div>
                    Year: <span className="font-bold">{year}</span>
                  </div>
                )}
                {units.size > 0 && (
                  <div>
                    Units: <span className="font-bold">{units.size}</span>
                  </div>
                )}
              </div>
              <div className="mt-4">
                {loading ? (
                  <span className="inline-block animate-pulse rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-500">
                    Loading…
                  </span>
                ) : (
                  <span
                    className={`inline-block rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm ${
                      canStart ? "bg-emerald-600" : "bg-amber-500"
                    }`}
                  >
                    {questionCount} Questions Available
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <Link
              href={`/course/${slug}`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Course
            </Link>
            <button
              type="button"
              disabled={!canStart}
              onClick={startQuiz}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition ${
                canStart
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "cursor-not-allowed bg-blue-300"
              }`}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M8 5v14l11-7z" />
              </svg>
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function SubHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
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
  );
}
