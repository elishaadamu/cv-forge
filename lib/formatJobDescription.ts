/**
 * Smart job description formatter.
 * No AI — pure regex + heuristics.
 *
 * Rules:
 *  - Known section headings → <h2>
 *  - Short lines with no terminal punctuation followed by bullets/blank → <h3>
 *  - ALL-CAPS short lines → <h2>
 *  - Lines starting with bullet characters / numbers → <ul><li>
 *  - Consecutive parallel short lines (implied list) → <ul><li>
 *  - Salary / year-of-experience patterns → <strong>
 *  - Collapse multiple blank lines, trim trailing spaces
 */

const KNOWN_HEADERS = [
  /^about\s*(the\s*)?(role|position|company|us|this|job)?$/i,
  /^(job\s*)?overview$/i,
  /^(key\s*)?(responsibilities|duties|accountabilities)$/i,
  /^(minimum\s*)?(requirements?|qualifications?)$/i,
  /^(required|preferred|desired)\s*(qualifications?|skills?|experience)$/i,
  /^what\s+(you('ll| will| are| bring)|we('re| are)\s+(looking for|offering))$/i,
  /^(who\s+you\s+are|who\s+we('re|\s+are))$/i,
  /^(nice[\s-]to[\s-]have|good[\s-]to[\s-]have|bonus|a\s+plus)$/i,
  /^(skills?|technical\s+skills?|core\s+skills?)$/i,
  /^(education|educational\s+requirements?)$/i,
  /^(compensation|salary|pay|remuneration|total\s+rewards?)$/i,
  /^(benefits?|perks?|what\s+we\s+offer|why\s+(join|us))$/i,
  /^(working\s+hours?|work\s+schedule|hours?\s+(of\s+work)?)$/i,
  /^(location|office|workplace|work\s+location)$/i,
  /^(how\s+to\s+apply|application\s+process|next\s+steps?)$/i,
  /^(equal\s+opportunity|diversity|inclusion|eeo)$/i,
  /^(role\s+summary|position\s+summary|job\s+summary|the\s+role)$/i,
  /^(team|department|reporting\s+structure|who\s+you('ll|\s+will)\s+report)$/i,
  /^(experience\s+required|required\s+experience)$/i,
  /^(note|please\s+note|important\s+note)$/i,
  /^(your\s+(role|responsibilities|mission|impact))$/i,
  /^(we\s+(are\s+looking|need|seek|want))$/i,
]

const BULLET_RE = /^[\u2022\u2023\u25E6\u2043\u2219\u25CF\u25CB\u25A0\u25A1\u27A2\u2713\u2714\u2192\u25B8\-\*\+\xB7]\s+|^\d+[.)]\s+|^[a-zA-Z][.)]\s+/

function stripBullet(line: string): string {
  return line
    .replace(/^[\u2022\u2023\u25E6\u2043\u2219\u25CF\u25CB\u25A0\u25A1\u27A2\u2713\u2714\u2192\u25B8\-\*\+\xB7]\s*/, "")
    .replace(/^\d+[.)]\s+/, "")
    .replace(/^[a-zA-Z][.)]\s+/, "")
    .trim()
}

function escape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function applyBold(text: string): string {
  // Salary / compensation
  text = text.replace(/(\$[\d,]+(?:\s*[-–—]\s*\$[\d,]+)?(?:\s*\/?\s*(?:year|yr|month|mo|hour|hr|k|annum))?)/gi, "<strong>$1</strong>")
  text = text.replace(/(£[\d,]+(?:\s*[-–—]\s*£[\d,]+)?(?:\s*\/?\s*(?:year|yr|pa))?)/gi, "<strong>$1</strong>")
  text = text.replace(/(€[\d,]+(?:\s*[-–—]\s*€[\d,]+)?)/gi, "<strong>$1</strong>")
  // Years of experience
  text = text.replace(/(\d+\+?\s+years?\s+(?:of\s+)?(?:experience|exp)(?:\s+in)?)/gi, "<strong>$1</strong>")
  // Degree requirements
  text = text.replace(/\b(Bachelor'?s?|Master'?s?|Ph\.?D\.?|MBA|BSc|MSc)\b/g, "<strong>$1</strong>")
  return text
}

function isKnownHeader(line: string): boolean {
  return KNOWN_HEADERS.some((re) => re.test(line.trim()))
}

function isAllCapsHeader(line: string): boolean {
  const t = line.trim()
  return (
    t.length >= 3 &&
    t.length <= 80 &&
    t === t.toUpperCase() &&
    /[A-Z]/.test(t) &&
    !/[.!?,;]$/.test(t)
  )
}

function isImpliedHeader(line: string, nextLine: string): boolean {
  const t = line.trim()
  if (!t || t.length > 80 || /[.!?,]$/.test(t)) return false
  // Followed by a bullet or blank line, and the line itself isn't a sentence
  const wordCount = t.split(/\s+/).length
  return wordCount <= 8 && (BULLET_RE.test(nextLine) || !nextLine)
}

export function formatJobDescription(raw: string): string {
  // Normalise line endings
  const text = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n")

  // Split, strip trailing spaces per line, collapse 3+ blank lines to 2
  const lines = text
    .split("\n")
    .map((l) => l.trimEnd())

  const result: string[] = []
  let bulletBuffer: string[] = []

  const flushBullets = () => {
    if (bulletBuffer.length > 0) {
      result.push("<ul>")
      bulletBuffer.forEach((b) => result.push(`  <li>${b}</li>`))
      result.push("</ul>")
      bulletBuffer = []
    }
  }

  let blankRun = 0

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i]
    const line = raw.trim()

    // Blank line
    if (!line) {
      blankRun++
      if (blankRun === 1) {
        flushBullets()
      }
      continue
    }
    blankRun = 0

    const nextLine = (lines[i + 1] ?? "").trim()

    // Known section header
    if (isKnownHeader(line) || isAllCapsHeader(line)) {
      flushBullets()
      result.push(`<h2>${escape(line)}</h2>`)
      continue
    }

    // Implied header (short, no punctuation, followed by bullets)
    if (isImpliedHeader(line, nextLine)) {
      flushBullets()
      result.push(`<h3>${escape(line)}</h3>`)
      continue
    }

    // Bullet line
    if (BULLET_RE.test(line)) {
      bulletBuffer.push(applyBold(escape(stripBullet(line))))
      continue
    }

    // Check for implicit list: if we already have bullets accumulating and
    // this line looks structurally parallel (short, no terminal period-type),
    // keep treating it as a bullet
    if (
      bulletBuffer.length > 0 &&
      line.length < 120 &&
      !/[.!?]$/.test(line) &&
      line.split(/\s+/).length <= 16
    ) {
      bulletBuffer.push(applyBold(escape(line)))
      continue
    }

    // Regular paragraph
    flushBullets()
    result.push(`<p>${applyBold(escape(line))}</p>`)
  }

  flushBullets()

  // Clean up: remove empty paragraphs, collapse whitespace between block tags
  return result
    .join("\n")
    .replace(/<p>\s*<\/p>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}
