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

For a tightly scoped builder or fixer task with a clear verification command, use the primary route. For broad implementation or ambiguous debugging, select `complexExecution` directly. If a scoped attempt cannot pass verification, hand the failing check and current state to `complexExecution`.

When the resolved route includes `escalation`, use it directly for work that clearly requires deeper reasoning, or give it one focused attempt when routine reasoning leaves a concrete blocker. Pass the blocker, evidence, and expected verification to the subagent. Keep escalated planning and review read-only, and use fresh contexts for independent review. If difficult work still needs deeper reasoning after the escalation, or the profile lacks that route, report what remains and ask before using `optIn`. Record the model, reasoning level, escalation trigger, and verification result in the plan progress log. Run native Codex agents at standard speed so they use the signed-in Codex allowance when available.

For small support tasks listed under `offload.tasks`, use the `llm-router` MCP `offload_llm` tool and pass the returned `offload.privacy`. Continue in the existing Codex session if local offload is unavailable. The parent owns workflow gates and verifies all model-produced work.

## Codex model check

Use `prime --client codex` or `resume --client codex` on normal startup. If it prints `Model check due`, keep working on the current task and batch the following public-source reads with other independent work when possible. Use the reported last successful check to focus on changes and compare them with the pinned Codex profile. Check announced retirements for currently pinned models regardless of announcement date.

- [Codex changelog](https://learn.chatgpt.com/docs/changelog)
- [Codex pricing](https://learn.chatgpt.com/docs/pricing#token-rates)
- [OpenAI API deprecations](https://developers.openai.com/api/docs/deprecations)

Surface only candidates available in Codex, material rate changes, or retirements that affect pinned models. Run `node scripts/ticket.mjs model-check --complete` (or `adw model-check --complete` in universal installs) once all sources were checked, including when there is nothing to report. If a source is unavailable, continue the main task and leave the check due. Any model promotion still goes through matched evaluation and a reviewed PR.
