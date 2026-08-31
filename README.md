# PromptAtlas

[![Check bilingual parity](https://github.com/Mattakushi432/PromptAtlas/actions/workflows/check-parity.yml/badge.svg)](https://github.com/Mattakushi432/PromptAtlas/actions/workflows/check-parity.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Prompts](https://img.shields.io/badge/prompts-259-informational)](docs/roadmap.md)

An open-source library of prompts, patterns, and techniques for modern AI models — bilingual, English and Ukrainian, and nothing but a git repository. No website, no app: browse it directly on GitHub, `git clone` it, or grab a raw file straight into your AI tool of choice.

**Stats:** 259 prompts · 13 categories, each targeting 500 distinct prompts, all 13 now with real content · 2 languages (EN / UK). See [`docs/roadmap.md`](docs/roadmap.md) for live per-category progress. Coding & Development — 153/500.

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

- 8 more prompts to `research-and-academic` (en/uk) — methodology section critique, paraphrase-vs-plagiarism checking, advisor feedback translation, grant proposal aims-page tightening, plain-language results summarizing, related-work gap finding, conference talk outlining, and statistical reporting style checking. Clears the starter backlog, refilled with 12 new ideas — 12/500.
- 8 more prompts to `productivity-and-personal` (en/uk) — habit-tracker reflection prompts, personal finance budget sanity-checking, procrastination root-cause diagnosis, inbox triage rule drafting, time-blocking calendar design, freelancer scope clarification, trip itinerary building, and end-of-day journaling prompts. Clears the starter backlog, refilled with 12 new ideas — 12/500.
- 8 more prompts to `education-and-learning` (en/uk) — three-reading-level concept explanation, rubric-based essay feedback, peer-review feedback coaching, curriculum gap analysis, language learning conversation practice, certification exam weak-area diagnosis, corporate training module outlining, and parent homework-help coaching. Clears the starter backlog, refilled with 12 new ideas — 12/500.
- 8 more prompts to `business-and-strategy` (en/uk) — OKR draft-to-critique passing, pricing strategy stress-testing, strategic decision pre-mortems, org design tradeoff analysis, market entry feasibility checklists, due diligence question list generation, board deck narrative tightening, and quarterly business review summarizing. Clears the starter backlog, refilled with 12 new ideas — 12/500.
- 8 more prompts to `data-and-analysis` (en/uk) — statistical test selection, analyst-facing SQL query performance review, anomaly explanation generation, data cleaning script generation, dashboard metric definition auditing, cohort analysis setup, forecast assumption stress-testing, and executive data-story narrative building. Clears the starter backlog, refilled with 12 new ideas — 12/500.

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

**Статистика:** 259 промптів · 13 категорій, кожна з ціллю 500 унікальних промптів, усі 13 тепер із реальним контентом · 2 мови (EN / UK). Актуальний прогрес по категоріях — у [`docs/roadmap.md`](docs/roadmap.md). Кодинг та розробка — 153/500.

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

- Ще 8 промптів для `research-and-academic` (en/uk) — критика розділу методології, перевірка перефразування проти плагіату, переклад фідбеку наукового керівника, підтягування сторінки цілей грантової заявки, узагальнення результатів простою мовою, пошук прогалин у related work, побудова структури конференційного виступу та перевірка стилю статистичної звітності. Закриває стартовий беклог, поповнено 12 новими ідеями — 12/500.
- Ще 8 промптів для `productivity-and-personal` (en/uk) — питання для рефлексії трекера звичок, перевірка адекватності особистого бюджету, діагностика першопричини прокрастинації, складання правил тріажу вхідних, дизайн календаря тайм-блокінгу, уточнення обсягу проєкту для фрилансера, побудова маршруту подорожі та щоденний промпт для рефлексії. Закриває стартовий беклог, поповнено 12 новими ідеями — 12/500.
- Ще 8 промптів для `education-and-learning` (en/uk) — пояснення концепції на трьох рівнях складності, фідбек на есе за рубрикою, тренування фідбеку взаємного рецензування, аналіз прогалин у навчальній програмі, практика розмовної мови, діагностика слабких зон іспиту сертифікації, побудова структури корпоративного тренінгу та тренерський скрипт для батьків з допомоги з домашнім завданням. Закриває стартовий беклог, поповнено 12 новими ідеями — 12/500.
- Ще 8 промптів для `business-and-strategy` (en/uk) — критичний прохід чернетки OKR, стрес-тестування стратегії ціноутворення, передпохоронний аналіз стратегічних рішень, аналіз компромісів оргдизайну, чек-лист доцільності виходу на ринок, генерація списку питань due diligence, підтягування наративу презентації для ради директорів та узагальнення квартального бізнес-огляду. Закриває стартовий беклог, поповнено 12 новими ідеями — 12/500.
- Ще 8 промптів для `data-and-analysis` (en/uk) — вибір статистичного тесту, рев'ю продуктивності SQL-запитів для аналітиків, генерація пояснень аномалій, генерація скрипту очищення даних, аудит визначень метрик дашборду, налаштування когортного аналізу, стрес-тестування припущень прогнозу та побудова наративу даних для керівництва. Закриває стартовий беклог, поповнено 12 новими ідеями — 12/500.

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
