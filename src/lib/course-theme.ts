// Map course "color" name to Tailwind classes we use for icon backgrounds and
// card accents. Tailwind requires literal class names, so we enumerate them.
export type CourseColor =
  | "blue"
  | "sky"
  | "green"
  | "gray"
  | "purple"
  | "amber"
  | "rose"
  | "indigo";

export const colorMap: Record<
  CourseColor,
  {
    cardBg: string;
    iconBg: string;
    iconText: string;
    ring: string;
    badge: string;
  }
> = {
  blue: {
    cardBg: "bg-blue-50",
    iconBg: "bg-blue-600",
    iconText: "text-white",
    ring: "ring-blue-100",
    badge: "bg-blue-100 text-blue-700",
  },
  sky: {
    cardBg: "bg-sky-50",
    iconBg: "bg-sky-400",
    iconText: "text-white",
    ring: "ring-sky-100",
    badge: "bg-sky-100 text-sky-700",
  },
  green: {
    cardBg: "bg-emerald-50",
    iconBg: "bg-emerald-600",
    iconText: "text-white",
    ring: "ring-emerald-100",
    badge: "bg-emerald-100 text-emerald-700",
  },
  gray: {
    cardBg: "bg-slate-100",
    iconBg: "bg-slate-500",
    iconText: "text-white",
    ring: "ring-slate-200",
    badge: "bg-slate-200 text-slate-700",
  },
  purple: {
    cardBg: "bg-purple-50",
    iconBg: "bg-purple-600",
    iconText: "text-white",
    ring: "ring-purple-100",
    badge: "bg-purple-100 text-purple-700",
  },
  amber: {
    cardBg: "bg-amber-50",
    iconBg: "bg-amber-500",
    iconText: "text-white",
    ring: "ring-amber-100",
    badge: "bg-amber-100 text-amber-800",
  },
  rose: {
    cardBg: "bg-rose-50",
    iconBg: "bg-rose-500",
    iconText: "text-white",
    ring: "ring-rose-100",
    badge: "bg-rose-100 text-rose-700",
  },
  indigo: {
    cardBg: "bg-indigo-50",
    iconBg: "bg-indigo-600",
    iconText: "text-white",
    ring: "ring-indigo-100",
    badge: "bg-indigo-100 text-indigo-700",
  },
};

export function getTheme(color: string) {
  return colorMap[(color as CourseColor)] ?? colorMap.blue;
}
