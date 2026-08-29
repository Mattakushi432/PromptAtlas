# Coverage Matrix: Agents & Automation

- **Sub-domain**: agent system prompts, tool/function definitions, multi-agent orchestration, workflow automation (Zapier/n8n-style), RAG pipeline design, prompt-chaining, error-handling/guardrails, evaluation harness design
- **Persona**: AI engineer, no-code automation builder, product manager scoping an agent feature
- **JTBD stage**: plan/design → draft → debug → evaluate/harden
- **Output format**: system prompt, schema, checklist, diagnostic report

## Shipped

- `agent-system-prompt-drafter` — agent system prompts / draft.
- `tool-schema-reviewer` — tool definitions / critique.
- `guardrail-prompt-hardener` — error-handling/guardrails / critique.

## Backlog — ideas ready to draft

1. **Multi-Agent Handoff Protocol Designer** — orchestration / plan.
2. **No-Code Automation Recipe Builder** — workflow automation / draft / no-code builder.
3. **RAG Chunking Strategy Advisor** — RAG pipeline design / plan.
4. **Prompt-Chain Failure Point Diagnostic** — debug — isolates which step in a chain likely caused a bad output.
5. **Agent Eval Rubric Generator** — evaluation harness design / plan.
6. **Automation ROI Scoping Worksheet** — workflow automation / plan / product manager.
7. **Tool-Use Trace Reviewer** — debug — reads an agent's tool-call trace and explains what went wrong.
8. **Retry/Fallback Policy Designer** — error-handling / plan.
9. **Agent Persona Consistency Auditor** — agent system prompts / critique — checks a long transcript for persona drift.
