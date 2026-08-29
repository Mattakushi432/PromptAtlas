---
id: memory-leak-hunter
title: Memory Leak Hunter
category: coding
tags: [performance, memory, debugging]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Hypothesizes the source of a memory leak from profiler symptoms — heap growth pattern, retained object types, allocation call sites — for general application memory (backend/desktop, any managed or unmanaged language). Distinct from `mobile-battery-drain-diagnostic` (mobile energy, not memory) and the frontend/mobile crash prompts.

## When to use it
- A service's memory usage grows steadily over time (a slow leak) and needs a root-cause hypothesis before a full heap-dump deep-dive.
- A profiler snapshot shows unexpected object retention and you need help interpreting what it implies about the code.
- Deciding whether an observed memory growth pattern is a real leak versus expected cache growth or GC scheduling behavior.

## The Prompt

```
You hypothesize the likely source of a memory leak from the symptoms and/or profiler data given — reasoning from evidence, not a generic "check for leaks" checklist.

Symptoms (growth pattern, rate, correlation with specific operations): {{SYMPTOMS}}
Profiler data if available (heap snapshot summary, retained object types/counts, allocation call sites): {{PROFILER_DATA}}
Language/runtime: {{LANGUAGE_RUNTIME}}
Relevant code, if a suspect area is known (optional): {{RELEVANT_CODE}}

Instructions:
1. First distinguish a real leak from expected behavior: growing memory that plateaus (a cache reaching its size limit, a connection pool warming up) is not a leak; growing memory with no plateau, or growth that correlates with request/operation count without bound, is the actual signature to investigate.
2. For a managed/GC'd language (Java, C#, Python, JS, Go), reason about what's preventing garbage collection: an unintentionally retained reference (a static/global collection that's appended to but never cleared, an event listener/callback registered but never unregistered, a closure capturing more than intended, a cache with no eviction policy) — name the specific retention pattern implied by the evidence, not just "there's a reference somewhere."
3. For an unmanaged language (C, C++, manual memory management contexts in Rust/unsafe blocks), reason about missing deallocation: an allocation without a matching free/drop on an error path, an object whose ownership is ambiguous between two parts of the code (double-free or leak depending on which owns it), a resource handle (file, socket, DB connection) not released.
4. If {{PROFILER_DATA}} shows specific retained object types and counts, reason from that evidence directly — which object type dominates the retained heap, and what code pattern would produce many long-lived instances of that specific type.
5. If growth correlates with a specific operation (per-request growth, growth tied to a specific feature), focus the hypothesis on code executed during that operation rather than the whole codebase.
6. Rank hypotheses by how well they fit the specific evidence given, and for the top hypothesis, suggest the specific verification step (a targeted heap diff before/after triggering the suspected operation N times, checking a specific collection's size over time) rather than a generic "take a heap dump."
7. If the evidence is too thin to hypothesize confidently (e.g., only "memory keeps growing" with no rate/pattern/profiler data), say what data would let you narrow it down, and give your best general-category guess anyway.

Output format: Markdown with sections: Leak vs. Expected Growth Assessment, Ranked Hypotheses (each with supporting evidence and a verification step).
```

## Variables
- `{{SYMPTOMS}}` — the observed memory growth pattern and its correlation with app behavior. Required.
- `{{LANGUAGE_RUNTIME}}` — e.g. "Java 21 (G1GC)", "Node.js 20", "C++17". Required — leak mechanisms differ substantially between managed and unmanaged languages.
- `{{PROFILER_DATA}}` — actual heap snapshot/profiler output. Optional but turns broad hypothesizing into evidence-grounded diagnosis.
- `{{RELEVANT_CODE}}` — code from a suspected area. Optional.

## Example
**Input:** `{{LANGUAGE_RUNTIME}}` = "Node.js", `{{SYMPTOMS}}` = "memory grows steadily with request count, never plateaus, over days of uptime", `{{PROFILER_DATA}}` = "heap snapshot shows a dominant retained type: EventEmitter listeners, count growing linearly with requests".

**Output (excerpt):**
```
## Leak vs. Expected Growth Assessment
This is a real leak, not expected caching behavior — unbounded growth correlating linearly with request count, with no plateau over days, is the classic leak signature.

## Ranked Hypotheses
1. **Most likely: event listeners registered per-request, never removed** — HIGH confidence.
   Supporting evidence: the heap snapshot's dominant retained type is EventEmitter listeners, growing linearly with request count — this points directly at a `.on()` call happening somewhere in the per-request code path with no corresponding `.off()`/`.removeListener()`.
   Verification: search the codebase for `.on(` calls inside request-handling code (as opposed to app-startup code, where a one-time listener is normal) and check whether each has a matching removal, especially on a shared/long-lived EventEmitter instance rather than a per-request one.
```

## Tips & Variations
- For a JVM-based service, ask it to reason specifically in terms of GC roots and generational GC behavior (an object surviving into old gen unexpectedly) if that level of profiler data is available (e.g., from a tool like VisualVM or Eclipse MAT).
- If you can reproduce the leak in a controlled environment, suggest taking two heap snapshots before/after a fixed number of operations and diffing them — ask the model to help interpret that diff once you have it, which is often more conclusive than reasoning from a single snapshot.

## Changelog
- 1.0.0 (2026-08-29): Initial version.
