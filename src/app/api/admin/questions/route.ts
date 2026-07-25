import { NextResponse } from "next/server";
import { db } from "@/db";
import { courses, questions } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

type SingleInput = {
  courseId?: number;
  courseSlug?: string;
  year: number;
  unit: number;
  questionText: string;
  options?: string[];
  correctIndex?: number;
  explanation?: string | null;
  // extended
  questionType?: "mcq" | "msq" | "numerical" | "figure";
  correctIndices?: number[];
  numericalAnswer?: number | null;
  numericalTolerance?: number | null;
  numericalUnit?: string | null;
  imageUrl?: string | null;
};

async function resolveCourseId(courseId?: number, courseSlug?: string) {
  if (courseId) {
    const [c] = await db.select({ id: courses.id }).from(courses).where(eq(courses.id, courseId)).limit(1);
    return c?.id ?? null;
  }
  if (courseSlug) {
    const [c] = await db.select({ id: courses.id }).from(courses).where(eq(courses.slug, courseSlug)).limit(1);
    return c?.id ?? null;
  }
  return null;
}

function validate(q: SingleInput): string | null {
  if (typeof q.questionText !== "string" || q.questionText.trim().length === 0)
    return "questionText is required";
  if (typeof q.year !== "number" || q.year < 1900 || q.year > 3000)
    return "year must be a valid number";
  if (typeof q.unit !== "number" || q.unit < 1) return "unit must be >= 1";

  const type = q.questionType ?? "mcq";
  if (!["mcq", "msq", "numerical", "figure"].includes(type))
    return "invalid questionType";

  if (type === "numerical") {
    if (typeof q.numericalAnswer !== "number" || !isFinite(q.numericalAnswer))
      return "numericalAnswer must be a number";
    if (q.numericalTolerance != null && (typeof q.numericalTolerance !== "number" || q.numericalTolerance < 0))
      return "numericalTolerance must be >= 0";
    return null;
  }

  if (type === "figure" && !q.imageUrl) return "figure question requires imageUrl";

  // mcq | msq | figure need options
  const options = q.options ?? [];
  if (!Array.isArray(options) || options.length < 2)
    return "options must be an array of >= 2 strings";
  if (options.some((o) => typeof o !== "string"))
    return "all options must be strings";

  if (type === "msq" || (type === "figure" && Array.isArray(q.correctIndices) && q.correctIndices.length > 0)) {
    const cis = q.correctIndices ?? [];
    if (!Array.isArray(cis) || cis.length === 0) return "correctIndices required for MSQ";
    if (cis.some((i) => typeof i !== "number" || i < 0 || i >= options.length))
      return "correctIndices contain invalid values";
  } else {
    const ci = q.correctIndex ?? -1;
    if (typeof ci !== "number" || ci < 0 || ci >= options.length)
      return "correctIndex must be a valid option index";
  }

  return null;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as
      | { question: SingleInput }
      | { questions: SingleInput[] }
      | SingleInput
      | SingleInput[];

    let items: SingleInput[] = [];
    if (Array.isArray(body)) items = body;
    else if ("questions" in body && Array.isArray(body.questions)) items = body.questions;
    else if ("question" in body && body.question) items = [body.question];
    else items = [body as SingleInput];

    if (items.length === 0)
      return NextResponse.json({ error: "no questions provided" }, { status: 400 });

    const rows: Array<{
      courseId: number;
      year: number;
      unit: number;
      questionText: string;
      options: string[];
      correctIndex: number;
      explanation: string | null;
      questionType: string;
      correctIndices: number[] | null;
      numericalAnswer: number | null;
      numericalTolerance: number | null;
      numericalUnit: string | null;
      imageUrl: string | null;
    }> = [];
    const errors: { index: number; error: string }[] = [];

    for (let i = 0; i < items.length; i++) {
      const q = items[i];
      const err = validate(q);
      if (err) {
        errors.push({ index: i, error: err });
        continue;
      }
      const cid = await resolveCourseId(q.courseId, q.courseSlug);
      if (!cid) {
        errors.push({ index: i, error: "course not found" });
        continue;
      }
      const type = q.questionType ?? "mcq";
      const options = q.options ?? [];
      const correctIndex =
        type === "msq"
          ? q.correctIndices?.[0] ?? 0
          : type === "numerical"
          ? 0
          : q.correctIndex ?? 0;

      rows.push({
        courseId: cid,
        year: q.year,
        unit: q.unit,
        questionText: q.questionText.trim(),
        options,
        correctIndex,
        explanation: q.explanation?.toString().trim() || null,
        questionType: type,
        correctIndices:
          type === "msq" || (type === "figure" && Array.isArray(q.correctIndices))
            ? q.correctIndices ?? null
            : null,
        numericalAnswer: type === "numerical" ? q.numericalAnswer ?? null : null,
        numericalTolerance: type === "numerical" ? q.numericalTolerance ?? 0 : null,
        numericalUnit: type === "numerical" ? q.numericalUnit?.trim() || null : null,
        imageUrl: q.imageUrl?.trim() || null,
      });
    }

    let inserted = 0;
    if (rows.length > 0) {
      const res = await db.insert(questions).values(rows).returning({ id: questions.id });
      inserted = res.length;
    }
    return NextResponse.json({ inserted, failed: errors.length, errors });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const courseId = url.searchParams.get("courseId");
  const year = url.searchParams.get("year");
  const unit = url.searchParams.get("unit");
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "100", 10), 500);

  const conditions = [] as ReturnType<typeof eq>[];
  if (courseId) conditions.push(eq(questions.courseId, parseInt(courseId, 10)));
  if (year) conditions.push(eq(questions.year, parseInt(year, 10)));
  if (unit) conditions.push(eq(questions.unit, parseInt(unit, 10)));

  const rows = await db
    .select({
      id: questions.id,
      courseId: questions.courseId,
      courseName: courses.name,
      courseSlug: courses.slug,
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
    .innerJoin(courses, eq(courses.id, questions.courseId))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(sql`${questions.id} DESC`)
    .limit(limit);

  return NextResponse.json({ questions: rows });
}
