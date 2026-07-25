"use client";

import { TopHeader } from "@/components/TopHeader";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <TopHeader />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-semibold mb-2">Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Message</label>
              <textarea
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition resize-none"
                placeholder="Your message..."
              />
            </div>
            <button className="w-full bg-linear-to-r from-orange-600 to-orange-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
