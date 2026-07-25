import { NextResponse } from "next/server";
import { db } from "@/db";
import { courses, questions } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const url = new URL(req.url);
  const year = url.searchParams.get("year");
  const unitsParam = url.searchParams.get("units");

  const [course] = await db.select().from(courses).where(eq(courses.slug, slug)).limit(1);
  if (!course) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const conditions = [eq(questions.courseId, course.id)];
  if (year) {
    const y = parseInt(year, 10);
    if (!Number.isNaN(y)) conditions.push(eq(questions.year, y));
  }
  const units = unitsParam
    ? unitsParam.split(",").map((u) => parseInt(u, 10)).filter((u) => !Number.isNaN(u))
    : [];
  if (units.length > 0) conditions.push(inArray(questions.unit, units));

  const rows = await db
    .select({
      id: questions.id,
      year: questions.year,
      unit: questions.unit,
      questionText: questions.questionText,
      options: questions.options,
      correctIndex: questions.correctIndex,
      explanation: questions.explanation,
      questionType: questions.questionType,
      correctIndices: questions.correctIndices,
      numericalAnswer: questions.numericalAnswer,
      numericalTolerance: questions.numericalTolerance,
      numericalUnit: questions.numericalUnit,
      imageUrl: questions.imageUrl,
    })
    .from(questions)
    .where(and(...conditions))
    .orderBy(questions.id);

  return NextResponse.json({ questions: rows, total: rows.length });
}
