import { notFound } from "next/navigation";
import { db } from "@/db";
import { courses } from "@/db/schema";
import { eq } from "drizzle-orm";
import QuizRunner from "./QuizRunner";

export const dynamic = "force-dynamic";

export default async function QuizTakePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; mode: string }>;
  searchParams: Promise<{ year?: string; units?: string }>;
}) {
  const { slug, mode } = await params;
  const sp = await searchParams;

  if (mode !== "year-wise" && mode !== "unit-wise") return notFound();

  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.slug, slug))
    .limit(1);

  if (!course) return notFound();

  return (
    <QuizRunner
      slug={course.slug}
      courseName={course.name}
      mode={mode as "year-wise" | "unit-wise"}
      year={sp.year ?? ""}
      units={sp.units ?? ""}
    />
  );
}
