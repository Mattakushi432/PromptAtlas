---
id: cross-language-idiom-mapper
title: Cross-Language Idiom Mapper
category: coding
tags: [migration, porting, language-migration]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Maps a codebase's idioms and patterns from a source language to their equivalents in a target language before a porting effort begins — the planning artifact a team writes to avoid literal, non-idiomatic translation. Distinct from modernizing a pattern within the same language: this is specifically for planning a cross-language port.

## When to use it
- Planning a rewrite/port of a service or module from one language to another.
- Onboarding a team that's fluent in the target language but not the source, so they know what they're actually looking at.
- Deciding upfront which parts of a port need a redesign, not just a translation.

## The Prompt

```
You are planning a language port. Your job is to map idioms and patterns from the source language to genuinely idiomatic equivalents in the target language — not to produce a literal, mechanically-translated port.

Source language: {{SOURCE_LANGUAGE}}
Target language: {{TARGET_LANGUAGE}}
Representative code or list of patterns in use (e.g., exception-based error handling, decorators, duck typing, goroutines, null coalescing): {{CODE_SAMPLE_OR_PATTERNS}}

For each pattern or idiom present:
1. State the closest genuinely idiomatic equivalent in {{TARGET_LANGUAGE}} — not a mechanical transliteration that merely compiles.
2. Flag any pattern with no clean 1:1 equivalent — these need an actual design decision during the port, not a syntax swap. Explain what the real options are.
3. Flag target-language idioms and conventions the team should adopt that they might not think to reach for, coming from {{SOURCE_LANGUAGE}} (e.g., moving from Python to Go: no exceptions, so error handling needs explicit return values from the start, not bolted on later; no classes-first design, so think in terms of small interfaces).

Output: an idiom-mapping table (source pattern → target equivalent → notes), then a "patterns needing a rethink, not a translation" section, then a short "top gotchas for a {{SOURCE_LANGUAGE}} developer writing {{TARGET_LANGUAGE}}" list.

If the source and target languages are close relatives (e.g., Java to Kotlin, JavaScript to TypeScript), explicitly note where a near-literal port is genuinely fine versus where it would compile but read as non-idiomatic — don't treat "compiles" as "idiomatic."
```

## Variables
- `{{SOURCE_LANGUAGE}}` — the language being ported from. Required.
- `{{TARGET_LANGUAGE}}` — the language being ported to. Required.
- `{{CODE_SAMPLE_OR_PATTERNS}}` — representative code, or a plain list of patterns/idioms actually used in the source codebase. Required — the mapping is only useful if grounded in what's actually there.

## Example
**Input:** `{{SOURCE_LANGUAGE}}` = "Python", `{{TARGET_LANGUAGE}}` = "Go", `{{CODE_SAMPLE_OR_PATTERNS}}` = "exception-based error handling with custom exception classes; duck-typed function arguments; a base class with several subclasses overriding one method".

**Output (excerpt):**
```
Pattern: exception-based error handling → Go equivalent: explicit `(result, error)` return values, with error wrapping via `fmt.Errorf("...: %w", err)` for custom exception classes' role of carrying context up the call stack.
Needs a rethink, not a translation: the class hierarchy with method overriding has no direct Go equivalent — Go has no inheritance. The real options are (a) an interface implemented by separate types, or (b) struct embedding if genuine code reuse (not polymorphism) is the goal. Which one depends on whether callers need to treat instances polymorphically (→ interface) or just want to avoid duplicating fields (→ embedding).

Top gotcha: in Python, duck typing means argument types are rarely designed up front; in Go, you'll need to decide interfaces early, since retrofitting them onto already-written concrete types across a large codebase is expensive.
```

## Tips & Variations
- For a same-family pair (e.g., Java → Kotlin), ask it to specifically list which Java patterns become anti-patterns in Kotlin (like verbose null-checking instead of using `?.`) even though the Java version would still compile.
- Run this before `legacy-code-modernizer`, not instead of it — this prompt sets the target idioms; that one applies the resulting patterns to specific code during the actual port.

## Changelog
- 1.0.0 (2026-08-30): Initial version.
