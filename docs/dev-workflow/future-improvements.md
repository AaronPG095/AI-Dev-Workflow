# Potential Future Improvements (Tier 3 Backlog)

Parked ideas from workflow pattern research (build only when `ticket.mjs stats` or daily friction justifies them; each requires its own approved plan/PR under `AGENTS.md`).

## Candidates

1. **Plan dependencies, `ready` queue & worker claim semantics (`dependsOn`, `ready`)**
   - *When:* You regularly run multi-plan parallel `wave` batches with ordering constraints.
   - *Idea:* Optional `dependsOn:` frontmatter keys, `ticket.mjs ready` listing unblocked plans, and atomic worker claim metadata so concurrent agents don't pick colliding plans.
2. **Repo symbol map summary (`ticket.mjs map`)**
   - *When:* Onboarding cold agents to larger codebases (e.g., Fluent repos).
   - *Idea:* Zero-dep AST/regex outline of top exported functions/classes and entrypoints to populate `## Context` faster.
3. **Role→model routing & `run` review-round budget**
   - *When:* Using `ticket.mjs run` autonomously with heterogeneous model runners.
   - *Idea:* Config mapping `builder`/`reviewer`/`fixer` to separate runner commands plus `maxReviewRounds` circuit-breaker.
4. **`Spike` plan type**
   - *When:* Exploratory prototypes are mixed into Feature plans.
   - *Idea:* `new --type Spike` with time-boxed appetite and hypothesis/answer outcome sections instead of implementation steps.
5. **Modularise `scripts/ticket.mjs`**
   - *When:* Single-file maintenance slows down edits.
   - *Idea:* Split into focused ESM modules under `scripts/lib/` with `sync`/`workflow-manifest.json` updated identically—preceded by characterization tests.
6. **Non-goals to keep excluding**
   - Multi-persona agent bloat, 3–4 docs per feature, JSON task lists replacing markdown, or built-in non-zero-dep mutation testing.
