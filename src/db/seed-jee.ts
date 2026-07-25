import {
  PHYSICS_CHAPTERS,
  CHEMISTRY_CHAPTERS,
  MATH_CHAPTERS,
  ZOOLOGY_CHAPTERS,
  BOTANY_CHAPTERS,
  GENERAL_ABILITY_CHAPTERS,
  type JeeExamKey,
  type JeeSubjectKey,
} from "@/lib/jee-meta";

export type SeedJeeQ = {
  exam: JeeExamKey;
  subject: JeeSubjectKey;
  chapter: string;
  number: string;
  difficulty: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string | null;
  year: number | null;
  isPyq: boolean;
  tags: string[];
};

const PHY_TEMPLATES = [
  {
    q: (ch: string) => `In the chapter "${ch}", which quantity is a fundamental SI base unit?`,
    o: ["Force", "Energy", "Mole", "Pressure"],
    c: 2,
    e: "Mole is an SI base unit; force, energy and pressure are derived.",
  },
  {
    q: (ch: string) => `A concept from ${ch}: dimensional formula of force is:`,
    o: ["[MLT⁻²]", "[ML²T⁻²]", "[MT⁻¹]", "[M⁰L⁰T⁰]"],
    c: 0,
    e: "F = ma ⇒ [M][LT⁻²] = [MLT⁻²].",
  },
  {
    q: (ch: string) => `Related to ${ch}: if speed is doubled, kinetic energy becomes:`,
    o: ["2 times", "4 times", "Half", "Unchanged"],
    c: 1,
    e: "KE ∝ v² ⇒ doubling v multiplies KE by 4.",
  },
];

const CHEM_TEMPLATES = [
  {
    q: (ch: string) => `In ${ch}, Avogadro's number is approximately:`,
    o: ["6.022×10²³", "3.14×10⁸", "1.6×10⁻¹⁹", "9.1×10⁻³¹"],
    c: 0,
    e: "N_A ≈ 6.022×10²³ mol⁻¹.",
  },
  {
    q: (ch: string) => `Related to ${ch}: pH of pure water at 25°C is:`,
    o: ["0", "7", "14", "1"],
    c: 1,
    e: "Neutral water: [H⁺]=10⁻⁷ ⇒ pH=7.",
  },
];

const MATH_TEMPLATES = [
  {
    q: (ch: string) => `From ${ch}: roots of x² − 5x + 6 = 0 are:`,
    o: ["2 and 3", "1 and 6", "−2 and −3", "5 and 1"],
    c: 0,
    e: "(x−2)(x−3)=0.",
  },
  {
    q: (ch: string) => `In ${ch}, i² equals:`,
    o: ["1", "−1", "i", "0"],
    c: 1,
    e: "By definition i² = −1.",
  },
];

const ZOO_TEMPLATES = [
  {
    q: (ch: string) => `In Zoology (${ch}), which organ is responsible for pumping blood?`,
    o: ["Lungs", "Kidneys", "Heart", "Brain"],
    c: 2,
    e: "The heart pumps oxygenated and deoxygenated blood.",
  },
  {
    q: (ch: string) => `From ${ch}: basic structural unit of kidney is:`,
    o: ["Neuron", "Nephron", "Alveolus", "Hepatocyte"],
    c: 1,
    e: "Nephrons filter blood and produce urine.",
  },
];

const BOT_TEMPLATES = [
  {
    q: (ch: string) => `In Botany (${ch}), photosynthesis primarily takes place in:`,
    o: ["Roots", "Leaves", "Stems", "Flowers"],
    c: 1,
    e: "Leaves contain chloroplasts with chlorophyll for photosynthesis.",
  },
  {
    q: (ch: string) => `From ${ch}: the green pigment in plants is:`,
    o: ["Carotene", "Xanthophyll", "Chlorophyll", "Melanin"],
    c: 2,
    e: "Chlorophyll absorbs red and blue light to power photosynthesis.",
  },
];

const GA_TEMPLATES = [
  {
    q: (ch: string) => `In General Ability (${ch}), find the synonym of 'Diligent':`,
    o: ["Lazy", "Hardworking", "Careless", "Clever"],
    c: 1,
    e: "Diligent means showing care and conscientiousness; hardworking.",
  },
  {
    q: (ch: string) => `From ${ch}: Indian Independence was achieved in:`,
    o: ["1942", "1947", "1950", "1935"],
    c: 1,
    e: "India got independence on August 15, 1947.",
  },
];

function templatesFor(subject: JeeSubjectKey) {
  if (subject === "physics") return PHY_TEMPLATES;
  if (subject === "chemistry") return CHEM_TEMPLATES;
  if (subject === "math") return MATH_TEMPLATES;
  if (subject === "zoology") return ZOO_TEMPLATES;
  if (subject === "botany") return BOT_TEMPLATES;
  return GA_TEMPLATES;
}

function chapters(subject: JeeSubjectKey) {
  if (subject === "physics") return PHYSICS_CHAPTERS;
  if (subject === "chemistry") return CHEMISTRY_CHAPTERS;
  if (subject === "math") return MATH_CHAPTERS;
  if (subject === "zoology") return ZOOLOGY_CHAPTERS;
  if (subject === "botany") return BOTANY_CHAPTERS;
  return GENERAL_ABILITY_CHAPTERS;
}

function buildExam(exam: JeeExamKey, perChapter: number, yearBase: number, subjects: JeeSubjectKey[]): SeedJeeQ[] {
  const out: SeedJeeQ[] = [];
  const diffs = ["Easy", "Medium", "Hard"] as const;

  for (const subject of subjects) {
    const chs = chapters(subject);
    const tpls = templatesFor(subject);
    for (const ch of chs) {
      for (let i = 0; i < perChapter; i++) {
        const tpl = tpls[i % tpls.length];
        const n = i + 1;
        out.push({
          exam,
          subject,
          chapter: ch.slug,
          number: `Q.${n}`,
          difficulty: diffs[i % diffs.length],
          questionText: tpl.q(ch.name),
          options: [...tpl.o],
          correctIndex: tpl.c,
          explanation: tpl.e,
          // Years rotating: 2026, 2025, 2024 to make trend arrows interesting!
          year: yearBase - (i % 3),
          isPyq: i % 2 === 0,
          tags: [exam, subject, ch.slug, "Entrance"],
        });
      }
    }
  }
  return out;
}

export const seedJeeQuestions: SeedJeeQ[] = [
  ...buildExam("jee-main", 4, 2026, ["physics", "chemistry", "math"]),
  ...buildExam("jee-advanced", 3, 2026, ["physics", "chemistry", "math"]),
  ...buildExam("bitsat", 3, 2026, ["physics", "chemistry", "math"]),
  ...buildExam("neet", 3, 2026, ["physics", "chemistry", "zoology", "botany"]),
  ...buildExam("ts-eamcet", 3, 2025, ["physics", "chemistry", "math"]),
  ...buildExam("ap-eamcet", 3, 2025, ["physics", "chemistry", "math"]),
  ...buildExam("nda", 3, 2026, ["math", "general-ability"]),
];
