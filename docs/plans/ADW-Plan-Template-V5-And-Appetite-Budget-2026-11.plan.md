---
title: Plan - Feature: Template V5 And Appetite Budget
ticket: local://ADW:ADW-Plan-Template-V5-And-Appetite-Budget-2026-11
status: planned
priority: 
state: 
due: 
devTicketKey: ADW:ADW-Plan-Template-V5-And-Appetite-Budget-2026-11
agent: Gemini
---
# Template V5 And Appetite Budget

## Summary

Upgrade `_template.plan.md` and `ticket.mjs new` to capture compacted codebase context (`## Context`), open assumptions (`## Open questions`), pre-mortem risks, outcome-style `AC#` criteria, and Shape Up `appetite` (`S|M|L`) diff-size budgets.

## Acceptance criteria

- [ ] AC1: `docs/plans/_template.plan.md` and `ticket.mjs new` include `appetite:` frontmatter, `## Context`, `## Open questions`, `AC#`-indexed outcome criteria guidance, `(AC#)` step mapping guidance, and pre-mortem framing in `## Risks`.
- [ ] AC2: `prime` displays `Open questions: N` (excluding `None`/empty) and `Appetite: <S|M|L>` when set, while `start` warns (or fails under `--strict`) if `## Open questions` still contains unchecked `- [ ]` items; existing v4 plans remain backwards-compatible.
- [ ] AC3: Setting `appetite: S|M|L` (or `--appetite <S|M|L>` in `new`) checks changed lines/files via `git diff --numstat` (excluding `docs/plans/`) against configured `config.appetite` thresholds; `pack` displays budget usage and `check` warns (or fails under `--strict`) when exceeded, suggesting `ticket.mjs split`.
- [ ] AC4: `node --test scripts/ticket.test.mjs` passes with hermetic tests for v5 scaffolding, backwards compatibility, `prime`/`start` open-question checks, and `appetite` budgets; `README.md`, `ticket.config.json`, `workflow-manifest.json`, and synced skills are updated identically.

## Steps

- [ ] Upgrade `docs/plans/_template.plan.md` with `appetite:`, `## Context`, `## Open questions`, `AC#`/EARS guidance, and pre-mortem `## Risks` prompt (AC1).
- [ ] Update `commands.new()` (`--appetite`, `--context`, fallback inline template) and frontmatter validation for `appetite` in `problems()` in `scripts/ticket.mjs` (AC1, AC3).
- [ ] Add `countOpenQuestions()` and wire into `commands.prime()` and `commands.start()` in `scripts/ticket.mjs` (AC2).
- [ ] Add `checkAppetite()` and wire into `commands.pack()` and `commands.check()`, plus `appetite` defaults in `scripts/ticket.config.json` and `scripts/workflow-manifest.json` (AC3).
- [ ] Update `README.md`, `.agents/skills/dev-workflow/SKILL.md`, and `.claude/skills/dev-workflow/SKILL.md`, add hermetic tests in `scripts/ticket.test.mjs`, and run `node --test scripts/ticket.test.mjs` (AC4).

## Risks

- Existing archived or active v4 plans lack `## Context`, `## Open questions`, and `appetite`; keep all three optional in `problems()` and `ci-check` so v4 plans never break.
- `appetite` diff-size checks must exclude `config.plansDir` so writing/updating the plan doc itself does not consume code budget.

## Out of scope

- Multi-document Spec Kit folders (`spec.md` + `plan.md` + `tasks.md`); everything remains in one `.plan.md` file.
- `ticket.mjs lint` and config `invariants` (covered in Plan C).

## Notes

- Aaron approved `tier1-tier2-implementation-plan.md` ("The user has approved this document.") and confirmed proceeding to Plan B.

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
