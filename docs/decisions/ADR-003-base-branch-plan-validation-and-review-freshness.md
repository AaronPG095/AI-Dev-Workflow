# ADR 003: Base Branch Plan Validation and Review Freshness

- **Status:** Accepted
- **Date:** 2026-11-11
- **Author:** Codex
- **Deciders:** Aaron, Codex

## Context

The Plan check accepted edits to closed plans and review stamps that predated later code changes. It also ran the validator proposed by the PR.

## Decision

Use the protected base branch's validator and configuration to check the committed PR content. Compare plan items with the committed baseline. Record a hash of the reviewed Git diff and plan requirements, excluding operational metadata in the selected plan so that a PR link can be recorded after review. Require an ordinary plan for workflow infrastructure changes while release verification is being implemented.

## Consequences

### Positive

- A verdict becomes stale when the reviewed code or requirements change.
- CI evaluates the same committed plan regardless of the checkout's local edits.

### Negative / Trade-offs

- Changes to the enforcement workflow itself still need maintainer review. This PR's new validator becomes the protected base policy after merge.
- A fingerprint checks freshness. The reviewer remains responsible for the quality of the review and verification evidence.
