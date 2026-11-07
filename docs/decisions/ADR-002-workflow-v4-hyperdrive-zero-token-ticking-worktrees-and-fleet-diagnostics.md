# ADR 002: Workflow V4 Hyperdrive - Zero-Token Ticking, Worktrees, and Fleet Diagnostics

- **Status:** Accepted
- **Date:** 2026-11-07
- **Author:** Gemini
- **Deciders:** Aaron, Gemini

## Context

Following the multi-repo rollout of Workflow V3, several friction points emerged during real-world AI pair programming:
1. **Token bloat from manual plan edits:** AI agents burned repeated turns reading `.plan.md` into context and using `edit_file` to update checkboxes and verified evidence.
2. **Worktree accumulation and path limits:** Multiple abandoned worktrees accumulated across the fleet from past sessions, while Windows 260-character path limits caused `Filename too long` failures when removing worktrees containing deeply nested build or package directories.
3. **Multi-step task ignition:** Scaffolding a feature, writing criteria, creating a ticket, creating a branch, and starting work required 4-5 sequential commands.
4. **Scattered repo configurations:** Known repository lists were hardcoded separately in `sync.mjs`, `ticket.mjs`, and scripts, causing drift when new repositories (like `AI-Cortex`) were added.
5. **No unified diagnostic surface:** Checking pre-push hooks, git status, workflow drift, and tracker tokens across repositories required multiple ad-hoc commands.

## Decision

We introduce **Workflow V4 Hyperdrive** with six core enhancements:
1. **Zero-Token Plan Mutation (`tick` and `defer`):** Checkboxes are numbered in `prime` (`[1]`, `[2]`), allowing agents to tick items by number or search string via `ticket.mjs tick <#> [--verified <evidence>]` and defer with `ticket.mjs defer <#> --reason <why>`. Acceptance criteria strictly enforce verified evidence at the CLI level before ticking.
2. **Isolated Worktree Lifecycle (`wt`):** `ticket.mjs wt [list|new|prune] [--fleet] [--all]` manages worktrees cleanly, automatically copying `.env` credentials to new worktrees, and using Windows extended-length paths (`\\?\`) during directory removal to eliminate `Filename too long` errors.
3. **Single-Command Task Ignition:** `ticket.mjs new` supports `--summary`, `--criteria`, `--steps`, `--branch`, `--create`, and `--start` flags to scaffold and activate tasks in a single command. `ticket.mjs start` supports `--create` to automatically recover unticketed draft plans.
4. **Bulletproof PR Shipping:** `ticket.mjs pr` pushes branches to origin before creating PRs, passes `--head` explicitly, supports `--verify` pre-flight testing, and supports `--auto` auto-merging.
5. **Institutional Memory Search & Archival:** `ticket.mjs recall "<query>" [--fleet]` provides instant keyword search across ADRs and plan notes. `ticket.mjs archive` organizes completed plans into `docs/plans/archive/<YYYY-MM>/`.
6. **Centralized Repository Config & Diagnostic Auditing:** `knownRepos` is centralized in `ticket.config.json` (including `AI-Cortex`), and `ticket.mjs doctor [--fleet]` provides an instant multi-repo health matrix.

## Consequences

### Positive
- Zero LLM tokens wasted on reading or editing markdown files to update checkboxes.
- Worktree creation and cleanup is completely safe on Windows without path length failures.
- Instant workspace health visibility across all 7 repositories with `doctor --fleet`.
- Centralized repo configuration prevents drift.
- 100% test coverage with 44 native node:test suites and zero external npm dependencies.

### Negative / Trade-offs
- Downstream repositories will need to be synced to V4 via automated drift sync (`workflow-sync.yml` / `sync.mjs --remote`) to gain access to the new CLI commands.
