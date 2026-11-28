# Level B: Role-Isolated Adversarial Review

Prevent confirmation bias by separating Builder and Reviewer contexts:

1. **Spawn Reviewer in Fresh Context:**
   ```bash
   node scripts/ticket.mjs step --role reviewer
   ```
2. **Run Deterministic Review Digest:**
   ```bash
   node scripts/ticket.mjs pack --test
   ```
   Check spec fidelity, test proof, verification honesty, and working-tree hygiene.
3. **Stamp Verdict:**
   ```bash
   node scripts/ticket.mjs review --agent <client> --reviewer-id <id> [--model <model-id>] --verdict <pass|warn|block> --summary "<concise findings>"
   ```
4. **Resolve Block Verdicts (Fixer Role):**
   ```bash
   node scripts/ticket.mjs step --role fixer
   ```
   Fix the blocker findings from Progress log, re-run verification, and request re-review.

## Codex dispatch

For repositories with `agentic.modelProfiles.codex`, use `node scripts/ticket.mjs route --client codex --role <role>` (or `adw route` in universal installs). It works before a plan exists. In Codex, launch the role as a subagent with the returned `model` and `reasoning`. Keep planning and independent review read-only. Give the reviewer the review packet and use its own context. Record its actual model with `review --model <id>`.

For a tightly scoped builder or fixer task with a clear verification command, use the primary route. For broad implementation or ambiguous debugging, select `complexExecution` directly. If a scoped result fails verification and the cheap executor cannot resolve it, hand the failing check and current state to `complexExecution`. Use `optIn` only with explicit user approval. Record the models actually used, the verification result and the reason for escalation in the plan progress log. Run native Codex agents at standard speed so they use the signed-in Codex allowance when available.

For small support tasks listed under `offload.tasks`, use the `llm-router` MCP `offload_llm` tool and pass the returned `offload.privacy`. Continue in the existing Codex session if local offload is unavailable. The parent owns workflow gates and verifies all model-produced work.
