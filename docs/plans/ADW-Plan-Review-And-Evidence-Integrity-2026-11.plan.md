---
title: Plan - Feature: Review And Evidence Integrity
ticket: local://ADW:ADW-Plan-Review-And-Evidence-Integrity-2026-11
status: planned
priority: 
state: 
due: 
devTicketKey: ADW:ADW-Plan-Review-And-Evidence-Integrity-2026-11
agent: Gemini
---
# Review And Evidence Integrity

## Summary

Eliminate self-review loopholes, detect test tampering or dropped assertions during review, and upgrade `verified:` evidence from unchecked prose into typed, optionally command-executed proof.

## Acceptance criteria

- [ ] AC1: When `config.requireReview` is `true`, `review`, `check`, and `ci-check` reject `reviewedBy` matching `plan.meta.agent` (case-insensitive) unless `--self-review "<reason>"` was recorded in `reviewSelfReason`.
- [ ] AC2: `pack` prints a `## Test Integrity` section flagging deleted test files, net dropped test cases, newly added `.skip`/`.only`/`.todo`, or net dropped assertion lines vs base; `review --verdict pass` rejects a net test drop or added skip unless `--allow-test-drop "<reason>"` is supplied.
- [ ] AC3: `tick <#> --verify-cmd "<cmd>"` runs `<cmd>`, fails without ticking if exit != 0, and records `verified(cmd): \`<cmd>\` exit 0 @<shortSha>`; `verified(test|cmd|manual|inspect):` prefixes are accepted everywhere alongside legacy `verified:`.
- [ ] AC4: `check --strict` fails if all ticked Acceptance Criteria use `verified(manual):` when a `verifyCommand` or `verify` tier is configured.
- [ ] AC5: `node --test scripts/ticket.test.mjs` passes with new hermetic tests for T1.1–T1.3, and `README.md` + `.agents/skills/` + `.claude/skills/` are updated identically.

## Steps

- [ ] Implement independent-review enforcement (`problems`, `review --self-review`, `reviewSelfReason`) in `scripts/ticket.mjs` (AC1).
- [ ] Implement `analyzeTestIntegrity` and wire `## Test Integrity` into `pack` and `--allow-test-drop` into `review` in `scripts/ticket.mjs` (AC2).
- [ ] Implement typed evidence prefixes (`VERIFIED_RE`), `tick --verify-cmd` / `--evidence-type`, `checkpoint` SHA tagging, and `check --strict` manual-only gate in `scripts/ticket.mjs` (AC3, AC4).
- [ ] Update `README.md`, `.agents/skills/{dev-workflow,quick-review,agentic-workflow}/SKILL.md`, and `.claude/skills/*` identically (AC5).
- [ ] Add hermetic tests in `scripts/ticket.test.mjs`, audit any existing fixtures affected by T1.1, and run `node --test scripts/ticket.test.mjs` (AC5).

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
