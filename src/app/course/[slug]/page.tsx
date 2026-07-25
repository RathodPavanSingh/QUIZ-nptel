import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { courses, questions } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { CourseIcon } from "@/components/CourseIcon";
import { getTheme } from "@/lib/course-theme";

export const dynamic = "force-dynamic";

async function getCourse(slug: string) {
  const [c] = await db.select().from(courses).where(eq(courses.slug, slug)).limit(1);
  if (!c) return null;

  const [{ total }] = await db
    .select({ total: sql<number>`COUNT(*)::int` })
    .from(questions)
    .where(eq(questions.courseId, c.id));

  const years = await db
    .selectDistinct({ year: questions.year })
    .from(questions)
    .where(eq(questions.courseId, c.id))
    .orderBy(questions.year);

  return { course: c, total, years: years.map((y) => y.year) };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCourse(slug);
  if (!data) return notFound();

  const { course, total, years } = data;
  const t = getTheme(course.color);

  return (
    <main className="min-h-screen">
      <SubHeader />
      <div className="mx-auto max-w-3xl px-5 py-8">
        {/* Course header card */}
        <div className={`overflow-hidden rounded-2xl border border-slate-200 ${t.cardBg} p-6 shadow-sm`}>
          <div className="flex items-center gap-4">
            <div className={`flex h-14 w-14 items-center justify-center rounded-full ${t.iconBg} ${t.iconText} shadow-sm`}>
              <CourseIcon name={course.icon} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {course.name}
              </h1>
              <p className="mt-1 text-sm text-slate-600">{course.description}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className={`rounded-full px-2.5 py-1 font-medium ${t.badge}`}>
              {total} Questions
            </span>
            <span className="rounded-full bg-white/70 px-2.5 py-1 font-medium text-slate-700 ring-1 ring-slate-200">
              {course.totalUnits} Units
            </span>
            <span className="rounded-full bg-white/70 px-2.5 py-1 font-medium text-slate-700 ring-1 ring-slate-200">
              Years: {years.length > 0 ? years.join(", ") : "—"}
            </span>
          </div>
        </div>

        {/* Choose mode */}
        <h2 className="mt-10 text-lg font-semibold text-slate-900">
          Choose Practice Mode
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Pick how you want to filter the previous year assignment questions.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <ModeCard
            href={`/quiz/${course.slug}/year-wise`}
            title="Year-wise Practice"
            desc="Solve questions from a specific year across all units."
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            }
            accent="blue"
          />
          <ModeCard
            href={`/quiz/${course.slug}/unit-wise`}
            title="Unit-wise Practice"
            desc="Pick specific units to focus on across all years."
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <path d="M12 2 2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            }
            accent="emerald"
          />
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Courses
          </Link>
        </div>
      </div>
    </main>
  );
}

function ModeCard({
  href,
  title,
  desc,
  icon,
  accent,
}: {
  href: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  accent: "blue" | "emerald";
}) {
  const map = {
    blue: { icon: "bg-blue-600 text-white", border: "hover:border-blue-400" },
    emerald: { icon: "bg-emerald-600 text-white", border: "hover:border-emerald-400" },
  } as const;
  const a = map[accent];
  return (
    <Link
      href={href}
      className={`group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${a.border}`}
    >
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${a.icon}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-600">{desc}</p>
        <div className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue-600">
          Continue
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 transition group-hover:translate-x-0.5"
          >
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

function SubHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <div className="leading-tight">
            <div className="text-[15px] font-semibold text-slate-900">NPTEL Quiz</div>
            <div className="text-[11px] text-slate-500">Previous Year Practice</div>
          </div>
        </Link>
      </div>
    </header>
  );
}
