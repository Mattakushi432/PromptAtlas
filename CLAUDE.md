# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

PromptAtlas is a bilingual (English/Ukrainian) open-source library of AI prompts, stored as plain markdown files in a git repository — there is no companion app, website, or build output. The repository itself is the product, read directly on GitHub. `README.md` has the public-facing pitch; `CURATOR_PROMPT.md` is the full standing curatorial role (mission, workflows, quality rubric) that governs how content gets added and revised — read it before adding or editing a prompt.

`en/coding/code-review-assistant.md` and its `uk/` counterpart are the first real prompt pair and double as a worked reference for the template and the localization convention described below.

## Commands

- `node scripts/check-parity.js` — verifies every `en/**/*.md` prompt has a matching `uk/**/*.md` counterpart (and vice versa) with identical frontmatter `id` and `version`. Node stdlib only, no install step. This is exactly what `.github/workflows/check-parity.yml` runs in CI on every push/PR — run it locally before opening a PR. It passes trivially if no prompts exist yet under `en/`/`uk/`.

## Content architecture

- **Bilingual pairing is the core invariant.** Every prompt exists as two files at the *same relative path* under `en/` and `uk/`, e.g. `en/coding/code-review-assistant.md` ↔ `uk/coding/code-review-assistant.md`. The filename is the prompt's permanent `id` — never renamed once published. The `uk/` file must be a native localization, not a literal translation.
- **Frontmatter localization convention:** `title` is translated in the `uk/` file (human-facing); `id`, `category`, `tags`, `target_models`, `difficulty`, `status`, and `version` stay identical/English across both files (structural — this is what `scripts/check-parity.js` diffs on).
- **Category slugs stay in English in both trees** (`uk/coding/`, not a translated folder name), so the two trees are directly comparable path-for-path — this is what lets `scripts/check-parity.js` pair files by path alone. Localized display names live in `docs/taxonomy.md`, not in the folder name.
- **`docs/taxonomy.md`** is the canonical, fixed category list (13 categories) with EN/UK display names, slugs, and per-language prompt counts. Update the counts whenever a prompt is added, removed, or its `status` changes to/from `deprecated`. Don't create a category folder until it holds ~3-5 real prompts.
- **Every prompt file follows one exact template** (frontmatter + fixed sections): frontmatter fields are `id, title, category, tags, target_models, difficulty, version, status, language, last_updated`; body sections are `## Description`, `## When to use it`, `## The Prompt`, `## Variables`, `## Example`, `## Tips & Variations`, `## Changelog`.
- **Versioning is semver**: `patch` = wording fix/typo, no behavior change; `minor` = new variable/section, backward-compatible; `major` = core approach or expected output changes. When either language file is edited, bump `version` on *both* language files in lockstep, even if only one language's wording changed — the version number always describes the shared underlying prompt design, not per-language wording.
- **`status` gates publication**: `draft` → `stable` requires an average quality-rubric score of 4.0+ with no single dimension below 3 (the 7-dimension rubric — clarity, specificity, structure, output control, robustness, reusability, bilingual equivalence — is defined in `CONTRIBUTING.md` and `CURATOR_PROMPT.md` §5). `deprecated` replaces deletion when a prompt is superseded — never delete a published prompt outright.
- **`CHANGELOG.md`** gets a new entry for every prompt addition or edit, alongside the `docs/taxonomy.md` count update.

## Branching

`main` holds the shared scaffold (docs, templates, CI); content work happens on per-scope branches (e.g. `en/prompt`). A content branch can be created from an old point in `main`'s history and miss later scaffold changes — check `git log --oneline --all --graph` (or `git merge-base main <branch>`) rather than assuming the current branch is up to date with `main`.
