---
title: Blueprint: Workflow Next Gen Refinements
status: active
plannerModel: gemini-4-argon-high
created: 2026-11-23
---
# Architecture Blueprint: Workflow Next Gen Refinements

## Goal & Non-Goals

- **Goal:** Eliminate verification latency, escaped-defect noise, zero-lesson blind spots, multi-plan dependency gaps, and single-file monolith bloat across `AI-Dev-Workflow` and its 7-repository fleet.
- **Non-Goals:** Adding external npm dependencies, breaking v4/v5 plan compatibility, or auto-mutating downstream `ticket.config.json` during `--check --bundle-only`.

## Architecture & Boundaries

- **Verification & Fleet Hygiene (Plan F):** Template `.git` fixture caching in `scripts/ticket.test.mjs`, sub-second `verify.fast` tier (`node --check scripts/ticket.mjs`), `archive --merged [--fleet] [--dry-run]`, `sync.mjs --ensure-invariants`, and dirty-protected-branch `doctor` warnings.
- **Feedback Loop Precision & Auto-Lessons (Plan G):** Hunk-range and most-recent-owner escaped-defect attribution in `collectRepoStats()`, deduplicated automatic lesson capture on `Bug`/`Debug` close-out and `review: block` -> `pass` resolution, and `recall` across `docs/architecture/` and `docs/dev-workflow/`.
- **Dependency Graph, Ready Queue & Repo Map (Plan H):** `dependsOn:` frontmatter parsing/cycle checking, `ticket.mjs ready [--claim|--release]`, `ticket.mjs blueprint status`, dependency-gated `wave --spawn`, and `ticket.mjs map` symbol outline.
- **Modular CLI Architecture (Plan I):** Extract cohesive domain modules under `scripts/lib/` (`markdown-plan.mjs`, `invariants-lint.mjs`, `stats-lessons.mjs`, `symbols-map.mjs`), registered in `WORKFLOW_FILES` and `scripts/workflow-manifest.json`.

## Contracts & Invariants

- Zero external npm dependencies; runs on Node.js 22+.
- `.agents/skills/` and `.claude/skills/` remain byte-identical (`mirrorDirs`).
- Every public CLI command in `commands` is documented in `README.md` (`readmeCliSync`).
- `node scripts/sync.mjs --check --bundle-only .` and `node scripts/ticket.mjs doctor` pass at the end of every slice.

## PR Slice Breakdown

1. **Plan F (`docs/plans/ADW-Plan-Fast-Verify-And-Fleet-Hygiene-2026-11.plan.md`)** — Fast verification tier, cached `.git` test fixture, `archive --merged [--fleet]`, `sync.mjs --ensure-invariants`, dirty protected-branch warning.
2. **Plan G (`docs/plans/ADW-Plan-Precision-Stats-And-Auto-Lessons-2026-11.plan.md`)** — Hunk/most-recent escaped-defect attribution, automatic `Bug` and `block->pass` lesson capture with deduplication, and `recall` expansion.
3. **Plan H (`docs/plans/ADW-Plan-Dependency-Graph-Ready-Queue-And-Map-2026-11.plan.md`)** — `dependsOn`, `ticket.mjs ready [--claim|--release]`, `blueprint status`, dependency-aware `wave --spawn`, and `ticket.mjs map`.
4. **Plan I (`docs/plans/ADW-Plan-Modularize-Ticket-Cli-2026-11.plan.md`)** — Modularize `scripts/ticket.mjs` into `scripts/lib/*.mjs` with characterization tests and manifest sync parity.

## Living Updates & ADRs

- Planned on Gemini 4 Argon (High); executed sequentially via Gemini 4 Argon (Low) workers with independent subagent review.
