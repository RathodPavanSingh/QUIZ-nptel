import Link from "next/link";
import { db } from "@/db";
import { practiceQuestions, codingProblems } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { ensureSeeded } from "@/db/seed";
import { PracticeNav } from "@/components/PracticeNav";
import { MNC_COMPANIES } from "@/db/seed-mnc";

export const dynamic = "force-dynamic";

export default async function MncHubPage() {
  await ensureSeeded().catch(() => {});

  const mcqCounts = await db
    .select({ section: practiceQuestions.section, c: sql<number>`COUNT(*)::int` })
    .from(practiceQuestions)
    .where(eq(practiceQuestions.category, "mnc"))
    .groupBy(practiceQuestions.section);
  const mcqByCo = Object.fromEntries(mcqCounts.map((r) => [r.section, r.c]));

  const codingCounts = await db
    .select({ exam: codingProblems.exam, c: sql<number>`COUNT(*)::int` })
    .from(codingProblems)
    .where(sql`${codingProblems.exam} LIKE 'mnc-%'`)
    .groupBy(codingProblems.exam);
  const codingByCo = Object.fromEntries(
    codingCounts.map((r) => [r.exam?.replace("mnc-", "") ?? "", r.c]),
  );

  const totalMcq = mcqCounts.reduce((s, r) => s + r.c, 0);
  const totalCoding = codingCounts.reduce((s, r) => s + r.c, 0);

  const [feature, ...rest] = MNC_COMPANIES;

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <PracticeNav active="mnc" mncCount={totalMcq + totalCoding} />

      {/* Editorial masthead */}
      <section className="border-b border-slate-200 bg-linear-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-6xl px-5 pt-10 pb-8 sm:px-8">
          <div className="grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-end">
            <div>
              <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <span className="mnc-live-dot inline-block h-1.5 w-1.5 rounded-full bg-rose-500" />
                  Live Hiring Season
                </span>
                <span className="text-slate-300">|</span>
                <span>Vol. XI · 2026</span>
              </div>
              <h1 className="mt-4 font-serif text-5xl font-black leading-[0.95] tracking-tight text-slate-900 sm:text-7xl">
                The MNC
                <br />
                <span className="italic text-slate-500">placement</span> desk.
              </h1>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-slate-600">
                Eleven companies. One hundred questions apiece — split across
                <em className="font-semibold not-italic text-slate-800"> aptitude</em>,
                <em className="font-semibold not-italic text-slate-800"> reasoning</em>,
                <em className="font-semibold not-italic text-slate-800"> verbal</em>,
                <em className="font-semibold not-italic text-slate-800"> programming</em>,
                and a ten-problem <em className="font-semibold not-italic text-slate-800">coding round</em>
                {" "}with Python, Java, C++ and C solutions. Past-year patterns, filtered by year and PYQ.
              </p>
            </div>

            <dl className="grid grid-cols-3 gap-4 border-l border-slate-200 pl-6 md:border-l-0 md:pl-0">
              <Stat n={MNC_COMPANIES.length} label="Companies" />
              <Stat n={totalMcq} label="MCQs" />
              <Stat n={totalCoding} label="Coding" />
            </dl>
          </div>

          {/* Marquee ticker */}
          <div className="relative mt-10 overflow-hidden border-y border-slate-200 py-3">
            <div className="mnc-marquee flex w-max gap-10 whitespace-nowrap pr-10 font-serif text-lg italic text-slate-400">
              {[...MNC_COMPANIES, ...MNC_COMPANIES].map((c, i) => (
                <span key={i} className="inline-flex items-center gap-3">
                  <span
                    className="inline-flex h-6 w-6 items-center justify-center rounded text-xs font-black not-italic text-white"
                    style={{ backgroundColor: c.accent }}
                  >
                    {c.mark}
                  </span>
                  {c.name}
                  <span className="text-slate-300">·</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature card (first company, asymmetric) */}
      <section className="mx-auto max-w-6xl px-5 pt-10 sm:px-8">
        <CompanyCard company={feature} mcq={mcqByCo[feature.slug] ?? 0} code={codingByCo[feature.slug] ?? 0} feature />
      </section>

      {/* The remaining ten, in a 2-col asymmetric grid */}
      <section className="mx-auto max-w-6xl px-5 pt-5 pb-20 sm:px-8">
        <div className="mb-6 mt-10 flex items-baseline justify-between border-b border-slate-200 pb-3">
          <h2 className="font-serif text-2xl font-bold tracking-tight text-slate-900">
            The other ten desks
          </h2>
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Sorted by hiring volume
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {rest.map((c, i) => (
            <CompanyCard
              key={c.slug}
              company={c}
              mcq={mcqByCo[c.slug] ?? 0}
              code={codingByCo[c.slug] ?? 0}
              tall={i % 3 === 0}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div>
      <div className="font-serif text-4xl font-black tabular-nums text-slate-900">{n.toLocaleString()}</div>
      <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">{label}</div>
    </div>
  );
}

function CompanyCard({
  company,
  mcq,
  code,
  feature,
  tall,
}: {
  company: (typeof MNC_COMPANIES)[number];
  mcq: number;
  code: number;
  feature?: boolean;
  tall?: boolean;
}) {
  const total = mcq + code;
  return (
    <Link
      href={`/mnc/${company.slug}`}
      className={`group relative block overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_20px_60px_-20px_rgba(15,23,42,0.25)] ${
        feature ? "p-8 md:p-10" : tall ? "p-7" : "p-6"
      }`}
    >
      {/* left accent stripe that grows on hover */}
      <span
        className="absolute left-0 top-0 h-full w-1 transition-all duration-300 group-hover:w-2"
        style={{ backgroundColor: company.accent }}
      />

      {/* tinted watermark mark on the right */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-4 -top-6 select-none font-serif text-[10rem] font-black leading-none opacity-[0.06] transition-transform duration-500 group-hover:scale-110"
        style={{ color: company.accent }}
      >
        {company.mark}
      </span>

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-sm font-black text-white shadow-sm"
              style={{ backgroundColor: company.accent }}
            >
              {company.mark}
            </span>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                MNC · Placement desk
              </div>
              <h3 className={`font-serif font-black tracking-tight text-slate-900 ${feature ? "text-4xl" : "text-2xl"}`}>
                {company.name}
              </h3>
            </div>
          </div>
          <p className={`mt-3 max-w-md text-slate-600 ${feature ? "text-base" : "text-sm"}`}>
            {company.tagline}
          </p>
        </div>
        <span
          className="inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-bold tabular-nums"
          style={{ backgroundColor: company.tint, color: company.ink }}
        >
          {total}
          <span className="font-medium opacity-70">Q</span>
        </span>
      </div>

      {/* Track breakdown — four tiny bars */}
      <div className="relative mt-6 grid grid-cols-4 gap-2">
        {[
          { k: "Apt", n: 30 },
          { k: "Rea", n: 20 },
          { k: "Gen", n: 20 },
          { k: "Prog", n: 20 },
        ].map((t) => (
          <div key={t.k} className="rounded-lg bg-slate-50 px-2 py-2 text-center ring-1 ring-slate-100">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t.k}</div>
            <div className="font-serif text-lg font-bold tabular-nums text-slate-900">{t.n}</div>
          </div>
        ))}
      </div>

      <div className="relative mt-5 flex items-center justify-between border-t border-dashed border-slate-200 pt-4 text-xs">
        <span className="flex items-center gap-3 text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: company.accent }} />
            {mcq} MCQs
          </span>
          <span className="text-slate-300">·</span>
          <span>{code} Coding</span>
        </span>
        <span
          className="inline-flex items-center gap-1 font-bold transition-transform duration-300 group-hover:translate-x-1"
          style={{ color: company.accent }}
        >
          Open desk
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-3.5 w-3.5">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
