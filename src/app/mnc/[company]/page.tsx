import { notFound } from "next/navigation";
import { db } from "@/db";
import { practiceQuestions, codingProblems } from "@/db/schema";
import { and, asc, eq } from "drizzle-orm";
import { ensureSeeded } from "@/db/seed";
import { MNC_COMPANIES } from "@/db/seed-mnc";
import type { CodeSolution } from "@/db/schema";
import MncClient from "./MncClient";

export const dynamic = "force-dynamic";

export default async function MncCompanyPage({
  params,
}: {
  params: Promise<{ company: string }>;
}) {
  const { company } = await params;
  const meta = MNC_COMPANIES.find((c) => c.slug === company);
  if (!meta) return notFound();

  await ensureSeeded().catch(() => {});

  const mcqRows = await db
    .select()
    .from(practiceQuestions)
    .where(and(eq(practiceQuestions.category, "mnc"), eq(practiceQuestions.section, company)))
    .orderBy(asc(practiceQuestions.id));

  const codingRows = await db
    .select()
    .from(codingProblems)
    .where(eq(codingProblems.exam, `mnc-${company}`))
    .orderBy(asc(codingProblems.number));

  const mcqs = mcqRows.map((r) => ({
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
  }));

  const coding = codingRows.map((r) => ({
    id: r.id,
    number: r.number,
    title: r.title,
    slug: r.slug,
    difficulty: r.difficulty as "Easy" | "Medium" | "Hard",
    topic: r.topic,
    statement: r.statement,
    constraints: r.constraints,
    inputFormat: r.inputFormat,
    outputFormat: r.outputFormat,
    sampleInput: r.sampleInput,
    sampleOutput: r.sampleOutput,
    sampleExplanation: r.sampleExplanation,
    solutions: (r.solutions as CodeSolution[]) ?? [],
    commonMistakes: (r.commonMistakes as string[]) ?? [],
    similarProblems: (r.similarProblems as string[]) ?? [],
    proTip: r.proTip,
  }));

  // Per-track counts for the sub-tab badges
  const trackCounts: Record<string, number> = { aptitude: 0, reasoning: 0, general: 0, programming: 0 };
  for (const m of mcqs) {
    const tag = m.tags.find((t) => t.startsWith("track:"));
    if (tag) trackCounts[tag.slice(6)] = (trackCounts[tag.slice(6)] ?? 0) + 1;
  }

  return (
    <MncClient
      meta={{
        slug: meta.slug,
        name: meta.name,
        mark: meta.mark,
        tagline: meta.tagline,
        accent: meta.accent,
        ink: meta.ink,
        tint: meta.tint,
      }}
      mcqs={mcqs}
      coding={coding}
      trackCounts={trackCounts}
    />
  );
}
