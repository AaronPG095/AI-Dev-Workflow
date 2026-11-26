---
title: Plan - Feature: Fleet Token Hygiene And Fast Verify
ticket: local://ADW:ADW-Plan-Fleet-Token-Hygiene-And-Fast-Verify-2026-11
status: planned
priority: 
state: 
due: 
appetite: S
version: 
impact: 
dependsOn: 
devTicketKey: ADW:ADW-Plan-Fleet-Token-Hygiene-And-Fast-Verify-2026-11
agent: Gemini
---
# Fleet Token Hygiene And Fast Verify

## Summary

Add fleet-wide token-hygiene improvements: update `quick-review` skill to default to `pack --compact` and `context-gatekeeper` symbol/chunk tools, add `sync.mjs --ensure-ignore` (`patchIgnoreFile`) to keep synced workflow files out of grep/ripgrep scans in sibling repos without touching `.gitignore`, and add `ticket.mjs merge --archive` to archive merged plans into `docs/plans/archive/<YYYY-MM>/` on merge.

## Context

- `.agents/skills/quick-review/SKILL.md` (and `.claude/skills/quick-review/SKILL.md`) currently instruct reviewers to run `node scripts/ticket.mjs pack` without `--compact` or `context-gatekeeper` `read_symbol`/`fetch_chunk` guidance.
- `scripts/sync.mjs` syncs `AGENTS.md`, `CLAUDE.md`, and `workflow-manifest.json` files to downstream repos (`--all-known`), but sibling repos' `.ignore` files do not exclude synced workflow files from grep/search indexes.
- `scripts/ticket.mjs` `commands.merge()` closes the PR and ticket, while `commands.archive()` moves completed/merged plans to `docs/plans/archive/<YYYY-MM>/`. Adding `--archive` to `merge` prevents active-plan bloat in one command.

## Open questions

None

## Acceptance criteria

- [ ] AC1: `.agents/skills/quick-review/SKILL.md` and `.claude/skills/quick-review/SKILL.md` (byte-identical) recommend `node scripts/ticket.mjs pack --compact` (or `pack --test`) and `context-gatekeeper` `read_symbol`/`fetch_chunk` instead of full-file reads.
- [ ] AC2: `scripts/sync.mjs` supports `--ensure-ignore` with exported `patchIgnoreFile(existingText)` adding `# managed by AI-Dev-Workflow` ignore entries (`.agents/skills/`, `.claude/skills/`, `docs/plans/archive/`, `scripts/ticket.mjs`, `scripts/sync.mjs`, `scripts/ticket.test.mjs`) to target repos' `.ignore` while skipping `repo === workflowRoot` and never modifying `.gitignore`.
- [ ] AC3: `scripts/ticket.mjs` supports `merge --archive` (`--archive` in `BOOLEAN_FLAGS`), moving the merged plan into `docs/plans/archive/<YYYY-MM>/` when `existsSync(plan.full)` and `!opts.dryRun`.
- [ ] AC4: `README.md` and mirrored `dev-workflow/SKILL.md` document `sync.mjs --ensure-ignore` and `merge --archive`.
- [ ] AC5: Unit test `L1` in `scripts/ticket.test.mjs` covers `patchIgnoreFile` idempotency, `--ensure-ignore` skipping `workflowRoot`, and `merge --archive` flag parsing/behavior; full suite passes (`102/102`).

## Steps

- [ ] Update `.agents/skills/quick-review/SKILL.md` and `.claude/skills/quick-review/SKILL.md` identically for `pack --compact` and `context-gatekeeper` (AC1)
- [ ] Add `--ensure-ignore` and exported `patchIgnoreFile(existingText)` in `scripts/sync.mjs` skipping `repo === workflowRoot` (AC2)
- [ ] Add `--archive` to `BOOLEAN_FLAGS` and `commands.merge()` in `scripts/ticket.mjs` (AC3)
- [ ] Update `README.md` and mirrored `dev-workflow/SKILL.md`, and add unit test `L1` in `scripts/ticket.test.mjs` (AC4, AC5)
- [ ] Verify full test suite (`102/102`), `doctor --compact`, `sync.mjs . --check --bundle-only`, and byte-identical `.agents/skills`/`.claude/skills`, then complete independent review (AC1, AC2, AC3, AC4, AC5)

## Risks

- Risk: `sync.mjs --ensure-ignore` writing `.ignore` in `AI-Dev-Workflow` itself would hide canonical workflow files from search in this repo. Mitigation: explicitly guard `repo !== workflowRoot` and test it in `L1`.
- Risk: `merge --archive` running on a dry-run or missing plan file. Mitigation: guard with `if (opts.archive && !opts.dryRun && existsSync(plan.full))` and `mkdirSync(..., { recursive: true })`.

## Out of scope

- Modifying `.gitignore` in any repository.
- Syncing sibling repositories or editing sibling `ticket.config.json` files (done in Phase 3 after Plan L merges).

## Notes

- Approved by Aaron ("Yes please implement both.").

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
