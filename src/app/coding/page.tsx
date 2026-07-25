import Link from "next/link";
import { db } from "@/db";
import { codingProblems, programmingQuestions } from "@/db/schema";
import { sql, asc, isNull } from "drizzle-orm";
import { ensureSeeded } from "@/db/seed";
import { PracticeNav } from "@/components/PracticeNav";

export const dynamic = "force-dynamic";

export default async function CodingListPage() {
  await ensureSeeded().catch(() => {});

  const rows = await db
    .select()
    .from(codingProblems)
    .where(isNull(codingProblems.exam))
    .orderBy(asc(codingProblems.number));
  const [p] = await db.select({ c: sql<number>`COUNT(*)::int` }).from(programmingQuestions);
  const [c] = await db
    .select({ c: sql<number>`COUNT(*)::int` })
    .from(codingProblems)
    .where(isNull(codingProblems.exam));

  return (
    <main className="min-h-screen bg-slate-50">
      <PracticeNav active="coding" progCount={p.c} codingCount={c.c} />
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-slate-900">Coding</h1>
          <p className="text-sm text-slate-600">
            DSA problems with multi-language solutions · PYQs & practice
          </p>
        </div>

        <div className="space-y-3">
          {rows.map((prob) => (
            <Link
              key={prob.id}
              href={`/coding/${prob.slug}`}
              className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-slate-400">#{prob.number}</span>
                <h2 className="text-base font-bold text-slate-900">{prob.title}</h2>
                <DiffBadge d={prob.difficulty} />
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-100">
                  {prob.topic}
                </span>
                {prob.isPyq && (
                  <span className="rounded-full bg-cyan-50 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-700 ring-1 ring-cyan-100">
                    PYQ
                  </span>
                )}
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-slate-600">{prob.statement}</p>
            </Link>
          ))}
          {rows.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              No coding problems yet.
            </div>
          )}
        </div>
      </div>
    </main>
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
