import Link from "next/link";

type ActiveKey =
  | "nptel"
  | "programming"
  | "coding"
  | "aptitude"
  | "gate"
  | "jee"
  | "govt"
  | "mnc"
  | "gk";

export function PracticeNav({
  active,
  progCount = 8,
  codingCount = 5,
  aptCount = 32,
  gateCount = 1650,
  jeeCount = 1852,
  govtCount = 150,
  mncCount = 1210,
  gkCount = 1000,
}: {
  active: ActiveKey;
  progCount?: number;
  codingCount?: number;
  aptCount?: number;
  gateCount?: number;
  jeeCount?: number;
  govtCount?: number;
  mncCount?: number;
  gkCount?: number;
}) {
  const pill = (isActive: boolean) =>
    `inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition ${
      isActive ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
    }`;
  const badge = (isActive: boolean) =>
    `rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
      isActive ? "bg-white/20" : "bg-slate-200 text-slate-700"
    }`;

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-3 py-3">
        <Link href="/" className={pill(active === "nptel")}>NPTEL</Link>
        <Link href="/programming" className={pill(active === "programming")}>
          Programming
          <span className={badge(active === "programming")}>{progCount}</span>
        </Link>
        <Link href="/coding" className={pill(active === "coding")}>
          Coding
          <span className={badge(active === "coding")}>{codingCount}</span>
        </Link>
        <Link href="/aptitude/numerical" className={pill(active === "aptitude")}>
          Aptitude
          <span className={badge(active === "aptitude")}>{aptCount}</span>
        </Link>
        <Link href="/gate" className={pill(active === "gate")}>
          GATE
          <span className={badge(active === "gate")}>{gateCount}</span>
        </Link>
        <Link href="/jee" className={pill(active === "jee")}>
          ENTRANCE EXAM
          <span className={badge(active === "jee")}>{jeeCount}</span>
        </Link>
        <Link href="/govt/upsc" className={pill(active === "govt")}>
          GOVT EXAMS
          <span className={badge(active === "govt")}>{govtCount}</span>
        </Link>
        <Link href="/mnc" className={pill(active === "mnc")}>
          MNC
          <span className={badge(active === "mnc")}>{mncCount}</span>
        </Link>
        <Link href="/gk/history" className={pill(active === "gk")}>
          GK EXAMS
          <span className={badge(active === "gk")}>{gkCount}</span>
        </Link>
      </div>
    </header>
  );
}
