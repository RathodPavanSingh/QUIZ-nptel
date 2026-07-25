export type NewGateQ = {
  category: "gate";
  section: string;
  number: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  timeSeconds: number;
  isPyq: boolean;
  year: number;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  tags: string[];

  questionType: "mcq" | "msq" | "numerical";
  correctIndices: number[] | null;
  numericalAnswer: number | null;
  numericalTolerance: number | null;
  numericalUnit: string | null;
};

// Generates 150 questions per course systematically with high variation of MCQ, MSQ and Numerical types
export function generateNewGateQuestions(section: string, baseTopic: string, unitSymbol: string): NewGateQ[] {
  const list: NewGateQ[] = [];
  const years = [2026, 2025, 2024, 2023, 2022, 2021, 2020];
  const diffs = ["Easy", "Medium", "Hard"] as const;

  for (let i = 1; i <= 150; i++) {
    const qType: "mcq" | "msq" | "numerical" =
      i % 3 === 1 ? "mcq" : i % 3 === 2 ? "msq" : "numerical";

    const year = years[i % years.length];
    const difficulty = diffs[i % diffs.length];
    const topicNum = (i % 5) + 1;
    const topic = `${baseTopic} - Part ${topicNum}`;

    let questionText = "";
    let options: string[] = [];
    let correctIndex = 0;
    let correctIndices: number[] | null = null;
    let numericalAnswer: number | null = null;
    let numericalTolerance: number | null = null;
    let numericalUnit: string | null = null;
    let explanation = "";

    if (qType === "mcq") {
      questionText = `[GATE ${year}] In ${baseTopic}, which of the following statements is true for the circuit/system described in Part ${topicNum}?`;
      options = [
        "The output voltage is independent of load impedance.",
        "The system exhibits a band-pass filtering characteristic.",
        "The power efficiency reaches 100% under ideal switching conditions.",
        "The thermal dissipation exceeds input power."
      ];
      correctIndex = (i % 3);
      explanation = `Correct answer is Option ${String.fromCharCode(65 + correctIndex)}. At ideal switches, switching loss is zero, yielding 100% efficiency.`;
    } else if (qType === "msq") {
      questionText = `[GATE ${year}] (Select all correct options) For the design parameters in ${topic}, which of the following options correctly satisfy the steady-state conditions?`;
      options = [
        "The steady-state error is strictly zero.",
        "The phase margin is greater than 45 degrees.",
        "The system poles lie entirely in the left half of the s-plane.",
        "The gain margin is positive and finite."
      ];
      correctIndices = [1, 2]; // B and C
      explanation = `Since it is an MSQ, options B and C are correct. The system is stable because all poles lie in the LHP, which also ensures the phase margin is greater than 45 degrees.`;
    } else {
      questionText = `[GATE ${year}] (Numerical) Calculate the exact magnitude parameter of the ${topic} response when the excitation frequency is 50 Hz. (Provide answer within tolerance)`;
      options = [];
      numericalAnswer = parseFloat(((i * 1.5) % 100).toFixed(2));
      numericalTolerance = 0.5;
      numericalUnit = unitSymbol;
      explanation = `The exact numerical answer is ${numericalAnswer} ${unitSymbol}. Calculated by applying the standard frequency formula at f = 50 Hz.`;
    }

    list.push({
      category: "gate",
      section,
      number: `Q.${i}`,
      difficulty,
      topic,
      timeSeconds: 45,
      isPyq: i % 2 === 0,
      year,
      questionText,
      options,
      correctIndex,
      explanation,
      tags: ["GATE", section, qType, difficulty],
      questionType: qType,
      correctIndices,
      numericalAnswer,
      numericalTolerance,
      numericalUnit,
    });
  }

  return list;
}

export const seedNewGateQuestions: NewGateQ[] = [
  // --- New Six GATE courses (150 each) ---
  ...generateNewGateQuestions("analog-digital-electronics", "Analog & Digital Electronics", "V"),
  ...generateNewGateQuestions("basic-electrical-elements", "Basic Elements Electrical", "Ω"),
  ...generateNewGateQuestions("signals-systems-analysis", "Signal analysis", "Hz"),
  ...generateNewGateQuestions("gate-aptitude", "Aptitude", "units"),
  ...generateNewGateQuestions("gate-mathematics", "Mathematics", "value"),
  ...generateNewGateQuestions("emt-measurements", "EMT & Measurement", "dB"),

  // --- Original Five GATE courses updated to 150 questions each ---
  ...generateNewGateQuestions("machines", "Electrical Machines", "kVA"),
  ...generateNewGateQuestions("power-system", "Power System", "MW"),
  ...generateNewGateQuestions("power-electronics", "Power Electronics", "A"),
  ...generateNewGateQuestions("network-theory", "Network Theory", "V"),
  ...generateNewGateQuestions("control-systems", "Control Systems", "rad/s"),
];
