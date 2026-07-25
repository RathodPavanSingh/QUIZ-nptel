import Link from "next/link";
import { db } from "@/db";
import { programmingQuestions, codingProblems } from "@/db/schema";
import { sql, asc } from "drizzle-orm";
import { ensureSeeded } from "@/db/seed";
import { PracticeNav } from "@/components/PracticeNav";

export const dynamic = "force-dynamic";

export default async function ProgrammingListPage() {
  await ensureSeeded().catch(() => {});

  const rows = await db
    .select()
    .from(programmingQuestions)
    .orderBy(asc(programmingQuestions.id));

  const [p] = await db.select({ c: sql<number>`COUNT(*)::int` }).from(programmingQuestions);
  const [c] = await db.select({ c: sql<number>`COUNT(*)::int` }).from(codingProblems);

  return (
    <main className="min-h-screen bg-slate-50">
      <PracticeNav active="programming" progCount={p.c} codingCount={c.c} />
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-slate-900">Programming</h1>
          <p className="text-sm text-slate-600">
            Code-output MCQs · Data types, functions, loops & more
          </p>
        </div>

        <div className="space-y-3">
          {rows.map((q) => (
            <Link
              key={q.id}
              href={`/programming/${q.id}`}
              className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-slate-400">{q.number}</span>
                <h2 className="text-base font-bold text-slate-900">{q.title}</h2>
                <DifficultyBadge d={q.difficulty} />
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
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-slate-600">{q.questionText}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(q.tags ?? []).slice(0, 4).map((t) => (
                  <span key={t} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                    {t}
                  </span>
                ))}
                {q.year && (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                    {q.year}
                  </span>
                )}
              </div>
            </Link>
          ))}
          {rows.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              No programming questions yet.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function DifficultyBadge({ d }: { d: string }) {
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
