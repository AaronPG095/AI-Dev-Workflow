# Setting up and syncing the development workflow in another repo

`AI-Dev-Workflow` is the upstream source of the shared AI development process (plan, plan doc, ticket, implement while ticking the plan, single-pass review via `pack`, finish only when closed out). Any AI client can follow it: Claude Code, Codex, Gemini/Antigravity, or Cursor.

## 1. Quick Sync or Bootstrap (`sync-repos.ps1`)

From the `AI-Dev-Workflow` checkout:

```powershell
# Check drift across all configured sibling repositories
.\scripts\sync-repos.ps1 -AllKnown -Check

# Bootstrap a brand-new repository (local mode by default)
.\scripts\sync-repos.ps1 C:\path\to\repo -InitPrefix MYP

# Sync updates to an existing repository
.\scripts\sync-repos.ps1 C:\path\to\repo
```

`sync-repos.ps1` updates the shared engine files (`scripts/ticket.mjs`, `scripts/ticket.test.mjs`, `docs/plans/_template.plan.md`, `.agents/skills/{dev-workflow,quick-review}/SKILL.md`, `.claude/skills/{dev-workflow,quick-review}/SKILL.md`, `.github/workflows/{plan-check,ticket-done}.yml`, and `.github/pull_request_template.md`) while preserving each repository's `scripts/ticket.config.json`.

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
  "verifyCommand": "npm test",
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
  "verifyCommand": "npm test",
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
