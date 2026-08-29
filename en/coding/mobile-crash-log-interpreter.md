---
id: mobile-crash-log-interpreter
title: Mobile Crash Log Interpreter
category: coding
tags: [mobile, debugging, crash-analysis]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Interprets a mobile crash log (iOS crash report, Android ANR/tombstone, symbolicated or not) and suggests likely causes — mobile-specific crash formats and failure modes distinct from the general `stack-trace-interpreter`'s server/app-language traces. For a real crash a mobile developer needs to triage.

## When to use it
- A crash report came in from a crash-reporting tool (Crashlytics, Sentry, App Store Connect) and needs interpretation before you can even start debugging.
- Symbolication is incomplete or unavailable and you need to work from a partially-readable native stack trace.
- Triaging a batch of crash reports to figure out which ones are actually the same root cause versus distinct issues.

## The Prompt

```
You interpret a mobile crash log and identify likely root causes — accounting for mobile-specific crash types and formats, not treating this as a generic stack trace.

Crash log/report: {{CRASH_LOG}}
Platform: {{PLATFORM}}
App context (relevant code near the crash, if available): {{RELEVANT_CODE}}

Instructions:
1. Identify the crash type and what it fundamentally means: for iOS, distinguish a Swift/Objective-C exception (EXC_CRASH, often a force-unwrap of nil, an array out-of-bounds, or an uncaught NSException) from a memory-related native crash (EXC_BAD_ACCESS, often a use-after-free or a dangling pointer, especially in code touching Objective-C bridging or unsafe pointers); for Android, distinguish an unhandled Java/Kotlin exception (visible in a normal stack trace) from a native crash (a tombstone, needing NDK symbolication) from an ANR (Application Not Responding — the main thread was blocked, not a crash per se).
2. Walk the stack trace from the crash frame down (or up, per platform convention), explaining what each frame was doing, and note if symbolication looks incomplete (raw memory addresses instead of function names) — say what's needed to fully symbolicate (dSYM file for iOS, matching NDK symbols for Android) if it's clearly missing.
3. For a nil/null-related crash, identify the specific variable/property that was nil and reason about why, based on the code path shown — a force-unwrap or `!!` operator crash needs the actual optional-handling logic examined, not just "add a nil check" as a reflexive answer.
4. For a threading-related crash (a UI update from a background thread, a race condition on shared state), identify the specific thread-safety violation implied by the stack trace.
5. For an ANR specifically, reason about what's blocking the main thread — a synchronous network call, a heavy computation, a lock contention — rather than treating it like a crash stack trace.
6. Rank likely causes by how well they fit the specific evidence in the log, and say what additional data (a longer stack trace, the crash's frequency/device distribution, breadcrumbs leading up to it) would help confirm the top hypothesis.

Output format: Markdown with sections: Crash Type, Stack Trace Walkthrough, Likely Causes (ranked), Next Steps.
```

## Variables
- `{{CRASH_LOG}}` — the crash report/log text. Required.
- `{{PLATFORM}}` — "iOS" or "Android" (and version if relevant). Required — crash formats and common causes differ substantially.
- `{{RELEVANT_CODE}}` — the source code near the crash location, if the stack trace can be mapped to it. Optional but sharply improves diagnosis accuracy.

## Example
**Input:** `{{PLATFORM}}` = "iOS", `{{CRASH_LOG}}` = an EXC_BAD_ACCESS crash inside a completion handler that captures `self` and accesses a property after the view controller was likely deallocated.

**Output (excerpt):**
```
## Crash Type
EXC_BAD_ACCESS — a memory access violation, not a Swift-level exception. This typically means code accessed memory that's already been deallocated (a dangling reference), which is common in async completion handlers that capture `self` without proper lifetime handling.

## Likely Causes (ranked)
1. **Most likely:** the completion handler captures `self` strongly and is invoked after the view controller has been deallocated (e.g., user navigated away before the async call completed), and the handler then accesses a property on the now-invalid `self`.

## Next Steps
- Check whether the completion handler uses `[weak self]` and properly guards against `self` being nil before use.
- If it does use `[weak self]` already, look for a different dangling reference in the same scope (a captured delegate, a captured closure-local object) rather than `self` itself.
```

## Tips & Variations
- For a batch of similar crash reports, ask it to identify whether they share a root cause based on stack trace similarity, to avoid triaging the same bug multiple times under different report IDs.
- If the crash log is fully unsymbolicated (raw hex addresses only) and no dSYM/symbols are available, be explicit that the model's diagnosis is necessarily limited — ask what to prioritize fixing on the tooling side (getting symbolication working) before further log analysis is useful.

## Changelog
- 1.0.0 (2026-08-29): Initial version.
