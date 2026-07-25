"use client";

import { TopHeader } from "@/components/TopHeader";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <TopHeader />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-6">About NPTEL Quiz</h1>
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <p className="text-slate-700 leading-relaxed mb-4">
            NPTEL Quiz is a comprehensive platform for students to practice previous year assignment questions
            across multiple courses and competitive exams.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            Our platform offers year-wise and unit-wise practice for NPTEL courses, along with dedicated sections
            for GATE, JEE, BITSAT, government exams, and MNC placement preparation.
          </p>
          <p className="text-slate-700 leading-relaxed">
            With over 10,000+ questions across various categories, we aim to help students excel in their
            academic and competitive journey.
          </p>
        </div>
      </div>
    </div>
  );
}
