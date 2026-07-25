import { NextResponse } from "next/server";
import { db } from "@/db";
import { courses, questions } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.slug, slug))
    .limit(1);

  if (!course) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const rows = await db
    .select({ year: questions.year, unit: questions.unit })
    .from(questions)
    .where(eq(questions.courseId, course.id));

  const years = Array.from(new Set(rows.map((r) => r.year))).sort();
  const unitsSet = new Set(rows.map((r) => r.unit));

  // Count by year+unit
  const counts: Record<string, number> = {};
  for (const r of rows) {
    const yk = `y:${r.year}`;
    const uk = `u:${r.unit}`;
    const yuk = `y:${r.year}|u:${r.unit}`;
    counts[yk] = (counts[yk] ?? 0) + 1;
    counts[uk] = (counts[uk] ?? 0) + 1;
    counts[yuk] = (counts[yuk] ?? 0) + 1;
  }

  return NextResponse.json({
    course: {
      id: course.id,
      slug: course.slug,
      name: course.name,
      description: course.description,
      icon: course.icon,
      color: course.color,
      totalUnits: course.totalUnits,
    },
    years,
    availableUnits: Array.from(unitsSet).sort((a, b) => a - b),
    counts,
    total: rows.length,
  });
}
