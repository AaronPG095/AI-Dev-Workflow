# ADR 004: Per-Plan Frontmatter Versioning and Canonical Roadmap

- **Status:** Accepted
- **Date:** 2026-11-14
- **Author:** Gemini
- **Deciders:** Aaron, Gemini

## Context

Larger products managed by `AI-Dev-Workflow` (such as `FluentOverlay`) need a first-class way to plan forward version trains, track which PR plans belong to which release (`Shipped` vs. `Ready/Unreleased` vs. `In-progress` vs. `Planned`), stamp a reference `Target Version` on Notion Tasks, and generate Keep-a-Changelog release notes without LLM token overhead.

Previously in v4 (`Fluent-Studio-Website` commit `b3154de65039`), release intent was tracked in a single shared `release/fluentoverlay-release-intent.json` file edited on every PR, while forward plans were split across multiple product documents (`FO-Plan.md`, `FO-PotentialFeatures.md`, `FO-CompleteFeatureSet.md`). Requiring every branch to mutate a shared JSON file caused merge conflicts across parallel worktrees.

## Decision

1. **Per-Plan Frontmatter (`version` and `impact`):** Store `version:` (e.g., `1.2.0` or `none`) and `impact:` (`none | patch | minor | major`) directly in each plan's own YAML frontmatter (`docs/plans/<PREFIX>-Plan-*.plan.md`). Because each branch/worktree owns its plan file, parallel agents never conflict on a shared release-intent file.
2. **Single Canonical Forward Roadmap (`docs/ROADMAP.md`):** Versioned repositories maintain one canonical `docs/ROADMAP.md` (scaffolded via `node scripts/ticket.mjs release init`) organizing **Current Shipped Release**, **Active Release Train**, **Upcoming Release Trains**, and **Candidate Backlog**.
3. **Opt-In `versioning` Config:** `scripts/ticket.config.json` includes an opt-in `versioning` block (`enabled`, `currentVersion`, `activeTrain`, `roadmapPath`, `changelogPath`, `tagPrefix`, `requireVersionOnPlans`). Unversioned repositories keep `enabled: false` with zero added ceremony.
4. **Notion `Target Version` Stamping:** When `plan.meta.version` is set (and not `none` or `internal`), `node scripts/ticket.mjs create` stamps `Target Version` (`rich_text`) on the Notion Task in `collection://1db0b9c6-786f-80b0-bb5c-000b965dee0a`, with a graceful fallback if a custom database lacks that property.
5. **Deterministic `ticket.mjs release` CLI:** `node scripts/ticket.mjs release [status|notes|closeout|init]` aggregates active and archived plans by `version`, cross-checks `docs/ROADMAP.md` and git tags, generates Keep-a-Changelog release notes (`--write`), and scaffolds release closeout plans (`closeout <version>`) with 0 LLM tokens.

## Consequences

### Positive
- Zero cross-branch merge conflicts when parallel worktree waves target the same release train.
- Single source of truth for forward version strategy (`docs/ROADMAP.md`) connected directly to execution truth (`docs/plans/*.plan.md`) and Notion Tasks (`Target Version`).
- Deterministic, zero-token changelog generation and release closeout scaffolding via `ticket.mjs release`.

### Negative / Trade-offs
- Renaming a version train requires updating `version:` in the frontmatter of open plans targeting that train.
