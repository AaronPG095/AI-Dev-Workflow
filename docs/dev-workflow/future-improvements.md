# Potential Future Improvements (Tier 3 Backlog)

Parked ideas from workflow pattern research (build only when `ticket.mjs stats` or daily friction justifies them; each requires its own approved plan/PR under `AGENTS.md`).

## Candidates

1. **[Shipped] Plan dependencies, `ready` queue & worker claim semantics (`dependsOn`, `ready`)**
   - *Shipped in:* `ADW-Plan-Dependency-Graph-Ready-Queue-And-Map-2026-11.plan.md` (`dependsOn:` frontmatter + `new --depends-on`, `ticket.mjs ready [--blueprint] [--claim] [--release]`, `ticket.mjs blueprint status`, and dependency-gated `wave --spawn`).
2. **[Shipped] Repo symbol map summary (`ticket.mjs map`)**
   - *Shipped in:* `ADW-Plan-Dependency-Graph-Ready-Queue-And-Map-2026-11.plan.md` (`ticket.mjs map [<filter>] [--max <N>] [--json]` via `scripts/lib/symbols-map.mjs`).
3. **[Shipped] Role→model routing & `run` review-round budget**
   - *Shipped in:* `ADW-Plan-Role-Model-Routing-And-Architecture-Blueprints-2026-11.plan.md` (`agentic.models` mapping `planner`, `builder`, `fixer`, and `reviewer`, surfaced in `step --role`, `prime`, `review --prompt`, and `run` via `ADW_MODEL`).
4. **[Shipped] `Spike` plan type**
   - *Shipped in:* `ADW-Plan-Spike-Plan-Type-2026-11.plan.md` (`new --type Spike [--timebox <duration>]` with time-boxed default appetite `S`, `## Hypothesis`, `## Findings & Recommendation`, and `lint` validation).
5. **[Shipped] Modularise `scripts/ticket.mjs`**
   - *Shipped in:* `ADW-Plan-Modularize-Ticket-Cli-2026-11.plan.md` (extracted `scripts/lib/markdown-plan.mjs`, `scripts/lib/invariants-lint.mjs`, `scripts/lib/stats-lessons.mjs`, and `scripts/lib/symbols-map.mjs`, synced via `scripts/workflow-manifest.json`).
6. **Non-goals to keep excluding**
   - Multi-persona agent bloat, 3–4 docs per feature, JSON task lists replacing markdown, or built-in non-zero-dep mutation testing.
