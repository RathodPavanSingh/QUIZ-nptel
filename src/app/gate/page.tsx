import Link from "next/link";
import { db } from "@/db";
import { practiceQuestions } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { ensureSeeded } from "@/db/seed";
import { PracticeNav } from "@/components/PracticeNav";
import { GATE_COURSES } from "@/lib/practice-meta";

export const dynamic = "force-dynamic";

export default async function GateIndexPage() {
  await ensureSeeded().catch(() => {});

  const countsRaw = await db
    .select({
      section: practiceQuestions.section,
      c: sql<number>`COUNT(*)::int`,
    })
    .from(practiceQuestions)
    .where(eq(practiceQuestions.category, "gate"))
    .groupBy(practiceQuestions.section);
  const counts = Object.fromEntries(countsRaw.map((r) => [r.section, r.c]));
  const total = countsRaw.reduce((s, r) => s + r.c, 0);

  return (
    <main className="min-h-screen bg-slate-50">
      <PracticeNav active="gate" gateCount={total} />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6 text-center">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
            GATE EE · 150 questions each
          </div>
          <h1 className="text-3xl font-bold text-slate-900">GATE Courses</h1>
          <p className="mt-2 text-sm text-slate-600">
            Five core electrical engineering subjects with previous-year style MCQs.
          </p>
        </div>

        <div className="grid gap-3">
          {GATE_COURSES.map((g) => (
            <Link
              key={g.key}
              href={g.href}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br ${g.color} text-lg font-bold text-white shadow-sm`}
              >
                {(counts[g.key] ?? 150).toString()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">{g.label}</h2>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                    {counts[g.key] ?? 0} Q
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-600">{g.desc}</p>
                <div className="mt-2 text-sm font-semibold text-blue-600 group-hover:underline">
                  Practice →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
