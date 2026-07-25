import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { practiceQuestions } from "@/db/schema";
import { and, asc, eq, sql } from "drizzle-orm";
import { ensureSeeded } from "@/db/seed";
import { PracticeNav } from "@/components/PracticeNav";
import { PracticeQuizList } from "@/components/PracticeQuizList";
import { APTITUDE_TABS } from "@/lib/practice-meta";

export const dynamic = "force-dynamic";

const VALID = new Set(APTITUDE_TABS.map((t) => t.key));

export default async function AptitudeSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!VALID.has(section as (typeof APTITUDE_TABS)[number]["key"])) return notFound();

  await ensureSeeded().catch(() => {});

  const rows = await db
    .select()
    .from(practiceQuestions)
    .where(and(eq(practiceQuestions.category, "aptitude"), eq(practiceQuestions.section, section)))
    .orderBy(asc(practiceQuestions.id));

  // counts per aptitude section
  const countsRaw = await db
    .select({
      section: practiceQuestions.section,
      c: sql<number>`COUNT(*)::int`,
    })
    .from(practiceQuestions)
    .where(eq(practiceQuestions.category, "aptitude"))
    .groupBy(practiceQuestions.section);
  const counts = Object.fromEntries(countsRaw.map((r) => [r.section, r.c]));
  const aptTotal = countsRaw.reduce((s, r) => s + r.c, 0);

  const dto = rows.map((r) => ({
    id: r.id,
    number: r.number,
    difficulty: r.difficulty,
    topic: r.topic,
    timeSeconds: r.timeSeconds,
    isPyq: r.isPyq,
    year: r.year,
    questionText: r.questionText,
    options: r.options as string[],
    correctIndex: r.correctIndex,
    explanation: r.explanation,
    tags: (r.tags as string[]) ?? [],
  }));

  return (
    <main className="min-h-screen bg-slate-50">
      <PracticeNav active="aptitude" aptCount={aptTotal} />
      <div className="mx-auto max-w-3xl px-4 py-5">
        {/* Section tabs */}
        <div className="mb-5 flex gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
          {APTITUDE_TABS.map((t) => {
            const active = t.key === section;
            return (
              <Link
                key={t.key}
                href={`/aptitude/${t.key}`}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                  active ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>{t.emoji}</span>
                {t.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    active ? "bg-white/20" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {counts[t.key] ?? 0}
                </span>
              </Link>
            );
          })}
        </div>

        <PracticeQuizList questions={dto} />
      </div>
    </main>
  );
}
