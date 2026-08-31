# Coverage Matrix: Agents & Automation

- **Sub-domain**: agent system prompts, tool/function definitions, multi-agent orchestration, workflow automation (Zapier/n8n-style), RAG pipeline design, prompt-chaining, error-handling/guardrails, evaluation harness design
- **Persona**: AI engineer, no-code automation builder, product manager scoping an agent feature
- **JTBD stage**: plan/design → draft → debug → evaluate/harden
- **Output format**: system prompt, schema, checklist, diagnostic report

## Shipped

- `agent-system-prompt-drafter` — agent system prompts / draft.
- `tool-schema-reviewer` — tool definitions / critique.
- `guardrail-prompt-hardener` — error-handling/guardrails / critique.
- `multi-agent-handoff-protocol-designer` — multi-agent orchestration / plan / advanced — designs the trigger, payload, acknowledgment, and failure/loop-prevention mechanics for a handoff between two agents.
- `tool-use-trace-reviewer` — debug / intermediate — diagnoses a completed tool-call trace, distinguishing planning error, result misinterpretation, bad tool result, and schema gap as separate root causes; the after-the-fact counterpart to `tool-schema-reviewer`'s before-deployment schema review.
- `retry-fallback-policy-designer` — error-handling / plan / intermediate — designs an agent's retry/fallback/give-up decision logic per tool failure mode, distinct from `retry-storm-prevention-advisor` (coding)'s network-level backoff timing.
- `rag-chunking-strategy-advisor` — RAG pipeline design / plan / intermediate — recommends chunk size, overlap, and splitting method given document structure and query patterns.
- `agent-eval-rubric-generator` — evaluation harness design / plan / intermediate — generates a scoring rubric with pass/fail criteria and edge cases for grading an agent's task output consistently.
- `agent-persona-consistency-auditor` — agent system prompts / critique / intermediate — audits a long transcript against its system prompt's defined persona for drift.
- `no-code-automation-recipe-builder` — workflow automation / draft / beginner (no-code builder persona) — turns a plain-language automation goal into a concrete Zapier/n8n/Make-style trigger-and-steps recipe.
- `prompt-chain-failure-point-diagnostic` — debug / intermediate — isolates which step in a multi-step prompt chain introduced an error, distinguishing a bad step output from a downstream misuse of a good one.
- `automation-roi-scoping-worksheet` — workflow automation / plan / beginner (product manager persona) — estimates whether a manual process is worth automating (time saved vs. build/maintenance cost, break-even, risk factors).

## Backlog — ideas ready to draft

_Drawn down to 0 this session (2026-08-31) — the 9 items above cleared the entire starter backlog. Refilled below from the coverage matrix's dimension-crossing method (§6.1) before the next agents-and-automation session._

1. **Agent Memory/Context-Window Pruning Advisor** — plan — decides what to drop from a long-running agent's context (old tool results, resolved sub-tasks) to stay under budget without losing task-critical state.
2. **Sub-Agent Spawning Cost/Depth Guardrail Designer** — plan — sets limits on how many sub-agents a parent agent may spawn and how deep, to prevent runaway recursive delegation.
3. **Human-in-the-Loop Approval Gate Designer** — plan — decides which agent actions require explicit human approval before executing, given a described action's reversibility and blast radius.
4. **Agent Prompt Injection Resistance Reviewer** — review-critique — reviews an agent's system prompt and tool outputs handling for susceptibility to instructions smuggled in retrieved/tool content.
5. **Structured Output Schema Repair Advisor** — debug — given a model's malformed JSON/structured output and the target schema, diagnoses the likely cause and proposes a prompt-level fix, not just a parser workaround.
6. **Workflow Automation Idempotency Auditor** — review-critique — audits a no-code automation recipe for safe re-runs (e.g. a webhook-triggered Zap firing twice for one event).
7. **Agent Cost-per-Task Estimator** — plan — estimates token/tool-call cost for a proposed agent task before running it at scale, given a described task and tool set.
8. **Long-Running Agent Checkpoint/Resume Designer** — plan — designs how a long agent task persists progress so it can resume after an interruption instead of restarting from scratch.
9. **Multi-Agent Shared-State Conflict Reviewer** — review-critique — reviews how concurrent agents reading/writing shared state (a shared doc, a task queue) could race or overwrite each other's work.
10. **Automation Trigger Storm Guardrail Designer** — plan — designs rate-limiting/debouncing for an automation trigger that could fire in an unintended burst (e.g. a bulk CSV import triggering hundreds of individual workflow runs).
11. **Agent Onboarding Prompt Simplifier** — optimize-refactor — trims an over-grown agent system prompt (accumulated edge-case patches) back to a clear, maintainable core without losing coverage.
12. **No-Code Workflow Migration Planner** — migration — plans porting an existing no-code automation (Zapier) to a different platform (n8n, Make) or to custom code, given the original recipe.
