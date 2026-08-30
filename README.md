# PromptAtlas

[![Check bilingual parity](https://github.com/Mattakushi432/PromptAtlas/actions/workflows/check-parity.yml/badge.svg)](https://github.com/Mattakushi432/PromptAtlas/actions/workflows/check-parity.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Prompts](https://img.shields.io/badge/prompts-184-informational)](docs/roadmap.md)

An open-source library of prompts, patterns, and techniques for modern AI models — bilingual, English and Ukrainian, and nothing but a git repository. No website, no app: browse it directly on GitHub, `git clone` it, or grab a raw file straight into your AI tool of choice.

**Stats:** 184 prompts · 13 categories, each targeting 500 distinct prompts, all 13 now with real content · 2 languages (EN / UK). See [`docs/roadmap.md`](docs/roadmap.md) for live per-category progress. Coding & Development — 129/500.

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

- **Milestone: all 13 categories now have content.** Seeded `business-and-strategy`, `education-and-learning`, `productivity-and-personal`, `data-and-analysis`, `research-and-academic`, `creative-and-visual`, `voice-and-audio`, and `social-media` (4 prompts each, en/uk) — the last of the previously-empty categories. See [`docs/roadmap.md`](docs/roadmap.md) for the full breakdown.
- 7 prompts to launch the new `career-and-hr` category (en/uk) — resume bullet rewriting, mock interview practice, performance review drafting, 30-60-90 day onboarding plans, compensation rationale writing, career path exploration, and exit interview tooling.
- 7 prompts to launch the new `marketing-and-sales` category (en/uk) — ICP & positioning drafting, sales objection handling, landing page critique, ad copy variants for A/B testing, cold outreach personalization, SEO content briefs, and case study drafting.
- 6 prompts to launch the new `writing-and-content` category (en/uk) — outline-to-draft blog expansion, ruthless line editing, tone adaptation, cold email sequence drafting, non-native English polishing, and UX microcopy review.

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

**Статистика:** 184 промпти · 13 категорій, кожна з ціллю 500 унікальних промптів, усі 13 тепер із реальним контентом · 2 мови (EN / UK). Актуальний прогрес по категоріях — у [`docs/roadmap.md`](docs/roadmap.md). Кодинг та розробка — 129/500.

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

- **Віха: усі 13 категорій тепер мають контент.** Заповнили `business-and-strategy`, `education-and-learning`, `productivity-and-personal`, `data-and-analysis`, `research-and-academic`, `creative-and-visual`, `voice-and-audio` та `social-media` (по 4 промпти, en/uk) — останні з раніше порожніх категорій. Повний розподіл — у [`docs/roadmap.md`](docs/roadmap.md).
- 7 промптів для запуску нової категорії `career-and-hr` (en/uk) — переписування пунктів резюме, практика тренувальних співбесід, чернетки перформанс-рев'ю, плани онбордингу 30-60-90 днів, обґрунтування компенсації, дослідження кар'єрних шляхів та інструменти екзит-інтерв'ю.
- 7 промптів для запуску нової категорії `marketing-and-sales` (en/uk) — укладання ICP та позиціювання, опрацювання заперечень продажів, критика копірайту лендингу, варіанти рекламного копірайту для A/B тестів, персоналізація холодного аутріч, SEO-брифи контенту та написання кейс-стаді.
- 6 промптів для запуску нової категорії `writing-and-content` (en/uk) — розгортання плану в чернетку блогу, безжальне редагування рядків, адаптація тону, укладання послідовності холодних листів, шліфування англійської для не носіїв мови та рев'ю UX-мікротекстів.

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
