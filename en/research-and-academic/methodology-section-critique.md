---
id: methodology-section-critique
title: Methodology Section Critique
category: research-and-academic
tags: [research-design, academic-writing]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Critiques a drafted methodology section for the specific gaps that get flagged in peer review — unjustified sample size, unaddressed confounds, a measurement choice that doesn't actually operationalize the stated construct, and missing detail a replication would need — rather than a general "this could be clearer" pass.

## When to use it
- You've drafted a methodology section and want a critical read before it goes to an advisor or co-author, catching the kind of gaps a reviewer would flag rather than just polishing prose.
- You're reviewing someone else's methods section (as a co-author, committee member, or peer reviewer) and want a structured way to identify substantive gaps, not just stylistic feedback.
- You're revising after reviewer comments about methodology and want to check whether your revision actually closes the specific gaps raised, not just adds more words around the same gap.

## The Prompt

```
You critique a methodology section for substantive research-design gaps — the kind that get flagged in peer review — not prose style or grammar.

Methodology section text: {{METHODS_TEXT}}
Research question(s) being addressed: {{RESEARCH_QUESTION}}
Field/discipline (methodological norms vary): {{FIELD}}

Instructions:
1. Check that each construct in {{RESEARCH_QUESTION}} has an actual operational definition and measurement described in {{METHODS_TEXT}} — a construct mentioned in the research question but not clearly measured (or measured with an instrument whose validity for this construct isn't established) is a substantive gap, not a wording issue.
2. Check the sample: is the sample size justified (a power analysis, a precedent from comparable studies, or an explicit acknowledgment of exploratory/limited scope) rather than just stated as a number with no rationale? Is the sampling method described specifically enough that selection bias could be assessed?
3. Check for unaddressed confounds or alternative explanations that a reviewer in {{FIELD}} would likely raise given the study design — not every possible confound, but the ones a knowledgeable reviewer in this specific field would actually flag as material to this particular design.
4. Check for missing procedural detail that a replication attempt would need — timing/sequence of measures, exact instructions given to participants, handling of missing data or exclusions — vague procedural description is one of the most common and most fixable methodology gaps.
5. Check that the analysis plan described actually matches what {{RESEARCH_QUESTION}} requires — a mismatch between a correlational research question and a described analysis that would only support a much weaker or much stronger claim than intended.
6. Flag any ethical/IRB consideration that's conspicuously unaddressed given the study design (e.g. vulnerable populations, deception, sensitive data) if {{METHODS_TEXT}} doesn't mention it — even if full ethics detail belongs elsewhere in the paper, its complete absence here is worth a note.

Output format: Markdown. For each finding: the specific gap, why it matters (what a reviewer would actually challenge), and what additional detail or justification would close it. End with a one-line overall assessment: methodologically sound as described, or specific gaps to close before this is submission-ready.
```

## Variables
- `{{METHODS_TEXT}}` — the drafted methodology section. Required.
- `{{RESEARCH_QUESTION}}` — the research question(s) the study is meant to address, so the methods can be checked against what they're actually supposed to support. Required.
- `{{FIELD}}` — the academic field, since methodological norms and what counts as an adequately-justified sample or a material confound vary substantially by discipline. Required.

## Example
**Input:** `{{METHODS_TEXT}}` = "We recruited 45 participants via convenience sampling from an undergraduate psychology pool. Participants completed a survey measuring social media use and self-reported wellbeing." `{{RESEARCH_QUESTION}}` = "Is passive social media use associated with lower wellbeing?" `{{FIELD}}` = "Psychology, undergraduate honors thesis"

**Output (excerpt):**
```
### Finding: "social media use" not operationalized as passive vs. active
{{RESEARCH_QUESTION}} specifically asks about passive use, but {{METHODS_TEXT}} only says the survey measures "social media use" generically — it's not clear the instrument actually distinguishes passive scrolling from active posting/commenting, which is the specific construct the research question depends on.
Fix: specify the exact measure used and confirm it distinguishes passive from active use as separate subscales or items, not a single generic usage score.

### Finding: sample size (n=45) has no stated justification
No power analysis or precedent cited for why 45 is adequate to detect the expected association. For an undergraduate thesis this may be an acceptable practical constraint, but it should be stated explicitly as a limitation rather than left silent, since a reviewer will otherwise flag it as an unexamined gap.
Fix: add a brief note on sample size rationale (even if it's simply "constrained by course timeline and available participant pool, treated as an exploratory/pilot sample").

Overall: Specific gaps to close before submission-ready — primarily the construct-operationalization mismatch, which is the most substantive of the two findings since it affects whether the study can actually answer {{RESEARCH_QUESTION}} as stated.
```

## Tips & Variations
- Pair with `research-question-sharpener` (research-and-academic, already shipped) if this critique reveals the methodology gap actually traces back to an underspecified research question — sometimes the fix belongs upstream, in sharpening what's being asked, rather than in the methods section itself.
- Run this again after revision, not just once — checking whether a specific flagged gap was actually closed (not just addressed with more words) is often more useful than a single pre-submission pass.
- This prompt assumes a methodology section for an empirical study; for a purely theoretical or computational methods section, several checks (sampling, confounds) won't apply — adapt by focusing on whichever checks are relevant to the actual study design.

## Changelog
- 1.0.0 (2026-08-31): Initial version.
