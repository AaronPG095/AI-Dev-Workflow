---
title: Plan - Bug: Versioned Workflow Distribution
ticket: local://ADW:ADW-Plan-Versioned-Workflow-Distribution-2026-11
status: planned
priority: high
devTicketKey: ADW:ADW-Plan-Versioned-Workflow-Distribution-2026-11
agent: Codex
---

# Versioned Workflow Distribution

## Summary

Distribute one pinned workflow version and make incomplete or uncommitted installs visible.

## Acceptance criteria

- [ ] Both installers, sync, and doctor use one versioned manifest, including the updater. Download failures leave the destination unchanged.
- [ ] Install and upgrade preserve repository config and report missing or drifted files accurately. Tests cover clean install and upgrade.
- [ ] A disposable pilot upgrade from the previous release passes. Downstream rollout prerequisites are documented.

## Steps

- [ ] Centralize distribution and pin a single upstream revision.
- [ ] Make installer, sync, and doctor share the release inventory and report failures.
- [ ] Verify fresh install and previous-release upgrade, then document the rollout.

## Notes

Aaron approved the repair sequence: “Plan approved.” Aaron directed execution of the entire sequence.

## Progress log

