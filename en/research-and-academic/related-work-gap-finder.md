---
id: related-work-gap-finder
title: Related Work Gap Finder
category: research-and-academic
tags: [literature-review, research]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Flags adjacent research areas or angles that appear under-covered in a drafted related-work section given what the paper claims to contribute — the kind of gap a reviewer flags as "the authors seem unaware of X" — by naming the kind of area or work likely missing, never by inventing a specific fake citation, author, or paper title.

## When to use it
- You've drafted a related-work section and want a check for the specific kind of omission reviewers flag before submission — not whether the writing is clear, but whether an entire adjacent angle or literature seems to be missing.
- You're revising after a reviewer said "the authors don't engage with X" and want a systematic pass to check whether other similar gaps exist elsewhere in the section, not just the one already flagged.
- You're new to a subfield and want a structured way to sanity-check whether your related-work section reflects the field's actual breadth or is narrower than a specialist would expect.

## The Prompt

```
You review a related-work section for adjacent research areas or angles that appear missing or under-covered, given what the paper claims to contribute. You identify the KIND of gap — a research area, a methodological angle, a category of prior work — you do NOT invent a specific citation, author name, paper title, or publication year that you cannot verify exists. Fabricating a citation in this context is actively harmful, since it could be copied directly into a paper as a false reference.

Related-work/literature-review section text: {{RELATED_WORK_TEXT}}
The paper's actual claimed contribution: {{CONTRIBUTION}}
Field/subfield: {{FIELD}}

Instructions:
1. Identify what {{RELATED_WORK_TEXT}} currently covers — group the cited work by the specific angle or approach each cluster represents (e.g. "prior work on measurement method A," "prior work on population B"), so gaps can be assessed by comparing angles covered against angles you'd expect for this {{CONTRIBUTION}} in {{FIELD}}.
2. Given {{CONTRIBUTION}}, identify adjacent research angles that a well-read reviewer in {{FIELD}} would expect to see addressed but that {{RELATED_WORK_TEXT}} doesn't appear to cover — describe the angle itself specifically (e.g. "work applying a similar method to a different but comparable population," "the methodological critique literature around this measurement approach") rather than a vague "more literature review needed."
3. Do not name a specific author, paper title, or year for any gap you identify — you do not have reliable knowledge of exactly what exists in the current literature, and a fabricated-sounding but wrong citation is worse than an accurately-described gap with no citation attached. If you have genuine, verifiable knowledge of a specific highly-relevant work, you may name it, but flag your own uncertainty explicitly rather than stating it with unearned confidence.
4. For each gap identified, explain specifically why a reviewer would flag it given {{CONTRIBUTION}} — e.g. "this paper claims novelty in applying method X to population Y, but doesn't address whether X has already been applied to comparable population Z, which a reviewer familiar with that adjacent literature would likely ask about."
5. Distinguish gaps that would materially threaten the novelty claim (a reviewer might argue this exact contribution already exists in an unaddressed area) from gaps that are more about breadth/context (the section would be stronger with this angle addressed, but the paper's core contribution isn't threatened by its absence) — these need very different levels of urgency to address before submission.
6. If {{RELATED_WORK_TEXT}} actually does appear to cover the field's major adjacent angles reasonably well given {{CONTRIBUTION}}, say so directly rather than manufacturing a gap to seem thorough.

Output format: Markdown. For each gap: the specific angle/area missing, why it matters given {{CONTRIBUTION}}, and whether it threatens the novelty claim or is a breadth/context gap. End with an explicit reminder that the author should independently verify what specific work actually exists in each flagged area — this tool identifies where to look, not what to cite.
```

## Variables
- `{{RELATED_WORK_TEXT}}` — the drafted related-work or literature-review section. Required.
- `{{CONTRIBUTION}}` — what the paper actually claims as its novel contribution, since gaps can only be assessed relative to what needs to be differentiated from prior work. Required.
- `{{FIELD}}` — the specific field/subfield, since what counts as an expected adjacent area varies substantially by discipline and subfield maturity. Required.

## Example
**Input:** `{{RELATED_WORK_TEXT}}` = "Prior work has examined social media's effect on adult mental health outcomes using survey methods (citing 4 studies). Other work has focused on adolescent social media use patterns without linking to mental health outcomes (citing 3 studies)." `{{CONTRIBUTION}}` = "We are the first to examine the specific link between passive social media use and depression symptoms in adolescents using a longitudinal design." `{{FIELD}}` = "Developmental psychology / media studies"

**Output (excerpt):**
```
### Gap: passive vs. active use distinction in the adult literature
{{RELATED_WORK_TEXT}} cites adult mental-health studies but doesn't specify whether any of them examined the passive/active use distinction that {{CONTRIBUTION}} centers on — if the adult literature already established this distinction as meaningful (or found it wasn't meaningful), that's directly relevant context missing here. This threatens the novelty framing somewhat: a reviewer familiar with the passive/active use literature (a well-established angle in social media research broadly) will likely ask whether this exact distinction has already been studied longitudinally in adults, even if not adolescents specifically.
Urgency: Moderate-to-high — this is close enough to the paper's core claim that its absence could prompt a reviewer to question the novelty framing directly.

### Gap: longitudinal design precedent
{{RELATED_WORK_TEXT}} doesn't mention whether any longitudinal (as opposed to cross-sectional/survey) work exists in either the adult or adolescent social-media literature. Since {{CONTRIBUTION}} specifically claims novelty partly on the longitudinal design, the section should address whether longitudinal designs have been used elsewhere in this broader area (even on different populations or different social-media behaviors) — a reviewer is likely to ask this directly.
Urgency: High — this is a direct component of the novelty claim itself.

Reminder: These gaps identify areas to search, not specific papers to cite — verify what actually exists in each flagged area through your own literature search before drafting citations; do not treat this output as containing citable references.
```

## Tips & Variations
- Pair with `research-question-sharpener` (research-and-academic, already shipped) earlier in the process if a flagged gap suggests the paper's actual novelty claim needs re-scoping — sometimes a related-work gap reveals that {{CONTRIBUTION}} was framed too broadly relative to what's genuinely new.
- Run a literature database search (Google Scholar, a field-specific database) immediately after getting this output, while the flagged angles are still specific and fresh — the value of this prompt is directing a real search efficiently, not replacing one.
- If this prompt happens to name a specific paper it has genuine, verifiable knowledge of, still independently confirm that citation's existence, authors, and year before using it — treat any specific citation from this prompt as a lead to verify, not a ready-to-use reference.

## Changelog
- 1.0.0 (2026-08-31): Initial version.
