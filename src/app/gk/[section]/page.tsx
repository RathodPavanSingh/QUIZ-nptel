import { notFound } from "next/navigation";
import { db } from "@/db";
import { practiceQuestions } from "@/db/schema";
import { and, asc, eq, sql } from "drizzle-orm";
import { ensureSeeded } from "@/db/seed";
import { PracticeNav } from "@/components/PracticeNav";
import { GkQuizList } from "./GkQuizList";
import { GK_SECTIONS } from "@/db/seed-gk";

export const dynamic = "force-dynamic";

const VALID_SECTIONS = new Set(GK_SECTIONS.map((s) => s.key));

export default async function GkSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!VALID_SECTIONS.has(section)) return notFound();

  await ensureSeeded().catch(() => {});

  const rows = await db
    .select()
    .from(practiceQuestions)
    .where(and(eq(practiceQuestions.category, "gk"), eq(practiceQuestions.section, section)))
    .orderBy(asc(practiceQuestions.id));

  // counts per section
  const countsRaw = await db
    .select({
      section: practiceQuestions.section,
      c: sql<number>`COUNT(*)::int`,
    })
    .from(practiceQuestions)
    .where(eq(practiceQuestions.category, "gk"))
    .groupBy(practiceQuestions.section);

  const counts = Object.fromEntries(countsRaw.map((r) => [r.section, r.c]));
  const gkTotal = countsRaw.reduce((s, r) => s + r.c, 0);

  const mapped = rows.map((r) => ({
    id: r.id,
    number: r.number,
    difficulty: r.difficulty as "Easy" | "Medium" | "Hard",
    topic: r.topic,
    timeSeconds: r.timeSeconds,
    isPyq: r.isPyq,
    year: r.year ?? 2025,
    questionText: r.questionText,
    options: r.options as string[],
    correctIndex: r.correctIndex,
    explanation: r.explanation ?? "",
    tags: (r.tags as string[]) ?? [],
    questionType: (r.questionType ?? "mcq") as "mcq" | "msq" | "numerical",
    correctIndices: r.correctIndices as number[] | null,
    numericalAnswer: r.numericalAnswer,
    numericalTolerance: r.numericalTolerance,
    numericalUnit: r.numericalUnit,
  }));

  const activeMeta = GK_SECTIONS.find((s) => s.key === section)!;

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <PracticeNav active="gk" gkCount={gkTotal} />
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              General Knowledge Examination Board
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-0.5">
              {activeMeta.emoji} {activeMeta.label}
            </h1>
          </div>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
            {mapped.length} Questions
          </span>
        </div>

        <GkQuizList
          questions={mapped}
          activeSection={section}
          counts={counts}
        />
      </div>
    </main>
  );
}
