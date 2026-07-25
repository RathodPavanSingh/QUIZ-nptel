import { redirect } from "next/navigation";
import { JEE_EXAMS } from "@/lib/jee-meta";

export const dynamic = "force-dynamic";

export default async function JeeExamRedirect({
  params,
}: {
  params: Promise<{ exam: string }>;
}) {
  const { exam } = await params;
  const examMeta = JEE_EXAMS.find((e) => e.key === exam);
  if (!examMeta) redirect("/jee");

  const firstSub = examMeta.subjects[0] ?? "physics";
  redirect(`/jee/${exam}/${firstSub}`);
}
