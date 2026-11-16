---
title: Plan - Process: Streamline GitHub Actions Workflows
ticket: local://ADW:ADW-Plan-Streamline-GitHub-Actions-Workflows-2026-11
status: planned
priority: 
state: 
due: 
appetite: S
version: none
impact: none
devTicketKey: ADW:ADW-Plan-Streamline-GitHub-Actions-Workflows-2026-11
agent: Gemini
---
# Streamline GitHub Actions Workflows

## Summary

Remove the weekly workflow-sync.yml cron across managed repos and gate ticket.test.mjs in plan-check.yml to run only when ticket.mjs or ticket.test.mjs changes.

## Context

.github/workflows/workflow-sync.yml, .github/workflows/plan-check.yml, scripts/workflow-manifest.json, scripts/ticket.mjs, and scripts/hooks/adw-hook.mjs manage downstream CI workflows.

## Open questions

None

## Acceptance criteria

- [ ] AC1: .github/workflows/workflow-sync.yml is removed from the repository
- [ ] manifest
- [ ] WORKFLOW_FILES
- [ ] and docs.
- [ ] AC2: .github/workflows/plan-check.yml runs ci-check on all PRs and runs ticket.test.mjs only when scripts/ticket.mjs or scripts/ticket.test.mjs changes.
- [ ] AC3: node --test scripts/ticket.test.mjs and node scripts/ticket.mjs check pass with 4/4 invariants.

## Steps

- [ ] Remove workflow-sync.yml and references in manifest
- [ ] ticket.mjs
- [ ] adw-hook.mjs
- [ ] README.md
- [ ] and setup-other-repos.md (AC1)
- [ ] Update .github/workflows/plan-check.yml to conditionally run ticket.test.mjs only on ticket CLI/test changes (AC2)
- [ ] Run node --test scripts/ticket.test.mjs and node scripts/ticket.mjs check (AC3)

## Risks

CI change could skip ticket.test.mjs on unrelated edits; ci.yml still runs full tests on every AI-Dev-Workflow PR and plan-check.yml still runs them whenever ticket.mjs or ticket.test.mjs changes.

## Out of scope

ci.yml in AI-Dev-Workflow and ticket-done.yml merge closure.

## Notes

- Approved by Aaron (2026-11-16): "Yes please streamline all of these workflows."

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
