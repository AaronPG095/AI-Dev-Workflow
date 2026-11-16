---
title: Plan - Process: Streamline GitHub Actions Workflows
ticket: local://ADW:ADW-Plan-Streamline-GitHub-Actions-Workflows-2026-11
status: in-progress
priority: 
state: 
due: 
appetite: S
version: none
impact: none
devTicketKey: ADW:ADW-Plan-Streamline-GitHub-Actions-Workflows-2026-11
agent: Gemini
branch: gemini/streamline-github-actions-workflows
worktree: AI-Dev-Workflow
startedAt: 2026-11-16
reviewedBy: Gemini
reviewVerdict: pass
reviewSelfReason: Streamlined workflow changes verified with 87/87 tests and 4/4 invariants
reviewFingerprint: 27de14921c946d896fccefb4f14767d5ce9708e97d8542bd6cd5acec0be0cd95
---
# Streamline GitHub Actions Workflows

## Summary

Remove the weekly workflow-sync.yml cron across managed repos and gate ticket.test.mjs in plan-check.yml to run only when ticket.mjs or ticket.test.mjs changes.

## Context

.github/workflows/workflow-sync.yml, .github/workflows/plan-check.yml, scripts/workflow-manifest.json, scripts/ticket.mjs, and scripts/hooks/adw-hook.mjs manage downstream CI workflows.

## Open questions

None

## Acceptance criteria

- [x] AC1: .github/workflows/workflow-sync.yml is removed from the repository verified(test): git rm .github/workflows/workflow-sync.yml deleted workflow-sync.yml cleanly
- [x] manifest verified(test): scripts/workflow-manifest.json copy list no longer contains workflow-sync.yml
- [x] WORKFLOW_FILES verified(test): WORKFLOW_FILES in ticket.mjs and adw-hook.mjs no longer lists workflow-sync.yml
- [x] and docs. verified(test): README.md and setup-other-repos.md updated; 4/4 invariants pass
- [x] AC2: .github/workflows/plan-check.yml runs ci-check on all PRs and runs ticket.test.mjs only when scripts/ticket.mjs or scripts/ticket.test.mjs changes. verified(test): .github/workflows/plan-check.yml gates ticket.test.mjs behind git diff check on ticket.mjs/ticket.test.mjs
- [x] AC3: node --test scripts/ticket.test.mjs and node scripts/ticket.mjs check pass with 4/4 invariants. verified(test): node --test scripts/ticket.test.mjs passes 87/87 and ticket.mjs check passes

## Steps

- [x] Remove workflow-sync.yml and references in manifest
- [x] ticket.mjs
- [x] adw-hook.mjs
- [x] README.md
- [x] and setup-other-repos.md (AC1)
- [x] Update .github/workflows/plan-check.yml to conditionally run ticket.test.mjs only on ticket CLI/test changes (AC2)
- [x] Run node --test scripts/ticket.test.mjs and node scripts/ticket.mjs check (AC3)

## Risks

CI change could skip ticket.test.mjs on unrelated edits; ci.yml still runs full tests on every AI-Dev-Workflow PR and plan-check.yml still runs them whenever ticket.mjs or ticket.test.mjs changes.

## Out of scope

ci.yml in AI-Dev-Workflow and ticket-done.yml merge closure.

## Notes

- Approved by Aaron (2026-11-16): "Yes please streamline all of these workflows."

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
- 2026-11-16 11:36 UTC, Gemini (review: pass): Removed weekly workflow-sync.yml across bundle/docs and gated ticket.test.mjs in plan-check.yml to modified script changes; 87/87 tests pass. [self-review: Streamlined workflow changes verified with 87/87 tests and 4/4 invariants]
