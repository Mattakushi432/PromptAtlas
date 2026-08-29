# Coverage Matrix: Coding & Development

Dimensions crossed to source distinct prompt ideas (`CURATOR_PROMPT.md` §6.1). Not every cell is used — only ones representing a genuinely different job.

- **Sub-domain**: frontend, backend, databases, DevOps/infra, mobile, security, testing, algorithms/data structures, code review, documentation, migration, performance
- **Persona**: beginner, junior, senior/expert, engineering manager, non-technical stakeholder
- **JTBD stage**: plan → draft/generate → review/critique → debug/troubleshoot → optimize/refactor → explain/teach → document
- **Tool/context**: specific language/framework, chat model vs. coding agent, CI pipeline context
- **Output format**: checklist, step-by-step guide, code, diff/patch, table

## Shipped

- `code-review-assistant` — general code review / review-critique / intermediate.

## Backlog — ideas ready to draft

1. **API Design Reviewer** — backend / review-critique / senior — reviews a REST/GraphQL contract for consistency and versioning, not implementation.
2. **Bug Reproduction Narrower** — backend / debug-troubleshoot / junior — turns a vague bug report into a minimal repro plan.
3. **Database Migration Safety Checker** — databases / review-critique / senior — audits a migration script for locking/downtime risk.
4. **Legacy Code Onboarding Explainer** — general / explain-teach / junior — explains an unfamiliar module to someone new to it.
5. **Test Coverage Gap Finder** — testing / review-critique / intermediate — finds untested branches/edge cases given code + existing tests.
6. **Refactor Extraction Planner** — general / optimize-refactor / intermediate — step-by-step plan to extract a god-function without behavior change.
7. **Mobile Performance Profiler Interpreter** — mobile / debug-troubleshoot / intermediate — interprets a perf trace and prioritizes fixes.
8. **Infra-as-Code Drift Detector** — DevOps / review-critique / senior — flags drift between IaC and described actual infra.
9. **Algorithm Complexity Explainer** — algorithms / explain-teach / beginner — plain-language time/space complexity walkthrough.
10. **Security Threat Modeling Kickoff** — security / plan / senior — first-pass STRIDE-style threat model from a feature description.
11. **README Generator from Codebase Scan** — documentation / document / junior — drafts a README from actual project structure.
12. **Cross-Language Migration Mapper** — migration / plan / senior — maps idioms from a source to a target language for porting.
