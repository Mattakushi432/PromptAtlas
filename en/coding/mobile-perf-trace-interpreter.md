---
id: mobile-perf-trace-interpreter
title: Mobile Performance Trace Interpreter
category: coding
tags: [mobile, performance, profiling]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Interprets raw mobile profiler output — frame timings, dropped frames, CPU/GPU breakdown — and prioritizes which findings to act on first. Distinct from diagnosing battery drain or interpreting a crash log: this is for a running app that's slow or janky, not one that's crashing or draining power.

## When to use it
- You captured a trace (Xcode Instruments, Android Studio Profiler, Perfetto, Flipper) but the raw output is dense and unclear where to start.
- A specific screen or interaction feels janky and you have profiler data but no clear next step.
- Triaging which of several perf findings is actually worth fixing first.

## The Prompt

```
You are a mobile performance engineer interpreting profiler output to prioritize what to fix — not writing code yet.

Trace output (raw profiler text, summary stats, or method-level breakdown): {{TRACE_OUTPUT}}

Platform: {{PLATFORM}}

Reported symptom (what the user/tester actually observed — e.g., "scroll stutters", "screen takes 3s to load"): {{SYMPTOM}}

From the trace data:
1. Identify the top 3–5 contributors to the reported symptom, quoting the specific evidence from the trace for each (a method name and its time share, a frame-time spike, a specific dropped-frame count).
2. Classify each as CPU-bound, GPU-bound, main-thread-blocking, or I/O-bound (disk/network) — this determines what kind of fix applies.
3. Prioritize the list by (estimated impact on the symptom) × (rough fix effort: quick win vs. structural change).
4. For each, give one concrete next step — a specific thing to change or a more targeted profiling capture to confirm the hypothesis, not generic "optimize this" advice.

If the trace shows nothing clearly abnormal relative to the reported symptom, say so explicitly rather than forcing a finding, and suggest what additional trace (different scenario, longer capture, different tool) would actually show the problem.
```

## Variables
- `{{TRACE_OUTPUT}}` — the profiler output: raw trace text, exported summary, or method-level timing breakdown. Required.
- `{{PLATFORM}}` — iOS or Android (and profiler tool if relevant — affects how to read the data). Required.
- `{{SYMPTOM}}` — the user-observable performance problem being investigated. Required — without it, everything in a trace looks equally "worth optimizing."

## Example
**Input:** `{{TRACE_OUTPUT}}` = Android Studio Profiler summary showing `RecyclerView.onBindViewHolder` at 40% of frame time during scroll, with repeated bitmap decode calls, `{{PLATFORM}}` = "Android", `{{SYMPTOM}}` = "list scroll stutters on mid-range devices".

**Output (excerpt):**
```
1. `onBindViewHolder` consuming 40% of frame time — CPU-bound, main-thread-blocking. Evidence: repeated synchronous bitmap decode calls inside bind, one per visible row on every scroll frame.
   Priority: HIGH impact, LOW-MEDIUM effort (quick win) — decoding is almost certainly re-happening for already-scrolled-past rows instead of using a cache.
   Next step: confirm bitmaps aren't cached (check for an image-loading library with disk/memory cache configured); if uncached, that's the fix, not a deeper profiling pass.

Priority order: fix #1 first — it's both the largest contributor and the cheapest fix.
```

## Tips & Variations
- For iOS/Instruments traces, ask it to specifically distinguish "Time Profiler CPU hotspot" from "Core Animation frame-drop" evidence — they point to different fix categories.
- If the symptom is a cold-start time rather than scroll jank, tell it explicitly — the I/O-bound and main-thread-blocking categories dominate differently on startup vs. interaction traces.

## Changelog
- 1.0.0 (2026-08-30): Initial version.
