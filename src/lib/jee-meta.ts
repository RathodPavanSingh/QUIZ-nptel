export type JeeExamKey =
  | "jee-main"
  | "jee-advanced"
  | "bitsat"
  | "neet"
  | "ts-eamcet"
  | "ap-eamcet"
  | "nda";

export type JeeSubjectKey =
  | "physics"
  | "chemistry"
  | "math"
  | "zoology"
  | "botany"
  | "general-ability";

export const JEE_EXAMS: {
  key: JeeExamKey;
  title: string;
  subtitle: string;
  badge?: string;
  accent: string;
  logo: string;
  year: string;
  papers: number;
  totalQs: number;
  subjects: JeeSubjectKey[];
}[] = [
  {
    key: "jee-main",
    title: "JEE Main 2027 Crash Course",
    subtitle: "Get 99+ Percentile in JEE Main",
    accent: "from-orange-400 to-green-500",
    logo: "✓",
    year: "2026 - 2012",
    papers: 109,
    totalQs: 8175,
    subjects: ["physics", "chemistry", "math"],
  },
  {
    key: "jee-advanced",
    title: "JEE Advanced 2027 Crash Course",
    subtitle: "For those who want only IIT & nothing else!",
    badge: "Live",
    accent: "from-slate-600 to-slate-900",
    logo: "◎",
    year: "2026 - 2006",
    papers: 39,
    totalQs: 2418,
    subjects: ["physics", "chemistry", "math"],
  },
  {
    key: "bitsat",
    title: "BITSAT 2027 Crash Course",
    subtitle: "Let's go to BITS Pilani!",
    badge: "Live",
    accent: "from-blue-700 to-amber-500",
    logo: "◆",
    year: "2026 - 2015",
    papers: 25,
    totalQs: 3750,
    subjects: ["physics", "chemistry", "math"],
  },
  {
    key: "neet",
    title: "NEET 2027 Crash Course",
    subtitle: "Crack NEET & Enter Premium Medical Colleges",
    badge: "Live",
    accent: "from-red-500 to-rose-600",
    logo: "✚",
    year: "2026 - 2012",
    papers: 39,
    totalQs: 7240,
    subjects: ["physics", "chemistry", "zoology", "botany"],
  },
  {
    key: "ts-eamcet",
    title: "TS EAMCET 2027 Practice Course",
    subtitle: "Top engineering coaching for Telangana State",
    accent: "from-teal-600 to-emerald-500",
    logo: "★",
    year: "2025 - 2012",
    papers: 39,
    totalQs: 10320,
    subjects: ["physics", "chemistry", "math"],
  },
  {
    key: "ap-eamcet",
    title: "AP EAMCET 2027 Practice Course",
    subtitle: "Top engineering coaching for Andhra Pradesh",
    accent: "from-cyan-600 to-sky-500",
    logo: "✸",
    year: "2025 - 2012",
    papers: 39,
    totalQs: 14960,
    subjects: ["physics", "chemistry", "math"],
  },
  {
    key: "nda",
    title: "NDA 2027 Practice Course",
    subtitle: "Join the National Defence Academy",
    badge: "New",
    accent: "from-amber-600 to-yellow-500",
    logo: "🛡",
    year: "2026 - 2012",
    papers: 39,
    totalQs: 8490,
    subjects: ["math", "general-ability"],
  },
];

export const JEE_SUBJECTS: {
  key: JeeSubjectKey;
  label: string;
  short: string;
  emoji: string;
  color: string;
}[] = [
  { key: "physics", label: "Physics", short: "Phy", emoji: "⚛️", color: "text-orange-400" },
  { key: "chemistry", label: "Chemistry", short: "Chem", emoji: "🧪", color: "text-emerald-400" },
  { key: "math", label: "Mathematics", short: "Math", emoji: "∑", color: "text-sky-400" },
  { key: "zoology", label: "Zoology", short: "Zoo", emoji: "🐾", color: "text-amber-400" },
  { key: "botany", label: "Botany", short: "Bot", emoji: "🌿", color: "text-green-400" },
  { key: "general-ability", label: "General Ability", short: "GA", emoji: "💡", color: "text-rose-400" },
];

export type ChapterDef = { slug: string; name: string; icon: string };

export const PHYSICS_CHAPTERS: ChapterDef[] = [
  { slug: "math-in-physics", name: "Math in Physics", icon: "ƒ(x)" },
  { slug: "units-dimensions", name: "Units & Dimensions", icon: "📏" },
  { slug: "motion-in-1d", name: "Motion in 1D", icon: "→" },
  { slug: "motion-in-2d", name: "Motion in 2D", icon: "🌌" },
  { slug: "laws-of-motion", name: "Laws of Motion", icon: "◎" },
  { slug: "work-power-energy", name: "Work Power Energy", icon: "💡" },
  { slug: "com-collisions", name: "COM & Collisions", icon: "📦" },
  { slug: "rotational-motion", name: "Rotational Motion", icon: "↻" },
  { slug: "gravitation", name: "Gravitation", icon: "🍎" },
  { slug: "properties-of-solids", name: "Properties of Solids", icon: "▣" },
  { slug: "properties-of-fluids", name: "Properties of Fluids", icon: "🌊" },
  { slug: "thermal-properties", name: "Thermal Properties", icon: "🌡" },
  { slug: "thermodynamics", name: "Thermodynamics", icon: "🔥" },
  { slug: "ktg", name: "KTG", icon: "💨" },
  { slug: "oscillations", name: "Oscillations", icon: "〰" },
  { slug: "waves-sound", name: "Waves & Sound", icon: "♫" },
  { slug: "electrostatics", name: "Electrostatics", icon: "⚡" },
  { slug: "current-electricity", name: "Current Electricity", icon: "🔌" },
  { slug: "magnetic-properties", name: "Magnetic Properties", icon: "🧲" },
  { slug: "emi", name: "EMI", icon: "⟳" },
  { slug: "ac-circuits", name: "AC Circuits", icon: "~" },
  { slug: "em-waves", name: "EM Waves", icon: "📡" },
  { slug: "ray-optics", name: "Ray Optics", icon: "△" },
  { slug: "wave-optics", name: "Wave Optics", icon: "〰" },
  { slug: "dual-nature", name: "Dual Nature", icon: "▣" },
  { slug: "atomic-physics", name: "Atomic Physics", icon: "⚛" },
  { slug: "nuclear-physics", name: "Nuclear Physics", icon: "☢" },
  { slug: "semiconductors", name: "Semiconductors", icon: "📱" },
  { slug: "communication-system", name: "Communication System", icon: "📶" },
  { slug: "experimental-physics", name: "Experimental Physics", icon: "🎯" },
];

export const CHEMISTRY_CHAPTERS: ChapterDef[] = [
  { slug: "mole-concept", name: "Mole Concept", icon: "🧪" },
  { slug: "atomic-structure", name: "Atomic Structure", icon: "⚛" },
  { slug: "periodic-table", name: "Periodic Table", icon: "▦" },
  { slug: "chemical-bonding", name: "Chemical Bonding", icon: "◎" },
  { slug: "states-of-matter", name: "States of Matter", icon: "💧" },
  { slug: "thermodynamics-c", name: "Thermodynamics (C)", icon: "🔥" },
  { slug: "chemical-equilibrium", name: "Chemical Equilibrium", icon: "⚖" },
  { slug: "ionic-equilibrium", name: "Ionic Equilibrium", icon: "±" },
  { slug: "redox-reactions", name: "Redox Reactions", icon: "O₂" },
  { slug: "s-block", name: "s Block", icon: "S" },
  { slug: "p-block-13-14", name: "p Block (G13-14)", icon: "P" },
  { slug: "goc", name: "GOC", icon: "⬡" },
  { slug: "hydrocarbons", name: "Hydrocarbons", icon: "⬢" },
  { slug: "env-chemistry", name: "Env. Chemistry", icon: "🌍" },
  { slug: "solid-state", name: "Solid State", icon: "◆" },
  { slug: "solutions", name: "Solutions", icon: "≈" },
  { slug: "electrochemistry", name: "Electrochemistry", icon: "🔋" },
  { slug: "chemical-kinetics", name: "Chemical Kinetics", icon: "⚙" },
  { slug: "surface-chemistry", name: "Surface Chemistry", icon: "⚗" },
  { slug: "metallurgy", name: "Metallurgy", icon: "⛏" },
  { slug: "p-block-15-18", name: "p Block (G15-18)", icon: "P" },
  { slug: "d-f-block", name: "d & f Block", icon: "D" },
  { slug: "coordination-compounds", name: "Coordination Compounds", icon: "⬡" },
  { slug: "haloalkanes-haloarenes", name: "Haloalkanes & Haloarenes", icon: "⬡" },
  { slug: "alcohols-phenols-ethers", name: "Alcohols, Phenols & Ethers", icon: "OH" },
  { slug: "aldehydes-ketones", name: "Aldehydes & Ketones", icon: "CO" },
  { slug: "carboxylic-acids", name: "Carboxylic Acids", icon: "COOH" },
  { slug: "amines", name: "Amines", icon: "NH₂" },
  { slug: "biomolecules", name: "Biomolecules", icon: "🧬" },
  { slug: "polymers", name: "Polymers", icon: "⬡" },
  { slug: "everyday-chemistry", name: "Everyday Chemistry", icon: "🏠" },
  { slug: "practical-chemistry", name: "Practical Chemistry", icon: "⚗" },
];

export const MATH_CHAPTERS: ChapterDef[] = [
  { slug: "basic-math", name: "Basic Math", icon: "+/-" },
  { slug: "binary-numbers", name: "Binary Numbers", icon: "01" },
  { slug: "quadratic-equations", name: "Quadratic Equations", icon: "√" },
  { slug: "complex-numbers", name: "Complex Numbers", icon: "i" },
  { slug: "p-and-c", name: "P&C", icon: "🎲" },
  { slug: "sequences-series", name: "Sequences & Series", icon: "…" },
  { slug: "math-induction", name: "Math Induction", icon: "💡" },
  { slug: "binomial-theorem", name: "Binomial Theorem", icon: "⊕" },
  { slug: "trigonometry", name: "Trigonometry", icon: "△" },
  { slug: "trigonometric-equations", name: "Trigonometric Equations", icon: "∠" },
  { slug: "straight-lines", name: "Straight Lines", icon: "—" },
  { slug: "circle", name: "Circle", icon: "○" },
  { slug: "parabola", name: "Parabola", icon: "∪" },
  { slug: "ellipse", name: "Ellipse", icon: "⬭" },
  { slug: "hyperbola", name: "Hyperbola", icon: "×" },
  { slug: "limits", name: "Limits", icon: "∞" },
  { slug: "properties-of-triangles", name: "Properties of Triangles", icon: "△" },
  { slug: "matrices", name: "Matrices", icon: "[::]" },
  { slug: "determinants", name: "Determinants", icon: "[x]" },
  { slug: "statistics", name: "Statistics", icon: "📊" },
  { slug: "itf", name: "ITF", icon: "∿" },
  { slug: "functions", name: "Functions", icon: "f" },
  { slug: "c-and-d", name: "C&D", icon: "📈" },
  { slug: "differentiation", name: "Differentiation", icon: "dy/dx" },
  { slug: "aod", name: "AOD", icon: "🧮" },
  { slug: "indefinite-integration", name: "Indefinite Integration", icon: "∫" },
  { slug: "definite-integration", name: "Definite Integration", icon: "∫" },
  { slug: "area-under-curves", name: "Area Under Curves", icon: "🌊" },
  { slug: "differential-eqns", name: "Differential Eqns", icon: "dy/dx" },
  { slug: "vector-algebra", name: "Vector Algebra", icon: "→" },
  { slug: "3d-geometry", name: "3D Geometry", icon: "⬚" },
  { slug: "probability", name: "Probability", icon: "⚃" },
];

export const ZOOLOGY_CHAPTERS: ChapterDef[] = [
  { slug: "animal-kingdom", name: "Animal Kingdom", icon: "🦁" },
  { slug: "structural-organization", name: "Structural Organization", icon: "🧬" },
  { slug: "digestion-absorption", name: "Digestion & Absorption", icon: "🍕" },
  { slug: "breathing-exchange", name: "Breathing & Gas Exchange", icon: "🫁" },
  { slug: "body-fluids", name: "Body Fluids & Circulation", icon: "❤️" },
  { slug: "excretory-products", name: "Excretory Products", icon: "💧" },
  { slug: "locomotion-movement", name: "Locomotion & Movement", icon: "🦴" },
  { slug: "neural-control", name: "Neural Control & Coordination", icon: "🧠" },
];

export const BOTANY_CHAPTERS: ChapterDef[] = [
  { slug: "plant-kingdom", name: "Plant Kingdom", icon: "🌲" },
  { slug: "morphology-flowering", name: "Morphology of Flowering Plants", icon: "🌸" },
  { slug: "anatomy-flowering", name: "Anatomy of Flowering Plants", icon: "🌱" },
  { slug: "cell-unit-of-life", name: "Cell: Unit of Life", icon: "🦠" },
  { slug: "cell-cycle", name: "Cell Cycle & Division", icon: "⟲" },
  { slug: "transport-plants", name: "Transport in Plants", icon: "💧" },
  { slug: "mineral-nutrition", name: "Mineral Nutrition", icon: "🍂" },
  { slug: "photosynthesis", name: "Photosynthesis in Higher Plants", icon: "☀️" },
];

export const GENERAL_ABILITY_CHAPTERS: ChapterDef[] = [
  { slug: "english-grammar", name: "English Grammar", icon: "✍️" },
  { slug: "vocabulary-synonyms", name: "Vocabulary & Synonyms", icon: "📖" },
  { slug: "history-india", name: "History of India", icon: "🏛" },
  { slug: "geography", name: "Geography", icon: "🗺" },
  { slug: "general-science", name: "General Science", icon: "🧪" },
  { slug: "current-events", name: "Current Events", icon: "📰" },
];

export function chaptersFor(subject: JeeSubjectKey): ChapterDef[] {
  if (subject === "physics") return PHYSICS_CHAPTERS;
  if (subject === "chemistry") return CHEMISTRY_CHAPTERS;
  if (subject === "math") return MATH_CHAPTERS;
  if (subject === "zoology") return ZOOLOGY_CHAPTERS;
  if (subject === "botany") return BOTANY_CHAPTERS;
  return GENERAL_ABILITY_CHAPTERS;
}

export function examLabel(key: string) {
  return JEE_EXAMS.find((e) => e.key === key)?.title ?? key;
}

export function subjectLabel(key: string) {
  return JEE_SUBJECTS.find((s) => s.key === key)?.label ?? key;
}

export function chapterName(subject: JeeSubjectKey, slug: string) {
  return chaptersFor(subject).find((c) => c.slug === slug)?.name ?? slug;
}
