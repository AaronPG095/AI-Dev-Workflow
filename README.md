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
- **One zero-dependency CLI (`scripts/ticket.mjs`)** for plan scaffolding, session ignition, local or Notion ticket tracking, handoff logs, deterministic review packets, git guardrails, and GitHub Actions CI gates.
- **Zero-token session ignition (`ticket.mjs prime`)** that prints a compact ~20-line context primer for fresh agent chat sessions (active plan, branch, open criteria, next steps, verifyCommand).
- **Zero-token review preparation (`ticket.mjs pack`)** that replaces 6+ exploratory tool calls with a single compact digest (plan criteria + working-tree hygiene + lockfile-filtered git diff + optional test verification proof via `--test`).
- **Drift-proof cross-machine portability (`scripts/sync.mjs --remote`)** to sync or check the workflow from GitHub anywhere with zero local folder dependencies.

---

## The 6-Step Workflow

Trivial changes (`<= 40` changed lines and no new files in the main source folder) can skip the process using the `no-plan` PR label. All non-trivial changes follow six steps:

1. **Plan** — Investigate read-only, propose the approach, and wait for human approval.
2. **Plan Doc** — Scaffold automatically with `node scripts/ticket.mjs new "<Topic>" [--type Feature] [--branch]` or copy `docs/plans/_template.plan.md` to `docs/plans/<PREFIX>-Plan-<Topic>-<YYYY-MM>.plan.md` with `- [ ]` checkboxes for Acceptance Criteria and Steps.
3. **Ticket (`create`)** — Run `node scripts/ticket.mjs create <plan> --agent <Claude|Codex|Gemini|Other>`. Supports **Local mode** (`local://<key>`, zero external setup) and **Notion mode** (deduplicated via `Dev Ticket Key`).
4. **Implement (`start`, `prime` & `log`)** — Branch, run `node scripts/ticket.mjs start`, and tick each checkbox as it is completed.
   - Cold starts: run `node scripts/ticket.mjs prime` for an instant 20-line session primer, or `node scripts/ticket.mjs overview` for multi-repo status.
   - Every ticked acceptance criterion must end with concise `verified: <how and result>` evidence. Uncompleted items are never deleted—mark them `deferred: <reason>`.
   - When pausing or switching AI clients, run `node scripts/ticket.mjs log --agent <client> --message "<done>; next: <step>; open: <questions>"`.
5. **Review (`pack` & `review`)** — Run `node scripts/ticket.mjs pack [--test]` (0 LLM tokens, embeds test results with `--test`) to produce a compact review packet. Run a single-pass review (via the `quick-review` skill, a fresh session, or a second AI client) and stamp the result:
   ```powershell
   node scripts/ticket.mjs review --agent <client> --verdict <pass|warn|block> --summary "<findings>"
   ```
6. **Finish (`check` & `ship`)** — Verify close-out with `node scripts/ticket.mjs check`, open the PR, and link it via `node scripts/ticket.mjs ship --pr <url>`. GitHub Actions (`plan-check.yml`) blocks PRs with open items, unverified criteria, deleted checkboxes, or a `block` review verdict.

*(Optional safety guardrail: run `node scripts/ticket.mjs hook install` to block accidental direct pushes to protected branches like `main`.)*

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
│   │   ├── ticket-done.yml        # Marks linked tickets Done when a PR merges
│   │   └── workflow-sync.yml      # Weekly automated drift check and sync PR generator
│   └── pull_request_template.md
├── docs/
│   ├── decisions/                 # In-repo Architecture Decision Records (ADRs)
│   ├── dev-workflow/
│   │   └── setup-other-repos.md   # Guide for bootstrapping and syncing target repos
│   └── plans/
│       └── _template.plan.md      # Canonical plan template
├── scripts/
│   ├── ticket.mjs                 # Zero-dependency workflow & review CLI (Node 22+)
│   ├── ticket.config.json         # Repository configuration (local mode default)
│   ├── ticket.test.mjs            # 36 unit & integration tests (node:test)
│   ├── sync.mjs                   # Cross-platform sync and drift engine (--remote & local)
│   ├── sync-repos.ps1             # PowerShell wrapper for multi-repo sync
│   └── install.ps1                # One-line multi-machine bootstrapper (curl/iex)
├── AGENTS.md                      # Universal instructions for Codex, Gemini/Antigravity, Cursor
├── CLAUDE.md                      # @AGENTS.md import for Claude Code
└── ticket.config.example.json     # Example config for Local and Notion tracker modes
```

---

## CLI Reference (`scripts/ticket.mjs`)

Requires **Node.js 22+**. When `<plan>` is omitted on a feature branch, `ticket.mjs` automatically resolves the active plan for the current branch.

```powershell
# 1. Plan Scaffolding
# Automatically creates docs/plans/<PREFIX>-Plan-<Topic>-<YYYY-MM>.plan.md
node scripts/ticket.mjs new "Smart Shortcut Suggestions" --type Feature [--branch]

# 2. Ticket Lifecycle
# Create ticket (Notion Task or local:// key)
node scripts/ticket.mjs create docs/plans/ADW-Plan-Example-2026-11.plan.md --agent Gemini

# Start work on a feature branch (records branch + worktree)
node scripts/ticket.mjs start

# 3. Agent Session Ignition & Handoff
# Prints a compact ~20-line context primer for fresh chat sessions
node scripts/ticket.mjs prime

# Record structured handoff between AI models (Gemini -> Claude -> Codex)
node scripts/ticket.mjs handoff --agent Gemini --done "Built parser" --next "Write tests" --open "none"

# Resume session with dirty tree check and next pending action
node scripts/ticket.mjs resume

# View active plans and branch status across all known repositories
node scripts/ticket.mjs overview

# 4. Review & Verification
# Generate a 0-token review packet; optionally embed verifyCommand results
node scripts/ticket.mjs pack [--test]

# Record a single-pass code review verdict (pass | warn | block)
node scripts/ticket.mjs review --agent Codex --verdict pass --summary "Criteria verified, no scope creep"

# 5. Finish & Gatekeeper
# Verify all checkboxes are ticked/deferred and criteria carry verified: evidence
node scripts/ticket.mjs check

# Automated PR creation & ticket shipping in one command (uses GitHub CLI gh)
node scripts/ticket.mjs pr [--draft]

# Or link an already-opened PR manually:
node scripts/ticket.mjs ship --pr https://github.com/owner/repo/pull/1

# 6. Technical Memory, Utilities & Safety
# Scaffold in-repo Architecture Decision Record in docs/decisions/
node scripts/ticket.mjs adr "Use Native Child Process Over External Packages"

# Execute command across all local repositories in parallel
node scripts/ticket.mjs exec "git status --short"

# Install pure shell pre-push hook to prevent direct push to protected branches
node scripts/ticket.mjs hook install

# Run the 36-test hermetic test suite
node --test scripts/ticket.test.mjs
```

---

## Cross-Machine Syncing & Downstream Repositories

### Remote Sync (Any Machine, Zero Local Sibling Dependencies)
In any target repository clone anywhere in the world, sync directly from GitHub:

```powershell
# Check for drift against upstream
node scripts/sync.mjs --remote --check

# Pull latest CLI, skills, plan template, and workflows
node scripts/sync.mjs --remote
```

### Local Multi-Repo Batch Sync
When developing locally with sibling repositories in the same parent folder:

```powershell
# Check drift across all configured repositories
.\scripts\sync-repos.ps1 -AllKnown -Check

# Sync latest workflow files across all repositories
.\scripts\sync-repos.ps1 -AllKnown

# Bootstrap a brand-new repository with starter config
.\scripts\sync-repos.ps1 C:\path\to\my-repo -InitPrefix MYP
```

### Automated GitHub Action Sync (`workflow-sync.yml`)
Downstream repositories receive `.github/workflows/workflow-sync.yml`, which runs weekly or via `workflow_dispatch`. If upstream `AI-Dev-Workflow` has updates, the action automatically detects drift and opens a PR: `chore(workflow): sync to latest AI-Dev-Workflow`.

See [`docs/dev-workflow/setup-other-repos.md`](docs/dev-workflow/setup-other-repos.md) for full details on Local vs. Notion configuration.
