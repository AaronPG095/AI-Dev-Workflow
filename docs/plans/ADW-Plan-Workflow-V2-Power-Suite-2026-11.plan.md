---
title: Plan - Feature: Workflow V2 Power Suite (Remote Sync, Prime, New, Pack Test Digest, Overview, Hooks)
ticket: local://ADW:ADW-Plan-Workflow-V2-Power-Suite-2026-11
status: in-progress
priority: high
state: flow
due: 
devTicketKey: ADW:ADW-Plan-Workflow-V2-Power-Suite-2026-11
agent: Gemini
branch: gemini/workflow-v2-power-suite
worktree: AI-Dev-Workflow
startedAt: 2026-11-07
reviewedBy: Gemini
reviewVerdict: pass
---
# Workflow V2 Power Suite (Remote Sync, Prime, New, Pack Test Digest, Overview, Hooks)

## Summary

Expand the token-lean AI development workflow with six developer-experience and multi-PC portability capabilities: remote syncing without sibling directory dependencies, zero-token session ignition (`prime`), automated plan scaffolding (`new`), test verification digests inside review packets (`pack --test`), cross-repo status overview (`overview`), and zero-dependency pre-push git guardrails (`hook install`).

## Acceptance criteria

- [x] `node scripts/ticket.mjs new <Topic>` scaffolds a properly named plan doc with valid frontmatter, kebab-case filename, and project prefix. verified: unit test ok 28 and manual run created valid plan doc
- [x] `node scripts/ticket.mjs prime` outputs an ultra-compact (< 40 lines) context ignition summary showing active plan, open criteria, git branch, and verifyCommand. verified: unit test ok 29 and manual run output 23 lines
- [x] `node scripts/ticket.mjs pack` supports running the configured test command (via `--test`) and embedding a compact test verification result in the review packet. verified: unit test ok 30 and manual run showed PASS (exit code 0)
- [x] `node scripts/ticket.mjs overview` inspects known local repositories and outputs a compact terminal status table of branches, active plans, and pending steps. verified: unit test ok 31 and manual run printed table of 6 repos
- [x] `node scripts/ticket.mjs hook install` installs a zero-dependency shell `.git/hooks/pre-push` hook blocking accidental direct pushes to protected branches. verified: unit test ok 32 and manual run verified install, status, uninstall
- [x] `node scripts/sync.mjs --remote` downloads canonical workflow files directly from GitHub with zero external dependencies. verified: node scripts/sync.mjs --remote --check verified against GitHub raw API
- [x] Unit tests in `scripts/ticket.test.mjs` cover all new capabilities and pass 100%. verified: node --test scripts/ticket.test.mjs passed 32/32 tests in 11.5s

## Steps

- [x] Implement `new` command in `scripts/ticket.mjs` to scaffold new plan markdown files.
- [x] Implement `prime` command in `scripts/ticket.mjs` to output concise agent session context.
- [x] Enhance `pack` command in `scripts/ticket.mjs` to optionally execute `verifyCommand` and include test status.
- [x] Implement `overview` command in `scripts/ticket.mjs` to scan known repos and print branch/plan status.
- [x] Implement `hook` (`install`/`uninstall`) command in `scripts/ticket.mjs` for `.git/hooks/pre-push`.
- [x] Enhance `scripts/sync.mjs` with `--remote` fetching and add `.github/workflows/workflow-sync.yml` template.
- [x] Add comprehensive unit tests in `scripts/ticket.test.mjs` for all new commands.
- [x] Update `AGENTS.md`, `.agents/skills/dev-workflow`, and `.agents/skills/quick-review` (mirroring to `.claude/`).
- [x] Verify with `node --test scripts/ticket.test.mjs`.

## Risks

- **Cross-platform hook compatibility**: Git on Windows uses Git Bash for shell hooks; the pre-push script must use POSIX `/bin/sh` syntax compatible with Windows, macOS, and Linux.
- **Remote network latency / rate limits**: Fetching via GitHub raw should fail gracefully if offline or if network errors occur.
- **Token bloat in prime**: Must strictly cap output lines so it remains ultra-lean.

## Out of scope

- Installing heavy external npm packages (remains zero external dependencies, Node 22+ built-ins only).
- Automated git pushing or merging by the CLI itself.

## Notes

- Aaron approved all 6 features: "1 do this. 2. Implement. 3. do it. 4. do it. 5. do it. 6. do it. All of these resonate with me."

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
- 2026-11-07 15:51 UTC, Gemini (review: pass): Clean implementation of Workflow V2 Power Suite: remote sync, prime, new, pack test digest, overview, and hook guardrails. 32/32 tests pass with 0 external dependencies.
