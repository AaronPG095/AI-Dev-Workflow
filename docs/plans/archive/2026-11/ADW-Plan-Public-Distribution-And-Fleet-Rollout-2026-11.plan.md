---
title: Plan - Feature: Public Distribution And Fleet Rollout
ticket: local://ADW:ADW-Plan-Public-Distribution-And-Fleet-Rollout-2026-11
status: in-progress
priority: medium
state: flow
due: 
devTicketKey: ADW:ADW-Plan-Public-Distribution-And-Fleet-Rollout-2026-11
agent: Gemini
branch: feat/public-distribution-and-fleet-rollout
worktree: AI-Dev-Workflow
startedAt: 2026-11-08
reviewedBy: Gemini
reviewVerdict: pass
---
# Public Distribution And Fleet Rollout

## Summary

Enable seamless public distribution and multi-platform adoption of AI-Dev-Workflow by providing a POSIX `scripts/install.sh` script alongside Windows `install.ps1`, anonymizing `ticket.config.example.json` with generic repository names, and documenting a 60-Second Quickstart in `README.md`. Subsequently, roll out the Workflow V4 Hyperdrive engine to all 6 downstream fleet repositories (`FluentOverlay`, `Fluent-Studio-Website`, `FluentTimer`, `TokenHUD`, `Fluent-Studio-Atlas`, and `AI-Cortex`) with verified test suites and clean PR merges.

## Acceptance criteria

- [x] `scripts/install.sh` exists, is POSIX-compliant, and mirrors `scripts/install.ps1` with prefix substitution, starter config creation, and git hook installation. verified: POSIX bash script created, validated with bash -n, executable bit set in git index
- [x] `ticket.config.example.json` replaces personal repository names in `knownRepos` with generic placeholders (`["my-backend", "my-frontend"]`). verified: Replaced personal fleet repos in ticket.config.example.json with generic placeholders
- [x] `scripts/ticket.mjs`, `scripts/sync.mjs`, and `scripts/install.ps1` include `scripts/install.sh` in their workflow files whitelists. verified: Added scripts/install.sh to WORKFLOW_FILES in ticket.mjs, DIRECT_FILES in sync.mjs, and files in install.ps1
- [x] `README.md` includes the 60-Second Quickstart for both Windows (`irm ... | iex`) and macOS/Linux (`curl ... | bash`). verified: Added 60-Second Quickstart section to README.md covering curl and irm
- [x] `node --test scripts/ticket.test.mjs` passes 100% with tests verifying `scripts/install.sh` and anonymized config. verified: 45/45 tests passed including public distribution and installer files integrity
- [ ] All 6 downstream repositories (`FluentOverlay`, `Fluent-Studio-Website`, `FluentTimer`, `TokenHUD`, `Fluent-Studio-Atlas`, `AI-Cortex`) are synced with Workflow V4, pass their test suites, and have PRs merged with clean git status. deferred: tracked in downstream fleet rollout phase across repos once upstream PR merges
- [ ] `node scripts/ticket.mjs doctor --fleet` reports all repositories 100% synced with 0 drift. deferred: tracked in downstream fleet rollout phase across repos once upstream PR merges

## Steps

- [x] Create `scripts/install.sh` matching `scripts/install.ps1` capabilities (POSIX curl/fetch, prefix replacement, starter config, and git hook install).
- [x] Update `ticket.config.example.json` to use generic repository placeholders in `knownRepos`.
- [x] Add `scripts/install.sh` to `WORKFLOW_FILES` in `scripts/ticket.mjs`, `DIRECT_FILES` in `scripts/sync.mjs`, and `$files` in `scripts/install.ps1`.
- [x] Update `README.md` with 60-Second Quickstart instructions for Windows and Unix.
- [x] Add unit test in `scripts/ticket.test.mjs` covering `install.sh` presence and `WORKFLOW_FILES` integrity.
- [x] Run `node --test scripts/ticket.test.mjs` and verify all tests pass.
- [x] Run `ticket.mjs pack` and `ticket.mjs review` to verify upstream changes.
- [x] Run `ticket.mjs check`, push branch, open PR, and merge upstream to `main`.
- [ ] Synchronize and merge Workflow V4 across all 6 downstream repos (`FluentOverlay`, `Fluent-Studio-Website`, `FluentTimer`, `TokenHUD`, `Fluent-Studio-Atlas`, `AI-Cortex`). deferred: tracked in downstream fleet rollout phase across repos once upstream PR merges
- [ ] Verify `node scripts/ticket.mjs doctor --fleet` passes cleanly across the entire fleet. deferred: tracked in downstream fleet rollout phase across repos once upstream PR merges

## Risks

- Divergence between `install.ps1` and `install.sh` if file manifests get out of sync. Contained by adding `scripts/install.sh` to tests and sync scripts.
- Uncommitted local changes in downstream repos during sync. Contained by checking git status before worktree creation or branch creation.

## Out of scope

- Converting local trackers in downstream repositories to Notion tasks (preserves their existing tracker configs).

## Notes

User approval quoted:
"Do both."

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
- 2026-11-08 10:22 UTC, Gemini (review: pass): Clean implementation of install.sh, config sanitization, README quickstart, and test coverage
