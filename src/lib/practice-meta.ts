export const APTITUDE_TABS = [
  { key: "numerical", label: "Numerical", emoji: "📊" },
  { key: "verbal", label: "Verbal", emoji: "✏️" },
  { key: "reasoning", label: "Reasoning", emoji: "🧠" },
] as const;

export const GATE_COURSES = [
  {
    key: "machines",
    label: "Electrical Machines",
    short: "Machines",
    href: "/gate/machines",
    desc: "Transformers, DC, Induction & Synchronous machines",
    color: "from-blue-600 to-indigo-600",
  },
  {
    key: "power-system",
    label: "Power System",
    short: "Power System",
    href: "/gate/power-system",
    desc: "Transmission, faults, load flow & protection",
    color: "from-amber-500 to-orange-600",
  },
  {
    key: "power-electronics",
    label: "Power Electronics",
    short: "Power Electronics",
    href: "/gate/power-electronics",
    desc: "Devices, converters, inverters & drives",
    color: "from-rose-500 to-pink-600",
  },
  {
    key: "network-theory",
    label: "Network Theory",
    short: "Network Theory",
    href: "/gate/network-theory",
    desc: "Theorems, transients, two-port & AC circuits",
    color: "from-emerald-500 to-teal-600",
  },
  {
    key: "control-systems",
    label: "Control Systems",
    short: "Control Systems",
    href: "/gate/control-systems",
    desc: "Time response, stability, root locus & Bode",
    color: "from-violet-500 to-purple-600",
  },
  // --- New Six GATE courses requested (50 Q each -> 150 Q each!) ---
  {
    key: "analog-digital-electronics",
    label: "Analog & Digital Electronics",
    short: "Analog & Digital",
    href: "/gate/analog-digital-electronics",
    desc: "Op-amps, diode circuits, combinational & sequential logic",
    color: "from-fuchsia-600 to-pink-500",
  },
  {
    key: "basic-electrical-elements",
    label: "Basic Elements Electrical",
    short: "Basic Elements",
    href: "/gate/basic-electrical-elements",
    desc: "RLC elements, sources, magnetic coupling & basic circuits",
    color: "from-teal-500 to-cyan-600",
  },
  {
    key: "signals-systems-analysis",
    label: "Signal analysis",
    short: "Signals & Systems",
    href: "/gate/signals-systems-analysis",
    desc: "Continuous & discrete signals, Fourier, Laplace & Z-transforms",
    color: "from-sky-500 to-blue-600",
  },
  {
    key: "gate-aptitude",
    label: "Aptitude",
    short: "Aptitude",
    href: "/gate/gate-aptitude",
    desc: "Quantitative, spatial, verbal & logical aptitude for GATE",
    color: "from-amber-500 to-yellow-600",
  },
  {
    key: "gate-mathematics",
    label: "Mathematics",
    short: "Engineering Maths",
    href: "/gate/gate-mathematics",
    desc: "Linear algebra, calculus, differential equations & probability",
    color: "from-emerald-600 to-green-500",
  },
  {
    key: "emt-measurements",
    label: "EMT & Measurement",
    short: "EMT & Measurements",
    href: "/gate/emt-measurements",
    desc: "Maxwell's equations, plane waves, bridges & instrument transformers",
    color: "from-purple-600 to-indigo-500",
  },
] as const;

export type PracticeQDTO = {
  id: number;
  number: string;
  difficulty: string;
  topic: string;
  timeSeconds: number;
  isPyq: boolean;
  year: number | null;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string | null;
  tags: string[];

  // Support MCQ, MSQ, and Numerical styles
  questionType?: string;
  correctIndices?: number[] | null;
  numericalAnswer?: number | null;
  numericalTolerance?: number | null;
  numericalUnit?: string | null;
};
export const VALID_GATE_KEYS = new Set(GATE_COURSES.map((g) => g.key));
export function isGateCourse(key: string): boolean {
  return VALID_GATE_KEYS.has(key as any);
}
