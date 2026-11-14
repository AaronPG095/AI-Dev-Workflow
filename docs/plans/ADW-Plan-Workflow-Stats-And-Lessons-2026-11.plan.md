---
title: Plan - Feature: Workflow Stats And Lessons
ticket: local://ADW:ADW-Plan-Workflow-Stats-And-Lessons-2026-11
status: planned
priority: 
state: 
due: 
appetite: L
devTicketKey: ADW:ADW-Plan-Workflow-Stats-And-Lessons-2026-11
agent: Gemini
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

- [ ] AC1: `ticket.mjs stats [--fleet] [--days <N>] [--json]` scans plans in `docs/plans/` and `docs/plans/archive/**`, computing counts by status/type, median and p90 cycle time (`startedAt` to `completedAt` or merge commit date), review pass/warn/block/self-review rates, deferral rate, and retry/circuit-breaker totals.
- [ ] AC2: `stats` flags potential escaped defects where a `Bug`/`Debug` plan or `git log --grep="^Revert"` commit within 14 days touches files changed by an earlier merged `Feature`/`Refactor` plan.
- [ ] AC3: `ticket.mjs lesson "<takeaway>" [--tags <a,b>] [--plan <path>]` and optional `--retro "<takeaway>"` on `ship` and `pr` append `- YYYY-MM-DD | <tags/plan> | <takeaway>` entries to `docs/lessons.md`.
- [ ] AC4: `recall [<keyword>] [--lessons] [--fleet]` searches `docs/lessons.md` alongside ADRs and plans (filtering to lessons only when `--lessons` is set), and `review --prompt` / `step --role reviewer` include up to 5 relevant/recent lessons from `docs/lessons.md`.
- [ ] AC5: `node --test scripts/ticket.test.mjs` passes with hermetic tests covering `stats`, escaped-defect detection, `lesson`, `--retro`, `recall --lessons`, and reviewer lessons surfacing; `README.md` and mirrored skills match byte-for-byte.

## Steps

- [ ] Add `collectRepoStats(dir, { days })` and `commands.stats()` (`--fleet`, `--days`, `--json`) with median/p90 cycle time, review/deferral/retry metrics, and 14-day escaped-defect correlation (AC1, AC2).
- [ ] Add `appendLesson()`, `commands.lesson()`, and `--retro` support on `commands.ship()` and `commands.pr()` plus `BOOLEAN_FLAGS` `--lessons` (AC3).
- [ ] Update `commands.recall()`, `commands.review()` (`--prompt`), and `buildStepBrief()` (`reviewer`) to surface `docs/lessons.md` entries (AC4).
- [ ] Update `README.md`, `.agents/skills/dev-workflow/SKILL.md`, and `.claude/skills/dev-workflow/SKILL.md` identically (AC5).
- [ ] Add hermetic tests for T2.2 and T2.7 in `scripts/ticket.test.mjs` and run `node --test scripts/ticket.test.mjs` (AC5).

## Risks

- `stats` on repositories with deep git history could become slow or hit process buffer limits; mitigate by bounding `git log` queries with `--since` (derived from `--days`, default 90) and parsing commit headers + `--name-only` without diffs.
- `git log` inside brand-new or empty-commit repos exits non-zero; mitigate by guarding `git` calls with `allowFail: true` and falling back gracefully to empty commit lists.

## Out of scope

- External telemetry services, network analytics, or Notion metrics dashboards (100% local git + markdown).

## Notes

- Aaron approved `tier1-tier2-implementation-plan.md` ("The user has approved this document.") and instructed: "Merge PR 29 and proceed to plan D."

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
