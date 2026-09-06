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
- `agent-context-window-pruning-advisor` — agent system prompts / plan / intermediate — decides what to drop from a long-running agent's context (old tool results, resolved sub-tasks) to stay under budget without losing task-critical state.
- `sub-agent-spawn-depth-guardrail-designer` — multi-agent orchestration / plan / intermediate — sets limits on how many sub-agents a parent agent may spawn and how deep, to prevent runaway recursive delegation; covers the aggregate fan-out shape across a whole delegation tree, distinct from `multi-agent-handoff-protocol-designer`'s single-handoff mechanics.
- `human-in-the-loop-approval-gate-designer` — error-handling/guardrails / plan / intermediate — decides which agent actions require explicit human approval before executing, given a described action's reversibility and blast radius.
- `agent-indirect-prompt-injection-reviewer` — error-handling/guardrails / critique / advanced — reviews an agent's system prompt and retrieval/tool-output handling for susceptibility to instructions smuggled in retrieved or tool content, distinct from `guardrail-prompt-hardener`'s direct-user-input jailbreak focus.
- `structured-output-schema-repair-advisor` — tool/function definitions / debug / intermediate — given a model's malformed JSON/structured output and the target schema, diagnoses the likely cause and proposes a prompt-level fix, not just a parser workaround.
- `workflow-automation-idempotency-auditor` — workflow automation / critique / intermediate — audits a no-code automation recipe for safe re-runs (e.g. a webhook-triggered Zap firing twice for one event).
- `agent-cost-per-task-estimator` — evaluation harness design / plan / intermediate — estimates token/tool-call cost for a proposed agent task before running it at scale, distinct from `automation-roi-scoping-worksheet`'s human-time-saved framing.
- `long-running-agent-checkpoint-resume-designer` — agent system prompts / plan / intermediate — designs how a long agent task persists progress so it can resume after an interruption instead of restarting from scratch.
- `multi-agent-shared-state-conflict-reviewer` — multi-agent orchestration / critique / advanced — reviews how concurrent agents reading/writing shared state (a shared doc, a task queue) could race or overwrite each other's work.
- `automation-trigger-storm-guardrail-designer` — workflow automation / plan / intermediate — designs rate-limiting/debouncing for an automation trigger that could fire in an unintended burst (e.g. a bulk CSV import triggering hundreds of individual workflow runs).
- `agent-onboarding-prompt-simplifier` — agent system prompts / optimize-refactor / intermediate — trims an over-grown agent system prompt (accumulated edge-case patches) back to a clear, maintainable core without losing coverage.
- `no-code-automation-migration-planner` — workflow automation / migration / intermediate — plans porting an existing no-code automation (Zapier) to a different platform (n8n, Make) or to custom code, explicitly scoped away from source-code language migration.

## Backlog — ideas ready to draft

_Drawn down to 0 again this session (2026-09-06) — the 12 items above cleared the entire refilled backlog. Refilled below from the coverage matrix's dimension-crossing method (§6.1) before the next agents-and-automation session._

1. **Agent Tool Selection Ambiguity Resolver** — plan — when an agent has multiple overlapping tools that could each plausibly handle a request, designs the disambiguation logic (priority rules, clarifying-question triggers) for picking the right one.
2. **Multi-Agent Debate/Consensus Protocol Designer** — plan — designs how several agents that produced different answers to the same task reach a single final output (voting, judge-model arbitration, weighted merge), distinct from the sequential handoff already covered by `multi-agent-handoff-protocol-designer`.
3. **Agent Session Timeout & Idle-Cleanup Policy Designer** — plan — decides when an idle agent session should end, archive, or discard its state, and what should be preserved for a later resume.
4. **RAG Retrieval Freshness Auditor** — review-critique — audits whether a RAG pipeline's retrieved content could be stale relative to its underlying source (index lag, cached embeddings, deleted-but-still-indexed documents).
5. **Agent Output Verbosity Tuner** — optimize-refactor — trims an agent's overly verbose default responses down to a target length/format without dropping information the task actually needs.
6. **No-Code Automation Failure Notification Designer** — plan — designs where and how a failed automation run alerts a human (channel, severity threshold, de-duplication), distinct from the idempotency and trigger-storm guardrail prompts already shipped.
7. **Agent-to-Human Escalation Message Drafter** — draft — given an agent that can't resolve a task itself, drafts the exact handoff message to a human, including the context they need to pick up without re-deriving it.
8. **Multi-Model Routing & Fallback Policy Designer** — plan — decides which model tier (cheap/fast vs. expensive/accurate) a request should route to and when to fall back, given task characteristics and a cost/quality tradeoff.
9. **Agent Tool-Output Caching Strategy Advisor** — plan — decides which tool calls are safe to cache and reuse across agent runs, and for how long, given how often the underlying data changes.
10. **Agent Regression Eval Set Curator** — draft — builds a small labeled set of representative and edge-case task inputs to catch regressions after a prompt or tool change, the input-curation counterpart to the already-shipped `agent-eval-rubric-generator`'s scoring criteria.
11. **Agent Permission Scope Reviewer** — review-critique — reviews what actions, tools, and data an agent actually has access to against what its task requires, flagging over-broad grants.
12. **Cross-Agent Terminology Consistency Auditor** — review-critique — audits multiple agents in one system for inconsistent naming or schema for the same concept (e.g. one agent's `user_id` vs. another's `userId`), a source of handoff friction distinct from `multi-agent-handoff-protocol-designer`'s protocol-mechanics focus.
