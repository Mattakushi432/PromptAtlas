---
id: web-worker-offload-advisor
title: Web Worker Offload Advisor
category: coding
tags: [frontend, performance, concurrency]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Identifies main-thread-blocking work in a frontend codebase — heavy computation, large JSON parsing, image/data processing — and recommends what to move to a Web Worker, including the message-passing interface design and what must stay on the main thread. Distinct from `frontend-performance-auditor` (coding, already shipped)'s broad Core Web Vitals audit and `bundle-splitting-advisor` (coding, already shipped)'s load-time code-splitting focus: this prompt is narrowly about runtime thread offloading for work that's already loaded and executing.

## When to use it
- Users report jank, frozen UI, or unresponsive input during a specific operation (large data processing, file parsing, image manipulation) and you suspect it's blocking the main thread rather than a network wait.
- You're about to add a computationally heavy feature (client-side search indexing, data transformation, cryptography) and want to decide upfront whether it belongs on the main thread or in a worker.
- You've profiled a page and found long main-thread tasks, but need help deciding which specific pieces of that work are actually safe and worthwhile to move off-thread.

## The Prompt

```
You identify main-thread-blocking work in frontend code and recommend what to offload to a Web Worker, including the interface for doing so safely.

Code or profile description of the slow operation: {{OPERATION_CODE}}
Frontend framework/context: {{FRAMEWORK}}
Symptom observed (jank, input delay, long task duration if known): {{SYMPTOM}}

Instructions:
1. Identify which specific parts of {{OPERATION_CODE}} are CPU-bound and DOM-independent (pure computation, parsing, data transformation) versus which parts require direct DOM/window access (rendering, layout reads, most browser APIs) — only the former can move to a Worker, since Workers have no DOM access.
2. For the DOM-independent parts, recommend the message-passing interface: what data crosses the `postMessage` boundary in each direction, and flag if the input/output data is large enough that serialization cost (structured clone) could offset the offload benefit — if so, recommend `Transferable` objects (e.g. `ArrayBuffer`) instead of a plain object where applicable.
3. If the DOM-dependent and DOM-independent work is currently interleaved in the same function, describe how to split them: the worker does the heavy computation and returns a result; the main thread applies that result to the DOM.
4. Recommend a chunking strategy only if full offload isn't feasible (e.g. progressive results needed for a responsive UI) — don't recommend it as a first resort when a clean full offload is possible, since chunking adds complexity a straightforward worker doesn't need.
5. Note the concrete lifecycle: worker creation cost (don't create one per operation if it runs repeatedly — reuse a persistent worker or a worker pool), and termination/cleanup if the worker isn't needed after one use.
6. If {{FRAMEWORK}} has a specific worker integration pattern (e.g. Comlink for cleaner RPC-style calls, a framework's built-in worker hook), recommend it over raw `postMessage` boilerplate when it meaningfully reduces code complexity.
7. Flag anything that should explicitly NOT move to a worker — e.g. work that's already fast enough that the messaging overhead would net-negative, or work needing synchronous DOM measurement mid-computation.

Output format: Markdown. A "Move to worker" section (what, and the message contract in/out) and a "Keep on main thread" section (what, and why), followed by a minimal code sketch of the worker file and the main-thread call site.
```

## Variables
- `{{OPERATION_CODE}}` — the code, function, or profiler description of the slow operation. Required.
- `{{FRAMEWORK}}` — the frontend framework/build tooling in use (React, Vue, vanilla, Vite, etc.), since worker setup and bundling differ by tool. Required.
- `{{SYMPTOM}}` — what was actually observed (frozen scroll, delayed click response, a specific long-task duration from a profiler). Optional but helps prioritize which part of the code is the actual culprit if multiple candidates exist.

## Example
**Input:** `{{OPERATION_CODE}}` = "`applyFilters(rows)` parses a 50k-row CSV string into objects, runs a multi-field filter/sort, then calls `setState` to re-render the table." `{{FRAMEWORK}}` = "React, Vite" `{{SYMPTOM}}` = "Typing in the filter box freezes the input for ~800ms per keystroke, per DevTools Performance tab"

**Output (excerpt):**
```
### Move to worker
The CSV parse + filter + sort — all pure data transformation with no DOM access — is the ~800ms blocking task. Message contract: main thread posts `{ csvString, filterCriteria }`; worker posts back `{ filteredSortedRows }` as a plain array (size here doesn't warrant Transferable objects).

### Keep on main thread
`setState(filteredSortedRows)` and the actual table re-render — this requires React's reconciliation and DOM updates, which cannot run in a worker.

worker.js:
self.onmessage = (e) => {
  const { csvString, filterCriteria } = e.data;
  const rows = parseCsv(csvString);
  const result = filterAndSort(rows, filterCriteria);
  self.postMessage({ filteredSortedRows: result });
};

Main thread: reuse a single worker instance created once (not per keystroke); on each filter-box change, debounce the postMessage call and update state in the worker's onmessage handler.
```

## Tips & Variations
- Pair with `frontend-performance-auditor` (coding, already shipped) when jank is one symptom among several Core Web Vitals problems — that prompt gives the broader diagnosis; this one designs the specific fix once main-thread blocking is confirmed as the cause.
- If the operation needs to touch large binary data (images, audio buffers), always push toward `Transferable` objects or `SharedArrayBuffer` where available — a naive `postMessage` of a large `ArrayBuffer` copies it by default and can itself become a bottleneck.
- For operations that need to run on every keystroke or scroll event, combine the worker offload with debouncing/throttling on the main-thread trigger — offloading a computation that's still being kicked off too often only moves the jank, it doesn't remove it.

## Changelog
- 1.0.0 (2026-08-31): Initial version.
