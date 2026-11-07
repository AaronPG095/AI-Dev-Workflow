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
---
# Workflow V3 Supercharged (PR Automation, Handoff/Resume, In-Repo ADRs, Batch Exec, Installer)

## Summary

Expand the AI-Dev-Workflow with automated PR lifecycle management (`ticket.mjs pr`), seamless cross-model session handoffs (`ticket.mjs handoff` and `resume`), in-repo Architecture Decision Records (`ticket.mjs adr`), multi-repo batch execution (`ticket.mjs exec`), and a one-line new machine bootstrapper (`scripts/install.ps1`).

## Acceptance criteria

- [ ] `node scripts/ticket.mjs pr` verifies closeout, formats PR body from plan criteria/tests/deferred, opens PR via `gh`, and ships ticket.
- [ ] `node scripts/ticket.mjs handoff` records structured handoff line with done/next/open items and tree status in plan log.
- [ ] `node scripts/ticket.mjs resume` outputs active plan context, last handoff notes, tree status, and next pending action.
- [ ] `node scripts/ticket.mjs adr "<Title>"` creates an in-repo Architecture Decision Record under `docs/decisions/` with incremented index.
- [ ] `node scripts/ticket.mjs exec "<cmd>"` executes command across all local repositories and prints a status table.
- [ ] `scripts/install.ps1` downloads canonical workflow files from GitHub and bootstraps any target repository on any machine.
- [ ] All unit and integration tests in `scripts/ticket.test.mjs` pass 100%.

## Steps

- [ ] Implement `pr` command in `scripts/ticket.mjs` for one-command PR creation and shipping.
- [ ] Implement `handoff` and `resume` commands in `scripts/ticket.mjs` for multi-model transitions.
- [ ] Implement `adr` command in `scripts/ticket.mjs` for in-repo architectural decision records.
- [ ] Implement `exec` command in `scripts/ticket.mjs` for running commands across known repos.
- [ ] Create `scripts/install.ps1` for one-line machine bootstrapping.
- [ ] Add unit tests for all new commands in `scripts/ticket.test.mjs`.
- [ ] Update `AGENTS.md`, `.agents/skills/`, and documentation.
- [ ] Verify test suite passes 100%.
- [ ] Pack, review, check, and ship V3 in `AI-Dev-Workflow`.
- [ ] Roll out complete V3 suite across all 5 downstream repositories.

## Risks

- **GitHub CLI `gh` presence**: `pr` command requires `gh`; if not installed or unauthenticated, it should fail gracefully with a clear message and print the ready-to-paste PR markdown instead of crashing.
- **Git dirty state during handoff**: Handoff should detect and report uncommitted changes so the incoming model knows if work was in flight.

## Out of scope

- Direct database writes to personal Life OS Notes (decisions strictly belong in git).

## Notes

- Aaron approved all 5 steps and confirmed keeping technical docs strictly in git rather than personal Life OS Notes: "I agree that GitHub and the repos should definitely be the location where this information gets stored. Let's implement all of the mentioned steps."

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
