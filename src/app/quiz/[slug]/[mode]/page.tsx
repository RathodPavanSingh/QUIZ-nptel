import { notFound } from "next/navigation";
import { db } from "@/db";
import { courses } from "@/db/schema";
import { eq } from "drizzle-orm";
import QuizConfig from "./QuizConfig";

export const dynamic = "force-dynamic";

export default async function QuizConfigPage({
  params,
}: {
  params: Promise<{ slug: string; mode: string }>;
}) {
  const { slug, mode } = await params;

  if (mode !== "year-wise" && mode !== "unit-wise") return notFound();

  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.slug, slug))
    .limit(1);

  if (!course) return notFound();

  return (
    <QuizConfig
      slug={course.slug}
      courseName={course.name}
      totalUnits={course.totalUnits}
      mode={mode as "year-wise" | "unit-wise"}
    />
  );
}
