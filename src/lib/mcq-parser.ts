// Heuristic MCQ parser: converts raw extracted text (from PDF/DOCX/TXT)
// into structured MCQ questions.
//
// Supported patterns:
//   Question starts:  "Q1.", "Q1)", "1.", "1)", "Question 1:", "Q.1"
//   Options:          "A)", "A.", "(A)", "a)", "(i)", "1)" (when inside a question), "-", "*"
//   Answer:           "Answer: B", "Ans: (c)", "Correct Answer: B", "Answer- b",
//                     or "Answer: <full option text>"
//   Explanation:      "Explanation: ...", "Solution: ...", "Reason: ..."

export type ParsedMcq = {
  questionText: string;
  options: string[];
  correctIndex: number; // -1 when not detected
  explanation: string | null;
};

const QUESTION_START =
  /^(?:q(?:uestion)?[\s.\-]*(\d{1,3})[).:\-]?|(\d{1,3})[).:]|(\d{1,3})\s*[-–])\s+(.*)$/i;

const OPTION_START =
  /^(?:\(?([a-hA-H])\)|([a-hA-H])[).:]|\(?(i{1,3}|iv|v|vi{0,3}|ix|x)\)|\(?(i{1,3}|iv|v|vi{0,3}|ix|x)[).:])\s*(.*)$/;

const ANSWER_LINE =
  /^(?:correct\s*answer|answer|ans|correct\s*option|key)\s*[:\-–=]?\s*(.+)$/i;

const EXPLANATION_LINE = /^(?:explanation|solution|reason|hint)\s*[:\-–=]?\s*(.*)$/i;

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

function normalizeWhitespace(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

export function parseMcqText(raw: string): ParsedMcq[] {
  // Normalize line endings, split, and clean noise lines
  const lines = raw
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    // Drop obvious page furniture
    .filter((l) => !/^page\s+\d+(\s+of\s+\d+)?$/i.test(l));

  type Draft = {
    question: string[];
    options: string[];
    correctIndex: number;
    explanation: string[];
    inExplanation: boolean;
    pendingAnswerText: string | null;
  };

  const results: ParsedMcq[] = [];
  let cur: Draft | null = null;

  const flush = () => {
    if (!cur) return;
    const questionText = normalizeWhitespace(cur.question.join(" "));
    const options = cur.options.map(normalizeWhitespace).filter((o) => o.length > 0);
    let correctIndex = cur.correctIndex;

    // Resolve answer given as full text
    if (correctIndex < 0 && cur.pendingAnswerText) {
      const ansNorm = normalizeWhitespace(cur.pendingAnswerText).toLowerCase();
      const found = options.findIndex(
        (o) => o.toLowerCase() === ansNorm || ansNorm.includes(o.toLowerCase()),
      );
      if (found >= 0) correctIndex = found;
    }

    if (questionText.length > 0 && options.length >= 2) {
      results.push({
        questionText,
        options,
        correctIndex: correctIndex >= 0 && correctIndex < options.length ? correctIndex : -1,
        explanation: cur.explanation.length > 0 ? normalizeWhitespace(cur.explanation.join(" ")) : null,
      });
    }
    cur = null;
  };

  for (const line of lines) {
    if (line.length === 0) continue;

    const qm = line.match(QUESTION_START);
    // A line looks like a new question when it matches the question pattern
    // AND (no current question OR current one already has >= 2 options)
    if (qm && (!cur || cur.options.length >= 2)) {
      flush();
      cur = {
        question: [qm[4] ?? ""],
        options: [],
        correctIndex: -1,
        explanation: [],
        inExplanation: false,
        pendingAnswerText: null,
      };
      continue;
    }

    if (!cur) {
      // Text before the first detected question — ignore
      continue;
    }

    // Answer line?
    const am = line.match(ANSWER_LINE);
    if (am && cur.options.length >= 2) {
      const val = am[1].trim();
      // Try "B", "(b)", "b)", "option B"
      const short = val.replace(/^option\s*/i, "").replace(/[().\s]/g, "");
      const idx = letterToIndex(short);
      if (idx >= 0 && idx < cur.options.length) {
        cur.correctIndex = idx;
      } else {
        cur.pendingAnswerText = val;
      }
      cur.inExplanation = false;
      continue;
    }

    // Explanation line?
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

    // Option line?
    const om = line.match(OPTION_START);
    if (om) {
      const marker = om[1] ?? om[2] ?? om[3] ?? om[4] ?? "";
      const body = om[5] ?? "";
      const idx = letterToIndex(marker);
      // Accept as option if the index is sequential-ish
      if (idx >= 0 && idx <= cur.options.length + 1 && body.trim().length > 0) {
        cur.options.push(body);
        continue;
      }
    }

    // Bullet-style options "- text" / "* text" / "• text"
    const bm = line.match(/^[-*•]\s+(.*)$/);
    if (bm && (cur.options.length > 0 || cur.question.length > 0)) {
      cur.options.push(bm[1]);
      continue;
    }

    // Continuation: append to last option if options started, else to question
    if (cur.options.length > 0) {
      cur.options[cur.options.length - 1] += " " + line;
    } else {
      cur.question.push(line);
    }
  }

  flush();
  return results;
}
