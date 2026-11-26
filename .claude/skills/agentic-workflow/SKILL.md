---
name: agentic-workflow
description: Opt-in modular agentic execution engine on top of AI-Dev-Workflow (Level A self-healing step loop, Level B role-isolated adversarial review, Level C parallel worktree waves). Use when executing plans autonomously, managing multi-agent subtasks, or running worktree waves.
---

# Agentic Workflow Add-On (Levels A, B, and C)

Opt-in modular execution layer on pure Node.js 22+ built into `scripts/ticket.mjs`. Keep `.agents/skills/agentic-workflow/` and `.claude/skills/agentic-workflow/` identical.

## Choose Your Level (Load Only What You Need)

- **Level A — Self-Healing Step Loop:** Advance one plan step-by-step with `step`, `checkpoint --commit`, and `run` (`maxRetries: 3` circuit breaker). Read [references/level-a.md](references/level-a.md).
- **Level B — Role-Isolated Reviewer & Fixer:** Separate Builder from Reviewer (`step --role reviewer`, `pack --test`, `review`, `step --role fixer` on `block`). Read [references/level-b.md](references/level-b.md).
- **Level C — Parallel Worktree Waves:** Run independent plans concurrently across `.worktrees/<branch>` (`wave --spawn|--status|--check|--prune`). Read [references/level-c.md](references/level-c.md).

## Role-to-Model Routing (`agentic.models`)

Configure per-role models in `scripts/ticket.config.json` (`planner`, `builder`, `fixer`, `reviewer`). `step`, `prime`, `review --prompt`, and `run` (`ADW_MODEL`) surface the configured model; in Antigravity, delegate via `swarm` `add` with `model` set to the role's model and pass `--model <id>` to `review`.
