---
title: Plan - Process: Initial token-lean AI development workflow engine and public repository
ticket: local://ADW:ADW-Plan-Initial-Workflow-Engine-2026-11
status: done
priority: high
state: flow
due: 
devTicketKey: ADW:ADW-Plan-Initial-Workflow-Engine-2026-11
agent: Gemini
branch: feat/initial-workflow
worktree: AI-Dev-Workflow
startedAt: 2026-11-07
reviewedBy: Gemini
reviewVerdict: pass
completedAt: 2026-11-07
---
# Initial token-lean AI development workflow engine and public repository

## Summary

Extract and upgrade the shared AI development workflow into a standalone, public-ready repository (`AI-Dev-Workflow`) with zero external npm dependencies, pluggable local/Notion ticket tracking, a 0-token review packet generator (`pack`), single-pass review stamping (`review`), and multi-repo drift checking (`sync-repos.ps1`).

## Acceptance criteria

- [x] `AGENTS.md` and `CLAUDE.md` define the 6-step process (plan, plan doc, ticket, implement, single-pass review via `pack`, finish) verified: read back `AGENTS.md` and `CLAUDE.md` (`@AGENTS.md`)
- [x] `scripts/ticket.mjs` supports both Notion Life OS mode and zero-dependency `local` tracker mode verified: `node --test scripts/ticket.test.mjs` passed all 26 unit and integration tests
- [x] `scripts/ticket.mjs pack` generates a compact, lockfile-filtered, size-capped review digest in one command (0 LLM tokens) verified: tested via `ticket.test.mjs` and live `node scripts/ticket.mjs pack` execution
- [x] `scripts/ticket.mjs review` records `reviewedBy` and `reviewVerdict` (`pass|warn|block`) and blocks `check`/`ship`/`ci-check` on `block` verified: tested via `ticket.test.mjs` and live review stamp
- [x] `scripts/ticket.mjs` auto-resolves the active plan when `<plan>` is omitted and falls back to the main checkout `.env` inside git worktrees verified: tested via `ticket.test.mjs` subtests 23 and 26
- [x] Identical `dev-workflow` and `quick-review` skills exist in `.agents/skills/` and `.claude/skills/` verified: `Get-FileHash` confirmed matching SHA-256 hashes across both directories
- [x] `scripts/sync-repos.ps1` detects drift (`-Check`) and syncs workflow files without overwriting per-repo `ticket.config.json` verified: ran `.\scripts\sync-repos.ps1 -AllKnown -Check` across sibling repos
- [x] Repository contains zero private Notion UUIDs or secrets and is published to a public GitHub remote verified: regex secret scan returned 0 matches; published via `gh repo create`

## Steps

- [x] Implement upgraded `scripts/ticket.mjs` with `pack`, `review`, `local` mode, auto-plan resolution, and worktree `.env` fallback
- [x] Add comprehensive test suite in `scripts/ticket.test.mjs` and verify all 26 tests pass
- [x] Create `dev-workflow` and `quick-review` skills in `.agents/skills/` and `.claude/skills/`
- [x] Add GitHub Actions workflows (`ci.yml`, `plan-check.yml`, `ticket-done.yml`) and PR template
- [x] Add `scripts/sync-repos.ps1`, `docs/dev-workflow/setup-other-repos.md`, `ticket.config.example.json`, `README.md`, and `LICENSE`
- [x] Dogfood `ticket.mjs` (`create`, `start`, `pack`, `review`, `check`, `done`) on this bootstrap plan
- [x] Commit and publish the public GitHub repository `AaronPG095/AI-Dev-Workflow` with the `no-plan` label

## Risks

Downstream repositories have varying branch configurations (`main` vs `main, develop`) and Notion project IDs. Contained by keeping `scripts/ticket.config.json` repo-local and preserving `protectedBranches` during `sync-repos.ps1`.

## Out of scope

Modifying active branches in sibling repositories without their own PRs; managing global user home dotfiles already owned by `codex-setup`.

## Notes

- Aaron approved the refined plan and implementation ("yes lets go", "implement it", 2026-11-07).
- `AI-Dev-Workflow` uses `"tracker": "local"` in its own `scripts/ticket.config.json` so public clones and GitHub Actions CI work with zero secrets.

## Progress log
- 2026-11-07 12:25 UTC, Gemini (review: pass): All 26 tests pass, zero secrets, skills mirrored, pack and review verified
