import Link from "next/link";
import { db } from "@/db";
import { courses, questions, programmingQuestions, codingProblems, practiceQuestions, jeeQuestions } from "@/db/schema";
import { sql, eq, isNull } from "drizzle-orm";
import { CourseIcon } from "@/components/CourseIcon";
import { getTheme } from "@/lib/course-theme";
import { ensureSeeded } from "@/db/seed";
import { PracticeNav } from "@/components/PracticeNav";
import { GATE_COURSES } from "@/lib/practice-meta";
import { JEE_EXAMS } from "@/lib/jee-meta";

export const dynamic = "force-dynamic";

async function getCoursesWithStats() {
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
    .leftJoin(questions, sql`${questions.courseId} = ${courses.id}`)
    .groupBy(courses.id)
    .orderBy(courses.id);
  return rows;
}

export default async function HomePage() {
  // Ensure DB is seeded (safe no-op if already seeded)
  await ensureSeeded().catch(() => {});

  const list = await getCoursesWithStats();
  const [prog] = await db.select({ c: sql<number>`COUNT(*)::int` }).from(programmingQuestions);
  const [cod] = await db
    .select({ c: sql<number>`COUNT(*)::int` })
    .from(codingProblems)
    .where(isNull(codingProblems.exam));
  const [apt] = await db
    .select({ c: sql<number>`COUNT(*)::int` })
    .from(practiceQuestions)
    .where(eq(practiceQuestions.category, "aptitude"));
  const [gate] = await db
    .select({ c: sql<number>`COUNT(*)::int` })
    .from(practiceQuestions)
    .where(eq(practiceQuestions.category, "gate"));
  const [jee] = await db.select({ c: sql<number>`COUNT(*)::int` }).from(jeeQuestions);
  const [gov] = await db
    .select({ c: sql<number>`COUNT(*)::int` })
    .from(practiceQuestions)
    .where(eq(practiceQuestions.category, "govt"));
  const [mncMcq] = await db
    .select({ c: sql<number>`COUNT(*)::int` })
    .from(practiceQuestions)
    .where(eq(practiceQuestions.category, "mnc"));
  const [mncCode] = await db
    .select({ c: sql<number>`COUNT(*)::int` })
    .from(codingProblems)
    .where(sql`${codingProblems.exam} LIKE 'mnc-%'`);
  const mncTotal = mncMcq.c + mncCode.c;
  const [gk] = await db
    .select({ c: sql<number>`COUNT(*)::int` })
    .from(practiceQuestions)
    .where(eq(practiceQuestions.category, "gk"));

  return (
    <main className="min-h-screen">
      <PracticeNav active="nptel" progCount={prog.c} codingCount={cod.c} aptCount={apt.c} gateCount={gate.c} jeeCount={jee.c} govtCount={gov.c} mncCount={mncTotal} gkCount={gk.c} />

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-5 pt-10 pb-6 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500" />
          NPTEL · Programming · Coding · Aptitude · GATE · Entrance · Govt · MNC
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Choose Your Course
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-slate-600">
          NPTEL, coding, aptitude, GATE EE, entrance exams, govt exams, and MNC placement desks.
        </p>
      </section>

      {/* Highlight cards */}
      <section className="mx-auto max-w-3xl px-5 pb-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Link href="/programming" className="group flex items-start gap-4 rounded-2xl border border-blue-200 bg-linear-to-br from-blue-50 to-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6"><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M2 20h20" /></svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">Programming</h3>
                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">{prog.c}</span>
              </div>
              <p className="mt-1 text-sm text-slate-600">Code-output MCQs · C, Java, Python</p>
            </div>
          </Link>
          <Link href="/coding" className="group flex items-start gap-4 rounded-2xl border border-indigo-200 bg-linear-to-br from-indigo-50 to-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6"><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8" /></svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">Coding</h3>
                <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white">{cod.c}</span>
              </div>
              <p className="mt-1 text-sm text-slate-600">DSA problems · Multi-language solutions</p>
            </div>
          </Link>
          <Link href="/aptitude/numerical" className="group flex items-start gap-4 rounded-2xl border border-emerald-200 bg-linear-to-br from-emerald-50 to-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6"><path d="M4 20V10M10 20V4M16 20v-8M2 20h20" /></svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">Aptitude</h3>
                <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">{apt.c}</span>
              </div>
              <p className="mt-1 text-sm text-slate-600">Numerical · Verbal · Reasoning</p>
            </div>
          </Link>
          <Link href="/gate" className="group flex items-start gap-4 rounded-2xl border border-violet-200 bg-linear-to-br from-violet-50 to-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6"><path d="M12 2 2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">GATE EE</h3>
                <span className="rounded-full bg-violet-600 px-2 py-0.5 text-[10px] font-bold text-white">{gate.c}</span>
              </div>
              <p className="mt-1 text-sm text-slate-600">5 subjects · 50 Q each</p>
            </div>
          </Link>
          <Link href="/govt/upsc" className="group flex items-start gap-4 rounded-2xl border border-rose-200 bg-linear-to-br from-rose-50 to-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">GOVT EXAMS</h3>
                <span className="rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white">150</span>
              </div>
              <p className="mt-1 text-sm text-slate-600">UPSC Civil Service · NDA · SSC CGL</p>
            </div>
          </Link>
          <Link href="/mnc" className="group flex items-start gap-4 rounded-2xl border border-slate-800 bg-linear-to-br from-slate-900 to-slate-700 p-5 text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-xl font-black text-slate-900 shadow-sm">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">MNC Desks</h3>
                <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-slate-900">{mncTotal}</span>
              </div>
              <p className="mt-1 text-sm text-slate-300">11 companies · 90 MCQ + 10 Coding each</p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                Google · Microsoft · TCS · Infosys · Wipro · IBM · more
              </p>
            </div>
          </Link>
          <Link href="/gk/history" className="group flex items-start gap-4 rounded-2xl border border-cyan-200 bg-linear-to-br from-cyan-50 to-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-600 text-white shadow-sm text-lg font-bold">
              📚
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">General Knowledge</h3>
                <span className="rounded-full bg-cyan-600 px-2 py-0.5 text-[10px] font-bold text-white">{gk.c}</span>
              </div>
              <p className="mt-1 text-sm text-slate-600">History, Polity, Geography, Economy, Science, Current Affairs</p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                MCQ · MSQ · Numerical · PYQs
              </p>
            </div>
          </Link>
        </div>

        {/* GATE quick links */}
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">GATE subjects</div>
          <div className="flex flex-wrap gap-2">
            {GATE_COURSES.map((g) => (
              <Link
                key={g.key}
                href={g.href}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-800"
              >
                {g.short}
              </Link>
            ))}
          </div>
        </div>

        {/* Entrance exam crash courses */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
              ENTRANCE EXAM
            </div>
            <Link href="/jee" className="text-xs font-semibold text-blue-600 hover:underline">
              View all →
            </Link>
          </div>
          {JEE_EXAMS.map((exam) => (
            <Link
              key={exam.key}
              href={`/jee/${exam.key}`}
              className="relative block overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              {exam.badge && (
                <span className="absolute right-3 top-3 rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-bold text-white">
                  {exam.badge}
                </span>
              )}
              <div
                className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br ${exam.accent} text-lg font-black text-white`}
              >
                {exam.logo}
              </div>
              <h3 className="mt-3 text-base font-bold text-slate-900">{exam.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{exam.subtitle}</p>
            </Link>
          ))}
          <div className="text-center text-xs text-slate-500">{jee.c} entrance exam practice questions</div>
        </div>
      </section>

      {/* Courses list */}
      <section className="mx-auto max-w-3xl px-5 pb-16">
        <div className="flex flex-col gap-4">
          {list.map((c) => {
            const t = getTheme(c.color);
            return (
              <Link
                key={c.id}
                href={`/course/${c.slug}`}
                className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className={`flex items-start gap-4 rounded-xl ${t.cardBg} p-5`}>
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${t.iconBg} ${t.iconText} shadow-sm`}>
                    <CourseIcon name={c.icon} className="h-7 w-7" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">
                        {c.name}
                      </h3>
                      <svg
                        className="mt-1 hidden h-5 w-5 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-700 sm:block"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14M13 5l7 7-7 7" />
                      </svg>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      {c.description}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                      <span className={`rounded-full px-2.5 py-1 font-medium ${t.badge}`}>
                        {c.questionCount} Questions
                      </span>
                      <span className="rounded-full bg-white px-2.5 py-1 font-medium text-slate-600 ring-1 ring-slate-200">
                        {c.totalUnits} Units
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Features */}
        <div id="features" className="mt-14 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Year-wise Practice",
              desc: "Solve questions from a specific year (2022–2025).",
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              ),
            },
            {
              title: "Unit-wise Practice",
              desc: "Focus on specific units to master weak areas.",
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M12 2 2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              ),
            },
            {
              title: "Instant Feedback",
              desc: "Check answers with clear explanations.",
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <path d="M22 4 12 14.01l-3-3" />
                </svg>
              ),
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                {f.icon}
              </div>
              <h4 className="font-semibold text-slate-900">{f.title}</h4>
              <p className="mt-1 text-sm text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-5xl px-5">
          © {new Date().getFullYear()} NPTEL Quiz · Built for learners to practice previous year questions.
        </div>
      </footer>
    </main>
  );
}
