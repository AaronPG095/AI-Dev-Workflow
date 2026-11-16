---
title: Plan - Feature: Enforce Independent Subagent Reviews
ticket: local://ADW:ADW-Plan-Enforce-Independent-Subagent-Reviews-2026-11
status: planned
priority: 
state: 
due: 
appetite: M
version: none
impact: none
devTicketKey: ADW:ADW-Plan-Enforce-Independent-Subagent-Reviews-2026-11
agent: Gemini
---
# Enforce Independent Subagent Reviews

## Summary

Make requireReview default to true with allowSelfReview false across ticket.mjs, starter configs, AGENTS.md, sync.mjs, skills, and all downstream repositories, while supporting --reviewer-id for same-provider independent subagents.

## Context

scripts/ticket.mjs:416,3876 only checked config.requireReview when truthy and allowed --self-review by default; workflow-manifest.json starterConfig and 6 downstream repos had requireReview false or omitted.

## Open questions

None

## Acceptance criteria

- [ ] AC1: scripts/ticket.mjs treats omitted requireReview as true, disables --self-review unless allowSelfReview is true, and supports --reviewer-id <id> (persisting reviewSession and catching tampering).
- [ ] AC2: workflow-manifest.json, ticket.config.example.json, scripts/ticket.config.json, docs/dev-workflow/setup-other-repos.md, AGENTS.md, scripts/sync.mjs, README.md, and both skill mirrors enforce and document mandatory independent subagent reviews.
- [ ] AC3: doctor prints review enforcement status and node --test scripts/ticket.test.mjs (including updated T1.1 and new T3.4) plus ticket.mjs check pass via an independent subagent review.

## Steps

- [ ] Update scripts/ticket.mjs with default-on requireReview, allowSelfReview guard, --reviewer-id / reviewSession tracking, and doctor output (AC1, AC3)
- [ ] Update configs, AGENTS.md, scripts/sync.mjs, README.md, setup-other-repos.md, and byte-identical .agents/.claude skills (AC2)
- [ ] Update T1.1 and add T3.4 in scripts/ticket.test.mjs, run full test suite, obtain independent subagent review, check, and ship (AC1, AC3)

## Risks

Existing downstream repos or unit tests omitting requireReview could fail unexpectedly if not migrated; mitigated by rolling out requireReview: true across all 6 sibling repos and setting defaultNotionConfig requireReview: false while testing default-on explicitly in T3.4.

## Out of scope

Changing Notion ticket creation or blocking emergency allowSelfReview opt-in for explicit offline overrides.

## Notes

- Approved by Aaron (2026-11-16): "It is essential that independent sub-agent reviews take place for every pull request-sized chunk."

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
