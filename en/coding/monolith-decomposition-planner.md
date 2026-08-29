---
id: monolith-decomposition-planner
title: Monolith Decomposition Planner
category: coding
tags: [refactoring, modularity, architecture]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Proposes how to split one large file or module into smaller, cohesive ones based on its actual internal structure — a module-boundary decomposition plan, not a service-boundary/microservices proposal and not a single-function extraction. For a file that's grown too large to navigate, not necessarily too complex logically.

## When to use it
- A single file has grown to thousands of lines and finding anything in it requires search, not memory.
- Multiple people keep colliding on merge conflicts in the same giant file because unrelated features live in it together.
- Before adding a major new feature to a large module, and wanting to split it first so the addition has an obvious home.

## The Prompt

```
You are planning how to split one large file/module into smaller, cohesive modules based on its actual internal structure — not proposing microservices or a full architectural redesign, and not just extracting one function.

File/module to decompose:
{{FILE_CONTENTS}}

Constraints (optional — e.g. "public API must stay the same", "can't introduce circular imports", "team prefers feature-based over type-based splits"): {{CONSTRAINTS}}

Instructions:
1. Identify the distinct concerns/responsibilities currently mixed together in this file — group functions/classes/constants by what they actually do together, based on shared data they operate on and how often they call each other, not just by superficial similarity.
2. Propose a set of new modules, each with: a name, its responsibility in one sentence, and which specific functions/classes/constants from the original file move into it.
3. Identify what has to stay shared (types, constants, a small set of utilities used by multiple new modules) and where that shared code should live so it doesn't become a new dumping ground.
4. Map the dependencies between your proposed new modules — if module A needs to import from module B, say so, and flag if that creates an awkward or circular relationship that suggests the boundary is wrong.
5. If {{CONSTRAINTS}} specifies the public API must be preserved, show how the original file's public exports get re-exported (e.g., a thin `index.ts` barrel) so external consumers don't break.
6. Order the actual migration as a sequence of safe, independently-mergeable steps (not "do it all in one PR") — moving the most isolated piece first, most entangled piece last.
7. If the file doesn't actually have separable concerns (it's genuinely one cohesive thing that's just long), say so rather than forcing an artificial split.

Output format: Markdown with sections: Proposed Modules (with responsibilities and contents), Shared Code, Dependency Map, Migration Order.
```

## Variables
- `{{FILE_CONTENTS}}` — the large file/module to decompose. Required.
- `{{CONSTRAINTS}}` — API compatibility, import restrictions, or team preferences shaping the split. Optional.

## Example
**Input:** `{{FILE_CONTENTS}}` = a 2,000-line `utils.ts` mixing date formatting, API client helpers, and form validation functions with no clear organization.

**Output (excerpt):**
```
### Proposed Modules
1. **date-formatting.ts** — Formatting and parsing dates for display. Contains: `formatDate`, `parseRelativeDate`, `DATE_FORMATS` constant.
2. **api-client-helpers.ts** — Request/response shaping for the API client. Contains: `buildQueryString`, `parseApiError`, depends on `date-formatting.ts` for timestamp serialization.
3. **form-validation.ts** — Input validation rules. Contains: `validateEmail`, `validateRequired`. No dependency on the other two.

### Migration Order
1. Extract `form-validation.ts` first — zero dependencies on the other groups, safest to move.
2. Extract `date-formatting.ts` second — one internal dependency (api-client-helpers) but nothing depends on it that isn't also moving.
3. Extract `api-client-helpers.ts` last, importing `date-formatting.ts` explicitly.
```

## Tips & Variations
- For a monorepo with strict import-boundary linting, ask it to also propose the lint rule/path alias configuration needed to enforce the new boundaries going forward.
- If the team is mid-migration to a different architecture pattern (e.g., feature folders), pass that pattern as a constraint so proposed modules follow it rather than a generic type-based split.

## Changelog
- 1.0.0 (2026-08-29): Initial version.
