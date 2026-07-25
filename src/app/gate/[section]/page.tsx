import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { practiceQuestions } from "@/db/schema";
import { and, asc, eq, sql } from "drizzle-orm";
import { ensureSeeded } from "@/db/seed";
import { PracticeNav } from "@/components/PracticeNav";
import { PracticeQuizList } from "@/components/PracticeQuizList";
import { GATE_COURSES } from "@/lib/practice-meta";

export const dynamic = "force-dynamic";

const VALID = new Set(GATE_COURSES.map((g) => g.key));

export default async function GateSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!VALID.has(section as (typeof GATE_COURSES)[number]["key"])) return notFound();

  await ensureSeeded().catch(() => {});

  const meta = GATE_COURSES.find((g) => g.key === section)!;

  const rows = await db
    .select()
    .from(practiceQuestions)
    .where(and(eq(practiceQuestions.category, "gate"), eq(practiceQuestions.section, section)))
    .orderBy(asc(practiceQuestions.id));

  const [gateTotal] = await db
    .select({ c: sql<number>`COUNT(*)::int` })
    .from(practiceQuestions)
    .where(eq(practiceQuestions.category, "gate"));

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
    questionType: r.questionType ?? "mcq",
    correctIndices: r.correctIndices,
    numericalAnswer: r.numericalAnswer,
    numericalTolerance: r.numericalTolerance,
    numericalUnit: r.numericalUnit,
  }));

  return (
    <main className="min-h-screen bg-slate-50">
      <PracticeNav active="gate" gateCount={gateTotal.c} />
      <div className="mx-auto max-w-3xl px-4 py-5">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Link href="/gate" className="text-sm font-semibold text-blue-600 hover:underline">
            ← All GATE
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-sm font-semibold text-slate-700">{meta.label}</span>
        </div>

        {/* Mini course switcher */}
        <div className="mb-5 flex gap-1.5 overflow-x-auto pb-1">
          {GATE_COURSES.map((g) => {
            const active = g.key === section;
            return (
              <Link
                key={g.key}
                href={g.href}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  active
                    ? "bg-blue-600 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                {g.short}
              </Link>
            );
          })}
        </div>

        <PracticeQuizList questions={dto} title={meta.label} />
      </div>
    </main>
  );
}
