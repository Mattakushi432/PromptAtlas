# PromptAtlas

[![Check bilingual parity](https://github.com/Mattakushi432/PromptAtlas/actions/workflows/check-parity.yml/badge.svg)](https://github.com/Mattakushi432/PromptAtlas/actions/workflows/check-parity.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Prompts](https://img.shields.io/badge/prompts-138-informational)](docs/roadmap.md)

An open-source library of prompts, patterns, and techniques for modern AI models — bilingual, English and Ukrainian, and nothing but a git repository. No website, no app: browse it directly on GitHub, `git clone` it, or grab a raw file straight into your AI tool of choice.

**Stats:** 138 prompts · 13 categories, each targeting 500 distinct prompts · 2 languages (EN / UK). See [`docs/roadmap.md`](docs/roadmap.md) for live per-category progress. Coding & Development — 129/500. Writing & Content — 6/500.

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

## Contributors wanted

11 of the 13 categories are still empty or nearly so — that's the fastest way to help right now. We've opened a batch of [`good-first-contribution`](https://github.com/Mattakushi432/PromptAtlas/issues?q=is%3Aissue+is%3Aopen+label%3Agood-first-contribution) issues, each a vetted backlog idea (pre-checked for distinctiveness) ready to draft in both languages. See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the template, the 8-dimension quality rubric, and the PR process.

## Recently added

- 6 prompts to launch the new `writing-and-content` category (en/uk) — outline-to-draft blog expansion, ruthless line editing, tone adaptation, cold email sequence drafting, non-native English polishing, and UX microcopy review.
- 12 more `coding` prompts (en/uk) — replica-lag read routing, mobile release rollback, component-library breaking changes, CI cost/duration auditing, job queue backlog diagnosis, pagination cursor design, secrets rotation readiness, bundle splitting, backup/restore drills, SDK pinning policy, monorepo build-graph bottlenecks, and retry-storm prevention.
- 12 more `coding` prompts (en/uk) — event schema evolution, review-turnaround diagnosis, load-test scenario design, feature deprecation planning, GraphQL resolver performance, serverless cold-start diagnosis, DB connection pool sizing, test-data seeding, cross-team API impact mapping, log volume cost auditing, error-boundary coverage, and synthetic monitoring design.
- 12 more `coding` prompts (en/uk) — local env bootstrap, idempotency key design, multi-tenant isolation review, A/B test instrumentation review, third-party API risk assessment, batch job retry auditing, release notes translation, junior review-feedback interpretation, webhook delivery reliability, i18n readiness, dependency upgrade impact, and stakeholder architecture briefings. See [`docs/coverage-matrix/coding.md`](docs/coverage-matrix/coding.md) for the full shipped list.

Full history lives in [`CHANGELOG.md`](CHANGELOG.md) — this section keeps only the most recent entries so it doesn't grow unbounded.

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

**Статистика:** 138 промптів · 13 категорій, кожна з ціллю 500 унікальних промптів · 2 мови (EN / UK). Актуальний прогрес по категоріях — у [`docs/roadmap.md`](docs/roadmap.md). Кодинг та розробка — 129/500. Письмо та контент — 6/500.

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

## Шукаємо контриб'юторів

11 із 13 категорій ще порожні або майже порожні — це найшвидший спосіб зараз допомогти. Ми відкрили пакет issue з міткою [`good-first-contribution`](https://github.com/Mattakushi432/PromptAtlas/issues?q=is%3Aissue+is%3Aopen+label%3Agood-first-contribution) — кожна це перевірена ідея з бэклогу (вже пройшла перевірку на дистинктивність), готова до написання двома мовами. Шаблон, 8-вимірна рубрика якості та процес PR — у [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Нещодавно додано

- 6 промптів для запуску нової категорії `writing-and-content` (en/uk) — розгортання плану в чернетку блогу, безжальне редагування рядків, адаптація тону, укладання послідовності холодних листів, шліфування англійської для не носіїв мови та рев'ю UX-мікротекстів.
- Ще 12 промптів `coding` (en/uk) — маршрутизація читання з урахуванням лагу реплік, відкат релізу мобільного застосунку, breaking changes бібліотеки компонентів, аудит вартості/тривалості CI, діагностика беклогу черги задач, дизайн курсора пагінації, готовність до ротації секретів, розбиття бандла, навчання backup/restore, політика пінінгу SDK, вузькі місця графа збірки монорепо та запобігання штормам повторів.
- Ще 12 промптів `coding` (en/uk) — еволюція схеми подій, діагностика швидкості рев'ю, дизайн навантажувальних тестів, планування депрекейшену фіч, продуктивність GraphQL-резолверів, діагностика холодного старту serverless, підбір пулу з'єднань БД, сідінг тестових даних, мапування впливу на споживачів API, аудит вартості логів, покриття error boundary та дизайн синтетичного моніторингу.
- Ще 12 промптів `coding` (en/uk) — бутстрап локального середовища, дизайн ключів ідемпотентності, рев'ю ізоляції multi-tenant, рев'ю інструментації A/B-тестів, оцінка ризику сторонніх API, аудит повторів batch-джоб, переклад реліз-нотаток, тлумачення фідбеку рев'ю для джунів, надійність доставки вебхуків, готовність до i18n, оцінка впливу оновлення залежностей та брифінги архітектурних рішень для стейкхолдерів. Повний список — у [`docs/coverage-matrix/coding.md`](docs/coverage-matrix/coding.md).

Повна історія — у [`CHANGELOG.md`](CHANGELOG.md); цей розділ навмисно містить лише останні записи, щоб не розростатися безмежно.

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
