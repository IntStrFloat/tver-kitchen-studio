# AI Image Provider Decision

Status: pending blinded benchmark

## Decision gate

Do not implement Phase 2 or select an image API until this table is completed from a valid private benchmark dataset and blinded reviews.

## Benchmark protocol

- Validate the private manifest with `npm run benchmark:validate`.
- Generate every case with the same settings for each anonymous candidate code.
- Randomize candidate codes before at least two reviewers score the outputs.
- Summarize results with `npm run benchmark:summarize`.
- Keep the candidate-code-to-vendor mapping in a local file outside source control.

## Criteria

| Criterion | Required evidence | Threshold |
| --- | --- | --- |
| Product fidelity | Median blinded score (1-5) | Record result; target supports at least 80% recognizable products |
| Room preservation | Median blinded score (1-5) | Record result |
| Perspective | Median blinded score (1-5) | Record result |
| Mask quality | Median blinded score (1-5) | Record result |
| Technical success | Successful results / attempts | At least 90% |
| Latency | Median `latency_ms` | At most 45 seconds |
| Cost | Median `cost_rub` | Record result and budget impact |
| Retention | Current data-processing terms | Compatible with 24-hour deletion requirement |

## Evidence table

| Date | Candidate code | API version | Fidelity | Room | Perspective | Mask | Success | Latency | Cost | Retention policy | Decision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |

## Outcome

No candidate has been selected. This document remains a template until the blinded benchmark is completed and the evidence table is filled with measured results.
