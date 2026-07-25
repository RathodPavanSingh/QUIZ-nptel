import { notFound } from "next/navigation";
import { db } from "@/db";
import { practiceQuestions } from "@/db/schema";
import { and, asc, eq, sql } from "drizzle-orm";
import { ensureSeeded } from "@/db/seed";
import { PracticeNav } from "@/components/PracticeNav";
import { GovtQuizList } from "./GovtQuizList";

export const dynamic = "force-dynamic";

const VALID_SECTIONS = new Set(["upsc", "nda", "ssc"]);

export default async function GovtSectionPage({
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
    .where(and(eq(practiceQuestions.category, "govt"), eq(practiceQuestions.section, section)))
    .orderBy(asc(practiceQuestions.id));

  // counts per section
  const countsRaw = await db
    .select({
      section: practiceQuestions.section,
      c: sql<number>`COUNT(*)::int`,
    })
    .from(practiceQuestions)
    .where(eq(practiceQuestions.category, "govt"))
    .groupBy(practiceQuestions.section);

  const counts = Object.fromEntries(countsRaw.map((r) => [r.section, r.c]));
  const govtTotal = countsRaw.reduce((s, r) => s + r.c, 0);

  const mapped = rows.map((r) => ({
    id: r.id,
    number: r.number,
    difficulty: r.difficulty as "Easy" | "Medium" | "Hard",
    topic: r.topic,
    timeSeconds: r.timeSeconds,
    isPyq: r.isPyq,
    year: r.year ?? 2024,
    questionText: r.questionText,
    options: r.options as string[],
    correctIndex: r.correctIndex,
    explanation: r.explanation ?? "",
    tags: (r.tags as string[]) ?? [],
  }));

  const sectionTitles = {
    upsc: "UPSC Civil Service",
    nda: "NDA",
    ssc: "SSC CGL Tier I",
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <PracticeNav active="govt" govtCount={govtTotal} />
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {sectionTitles[section as keyof typeof sectionTitles]}
            </h1>
            <p className="text-sm text-slate-600">
              Practice previous year questions with key explanations
            </p>
          </div>
          <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
            {mapped.length} Questions
          </span>
        </div>

        <GovtQuizList
          questions={mapped}
          activeSection={section as "upsc" | "nda" | "ssc"}
          counts={counts}
        />
      </div>
    </main>
  );
}
