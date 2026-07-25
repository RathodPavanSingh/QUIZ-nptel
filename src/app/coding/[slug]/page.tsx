import { notFound } from "next/navigation";
import { db } from "@/db";
import { codingProblems, programmingQuestions } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { PracticeNav } from "@/components/PracticeNav";
import CodingProblemClient from "./CodingProblemClient";
import type { CodeSolution } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function CodingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [prob] = await db
    .select()
    .from(codingProblems)
    .where(eq(codingProblems.slug, slug))
    .limit(1);
  if (!prob) return notFound();

  const [p] = await db.select({ c: sql<number>`COUNT(*)::int` }).from(programmingQuestions);
  const [c] = await db.select({ c: sql<number>`COUNT(*)::int` }).from(codingProblems);

  const all = await db
    .select({ slug: codingProblems.slug, number: codingProblems.number })
    .from(codingProblems)
    .orderBy(codingProblems.number);
  const idx = all.findIndex((r) => r.slug === prob.slug);
  const prevSlug = idx > 0 ? all[idx - 1].slug : null;
  const nextSlug = idx < all.length - 1 ? all[idx + 1].slug : null;

  return (
    <main className="min-h-screen bg-slate-50">
      <PracticeNav active="coding" progCount={p.c} codingCount={c.c} />
      <div className="mx-auto max-w-3xl px-4 py-5">
        <CodingProblemClient
          problem={{
            id: prob.id,
            number: prob.number,
            title: prob.title,
            slug: prob.slug,
            difficulty: prob.difficulty,
            topic: prob.topic,
            isPyq: prob.isPyq,
            statement: prob.statement,
            constraints: prob.constraints,
            inputFormat: prob.inputFormat,
            outputFormat: prob.outputFormat,
            sampleInput: prob.sampleInput,
            sampleOutput: prob.sampleOutput,
            sampleExplanation: prob.sampleExplanation,
            solutions: (prob.solutions as CodeSolution[]) ?? [],
            commonMistakes: (prob.commonMistakes as string[]) ?? [],
            similarProblems: (prob.similarProblems as string[]) ?? [],
            proTip: prob.proTip,
          }}
          prevSlug={prevSlug}
          nextSlug={nextSlug}
        />
      </div>
    </main>
  );
}
