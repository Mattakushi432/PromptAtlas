---
id: legacy-code-modernizer
title: Legacy Code Modernizer
category: coding
tags: [refactoring, legacy, modernization]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Migrates a specific old code pattern to its modern language/framework idiom (callbacks to async/await, class components to hooks, old ORM syntax to current) with an explanation of what changed and why it's safe. For a developer modernizing legacy code deliberately, not doing a broad rewrite.

## When to use it
- A codebase still uses an outdated pattern (callback hell, deprecated API, old framework syntax) and you're modernizing incrementally.
- Onboarding onto old code and wanting to see the modern equivalent side by side to understand it faster.
- Preparing for a framework/language version upgrade and need to migrate patterns that will break or be deprecated.

## The Prompt

```
You modernize a specific legacy code pattern to its current idiomatic equivalent — a targeted migration, not a full rewrite or redesign. Preserve behavior exactly; only the pattern/syntax changes.

Legacy code:
{{LEGACY_CODE}}

Source pattern/version (optional, if known): {{SOURCE_VERSION}}
Target pattern/version: {{TARGET_VERSION}}
Constraints (optional — e.g. "must stay compatible with X", "can't introduce new dependencies"): {{CONSTRAINTS}}

Instructions:
1. Identify the specific outdated pattern(s) in the code (e.g., nested callbacks, `var` usage, class component with lifecycle methods, deprecated API calls) and name each one.
2. Rewrite using the modern equivalent for {{TARGET_VERSION}}, preserving exact behavior — same control flow, same error handling semantics, same side-effect ordering.
3. Do not silently add new features, fix unrelated bugs, or change the public interface/signature unless the modernization specifically requires it (e.g., a callback-to-promise conversion necessarily changes the calling convention — flag that explicitly as a breaking change for callers).
4. If the legacy pattern has a subtlety the naive modern equivalent doesn't replicate (e.g., a callback that could theoretically fire multiple times, which a single `await` can't represent), flag it rather than silently producing behavior that differs.
5. If {{CONSTRAINTS}} rules out the most idiomatic modern approach, use the best available approach within the constraint and say what you had to compromise.
6. List every call site or consumer that would need to change as a result of this migration, if inferable from context.

Output: the modernized code, followed by a short list of what changed and any breaking changes for callers.
```

## Variables
- `{{LEGACY_CODE}}` — the old pattern to migrate. Required.
- `{{TARGET_VERSION}}` — what to migrate to, e.g. "async/await (ES2017+)", "React function components with hooks (React 18)", "SQLAlchemy 2.0 style". Required.
- `{{SOURCE_VERSION}}` — the old pattern/version, if not obvious from the code. Optional.
- `{{CONSTRAINTS}}` — compatibility or dependency constraints limiting the modernization. Optional.

## Example
**Input:** `{{LEGACY_CODE}}` = a Node.js function using nested callbacks for three sequential DB calls, `{{TARGET_VERSION}}` = "async/await".

**Output (excerpt):**
```js
async function getUserOrders(userId) {
  const user = await db.getUser(userId);
  const orders = await db.getOrders(user.id);
  const items = await db.getOrderItems(orders.map(o => o.id));
  return items;
}
```
*(followed by: "Breaking change for callers: the original took a Node-style `(err, result)` callback as its last argument; this version returns a Promise instead. Callers using the old callback signature must be updated or wrapped with `util.callbackify`.")*

## Tips & Variations
- For a large-scale migration, run this prompt per-function and ask it to also flag if the function is a good candidate for a codemod (mechanical, pattern-based) versus needing manual judgment.
- When modernizing framework code (e.g., React class → hooks), explicitly ask it to preserve any lifecycle timing subtleties (e.g., `componentDidUpdate` conditions) as a callout, since hooks' effect timing isn't a 1:1 match.

## Changelog
- 1.0.0 (2026-08-29): Initial version.
