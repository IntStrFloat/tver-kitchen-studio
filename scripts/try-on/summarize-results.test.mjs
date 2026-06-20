import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const script = fileURLToPath(new URL("./summarize-results.mjs", import.meta.url));
const headers = "reviewer,case_id,candidate,product_fidelity,room_preservation,perspective,mask_quality,latency_ms,cost_rub,technical_success";

function createFixture(rows) {
  const directory = mkdtempSync(join(tmpdir(), "try-on-scores-"));
  const manifest = join(directory, "dataset.json");
  const scores = join(directory, "scores.csv");
  writeFileSync(manifest, JSON.stringify({ cases: [{ id: "case-001" }, { id: "case-002" }] }));
  writeFileSync(scores, [headers, ...rows].join("\n"));
  return { directory, manifest, scores };
}

function run(fixture) {
  return execFileSync(process.execPath, [script, fixture.scores, fixture.manifest], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function validRows() {
  return [
    '"Reviewer ""one"", East",case-001,candidate-a,5,4,4,5,1000,12,true',
    '"Reviewer ""one"", East",case-002,candidate-a,3,5,5,4,2000,11,true',
    'Reviewer two,case-001,candidate-a,4,4,4,4,1500,13,false',
    'Reviewer two,case-002,candidate-a,4,4,4,4,1400,10,true',
    '"Reviewer ""one"", East",case-001,candidate-b,4,4,4,4,1200,10,true',
    '"Reviewer ""one"", East",case-002,candidate-b,4,4,4,4,1600,10,true',
    'Reviewer two,case-001,candidate-b,4,4,4,4,1200,10,true',
    'Reviewer two,case-002,candidate-b,4,4,4,4,1600,10,true',
  ];
}

function assertFailure(rows, message) {
  const fixture = createFixture(rows);
  try {
    assert.throws(() => run(fixture), (error) => {
      assert.match(error.stderr, message);
      return true;
    });
  } finally {
    rmSync(fixture.directory, { recursive: true, force: true });
  }
}

test("summarizes complete two-reviewer manifest scores", () => {
  const fixture = createFixture(validRows());
  try {
    const summary = JSON.parse(run(fixture));
    assert.equal(summary.length, 2);
    assert.deepEqual(summary.map(({ candidate }) => candidate), ["candidate-a", "candidate-b"]);
    assert.equal(summary[0].product_fidelity_median, 4);
    assert.equal(summary[0].technical_success_rate, 0.75);
  } finally {
    rmSync(fixture.directory, { recursive: true, force: true });
  }
});

test("rejects candidates missing manifest cases", () => {
  assertFailure(validRows().filter((row) => !row.includes("case-002,candidate-b")), /Candidate candidate-b is missing cases: case-002/);
});

test("requires two distinct reviewers", () => {
  assertFailure(validRows().filter((row) => !row.startsWith("Reviewer two")), /At least 2 distinct reviewers are required/);
});

test("rejects duplicate reviewer candidate case rows", () => {
  assertFailure([...validRows(), validRows()[0]], /Duplicate score for reviewer Reviewer "one", East, candidate candidate-a, case case-001/);
});

test("requires each reviewer to cover every candidate and manifest case", () => {
  assertFailure(validRows().filter((row) => !row.startsWith("Reviewer two,case-002,candidate-b")), /Reviewer Reviewer two is missing candidate-b cases: case-002/);
});

test("reports the starting line for invalid data in quoted multiline fields", () => {
  assertFailure(['"Reviewer\nOne",case-001,candidate-a,6,4,4,4,1000,10,true'], /Line 2: product_fidelity must be an integer from 1 to 5/);
});

test("rejects characters after a closing CSV quote", () => {
  assertFailure(['"Reviewer"x,case-001,candidate-a,4,4,4,4,1000,10,true'], /Malformed CSV quote on line 2/);
});
