# PromptAtlas

An open-source library of prompts, patterns, and techniques for modern AI models — bilingual, English and Ukrainian, and nothing but a git repository. No website, no app: browse it directly on GitHub, `git clone` it, or grab a raw file straight into your AI tool of choice.

**Stats:** 132 prompts · 13 categories, each targeting 500 distinct prompts · 2 languages (EN / UK). See [`docs/roadmap.md`](docs/roadmap.md) for live per-category progress. Coding & Development — 129/500.

## Categories

See [`docs/taxonomy.md`](docs/taxonomy.md) for definitions and [`docs/roadmap.md`](docs/roadmap.md) for progress toward each category's 500-prompt target.

| Category | Slug |
|---|---|
| Coding & Development | `coding` |
| Writing & Content | `writing-and-content` |
| Marketing & Sales | `marketing-and-sales` |
| Business & Strategy | `business-and-strategy` |
| Education & Learning | `education-and-learning` |
| Productivity & Personal | `productivity-and-personal` |
| Data & Analysis | `data-and-analysis` |
| Research & Academic | `research-and-academic` |
| Creative & Visual | `creative-and-visual` |
| Voice & Audio | `voice-and-audio` |
| Agents & Automation | `agents-and-automation` |
| Career & HR | `career-and-hr` |
| Social Media | `social-media` |

Category folders appear under both `en/<slug>/` and `uk/<slug>/` once they hold real content.

## Recently added

- 12 more `coding` prompts (en/uk) — replica-lag read routing, mobile release rollback, component-library breaking changes, CI cost/duration auditing, job queue backlog diagnosis, pagination cursor design, secrets rotation readiness, bundle splitting, backup/restore drills, SDK pinning policy, monorepo build-graph bottlenecks, and retry-storm prevention.
- 12 more `coding` prompts (en/uk) — event schema evolution, review-turnaround diagnosis, load-test scenario design, feature deprecation planning, GraphQL resolver performance, serverless cold-start diagnosis, DB connection pool sizing, test-data seeding, cross-team API impact mapping, log volume cost auditing, error-boundary coverage, and synthetic monitoring design.
- 12 more `coding` prompts (en/uk) — local env bootstrap, idempotency key design, multi-tenant isolation review, A/B test instrumentation review, third-party API risk assessment, batch job retry auditing, release notes translation, junior review-feedback interpretation, webhook delivery reliability, i18n readiness, dependency upgrade impact, and stakeholder architecture briefings. See [`docs/coverage-matrix/coding.md`](docs/coverage-matrix/coding.md) for the full shipped list.
- 12 new `coding` prompts (en/uk) — API contract consistency, bug repro narrowing, migration lock-risk auditing, unfamiliar-module explaining, mobile perf trace interpretation, IaC drift detection, threat-modeling kickoff, cross-language idiom mapping, feature-flag rollout planning, rate-limiting design, tech-debt prioritization, and concurrency bug hunting.
- [Retry Storm / Thundering Herd Prevention Advisor](en/coding/retry-storm-prevention-advisor.md) ([UK](uk/coding/retry-storm-prevention-advisor.md)) — `coding`
- [GraphQL Resolver Performance Auditor](en/coding/graphql-resolver-performance-auditor.md) ([UK](uk/coding/graphql-resolver-performance-auditor.md)) — `coding`
- [Multi-Tenant Data Isolation Reviewer](en/coding/multi-tenant-isolation-reviewer.md) ([UK](uk/coding/multi-tenant-isolation-reviewer.md)) — `coding`
- [i18n Readiness Auditor](en/coding/i18n-readiness-auditor.md) ([UK](uk/coding/i18n-readiness-auditor.md)) — `coding`
- [Code Review Assistant](en/coding/code-review-assistant.md) ([UK](uk/coding/code-review-assistant.md)) — `coding`
- [Agent System Prompt Drafter](en/agents-and-automation/agent-system-prompt-drafter.md) ([UK](uk/agents-and-automation/agent-system-prompt-drafter.md)) — `agents-and-automation`
- [Tool / Function Schema Reviewer](en/agents-and-automation/tool-schema-reviewer.md) ([UK](uk/agents-and-automation/tool-schema-reviewer.md)) — `agents-and-automation`
- [Guardrail Prompt Hardener](en/agents-and-automation/guardrail-prompt-hardener.md) ([UK](uk/agents-and-automation/guardrail-prompt-hardener.md)) — `agents-and-automation`

Have an idea? Check the [roadmap](docs/roadmap.md) and each category's coverage matrix, or [request a prompt](.github/ISSUE_TEMPLATE/request-a-prompt.md).

## How to use these prompts

1. Open the prompt file for your language (`en/...` or `uk/...`).
2. Copy the text under `## The Prompt`.
3. Fill in the `{{PLACEHOLDER}}` variables listed under `## Variables`.
4. Paste the filled-in prompt into your AI tool of choice.

## Contributing

Contributions are welcome — new prompts, translations, and fixes to existing ones. See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the prompt template, quality rubric, and PR process.

## License

[MIT](LICENSE)

---

# PromptAtlas (Українська)

Відкрита бібліотека промптів, патернів і технік для сучасних AI-моделей — двомовна, англійська та українська, і не більше ніж git-репозиторій. Жодного сайту, жодного застосунку: переглядайте прямо на GitHub, робіть `git clone` або беріть raw-файл напряму у свій AI-інструмент.

**Статистика:** 132 промпти · 13 категорій, кожна з ціллю 500 унікальних промптів · 2 мови (EN / UK). Актуальний прогрес по категоріях — у [`docs/roadmap.md`](docs/roadmap.md). Кодинг та розробка — 129/500.

## Категорії

Визначення категорій — у [`docs/taxonomy.md`](docs/taxonomy.md), прогрес до цілі 500 промптів на категорію — у [`docs/roadmap.md`](docs/roadmap.md).

| Категорія | Slug |
|---|---|
| Кодинг та розробка | `coding` |
| Письмо та контент | `writing-and-content` |
| Маркетинг та продажі | `marketing-and-sales` |
| Бізнес та стратегія | `business-and-strategy` |
| Освіта та навчання | `education-and-learning` |
| Продуктивність та особисте | `productivity-and-personal` |
| Дані та аналіз | `data-and-analysis` |
| Дослідження та академічна робота | `research-and-academic` |
| Креатив та візуал | `creative-and-visual` |
| Голос та аудіо | `voice-and-audio` |
| Агенти та автоматизація | `agents-and-automation` |
| Кар'єра та HR | `career-and-hr` |
| Соціальні мережі | `social-media` |

Папка категорії з'являється і в `en/<slug>/`, і в `uk/<slug>/`, щойно в ній є реальний контент.

## Нещодавно додано

- Ще 12 промптів `coding` (en/uk) — маршрутизація читання з урахуванням лагу реплік, відкат релізу мобільного застосунку, breaking changes бібліотеки компонентів, аудит вартості/тривалості CI, діагностика беклогу черги задач, дизайн курсора пагінації, готовність до ротації секретів, розбиття бандла, навчання backup/restore, політика пінінгу SDK, вузькі місця графа збірки монорепо та запобігання штормам повторів.
- Ще 12 промптів `coding` (en/uk) — еволюція схеми подій, діагностика швидкості рев'ю, дизайн навантажувальних тестів, планування депрекейшену фіч, продуктивність GraphQL-резолверів, діагностика холодного старту serverless, підбір пулу з'єднань БД, сідінг тестових даних, мапування впливу на споживачів API, аудит вартості логів, покриття error boundary та дизайн синтетичного моніторингу.
- Ще 12 промптів `coding` (en/uk) — бутстрап локального середовища, дизайн ключів ідемпотентності, рев'ю ізоляції multi-tenant, рев'ю інструментації A/B-тестів, оцінка ризику сторонніх API, аудит повторів batch-джоб, переклад реліз-нотаток, тлумачення фідбеку рев'ю для джунів, надійність доставки вебхуків, готовність до i18n, оцінка впливу оновлення залежностей та брифінги архітектурних рішень для стейкхолдерів. Повний список — у [`docs/coverage-matrix/coding.md`](docs/coverage-matrix/coding.md).
- 12 нових промптів `coding` (en/uk) — узгодженість API-контракту, звуження баг-репортів, аудит ризику блокувань при міграціях, пояснення незнайомих модулів, інтерпретація мобільних перф-трейсів, виявлення дрейфу IaC, старт моделювання загроз, зіставлення ідіом між мовами, планування рол-ауту через feature flag, дизайн rate limiting, пріоритизація техборгу та полювання на баги конкурентності.
- [Запобігання штормам повторів / thundering herd](uk/coding/retry-storm-prevention-advisor.md) ([EN](en/coding/retry-storm-prevention-advisor.md)) — `coding`
- [Аудит продуктивності GraphQL-резолверів](uk/coding/graphql-resolver-performance-auditor.md) ([EN](en/coding/graphql-resolver-performance-auditor.md)) — `coding`
- [Рев'ю ізоляції даних у multi-tenant застосунку](uk/coding/multi-tenant-isolation-reviewer.md) ([EN](en/coding/multi-tenant-isolation-reviewer.md)) — `coding`
- [Аудит готовності до інтернаціоналізації](uk/coding/i18n-readiness-auditor.md) ([EN](en/coding/i18n-readiness-auditor.md)) — `coding`
- [Асистент код-рев'ю](uk/coding/code-review-assistant.md) ([EN](en/coding/code-review-assistant.md)) — `coding`
- [Асистент для написання системних промптів агентів](uk/agents-and-automation/agent-system-prompt-drafter.md) ([EN](en/agents-and-automation/agent-system-prompt-drafter.md)) — `agents-and-automation`
- [Рев'ювер схем інструментів / функцій](uk/agents-and-automation/tool-schema-reviewer.md) ([EN](en/agents-and-automation/tool-schema-reviewer.md)) — `agents-and-automation`
- [Зміцнення guardrails у системному промпті](uk/agents-and-automation/guardrail-prompt-hardener.md) ([EN](en/agents-and-automation/guardrail-prompt-hardener.md)) — `agents-and-automation`

Є ідея? Перегляньте [roadmap](docs/roadmap.md) та матрицю покриття потрібної категорії, або [запросіть промпт](.github/ISSUE_TEMPLATE/request-a-prompt.md).

## Як користуватися промптами

1. Відкрийте файл промпту своєю мовою (`en/...` або `uk/...`).
2. Скопіюйте текст під заголовком `## The Prompt`.
3. Заповніть змінні `{{PLACEHOLDER}}`, перелічені під `## Variables`.
4. Вставте заповнений промпт у свій AI-інструмент.

## Як долучитися

Внески вітаються — нові промпти, переклади, виправлення наявних. Дивіться [`CONTRIBUTING.md`](CONTRIBUTING.md) щодо шаблону промпту, рубрики якості та процесу PR.

## Ліцензія

[MIT](LICENSE)
