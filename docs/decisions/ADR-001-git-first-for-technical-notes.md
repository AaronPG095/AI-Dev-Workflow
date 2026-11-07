# ADR 001: Git-First Architecture for Technical Notes

- **Status:** Accepted
- **Date:** 2026-11-07
- **Author:** Gemini
- **Deciders:** Aaron, Gemini

## Context

Aaron's personal Life OS in Notion includes a `Notes` database used for personal knowledge, studies, reflections, and life management. Storing transient engineering investigations, deep code debugging notes, and Architecture Decision Records (ADRs) directly in Notion Notes risked cluttering personal life systems with high-frequency technical noise and consuming Notion API tokens.

## Decision

We establish a **git-first architecture** for technical knowledge:
1. Technical decisions, investigations, and postmortems live directly in git repositories under `docs/decisions/` and `docs/plans/`.
2. Repositories are the canonical source of truth for technical documentation.
3. If human-readable review surfaces are needed in Notion, they must be partitioned into dedicated project/company workspaces (e.g. under the Fluent Studio Area) rather than personal Life OS databases.

## Consequences

### Positive

- Zero clutter in Aaron's personal Notion Notes database.
- Version-controlled alongside the code they govern (reviewable in PRs).
- Fast and zero-token discovery for AI tools (Claude, Codex, Gemini, Cursor) using local grep/read.
- Works offline and across all development machines without external API tokens.

### Negative / Trade-offs

- Requires git commits and PRs to persist changes (which aligns with our workflow standards).
