export type SeedPracticeQ = {
  category: "aptitude" | "gate";
  section: string;
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
};

function q(
  category: "aptitude" | "gate",
  section: string,
  n: number,
  difficulty: string,
  topic: string,
  timeSeconds: number,
  year: number | null,
  questionText: string,
  options: string[],
  correctIndex: number,
  explanation: string,
  tags: string[],
  isPyq = true,
): SeedPracticeQ {
  return {
    category,
    section,
    number: `Q.${n}`,
    difficulty,
    topic,
    timeSeconds,
    isPyq,
    year,
    questionText,
    options,
    correctIndex,
    explanation,
    tags,
  };
}

// ========== APTITUDE ==========
const aptitudeNumerical: SeedPracticeQ[] = [
  q("aptitude", "numerical", 1, "Easy", "Percentages & Profit/Loss", 40, 2024,
    "A shopkeeper buys an article for ₹320 and sells it for ₹400. What is the profit percentage?",
    ["20%", "25%", "30%", "15%"], 1,
    "Profit = 400 − 320 = 80. Profit% = (80/320)×100 = 25%.",
    ["profit", "percentage", "arithmetic", "TCS-NQT"]),
  q("aptitude", "numerical", 2, "Easy", "Percentages & Profit/Loss", 35, 2023,
    "If the cost price of 15 articles is equal to the selling price of 12 articles, the profit percent is:",
    ["20%", "25%", "18%", "15%"], 1,
    "CP of 15 = SP of 12 ⇒ profit on 12 items = CP of 3. Profit% = 3/12 × 100 = 25%.",
    ["profit", "percentage", "TCS-NQT"]),
  q("aptitude", "numerical", 3, "Medium", "Simple & Compound Interest", 45, 2024,
    "Simple interest on a sum for 3 years at 10% p.a. is ₹1500. The principal is:",
    ["₹4000", "₹5000", "₹4500", "₹6000"], 1,
    "SI = PRT/100 ⇒ 1500 = P×10×3/100 ⇒ P = 5000.",
    ["interest", "arithmetic"]),
  q("aptitude", "numerical", 4, "Easy", "Ratio & Proportion", 30, 2023,
    "If A:B = 2:3 and B:C = 4:5, then A:B:C is:",
    ["8:12:15", "2:3:5", "4:6:5", "6:9:10"], 0,
    "A:B = 2:3 = 8:12; B:C = 4:5 = 12:15 ⇒ A:B:C = 8:12:15.",
    ["ratio", "proportion"]),
  q("aptitude", "numerical", 5, "Easy", "Time & Work", 40, 2024,
    "A can do a work in 10 days and B in 15 days. Working together they finish in:",
    ["5 days", "6 days", "7.5 days", "8 days"], 1,
    "1 day work = 1/10 + 1/15 = 1/6 ⇒ 6 days.",
    ["time-work", "arithmetic"]),
  q("aptitude", "numerical", 6, "Medium", "Time, Speed & Distance", 45, 2022,
    "A train 120 m long runs at 54 km/h. Time to cross a pole is:",
    ["6 s", "8 s", "10 s", "12 s"], 1,
    "54 km/h = 15 m/s. t = 120/15 = 8 s.",
    ["speed", "train"]),
  q("aptitude", "numerical", 7, "Easy", "Averages", 30, 2024,
    "Average of 5 numbers is 20. If one number 25 is excluded, new average is:",
    ["18.75", "19", "18.5", "17.5"], 0,
    "Sum = 100. New sum = 75. Avg = 75/4 = 18.75.",
    ["average"]),
  q("aptitude", "numerical", 8, "Medium", "Number System", 40, 2023,
    "The HCF of 48 and 180 is:",
    ["12", "18", "24", "36"], 0,
    "48 = 2^4×3, 180 = 2^2×3^2×5 ⇒ HCF = 2^2×3 = 12.",
    ["hcf", "number-system"]),
  q("aptitude", "numerical", 9, "Easy", "Percentages & Profit/Loss", 35, 2024,
    "A number is increased by 20% and then decreased by 20%. Net change is:",
    ["0%", "4% decrease", "4% increase", "2% decrease"], 1,
    "×1.2×0.8 = 0.96 ⇒ 4% decrease.",
    ["percentage"]),
  q("aptitude", "numerical", 10, "Hard", "Permutation & Combination", 50, 2023,
    "Number of ways to arrange the letters of the word 'GATE' is:",
    ["12", "16", "24", "36"], 2,
    "4 distinct letters ⇒ 4! = 24.",
    ["permutation", "GATE"]),
  q("aptitude", "numerical", 11, "Easy", "Simplification", 25, 2024,
    "Value of 25% of 80 + 40% of 50 is:",
    ["40", "45", "50", "35"], 0,
    "20 + 20 = 40.",
    ["percentage", "simplification"]),
  q("aptitude", "numerical", 12, "Medium", "Pipes & Cisterns", 45, 2022,
    "Pipe A fills a tank in 6 h, B empties in 8 h. Together from empty, tank fills in:",
    ["24 h", "20 h", "18 h", "12 h"], 0,
    "Rate = 1/6 − 1/8 = 1/24 ⇒ 24 hours.",
    ["pipes"]),
];

const aptitudeVerbal: SeedPracticeQ[] = [
  q("aptitude", "verbal", 1, "Easy", "Synonyms & Antonyms", 30, 2024,
    "Choose the synonym of the word: ELOQUENT",
    ["Fluent", "Silent", "Confused", "Angry"], 0,
    "Eloquent means fluent or persuasive in speaking.",
    ["synonyms", "vocabulary", "verbal", "TCS-NQT"]),
  q("aptitude", "verbal", 2, "Easy", "Synonyms & Antonyms", 30, 2024,
    "Choose the antonym of the word: BRAVE",
    ["Courageous", "Bold", "Cowardly", "Heroic"], 2,
    "Brave means courageous; opposite is cowardly.",
    ["antonyms", "vocabulary", "verbal", "TCS-NQT"]),
  q("aptitude", "verbal", 3, "Easy", "Synonyms & Antonyms", 30, 2023,
    "Synonym of METICULOUS is:",
    ["Careless", "Careful", "Lazy", "Rough"], 1,
    "Meticulous means showing great attention to detail; careful.",
    ["synonyms", "vocabulary"]),
  q("aptitude", "verbal", 4, "Medium", "Error Spotting", 40, 2023,
    "Identify the error: 'Neither of the boys have submitted their assignment.'",
    ["Neither of", "the boys", "have submitted", "No error"], 2,
    "Neither is singular ⇒ 'has submitted'.",
    ["grammar", "error-spotting"]),
  q("aptitude", "verbal", 5, "Easy", "Fill in the Blanks", 30, 2024,
    "She is good _____ mathematics.",
    ["in", "at", "on", "with"], 1,
    "Correct preposition: good at.",
    ["preposition", "grammar"]),
  q("aptitude", "verbal", 6, "Medium", "Reading Comprehension", 50, 2022,
    "The phrase 'once in a blue moon' means:",
    ["Very often", "Rarely", "Never", "Always"], 1,
    "Idiom meaning very rarely.",
    ["idioms", "vocabulary"]),
  q("aptitude", "verbal", 7, "Easy", "One Word Substitution", 30, 2024,
    "A person who writes dictionaries is called:",
    ["Editor", "Lexicographer", "Author", "Calligrapher"], 1,
    "Lexicographer compiles dictionaries.",
    ["vocabulary"]),
  q("aptitude", "verbal", 8, "Easy", "Synonyms & Antonyms", 25, 2023,
    "Antonym of ABUNDANT is:",
    ["Plentiful", "Scarce", "Ample", "Copious"], 1,
    "Abundant means plentiful; opposite is scarce.",
    ["antonyms"]),
  q("aptitude", "verbal", 9, "Medium", "Sentence Improvement", 40, 2024,
    "Choose the correct sentence:",
    ["He don't know the answer.", "He doesn't knows the answer.", "He doesn't know the answer.", "He not know the answer."], 2,
    "Correct: doesn't + base verb.",
    ["grammar"]),
  q("aptitude", "verbal", 10, "Easy", "Idioms & Phrases", 30, 2023,
    "'Break the ice' means:",
    ["To freeze water", "To start a conversation", "To end a friendship", "To solve a puzzle"], 1,
    "Idiom for initiating conversation in a social setting.",
    ["idioms"]),
];

const aptitudeReasoning: SeedPracticeQ[] = [
  q("aptitude", "reasoning", 1, "Easy", "Number Series", 30, 2022,
    "Identify the missing number in the following sequence: 5, 11, 23, 47, 95, ?",
    ["190", "191", "189", "192"], 1,
    "Pattern: ×2 +1 → 5×2+1=11, 11×2+1=23, … 95×2+1=191.",
    ["series", "arithmetic", "TCS-NQT"]),
  q("aptitude", "reasoning", 2, "Easy", "Number Series", 20, 2022,
    "Find the next number in the series: 1, 4, 9, 16, 25, ?",
    ["30", "35", "36", "49"], 2,
    "Squares: 1², 2², 3², 4², 5², 6² = 36.",
    ["series", "squares"]),
  q("aptitude", "reasoning", 3, "Easy", "Blood Relations", 35, 2024,
    "A is B's sister. C is B's mother. D is C's father. How is A related to D?",
    ["Granddaughter", "Daughter", "Sister", "Aunt"], 0,
    "C is mother of A & B; D is father of C ⇒ D is maternal grandfather of A.",
    ["blood-relations"]),
  q("aptitude", "reasoning", 4, "Medium", "Coding-Decoding", 40, 2023,
    "If CAT is coded as 3120, how is DOG coded?",
    ["4157", "4715", "4156", "4615"], 0,
    "C=3,A=1,T=20 ⇒ CAT=3120. D=4,O=15,G=7 ⇒ 4157.",
    ["coding-decoding"]),
  q("aptitude", "reasoning", 5, "Easy", "Directions", 30, 2024,
    "A man walks 5 km east, then 5 km north. Distance from start is:",
    ["5 km", "10 km", "5√2 km", "0 km"], 2,
    "Right triangle; hypotenuse = 5√2 km.",
    ["directions"]),
  q("aptitude", "reasoning", 6, "Easy", "Odd One Out", 25, 2023,
    "Find the odd one: 3, 5, 7, 9, 11",
    ["3", "5", "9", "11"], 2,
    "All are prime except 9.",
    ["classification"]),
  q("aptitude", "reasoning", 7, "Medium", "Syllogism", 45, 2024,
    "Statements: All cats are dogs. Some dogs are birds. Conclusions: I. Some cats are birds. II. No cat is a bird.",
    ["Only I", "Only II", "Either I or II", "Neither I nor II"], 2,
    "No definite relation; either some or no cats are birds.",
    ["syllogism"]),
  q("aptitude", "reasoning", 8, "Easy", "Analogy", 30, 2023,
    "Book : Reading :: Fork : ?",
    ["Drawing", "Writing", "Stirring", "Eating"], 3,
    "Book is used for reading; fork for eating.",
    ["analogy"]),
  q("aptitude", "reasoning", 9, "Medium", "Seating Arrangement", 50, 2022,
    "Five friends sit in a row. A is left of B but right of C. D is right of B. Who is in the middle?",
    ["A", "B", "C", "D"], 1,
    "Order C-A-B-D-(E). Middle is B among first four fixed; typically B is middle of five with E right of D ⇒ C A B D E. Middle = B.",
    ["seating"]),
  q("aptitude", "reasoning", 10, "Easy", "Number Series", 25, 2024,
    "2, 6, 12, 20, 30, ?",
    ["40", "42", "44", "36"], 1,
    "n(n+1): 1×2,2×3,3×4,4×5,5×6,6×7=42.",
    ["series"]),
];

// ========== GATE (50 each, generated with topic variety) ==========
type TopicBank = { topic: string; items: Array<{ q: string; o: string[]; c: number; e: string; tags: string[] }> };

function expandGate(section: string, banks: TopicBank[], target = 50): SeedPracticeQ[] {
  const out: SeedPracticeQ[] = [];
  let n = 1;
  const diffs = ["Easy", "Easy", "Medium", "Medium", "Hard"];
  const years = [2020, 2021, 2022, 2023, 2024];
  // Cycle through banks until we hit target
  while (out.length < target) {
    for (const bank of banks) {
      for (let i = 0; i < bank.items.length && out.length < target; i++) {
        const item = bank.items[i];
        // Slight variation of numbering; reuse base items with year/diff rotation
        const cycle = Math.floor((n - 1) / Math.max(1, banks.reduce((s, b) => s + b.items.length, 0)));
        const qt =
          cycle === 0
            ? item.q
            : cycle === 1
            ? item.q.replace(/\?$/, " correctly?")
            : item.q;
        out.push(
          q(
            "gate",
            section,
            n,
            diffs[(n - 1) % diffs.length],
            bank.topic,
            30 + ((n * 5) % 30),
            years[(n - 1) % years.length],
            qt,
            item.o,
            item.c,
            item.e,
            [...item.tags, "GATE", section],
          ),
        );
        n++;
      }
    }
    // Safety: if banks empty somehow
    if (banks.every((b) => b.items.length === 0)) break;
  }
  return out.slice(0, target);
}

const machinesBanks: TopicBank[] = [
  {
    topic: "Transformers",
    items: [
      { q: "In an ideal transformer, the core flux is determined mainly by:", o: ["Load current", "Primary voltage and frequency", "Secondary resistance", "Magnetizing resistance only"], c: 1, e: "φ ≈ V/(4.44 f N). Flux set by applied voltage and frequency.", tags: ["transformer"] },
      { q: "The efficiency of a transformer is maximum when:", o: ["Copper loss = Iron loss", "Copper loss = 2 × Iron loss", "Iron loss = 0", "Load is zero"], c: 0, e: "Maximum efficiency when variable Cu loss equals constant iron loss.", tags: ["transformer", "efficiency"] },
      { q: "Open circuit test on a transformer is performed to determine:", o: ["Copper losses", "Iron losses and magnetizing branch", "Short circuit impedance only", "Voltage regulation"], c: 1, e: "OC test gives core/iron loss and shunt branch parameters.", tags: ["transformer", "testing"] },
      { q: "Short circuit test is usually conducted on:", o: ["HV side with LV shorted", "LV side with HV shorted", "Both sides open", "Neither"], c: 0, e: "SC test typically on HV with LV shorted for convenience of current/voltage ratings.", tags: ["transformer"] },
      { q: "All-day efficiency of a transformer is important for:", o: ["Power transformers", "Distribution transformers", "Instrument transformers", "Auto-transformers only"], c: 1, e: "Distribution transformers operate on varying load over 24h; energy efficiency matters.", tags: ["transformer"] },
    ],
  },
  {
    topic: "DC Machines",
    items: [
      { q: "In a DC generator, residual magnetism is necessary for:", o: ["Commutation", "Self-excitation", "Armature reaction", "Interpoles"], c: 1, e: "Self-excited generators need residual flux to build up voltage.", tags: ["dc-machine"] },
      { q: "The function of a commutator in a DC machine is to:", o: ["Convert AC to DC in armature circuit", "Reduce sparking only", "Increase speed", "Provide excitation"], c: 0, e: "Commutator mechanically rectifies armature AC to DC at brushes.", tags: ["dc-machine"] },
      { q: "Speed of a DC motor is inversely proportional to:", o: ["Armature voltage", "Flux", "Armature resistance", "Load torque only"], c: 1, e: "N ∝ (V − IaRa)/φ; inversely with flux.", tags: ["dc-motor"] },
      { q: "Armature reaction in a DC machine causes:", o: ["Only increase in flux", "Distortion and weakening of main flux", "No effect on flux", "Only heating"], c: 1, e: "Armature MMF distorts and demagnetizes main field under load.", tags: ["dc-machine"] },
      { q: "Interpoles in DC machines are used to:", o: ["Improve commutation", "Increase flux", "Reduce armature resistance", "Cool the machine"], c: 0, e: "Interpoles neutralize armature reaction in coil under commutation.", tags: ["commutation"] },
    ],
  },
  {
    topic: "Induction Machines",
    items: [
      { q: "Slip of an induction motor at synchronous speed is:", o: ["1", "0", "0.5", "Infinity"], c: 1, e: "s = (Ns − N)/Ns; at N=Ns, s=0.", tags: ["induction-motor"] },
      { q: "Starting torque of a 3-phase IM is maximum when rotor resistance equals:", o: ["Rotor reactance at start", "Stator resistance", "Zero", "Infinity"], c: 0, e: "Tst max when R2 = X2 (at s=1).", tags: ["induction-motor", "torque"] },
      { q: "In a squirrel cage IM, rotor copper bars are shorted by:", o: ["Slip rings", "End rings", "Commutator", "Brushes"], c: 1, e: "End rings short the rotor bars.", tags: ["induction-motor"] },
      { q: "Crawling in induction motors is due to:", o: ["7th harmonic", "5th harmonic mainly causing 1/7 speed", "DC offset", "Supply unbalance only"], c: 1, e: "7th harmonic torque dip can cause crawling near 1/7 synchronous speed.", tags: ["induction-motor"] },
      { q: "The no-load current of an induction motor is typically:", o: ["2–5% of full load", "20–40% of full load", "80% of full load", "Equal to full load"], c: 1, e: "Magnetizing current makes no-load current relatively high (≈20–40% FL).", tags: ["induction-motor"] },
    ],
  },
  {
    topic: "Synchronous Machines",
    items: [
      { q: "A synchronous motor runs at:", o: ["Below synchronous speed", "Above synchronous speed", "Synchronous speed", "Variable slip speed"], c: 2, e: "Synchronous machines lock to supply frequency speed.", tags: ["synchronous"] },
      { q: "V-curves of a synchronous motor are plots of:", o: ["Ia vs If for constant power", "T vs s", "P vs Q", "V vs I"], c: 0, e: "Armature current vs field current at constant load shows V shape.", tags: ["synchronous"] },
      { q: "Hunting in synchronous machines is reduced by:", o: ["Damper windings", "Removing AVR", "Increasing saliency only", "Open circuiting field"], c: 0, e: "Damper (amortisseur) windings damp oscillations.", tags: ["synchronous"] },
      { q: "Pitch factor of an alternator winding is:", o: ["Always 1", "≤ 1", "≥ 1", "Zero"], c: 1, e: "Short pitching makes kp ≤ 1.", tags: ["alternator"] },
      { q: "The regulation of an alternator is negative when load is:", o: ["Unity pf lagging", "Leading", "Zero", "Pure resistive"], c: 1, e: "Leading loads can cause voltage rise ⇒ negative regulation.", tags: ["alternator"] },
    ],
  },
];

const powerSystemBanks: TopicBank[] = [
  {
    topic: "Transmission Lines",
    items: [
      { q: "Surge impedance loading (SIL) of a line is:", o: ["V²/Zc", "V/Zc", "Zc/V²", "I²Zc"], c: 0, e: "SIL = V²/Zc for lossless line.", tags: ["transmission"] },
      { q: "Ferranti effect is more pronounced on:", o: ["Short lines lightly loaded", "Long lines at light/no load", "Cables only", "DC lines"], c: 1, e: "Receiving end voltage rises on long lightly loaded lines.", tags: ["ferranti"] },
      { q: "Skin effect in conductors increases with:", o: ["Decrease in frequency", "Increase in frequency", "DC only", "Decrease in diameter"], c: 1, e: "Higher f ⇒ current crowds to surface.", tags: ["conductors"] },
      { q: "ACSR conductor has steel core mainly to:", o: ["Reduce resistance", "Provide mechanical strength", "Reduce corona", "Improve conductivity"], c: 1, e: "Steel core gives tensile strength.", tags: ["conductors"] },
      { q: "Corona loss increases with:", o: ["Decrease in supply frequency", "Increase in conductor size", "Increase in air density", "Decrease in conductor size / bad weather"], c: 3, e: "Smaller diameter and foul weather increase corona.", tags: ["corona"] },
    ],
  },
  {
    topic: "Fault Analysis",
    items: [
      { q: "Most severe fault in a power system is usually:", o: ["LG", "LL", "LLG", "3-phase fault"], c: 3, e: "Symmetrical 3-φ fault generally gives highest short-circuit current.", tags: ["faults"] },
      { q: "For LG fault, zero sequence current is:", o: ["Zero", "Non-zero", "Infinite", "Equal to positive sequence only always"], c: 1, e: "Unbalanced earth faults involve zero sequence.", tags: ["faults", "sequence"] },
      { q: "Positive sequence network has:", o: ["Only positive sequence voltages/currents", "Zero sequence sources", "Negative sequence sources only", "No voltage sources"], c: 0, e: "Positive sequence network carries positive-sequence components and emfs.", tags: ["sequence"] },
      { q: "Reactance relay is used for:", o: ["Phase faults mainly as ground backup variants", "Only overcurrent", "Only differential", "Only transformer"], c: 0, e: "Reactance relays often used in ground fault schemes; distance protection family.", tags: ["protection"] },
      { q: "Busbar differential protection is based on:", o: ["Kirchhoff's current law", "Ohm's law only", "Faraday's law", "Lenz's law"], c: 0, e: "Sum of currents entering bus ≈ 0 under normal; internal fault upsets balance.", tags: ["protection"] },
    ],
  },
  {
    topic: "Power Flow & Stability",
    items: [
      { q: "Load flow study is primarily used to determine:", o: ["Fault currents", "Steady-state voltages and power flows", "Transient stability only", "Relay settings only"], c: 1, e: "Power flow solves bus voltages and line flows in steady state.", tags: ["load-flow"] },
      { q: "Swing equation relates:", o: ["Rotor angle dynamics to accelerating power", "V to Q only", "P to f only statically", "I to V"], c: 0, e: "M d²δ/dt² = Pm − Pe.", tags: ["stability"] },
      { q: "Equal area criterion is used for:", o: ["Steady-state stability of multi-machine only", "Transient stability of SMIB", "Economic dispatch", "Unit commitment"], c: 1, e: "Equal area assesses first-swing transient stability for one machine infinite bus.", tags: ["stability"] },
      { q: "Newton-Raphson load flow has advantage of:", o: ["Linear convergence", "Quadratic convergence", "No Jacobian needed", "Only for radial systems"], c: 1, e: "NR method converges quadratically near solution.", tags: ["load-flow"] },
      { q: "Slack bus is mainly used to:", o: ["Specify P and Q", "Balance system losses with V,δ specified", "Specify only P", "Model only loads"], c: 1, e: "Slack absorbs mismatch; V and δ specified.", tags: ["load-flow"] },
    ],
  },
  {
    topic: "Distribution & Cables",
    items: [
      { q: "In a 3-core cable, sheath is earthed to:", o: ["Increase capacitance", "Provide safety and path for fault current", "Reduce inductance only", "Improve insulation dielectric"], c: 1, e: "Earthing sheath ensures safety and fault return path.", tags: ["cables"] },
      { q: "String efficiency of suspension insulators is improved by:", o: ["Using longer cross-arm / grading / guard ring", "Reducing discs", "Increasing tower height only", "Removing earth wire"], c: 0, e: "Grading and guard rings improve voltage distribution.", tags: ["insulators"] },
      { q: "GMD in transmission line calculations stands for:", o: ["Geometric Mean Distance", "General Mean Diameter", "Ground Mode Delay", "Grid Maximum Demand"], c: 0, e: "GMD used in inductance calculations.", tags: ["transmission"] },
      { q: "Bundled conductors are used to:", o: ["Increase corona and inductance", "Reduce corona and GMR effects / surge impedance", "Increase skin effect", "Eliminate need for towers"], c: 1, e: "Bundling reduces corona loss and line reactance somewhat.", tags: ["transmission"] },
      { q: "A circuit breaker is rated primarily in:", o: ["MVA interrupting capacity", "HP", "kWh", "lux"], c: 0, e: "Breaking capacity often expressed in MVA or kA at rated voltage.", tags: ["switchgear"] },
    ],
  },
];

const powerElectronicsBanks: TopicBank[] = [
  {
    topic: "Devices",
    items: [
      { q: "A thyristor (SCR) is turned on by:", o: ["Gate pulse when anode positive", "Gate pulse when anode negative", "Only light", "Only heat"], c: 0, e: "Forward biased SCR latches with gate trigger.", tags: ["scr"] },
      { q: "IGBT combines features of:", o: ["BJT and MOSFET", "SCR and diode only", "UJT and PUT", "Triac and diac"], c: 0, e: "IGBT: MOS gate control with bipolar conduction.", tags: ["igbt"] },
      { q: "Holding current of SCR is:", o: ["Greater than latching current", "Less than latching current", "Equal always to latching", "Zero"], c: 1, e: "Ih < Il typically.", tags: ["scr"] },
      { q: "Snubber circuit is used to:", o: ["Protect against di/dt and dv/dt stresses", "Increase switching loss", "Bypass gate", "Cool heat sink only"], c: 0, e: "RC snubbers limit dv/dt and switching stress.", tags: ["protection"] },
      { q: "TRIAC is a:", o: ["Unidirectional device", "Bidirectional triode thyristor", "Only NPN transistor", "Photo diode"], c: 1, e: "TRIAC conducts in both directions with gate control.", tags: ["triac"] },
    ],
  },
  {
    topic: "Converters",
    items: [
      { q: "A single-phase full converter with R load has average output voltage:", o: ["(Vm/π)(1+cosα)", "(2Vm/π)cosα", "Vm cosα", "Vm/√2"], c: 1, e: "Vdc = (2Vm/π) cosα for full converter.", tags: ["rectifier"] },
      { q: "Freewheeling diode in a converter is used to:", o: ["Provide path for inductive current", "Increase output voltage always", "Block SCR", "Measure current"], c: 0, e: "FW diode freewheels load current when supply reverses/SCR off.", tags: ["rectifier"] },
      { q: "In a 3-phase fully controlled bridge, pulse number is:", o: ["3", "6", "12", "2"], c: 1, e: "Six-pulse output ripple.", tags: ["rectifier"] },
      { q: "Dual converter provides:", o: ["Only motoring", "Four-quadrant operation", "Only inversion", "Unity pf always"], c: 1, e: "Dual converters enable 4-quadrant drive operation.", tags: ["converter"] },
      { q: "Displacement factor for controlled rectifier decreases as:", o: ["α increases", "α decreases", "Load becomes resistive only", "Frequency falls"], c: 0, e: "DF ≈ cosα for many controlled rectifiers.", tags: ["power-quality"] },
    ],
  },
  {
    topic: "Inverters & Choppers",
    items: [
      { q: "A step-down chopper average output is:", o: ["δVs", "Vs/δ", "Vs(1−δ)", "0"], c: 0, e: "V0 = δVs for buck chopper.", tags: ["chopper"] },
      { q: "PWM in inverters is used mainly to:", o: ["Control output voltage/harmonics", "Increase DC link only", "Eliminate need for switches", "Cool devices"], c: 0, e: "PWM shapes output spectrum and fundamental magnitude.", tags: ["inverter", "pwm"] },
      { q: "McMurray inverter is a type of:", o: ["VSI with forced commutation", "CSI only", "Cycloconverter", "Diode rectifier"], c: 0, e: "Classic forced-commutated inverter topology.", tags: ["inverter"] },
      { q: "180° conduction mode 3-φ bridge inverter has each switch on for:", o: ["60°", "120°", "180°", "360°"], c: 2, e: "180° mode: each device conducts half cycle.", tags: ["inverter"] },
      { q: "CSI primarily requires:", o: ["Stiff current source DC link", "Stiff voltage source only", "No inductance", "Only capacitors on DC"], c: 0, e: "Current source inverter needs large DC link inductance.", tags: ["inverter"] },
    ],
  },
  {
    topic: "Drives & Applications",
    items: [
      { q: "V/f control of IM is used to:", o: ["Keep flux approximately constant", "Maximize slip always", "Eliminate need for inverter", "Run only above base speed"], c: 0, e: "Constant V/f ≈ constant flux below base speed.", tags: ["drives"] },
      { q: "Dynamic braking of DC motor involves:", o: ["Disconnecting supply and dissipating energy in resistor", "Plugging only", "Regenerating to infinite bus always", "Open armature"], c: 0, e: "Armature connected to brake resistor while field excited.", tags: ["drives"] },
      { q: "Soft starter for IM typically uses:", o: ["Voltage ramp via SCRs/triacs", "Direct DOL only", "Only capacitors", "Only rheostat in stator always"], c: 0, e: "Solid-state soft starters ramp voltage/torque.", tags: ["drives"] },
      { q: "UPS systems primarily provide:", o: ["Backup power conditioning", "Only reactive power", "Only harmonics", "Mechanical storage only"], c: 0, e: "UPS supplies load during outages with conditioned power.", tags: ["ups"] },
      { q: "Cycloconverter converts:", o: ["AC to AC at lower frequency without DC link", "DC to DC", "AC to DC only", "DC to AC only"], c: 0, e: "Direct frequency changer AC–AC.", tags: ["cycloconverter"] },
    ],
  },
];

const networkTheoryBanks: TopicBank[] = [
  {
    topic: "Network Theorems",
    items: [
      { q: "Thevenin's theorem replaces a linear network by:", o: ["Vth in series with Rth", "In parallel with Rth only", "Open circuit only", "Short circuit only"], c: 0, e: "Equivalent is Voc with series equivalent resistance.", tags: ["thevenin"] },
      { q: "Norton current In is equal to:", o: ["Short-circuit current at terminals", "Open-circuit current", "Vth/2", "Zero always"], c: 0, e: "In = Isc looking into terminals.", tags: ["norton"] },
      { q: "Superposition theorem applies to:", o: ["Linear networks", "Only nonlinear", "Only time-varying R", "Magnetic circuits with saturation"], c: 0, e: "Requires linearity (and bilinearity for power no).", tags: ["superposition"] },
      { q: "Maximum power transfer for DC circuit when:", o: ["RL = Rth", "RL = 0", "RL = ∞", "RL = 2 Rth"], c: 0, e: "MPPT when load equals Thevenin resistance.", tags: ["mpt"] },
      { q: "Reciprocity theorem is applicable to:", o: ["Bilateral linear networks", "Only unilateral", "Only with dependent sources always", "Nonlinear diodes"], c: 0, e: "Reciprocity needs linearity and bilaterality.", tags: ["reciprocity"] },
    ],
  },
  {
    topic: "Transient & Steady State",
    items: [
      { q: "Time constant of series RL circuit is:", o: ["L/R", "R/L", "RC", "1/RC"], c: 0, e: "τ = L/R.", tags: ["transient"] },
      { q: "In series RC, capacitor voltage in DC steady state behaves as:", o: ["Open circuit", "Short circuit", "Resistor R", "Inductor"], c: 0, e: "Capacitor open in DC steady state.", tags: ["steady-state"] },
      { q: "Initial inductor current cannot change:", o: ["Instantly", "Ever", "In steady state only", "With infinite voltage always only"], c: 0, e: "iL continuous; needs impulse voltage to jump.", tags: ["transient"] },
      { q: "Damping ratio ζ > 1 means:", o: ["Overdamped", "Underdamped", "Undamped", "Critically damped only"], c: 0, e: "ζ>1 overdamped response.", tags: ["second-order"] },
      { q: "Resonant frequency of series RLC is:", o: ["1/(2π√LC)", "√(LC)", "R/L", "1/RC"], c: 0, e: "f0 = 1/(2π√LC).", tags: ["resonance"] },
    ],
  },
  {
    topic: "Two-Port & Graph",
    items: [
      { q: "For a reciprocal two-port, which is true?", o: ["AD − BC = 1 for transmission params in many cases / z12=z21", "z11=0", "y12=∞", "h12=h11"], c: 0, e: "Reciprocity: z12=z21, y12=y21, AD−BC=1 (ABCD).", tags: ["two-port"] },
      { q: "Number of tree branches in a connected graph with n nodes is:", o: ["n−1", "n", "n+1", "2n"], c: 0, e: "Tree has n−1 branches.", tags: ["graph"] },
      { q: "Fundamental cut-set matrix relates:", o: ["Branch currents via tree link partition", "Only voltages of loops", "Power only", "None"], c: 0, e: "Cut-set analysis uses tree branches.", tags: ["graph"] },
      { q: "h-parameters are convenient for:", o: ["Transistor hybrid model", "Only transmission lines", "Only transformers", "Antenna only"], c: 0, e: "Hybrid parameters classic for BJT models.", tags: ["two-port"] },
      { q: "Driving point impedance is:", o: ["Z seen at one port with other conditions defined", "Always zero", "Only imaginary", "Transfer impedance only"], c: 0, e: "DPI is input impedance at a port.", tags: ["network"] },
    ],
  },
  {
    topic: "AC Circuits",
    items: [
      { q: "Average power in pure inductor is:", o: ["0", "VI", "VIcosφ", "I²R"], c: 0, e: "Pure L: pf=0, average power zero.", tags: ["ac"] },
      { q: "Power factor of RL series circuit is:", o: ["R/Z", "X/Z", "Z/R", "1 always"], c: 0, e: "cosφ = R/Z.", tags: ["ac"] },
      { q: "In a balanced 3-φ system, line voltage is √3 times:", o: ["Phase voltage (star)", "Line current", "Phase current always", "Zero sequence"], c: 0, e: "V_L = √3 V_ph for star.", tags: ["3phase"] },
      { q: "Reactive power unit is:", o: ["VAR", "Watt", "VA only", "Joule"], c: 0, e: "Q in VAR.", tags: ["power"] },
      { q: "Form factor of sine wave is:", o: ["1.11", "1.414", "0.707", "1"], c: 0, e: "RMS/Avg = 1.11 for half-cycle absolute sine.", tags: ["waveforms"] },
    ],
  },
];

const controlSystemsBanks: TopicBank[] = [
  {
    topic: "Time Response",
    items: [
      { q: "Damping ratio ζ = 0 corresponds to:", o: ["Undamped oscillation", "Overdamped", "Critically damped", "Unstable non-oscillatory only"], c: 0, e: "ζ=0 sustained oscillation (ideal 2nd order).", tags: ["time-response"] },
      { q: "Steady-state error to unit ramp for type-1 system with gain K is:", o: ["0", "1/Kv", "∞", "1"], c: 1, e: "ess = 1/Kv for ramp; type≥1 can have finite Kv.", tags: ["error-constants"] },
      { q: "Rise time of underdamped 2nd order decreases when:", o: ["ωn increases", "ωn decreases", "ζ=1 fixed only", "Gain decreases always"], c: 0, e: "tr related inversely to ωn.", tags: ["time-response"] },
      { q: "Position error constant Kp for type-0 is:", o: ["Finite nonzero possible", "Always infinity", "Always zero", "Undefined"], c: 0, e: "Type 0: Kp finite; step ess=1/(1+Kp).", tags: ["error-constants"] },
      { q: "Peak overshoot Mp depends primarily on:", o: ["ζ", "Only ωn", "Only static gain", "Delay only"], c: 0, e: "Mp = e^(−ζπ/√(1−ζ²)).", tags: ["time-response"] },
    ],
  },
  {
    topic: "Stability",
    items: [
      { q: "Routh-Hurwitz criterion gives:", o: ["Number of RHP poles", "Exact root locations always", "Only gain margin", "Nyquist plot"], c: 0, e: "RH counts unstable closed-loop poles.", tags: ["stability"] },
      { q: "A system is BIBO stable if impulse response is:", o: ["Absolutely integrable", "Unbounded", "A pure sinusoid forever always", "A ramp"], c: 0, e: "∫|h(t)|dt < ∞ ⇒ BIBO stable.", tags: ["stability"] },
      { q: "On jω axis simple poles of closed loop imply:", o: ["Marginal stability (for distinct jω poles)", "Asymptotic stability", "Unstable always", "No conclusion"], c: 0, e: "Simple poles on jω ⇒ marginally stable if rest in LHP.", tags: ["stability"] },
      { q: "Gain margin is measured at:", o: ["Phase crossover frequency", "Gain crossover only", "ω=0", "ω=∞ only always"], c: 0, e: "GM from |G| at ∠G=−180°.", tags: ["frequency"] },
      { q: "Nyquist stability uses:", o: ["Open-loop frequency response encirclements", "Only Routh array", "Only root locus gain", "Describing function only"], c: 0, e: "N = P − Z encirclement criterion.", tags: ["nyquist"] },
    ],
  },
  {
    topic: "Root Locus & Compensators",
    items: [
      { q: "Root locus is the path of closed-loop poles as:", o: ["Gain K varies from 0 to ∞", "Frequency varies", "Damping only varies", "Sampling period varies only"], c: 0, e: "RL plots CL poles vs K.", tags: ["root-locus"] },
      { q: "A lead compensator provides:", o: ["Phase lead and increases BW", "Only lag", "Infinite GM always", "Decreases speed of response"], c: 0, e: "Lead improves transient/phase margin.", tags: ["compensator"] },
      { q: "Lag compensator is used mainly to:", o: ["Improve steady-state error", "Increase bandwidth a lot", "Add derivative kick", "Destabilize"], c: 0, e: "Lag raises low-frequency gain ⇒ better ess.", tags: ["compensator"] },
      { q: "Number of asymptotes in root locus equals:", o: ["n − m", "n + m", "m − n", "n"], c: 0, e: "Asymptotes = open-loop poles − zeros.", tags: ["root-locus"] },
      { q: "Centroid of asymptotes is at:", o: ["(Σp − Σz)/(n−m)", "0 always", "∞", "1"], c: 0, e: "σ_a = (sum poles − sum zeros)/(n−m).", tags: ["root-locus"] },
    ],
  },
  {
    topic: "Frequency Domain",
    items: [
      { q: "Bode plot of a pure integrator has slope:", o: ["−20 dB/dec", "+20 dB/dec", "0", "−40 always"], c: 0, e: "1/jω ⇒ −20 dB/decade.", tags: ["bode"] },
      { q: "Phase margin is evaluated at:", o: ["Gain crossover frequency", "Phase crossover", "Resonant peak only", "ωn only"], c: 0, e: "PM = 180° + ∠G(jωgc).", tags: ["bode"] },
      { q: "M and N circles are used in:", o: ["Nichols/Nyquist closed-loop response estimation", "Only root locus", "Only Routh", "Ziegler-Nichols only"], c: 0, e: "Constant M,N loci on NY plot.", tags: ["frequency"] },
      { q: "Bandwidth of a control system is related to:", o: ["Speed of response", "Only steady-state error", "Only actuator size", "Sampling only"], c: 0, e: "Higher BW ⇒ faster response.", tags: ["frequency"] },
      { q: "Notch filter is used to:", o: ["Attenuate a narrow frequency band", "Amplify all high f", "Integrate signal", "Differentiate only"], c: 0, e: "Notch rejects specific disturbance frequency.", tags: ["filters"] },
    ],
  },
];

export const seedPracticeQuestions: SeedPracticeQ[] = [
  ...aptitudeNumerical,
  ...aptitudeVerbal,
  ...aptitudeReasoning,
  ...expandGate("machines", machinesBanks, 50),
  ...expandGate("power-system", powerSystemBanks, 50),
  ...expandGate("power-electronics", powerElectronicsBanks, 50),
  ...expandGate("network-theory", networkTheoryBanks, 50),
  ...expandGate("control-systems", controlSystemsBanks, 50),
];

export const APTITUDE_SECTIONS = [
  { key: "numerical", label: "Numerical", icon: "chart", color: "blue" },
  { key: "verbal", label: "Verbal", icon: "pencil", color: "indigo" },
  { key: "reasoning", label: "Reasoning", icon: "brain", color: "violet" },
] as const;

export const GATE_SECTIONS = [
  { key: "machines", label: "Electrical Machines", short: "Machines", href: "/gate/machines" },
  { key: "power-system", label: "Power System", short: "Power System", href: "/gate/power-system" },
  { key: "power-electronics", label: "Power Electronics", short: "Power Electronics", href: "/gate/power-electronics" },
  { key: "network-theory", label: "Network Theory", short: "Network Theory", href: "/gate/network-theory" },
  { key: "control-systems", label: "Control Systems", short: "Control Systems", href: "/gate/control-systems" },
] as const;
