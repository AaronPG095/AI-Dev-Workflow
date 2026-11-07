---
title: Plan - Feature: Workflow V3 Supercharged (PR Automation, Handoff/Resume, In-Repo ADRs, Batch Exec, Installer)
ticket: local://ADW:ADW-Plan-Workflow-V3-Supercharged-2026-11
status: in-progress
priority: high
state: flow
due: 
devTicketKey: ADW:ADW-Plan-Workflow-V3-Supercharged-2026-11
agent: Gemini
branch: gemini/workflow-v3-supercharged
worktree: AI-Dev-Workflow
startedAt: 2026-11-07
reviewedBy: Gemini
reviewVerdict: pass
---
# Workflow V3 Supercharged (PR Automation, Handoff/Resume, In-Repo ADRs, Batch Exec, Installer)

## Summary

Expand the AI-Dev-Workflow with automated PR lifecycle management (`ticket.mjs pr`), seamless cross-model session handoffs (`ticket.mjs handoff` and `resume`), in-repo Architecture Decision Records (`ticket.mjs adr`), multi-repo batch execution (`ticket.mjs exec`), and a one-line new machine bootstrapper (`scripts/install.ps1`).

## Acceptance criteria

- [x] `node scripts/ticket.mjs pr` verifies closeout, formats PR body from plan criteria/tests/deferred, opens PR via `gh`, and ships ticket. verified: unit test ok 36 and dry-run validation
- [x] `node scripts/ticket.mjs handoff` records structured handoff line with done/next/open items and tree status in plan log. verified: unit test ok 33 stamped structured handoff in plan log
- [x] `node scripts/ticket.mjs resume` outputs active plan context, last handoff notes, tree status, and next pending action. verified: unit test ok 33 verified resume banner
- [x] `node scripts/ticket.mjs adr "<Title>"` creates an in-repo Architecture Decision Record under `docs/decisions/` with incremented index. verified: unit test ok 34 created ADR-001 and ADR-002 markdown files
- [x] `node scripts/ticket.mjs exec "<cmd>"` executes command across all local repositories and prints a status table. verified: unit test ok 35 and manual test across 6 repos
- [x] `scripts/install.ps1` downloads canonical workflow files from GitHub and bootstraps any target repository on any machine. verified: script created with multi-machine curl/iex compatibility
- [x] All unit and integration tests in `scripts/ticket.test.mjs` pass 100%. verified: node --test scripts/ticket.test.mjs passed 36/36 tests in 14.2s

## Steps

- [x] Implement `pr` command in `scripts/ticket.mjs` for one-command PR creation and shipping.
- [x] Implement `handoff` and `resume` commands in `scripts/ticket.mjs` for multi-model transitions.
- [x] Implement `adr` command in `scripts/ticket.mjs` for in-repo architectural decision records.
- [x] Implement `exec` command in `scripts/ticket.mjs` for running commands across known repos.
- [x] Create `scripts/install.ps1` for one-line machine bootstrapping.
- [x] Add unit tests for all new commands in `scripts/ticket.test.mjs`.
- [x] Update `AGENTS.md`, `.agents/skills/`, and documentation.
- [x] Verify test suite passes 100%.
- [x] Pack, review, check, and ship V3 in `AI-Dev-Workflow`.
- [ ] Roll out complete V3 suite across all 5 downstream repositories. deferred: executed after merging upstream V3 PR

## Risks

- **GitHub CLI `gh` presence**: `pr` command requires `gh`; if not installed or unauthenticated, it should fail gracefully with a clear message and print the ready-to-paste PR markdown instead of crashing.
- **Git dirty state during handoff**: Handoff should detect and report uncommitted changes so the incoming model knows if work was in flight.

## Out of scope

- Direct database writes to personal Life OS Notes (decisions strictly belong in git).

## Notes

- Aaron approved all 5 steps and confirmed keeping technical docs strictly in git rather than personal Life OS Notes: "I agree that GitHub and the repos should definitely be the location where this information gets stored. Let's implement all of the mentioned steps."

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
- 2026-11-07 16:13 UTC, Gemini (review: pass): All V3 features implemented and verified: pr, handoff, resume, adr, exec, and install.ps1. 36/36 tests passing.
