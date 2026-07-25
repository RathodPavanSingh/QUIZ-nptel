"use client";

import { TopHeader } from "@/components/TopHeader";

export default function ExamPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <TopHeader />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-6">Exam Center</h1>
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <p className="text-slate-700 leading-relaxed mb-6">
            Access all your exams and practice tests in one place.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-2 border-orange-200 rounded-xl p-6 hover:shadow-lg transition">
              <h3 className="font-bold text-lg mb-2">NPTEL Courses</h3>
              <p className="text-sm text-slate-600">Practice previous year questions</p>
            </div>
            <div className="border-2 border-orange-200 rounded-xl p-6 hover:shadow-lg transition">
              <h3 className="font-bold text-lg mb-2">GATE</h3>
              <p className="text-sm text-slate-600">Engineering entrance prep</p>
            </div>
            <div className="border-2 border-orange-200 rounded-xl p-6 hover:shadow-lg transition">
              <h3 className="font-bold text-lg mb-2">JEE & BITSAT</h3>
              <p className="text-sm text-slate-600">Entrance exam practice</p>
            </div>
            <div className="border-2 border-orange-200 rounded-xl p-6 hover:shadow-lg transition">
              <h3 className="font-bold text-lg mb-2">MNC Placement</h3>
              <p className="text-sm text-slate-600">Company-specific preparation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
