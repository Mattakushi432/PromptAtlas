# Taxonomy

The canonical category list for PromptAtlas. Folder slugs stay in English under both `en/` and `uk/` so the two trees are mechanically comparable; only the display names are localized.

This is the fixed top-level list (13 categories) — do not add or remove one without explicit maintainer sign-off. Subcategories/tags can grow freely underneath each one as coverage work surfaces natural groupings. Do not add "Legal," "Financial," or "Health & Wellness" tags or subfolders without a visible disclaimer at the top of every prompt in them stating the output is not professional advice.

| Slug | English name | Ukrainian name |
|---|---|---|
| `coding` | Coding & Development | Кодинг та розробка |
| `writing-and-content` | Writing & Content | Письмо та контент |
| `marketing-and-sales` | Marketing & Sales | Маркетинг та продажі |
| `business-and-strategy` | Business & Strategy | Бізнес та стратегія |
| `education-and-learning` | Education & Learning | Освіта та навчання |
| `productivity-and-personal` | Productivity & Personal | Продуктивність та особисте |
| `data-and-analysis` | Data & Analysis | Дані та аналіз |
| `research-and-academic` | Research & Academic | Дослідження та академічна робота |
| `creative-and-visual` | Creative & Visual | Креатив та візуал |
| `voice-and-audio` | Voice & Audio | Голос та аудіо |
| `agents-and-automation` | Agents & Automation | Агенти та автоматизація |
| `career-and-hr` | Career & HR | Кар'єра та HR |
| `social-media` | Social Media | Соціальні мережі |

`creative-and-visual` covers Midjourney/DALL·E/Sora-style image and video generation prompts.

Category folders are created only once they hold real content — an empty `en/<slug>/` or `uk/<slug>/` folder is not committed just to reserve a taxonomy row.

**Prompt counts, per-category targets (500 each), and backlog ideas live in [`docs/roadmap.md`](roadmap.md) and [`docs/coverage-matrix/`](coverage-matrix/) — this file covers definitions only, to avoid two places tracking the same numbers.**

## Taxonomy Changelog

- 2026-08-29: Initial taxonomy established (13 categories), mirroring the starting set in `CURATOR_PROMPT.md` §4.
- 2026-08-29: Dropped the per-language prompt-count columns in favor of `docs/roadmap.md`, which now tracks progress toward each category's 500-prompt target (added by `CURATOR_PROMPT.md` v2, §6).
