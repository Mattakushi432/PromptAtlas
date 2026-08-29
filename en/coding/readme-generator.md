---
id: readme-generator
title: README Generator
category: coding
tags: [documentation, onboarding, readme]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Generates a project README from a description of the codebase — what it is, how to set it up, how to run it — producing something a first-time visitor can actually use, not generic boilerplate. For a project that needs a README from scratch or a badly outdated one rewritten.

## When to use it
- Starting a new project and needing a README before the first contributor/user shows up.
- An existing README has drifted badly out of date (wrong setup steps, missing new features) and needs a rewrite grounded in the actual current codebase.
- Preparing a project for open-sourcing or wider internal sharing and needing a README that actually orients a stranger.

## The Prompt

```
You write a README for a real project, grounded in the specifics given — not a generic template with placeholder sections.

Project description (what it does, who it's for, tech stack): {{PROJECT_DESCRIPTION}}
Setup/installation steps (the actual commands needed to get it running): {{SETUP_STEPS}}
Key features or usage examples (optional): {{USAGE_INFO}}
Existing README to revise, if any (optional): {{EXISTING_README}}

Instructions:
1. Open with a concise description of what the project does and who it's for — a stranger should understand the project's purpose within the first two sentences, without needing to read further.
2. Write setup/installation instructions as exact, copy-pasteable commands in the order they need to run, not prose describing the general idea of setup — include prerequisite versions (language/runtime version, required external services) where they matter.
3. Include a "quick start" or minimal usage example that gets someone from a fresh clone to seeing the thing actually work, before diving into full feature documentation — this is often the single most valuable section for a new user's first five minutes.
4. If {{USAGE_INFO}} describes specific features, document the ones a typical user actually needs first, not an exhaustive feature dump — link out to fuller docs for depth if they exist, rather than cramming everything into the README.
5. Don't claim capabilities, test coverage, or stability that isn't substantiated by the given information — a README that oversells what's actually there erodes trust the first time someone hits the gap.
6. If {{EXISTING_README}} is provided, preserve any parts that are still accurate rather than rewriting everything from scratch, but correct anything that's actually gone stale (renamed commands, removed features, changed setup steps).
7. Include standard closing sections only if genuinely applicable (License, Contributing) — don't pad with empty sections for the sake of looking complete.

Output format: Markdown, structured as: Title + one-line description, Quick Start, Installation, Usage, (optional) Features, (optional) Contributing/License.
```

## Variables
- `{{PROJECT_DESCRIPTION}}` — what the project is and its tech stack. Required.
- `{{SETUP_STEPS}}` — the actual commands needed to install/run it. Required.
- `{{USAGE_INFO}}` — key features or example usage. Optional but improves the README's usefulness significantly.
- `{{EXISTING_README}}` — a current README to revise rather than replace outright. Optional.

## Example
**Input:** `{{PROJECT_DESCRIPTION}}` = "a CLI tool for batch-resizing images, written in Go", `{{SETUP_STEPS}}` = "go install github.com/example/imgresize@latest", `{{USAGE_INFO}}` = "imgresize --width 800 ./photos/*.jpg".

**Output (excerpt):**
```markdown
# imgresize

A CLI tool for batch-resizing images from the command line.

## Quick Start

```sh
go install github.com/example/imgresize@latest
imgresize --width 800 ./photos/*.jpg
```

That resizes every JPEG in `./photos` to 800px wide, preserving aspect ratio.

## Installation

Requires Go 1.21+.

```sh
go install github.com/example/imgresize@latest
```
```

## Tips & Variations
- For a library (not an application), swap "Installation"/"Usage" for "Installation" (package manager command) and "API" or "Example" showing a minimal code snippet using the library, since the audience and quick-start shape differ from a CLI/app.
- If the project has a companion docs site, explicitly ask the README to stay short and link out for depth, rather than duplicating the docs site's content inline.

## Changelog
- 1.0.0 (2026-08-29): Initial version.
