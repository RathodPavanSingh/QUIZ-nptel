// Universal MCQ/MSQ/Numerical/Figure parser.
// Accepts raw text and auto-classifies each question into one of the four types.

export type ParsedQuestion = {
  questionText: string;
  questionType: "mcq" | "msq" | "numerical" | "figure";
  options: string[];
  correctIndex: number;        // MCQ / Figure-single
  correctIndices: number[];    // MSQ / Figure-multi
  numericalAnswer: number | null;
  numericalTolerance: number;
  numericalUnit: string;
  explanation: string | null;
  imageUrl: string | null;
  year: number;
  unit: number;
  include: boolean;
};

// -- Regex helpers
const QUESTION_START =
  /^(?:q(?:uestion)?[\s.\-]*(\d{1,3})[).:\-]?|(\d{1,3})[).:]|(\d{1,3})\s*[-–])\s+(.*)$/i;

const OPTION_START =
  /^(?:\(?([a-hA-H])\)|([a-hA-H])[).:]|\(?(i{1,3}|iv|v|vi{0,3}|ix|x)\)|\(?(i{1,3}|iv|v|vi{0,3}|ix|x)[).:])\s*(.*)$/;

const ANSWER_LINE =
  /^(?:correct\s*(?:answer|option)|answer|ans|key)\s*[:\-–=]?\s*(.+)$/i;

const MULTI_ANSWER_LINE =
  /^(?:correct\s*(?:answers?|options?)|answers?|ans)\s*[:\-–=]?\s*(.+)$/i;

const NUMERICAL_ANSWER =
  /^(?:correct\s*(?:answer|value)|answer|ans|value)\s*[:\-–=]?\s*([\d.\-+eE]+)\s*(.*)?$/i;

const TOLERANCE_LINE =
  /^(?:tolerance|range|margin|error)\s*[:\-–=]?\s*[±]?\s*([\d.\-+eE]+)\s*(.*)?$/i;

const EXPLANATION_LINE =
  /^(?:explanation|solution|reason|hint|note)\s*[:\-–=]?\s*(.*)$/i;

const IMAGE_LINE =
  /^(?:image|figure|diagram|img|picture|photo)\s*[:\-–=]?\s*(https?:\/\/\S+|\/\S+)/i;

const IMAGE_MD = /!\[.*?\]\((.*?)\)/;

const ROMAN_MAP: Record<string, number> = {
  i: 0, ii: 1, iii: 2, iv: 3, v: 4, vi: 5, vii: 6, viii: 7, ix: 8, x: 9,
};

function letterToIndex(s: string): number {
  const t = s.trim().toLowerCase();
  if (/^[a-h]$/.test(t)) return t.charCodeAt(0) - 97;
  if (ROMAN_MAP[t] !== undefined) return ROMAN_MAP[t];
  if (/^[1-8]$/.test(t)) return parseInt(t, 10) - 1;
  return -1;
}

function norm(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

// Determine whether a question should be MSQ by analyzing its text/markers
function looksLikeMsq(qText: string, answerMarkers: string[]): boolean {
  const t = qText.toLowerCase();
  if (/select\s+all/i.test(t)) return true;
  if (/choose\s+(all|multiple|two|three|more\s+than\s+one)/i.test(t)) return true;
  if (/which\s+of\s+the\s+following\s+are\b/i.test(t)) return true;
  if (/\(select\s+\d+\)/i.test(t)) return true;
  if (/\bmsq\b/i.test(t)) return true;
  if (/mark\s+all/i.test(t)) return true;
  // If the answer line has multiple letters like "A, C, D" or "ACD"
  if (answerMarkers.length > 1) return true;
  return false;
}

function looksLikeNumerical(qText: string, hasOptions: boolean): boolean {
  if (hasOptions) return false; // has options → not numerical
  const t = qText.toLowerCase();
  if (/\bnumerical\b/i.test(t)) return true;
  if (/\bcalculate\b/i.test(t)) return true;
  if (/\bfind\s+the\s+(?:value|result|answer|number)\b/i.test(t)) return true;
  if (/\bhow\s+(?:much|many)\b/i.test(t)) return true;
  if (/\bwhat\s+is\s+the\s+(?:value|result|total|sum|product|area|volume)\b/i.test(t)) return true;
  if (/\bcompute\b/i.test(t)) return true;
  if (/\bdetermine\s+the\b/i.test(t)) return true;
  if (/\b(?:evaluate|solve)\b/i.test(t)) return true;
  if (/(?:=|equals)\s*\?/i.test(t)) return true;
  return false;
}

type Draft = {
  question: string[];
  options: string[];
  answerRaw: string[];
  explanation: string[];
  imageUrl: string | null;
  numericalVal: number | null;
  numericalTol: number;
  numericalUnit: string;
  inExplanation: boolean;
};

function parseMultiLetterAnswer(raw: string): number[] {
  // Match "A, B, D" or "a,c" or "(a)(c)" or "ACD" or "A and C"
  const cleaned = raw
    .replace(/\band\b/gi, ",")
    .replace(/[()]/g, "")
    .replace(/\s+/g, "");
  const matches = cleaned.match(/[a-hA-H]/g);
  if (!matches) return [];
  return Array.from(new Set(matches.map((m) => m.toLowerCase().charCodeAt(0) - 97)));
}

export function parseTextToQuestions(
  raw: string,
  defaults: { year: number; unit: number },
): ParsedQuestion[] {
  const lines = raw
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => !/^page\s+\d+(\s+of\s+\d+)?$/i.test(l));

  const results: ParsedQuestion[] = [];
  let cur: Draft | null = null;

  const flush = () => {
    if (!cur) return;
    const questionText = norm(cur.question.join(" "));
    const options = cur.options.map(norm).filter((o) => o.length > 0);
    const explanationText = cur.explanation.length > 0 ? norm(cur.explanation.join(" ")) : null;

    if (questionText.length === 0) {
      cur = null;
      return;
    }

    // Resolve multi-answer markers
    const answerLetters = parseMultiLetterAnswer(cur.answerRaw.join(" "));

    // Auto-classify question type
    let questionType: ParsedQuestion["questionType"] = "mcq";
    let correctIndex = -1;
    let correctIndices: number[] = [];
    let numAns = cur.numericalVal;
    let numTol = cur.numericalTol;
    let numUnit = cur.numericalUnit;

    // Check if numerical answer detected
    if (numAns !== null) {
      questionType = "numerical";
    } else if (options.length >= 2) {
      // Has options → MCQ or MSQ
      if (looksLikeMsq(questionText, answerLetters.length > 1 ? answerLetters.map(String) : [])) {
        questionType = "msq";
        correctIndices = answerLetters.filter((i) => i >= 0 && i < options.length);
      } else {
        questionType = "mcq";
        // Resolve single answer
        if (answerLetters.length > 0) {
          const idx = answerLetters[0];
          if (idx >= 0 && idx < options.length) correctIndex = idx;
        }
        // If multiple answers were detected, maybe it's MSQ
        if (answerLetters.length > 1) {
          questionType = "msq";
          correctIndices = answerLetters.filter((i) => i >= 0 && i < options.length);
        }
        // Try matching answer as full text
        if (correctIndex < 0 && cur.answerRaw.length > 0 && questionType === "mcq") {
          const ansNorm = norm(cur.answerRaw.join(" ")).toLowerCase();
          const found = options.findIndex(
            (o) => o.toLowerCase() === ansNorm || ansNorm.includes(o.toLowerCase()),
          );
          if (found >= 0) correctIndex = found;
        }
      }
    } else if (looksLikeNumerical(questionText, options.length >= 2)) {
      questionType = "numerical";
      // Try to parse answer raw as number
      if (cur.answerRaw.length > 0 && numAns === null) {
        const n = parseFloat(cur.answerRaw.join("").trim());
        if (isFinite(n)) {
          numAns = n;
        }
      }
    }

    // Figure detection: if image is attached
    if (cur.imageUrl && questionType !== "numerical") {
      questionType = "figure";
      if (correctIndices.length > 0) {
        // keep as figure + MSQ
      } else {
        // keep single correct for figure
      }
    }

    // Ensure correctIndex/correctIndices are valid
    if (questionType === "mcq") {
      correctIndex = correctIndex >= 0 && correctIndex < options.length ? correctIndex : -1;
    }
    if (questionType === "msq" || (questionType === "figure" && correctIndices.length > 0)) {
      correctIndices = correctIndices.filter((i) => i >= 0 && i < options.length);
    }

    if (questionType === "numerical" && numAns === null) {
      numAns = null; // Admin must fill in
    }

    results.push({
      questionText,
      questionType,
      options,
      correctIndex: questionType === "mcq" || questionType === "figure" ? correctIndex : 0,
      correctIndices: questionType === "msq" || (questionType === "figure" && correctIndices.length > 0) ? correctIndices : [],
      numericalAnswer: numAns,
      numericalTolerance: numTol,
      numericalUnit: numUnit,
      explanation: explanationText,
      imageUrl: cur.imageUrl,
      year: defaults.year,
      unit: defaults.unit,
      include: true,
    });
    cur = null;
  };

  for (const line of lines) {
    if (line.length === 0) continue;

    // Image references
    const imgMd = line.match(IMAGE_MD);
    const imgLine = line.match(IMAGE_LINE);
    if ((imgMd || imgLine) && cur) {
      cur.imageUrl = imgMd?.[1] ?? imgLine?.[1] ?? null;
      continue;
    }

    // Question start
    const qm = line.match(QUESTION_START);
    if (qm && (!cur || cur.options.length >= 2)) {
      flush();
      cur = {
        question: [qm[4] ?? ""],
        options: [],
        answerRaw: [],
        explanation: [],
        imageUrl: null,
        numericalVal: null,
        numericalTol: 0,
        numericalUnit: "",
        inExplanation: false,
      };
      continue;
    }

    if (!cur) continue;

    // Tolerance line
    const tm = line.match(TOLERANCE_LINE);
    if (tm) {
      cur.numericalTol = parseFloat(tm[1]) || 0;
      if (tm[2]) cur.numericalUnit = tm[2].trim();
      continue;
    }

    // Numerical answer line
    const nm = line.match(NUMERICAL_ANSWER);
    if (nm && cur.options.length === 0) {
      cur.numericalVal = parseFloat(nm[1]);
      if (nm[2]) cur.numericalUnit = nm[2].trim();
      continue;
    }

    // Answer line
    const am = line.match(ANSWER_LINE);
    if (am && cur.options.length >= 2) {
      cur.answerRaw.push(am[1].trim());
      cur.inExplanation = false;
      continue;
    }

    // Also try multi-answer line
    const mam = line.match(MULTI_ANSWER_LINE);
    if (mam && cur.options.length >= 2) {
      cur.answerRaw.push(mam[1].trim());
      cur.inExplanation = false;
      continue;
    }

    // Explanation
    const em = line.match(EXPLANATION_LINE);
    if (em && cur.options.length >= 2) {
      cur.inExplanation = true;
      if (em[1]) cur.explanation.push(em[1]);
      continue;
    }
    if (cur.inExplanation) {
      cur.explanation.push(line);
      continue;
    }

    // Option
    const om = line.match(OPTION_START);
    if (om) {
      const marker = om[1] ?? om[2] ?? om[3] ?? om[4] ?? "";
      const body = om[5] ?? "";
      const idx = letterToIndex(marker);
      if (idx >= 0 && idx <= cur.options.length + 1 && body.trim().length > 0) {
        cur.options.push(body);
        continue;
      }
    }

    // Bullet options
    const bm = line.match(/^[-*•]\s+(.*)$/);
    if (bm && (cur.options.length > 0 || cur.question.length > 0)) {
      cur.options.push(bm[1]);
      continue;
    }

    // Continuation
    if (cur.options.length > 0) {
      cur.options[cur.options.length - 1] += " " + line;
    } else {
      cur.question.push(line);
    }
  }

  flush();
  return results;
}

// --- JSON/structured format parser ---
export function parseJsonQuestions(
  data: unknown,
  defaults: { year: number; unit: number },
): ParsedQuestion[] {
  const items = Array.isArray(data) ? data : [data];
  return items.map((raw) => {
    const d = raw as Record<string, unknown>;
    const qText = String(d.questionText ?? d.question ?? d.text ?? d.q ?? "");
    const opts = (Array.isArray(d.options) ? d.options.map(String) : []) as string[];
    const correctIndex = typeof d.correctIndex === "number" ? d.correctIndex : (typeof d.correct === "number" ? d.correct : -1);
    const correctIndices = Array.isArray(d.correctIndices) ? (d.correctIndices as number[]) : [];
    const numAns = typeof d.numericalAnswer === "number" ? d.numericalAnswer : (typeof d.answer === "number" && opts.length === 0 ? d.answer : null);
    const numTol = typeof d.numericalTolerance === "number" ? d.numericalTolerance : (typeof d.tolerance === "number" ? d.tolerance : 0);
    const numUnit = String(d.numericalUnit ?? d.unit_label ?? "");
    const explanation = d.explanation ? String(d.explanation) : null;
    const imageUrl = d.imageUrl ? String(d.imageUrl) : (d.image ? String(d.image) : null);

    let questionType = String(d.questionType ?? d.type ?? "").toLowerCase() as ParsedQuestion["questionType"];
    if (!["mcq", "msq", "numerical", "figure"].includes(questionType)) {
      // Auto-detect
      if (numAns !== null && opts.length === 0) questionType = "numerical";
      else if (imageUrl) questionType = "figure";
      else if (correctIndices.length > 1) questionType = "msq";
      else questionType = "mcq";
    }

    return {
      questionText: qText,
      questionType,
      options: opts,
      correctIndex: correctIndex >= 0 ? correctIndex : (correctIndices.length > 0 ? correctIndices[0] : -1),
      correctIndices,
      numericalAnswer: numAns,
      numericalTolerance: numTol,
      numericalUnit: numUnit,
      explanation,
      imageUrl,
      year: typeof d.year === "number" ? d.year : defaults.year,
      unit: typeof d.unit === "number" ? d.unit : defaults.unit,
      include: qText.length > 0,
    };
  });
}

// --- CSV/Excel row parser ---
export function parseRowsToQuestions(
  rows: Record<string, string>[],
  defaults: { year: number; unit: number },
): ParsedQuestion[] {
  return rows.map((row) => {
    // normalize keys
    const d: Record<string, string> = {};
    for (const [k, v] of Object.entries(row)) {
      d[k.toLowerCase().replace(/[\s_-]+/g, "")] = String(v ?? "").trim();
    }

    const qText = d.questiontext ?? d.question ?? d.text ?? d.q ?? "";
    // Collect options from option1..option8 or optiona..optionh or a..h
    const opts: string[] = [];
    for (let i = 1; i <= 8; i++) {
      const v = d[`option${i}`] ?? d[`opt${i}`] ?? d[String.fromCharCode(96 + i)] ?? "";
      if (v) opts.push(v);
    }
    // Also try "optiona", "optionb" etc
    for (let c = 0; c < 8; c++) {
      const letter = String.fromCharCode(97 + c);
      const v = d[`option${letter}`] ?? d[`option_${letter}`] ?? "";
      if (v && !opts.includes(v)) opts.push(v);
    }
    // Also "options" as comma-separated
    if (opts.length === 0 && d.options) {
      opts.push(...d.options.split("|").map((s) => s.trim()).filter(Boolean));
    }

    const correctIndexStr = d.correctindex ?? d.correct ?? d.answer ?? d.correctanswer ?? "";
    const correctIndicesStr = d.correctindices ?? d.correctanswers ?? "";

    let correctIndex = -1;
    let correctIndices: number[] = [];

    if (correctIndicesStr) {
      // "0,2" or "A,C" or "AC"
      const parts = correctIndicesStr.replace(/\s+/g, "").split(/[,;|]/);
      for (const p of parts) {
        const n = parseInt(p, 10);
        if (!isNaN(n)) correctIndices.push(n);
        else if (/^[a-h]$/i.test(p)) correctIndices.push(p.toLowerCase().charCodeAt(0) - 97);
      }
      if (correctIndices.length === 0) {
        // Try "ACD" as a single block of letters
        const letters = correctIndicesStr.match(/[a-hA-H]/g);
        if (letters) correctIndices = letters.map((l) => l.toLowerCase().charCodeAt(0) - 97);
      }
    } else if (correctIndexStr) {
      const n = parseInt(correctIndexStr, 10);
      if (!isNaN(n)) correctIndex = n;
      else if (/^[a-h]$/i.test(correctIndexStr)) correctIndex = correctIndexStr.toLowerCase().charCodeAt(0) - 97;
      // Check if answer is full text
      if (correctIndex < 0 && opts.length > 0) {
        const found = opts.findIndex((o) => o.toLowerCase() === correctIndexStr.toLowerCase());
        if (found >= 0) correctIndex = found;
      }
    }

    const numAnsStr = d.numericalanswer ?? d.numericvalue ?? d.value ?? "";
    const numTolStr = d.numericaltolerance ?? d.tolerance ?? d.range ?? "";
    const numUnit = d.numericalunit ?? d.unitlabel ?? "";
    const numAns = numAnsStr ? parseFloat(numAnsStr) : null;
    const numTol = numTolStr ? parseFloat(numTolStr) : 0;

    const imageUrl = d.imageurl ?? d.image ?? d.figure ?? d.img ?? "";
    const explanation = d.explanation ?? d.solution ?? d.reason ?? "";
    const year = parseInt(d.year ?? "", 10) || defaults.year;
    const unit = parseInt(d.unit ?? "", 10) || defaults.unit;

    let questionType = (d.questiontype ?? d.type ?? "").toLowerCase() as ParsedQuestion["questionType"];
    if (!["mcq", "msq", "numerical", "figure"].includes(questionType)) {
      if (numAns !== null && isFinite(numAns) && opts.length === 0) questionType = "numerical";
      else if (imageUrl) questionType = "figure";
      else if (correctIndices.length > 1) questionType = "msq";
      else questionType = "mcq";
    }

    return {
      questionText: qText,
      questionType,
      options: opts,
      correctIndex: correctIndex >= 0 ? correctIndex : (correctIndices.length > 0 ? correctIndices[0] : -1),
      correctIndices,
      numericalAnswer: numAns !== null && isFinite(numAns) ? numAns : null,
      numericalTolerance: isFinite(numTol) ? numTol : 0,
      numericalUnit: numUnit,
      explanation: explanation || null,
      imageUrl: imageUrl || null,
      year,
      unit,
      include: qText.length > 0,
    };
  });
}
