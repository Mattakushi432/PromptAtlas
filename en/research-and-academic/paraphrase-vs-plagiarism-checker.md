---
id: paraphrase-vs-plagiarism-checker
title: Paraphrase-vs-Plagiarism Checker
category: research-and-academic
tags: [citation, academic-writing]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Checks a paraphrased passage against its source for the specific patterns that make a paraphrase count as inadequate — structure copied with only synonyms swapped, unattributed original phrasing kept intact, or the source's actual argument silently altered — distinct from a plagiarism-detection tool that only matches text strings, since this checks the substance of the paraphrase, not just surface similarity.

## When to use it
- You've paraphrased a source and want to check it's genuinely your own restatement, not a "patchwriting" pattern (synonym-swapped but same sentence structure) that would still count as inadequate paraphrasing even without exact-string matches.
- You're reviewing a student's or collaborator's paraphrased section and want a systematic check beyond running it through a similarity-detection tool, which catches exact matches but misses close-structure patchwriting.
- You want to double-check that a paraphrase hasn't accidentally distorted the source's actual claim while changing its wording — a different but common paraphrasing failure than copying.

## The Prompt

```
You check a paraphrased passage against its source for inadequate paraphrasing and accidental misrepresentation — not just exact-text matching, which a plagiarism-detection tool already handles, but the substantive patterns that make a paraphrase inadequate even when no exact strings match.

Original source passage: {{SOURCE_TEXT}}
Paraphrased passage: {{PARAPHRASE}}
Citation as currently included (if any): {{CITATION}}

Instructions:
1. Check for patchwriting: does {{PARAPHRASE}} follow the same sentence-by-sentence structure and argument order as {{SOURCE_TEXT}}, with mostly synonym substitutions rather than genuine restructuring? This is the most common inadequate-paraphrase pattern and is not caught by exact-match plagiarism checkers, since no string matches exactly.
2. Check for retained original phrasing: any distinctive phrase, technical term coined by the source, or memorable turn of phrase copied verbatim (even a short one) without quotation marks needs either to be quoted directly or genuinely reworded — flag each instance specifically, quoting both the source phrase and where it appears unquoted in {{PARAPHRASE}}.
3. Check for meaning drift: does {{PARAPHRASE}} actually represent the same claim, scope, and confidence level as {{SOURCE_TEXT}}, or has the act of rewording subtly strengthened, weakened, or shifted the original claim (e.g. the source says "may suggest" and the paraphrase says "shows," or the source's qualified claim about one population becomes an unqualified general claim)?
4. Check the citation: does {{CITATION}} appear in a position that makes clear which specific claims are attributed to this source, especially if {{PARAPHRASE}} spans multiple sentences — a single citation at the end of a long paraphrased passage can leave it ambiguous which specific claims are the source's versus the writer's own synthesis.
5. If {{PARAPHRASE}} combines ideas from the source with the writer's own added interpretation or synthesis, check that the boundary between "this is what the source says" and "this is my own added point" is actually clear to a reader, not blurred.
6. For any finding, don't just flag it — show a genuinely restructured version (not just more synonym swaps) that would resolve it, so the fix is concrete rather than abstract.

Output format: Markdown. For each finding: the specific issue (patchwriting / retained phrasing / meaning drift / citation clarity), the exact evidence from both texts, and a corrected version of the affected sentence(s). End with an overall verdict: adequate paraphrase, or specific revisions needed.
```

## Variables
- `{{SOURCE_TEXT}}` — the original passage being paraphrased. Required.
- `{{PARAPHRASE}}` — the paraphrased version to check. Required.
- `{{CITATION}}` — the citation as currently placed in the paraphrased text, if any. Optional, but needed for the citation-placement check.

## Example
**Input:** `{{SOURCE_TEXT}}` = "Social media platforms employ variable-ratio reinforcement schedules, similar to slot machines, to maximize user engagement through unpredictable reward timing." `{{PARAPHRASE}}` = "Social media apps use variable-ratio reward schedules, like slot machines, to maximize engagement via unpredictable reward timing." `{{CITATION}}` = "(Smith, 2023)"

**Output (excerpt):**
```
### Finding: Patchwriting
{{PARAPHRASE}} follows the exact sentence structure of {{SOURCE_TEXT}} with only "platforms" → "apps" and "employ" → "use" substituted — "variable-ratio reinforcement schedules," "similar to/like slot machines," "maximize user engagement," and "unpredictable reward timing" are all retained near-verbatim. This is patchwriting, not paraphrasing, even though no single long string matches exactly.
Fix: restructure genuinely — e.g. "Because unpredictable rewards are especially effective at sustaining engagement (as in slot-machine design), social media platforms are built around this same variable-ratio principle (Smith, 2023)." This restates the actual claim (unpredictable reward timing drives engagement, via the slot-machine analogy) with different structure and emphasis, not just swapped words.

### Finding: retained phrasing
"Variable-ratio reinforcement schedules" is a specific technical term from the source, kept nearly verbatim ("variable-ratio reward schedules"). If this exact terminology is necessary, quote it directly: Smith (2023) describes this as "variable-ratio reinforcement schedules" — otherwise, use a more independent restatement.

Overall: Specific revisions needed — this is patchwriting despite passing a simple string-similarity check, since the structure and near-all vocabulary are retained.
```

## Tips & Variations
- Run this alongside, not instead of, an actual similarity-detection tool (Turnitin, etc.) — that tool catches exact-string matches this prompt might not weight as heavily; this prompt catches structural patchwriting that exact-match tools miss entirely. The two checks are complementary, not redundant.
- For a paraphrase that turns out to need the source's exact wording for precision (a technical definition, a legal standard), the right fix is often a direct quotation rather than forced paraphrasing — don't treat "must be paraphrased" as a fixed rule when quoting is the more honest and clearer option.
- If checking multiple paraphrased passages from the same source across a paper, watch for a pattern where the writer's own critical voice never actually appears — if every passage is a close restatement of the source with no added analysis or synthesis, that's a broader issue beyond any single paraphrase's technical adequacy.

## Changelog
- 1.0.0 (2026-08-31): Initial version.
