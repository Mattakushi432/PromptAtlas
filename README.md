# PromptAtlas

[![Check bilingual parity](https://github.com/Mattakushi432/PromptAtlas/actions/workflows/check-parity.yml/badge.svg)](https://github.com/Mattakushi432/PromptAtlas/actions/workflows/check-parity.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Prompts](https://img.shields.io/badge/prompts-210-informational)](docs/roadmap.md)

An open-source library of prompts, patterns, and techniques for modern AI models — bilingual, English and Ukrainian, and nothing but a git repository. No website, no app: browse it directly on GitHub, `git clone` it, or grab a raw file straight into your AI tool of choice.

**Stats:** 210 prompts · 13 categories, each targeting 500 distinct prompts, all 13 now with real content · 2 languages (EN / UK). See [`docs/roadmap.md`](docs/roadmap.md) for live per-category progress. Coding & Development — 153/500.

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

Every category now has a start, but most are still far from their 500-prompt target — that's the fastest way to help right now. We've opened a batch of [`good-first-contribution`](https://github.com/Mattakushi432/PromptAtlas/issues?q=is%3Aissue+is%3Aopen+label%3Agood-first-contribution) issues, each a vetted backlog idea (pre-checked for distinctiveness) ready to draft in both languages. See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the template, the 8-dimension quality rubric, and the PR process.

## Recently added

- 12 more `coding` prompts (en/uk) — CORS misconfiguration review, JWT implementation review, file-upload security review, circuit-breaker design, dead-letter-queue handling design, sharding strategy, full-text search index design, SSR/hydration mismatch debugging, Web Worker offload advice, container-image CVE triage, disaster-recovery plan drafting, and consumer-driven contract test design. Backlog refilled to 20 — 153/500.
- 2 more prompts to `career-and-hr` (en/uk) — difficult feedback conversation scripting, and LinkedIn profile rewriting from a resume. Backlog refilled with 10 new ideas; issues #9-#11 remain open for contributors.
- 12 more `coding` prompts (en/uk) — mobile deep-link routing validation, feature-flag sprawl auditing, idempotent webhook consumption, database index bloat auditing, A/B test sample-size sanity checking, API response compression strategy, Terraform state recovery planning, offline-conflict UX design, scheduled-job timezone correctness, GraphQL query-cost design, client-side form persistence, and multi-region deployment consistency. Reached 141/500 at the time.
- **Milestone: all 13 categories now have content.** Seeded `business-and-strategy`, `education-and-learning`, `productivity-and-personal`, `data-and-analysis`, `research-and-academic`, `creative-and-visual`, `voice-and-audio`, and `social-media` (4 prompts each, en/uk) — the last of the previously-empty categories. See [`docs/roadmap.md`](docs/roadmap.md) for the full breakdown.
- 7 prompts to launch the new `career-and-hr` category (en/uk) — resume bullet rewriting, mock interview practice, performance review drafting, 30-60-90 day onboarding plans, compensation rationale writing, career path exploration, and exit interview tooling.

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

**Статистика:** 210 промптів · 13 категорій, кожна з ціллю 500 унікальних промптів, усі 13 тепер із реальним контентом · 2 мови (EN / UK). Актуальний прогрес по категоріях — у [`docs/roadmap.md`](docs/roadmap.md). Кодинг та розробка — 153/500.

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

Кожна категорія тепер має старт, але більшість усе ще далеко від цілі в 500 промптів — це найшвидший спосіб зараз допомогти. Ми відкрили пакет issue з міткою [`good-first-contribution`](https://github.com/Mattakushi432/PromptAtlas/issues?q=is%3Aissue+is%3Aopen+label%3Agood-first-contribution) — кожна це перевірена ідея з бэклогу (вже пройшла перевірку на дистинктивність), готова до написання двома мовами. Шаблон, 8-вимірна рубрика якості та процес PR — у [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Нещодавно додано

- Ще 12 промптів `coding` (en/uk) — рев'ю помилок конфігурації CORS, рев'ю реалізації JWT, рев'ю безпеки завантаження файлів, дизайн circuit breaker, дизайн обробки dead-letter черги, стратегія шардингу, дизайн індексу повнотекстового пошуку, дебагінг невідповідності SSR/гідратації, порада щодо офлоуду у Web Worker, тріаж CVE образів контейнерів, чернетка плану аварійного відновлення та дизайн consumer-driven контрактних тестів. Беклог поповнено до 20 — 153/500.
- Ще 2 промпти для `career-and-hr` (en/uk) — сценарій складної розмови з фідбеком та переписування профілю LinkedIn з резюме. Беклог поповнено 10 новими ідеями; issue #9-#11 лишаються відкритими для контриб'юторів.
- Ще 12 промптів `coding` (en/uk) — валідація роутингу мобільних deep link, аудит розростання feature flags, огляд ідемпотентності споживача вебхуків, аудит розростання індексів БД, перевірка адекватності розміру вибірки A/B тестів, стратегія стиснення відповідей API, планування відновлення стану Terraform, дизайн UX офлайн-конфліктів, коректність часових поясів запланованих задач, дизайн вартості GraphQL-запитів, збереження стану форм на клієнті, узгодженість мультирегіонального деплою. На той момент досягли 141/500.
- **Віха: усі 13 категорій тепер мають контент.** Заповнили `business-and-strategy`, `education-and-learning`, `productivity-and-personal`, `data-and-analysis`, `research-and-academic`, `creative-and-visual`, `voice-and-audio` та `social-media` (по 4 промпти, en/uk) — останні з раніше порожніх категорій. Повний розподіл — у [`docs/roadmap.md`](docs/roadmap.md).
- 7 промптів для запуску нової категорії `career-and-hr` (en/uk) — переписування пунктів резюме, практика тренувальних співбесід, чернетки перформанс-рев'ю, плани онбордингу 30-60-90 днів, обґрунтування компенсації, дослідження кар'єрних шляхів та інструменти екзит-інтерв'ю.

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
