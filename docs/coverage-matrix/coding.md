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
- `review-feedback-interpreter-for-juniors` — code review / explain-teach / junior — explains the underlying principle behind review comments the recipient got, for learning rather than compliance.
- `review-turnaround-bottleneck-diagnostician` — code review / debug-troubleshoot / manager — diagnoses why a team's review cycle is slow from a process description, not a PR's content.

### Debugging & Troubleshooting
- `stack-trace-interpreter` — general / debug-troubleshoot / beginner — explains a stack trace/error message and suggests the root cause.
- `works-on-my-machine-diagnostic` — DevOps/infra / debug-troubleshoot / intermediate — systematic checklist to diagnose environment-specific bugs.
- `flaky-test-investigator` — testing / debug-troubleshoot / advanced — hypothesizes causes of an intermittently failing test.
- `rubber-duck-debugging-partner` — general / debug-troubleshoot / beginner — Socratic-questions the user toward their own bug instead of giving the answer.
- `incident-root-cause-analyzer` — DevOps/infra / debug-troubleshoot / advanced — given logs/symptoms, ranks root-cause hypotheses by likelihood.
- `bug-repro-narrower` — general / debug-troubleshoot / junior — turns a vague bug report into a minimal, executable reproduction plan.
- `concurrency-bug-hunter` — general / debug-troubleshoot / advanced — hypothesizes race condition/deadlock/data race sources from code and symptoms.
- `third-party-api-risk-assessor` — backend / review-critique / intermediate — assesses timeout/retry/fallback resilience of code calling an external API against its stated criticality.

### Testing & QA
- `unit-test-generator` — testing / draft-generate / intermediate — generates unit tests, including edge cases, from a function signature.
- `test-coverage-gap-finder` — testing / review-critique / intermediate — given code + existing tests, lists untested branches/edge cases.
- `test-fixture-generator` — testing / draft-generate / beginner — generates realistic mock/fixture data for a given schema.
- `integration-test-scenario-planner` — testing / plan / advanced — designs end-to-end test scenarios from a feature spec.
- `regression-test-prioritizer` — testing / plan / advanced — ranks which existing tests to run first given limited QA time and a diff.
- `load-test-scenario-designer` — testing / plan / advanced — designs load-test traffic scenarios/scripts to run, distinct from interpreting results afterward.
- `test-data-seeder-designer` — testing / draft-generate / beginner — designs a large-volume, referentially-consistent seed script for a whole local/demo environment.
- `ab-test-instrumentation-reviewer` — testing / review-critique / intermediate — checks experiment assignment/tracking code for sample-ratio-mismatch and event-firing bugs before launch.
- `backup-restore-drill-planner` — databases / plan / advanced — plans a concrete backup-restore drill with real validation checks, not just a green backup job.

### Refactoring & Legacy Modernization
- `function-extraction-simplifier` — general / optimize-refactor / intermediate — refactors a long function into smaller, well-named ones.
- `legacy-code-modernizer` — migration / optimize-refactor / advanced — migrates a code pattern to a modern language/framework idiom.
- `dead-code-finder` — general / review-critique / intermediate — identifies likely-dead code paths and unused dependencies from context.
- `naming-convention-auditor` — general / review-critique / beginner — flags unclear/inconsistent names and proposes better ones.
- `monolith-decomposition-planner` — backend / plan / advanced — proposes how to split a large file/module into cohesive smaller ones.
- `cross-language-idiom-mapper` — migration / plan / advanced — maps idioms/patterns from a source to a target language before a port begins.
- `dependency-upgrade-impact-assessor` — migration / plan / intermediate — assesses major-version breaking-change impact against actual dependency usage and proposes an upgrade sequence.
- `feature-deprecation-sunset-planner` — general / plan / intermediate — plans a staged deprecation with consumer migration and a hard-cutoff date, distinct from rollback or modernization.
- `sdk-version-pinning-advisor` — general / plan / beginner — recommends an ongoing dependency version-pinning/update policy, distinct from a single upgrade or CVE assessment.

### Architecture & System Design
- `adr-drafter` — general / document / intermediate — turns a decision discussion into a formal Architecture Decision Record.
- `microservice-boundary-advisor` — backend / plan / advanced — proposes service boundaries given a monolith description.
- `tech-stack-comparator` — general / plan / intermediate — compares 2–3 technology options against stated constraints.
- `scalability-bottleneck-predictor` — backend / review-critique / advanced — predicts where a given architecture breaks first under a growth projection.
- `system-design-walkthrough-coach` — backend / explain-teach / advanced — walks through designing a system with follow-up questions.
- `architecture-decision-stakeholder-briefing` — general / explain-teach / non-technical stakeholder — translates a technical architecture decision into cost/timeline/risk language for an exec or PM.

### API & Backend Design
- `rest-endpoint-designer` — backend / draft-generate / intermediate — designs REST endpoints (incl. status codes) from a feature description.
- `api-versioning-advisor` — backend / plan / beginner — recommends an API versioning strategy for a given constraint set.
- `graphql-schema-reviewer` — backend / review-critique / advanced — critiques a GraphQL schema for N+1 risk and over-fetching.
- `api-error-handling-auditor` — backend / review-critique / advanced — audits an API's idempotency and error-handling behavior.
- `openapi-doc-generator` — documentation / document / intermediate — drafts OpenAPI/Swagger documentation from existing endpoint code.
- `api-contract-consistency-reviewer` — backend / review-critique / senior — reviews multiple endpoints for naming/pagination/error/versioning consistency, not per-endpoint correctness.
- `rate-limiting-strategy-designer` — backend / plan / intermediate — designs a rate-limiting algorithm/limits for an endpoint given traffic pattern and abuse concerns.
- `idempotency-key-design-advisor` — backend / plan / intermediate — designs an idempotency key strategy for a new write endpoint before it's built.
- `webhook-delivery-reliability-reviewer` — backend / review-critique / advanced — reviews outbound webhook retry/backoff/signing/ordering guarantees.
- `event-schema-evolution-advisor` — backend / plan / advanced — plans backward-compatible changes to an event/message schema consumed by multiple services.
- `graphql-resolver-performance-auditor` — backend / review-critique / advanced — audits resolver implementation code for N+1 execution and batching correctness, distinct from schema-shape review.
- `api-consumer-impact-mapper` — backend / plan / senior — maps which internal consumers a breaking API change would actually affect before it ships.
- `pagination-cursor-design-advisor` — backend / plan / beginner — designs a cursor's actual encoding/tie-breaking/stability mechanics, distinct from cross-endpoint pagination-style consistency.
- `job-queue-backlog-diagnostician` — backend / debug-troubleshoot / intermediate — distinguishes throughput mismatch, poison messages, and stalled consumers as causes of a growing queue backlog.
- `retry-storm-prevention-advisor` — backend / plan / advanced — designs backoff/jitter to prevent many clients synchronizing retries into a thundering herd.
- `idempotent-webhook-consumer-reviewer` — backend / review-critique / intermediate — reviews the receiving side of a webhook integration for dedupe/ordering handling, the consumer-side counterpart to `webhook-delivery-reliability-reviewer`'s sender-side focus.
- `api-response-compression-strategy-advisor` — backend / plan / beginner — advises on compression (gzip/brotli) tradeoffs for a specific API's payload characteristics.
- `graphql-query-cost-estimation-designer` — backend / plan / advanced — designs a query-cost-scoring scheme to reject expensive queries before execution, distinct from `graphql-resolver-performance-auditor`'s post-hoc resolver review.

### Database & SQL
- `sql-query-optimizer` — databases / optimize-refactor / advanced — given a slow query + schema, proposes an optimized version and indexes.
- `schema-designer-from-requirements` — databases / draft-generate / intermediate — designs a database schema from a plain-language feature description.
- `safe-migration-script-writer` — databases / draft-generate / intermediate — writes a safe, reversible database migration script.
- `n-plus-one-detector` — databases / debug-troubleshoot / advanced — spots N+1 query patterns in ORM code.
- `normalization-advisor` — databases / plan / beginner — recommends a normalization level for a given data model.
- `migration-lock-risk-auditor` — databases / review-critique / advanced — audits an existing migration script for locking/downtime risk on a live database.
- `multi-tenant-isolation-reviewer` — databases / review-critique / senior — audits schema/query code for cross-tenant data leakage risk.
- `db-connection-pool-sizing-advisor` — databases / plan / intermediate — recommends connection pool size/timeouts given app concurrency and DB connection limits.
- `db-read-replica-lag-advisor` — databases / plan / advanced — classifies which reads are safe against replica lag vs. need read-your-writes routing to primary.
- `database-index-bloat-auditor` — databases / review-critique / intermediate — identifies unused or redundant indexes adding write overhead without read benefit.

### Frontend & UI Engineering
- `accessibility-auditor` — frontend / review-critique / intermediate — audits a UI component for accessibility (a11y) issues.
- `responsive-layout-debugger` — frontend / debug-troubleshoot / beginner — diagnoses why a layout breaks at certain screen sizes.
- `state-management-advisor` — frontend / plan / intermediate — recommends/refactors a state-management approach for a given app shape.
- `css-specificity-untangler` — frontend / debug-troubleshoot / beginner — diagnoses and fixes CSS specificity/cascade bugs.
- `frontend-performance-auditor` — frontend / review-critique / advanced — audits Core Web Vitals bottlenecks from a page description/profile.
- `i18n-readiness-auditor` — frontend / review-critique / intermediate — audits code for hardcoded strings, formatting, pluralization, and RTL/expansion layout risk.
- `error-boundary-coverage-reviewer` — frontend / review-critique / intermediate — audits a frontend app for gaps in error-boundary/fallback-UI coverage.
- `component-library-breaking-change-reviewer` — frontend / review-critique / advanced — assesses a shared component library change's blast radius across consuming teams, including visual-only breaking changes.
- `bundle-splitting-advisor` — frontend / plan / intermediate — recommends code-splitting/dynamic-import boundaries for an app's route/feature structure.
- `client-side-form-state-persistence-advisor` — frontend / plan / beginner — advises on saving in-progress form state against accidental navigation/refresh loss.

### Mobile Development
- `cross-platform-vs-native-advisor` — mobile / plan / intermediate — recommends cross-platform vs. native given project constraints.
- `mobile-crash-log-interpreter` — mobile / debug-troubleshoot / intermediate — interprets a mobile crash log and suggests likely causes.
- `app-store-rejection-fixer` — mobile / debug-troubleshoot / beginner — given a store rejection reason, proposes the specific code/config fix.
- `mobile-battery-drain-diagnostic` — mobile / debug-troubleshoot / advanced — diagnoses likely causes of excessive battery/CPU drain.
- `offline-first-sync-designer` — mobile / plan / advanced — designs an offline-first data sync strategy for a mobile app.
- `mobile-release-rollback-planner` — mobile / plan / intermediate — plans response to a bad staged-rollout app release, accounting for store-specific rollback mechanics distinct from server-side deploys.
- `mobile-perf-trace-interpreter` — mobile / debug-troubleshoot / intermediate — interprets a profiler trace (frame timings, CPU/GPU) and prioritizes fixes.
- `mobile-deep-link-routing-validator` — mobile / review-critique / intermediate — audits deep-link/universal-link routes for coverage gaps and unsafe param handling.
- `mobile-offline-conflict-resolution-ux-advisor` — mobile / plan / advanced — designs the user-facing conflict-resolution experience for `offline-first-sync-designer`'s sync strategy, a UX-layer counterpart to that prompt's data-layer focus.

### DevOps, CI/CD & Cloud Infrastructure
- `ci-pipeline-debugger` — DevOps/infra / debug-troubleshoot / intermediate — diagnoses a failing CI pipeline from its log output.
- `dockerfile-optimizer` — DevOps/infra / optimize-refactor / intermediate — reduces a Dockerfile's image size and build time.
- `k8s-manifest-reviewer` — DevOps/infra / review-critique / advanced — reviews a Kubernetes manifest for common misconfigurations.
- `terraform-reviewer` — DevOps/infra / review-critique / advanced — reviews Terraform/IaC code for risk and best-practice violations.
- `deployment-rollback-planner` — DevOps/infra / plan / intermediate — generates a rollback plan for a specific deployment change.
- `iac-drift-detector` — DevOps/infra / review-critique / advanced — flags drift between IaC and a described actual infrastructure state.
- `local-env-bootstrap-generator` — DevOps/infra / draft-generate / beginner — generates runnable local-environment setup scripts and `.env.example`, not a narrative guide.
- `batch-job-retry-auditor` — DevOps/infra / review-critique / advanced — audits a scheduled/batch job for safe-rerun and overlap-protection behavior.
- `serverless-cold-start-diagnostician` — DevOps/infra / debug-troubleshoot / intermediate — diagnoses causes of excessive cold-start latency in a serverless function.
- `log-volume-cost-auditor` — DevOps/infra / review-critique / intermediate — audits logging statements for excessive volume/cardinality driving up observability cost.
- `synthetic-monitoring-scenario-designer` — DevOps/infra / plan / intermediate — designs proactive synthetic-check scenarios for a critical user flow.
- `ci-pipeline-cost-duration-auditor` — DevOps/infra / optimize-refactor / intermediate — audits a CI config for redundant/uncached/unconditional steps driving up cost and duration, distinct from failure debugging.
- `monorepo-build-graph-bottleneck-finder` — DevOps/infra / debug-troubleshoot / advanced — identifies package-graph structural bottlenecks (broad fan-out, misconfigured affected-detection) slowing a monorepo's CI.
- `secrets-rotation-readiness-auditor` — security / review-critique / advanced — audits whether a service can rotate a credential live without downtime.
- `terraform-state-file-drift-recovery-planner` — DevOps/infra / plan / advanced — plans safely reconciling a corrupted/out-of-sync Terraform state file, distinct from `iac-drift-detector`'s code-vs-reality drift focus.
- `scheduled-job-timezone-correctness-auditor` — DevOps/infra / review-critique / beginner — audits cron/scheduled-job configs for DST and timezone-handling bugs.
- `multi-region-deployment-consistency-reviewer` — DevOps/infra / review-critique / advanced — reviews a multi-region deployment for config/data consistency gaps between regions.

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
- `feature-flag-sprawl-auditor` — DevOps/infra / review-critique / advanced — flags stale/fully-rolled-out flags safe to delete, focused on code-level dead-flag detection specifically (grep-able flag checks with no remaining variance) rather than overlapping `tech-debt-prioritization-matrix`'s general ranking or `feature-flag-rollout-planner`'s rollout-stage scope.

### Experimentation & Stakeholder Communication
- `ab-test-instrumentation-reviewer` — testing / review-critique / intermediate — checks experiment assignment/tracking code for sample-ratio-mismatch and event-firing bugs before launch.
- `release-notes-translator` — documentation / document / beginner — turns a technical changelog into plain-language release notes for a non-technical audience.
- `feature-experiment-sample-size-sanity-checker` — testing / review-critique / beginner — checks whether a planned A/B test's traffic and duration can realistically reach statistical significance, a plan-stage counterpart to `ab-test-instrumentation-reviewer`'s code-level focus.

## Backlog — ideas ready to draft

_Drawn down to 0 this session — refill from the coverage matrix above (§6.1) before the next coding batch, per `CURATOR_PROMPT.md` §6.3's ~20-entry refill threshold._
