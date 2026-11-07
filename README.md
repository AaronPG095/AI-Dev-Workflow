# AI-Dev-Workflow

A lightweight, **token-lean**, multi-agent development workflow for **Claude Code**, **OpenAI Codex**, **Google Gemini / Antigravity**, and **Cursor**.

Designed for developers working across multiple AI clients on real-world token budgets—enforcing plan discipline, verifiable acceptance criteria, single-pass code review, and CI close-out gates with **zero external npm dependencies**.

---

## Why This Exists

Most AI coding workflows fail in one of two ways:
1. **Too loose:** The agent jumps straight into code, forgets half the requirements, deletes failing checks, or ships unverified changes.
2. **Too bloated:** Heavy multi-agent pipelines, redundant sub-agent reviews, and 6-turn exploratory tool loops burn through token quotas on plans like Gemini Flash/Pro and ChatGPT Plus (Codex) before the real work is done.

`AI-Dev-Workflow` sits in the sweet spot:
- **One canonical process in `AGENTS.md`** (loaded natively by Codex, Antigravity/Gemini, Cursor, and via `@AGENTS.md` in Claude Code).
- **One zero-dependency CLI (`scripts/ticket.mjs`)** for plan validation, local or Notion ticket tracking, handoff logs, deterministic review packets, and GitHub Actions CI gates.
- **Zero-token review preparation (`ticket.mjs pack`)** that replaces 6+ exploratory tool calls with a single compact digest (plan criteria + working-tree hygiene + lockfile-filtered, size-capped git diff).

---

## The 6-Step Workflow

Trivial changes (`<= 40` changed lines and no new files in the main source folder) can skip the process using the `no-plan` PR label. All non-trivial changes follow six steps:

1. **Plan** — Investigate read-only, propose the approach, and wait for human approval.
2. **Plan Doc** — Copy `docs/plans/_template.plan.md` to `docs/plans/<PREFIX>-Plan-<Topic>-<YYYY-MM>.plan.md` with `- [ ]` checkboxes for Acceptance Criteria and Steps.
3. **Ticket (`create`)** — Run `node scripts/ticket.mjs create <plan> --agent <Claude|Codex|Gemini|Other>`. Supports **Local mode** (`local://<key>`, zero external setup) and **Notion mode** (deduplicated via `Dev Ticket Key`).
4. **Implement (`start` & `log`)** — Branch, run `node scripts/ticket.mjs start`, and tick each checkbox as it is completed. Every ticked acceptance criterion must end with concise `verified: <how and result>` evidence. Uncompleted items are never deleted—mark them `deferred: <reason>`. When pausing or switching AI clients, run `node scripts/ticket.mjs log --agent <client> --message "<done>; next: <step>; open: <questions>"`.
5. **Review (`pack` & `review`)** — Run `node scripts/ticket.mjs pack` (0 LLM tokens) to produce a compact review packet. Run a single-pass review (via the `quick-review` skill, a fresh session, or a second AI client) and stamp the result:
   ```powershell
   node scripts/ticket.mjs review --agent <client> --verdict <pass|warn|block> --summary "<findings>"
   ```
6. **Finish (`check` & `ship`)** — Verify close-out with `node scripts/ticket.mjs check`, open the PR, and link it via `node scripts/ticket.mjs ship --pr <url>`. GitHub Actions (`plan-check.yml`) blocks PRs with open items, unverified criteria, deleted checkboxes, or a `block` review verdict.

---

## Repository Structure

```text
AI-Dev-Workflow/
├── .agents/skills/
│   ├── dev-workflow/SKILL.md      # Runnable 6-step checklist for agents
│   └── quick-review/SKILL.md      # Single-pass, token-lean code review skill
├── .claude/skills/                # Mirror for Claude Code skill discovery
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                 # Runs the test suite on push/PR
│   │   ├── plan-check.yml         # Blocks PRs with unclosed plans or unverified criteria
│   │   └── ticket-done.yml        # Marks linked tickets Done when a PR merges
│   └── pull_request_template.md
├── docs/
│   ├── dev-workflow/
│   │   └── setup-other-repos.md   # Guide for bootstrapping and syncing target repos
│   └── plans/
│       └── _template.plan.md      # Canonical plan template
├── scripts/
│   ├── ticket.mjs                 # Zero-dependency workflow & review CLI (Node 22+)
│   ├── ticket.config.json         # Repository configuration (local mode default)
│   ├── ticket.test.mjs            # 26 unit & integration tests (node:test)
│   └── sync-repos.ps1             # Multi-repo installer, updater, and drift checker
├── AGENTS.md                      # Universal instructions for Codex, Gemini/Antigravity, Cursor
├── CLAUDE.md                      # @AGENTS.md import for Claude Code
└── ticket.config.example.json     # Example config for Local and Notion tracker modes
```

---

## CLI Reference (`scripts/ticket.mjs`)

Requires **Node.js 22+**. When `<plan>` is omitted on a feature branch, `ticket.mjs` automatically resolves the active plan for the current branch.

```powershell
# Create ticket (Notion Task or local:// key)
node scripts/ticket.mjs create docs/plans/ADW-Plan-Example-2026-11.plan.md --agent Gemini

# Start work on a feature branch (records branch + worktree)
node scripts/ticket.mjs start

# Log handoff progress before ending a session or switching AI models
node scripts/ticket.mjs log --agent Gemini --message "Implemented pack; next: unit tests; open: none"

# Generate a 0-token, lockfile-filtered review packet
node scripts/ticket.mjs pack

# Record a single-pass code review verdict (pass | warn | block)
node scripts/ticket.mjs review --agent Codex --verdict pass --summary "Criteria verified, no scope creep"

# Verify all checkboxes are ticked/deferred and criteria carry verified: evidence
node scripts/ticket.mjs check

# Link pull request and print deferred items for the PR body
node scripts/ticket.mjs ship --pr https://github.com/owner/repo/pull/1

# Run the test suite
node --test scripts/ticket.test.mjs
```

---

## Bootstrapping or Syncing Other Repositories

Use `scripts/sync-repos.ps1` (inspired by [`titstack`](https://github.com/ChrisTitusTech/titstack), adapted for GitHub Actions CI compatibility where repository files are synced and drift-checked rather than symlinked):

```powershell
# Bootstrap a new repo with starter config
.\scripts\sync-repos.ps1 C:\path\to\my-repo -InitPrefix MYP

# Check for workflow drift across your repositories
.\scripts\sync-repos.ps1 -AllKnown -Check

# Sync the latest CLI, templates, skills, and GitHub workflows
.\scripts\sync-repos.ps1 -AllKnown
```

See [`docs/dev-workflow/setup-other-repos.md`](docs/dev-workflow/setup-other-repos.md) for full details on Local vs. Notion configuration.
