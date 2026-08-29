---
id: stack-trace-interpreter
title: Stack Trace Interpreter
category: coding
tags: [debugging, error-handling, troubleshooting]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Turns a raw stack trace or error message into a plain-language explanation of what actually happened and a ranked list of likely root causes — for anyone, from a beginner confused by a wall of text to a senior engineer triaging quickly.

## When to use it
- Hitting an unfamiliar error/exception type and wanting to understand it before diving into the code.
- Triaging an error report from a user or log aggregator with limited surrounding context.
- Teaching a junior engineer how to actually read a stack trace instead of just pasting it into a search engine.

## The Prompt

```
You are explaining an error to a developer who wants to understand it, not just get a fix pasted at them.

Stack trace / error message:
{{ERROR_MESSAGE}}

Relevant code (optional, if you have the file(s) the trace points to):
{{RELEVANT_CODE}}

Language/runtime: {{LANGUAGE_OR_RUNTIME}}

Instructions:
1. In plain language, explain what this error type means in general (e.g., "a NullPointerException means code tried to call a method on a reference that was never assigned an object").
2. Walk the stack trace from the top frame down, explaining what each relevant frame was doing when the error hit — skip framework/library noise frames unless they're informative, but say you're skipping them.
3. List the most likely root causes, ranked by probability given the trace and any code provided — not just "the top frame is the issue," since the true cause is often a few frames up.
4. For each likely cause, state what evidence in the trace/code supports it and what you'd check to confirm or rule it out.
5. If the trace is truncated, garbled, or missing key frames, say what's missing and what additional info (full trace, surrounding code, input that triggered it) would let you narrow it down further — don't guess with false confidence.
6. Give one or two concrete next steps (a specific log to check, a breakpoint to set, a value to print) — not a generic "check your logic."

Output format: Markdown with headings: What This Error Means, Trace Walkthrough, Likely Causes (ranked), Next Steps.
```

## Variables
- `{{ERROR_MESSAGE}}` — the stack trace or error text, as complete as available. Required.
- `{{LANGUAGE_OR_RUNTIME}}` — e.g. "Python 3.12", "Node.js 20", "Java 21 / Spring". Required — trace format and common causes differ by runtime.
- `{{RELEVANT_CODE}}` — the source of the file(s)/function(s) named in the trace. Optional but sharply improves accuracy.

## Example
**Input:** `{{LANGUAGE_OR_RUNTIME}}` = "Node.js", `{{ERROR_MESSAGE}}` = `TypeError: Cannot read properties of undefined (reading 'id')` at `getUserName (user.js:14)`.

**Output (excerpt):**
```
## What This Error Means
A `TypeError: Cannot read properties of undefined` means the code accessed a property (`.id`) on a value that turned out to be `undefined`, not the object it expected.

## Likely Causes (ranked)
1. **Most likely:** `getUserName` is called with a `user` argument that's `undefined` — e.g., an upstream lookup (database query, API call) returned nothing and the result wasn't checked before being passed in.
2. Less likely: the object exists but its `.id` field itself is legitimately missing due to a schema change.

## Next Steps
- Log the value of `user` right before it's passed to `getUserName` at the call site.
- Check whether the upstream lookup has an error/not-found path that isn't being handled.
```

## Tips & Variations
- For a beginner audience, ask it to add a one-paragraph "in general, here's how to read a stack trace" primer before the specific analysis.
- Paste multiple traces from the same incident together and ask it to identify whether they share a root cause — useful for triaging a spike of similar errors.

## Changelog
- 1.0.0 (2026-08-29): Initial version.
