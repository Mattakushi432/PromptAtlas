---
id: results-section-plain-language-summary
title: Results Section Plain-Language Summary
category: research-and-academic
tags: [academic-writing, explain]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Translates a technical, statistics-heavy results section into a plain-language summary for a lay audience or a grant's "broader impacts" section — states what was actually found without overclaiming beyond what the statistics support, distinct from `abstract-compressor-to-word-limit` (research-and-academic, already shipped), which compresses an already-written abstract to a word limit rather than translating technical findings into non-technical language.

## When to use it
- You need a plain-language summary of your results for a grant's broader-impacts or lay-summary section, a press release, or a public-facing report, and want to start from an accurate translation rather than reusing jargon-heavy abstract language.
- You're preparing to explain your findings to a non-specialist audience (a funding panel with mixed expertise, a general public talk) and want to check your own plain-language draft doesn't accidentally overclaim what the statistics actually show.
- You want a sanity check on whether a results section's technical reporting (effect sizes, p-values, confidence intervals) is being represented accurately once translated to lay language, since overclaiming often happens unintentionally during simplification.

## The Prompt

```
You translate a technical results section into a plain-language summary for a non-specialist audience. You state what was actually found, calibrated to the actual strength of the statistical evidence — you do not strengthen a claim beyond what the reported statistics support, even when a stronger-sounding claim would be more compelling to a lay reader.

Results section text (technical/statistical reporting): {{RESULTS_TEXT}}
Intended audience (e.g. general public, a funding panel, science journalists): {{AUDIENCE}}
Target length or format constraint, if any: {{LENGTH_CONSTRAINT}}

Instructions:
1. Identify each specific finding reported in {{RESULTS_TEXT}} and its actual strength of evidence — a statistically significant result with a large effect size supports a more confident plain-language statement than a marginally significant result with a small effect size; the plain-language version must reflect that difference, not flatten every reported finding into equally confident language.
2. Translate statistical terms into plain language without losing the actual meaning: "statistically significant" should become something like "unlikely to be due to chance," not simply dropped or replaced with "proven" or "shown," which overclaims; a confidence interval should be conveyed as a range of plausible values, not a single point estimate presented as precise.
3. Preserve causal vs. correlational distinctions explicitly — if {{RESULTS_TEXT}} reports a correlational finding, the plain-language version must not use causal language ("X causes Y") even if it would read more compellingly; use "associated with" or "linked to" instead, and if useful for {{AUDIENCE}}, briefly note why causation can't be concluded from this design.
4. Calibrate technicality to {{AUDIENCE}} — a funding panel with mixed disciplinary expertise can handle more precision (e.g. naming the specific statistical test) than a general-public summary, which should avoid statistical jargon entirely in favor of plain descriptions of confidence and magnitude.
5. If {{RESULTS_TEXT}} includes a null or non-significant result, represent it accurately as "we didn't find clear evidence for X" rather than either overclaiming a negative finding ("X does not exist") or silently omitting it — a null result is still a real finding worth accurately conveying, especially in a broader-impacts context that should represent the actual state of evidence.
6. If {{LENGTH_CONSTRAINT}} is given, prioritize which findings to include based on which are both strongest in evidence and most relevant to a lay audience's likely interest — don't compress by uniformly shortening every finding, which tends to lose the caveats first and keep only the (falsely) confident-sounding core claim.

Output format: a plain-language paragraph (or bullet list if {{LENGTH_CONSTRAINT}} suggests it), followed by a short "Evidence Strength Check" note confirming each major claim's plain-language phrasing matches its underlying statistical support.
```

## Variables
- `{{RESULTS_TEXT}}` — the technical results section to translate. Required.
- `{{AUDIENCE}}` — who the plain-language summary is for, since technicality and framing should be calibrated to this. Required.
- `{{LENGTH_CONSTRAINT}}` — a word/character limit or format requirement, if one applies (e.g. a grant's 1-page broader-impacts limit). Optional.

## Example
**Input:** `{{RESULTS_TEXT}}` = "A significant positive correlation was found between weekly exercise frequency and self-reported sleep quality (r=.34, p<.01, n=210). No significant association was found between exercise frequency and reported stress levels (p=.42)." `{{AUDIENCE}}` = "General public, for a university press release" `{{LENGTH_CONSTRAINT}}` = "2-3 sentences"

**Output (excerpt):**
```
People who exercised more often each week tended to report better sleep quality, based on a study of 210 participants — this pattern was unlikely to be due to chance, though it's a moderate rather than a very strong link, and it shows an association rather than proof that exercise directly causes better sleep. The same study didn't find a clear connection between how often people exercised and how stressed they reported feeling.

Evidence Strength Check: "tended to report better sleep quality... unlikely to be due to chance... moderate... association rather than proof" accurately reflects r=.34 (moderate effect), p<.01 (significant, low chance likelihood), and correlational (not experimental) design. The stress finding is represented as a genuine null result ("didn't find a clear connection") rather than omitted or overstated as "exercise doesn't affect stress," which the non-significant p-value alone doesn't establish.
```

## Tips & Variations
- Pair with `abstract-compressor-to-word-limit` (research-and-academic, already shipped) when both a plain-language summary and a compressed technical abstract are needed for the same paper — they solve different problems (audience translation vs. length compression of already-technical language) and often both need to exist for the same submission.
- If {{RESULTS_TEXT}} includes multiple findings of very different evidence strength, resist blending them into one uniformly-confident paragraph — a reader should be able to tell which finding is the strong one and which is more tentative from the language alone.
- For a broader-impacts section specifically, check the target funder's actual guidance on claims language (some agencies have explicit rules against overclaiming in lay summaries) in addition to this prompt's general accuracy check.

## Changelog
- 1.0.0 (2026-08-31): Initial version.
