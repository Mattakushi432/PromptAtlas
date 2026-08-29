# Contributing to PromptAtlas

Thanks for helping grow the library. PromptAtlas stays a plain git repository — no website, no app — so every contribution is a pull request against `en/` and/or `uk/` markdown files.

## Ground rules

- **Bilingual by default.** A new prompt needs both an `en/` and a `uk/` file before it can merge. The Ukrainian version must be a native localization — written the way a Ukrainian-speaking user would actually phrase it — not a literal translation of the English text.
- **Same filename, both languages.** `en/coding/code-review-assistant.md` pairs with `uk/coding/code-review-assistant.md`. That filename is the prompt's permanent id — don't rename it once merged.
- **Improve, don't duplicate.** Before adding a prompt, check whether something similar already exists in that category. If it does, open a PR improving it instead (see "Editing an existing prompt" below).
- **Categories** live in [`docs/taxonomy.md`](docs/taxonomy.md). Pick the closest fit; propose a new category only once you have 3–5 real prompts for it.

## Adding a new prompt

1. Fork the repo and create a branch.
2. Copy the template below into `en/<category>/<your-prompt-id>.md` and `uk/<category>/<your-prompt-id>.md`.
3. Fill in every section — a prompt without a worked `## Example` won't pass review.
4. Self-score your prompt against the [Quality Rubric](#quality-rubric) below. If any dimension is under 3, or the average is under 4.0, set `status: draft` instead of `stable` and say so in your PR description.
5. Open a PR. The PR template will ask you to confirm both languages are present and check them against the rubric.

### Prompt file template

```markdown
---
id: your-prompt-id
title: Your Prompt Title
category: coding
tags: [tag-one, tag-two]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate        # beginner | intermediate | advanced
version: 1.0.0
status: draft                   # draft | stable | deprecated
language: en                    # en | uk
last_updated: YYYY-MM-DD
---

## Description
One or two sentences: what this prompt does and who it's for.

## When to use it
2–4 bullet points describing the situation that calls for this prompt.

## The Prompt

\`\`\`
<the actual, ready-to-copy prompt text, with placeholders like {{FILE_CONTENTS}}>
\`\`\`

## Variables
- `{{FILE_CONTENTS}}` — what this placeholder means.

## Example
**Input:** ...
**Output:** ...

## Tips & Variations
Optional adaptation notes.

## Changelog
- 1.0.0 (YYYY-MM-DD): Initial version.
```

## Editing an existing prompt

Bump the version using semver:

- **Patch** (`1.2.0` → `1.2.1`): wording fix, typo, clarified instruction — no behavior change.
- **Minor** (`1.2.0` → `1.3.0`): new variable, new section, backward-compatible improvement.
- **Major** (`1.x.x` → `2.0.0`): the prompt's core approach or expected output changes; old usage patterns may break.

Update `## Changelog` inside the file, bump `last_updated`, and mirror the **same** version number on the paired-language file — even if only one language's wording actually changed. A version number always describes "this underlying prompt design," in both languages at once.

Never delete a published prompt outright. If it's superseded, set `status: deprecated` and add a note pointing to its replacement.

## Quality Rubric

Score each dimension 1–5. A prompt needs an average of 4.0+, with no single dimension below 3, to ship as `status: stable`.

1. **Clarity** — an unfamiliar reader understands what to do with it in under 30 seconds.
2. **Specificity** — concrete role, context, constraints, and output format — not vague instructions.
3. **Structure** — follows the template above, including realistic placeholders.
4. **Output control** — tells the AI what shape the answer should take (format, length, tone).
5. **Robustness** — still produces a sane result on edge-case inputs (empty, huge, unexpected language, unusual request).
6. **Reusability** — generalizes past one narrow example; placeholders are genuinely parameterizable.
7. **Bilingual equivalence** — the `uk/` version reads as natively well-written as the `en/` version.

## Reporting a broken or outdated prompt

Open an issue using the "Report a broken prompt" template — link the file, the model you tried it on, and what went wrong. If you already have a fix, a PR is even better.

## Requesting a new prompt

Open an issue using the "Request a prompt" template — describe the task, the target category, and (if you know it) which AI tools it should work well with.
