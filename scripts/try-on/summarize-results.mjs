import { readFileSync } from "node:fs";

const HEADERS = [
  "reviewer",
  "case_id",
  "candidate",
  "product_fidelity",
  "room_preservation",
  "perspective",
  "mask_quality",
  "latency_ms",
  "cost_rub",
  "technical_success",
];
const HUMAN_SCORE_FIELDS = ["product_fidelity", "room_preservation", "perspective", "mask_quality"];

function fail(message) {
  throw new Error(message);
}

function parseCsv(text) {
  const rows = [];
  let field = "";
  let row = [];
  let quoted = false;
  let afterQuote = false;
  let line = 1;
  let rowLine = 1;

  function finishRow() {
    row.push(field);
    if (row.some((value) => value !== "")) rows.push({ fields: row, line: rowLine });
    row = [];
    field = "";
    afterQuote = false;
    rowLine = line + 1;
  }

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
        afterQuote = true;
      } else {
        field += character;
        if (character === "\n") line += 1;
      }
    } else if (afterQuote) {
      if (character === ",") {
        row.push(field);
        field = "";
        afterQuote = false;
      } else if (character === "\n") {
        finishRow();
        line += 1;
      } else if (character === "\r" && text[index + 1] === "\n") {
        finishRow();
        index += 1;
        line += 1;
      } else {
        fail(`Malformed CSV quote on line ${line}`);
      }
    } else if (character === '"') {
      if (field) fail(`Malformed CSV quote on line ${line}`);
      quoted = true;
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      finishRow();
      line += 1;
    } else if (character === "\r" && text[index + 1] === "\n") {
      finishRow();
      index += 1;
      line += 1;
    } else {
      field += character;
    }
  }
  if (quoted) fail(`Unterminated CSV quote on line ${rowLine}`);
  if (field || row.length) {
    finishRow();
  }
  return rows;
}

function parseNumber(value, field, line, { integer = false, min = 0, max = Number.POSITIVE_INFINITY } = {}) {
  if (value.trim() === "") fail(`Line ${line}: ${field} is required`);
  const number = Number(value);
  if (!Number.isFinite(number) || (integer && !Number.isInteger(number)) || number < min || number > max) {
    fail(`Line ${line}: ${field} must be ${integer ? "an integer " : ""}from ${min} to ${max === Number.POSITIVE_INFINITY ? "infinity" : max}`);
  }
  return number;
}

function median(values) {
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
}

function loadManifestCaseIds(manifestPath) {
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  if (!manifest || !Array.isArray(manifest.cases) || manifest.cases.length === 0) {
    fail("Manifest must contain at least one case");
  }
  const caseIds = new Set();
  for (const item of manifest.cases) {
    if (!item || typeof item.id !== "string" || !item.id) fail("Manifest case has an invalid id");
    if (caseIds.has(item.id)) fail(`Duplicate manifest case id: ${item.id}`);
    caseIds.add(item.id);
  }
  return [...caseIds].sort();
}

function main() {
  const csvPath = process.argv[2];
  const manifestPath = process.argv[3];
  if (!csvPath || !manifestPath) fail("Usage: node scripts/try-on/summarize-results.mjs <scores.csv> <dataset.json>");
  const expectedCases = loadManifestCaseIds(manifestPath);
  const expectedCaseIds = new Set(expectedCases);
  const rows = parseCsv(readFileSync(csvPath, "utf8"));
  if (rows.length < 2) fail("Scores CSV must include a header and at least one result");
  if (rows[0].fields.length !== HEADERS.length || rows[0].fields.some((header, index) => header !== HEADERS[index])) {
    fail(`CSV headers must be exactly: ${HEADERS.join(",")}`);
  }

  const candidates = new Map();
  const reviewers = new Set();
  const scoreKeys = new Set();
  for (let index = 1; index < rows.length; index += 1) {
    const { fields, line } = rows[index];
    if (fields.length !== HEADERS.length) fail(`Line ${line}: expected ${HEADERS.length} columns`);
    const result = Object.fromEntries(HEADERS.map((header, column) => [header, fields[column].trim()]));
    if (!result.reviewer || !result.case_id || !result.candidate) fail(`Line ${line}: reviewer, case_id, and candidate are required`);
    if (!expectedCaseIds.has(result.case_id)) fail(`Line ${line}: unknown manifest case: ${result.case_id}`);
    const scoreKey = `${result.reviewer}\u0000${result.candidate}\u0000${result.case_id}`;
    if (scoreKeys.has(scoreKey)) fail(`Duplicate score for reviewer ${result.reviewer}, candidate ${result.candidate}, case ${result.case_id}`);
    scoreKeys.add(scoreKey);
    for (const field of HUMAN_SCORE_FIELDS) result[field] = parseNumber(result[field], field, line, { integer: true, min: 1, max: 5 });
    result.latency_ms = parseNumber(result.latency_ms, "latency_ms", line);
    result.cost_rub = parseNumber(result.cost_rub, "cost_rub", line);
    if (result.technical_success !== "true" && result.technical_success !== "false") {
      fail(`Line ${line}: technical_success must be true or false`);
    }
    result.technical_success = result.technical_success === "true";
    reviewers.add(result.reviewer);
    if (!candidates.has(result.candidate)) candidates.set(result.candidate, []);
    candidates.get(result.candidate).push(result);
  }

  const summary = [];
  for (const [candidate, results] of candidates) {
    const candidateCases = new Set(results.map((result) => result.case_id));
    const missing = expectedCases.filter((caseId) => !candidateCases.has(caseId));
    if (missing.length) fail(`Candidate ${candidate} is missing cases: ${missing.join(", ")}`);
  }
  if (reviewers.size < 2) fail("At least 2 distinct reviewers are required");
  for (const reviewer of reviewers) {
    for (const [candidate, results] of candidates) {
      const reviewedCases = new Set(results.filter((result) => result.reviewer === reviewer).map((result) => result.case_id));
      const missing = expectedCases.filter((caseId) => !reviewedCases.has(caseId));
      if (missing.length) fail(`Reviewer ${reviewer} is missing ${candidate} cases: ${missing.join(", ")}`);
    }
  }
  for (const [candidate, results] of candidates) {
    const aggregate = { candidate, technical_success_rate: results.filter((result) => result.technical_success).length / results.length };
    for (const field of [...HUMAN_SCORE_FIELDS, "latency_ms", "cost_rub"]) {
      aggregate[`${field}_median`] = median(results.map((result) => result[field]));
    }
    summary.push(aggregate);
  }
  summary.sort((left, right) => left.candidate.localeCompare(right.candidate));
  console.log(JSON.stringify(summary, null, 2));
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
