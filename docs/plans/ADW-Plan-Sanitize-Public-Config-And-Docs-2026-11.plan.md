---
title: Plan - Feature: Sanitize-Public-Config-And-Docs
ticket: local://ADW:ADW-Plan-Sanitize-Public-Config-And-Docs-2026-11
status: in-progress
priority: high
state: 
due: 
appetite: M
version: 
impact: 
dependsOn: 
devTicketKey: ADW:ADW-Plan-Sanitize-Public-Config-And-Docs-2026-11
agent: Gemini
branch: chore/sanitize-public-config-and-docs
worktree: AI-Dev-Workflow
startedAt: 2026-11-26
reviewedBy: Gemini
reviewVerdict: pass
reviewSession: bdc97add-ee38-421f-a90c-94842e161cd7
baseBranch: main
reviewFingerprint: 4f590bff8e536644df403af667720133782d6cfea740efa4fc1b63a543d53974
---
# Sanitize-Public-Config-And-Docs

## Summary

Move private `knownRepos` out of the public `scripts/ticket.config.json` and hardcoded fallbacks in `scripts/sync.mjs` and `scripts/ticket.mjs` into a gitignored `scripts/ticket.config.local.json`, and scrub private repository names, personal Notion URLs, and personal workspace references from code, tests, ADRs, lessons, and archived plans.

## Context

- `scripts/ticket.config.json` currently commits `knownRepos` containing private repository names.
- `scripts/sync.mjs` (lines 20-33) and `scripts/ticket.mjs` (`getKnownRepoDirs`, lines 1639-1665) also hardcode private repository names as fallbacks.
- `scripts/ticket.test.mjs`, `docs/decisions/ADR-001/002/004`, `docs/lessons.md`, and `docs/plans/archive/2026-11/*.plan.md` reference private repository names, personal workspace terms, and private Notion URLs.
- Local workflows still need `knownRepos` to work via a gitignored `scripts/ticket.config.local.json`.

## Open questions

None

## Acceptance criteria

- [x] AC1: `scripts/ticket.config.local.json` is listed in `.gitignore`, and `scripts/sync.mjs` + `scripts/ticket.mjs` read `knownRepos` from `scripts/ticket.config.local.json` before `scripts/ticket.config.json` with an empty `[]` fallback. verified: scripts/ticket.config.local.json is in .gitignore; sync.mjs and ticket.mjs read local override before ticket.config.json
- [x] AC2: `scripts/ticket.config.json` has `knownRepos: []` and `README.md` documents `scripts/ticket.config.local.json`. verified: scripts/ticket.config.json has knownRepos: [] and README.md documents ticket.config.local.json
- [x] AC3: Tracked files in `AI-Dev-Workflow` contain zero references to private repositories, personal workspace names, or private Notion URLs. verified: git grep for private repo names and personal workspace terms returned 0 matches
- [x] AC4: `node --test scripts/ticket.test.mjs` passes including a test for `scripts/ticket.config.local.json` `knownRepos` loading. verified: node --test scripts/ticket.test.mjs passed 104/104 tests

## Steps

- [x] Add `scripts/ticket.config.local.json` to `.gitignore` and create local untracked override with existing `knownRepos` (AC1)
- [x] Update `scripts/ticket.config.json`, `scripts/sync.mjs`, `scripts/ticket.mjs`, and `README.md` to support `ticket.config.local.json` and remove hardcoded private repo lists (AC1, AC2)
- [x] Scrub private repo names, personal workspace terms, and private Notion URLs from `scripts/ticket.test.mjs`, `docs/decisions/`, `docs/lessons.md`, and `docs/plans/archive/2026-11/` (AC3)
- [x] Add unit test for `ticket.config.local.json` `knownRepos` loading and run `node --test scripts/ticket.test.mjs` (AC4)

## Risks

- Downstream repos without `ticket.config.local.json` will see `knownRepos: []` for fleet commands unless configured locally; this is intentional and safe.
- `readmeCliSync` or `mirrorDirs` invariants in `ticket.test.mjs` could fail if `README.md` or `.agents/skills` / `.claude/skills` drift; verified by running the full test suite and `ticket.mjs check`.

## Out of scope

- Removing `FluentTimer` or `TokenHUD` (which are public repos) from unrelated examples if not needed, though `knownRepos` in `ticket.config.json` is emptied to `[]`.

## Notes

Approved by Aaron as part of the full GitHub OPSEC & security cleanup.

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
- 2026-11-27 00:18 UTC, Gemini (review: pass): Verified gitignored ticket.config.local.json loading, knownRepos: [] in public config, and 0 private repo / workspace leaks via git grep. [reviewer: bdc97add-ee38-421f-a90c-94842e161cd7]
