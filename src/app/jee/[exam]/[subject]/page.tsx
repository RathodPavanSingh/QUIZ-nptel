import { notFound } from "next/navigation";
import { db } from "@/db";
import { jeeQuestions } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { ensureSeeded } from "@/db/seed";
import { JEE_EXAMS, chaptersFor, type JeeExamKey, type JeeSubjectKey } from "@/lib/jee-meta";
import SubjectChapterClient from "../SubjectChapterClient";

export const dynamic = "force-dynamic";

export default async function JeeSubjectPage({
  params,
}: {
  params: Promise<{ exam: string; subject: string }>;
}) {
  const { exam, subject } = await params;
  const examMeta = JEE_EXAMS.find((e) => e.key === exam);
  if (!examMeta) return notFound();

  // Redirect invalid subjects or analysis parameter to subject list
  const activeSubject = subject === "analysis" ? examMeta.subjects[0] : (subject as JeeSubjectKey);
  const chapterDefs = chaptersFor(activeSubject);

  await ensureSeeded().catch(() => {});

  const examKey = exam as JeeExamKey;

  // 1. Fetch current subject stats
  const countsRaw = await db
    .select({
      chapter: jeeQuestions.chapter,
      c: sql<number>`COUNT(*)::int`,
    })
    .from(jeeQuestions)
    .where(and(eq(jeeQuestions.exam, examKey), eq(jeeQuestions.subject, activeSubject)))
    .groupBy(jeeQuestions.chapter);
  const counts = Object.fromEntries(countsRaw.map((r) => [r.chapter, r.c]));
  const totalQs = countsRaw.reduce((s, r) => s + r.c, 0);

  // 2. Fetch yearly breakdown for current subject chapters to build the 2026 / 2025 tags & trends
  const yearlyRaw = await db
    .select({
      chapter: jeeQuestions.chapter,
      year: jeeQuestions.year,
      c: sql<number>`COUNT(*)::int`,
    })
    .from(jeeQuestions)
    .where(and(eq(jeeQuestions.exam, examKey), eq(jeeQuestions.subject, activeSubject)))
    .groupBy(jeeQuestions.chapter, jeeQuestions.year);

  // Map of chapter -> year -> count
  const byChapterYear: Record<string, Record<number, number>> = {};
  for (const r of yearlyRaw) {
    if (r.year) {
      if (!byChapterYear[r.chapter]) byChapterYear[r.chapter] = {};
      byChapterYear[r.chapter][r.year] = r.c;
    }
  }

  // 3. Gather stats for ALL subjects in the exam (for progress bars on Analysis page)
  const allSubjectStats: Record<JeeSubjectKey, { total: number; answered: number }> = {
    physics: { total: 0, answered: 0 },
    chemistry: { total: 0, answered: 0 },
    math: { total: 0, answered: 0 },
    zoology: { total: 0, answered: 0 },
    botany: { total: 0, answered: 0 },
    "general-ability": { total: 0, answered: 0 },
  };

  const allCountsRaw = await db
    .select({
      subject: jeeQuestions.subject,
      c: sql<number>`COUNT(*)::int`,
    })
    .from(jeeQuestions)
    .where(eq(jeeQuestions.exam, examKey))
    .groupBy(jeeQuestions.subject);

  for (const r of allCountsRaw) {
    const s = r.subject as JeeSubjectKey;
    if (allSubjectStats[s]) {
      allSubjectStats[s].total = r.c;
      // We'll simulate 0 solved for fresh, but can use real solved answers later
      allSubjectStats[s].answered = 0;
    }
  }

  const subjectsWithMeta = examMeta.subjects.map((subKey) => {
    if (subKey === "physics") return { key: subKey, label: "Physics", short: "Phy", emoji: "⚛️", color: "text-orange-400" };
    if (subKey === "chemistry") return { key: subKey, label: "Chemistry", short: "Chem", emoji: "🧪", color: "text-emerald-400" };
    if (subKey === "math") return { key: subKey, label: "Mathematics", short: "Math", emoji: "∑", color: "text-sky-400" };
    if (subKey === "zoology") return { key: subKey, label: "Zoology", short: "Zoo", emoji: "🐾", color: "text-amber-400" };
    if (subKey === "botany") return { key: subKey, label: "Botany", short: "Bot", emoji: "🌿", color: "text-green-400" };
    return { key: subKey, label: "General Ability", short: "GA", emoji: "💡", color: "text-rose-400" };
  });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <SubjectChapterClient
        exam={examKey}
        initialSubject={subject === "analysis" ? "analysis" : activeSubject}
        examMeta={examMeta}
        subjects={subjectsWithMeta}
        stats={{
          total: totalQs,
          byChapter: counts,
          byChapterYear,
        }}
        allSubjectStats={allSubjectStats}
      />
    </main>
  );
}
