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
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
    } else if (character === '"') {
      if (field) fail("Malformed CSV quote");
      quoted = true;
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }
  if (quoted) fail("Unterminated CSV quote");
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((fields) => fields.some((value) => value !== ""));
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

function main() {
  const csvPath = process.argv[2];
  if (!csvPath) fail("Usage: node scripts/try-on/summarize-results.mjs <scores.csv>");
  const rows = parseCsv(readFileSync(csvPath, "utf8"));
  if (rows.length < 2) fail("Scores CSV must include a header and at least one result");
  if (rows[0].length !== HEADERS.length || rows[0].some((header, index) => header !== HEADERS[index])) {
    fail(`CSV headers must be exactly: ${HEADERS.join(",")}`);
  }

  const caseIds = new Set();
  const candidates = new Map();
  for (let index = 1; index < rows.length; index += 1) {
    const line = index + 1;
    const fields = rows[index];
    if (fields.length !== HEADERS.length) fail(`Line ${line}: expected ${HEADERS.length} columns`);
    const result = Object.fromEntries(HEADERS.map((header, column) => [header, fields[column].trim()]));
    if (!result.reviewer || !result.case_id || !result.candidate) fail(`Line ${line}: reviewer, case_id, and candidate are required`);
    for (const field of HUMAN_SCORE_FIELDS) result[field] = parseNumber(result[field], field, line, { integer: true, min: 1, max: 5 });
    result.latency_ms = parseNumber(result.latency_ms, "latency_ms", line);
    result.cost_rub = parseNumber(result.cost_rub, "cost_rub", line);
    if (result.technical_success !== "true" && result.technical_success !== "false") {
      fail(`Line ${line}: technical_success must be true or false`);
    }
    result.technical_success = result.technical_success === "true";
    caseIds.add(result.case_id);
    if (!candidates.has(result.candidate)) candidates.set(result.candidate, []);
    candidates.get(result.candidate).push(result);
  }

  const expectedCases = [...caseIds].sort();
  const summary = [];
  for (const [candidate, results] of candidates) {
    const candidateCases = new Set(results.map((result) => result.case_id));
    const missing = expectedCases.filter((caseId) => !candidateCases.has(caseId));
    if (missing.length) fail(`Candidate ${candidate} is missing cases: ${missing.join(", ")}`);
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
