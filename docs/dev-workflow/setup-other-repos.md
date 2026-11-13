# Setting up and syncing the development workflow in another repo

`AI-Dev-Workflow` is the upstream source of the shared AI development process (plan, plan doc, ticket, implement while ticking the plan, single-pass review via `pack`, finish only when closed out). Any AI client can follow it: Claude Code, Codex, Gemini/Antigravity, or Cursor.

## 1. Quick Sync or Bootstrap

### A. Remote Sync (Any Machine, Standalone Clones)
If you are on another PC or do not have `AI-Dev-Workflow` cloned next to your repository:

```powershell
# Check for drift against upstream
node scripts/sync.mjs --remote --check

# Pull the latest workflow files directly from GitHub
node scripts/sync.mjs --remote
```

### B. Local Multi-Repo Sync (`sync-repos.ps1`)
From the `AI-Dev-Workflow` checkout when sibling repositories are present:

```powershell
# Check drift across all configured sibling repositories
.\scripts\sync-repos.ps1 -AllKnown -Check

# Bootstrap a brand-new repository (local mode by default)
.\scripts\sync-repos.ps1 C:\path\to\repo -InitPrefix MYP

# Sync updates to an existing repository
.\scripts\sync-repos.ps1 C:\path\to\repo
```

`scripts/workflow-manifest.json` lists the required engine, updater, installers, skills, templates, and workflows. Sync reads the complete bundle before writing files and preserves each repository's `scripts/ticket.config.json`. Remote mode pins the requested ref for the duration of a sync. To bootstrap or upgrade an older copy that cannot read the manifest, use a current installer.

A check returns 0 if current, 1 for managed-file drift, and 2 when incomplete. The scheduled workflow reports drift. Pure workflow sync PRs that pass `node scripts/sync.mjs . --remote --check` can use the `no-plan` label; otherwise run updates on a branch with an approved plan.

---

## 2. Configuring `scripts/ticket.config.json`

### Option A: Local Tracker Mode (Zero external accounts or tokens)

Works immediately offline and in public repositories:

```json
{
  "prefix": "MYP",
  "tracker": "local",
  "timeZone": "Europe/Berlin",
  "plansDir": "docs/plans",
  "protectedBranches": ["main"],
  "captureSources": ["Claude", "Codex", "Gemini", "ChatGPT", "Notion AI", "Other"],
  "verify": {
    "test": "npm test",
    "full": "npm run lint && npm test"
  },
  "verifyCommand": "npm test",
  "hygiene": {
    "maxFileSizeKB": 1024,
    "disallowedPatterns": [".tmp", "test-results", "coverage", ".worktrees"]
  },
  "agentic": {
    "maxRetries": 3,
    "verifyTier": "test"
  },
  "requireReview": false,
  "noPlan": {
    "maxChangedLines": 40,
    "noNewFilesUnder": ["src"]
  }
}
```

### Option B: Notion Tracker Mode

Connects plans to a Notion Tasks database (`NOTION_TOKEN` in environment, `.env`, or main checkout `.env` when inside a git worktree, plus repository secret `NOTION_TOKEN` in GitHub Actions for `ticket-done.yml`):

```json
{
  "prefix": "MYP",
  "tracker": "notion",
  "dataSourceId": "<notion-tasks-data-source-uuid>",
  "projectPageId": "<notion-project-page-uuid>",
  "tag": "Work / Project",
  "lifeAreaPageId": "<notion-life-area-page-uuid-optional>",
  "timeZone": "Europe/Berlin",
  "plansDir": "docs/plans",
  "protectedBranches": ["main", "develop"],
  "captureSources": ["Claude", "Codex", "Gemini", "ChatGPT", "Notion AI", "Other"],
  "verify": {
    "test": "npm test",
    "full": "npm run lint && npm test"
  },
  "verifyCommand": "npm test",
  "hygiene": {
    "maxFileSizeKB": 1024,
    "disallowedPatterns": [".tmp", "test-results", "coverage", ".worktrees"]
  },
  "agentic": {
    "maxRetries": 3,
    "verifyTier": "test"
  },
  "requireReview": false,
  "noPlan": {
    "maxChangedLines": 40,
    "noNewFilesUnder": ["src"]
  }
}
```

---

## 3. Wiring `AGENTS.md` and `CLAUDE.md`

1. **`AGENTS.md`**: Copy the `## Development process (every AI: Claude, Codex, Gemini/Antigravity, Cursor)` section from `AI-Dev-Workflow/AGENTS.md` into the target repository's `AGENTS.md`, replacing `ADW` with `<PREFIX>` and `scripts/` in the `no-plan` rule with the repository's main source directory (`src/`, `app/`, etc.).
2. **`CLAUDE.md`**: If missing, create `CLAUDE.md` containing `@AGENTS.md` (or add `@AGENTS.md` as the first line of an existing hand-written `CLAUDE.md`). Do not add a `GEMINI.md` (Antigravity reads `AGENTS.md` natively).
3. **`no-plan` GitHub Label**:
   ```powershell
   gh label create no-plan --repo <owner>/<repo> --color BFD4F2 --description "Trivial change (<= 40 lines, no new files under source folder); no plan needed"
   ```

---

## 4. Verifying the Setup

```powershell
node --test scripts/ticket.test.mjs
node scripts/ticket.mjs check docs/plans/<plan-file>.plan.md
node scripts/ticket.mjs ci-check --base origin/<default-branch> --head HEAD
```
