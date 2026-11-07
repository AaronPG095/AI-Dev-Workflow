---
title: Plan - Feature: Workflow V4 Hyperdrive
ticket: local://ADW:ADW-Plan-Workflow-V4-Hyperdrive-2026-11
status: in-progress
priority: high
state: flow
due: 
devTicketKey: ADW:ADW-Plan-Workflow-V4-Hyperdrive-2026-11
agent: Gemini
branch: feat/workflow-v4
worktree: AI-Dev-Workflow
startedAt: 2026-11-07
---
# Workflow V4 Hyperdrive

## Summary

Expand the token-lean AI-Dev-Workflow suite to Version 4 with zero-token plan mutation (`tick`, `defer`), worktree lifecycle and extended-path cleanup (`wt`), bulletproof automated PR shipping (`pr` with pre-flight push and `--auto`), single-command task ignition (`new --create --start`), cross-repo institutional memory search & plan archival (`recall`, `archive`), and fleet-wide diagnostic auditing (`doctor`) with centralized repository configuration.

## Acceptance criteria

- [ ] Implement `tick` and `defer` in `scripts/ticket.mjs` allowing AI models to update plan checkboxes by index or substring without editing markdown files.
- [ ] Update `prime` output in `scripts/ticket.mjs` to display numbered checkboxes for 0-token reference.
- [ ] Implement `wt` command in `scripts/ticket.mjs` (`list`, `new`, `prune`) with Windows extended-length path (`\\?\`) support for robust cleanup.
- [ ] Enhance `pr` command in `scripts/ticket.mjs` with automatic branch pushing (`git push -u origin <branch>`), explicit `--head`, optional `--verify` pre-flight, and `--auto` auto-merge.
- [ ] Enhance `new` and `start` commands in `scripts/ticket.mjs` with `--create` and `--start` flags for single-command task ignition.
- [ ] Implement `recall` command in `scripts/ticket.mjs` for keyword search across in-repo ADRs and plan notes, with optional `--fleet` flag.
- [ ] Implement `archive` command in `scripts/ticket.mjs` to move completed/shipped plans into `docs/plans/archive/<YYYY-MM>/`.
- [ ] Centralize `knownRepos` (including `AI-Cortex`) in `scripts/ticket.config.json` and implement `doctor` command for fleet-wide health diagnostics.
- [ ] Add unit tests in `scripts/ticket.test.mjs` covering all new commands and capabilities.
- [ ] Update documentation (`README.md`, `AGENTS.md`, `.agents/skills/`, `.claude/skills/`).
- [ ] All unit and integration tests pass hermetically (`node --test scripts/ticket.test.mjs`).

## Steps

- [ ] Centralize repository list in `scripts/ticket.config.json` and `ticket.config.example.json` and sync with `sync.mjs`.
- [ ] Implement `tick` and `defer` commands in `scripts/ticket.mjs`.
- [ ] Enhance `prime` in `scripts/ticket.mjs` to show numbered indices `[1]`, `[2]`, ...
- [ ] Implement `wt` command (`list`, `new`, `prune`) in `scripts/ticket.mjs` with extended path handling.
- [ ] Upgrade `pr` command in `scripts/ticket.mjs` for automatic push, explicit `--head`, and `--auto` flag.
- [ ] Enhance `new` and `start` commands in `scripts/ticket.mjs` for streamlined task ignition.
- [ ] Implement `recall` command in `scripts/ticket.mjs`.
- [ ] Implement `archive` command in `scripts/ticket.mjs`.
- [ ] Implement `doctor` command in `scripts/ticket.mjs`.
- [ ] Write tests in `scripts/ticket.test.mjs` for all new functionality.
- [ ] Run test suite and fix any edge cases.
- [ ] Update docs, `AGENTS.md`, and skills.
- [ ] Pack, review, and ship V4.

## Risks

- **Windows Path Limits in Worktrees**: Worktrees with nested node_modules or build artifacts fail normal deletion on Windows; solved using `\\?\` prefix and native directory removal.
- **Git Push Hooks on PR**: Auto-pushing in `pr` command must handle pre-push hooks cleanly or report failures clearly without getting trapped.
- **Plan Checkbox Numbering Drift**: When items are ticked or deferred, subsequent numbered indices change; commands should accept either 1-based index or search substring.

## Out of scope

- Storing engineering decisions or notes in personal Notion Life OS notes (ADRs and Git remain authoritative).
- External npm dependencies (must remain 0 external dependencies on Node.js 22+).

## Notes

- Aaron explicitly approved all 6 improvements: "Let's implement all of them."

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
