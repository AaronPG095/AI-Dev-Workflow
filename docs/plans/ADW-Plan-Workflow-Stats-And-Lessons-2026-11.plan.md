---
title: Plan - Feature: Workflow Stats And Lessons
ticket: local://ADW:ADW-Plan-Workflow-Stats-And-Lessons-2026-11
status: in-progress
priority: 
state: 
due: 
appetite: L
devTicketKey: ADW:ADW-Plan-Workflow-Stats-And-Lessons-2026-11
agent: Gemini
branch: feat/workflow-stats-and-lessons
worktree: AI-Dev-Workflow
startedAt: 2026-11-14
reviewedBy: Other
reviewVerdict: pass
reviewFingerprint: 2c61a928f926a3663e2599fe6e00c946da35645bdf43ca12c01360f8ca94bd31
---
# Workflow Stats And Lessons

## Summary

Zero-dependency local workflow analytics (`ticket.mjs stats`) and a closed-loop retrospective ledger (`docs/lessons.md` via `lesson`, `--retro`, `recall`, `review --prompt`, and `step --role reviewer`) measure cycle time, review block rates, retries, deferrals, and escaped defects while feeding past learnings back into active reviews.

## Context

- `scripts/ticket.mjs`: `BOOLEAN_FLAGS` (`#L128-L153`), `buildStepBrief` (`#L1618-L1706`), `commands.review` (`#L3169-L3206`), `commands.ship` (`#L3394-L3402`), `commands.pr` (`#L3404-L3482`), `commands.recall` (`#L4035-L4122`), `getKnownRepoDirs` (`#L1360-L1378`).
- `README.md`: command reference (`#L232-L245`).
- `.agents/skills/dev-workflow/SKILL.md` & `.claude/skills/dev-workflow/SKILL.md`: workflow step guidance (`#L14`).
- Constraint: zero external npm dependencies, Node.js 22+, Windows PowerShell compatibility, and byte-identical mirrored `.agents/skills/` and `.claude/skills/`.

## Open questions

None

## Acceptance criteria

- [x] AC1: `ticket.mjs stats [--fleet] [--days <N>] [--json]` scans plans in `docs/plans/` and `docs/plans/archive/**`, computing counts by status/type, median and p90 cycle time (`startedAt` to `completedAt` or merge commit date), review pass/warn/block/self-review rates, deferral rate, and retry/circuit-breaker totals. verified(test): T2.2 passes in node --test scripts/ticket.test.mjs (81/81)
- [x] AC2: `stats` flags potential escaped defects where a `Bug`/`Debug` plan or `git log --grep="^Revert"` commit within 14 days touches files changed by an earlier merged `Feature`/`Refactor` plan. verified(test): T2.2 verifies 14d escaped-defect detection for bug plans and reverts
- [x] AC3: `ticket.mjs lesson "<takeaway>" [--tags <a,b>] [--plan <path>]` and optional `--retro "<takeaway>"` on `ship` and `pr` append `- YYYY-MM-DD | <tags/plan> | <takeaway>` entries to `docs/lessons.md`. verified(test): T2.7 verifies lesson command and ship/pr --retro appends to docs/lessons.md
- [x] AC4: `recall [<keyword>] [--lessons] [--fleet]` searches `docs/lessons.md` alongside ADRs and plans (filtering to lessons only when `--lessons` is set), and `review --prompt` / `step --role reviewer` include up to 5 relevant/recent lessons from `docs/lessons.md`. verified(test): T2.7 verifies recall --lessons, review --prompt, and step reviewer lessons
- [x] AC5: `node --test scripts/ticket.test.mjs` passes with hermetic tests covering `stats`, escaped-defect detection, `lesson`, `--retro`, `recall --lessons`, and reviewer lessons surfacing; `README.md` and mirrored skills match byte-for-byte. verified(test): 81/81 tests pass, doctor Invariants 4/4 pass, skills diff empty

## Steps

- [x] Add `collectRepoStats(dir, { days })` and `commands.stats()` (`--fleet`, `--days`, `--json`) with median/p90 cycle time, review/deferral/retry metrics, and 14-day escaped-defect correlation (AC1, AC2). verified: Implemented collectRepoStats and commands.stats with --fleet/--days/--json
- [x] Add `appendLesson()`, `commands.lesson()`, and `--retro` support on `commands.ship()` and `commands.pr()` plus `BOOLEAN_FLAGS` `--lessons` (AC3). verified: Implemented appendLesson, commands.lesson, --retro hooks, and --lessons flag
- [x] Update `commands.recall()`, `commands.review()` (`--prompt`), and `buildStepBrief()` (`reviewer`) to surface `docs/lessons.md` entries (AC4). verified: Updated recall, review --prompt, and buildStepBrief reviewer role
- [x] Update `README.md`, `.agents/skills/dev-workflow/SKILL.md`, and `.claude/skills/dev-workflow/SKILL.md` identically (AC5). verified: Updated README.md and both mirrored dev-workflow SKILL.md files identically
- [x] Add hermetic tests for T2.2 and T2.7 in `scripts/ticket.test.mjs` and run `node --test scripts/ticket.test.mjs` (AC5). verified: Added T2.2 and T2.7 hermetic tests; 81/81 passed

## Risks

- `stats` on repositories with deep git history could become slow or hit process buffer limits; mitigate by bounding `git log` queries with `--since` (derived from `--days`, default 90) and parsing commit headers + `--name-only` without diffs.
- `git log` inside brand-new or empty-commit repos exits non-zero; mitigate by guarding `git` calls with `allowFail: true` and falling back gracefully to empty commit lists.

## Out of scope

- External telemetry services, network analytics, or Notion metrics dashboards (100% local git + markdown).

## Notes

- Aaron approved `tier1-tier2-implementation-plan.md` ("The user has approved this document.") and instructed: "Merge PR 29 and proceed to plan D."

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
- 2026-11-14 09:38 UTC, Other (review: pass [standards: pass, spec: pass]): AC1-AC5 verified (81/81 tests pass, doctor 4/4 invariants pass, skills byte-identical, README/AGENTS compliant). Minor cosmetic note: --days 0 prints alld in text header.
