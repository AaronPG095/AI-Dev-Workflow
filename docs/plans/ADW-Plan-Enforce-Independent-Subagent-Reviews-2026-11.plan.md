---
title: Plan - Feature: Enforce Independent Subagent Reviews
ticket: local://ADW:ADW-Plan-Enforce-Independent-Subagent-Reviews-2026-11
status: shipped
priority: 
state: 
due: 
appetite: L
version: none
impact: none
devTicketKey: ADW:ADW-Plan-Enforce-Independent-Subagent-Reviews-2026-11
agent: Gemini
branch: gemini/enforce-independent-subagent-reviews
worktree: AI-Dev-Workflow
startedAt: 2026-11-16
reviewedBy: Gemini
reviewVerdict: pass
reviewSession: faf669ac-52b3-4777-9fe0-c3ec42ccc138
reviewFingerprint: 5d41cdc40025fd159c1889d60e80d6a15862a0b932ad12e6a81cd411a0c21d7d
pr: https://github.com/AaronPG095/AI-Dev-Workflow/pull/36
---
# Enforce Independent Subagent Reviews

## Summary

Make requireReview default to true with allowSelfReview false across ticket.mjs, starter configs, AGENTS.md, sync.mjs, skills, and all downstream repositories, while supporting --reviewer-id for same-provider independent subagents.

## Context

scripts/ticket.mjs:416,3876 only checked config.requireReview when truthy and allowed --self-review by default; workflow-manifest.json starterConfig and 6 downstream repos had requireReview false or omitted.

## Open questions

None

## Acceptance criteria

- [x] AC1: scripts/ticket.mjs treats omitted requireReview as true, disables --self-review unless allowSelfReview is true, and supports --reviewer-id <id> (persisting reviewSession and catching tampering). verified(test): T1.1 and T3.4 verify omitted requireReview defaults to true, allowSelfReview guard blocks --self-review, and --reviewer-id persists reviewSession
- [x] AC2: workflow-manifest.json, ticket.config.example.json, scripts/ticket.config.json, docs/dev-workflow/setup-other-repos.md, AGENTS.md, scripts/sync.mjs, README.md, and both skill mirrors enforce and document mandatory independent subagent reviews. verified(test): manifest, example/local configs, AGENTS.md, sync.mjs, README.md, setup-other-repos.md, and identical .agents/.claude skills updated; doctor 4/4 invariants pass
- [x] AC3: doctor prints review enforcement status and node --test scripts/ticket.test.mjs (including updated T1.1 and new T3.4) plus ticket.mjs check pass via an independent subagent review. verified(test): doctor prints review enforcement and node --test scripts/ticket.test.mjs passed 88/88 tests before independent subagent review

## Steps

- [x] Update scripts/ticket.mjs with default-on requireReview, allowSelfReview guard, --reviewer-id / reviewSession tracking, and doctor output (AC1, AC3)
- [x] Update configs, AGENTS.md, scripts/sync.mjs, README.md, setup-other-repos.md, and byte-identical .agents/.claude skills (AC2)
- [x] Update T1.1 and add T3.4 in scripts/ticket.test.mjs, run full test suite, obtain independent subagent review, check, and ship (AC1, AC3)

## Risks

Existing downstream repos or unit tests omitting requireReview could fail unexpectedly if not migrated; mitigated by rolling out requireReview: true across all 6 sibling repos and setting defaultNotionConfig requireReview: false while testing default-on explicitly in T3.4.

## Out of scope

Changing Notion ticket creation or blocking emergency allowSelfReview opt-in for explicit offline overrides.

## Notes

- Approved by Aaron (2026-11-16): "It is essential that independent sub-agent reviews take place for every pull request-sized chunk."

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
- 2026-11-16 14:48 UTC, Gemini (review: pass): PASS: default-on requireReview, allowSelfReview guard, --reviewer-id/--subagent 4-char validation, review --prompt, doctor output, appetite L, identical skill mirrors, check readiness, and 88/88 tests verified. [reviewer: faf669ac-52b3-4777-9fe0-c3ec42ccc138]
