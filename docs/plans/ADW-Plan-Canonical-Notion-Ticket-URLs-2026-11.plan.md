---
title: Plan - Bug: Canonical Notion Ticket URLs
ticket: local://ADW:ADW-Plan-Canonical-Notion-Ticket-URLs-2026-11
status: in-progress
priority: high
devTicketKey: ADW:ADW-Plan-Canonical-Notion-Ticket-URLs-2026-11
agent: Codex
branch: codex/canonical-notion-ticket-urls
worktree: AI-Dev-Workflow
startedAt: 2026-11-11
reviewedBy: Codex
reviewVerdict: pass
reviewFingerprint: 9a15d23d39ed999ed45ca2fd725ff3df1f41dab3ae03567730afa11d3f1b4cc6
---

# Canonical Notion Ticket URLs

## Summary

Accept the canonical Notion URL returned by the live integration in the committed plan gate.

## Acceptance criteria

- [x] The committed plan gate accepts a valid app.notion.com/p/ ticket and rejects unrelated hosts. verified: committed Git fixture accepts canonical app.notion.com and rejects a lookalike hostname

## Steps

- [x] Update and verify the Notion ticket URL validator.

## Notes

Aaron approved the repair sequence: “Plan approved.” Aaron directed execution of the entire sequence.

## Progress log
- 2026-11-11 13:47 UTC, Codex (review: pass): Canonical app URL and lookalike host regression passed.

