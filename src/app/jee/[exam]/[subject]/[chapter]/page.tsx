import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { jeeQuestions } from "@/db/schema";
import { and, asc, eq } from "drizzle-orm";
import { ensureSeeded } from "@/db/seed";
import { PracticeNav } from "@/components/PracticeNav";
import { PracticeQuizList } from "@/components/PracticeQuizList";
import {
  JEE_EXAMS,
  JEE_SUBJECTS,
  chapterName,
  type JeeExamKey,
  type JeeSubjectKey,
} from "@/lib/jee-meta";

export const dynamic = "force-dynamic";

export default async function JeeChapterPage({
  params,
}: {
  params: Promise<{ exam: string; subject: string; chapter: string }>;
}) {
  const { exam, subject, chapter } = await params;
  const examMeta = JEE_EXAMS.find((e) => e.key === exam);
  const subjectMeta = JEE_SUBJECTS.find((s) => s.key === subject);
  if (!examMeta || !subjectMeta) return notFound();

  await ensureSeeded().catch(() => {});

  const rows = await db
    .select()
    .from(jeeQuestions)
    .where(
      and(
        eq(jeeQuestions.exam, exam as JeeExamKey),
        eq(jeeQuestions.subject, subject as JeeSubjectKey),
        eq(jeeQuestions.chapter, chapter),
      ),
    )
    .orderBy(asc(jeeQuestions.id));

  if (rows.length === 0) {
    // chapter may exist in meta but no seed (shouldn't) — still show empty
  }

  const chName = chapterName(subject as JeeSubjectKey, chapter);

  const dto = rows.map((r) => ({
    id: r.id,
    number: r.number,
    difficulty: r.difficulty,
    topic: chName,
    timeSeconds: 40,
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
      <PracticeNav active="jee" />
      <div className="mx-auto max-w-3xl px-4 py-5">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
          <Link href="/jee" className="font-semibold text-blue-600 hover:underline">
            JEE Hub
          </Link>
          <span className="text-slate-300">/</span>
          <Link href={`/jee/${exam}/${subject}`} className="font-semibold text-blue-600 hover:underline">
            {examMeta.title.replace(" 2027 Crash Course", "")}
          </Link>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-700">{subjectMeta.short}</span>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-900">{chName}</span>
        </div>

        <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
            {examMeta.title} · {subjectMeta.label}
          </div>
          <h1 className="mt-1 text-xl font-bold text-slate-900">{chName}</h1>
          <p className="mt-1 text-sm text-slate-600">{dto.length} practice questions</p>
        </div>

        <PracticeQuizList questions={dto} />
      </div>
    </main>
  );
}
