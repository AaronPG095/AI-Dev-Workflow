---
title: Plan - Bug: Hermetic Fast Verify Test Hooks And Seeded Lessons
ticket: local://ADW:ADW-Plan-Hermetic-Fast-Verify-Test-Hooks-And-Seeded-Lessons-2026-11
status: shipped
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
reviewedBy: Gemini
reviewVerdict: pass
reviewSession: ff858aae-7974-41c2-a77b-ecb412ed3d9d
baseBranch: main
reviewFingerprint: 2fd4703e085ac65477670dba787032ffa42c34dfaae05732aab98ff109421bb6
pr: https://github.com/AaronPG095/AI-Dev-Workflow/pull/53
---
# Hermetic Fast Verify Test Hooks And Seeded Lessons

## Summary

Make F1 verify.fast test assertion hermetic for downstream repos, track .claude/settings.json runtime hooks in git, and merge the 3 seeded workflow lessons onto main.

## Context

None noted.

## Open questions

None

## Acceptance criteria

- [x] F1 test in scripts/ticket.test.mjs passes both in AI-Dev-Workflow and when downstream ticket.config.json sets custom verify.fast verified: ticket.test.mjs F1 gated ADW check on prefix===ADW and asserts fixtureCfg.verify.fast; 100/100 tests passed
- [x] Agent runtime hooks installed and tracked in .claude/settings.json (3/3 events) verified: hook status --agent-hooks confirmed 3/3 events in tracked .claude/settings.json
- [x] docs/lessons.md includes the 3 seeded workflow lessons alongside existing lessons and passes ticket.test.mjs verified: 3 lessons appended alongside #52 lesson, recall hooks --lessons matched, 100/100 ticket.test.mjs passed

## Steps

- [x] Update F1 assertion in scripts/ticket.test.mjs to be downstream-hermetic
- [x] Install and stage .claude/settings.json via ticket.mjs hook install --agent-hooks
- [x] Append the 3 seeded lessons from .worktrees/seed-lessons/docs/lessons.md into docs/lessons.md
- [x] Run node --test scripts/ticket.test.mjs, independent subagent review, check, PR, and merge

## Risks

None noted.

## Out of scope

None noted.

## Notes

- Approval (Aaron): "Do all"

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
- 2026-11-24 10:39 UTC, Gemini (review: pass): All 3 acceptance criteria and 4 steps verified cleanly: F1 verify.fast assertion is downstream-hermetic, .claude/settings.json hooks (3/3) and 3 seeded lessons are tracked cleanly, and 100/100 ticket.test.mjs tests pass. [reviewer: ff858aae-7974-41c2-a77b-ecb412ed3d9d]
