"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PracticeNav } from "@/components/PracticeNav";

type Mcq = {
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
};

type Coding = {
  id: number;
  number: number;
  title: string;
  slug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  statement: string;
  constraints: string;
  inputFormat: string;
  outputFormat: string;
  sampleInput: string;
  sampleOutput: string;
  sampleExplanation: string | null;
  solutions: { language: string; code: string; timeComplexity: string; spaceComplexity: string; explanation: string }[];
  commonMistakes: string[];
  similarProblems: string[];
  proTip: string | null;
};

type Track = "aptitude" | "reasoning" | "general" | "programming" | "coding";

const TRACK_META: { key: Track; label: string; glyph: string }[] = [
  { key: "aptitude", label: "Aptitude", glyph: "∑" },
  { key: "reasoning", label: "Reasoning", glyph: "🧩" },
  { key: "general", label: "Verbal / General", glyph: "✎" },
  { key: "programming", label: "Programming", glyph: "</>" },
  { key: "coding", label: "Coding", glyph: "⌨" },
];

const LANG_EMOJI: Record<string, string> = {
  Python: "🐍", Java: "☕", "C++": "⚡", C: "🔧", JavaScript: "📜",
};

export default function MncClient({
  meta,
  mcqs,
  coding,
  trackCounts,
}: {
  meta: { slug: string; name: string; mark: string; tagline: string; accent: string; ink: string; tint: string };
  mcqs: Mcq[];
  coding: Coding[];
  trackCounts: Record<string, number>;
}) {
  const [subTab, setSubTab] = useState<Track>("aptitude");
  const [search, setSearch] = useState("");
  const [diff, setDiff] = useState<string>("all");
  const [year, setYear] = useState<string>("all");
  const [pyqOnly, setPyqOnly] = useState(false);

  const [openMq, setOpenMq] = useState<number | null>(null);
  const [selMq, setSelMq] = useState<Record<number, number | null>>({});
  const [subMq, setSubMq] = useState<Record<number, boolean>>({});

  const [openCode, setOpenCode] = useState<number | null>(coding[0]?.id ?? null);
  const [langByCode, setLangByCode] = useState<Record<number, string>>({});
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const years = useMemo(() => {
    const s = new Set(mcqs.map((m) => m.year));
    return Array.from(s).sort((a, b) => b - a);
  }, [mcqs]);

  const filteredMcqs = useMemo(() => {
    return mcqs.filter((m) => {
      if (!m.tags.includes(`track:${subTab}`)) return false;
      if (diff !== "all" && m.difficulty !== diff) return false;
      if (year !== "all" && String(m.year) !== year) return false;
      if (pyqOnly && !m.isPyq) return false;
      if (search.trim()) {
        const t = search.toLowerCase();
        return (
          m.questionText.toLowerCase().includes(t) ||
          m.topic.toLowerCase().includes(t) ||
          m.tags.some((tag) => tag.toLowerCase().includes(t))
        );
      }
      return true;
    });
  }, [mcqs, subTab, diff, year, pyqOnly, search]);

  const filteredCoding = useMemo(() => {
    return coding.filter((c) => {
      if (diff !== "all" && c.difficulty !== diff) return false;
      if (search.trim()) {
        const t = search.toLowerCase();
        return c.title.toLowerCase().includes(t) || c.topic.toLowerCase().includes(t) || c.statement.toLowerCase().includes(t);
      }
      return true;
    });
  }, [coding, diff, search]);

  const pyqCount = mcqs.filter((m) => m.isPyq).length;
  const tabCount = subTab === "coding" ? coding.length : trackCounts[subTab] ?? 0;

  function copy(text: string, id: number) {
    navigator.clipboard?.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1400);
    });
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <PracticeNav active="mnc" />

      {/* Company header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <Link href="/mnc" className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-500 hover:text-slate-800">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-3.5 w-3.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            All MNC desks
          </Link>
          <div className="flex items-start gap-4">
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-black text-white shadow-md"
              style={{ backgroundColor: meta.accent }}
            >
              {meta.mark}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
                Placement desk · 100 Q
              </div>
              <h1 className="font-serif text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                {meta.name}
              </h1>
              <p className="mt-1 text-sm text-slate-600">{meta.tagline}</p>
            </div>
            <div className="hidden gap-3 text-right sm:flex">
              <Stat n={mcqs.length + coding.length} label="Total" accent={meta.accent} />
              <Stat n={pyqCount} label="PYQs" />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-5">
        {/* Sub-tabs */}
        <div className="flex gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
          {TRACK_META.map((t) => {
            const active = subTab === t.key;
            const n = t.key === "coding" ? coding.length : trackCounts[t.key] ?? 0;
            return (
              <button
                key={t.key}
                onClick={() => { setSubTab(t.key); setOpenMq(null); }}
                className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-bold transition ${
                  active ? "text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
                }`}
                style={active ? { backgroundColor: meta.accent } : undefined}
              >
                <span className="text-base leading-none">{t.glyph}</span>
                {t.label}
                <span
                  className="rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums"
                  style={{
                    backgroundColor: active ? "rgba(255,255,255,0.22)" : "#F1F5F9",
                    color: active ? "#fff" : "#475569",
                  }}
                >
                  {n}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter row */}
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={subTab === "coding" ? "Search problems by title or topic…" : "Search questions by keyword or topic…"}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-4 pr-10 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Filter label="Difficulty">
              <select value={diff} onChange={(e) => setDiff(e.target.value)} className="mt-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </Filter>
            {subTab !== "coding" && (
              <Filter label="Year">
                <select value={year} onChange={(e) => setYear(e.target.value)} className="mt-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
                  <option value="all">All Years</option>
                  {years.map((y) => (
                    <option key={y} value={String(y)}>{y}</option>
                  ))}
                </select>
              </Filter>
            )}
            {subTab !== "coding" && (
              <button
                onClick={() => setPyqOnly((v) => !v)}
                className={`mt-4 inline-flex items-center gap-2 rounded-xl border px-3.5 py-1.5 text-xs font-bold transition ${
                  pyqOnly
                    ? "border-cyan-500 bg-cyan-50 text-cyan-700 ring-2 ring-cyan-100"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                <span className={`h-2 w-2 rounded-full transition ${pyqOnly ? "bg-cyan-500" : "bg-slate-300"}`} />
                Only PYQs
              </button>
            )}
            <span className="ml-auto mt-4 text-xs font-semibold tabular-nums text-slate-500">
              {subTab === "coding" ? filteredCoding.length : filteredMcqs.length} shown
            </span>
          </div>
        </div>

        {/* Lists */}
        <div className="mt-4 space-y-3.5">
          {subTab === "coding" ? (
            filteredCoding.length === 0 ? (
              <Empty />
            ) : (
              filteredCoding.map((c) => {
                const isOpen = openCode === c.id;
                const lang = langByCode[c.id] ?? c.solutions[0]?.language ?? "Python";
                const sol = c.solutions.find((s) => s.language === lang) ?? c.solutions[0];
                return (
                  <article key={c.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex">
                      <span className="w-1.5 shrink-0" style={{ backgroundColor: meta.accent }} />
                      <div className="min-w-0 flex-1 p-4 sm:p-5">
                        <button onClick={() => setOpenCode(isOpen ? null : c.id)} className="w-full text-left">
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-bold tabular-nums text-slate-600">#{c.number}</span>
                            <DiffChip d={c.difficulty} />
                            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 font-semibold text-blue-700">{c.topic}</span>
                            <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-slate-400">
                              {c.solutions.map((s) => s.language).join(" · ")}
                            </span>
                          </div>
                          <h3 className="mt-2 font-serif text-xl font-black tracking-tight text-slate-900">{c.title}</h3>
                          <p className="mt-1 line-clamp-2 text-sm text-slate-600">{c.statement}</p>
                        </button>

                        {isOpen && (
                          <div className="mt-4 space-y-4">
                            <InfoBox title="Constraints" body={c.constraints} tone="blue" />
                            <DarkBox title="Input Format" body={c.inputFormat} />
                            <DarkBox title="Output Format" body={c.outputFormat} />
                            <DarkBox title="Sample Input" body={c.sampleInput} mono />
                            <DarkBox title="Sample Output" body={c.sampleOutput} mono />
                            {c.sampleExplanation && (
                              <p className="text-sm text-slate-600">{c.sampleExplanation}</p>
                            )}

                            {/* Solutions with language toggle */}
                            <div>
                              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Solution</div>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {c.solutions.map((s) => {
                                  const active = s.language === lang;
                                  return (
                                    <button
                                      key={s.language}
                                      onClick={() => setLangByCode((m) => ({ ...m, [c.id]: s.language }))}
                                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                                        active ? "text-white shadow-sm" : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                      }`}
                                      style={active ? { backgroundColor: meta.accent } : undefined}
                                    >
                                      <span>{LANG_EMOJI[s.language] ?? "💻"}</span>
                                      {s.language}
                                    </button>
                                  );
                                })}
                              </div>
                              {sol && (
                                <div className="mt-3">
                                  <div className="relative overflow-hidden rounded-xl bg-slate-950 ring-1 ring-slate-800">
                                    <button
                                      onClick={() => copy(sol.code, c.id)}
                                      className="absolute right-2 top-2 rounded-md bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur hover:bg-white/20"
                                    >
                                      {copiedId === c.id ? "Copied!" : "Copy"}
                                    </button>
                                    <pre className="overflow-x-auto p-4 pr-16 font-mono text-[12.5px] leading-relaxed text-cyan-100">
                                      <code>{sol.code}</code>
                                    </pre>
                                  </div>
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    <Chip color="#A78BFA">Time: {sol.timeComplexity}</Chip>
                                    <Chip color="#A78BFA">Space: {sol.spaceComplexity}</Chip>
                                  </div>
                                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{sol.explanation}</p>
                                </div>
                              )}
                            </div>

                            {c.commonMistakes.length > 0 && (
                              <div>
                                <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Common mistakes</div>
                                <ul className="mt-2 space-y-1.5">
                                  {c.commonMistakes.map((m, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                      <span className="mt-0.5 font-bold text-amber-500">!</span>
                                      <span>{m}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {c.similarProblems.length > 0 && (
                              <div>
                                <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Similar problems</div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {c.similarProblems.map((s) => (
                                    <span key={s} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">{s}</span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {c.proTip && (
                              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
                                <span className="mr-1">🔥</span>
                                <span className="font-bold">Pro Tip:</span> {c.proTip}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })
            )
          ) : filteredMcqs.length === 0 ? (
            <Empty />
          ) : (
            filteredMcqs.map((q) => {
              const isOpen = openMq === q.id;
              const userSel = selMq[q.id] ?? null;
              const isSub = subMq[q.id] ?? false;
              const isCorrect = isSub && userSel === q.correctIndex;
              return (
                <article key={q.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex">
                    <span className="w-1.5 shrink-0" style={{ backgroundColor: meta.accent }} />
                    <div className="min-w-0 flex-1 p-4 sm:p-5">
                      <button onClick={() => setOpenMq(isOpen ? null : q.id)} className="w-full text-left">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-bold tabular-nums text-slate-600">{q.number}</span>
                          <DiffChip d={q.difficulty} />
                          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 font-semibold text-blue-700">{q.topic}</span>
                          {q.isPyq && (
                            <span className="rounded-full bg-cyan-100 px-2.5 py-0.5 font-bold text-cyan-700">PYQ</span>
                          )}
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-semibold tabular-nums text-slate-600">Year {q.year}</span>
                          <span className="rounded-full bg-violet-50 px-2.5 py-0.5 font-semibold tabular-nums text-violet-700">{q.timeSeconds}s</span>
                        </div>
                        <p className="mt-3 text-[15px] font-bold leading-relaxed text-slate-900">{q.questionText}</p>
                      </button>

                      {isOpen && (
                        <>
                          <div className="mt-4 space-y-2.5">
                            {q.options.map((opt, oi) => {
                              const isSel = userSel === oi;
                              const isCorrectOpt = isSub && oi === q.correctIndex;
                              const isWrong = isSub && isSel && oi !== q.correctIndex;
                              return (
                                <button
                                  key={oi}
                                  disabled={isSub}
                                  onClick={() => setSelMq((p) => ({ ...p, [q.id]: oi }))}
                                  className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-[15px] transition ${
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
                                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                      isCorrectOpt
                                        ? "bg-emerald-600 text-white"
                                        : isWrong
                                        ? "bg-rose-600 text-white"
                                        : isSel
                                        ? "bg-blue-600 text-white"
                                        : "bg-white text-slate-500 ring-1 ring-slate-200"
                                    }`}
                                  >
                                    {String.fromCharCode(65 + oi)}
                                  </span>
                                  <span>{opt}</span>
                                </button>
                              );
                            })}
                          </div>
                          <div className="mt-4">
                            <button
                              onClick={() => setSubMq((p) => ({ ...p, [q.id]: true }))}
                              disabled={userSel === null || isSub}
                              className={`rounded-2xl px-6 py-2.5 text-sm font-bold shadow-sm transition ${
                                userSel === null || isSub
                                  ? "cursor-not-allowed bg-slate-200 text-slate-500"
                                  : "text-white hover:opacity-90"
                              }`}
                              style={userSel !== null && !isSub ? { backgroundColor: meta.accent } : undefined}
                            >
                              {isSub ? (isCorrect ? "✓ Correct!" : "✗ Incorrect") : "Submit Answer"}
                            </button>
                          </div>
                          {isSub && (
                            <div className={`mt-4 rounded-xl border p-4 text-sm ${isCorrect ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-rose-200 bg-rose-50 text-rose-900"}`}>
                              <div className="font-bold">
                                {isCorrect ? "Correct!" : "Not quite."} Answer: {String.fromCharCode(65 + q.correctIndex)}) {q.options[q.correctIndex]}
                              </div>
                              <p className="mt-1.5 leading-relaxed opacity-90">{q.explanation}</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}

function Filter({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col text-xs font-bold uppercase tracking-wider text-slate-500">
      {label}
      {children}
    </label>
  );
}

function Stat({ n, label, accent }: { n: number; label: string; accent?: string }) {
  return (
    <div>
      <div className="font-serif text-3xl font-black tabular-nums" style={{ color: accent ?? "#0F172A" }}>{n}</div>
      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{label}</div>
    </div>
  );
}

function DiffChip({ d }: { d: "Easy" | "Medium" | "Hard" }) {
  const cls =
    d === "Easy" ? "bg-emerald-50 text-emerald-700"
    : d === "Medium" ? "bg-amber-50 text-amber-700"
    : "bg-rose-50 text-rose-700";
  return <span className={`rounded-full px-2.5 py-0.5 font-semibold ${cls}`}>{d}</span>;
}

function InfoBox({ title, body, tone }: { title: string; body: string; tone: "blue" }) {
  return (
    <div className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${tone === "blue" ? "bg-blue-50 text-blue-800" : ""}`}>
      <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">{title}</div>
      <div className="mt-1 whitespace-pre-wrap">{body}</div>
    </div>
  );
}

function DarkBox({ title, body, mono }: { title: string; body: string; mono?: boolean }) {
  return (
    <div className="rounded-xl bg-slate-950 px-4 py-3 ring-1 ring-slate-800">
      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{title}</div>
      <pre className={`mt-1 whitespace-pre-wrap text-[13px] leading-relaxed text-cyan-200 ${mono ? "font-mono" : ""}`}>{body}</pre>
    </div>
  );
}

function Chip({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span
      className="rounded-full px-3 py-1 text-[11px] font-bold ring-1"
      style={{ color, backgroundColor: `${color}1A`, borderColor: `${color}55` }}
    >
      {children}
    </span>
  );
}

function Empty() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
      No questions match the selected filters.
    </div>
  );
}
