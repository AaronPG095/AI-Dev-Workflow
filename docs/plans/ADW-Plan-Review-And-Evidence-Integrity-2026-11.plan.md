---
title: Plan - Feature: Review And Evidence Integrity
ticket: local://ADW:ADW-Plan-Review-And-Evidence-Integrity-2026-11
status: shipped
priority: 
state: 
due: 
devTicketKey: ADW:ADW-Plan-Review-And-Evidence-Integrity-2026-11
agent: Gemini
branch: gemini/review-and-evidence-integrity
worktree: AI-Dev-Workflow
startedAt: 2026-11-13
reviewedBy: Other
reviewVerdict: pass
reviewFingerprint: 5677be1cc1c42a17d62a29c61e887fc0d3ea24f034467343ebc40e04adeb31da
pr: https://github.com/AaronPG095/AI-Dev-Workflow/pull/27
---
# Review And Evidence Integrity

## Summary

Eliminate self-review loopholes, detect test tampering or dropped assertions during review, and upgrade `verified:` evidence from unchecked prose into typed, optionally command-executed proof.

## Acceptance criteria

- [x] AC1: When `config.requireReview` is `true`, `review`, `check`, and `ci-check` reject `reviewedBy` matching `plan.meta.agent` (case-insensitive) unless `--self-review "<reason>"` was recorded in `reviewSelfReason`. verified(test): T1.1 subtest in scripts/ticket.test.mjs passes
- [x] AC2: `pack` prints a `## Test Integrity` section flagging deleted test files, net dropped test cases, newly added `.skip`/`.only`/`.todo`, or net dropped assertion lines vs base; `review --verdict pass` rejects a net test drop or added skip unless `--allow-test-drop "<reason>"` is supplied. verified(test): T1.2 subtest in scripts/ticket.test.mjs passes
- [x] AC3: `tick <#> --verify-cmd "<cmd>"` runs `<cmd>`, fails without ticking if exit != 0, and records `verified(cmd): \`<cmd>\` exit 0 @<shortSha>`; `verified(test|cmd|manual|inspect):` prefixes are accepted everywhere alongside legacy `verified:`. verified(test): T1.3 subtest in scripts/ticket.test.mjs passes
- [x] AC4: `check --strict` fails if all ticked Acceptance Criteria use `verified(manual):` when a `verifyCommand` or `verify` tier is configured. verified(test): T1.3 subtest in scripts/ticket.test.mjs passes
- [x] AC5: `node --test scripts/ticket.test.mjs` passes with new hermetic tests for T1.1–T1.3, and `README.md` + `.agents/skills/` + `.claude/skills/` are updated identically. verified(test): node --test scripts/ticket.test.mjs 75/75 pass; skills mirrors checked

## Steps

- [x] Implement independent-review enforcement (`problems`, `review --self-review`, `reviewSelfReason`) in `scripts/ticket.mjs` (AC1).
- [x] Implement `analyzeTestIntegrity` and wire `## Test Integrity` into `pack` and `--allow-test-drop` into `review` in `scripts/ticket.mjs` (AC2).
- [x] Implement typed evidence prefixes (`VERIFIED_RE`), `tick --verify-cmd` / `--evidence-type`, `checkpoint` SHA tagging, and `check --strict` manual-only gate in `scripts/ticket.mjs` (AC3, AC4).
- [x] Update `README.md`, `.agents/skills/{dev-workflow,quick-review,agentic-workflow}/SKILL.md`, and `.claude/skills/*` identically (AC5).
- [x] Add hermetic tests in `scripts/ticket.test.mjs`, audit any existing fixtures affected by T1.1, and run `node --test scripts/ticket.test.mjs` (AC5).

## Risks

- Existing tests in `scripts/ticket.test.mjs` may use the same agent name for `create` and `review` under `requireReview: true`; audit and update those fixtures cleanly.
- `.github/workflows/plan-check.yml` runs the base branch's `scripts/ticket.mjs`, so new `ci-check` rules activate on PRs after this PR merges.

## Out of scope

- Full AST parsing or external mutation-testing frameworks (must remain zero external npm dependencies on Node.js 22+).
- Plan Template v5 (`## Context`, `## Open questions`, `appetite`) and `lint`/`invariants` (covered in Plans B and C).

## Notes

- Aaron approved `tier1-tier2-implementation-plan.md` ("The user has approved this document.").

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
- 2026-11-13 16:57 UTC, Gemini (review: pass [standards: pass, spec: pass]): Implemented T1.1 independent review, T1.2 test integrity, T1.3 executable/typed evidence; 75/75 tests pass [self-review: single-session implementation; verified with 75/75 hermetic tests and pack]
- 2026-11-13 17:06 UTC, Other (review: pass [standards: pass, spec: pass]): Independent fresh-context review: AC1-AC5 implemented cleanly, 75/75 tests pass, skills mirrors identical
