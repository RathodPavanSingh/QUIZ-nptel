import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AdminBar } from "@/components/AdminBar";
import { TopHeader } from "@/components/TopHeader";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "NPTEL Previous Year Quiz | Unit-wise & Year-wise Practice",
  description:
    "Practice NPTEL previous year assignment questions unit-wise and year-wise. Cloud Computing, Networks, Data Analytics, ML, DBMS, and more.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased">
        <TopHeader />
        <div className="flex-1">{children}</div>
        <Footer />
        <AdminBar />
      </body>
    </html>
  );
}
