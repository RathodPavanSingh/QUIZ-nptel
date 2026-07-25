"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Theme = "light" | "dark" | "auto";

export function TopHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "auto";
    return (localStorage.getItem("theme") as Theme) || "auto";
  });
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const applyTheme = (t: Theme) => {
    const root = document.documentElement;
    if (t === "dark") root.classList.add("dark");
    else if (t === "light") root.classList.remove("dark");
    else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  };

  useEffect(() => {
    localStorage.setItem("theme", theme);
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (theme === "auto") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme("auto");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, [theme]);

  const themeIcons = {
    light: "☀️",
    dark: "🌙",
    auto: "🔄",
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-linear-to-r from-orange-500 to-orange-600 h-14 flex items-center justify-between px-4 shadow-md">
        <div className="text-white font-bold text-lg">NPTEL Quiz</div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <button className="text-white hover:bg-white/20 rounded-full p-2 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Theme Toggle */}
          <div className="relative">
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="text-white hover:bg-white/20 rounded-full p-2 transition"
            >
              <span className="text-lg">{themeIcons[theme]}</span>
            </button>
            {themeDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg py-2 min-w-[140px] z-50">
                {(["light", "dark", "auto"] as Theme[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setTheme(t); setThemeDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 ${
                      theme === t ? "bg-slate-100 dark:bg-slate-700 font-semibold" : ""
                    }`}
                  >
                    <span>{themeIcons[t]}</span>
                    <span className="capitalize">{t}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="text-white hover:bg-white/20 rounded-full p-2 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Menu Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-60 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
          <div className="relative ml-auto w-64 bg-white dark:bg-slate-900 h-full shadow-xl animate-slide-in">
            <div className="p-4 border-b dark:border-slate-700 flex justify-between items-center">
              <h3 className="font-bold text-lg">Menu</h3>
              <button onClick={() => setMenuOpen(false)} className="text-slate-500 hover:text-slate-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="p-4 space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact Us" },
                { href: "/exam", label: "Exam" },
                { href: "/signup", label: "Sign Up" },
                { href: "/login", label: "Login" },
                { href: "/admin", label: "Admin" },
                { href: "/admin/devbox", label: "DevBox" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Spacer for fixed header */}
      <div className="h-14" />
    </>
  );
}
