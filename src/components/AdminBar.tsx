"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminBar() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2">
      <Link
        href="/admin/devbox"
        className="group flex items-center gap-2 rounded-full bg-linear-to-r from-fuchsia-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg ring-1 ring-violet-500/40 transition hover:from-fuchsia-500 hover:to-violet-500"
        title="DevBox — all question formats"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
          >
            <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
          </svg>
        </span>
        DevBox
        <span className="hidden text-[10px] font-medium text-violet-100 sm:inline">
          MCQ · MSQ · Num · Figure
        </span>
      </Link>

      <Link
        href="/admin"
        className="group flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg ring-1 ring-slate-800 transition hover:bg-slate-800"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-br from-amber-400 to-orange-500 text-slate-900 shadow-inner">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        </span>
        Admin
      </Link>
    </div>
  );
}
