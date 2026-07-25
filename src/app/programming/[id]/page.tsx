import { notFound } from "next/navigation";
import { db } from "@/db";
import { programmingQuestions, codingProblems } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { PracticeNav } from "@/components/PracticeNav";
import ProgQuizClient from "./ProgQuizClient";

export const dynamic = "force-dynamic";

export default async function ProgrammingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (Number.isNaN(numId)) return notFound();

  const [q] = await db
    .select()
    .from(programmingQuestions)
    .where(eq(programmingQuestions.id, numId))
    .limit(1);
  if (!q) return notFound();

  const [p] = await db.select({ c: sql<number>`COUNT(*)::int` }).from(programmingQuestions);
  const [c] = await db.select({ c: sql<number>`COUNT(*)::int` }).from(codingProblems);

  // Prev / next ids
  const all = await db
    .select({ id: programmingQuestions.id })
    .from(programmingQuestions)
    .orderBy(programmingQuestions.id);
  const idx = all.findIndex((r) => r.id === q.id);
  const prevId = idx > 0 ? all[idx - 1].id : null;
  const nextId = idx < all.length - 1 ? all[idx + 1].id : null;

  return (
    <main className="min-h-screen bg-slate-50">
      <PracticeNav active="programming" progCount={p.c} codingCount={c.c} />
      <div className="mx-auto max-w-3xl px-4 py-5">
        <ProgQuizClient
          question={{
            id: q.id,
            number: q.number,
            title: q.title,
            difficulty: q.difficulty,
            topic: q.topic,
            language: q.language,
            timeSeconds: q.timeSeconds,
            isPyq: q.isPyq,
            year: q.year,
            questionText: q.questionText,
            codeSnippet: q.codeSnippet,
            options: q.options as string[],
            correctIndex: q.correctIndex,
            explanation: q.explanation,
            tags: (q.tags as string[]) ?? [],
          }}
          prevId={prevId}
          nextId={nextId}
        />
      </div>
    </main>
  );
}
