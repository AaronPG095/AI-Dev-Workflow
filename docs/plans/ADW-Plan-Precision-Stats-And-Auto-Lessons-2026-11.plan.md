---
title: Plan - Feature: Precision Stats And Auto Lessons
ticket: local://ADW:ADW-Plan-Precision-Stats-And-Auto-Lessons-2026-11
status: in-progress
priority: 
state: 
due: 
appetite: L
version: 
impact: 
blueprint: docs/architecture/ADW-Blueprint-Workflow-Next-Gen-Refinements.md
devTicketKey: ADW:ADW-Plan-Precision-Stats-And-Auto-Lessons-2026-11
agent: Gemini
branch: feat/precision-stats-and-auto-lessons
worktree: AI-Dev-Workflow
startedAt: 2026-11-23
reviewedBy: Other
reviewVerdict: pass
reviewSession: reviewer-argon-low
reviewModel: gemini-4-argon-low
baseBranch: main
reviewFingerprint: d089a1f1c4af77a633fba897291f00fba55438961502dc4232d8fa95ff554bea
---
# Precision Stats And Auto Lessons

## Summary

Upgrade escaped-defect detection in `ticket.mjs stats` from noisy file-level $N \times M$ overlap to hunk-range and most-recent-owner attribution (excluding docs/test/localization noise files), automatically capture deduplicated lessons in `docs/lessons.md` on `Bug`/`Debug` close-out and `review: block` -> `pass` transitions, and expand `recall` to search `docs/architecture/` and `docs/dev-workflow/`.

## Context

- Blueprint: `docs/architecture/ADW-Blueprint-Workflow-Next-Gen-Refinements.md`
- `scripts/ticket.mjs`: `appendLesson()` (`#L1960-L1988`), `collectRepoStats()` (`#L2114-L2350`), `commands.review()` (`#L4155-L4360`), `commands.ship()` / `commands.pr()` / `commands.done()` / `commands.merge()` (`#L4425-L4620`), `commands.recall()` (`#L5318-L5439`).

## Open questions

None

## Acceptance criteria

- [x] AC1: `collectRepoStats()` in `scripts/ticket.mjs` excludes doc/test/localization noise files (`README.md`, `CHANGELOG.md`, `AGENTS.md`, `CLAUDE.md`, `*.md`, `*.resw`, test files, or `config.stats?.ignoreFiles`) from escaped-defect correlation, checks diff line-range (`@@ -a,b +c,d @@`) overlap when a shared source file is touched by >2 feature plans, and attributes each `Bug`/`Debug` plan or `Revert` commit within 14d to at most the single most recent matching `Feature`/`Refactor` plan (unless `--all-overlaps` is passed). verified(test): G1 test and stats --fleet verify noise-file filtering, hunk-range intersection on shared files (>2 feature plans), and most-recent-owner attribution (139 -> 10 fleet pairs)
- [x] AC2: `appendLesson()` deduplicates entries in `docs/lessons.md` so re-recording the same `planRel` and normalized `text` returns `{ deduplicated: true }` without adding duplicate lines. verified(test): G1 test verifies appendLesson deduplication by normalized text and planRel
- [x] AC3: `review` (when stamping `verdict: pass` on a plan whose `Progress log` contains a prior `review: block`) and `ship` / `pr` (non-dry-run) / `done` / `merge` (when closing a `Bug` or `Debug` plan without explicit `--retro`) automatically capture a deduplicated lesson in `docs/lessons.md`. verified(test): G1 test verifies auto-lesson capture on review block->pass and Bug close-out (done/ship/pr/merge)
- [x] AC4: `ticket.mjs recall "<keyword>" [--fleet]` searches `docs/architecture/` (`[Blueprint]`) and `docs/dev-workflow/` (`[Doc]`) alongside ADRs, plans, and lessons when `--lessons` is not set. verified(test): G1 test verifies recall searches docs/architecture/ ([Blueprint]) and docs/dev-workflow/ ([Doc])
- [x] AC5: `node --test scripts/ticket.test.mjs` passes with hermetic tests covering hunk/most-recent escaped-defect attribution, deduplicated auto-lessons on `block -> pass` and `Bug` close-out, and `recall` across `docs/architecture/` and `docs/dev-workflow/`; `README.md` and mirrored skills match byte-for-byte. verified(test): node --test scripts/ticket.test.mjs (96/96 pass) and doctor Invariants 4/4 passed

## Steps

- [x] Add deduplication to `appendLesson()` and auto-lesson helpers (`autoCaptureBlockerResolutionLesson`, `autoCaptureBugLesson`) wired into `review`, `ship`, `pr`, `done`, and `merge` in `scripts/ticket.mjs` (AC2, AC3). verified(test): done
- [x] Upgrade `collectRepoStats()` escaped-defect correlation with noise-file filtering, diff line-range (`@@ ... @@`) intersection for high-frequency shared files, and most-recent-owner attribution (plus `--all-overlaps` flag) in `scripts/ticket.mjs` (AC1). verified(test): done
- [x] Expand `commands.recall()` in `scripts/ticket.mjs` to scan `docs/architecture/` (`[Blueprint]`) and `docs/dev-workflow/` (`[Doc]`) (AC4). verified(test): done
- [x] Update `README.md`, `.agents/skills/dev-workflow/SKILL.md`, and `.claude/skills/dev-workflow/SKILL.md` identically (AC5). verified(test): done
- [x] Add hermetic test `G1` in `scripts/ticket.test.mjs` and run `node --test scripts/ticket.test.mjs` (AC5). verified(test): done

## Risks

- Existing test `T2.2` in `scripts/ticket.test.mjs` verifies escaped-defect detection on `src/parser.js` and `src/cache.js`; ensure single-file overlap on non-noise source files (`src/*.js`) continues to match in `T2.2` when line ranges overlap (or when a file is touched by <=2 feature plans).
- `commands.pr()` asserts a clean working tree snapshot before pushing; ensure any auto-captured lesson on `Bug` plans during `pr` is committed via `--only -- docs/lessons.md` just like `--retro`.

## Out of scope

- `dependsOn`, `ready`, `blueprint status`, and `map` (covered in Plan H).
- Modularizing `scripts/ticket.mjs` into `scripts/lib/` (covered in Plan I).

## Notes

- Aaron approved `next-gen-workflow-implementation-plan.md` ("The user has approved this document.") after instructing: "Run and implement all. Plan out using Argon High and implement using Argon Low."

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
- 2026-11-23 14:45 UTC, Other (review: pass [standards: pass, spec: pass]): AC1-AC5 verified: hunk-range and most-recent-owner escaped-defect attribution, deduplicated auto-lesson capture on block->pass and Bug close-out, and recall across docs/architecture and docs/dev-workflow implemented cleanly with hermetic tests and full mirror parity. [reviewer: reviewer-argon-low] (model: gemini-4-argon-low)
