---
id: structured-output-schema-repair-advisor
title: Structured Output Schema Repair Advisor
category: agents-and-automation
tags: [tool-use, specification, debugging, prompt-engineering]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-06
---

## Description
Diagnoses why a model's structured output (JSON, XML, or similar) failed to validate against its target schema, and proposes a prompt-level fix — clarifying an ambiguous field, adding a missing few-shot example, simplifying an over-nested schema, or addressing truncation — instead of just patching the parser to tolerate the bad output.

## When to use it
- A model-generated JSON response fails schema validation (missing field, wrong type, extra field, truncated output) and you want the actual cause, not just a workaround.
- The failure is intermittent — it validates most of the time but occasionally breaks — and you want to know which part of the prompt or schema is the weak point.
- You're about to add defensive parsing code around a structured-output call and want to first check whether a prompt-level fix would remove the need for it entirely.

## The Prompt

```
You diagnose why a model's structured output failed schema validation and propose a prompt-level fix.

The target schema (JSON Schema, TypeScript type, or plain description of required fields/types): {{TARGET_SCHEMA}}
The actual malformed output the model produced: {{MALFORMED_OUTPUT}}
The validation error, if you have one (e.g. "missing required field 'status'", "expected number, got string"): {{VALIDATION_ERROR}}
The prompt or instructions that produced this output: {{ORIGINAL_PROMPT}}

Instructions:
1. Classify the root cause into one of: (a) ambiguous field description in {{ORIGINAL_PROMPT}} or {{TARGET_SCHEMA}} that the model reasonably misread, (b) missing or insufficient example — the model had no concrete pattern to copy, (c) schema too complex for a single pass (too many nested levels or conditional fields for the model to track at once), (d) output truncation — the response was cut off before completing valid structure, (e) competing instructions — a system-level default (e.g. "always explain your reasoning") fought with the format requirement. Quote the specific part of {{ORIGINAL_PROMPT}} or {{TARGET_SCHEMA}} that supports your classification.
2. If the cause is ambiguous wording (a): propose the exact rewritten field description or instruction line, not just "make it clearer."
3. If the cause is a missing example (b): write one concrete example output that satisfies {{TARGET_SCHEMA}}, formatted exactly as it should appear in the prompt.
4. If the cause is schema complexity (c): propose a concrete simplification — splitting into two sequential calls, flattening a nested structure, or making an optional field's absence unambiguous — not just "simplify it."
5. If the cause is truncation (d): recommend a specific fix (increase max output tokens, ask for the largest/most-likely-to-truncate field first, or split the response across multiple calls) based on where in {{MALFORMED_OUTPUT}} the cutoff occurs.
6. If the cause is competing instructions (e): identify the specific competing instruction and propose how to resolve the conflict (e.g. moving the format requirement to the very end of the prompt, or explicitly stating which instruction takes precedence).
7. State the prompt-level fix as a drop-in replacement for the relevant part of {{ORIGINAL_PROMPT}} — something that can be pasted back in directly, not a description of what to change.
8. If a genuinely parser-level fallback still makes sense in addition to the prompt fix (e.g. stripping markdown code fences the model adds despite instructions), say so explicitly and explain why the prompt fix alone won't fully cover it.

Output format: Markdown with sections: Root Cause, Evidence, Prompt-Level Fix (drop-in text), Remaining Parser-Level Consideration (if any).
```

## Variables
- `{{TARGET_SCHEMA}}` — the schema the output must satisfy, in whatever form you have it (JSON Schema, TypeScript type, or plain-language field list). Required.
- `{{MALFORMED_OUTPUT}}` — the actual bad output the model produced. Required.
- `{{VALIDATION_ERROR}}` — the specific validation error message, if available. Optional but sharpens the diagnosis.
- `{{ORIGINAL_PROMPT}}` — the prompt or instructions that produced the malformed output. Required — without it this is guesswork about a parser fix, not a prompt fix.

## Example
**Input:** `{{TARGET_SCHEMA}}` = `{ "status": "pending" | "approved" | "rejected", "reviewer_notes": string, "confidence": number (0-1) }` `{{MALFORMED_OUTPUT}}` = `{"status": "Approved", "reviewer_notes": "Looks good, minor typo in section 2.", "confidence": "high"}` `{{VALIDATION_ERROR}}` = `expected number for 'confidence', got string; 'status' value 'Approved' does not match enum (case mismatch)` `{{ORIGINAL_PROMPT}}` = "Review this document and output status, reviewer_notes, and your confidence."

**Output (excerpt):**
```
### Root Cause
Ambiguous field description (a), on two fields. {{ORIGINAL_PROMPT}} says "output status" and "your confidence" without specifying the exact enum casing or the numeric scale — the model reasonably defaulted to natural-language conventions ("Approved" capitalized like a sentence, "high" as a natural confidence word) since {{TARGET_SCHEMA}}'s exact enum values and numeric range were never stated in the prompt itself, only in a schema the model may not have been shown verbatim.

### Evidence
"output status, reviewer_notes, and your confidence" gives no casing or scale — nothing in the prompt text tells the model status must be exactly one of `pending`/`approved`/`rejected` (lowercase) or that confidence must be a 0-1 number rather than a qualitative word.

### Prompt-Level Fix
Replace "output status, reviewer_notes, and your confidence" with:
"Output exactly these three fields as JSON: `status` (must be exactly one of the lowercase strings `pending`, `approved`, or `rejected` — no other casing or wording), `reviewer_notes` (a string), `confidence` (a number between 0 and 1, e.g. 0.85 — not a word like 'high')."

### Remaining Parser-Level Consideration
None needed here — both failures trace to missing information in the prompt, not model formatting habits; a parser-level case-insensitive-enum fallback would mask this prompt gap rather than fix it.
```

## Tips & Variations
- Distinct from `tool-schema-reviewer` (agents-and-automation, already shipped), which reviews a tool/function definition's schema quality before deployment — this prompt instead diagnoses an actual failed output after the fact, for structured-output tasks generally, not only tool-call arguments.
- Distinct from `tool-use-trace-reviewer` (agents-and-automation, already shipped), which diagnoses a full multi-step tool-call trace (planning error vs. misinterpretation vs. bad tool result vs. schema gap) — this prompt is narrower and deeper on just the "schema gap" case, for single-shot structured-output generation rather than a multi-step agent trace.
- If the same schema keeps failing across many different prompts, that's a signal the schema itself (not any one prompt) is the weak point — consider running this prompt on 2-3 different failure instances and looking for a shared root cause before rewriting every prompt individually.
- Feed {{MALFORMED_OUTPUT}} exactly as the model produced it, including any stray markdown fences or trailing text — don't pre-clean it, since where the malformation occurs is diagnostic evidence.

## Changelog
- 1.0.0 (2026-09-06): Initial version.
