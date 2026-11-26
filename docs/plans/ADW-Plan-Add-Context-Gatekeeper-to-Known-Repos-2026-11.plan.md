---
title: Plan - Feature: Add Context Gatekeeper to Known Repos
ticket: local://ADW:ADW-Plan-Add-Context-Gatekeeper-to-Known-Repos-2026-11
status: in-progress
priority: 
state: 
due: 
appetite: S
version: 
impact: 
dependsOn: 
devTicketKey: ADW:ADW-Plan-Add-Context-Gatekeeper-to-Known-Repos-2026-11
agent: Gemini
branch: gemini/add-cgk-known-repo
worktree: AI-Dev-Workflow
startedAt: 2026-11-26
---
# Add Context Gatekeeper to Known Repos

## Summary

Register `Context-Gatekeeper-MCP` in `knownRepos` in `scripts/ticket.config.json` so fleet commands (`overview`, `doctor --fleet`, `sync-repos.ps1 -AllKnown`) include it automatically.

## Context

`scripts/ticket.config.json` lists active repositories under `knownRepos`. Adding `"Context-Gatekeeper-MCP"` alongside the existing repos keeps fleet sync and overview commands up to date.

## Open questions

None

## Acceptance criteria

- [ ] AC1: `Context-Gatekeeper-MCP` is listed in `knownRepos` in `scripts/ticket.config.json`.
- [ ] AC2: `node --check scripts/ticket.mjs` and `node --test scripts/ticket.test.mjs` pass cleanly, and `node scripts/ticket.mjs overview` includes `Context-Gatekeeper-MCP`.

## Steps

- [ ] Add `"Context-Gatekeeper-MCP"` to `knownRepos` in `scripts/ticket.config.json`. (AC1)
- [ ] Verify `ticket.mjs` tests and fleet `overview` output. (AC2)
- [ ] Run `pack`, complete independent sub-agent review, and ship PR #55. (AC2)

## Risks

If `Context-Gatekeeper-MCP` is absent from the local filesystem on a machine running fleet commands, `overview` or `sync-repos.ps1` could fail or warn; mitigated by verifying `node scripts/ticket.mjs overview` and `node --test scripts/ticket.test.mjs`.

## Out of scope

Modifying `scripts/ticket.mjs` logic or syncing unrelated repositories.

## Notes

User approved ("Do all." / "Continue.").

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
