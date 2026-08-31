# Tags

The canonical tag vocabulary for PromptAtlas. `tags` is a structural frontmatter field — it stays identical (same English words) across a prompt's `en/` and `uk/` files, same as `id`, `category`, `target_models`, `difficulty`, `status`, and `version` (see `CLAUDE.md`).

**When you add a prompt with a genuinely new tag, add that tag to this file in the same PR that first uses it.** Before adding a new tag, check this list for a near-synonym already in use (e.g. `databases` not `database`, `migrations` not `migration` — plural form is the convention for tags describing a domain/subject area) and reuse it instead of forking the vocabulary. This is what stops silent tag drift like the `database`/`databases` split fixed in `CHANGELOG.md` (2026-08-30) from recurring once more than one person is contributing.

Grouped loosely by theme for scanability — a tag can reasonably apply across themes; the grouping is a navigation aid, not a taxonomy.

## Architecture & System Design
architecture, distributed-systems, event-driven, infrastructure-as-code, message-queues, messaging, microservices, modularity, monorepo, multi-tenancy, offline-first, serverless, state-management, system-design, technology-selection

## Backend & APIs
api, api-design, authentication, authorization, backend, graphql, openapi, pagination, rate-limiting, rest, routing, webhooks

## Databases & Data
data-modeling, data-sync, databases, disaster-recovery, migrations, normalization, orm, schema-design, schema-review, search, seed-data, sql

## Frontend & Mobile
a11y, accessibility, core-web-vitals, css, design-systems, frontend, mobile, responsive-design

## DevOps & Infrastructure
battery, ci, ci-cd, deployment, devops, docker, drift, environment, feature-flags, infrastructure, kubernetes, monitoring, observability, operations, release, release-management, rollback, rollout, terraform

## Security
abuse-prevention, authentication, authorization, compliance, guardrails, injection, input-validation, owasp, red-teaming, secrets, secrets-management, security, stride, supply-chain, threat-modeling, vulnerability-management

## Testing & QA
coverage, integration-testing, load-testing, qa, quality-assurance, regression, tdd, testing, unit-tests

## Code Quality & Review
anti-patterns, best-practices, clean-code, code-analysis, code-comments, code-review, code-smells, conventions, dead-code, legacy, maintenance, modernization, naming, quality, readability, refactoring, tech-debt

## Debugging, Incidents & Reliability
crash-analysis, debugging, error-handling, incident-response, race-conditions, reliability, resilience, root-cause-analysis, safety, triage, troubleshooting

## Performance & Scale
caching, capacity-planning, concurrency, cost-optimization, memory, multithreading, performance, profiling, scalability

## AI, Agents & Prompting
agent-design, ai-agents, automation, code-generation, multi-agent-workflows, prompt-engineering, rag, socratic, system-prompt, tool-use

## Documentation & Communication
diagrams, documentation, explain, readme

## Writing & Content
blog, brand-voice, content-creation, copywriting, editing, email, microcopy, sales-outreach, tone, ux-writing

## Marketing & Sales
ad-copy, case-studies, conversion, icp, landing-pages, marketing-strategy, objection-handling, paid-ads, personalization, positioning, sales, sales-enablement, seo

## Career & HR
career, career-pathing, coaching, compensation, exit-interview, hr, management, performance-review, resume

## Business & Strategy
business-model, competitive-analysis, due-diligence, fundraising, investor-relations, market-research, okr, org-design, pricing, risk-management, strategy

## Education & Learning
education, lesson-planning, quiz, study-techniques, tutoring

## Productivity & Personal
delegation, meeting-management, productivity, task-planning

## Data & Analysis
anomaly-detection, data-analysis, data-cleaning, data-visualization, eda, forecasting, statistics

## Research & Academic
abstract, academic-writing, literature-review, peer-review, research, research-design

## Creative & Visual
character-design, consistency, illustration, photography, product-design, product-mockups, style-transfer, ui-mockups

## Voice & Audio
audio, podcast, scriptwriting, sound-design, transcription, voiceover

## Social Media
content-adaptation, content-calendar, crisis-communication, pr, short-form-video, social-media

## Version Control & Process
blame, code-history, commit-messages, git, merge-conflicts, pull-request

## Planning, Process & Collaboration
communication, decision-making, decision-records, engineering-management, feedback, mentorship, onboarding, pair-programming, planning, prioritization, requirements, risk, stakeholder-management, task-planning, team-process, workflow

## Migration & Porting
deprecation, downtime, language-migration, migration, porting

## Algorithms, Learning & Interview
algorithms, code-comprehension, data-structures, interview-prep, learning, teaching

## Misc / Cross-cutting
analytics, app-store, assessment, batch-jobs, build-tooling, bug-reports, checklist, consistency, dependencies, developer-experience, developer-productivity, drafting, experimentation, fixtures, i18n, idempotency, integrations, localization, mock-data, specification, versioning
