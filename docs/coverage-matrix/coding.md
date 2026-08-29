# Coverage Matrix: Coding & Development

Dimensions crossed to source distinct prompt ideas (`CURATOR_PROMPT.md` §6.1). Not every cell is used — only ones representing a genuinely different job.

- **Sub-domain**: frontend, backend, databases, DevOps/infra, mobile, security, testing, algorithms/data structures, code review, documentation, migration, performance
- **Persona**: beginner, junior, senior/expert, engineering manager, non-technical stakeholder
- **JTBD stage**: plan → draft/generate → review/critique → debug/troubleshoot → optimize/refactor → explain/teach → document
- **Tool/context**: specific language/framework, chat model vs. coding agent, CI pipeline context
- **Output format**: checklist, step-by-step guide, code, diff/patch, table

## Shipped

- `code-review-assistant` — general code review / review-critique / intermediate.

### Code Review & Quality
- `pr-review-assistant` — code review / review-critique / intermediate — general-purpose PR review against best practices given a diff.
- `security-code-review-checklist` — security / review-critique / advanced — reviews a code snippet specifically for security vulnerabilities.
- `code-smell-detector` — code review / review-critique / intermediate — identifies anti-patterns and code smells in a given file.
- `constructive-review-comment-rewriter` — code review / draft-generate / beginner — turns blunt review comments into constructive, actionable ones.
- `pre-merge-risk-assessment` — code review / review-critique / advanced — assesses the blast radius/risk level of a diff before merging.

### Debugging & Troubleshooting
- `stack-trace-interpreter` — general / debug-troubleshoot / beginner — explains a stack trace/error message and suggests the root cause.
- `works-on-my-machine-diagnostic` — DevOps/infra / debug-troubleshoot / intermediate — systematic checklist to diagnose environment-specific bugs.
- `flaky-test-investigator` — testing / debug-troubleshoot / advanced — hypothesizes causes of an intermittently failing test.
- `rubber-duck-debugging-partner` — general / debug-troubleshoot / beginner — Socratic-questions the user toward their own bug instead of giving the answer.
- `incident-root-cause-analyzer` — DevOps/infra / debug-troubleshoot / advanced — given logs/symptoms, ranks root-cause hypotheses by likelihood.
- `bug-repro-narrower` — general / debug-troubleshoot / junior — turns a vague bug report into a minimal, executable reproduction plan.
- `concurrency-bug-hunter` — general / debug-troubleshoot / advanced — hypothesizes race condition/deadlock/data race sources from code and symptoms.

### Testing & QA
- `unit-test-generator` — testing / draft-generate / intermediate — generates unit tests, including edge cases, from a function signature.
- `test-coverage-gap-finder` — testing / review-critique / intermediate — given code + existing tests, lists untested branches/edge cases.
- `test-fixture-generator` — testing / draft-generate / beginner — generates realistic mock/fixture data for a given schema.
- `integration-test-scenario-planner` — testing / plan / advanced — designs end-to-end test scenarios from a feature spec.
- `regression-test-prioritizer` — testing / plan / advanced — ranks which existing tests to run first given limited QA time and a diff.

### Refactoring & Legacy Modernization
- `function-extraction-simplifier` — general / optimize-refactor / intermediate — refactors a long function into smaller, well-named ones.
- `legacy-code-modernizer` — migration / optimize-refactor / advanced — migrates a code pattern to a modern language/framework idiom.
- `dead-code-finder` — general / review-critique / intermediate — identifies likely-dead code paths and unused dependencies from context.
- `naming-convention-auditor` — general / review-critique / beginner — flags unclear/inconsistent names and proposes better ones.
- `monolith-decomposition-planner` — backend / plan / advanced — proposes how to split a large file/module into cohesive smaller ones.
- `cross-language-idiom-mapper` — migration / plan / advanced — maps idioms/patterns from a source to a target language before a port begins.

### Architecture & System Design
- `adr-drafter` — general / document / intermediate — turns a decision discussion into a formal Architecture Decision Record.
- `microservice-boundary-advisor` — backend / plan / advanced — proposes service boundaries given a monolith description.
- `tech-stack-comparator` — general / plan / intermediate — compares 2–3 technology options against stated constraints.
- `scalability-bottleneck-predictor` — backend / review-critique / advanced — predicts where a given architecture breaks first under a growth projection.
- `system-design-walkthrough-coach` — backend / explain-teach / advanced — walks through designing a system with follow-up questions.

### API & Backend Design
- `rest-endpoint-designer` — backend / draft-generate / intermediate — designs REST endpoints (incl. status codes) from a feature description.
- `api-versioning-advisor` — backend / plan / beginner — recommends an API versioning strategy for a given constraint set.
- `graphql-schema-reviewer` — backend / review-critique / advanced — critiques a GraphQL schema for N+1 risk and over-fetching.
- `api-error-handling-auditor` — backend / review-critique / advanced — audits an API's idempotency and error-handling behavior.
- `openapi-doc-generator` — documentation / document / intermediate — drafts OpenAPI/Swagger documentation from existing endpoint code.
- `api-contract-consistency-reviewer` — backend / review-critique / senior — reviews multiple endpoints for naming/pagination/error/versioning consistency, not per-endpoint correctness.
- `rate-limiting-strategy-designer` — backend / plan / intermediate — designs a rate-limiting algorithm/limits for an endpoint given traffic pattern and abuse concerns.

### Database & SQL
- `sql-query-optimizer` — databases / optimize-refactor / advanced — given a slow query + schema, proposes an optimized version and indexes.
- `schema-designer-from-requirements` — databases / draft-generate / intermediate — designs a database schema from a plain-language feature description.
- `safe-migration-script-writer` — databases / draft-generate / intermediate — writes a safe, reversible database migration script.
- `n-plus-one-detector` — databases / debug-troubleshoot / advanced — spots N+1 query patterns in ORM code.
- `normalization-advisor` — databases / plan / beginner — recommends a normalization level for a given data model.
- `migration-lock-risk-auditor` — databases / review-critique / advanced — audits an existing migration script for locking/downtime risk on a live database.

### Frontend & UI Engineering
- `accessibility-auditor` — frontend / review-critique / intermediate — audits a UI component for accessibility (a11y) issues.
- `responsive-layout-debugger` — frontend / debug-troubleshoot / beginner — diagnoses why a layout breaks at certain screen sizes.
- `state-management-advisor` — frontend / plan / intermediate — recommends/refactors a state-management approach for a given app shape.
- `css-specificity-untangler` — frontend / debug-troubleshoot / beginner — diagnoses and fixes CSS specificity/cascade bugs.
- `frontend-performance-auditor` — frontend / review-critique / advanced — audits Core Web Vitals bottlenecks from a page description/profile.

### Mobile Development
- `cross-platform-vs-native-advisor` — mobile / plan / intermediate — recommends cross-platform vs. native given project constraints.
- `mobile-crash-log-interpreter` — mobile / debug-troubleshoot / intermediate — interprets a mobile crash log and suggests likely causes.
- `app-store-rejection-fixer` — mobile / debug-troubleshoot / beginner — given a store rejection reason, proposes the specific code/config fix.
- `mobile-battery-drain-diagnostic` — mobile / debug-troubleshoot / advanced — diagnoses likely causes of excessive battery/CPU drain.
- `offline-first-sync-designer` — mobile / plan / advanced — designs an offline-first data sync strategy for a mobile app.
- `mobile-perf-trace-interpreter` — mobile / debug-troubleshoot / intermediate — interprets a profiler trace (frame timings, CPU/GPU) and prioritizes fixes.

### DevOps, CI/CD & Cloud Infrastructure
- `ci-pipeline-debugger` — DevOps/infra / debug-troubleshoot / intermediate — diagnoses a failing CI pipeline from its log output.
- `dockerfile-optimizer` — DevOps/infra / optimize-refactor / intermediate — reduces a Dockerfile's image size and build time.
- `k8s-manifest-reviewer` — DevOps/infra / review-critique / advanced — reviews a Kubernetes manifest for common misconfigurations.
- `terraform-reviewer` — DevOps/infra / review-critique / advanced — reviews Terraform/IaC code for risk and best-practice violations.
- `deployment-rollback-planner` — DevOps/infra / plan / intermediate — generates a rollback plan for a specific deployment change.
- `iac-drift-detector` — DevOps/infra / review-critique / advanced — flags drift between IaC and a described actual infrastructure state.

### Security (AppSec)
- `injection-vulnerability-scanner` — security / review-critique / advanced — scans a code snippet for injection/input-validation vulnerabilities.
- `secrets-leak-detector` — security / review-critique / intermediate — spots likely hardcoded secrets/credentials in code context.
- `auth-flow-reviewer` — security / review-critique / advanced — reviews an authentication/authorization flow for weaknesses.
- `dependency-cve-triage` — security / review-critique / intermediate — triages the real-world risk of a CVE given how a dependency is actually used.
- `secure-coding-checklist-generator` — security / document / beginner — generates a secure-coding checklist for a given language/framework.
- `threat-model-kickoff` — security / plan / advanced — first-pass STRIDE-style threat model from a feature description, before code is written.

### Performance Optimization
- `big-o-complexity-analyzer` — algorithms / review-critique / intermediate — analyzes the time/space complexity of a given function.
- `memory-leak-hunter` — performance / debug-troubleshoot / advanced — hypothesizes the source of a memory leak from profiler symptoms.
- `caching-strategy-advisor` — performance / plan / intermediate — recommends a caching strategy for a given access pattern.
- `load-test-result-interpreter` — performance / review-critique / advanced — interprets load-test results and flags likely bottlenecks.
- `hot-path-profiling-guide` — performance / plan / advanced — generates a profiling plan for a specific slow endpoint.

### Git & Team Collaboration
- `conventional-commit-writer` — general / document / beginner — writes a conventional-commit-style message from a diff.
- `merge-conflict-resolver-guide` — general / debug-troubleshoot / intermediate — walks through resolving a specific merge conflict safely.
- `branching-strategy-advisor` — general / plan / beginner — recommends Git Flow vs. trunk-based given team size/release cadence.
- `pr-description-generator` — general / document / beginner — generates a clear PR description from a diff and a ticket.
- `git-history-archaeologist` — general / explain-teach / intermediate — explains why a line of code likely exists, given blame/log context.

### Documentation & Onboarding
- `readme-generator` — documentation / document / beginner — generates a project README from a codebase description.
- `code-comment-improver` — documentation / optimize-refactor / beginner — turns sparse or missing comments into genuinely helpful ones.
- `new-hire-onboarding-guide` — documentation / document / intermediate — generates an onboarding guide for a specific repository.
- `oncall-runbook-writer` — documentation / document / intermediate — writes an on-call runbook for a specific service.
- `diagram-spec-generator` — documentation / document / intermediate — turns an architecture description into a Mermaid/diagram-as-code spec.
- `unfamiliar-module-explainer` — general / explain-teach / junior — explains one unfamiliar file/module's structure and non-obvious decisions to a newcomer.

### AI-Assisted / Agentic Coding Workflows
- `ai-coding-prompt-writer` — general / draft-generate / intermediate (tool/context: coding agent) — helps a developer write better prompts for their AI coding agent.
- `ai-code-output-reviewer` — general / review-critique / advanced (tool/context: coding agent) — vets AI-generated code specifically for hallucinated APIs and subtle bugs.
- `agent-task-splitter` — general / plan / advanced (tool/context: multi-agent) — breaks a feature into agent-sized subtasks for a multi-agent coding workflow.
- `ai-pairing-session-planner` — general / plan / beginner (tool/context: coding agent) — plans how to structure a pair-programming session with an AI for a given task.
- `spec-from-vague-request` — general / plan / intermediate — turns a vague feature request into a clear technical spec an AI agent can implement.

### Algorithms & Technical Interview Practice
- `interview-problem-generator` — algorithms / draft-generate / intermediate — generates a coding-interview practice problem with a grading rubric, by topic/difficulty.
- `data-structure-selector` — algorithms / plan / beginner — recommends which data structure/algorithm fits a described problem.
- `complexity-explainer` — algorithms / explain-teach / beginner — explains the time/space complexity of a given solution in plain language.
- `mock-interview-conductor` — algorithms / explain-teach / intermediate — conducts a Socratic mock technical interview with follow-up questions.
- `whiteboard-to-code-translator` — algorithms / draft-generate / beginner — turns a described algorithm into clean, working code in a target language.

### Feature Delivery & Release Safety
- `feature-flag-rollout-planner` — DevOps/infra / plan / intermediate — designs a staged flag-based rollout with kill-switch conditions for a risky change.
- `tech-debt-prioritization-matrix` — general / plan / advanced — turns a raw tech-debt list into an ROI-ranked, defensible paydown plan.

## Backlog — ideas ready to draft

1. **Local Dev Environment Bootstrap Generator** — DevOps/infra / draft-generate / beginner — generates setup scripts/config for a new dev's local environment from a stack description.
2. **Idempotency Key Design Advisor** — backend / plan / intermediate — designs an idempotency mechanism for a new write endpoint from scratch.
3. **Multi-Tenant Data Isolation Reviewer** — databases / review-critique / senior — audits a schema/query layer for cross-tenant data leakage risk.
4. **A/B Test Instrumentation Reviewer** — general / review-critique / intermediate — checks experiment instrumentation code for common statistical/tracking pitfalls.
5. **Event Schema Evolution Advisor** — backend / plan / advanced — plans backward-compatible changes to an event/message schema consumed by multiple services.
6. **Third-Party API Integration Risk Assessor** — backend / review-critique / intermediate — assesses resilience of code calling an external API (timeouts, retries, fallback behavior).
7. **Code Review Turnaround Bottleneck Diagnostician** — general / debug-troubleshoot / manager — diagnoses why a team's PR review cycle is slow from process description.
8. **Batch Job Idempotency & Retry Auditor** — DevOps/infra / review-critique / advanced — audits a scheduled/batch job for safe-to-retry and safe-to-rerun behavior.
