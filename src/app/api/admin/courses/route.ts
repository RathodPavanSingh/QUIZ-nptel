import { NextResponse } from "next/server";
import { db } from "@/db";
import { courses, questions } from "@/db/schema";
import { sql, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

// List all courses with counts
export async function GET() {
  const rows = await db
    .select({
      id: courses.id,
      slug: courses.slug,
      name: courses.name,
      description: courses.description,
      icon: courses.icon,
      color: courses.color,
      totalUnits: courses.totalUnits,
      questionCount: sql<number>`COALESCE(COUNT(${questions.id}), 0)::int`,
    })
    .from(courses)
    .leftJoin(questions, eq(questions.courseId, courses.id))
    .groupBy(courses.id)
    .orderBy(courses.id);
  return NextResponse.json({ courses: rows });
}

// Create a new course (general question set)
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      slug?: string;
      name?: string;
      description?: string;
      icon?: string;
      color?: string;
      totalUnits?: number;
    };
    if (!body.name || !body.slug) {
      return NextResponse.json(
        { error: "name and slug are required" },
        { status: 400 },
      );
    }
    const slug = body.slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const [created] = await db
      .insert(courses)
      .values({
        slug,
        name: body.name,
        description: body.description ?? "",
        icon: body.icon ?? "cloud",
        color: body.color ?? "blue",
        totalUnits: body.totalUnits ?? 12,
      })
      .returning();
    return NextResponse.json({ course: created });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to create";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
