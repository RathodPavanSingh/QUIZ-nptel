import Link from "next/link";
import { db } from "@/db";
import { jeeQuestions } from "@/db/schema";
import { sql, eq } from "drizzle-orm";
import { ensureSeeded } from "@/db/seed";
import { PracticeNav } from "@/components/PracticeNav";
import { JEE_EXAMS } from "@/lib/jee-meta";

export const dynamic = "force-dynamic";

export default async function JeeHubPage() {
  await ensureSeeded().catch(() => {});

  const countsRaw = await db
    .select({
      exam: jeeQuestions.exam,
      c: sql<number>`COUNT(*)::int`,
    })
    .from(jeeQuestions)
    .groupBy(jeeQuestions.exam);
  const counts = Object.fromEntries(countsRaw.map((r) => [r.exam, r.c]));
  const total = countsRaw.reduce((s, r) => s + r.c, 0);

  return (
    <main className="min-h-screen bg-slate-100">
      <PracticeNav active="jee" />
      <div className="mx-auto max-w-lg px-4 py-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Engineering Entrance</h1>
          <p className="mt-1 text-sm text-slate-500">
            JEE Main · JEE Advanced · BITSAT · {total} practice questions
          </p>
        </div>

        <div className="space-y-4">
          {JEE_EXAMS.map((exam) => {
            const n = counts[exam.key] ?? 0;
            return (
              <Link
                key={exam.key}
                href={`/jee/${exam.key}`}
                className="relative block overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                {exam.badge && (
                  <span className="absolute right-4 top-4 rounded-full bg-slate-900 px-3 py-1 text-[11px] font-bold text-white">
                    {exam.badge}
                  </span>
                )}
                <div
                  className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br ${exam.accent} text-2xl font-black text-white shadow-md`}
                >
                  {exam.logo}
                </div>
                <h2 className="mt-5 text-xl font-bold text-slate-900">{exam.title}</h2>
                <p className="mt-2 text-sm text-slate-500">{exam.subtitle}</p>
                <div className="mt-4 text-xs font-semibold text-blue-600">
                  {n} questions · Phy · Chem · Math →
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
