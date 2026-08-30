# agents-and-automation

_3 prompt(s) — auto-generated. Run `node scripts/generate-index.js agents-and-automation` after adding, removing, or editing a prompt in this folder; do not hand-edit._

| id | Title | Difficulty | Description |
|---|---|---|---|
| [`agent-system-prompt-drafter`](./agent-system-prompt-drafter.md) | Agent System Prompt Drafter | intermediate | Turns a role description into a complete, testable system prompt — identity, scope, tool usage, output format, guardrails, and escalation — instead of a vague one-paragraph persona. |
| [`guardrail-prompt-hardener`](./guardrail-prompt-hardener.md) | Guardrail Prompt Hardener | advanced | Stress-tests a system prompt against jailbreak, scope-creep, and role-confusion attempts and proposes concrete hardening edits — not generic "add more safety language." |
| [`tool-schema-reviewer`](./tool-schema-reviewer.md) | Tool / Function Schema Reviewer | intermediate | Reviews a function-calling / tool schema for ambiguity, missing constraints, and unsafe defaults before it ships — the schema, not the agent, is usually the root cause when an agent keeps calling a tool wrong. |
