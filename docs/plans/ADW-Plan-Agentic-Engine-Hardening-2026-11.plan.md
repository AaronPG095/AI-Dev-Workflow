---
title: Plan - Bug: Agentic Engine Hardening, Cross-Worktree Sync & Deterministic Circuit Breaker
ticket: local://ADW:ADW-Plan-Agentic-Engine-Hardening-2026-11
status: in-progress
priority: high
state: flow
due: 
devTicketKey: ADW:ADW-Plan-Agentic-Engine-Hardening-2026-11
agent: Gemini
branch: feat/agentic-engine-hardening
worktree: AI-Dev-Workflow
startedAt: 2026-11-10
---
# Agentic Engine Hardening, Cross-Worktree Sync & Deterministic Circuit Breaker

## Summary

Fix all five edge-case bugs identified in the initial Agentic Engine review and implement three high-leverage reliability upgrades: (1) Cross-worktree split-brain fix and live worktree reading in `wave`, (2) Hygiene gate before `checkpoint --commit`, aligned default target, and accurate post-tick `Next open item [#]` re-indexing, (3) Deterministic `retryCount` circuit breaker in `checkpoint` and `step`, and (4) Enriched `--role builder` brief and installer parity in `install.ps1`/`install.sh`.

## Acceptance criteria

- [ ] Cross-Worktree `wave` Accuracy: `wave --spawn` writes updated `worktree`, `branch`, and `status: in-progress` metadata to both the main plan and the spawned `.worktrees/<name>/<plan.rel>` file; `wave --status` excludes `done`/`shipped` plans (unless `--all` is passed) and reads live checkbox progress from `.worktrees/<name>/<plan.rel>` when that worktree directory exists.
- [ ] Hygiene-Gated `checkpoint --commit` & Target Alignment: `checkpoint` (when called with no explicit index) defaults to `openSteps[0] || openCriteria[0]` (matching `step`); `checkpoint --commit` runs `checkHygiene()` before staging (`git add -A`) and aborts with a clear error if hygiene is not clean; both `tick` and `checkpoint` re-run `findCheckboxes(plan.body)` after updating `plan.body` so the reported `Next open item [#]` matches the new `openIndex`.
- [ ] Deterministic Circuit Breaker (`retryCount`): When verification fails in `checkpoint`, `plan.meta.retryCount` is incremented and persisted to disk before exiting non-zero; when `retryCount >= maxRetries`, `checkpoint` outputs `CIRCUIT BREAKER TRIPPED (<retryCount>/<maxRetries>)` and instructs the agent to run `handoff`; when verification passes, `delete plan.meta.retryCount` clears the counter.
- [ ] Enriched Builder Brief & Installer Parity: `step --role builder` includes a `## Completed Steps & Latest Progress` section (showing count/list of ticked steps and the last Progress log line), and both `scripts/install.ps1` and `scripts/install.sh` include `.agents/skills/agentic-workflow/SKILL.md` and `.claude/skills/agentic-workflow/SKILL.md`.
- [ ] Hermetic Regression Tests: New/updated tests in `scripts/ticket.test.mjs` verify (a) `checkpoint` retry counter increment, circuit-breaker trip at `maxRetries`, and reset on pass, (b) `checkpoint --commit` hygiene rejection on `.tmp` debris, (c) accurate post-tick `Next open item [1]` re-indexing, and (d) `wave --status` reading live progress from inside a spawned `.worktrees/<name>` checkout and filtering `done`/`shipped` plans.

## Steps

- [ ] Step 1 (Fix `tick` & `checkpoint` Indexing, Default Target, and Hygiene Gate): Compute `openSteps` and `openCriteria` in `checkpoint`, default `rawTarget` to `openSteps[0] || openCriteria[0]`, run `checkHygiene()` before `git add -A` under `--commit`, and re-parse `findCheckboxes` post-tick in both `tick` and `checkpoint` so `Next open item [#]` displays accurate re-indexed numbers.
- [ ] Step 2 (Implement Deterministic `retryCount` Circuit Breaker in `checkpoint` & `step`): Track consecutive verification failures in `plan.meta.retryCount`, persist to plan, fail with `CIRCUIT BREAKER TRIPPED` when `retries >= maxRetries`, clear on pass, and display `retryCount` in `step` (both text and `--json`).
- [ ] Step 3 (Enrich `step --role builder` with Completed Steps & Progress): In `commands.step()`, compute `completedSteps` and extract `lastLog` from `Progress log`, adding a `## Completed Steps & Latest Progress` section to `--role builder`.
- [ ] Step 4 (Fix `wave --spawn` Worktree Plan Sync & `wave --status` Live Worktree Reading): In `wave --spawn`, sync the updated plan into `.worktrees/<name>/<plan.rel>`; in `wave --status`, filter out `done`/`shipped` plans by default, and load live `.plan.md` from `.worktrees/<name>/<plan.rel>` when present.
- [ ] Step 5 (Update `install.ps1`, `install.sh`, and Hermetic Tests): Add agentic skills to `scripts/install.ps1` and `scripts/install.sh`, add regression tests in `scripts/ticket.test.mjs`, and verify all tests pass with `node --test scripts/ticket.test.mjs`.

## Risks

- Path resolution when reading a worktree's `.plan.md`: Override `plan.rel = rawPlan.rel` after reading the worktree plan so relative table formatting remains clean.

## Out of scope

- Adding new CLI subcommands beyond refining `step`, `checkpoint`, `tick`, and `wave`.

## Notes

Plan approved by Aaron: "Approved. Implement."

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
