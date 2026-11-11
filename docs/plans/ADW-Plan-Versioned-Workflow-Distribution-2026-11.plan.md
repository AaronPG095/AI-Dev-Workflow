---
title: Plan - Bug: Versioned Workflow Distribution
ticket: local://ADW:ADW-Plan-Versioned-Workflow-Distribution-2026-11
status: shipped
priority: high
devTicketKey: ADW:ADW-Plan-Versioned-Workflow-Distribution-2026-11
agent: Codex
branch: codex/versioned-workflow-distribution
worktree: AI-Dev-Workflow
startedAt: 2026-11-11
reviewedBy: Codex
reviewVerdict: pass
reviewFingerprint: ace7715f3951f43672fb567805d39a0de1330b5037f4cc96443533af6b5bcb2f
pr: https://github.com/AaronPG095/AI-Dev-Workflow/pull/22
---

# Versioned Workflow Distribution

## Summary

Distribute one pinned workflow version and make incomplete or uncommitted installs visible.

## Acceptance criteria

- [x] Both installers, sync, and doctor use one versioned manifest, including the updater. Download failures leave the destination unchanged. verified: manifest fixture and both pinned installer bootstraps pass; simulated missing required file makes zero writes
- [x] Install and upgrade preserve repository config and report missing or drifted files accurately. Tests cover clean install and upgrade. verified: upgrade fixture preserves config bytes, restores the updater, and distinguishes missing config from drift
- [x] A disposable pilot upgrade from the previous release passes. Downstream rollout prerequisites are documented. verified: previous-release upgrade fixture, root bundle check, and full Node suite pass; downstream setup documents the rollout

## Steps

- [x] Centralize distribution and pin a single upstream revision.
- [x] Make installer, sync, and doctor share the release inventory and report failures.
- [x] Verify fresh install and previous-release upgrade, then document the rollout.

## Notes

Aaron approved the repair sequence: “Plan approved.” Aaron directed execution of the entire sequence.

## Progress log
- 2026-11-11 11:16 UTC, Codex (review: pass): Verified one pinned manifest across installers, sync and doctor. Upgrade, missing-download, config preservation and the full suite pass.
- 2026-11-11 11:16 UTC, Codex (handoff): Done: Use one versioned manifest for installers, sync, and doctor. Pin downloads to one release, preserve repo config, and make the scheduled job report drift for planned updates.; Next: Pilot the pinned release in TokenHUD, then roll it out to the remaining fleet.; Open: none; Tree: 1 dirty file(s)

