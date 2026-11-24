---
title: Plan - Bug: Hermetic Fast Verify Test Hooks And Seeded Lessons
ticket: local://ADW:ADW-Plan-Hermetic-Fast-Verify-Test-Hooks-And-Seeded-Lessons-2026-11
status: in-progress
priority: 
state: 
due: 
appetite: S
version: 
impact: 
dependsOn: 
devTicketKey: ADW:ADW-Plan-Hermetic-Fast-Verify-Test-Hooks-And-Seeded-Lessons-2026-11
agent: Gemini
branch: gemini/hermetic-fast-verify-test-hooks-and-seeded-lessons
worktree: AI-Dev-Workflow
startedAt: 2026-11-24
---
# Hermetic Fast Verify Test Hooks And Seeded Lessons

## Summary

Make F1 verify.fast test assertion hermetic for downstream repos, track .claude/settings.json runtime hooks in git, and merge the 3 seeded workflow lessons onto main.

## Context

None noted.

## Open questions

None

## Acceptance criteria

- [ ] F1 test in scripts/ticket.test.mjs passes both in AI-Dev-Workflow and when downstream ticket.config.json sets custom verify.fast
- [ ] Agent runtime hooks installed and tracked in .claude/settings.json (3/3 events)
- [ ] docs/lessons.md includes the 3 seeded workflow lessons alongside existing lessons and passes ticket.test.mjs

## Steps

- [ ] Update F1 assertion in scripts/ticket.test.mjs to be downstream-hermetic
- [ ] Install and stage .claude/settings.json via ticket.mjs hook install --agent-hooks
- [ ] Append the 3 seeded lessons from .worktrees/seed-lessons/docs/lessons.md into docs/lessons.md
- [ ] Run node --test scripts/ticket.test.mjs, independent subagent review, check, PR, and merge

## Risks

None noted.

## Out of scope

None noted.

## Notes

- Approval (Aaron): "Do all"

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
