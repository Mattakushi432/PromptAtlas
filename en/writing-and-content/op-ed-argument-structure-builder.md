---
id: op-ed-argument-structure-builder
title: Op-Ed Argument Structure Builder
category: writing-and-content
tags: [content-creation, copywriting]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-01
---

## Description
Structures a persuasive op-ed's argument sequence before prose drafting begins — orders claims and evidence for maximum persuasive force, and specifically checks that the strongest counter-argument is anticipated and addressed rather than ignored, since an op-ed that never engages its strongest objection reads as one-sided to a skeptical reader even when each individual point is well-made.

## When to use it
- You have a position and some scattered supporting points for an op-ed or persuasive essay, and want the argument sequence structured before writing full prose, so a weak ordering doesn't get discovered mid-draft.
- A drafted op-ed feels unpersuasive even though the individual points seem reasonable, and you suspect the structure — not the writing quality — is the problem.
- You want to check whether your argument has actually engaged the strongest counter-argument, or has been written in an echo chamber that never seriously considers the other side.

## The Prompt

```
You structure a persuasive op-ed's argument sequence before prose is drafted. You are planning argument order and counter-argument handling — not writing full prose.

Core position/thesis: {{THESIS}}
Supporting points (however unordered): {{SUPPORTING_POINTS}}
Target audience and their likely starting position: {{AUDIENCE}}

Instructions:
1. State the thesis as a single, clear, arguable claim — not a topic ("the problem with X") but an actual position ("X should happen because Y"). If {{THESIS}} as given is really a topic rather than a claim, sharpen it into one before structuring anything else.
2. Order {{SUPPORTING_POINTS}} for persuasive sequence, not just logical sequence — given {{AUDIENCE}}'s likely starting position, decide whether to lead with the strongest point (grabs a skeptical reader's attention immediately) or build to it (establishes shared ground first with a more receptive reader before the strongest claim). State which approach you're using and why, given {{AUDIENCE}}.
3. Identify the single strongest counter-argument to {{THESIS}} — not a weak, easily-dismissed objection, but the version of the opposing view a smart, informed skeptic would actually raise. If {{SUPPORTING_POINTS}} doesn't address this, flag that as a structural gap before proceeding.
4. Plan specifically where and how the counter-argument gets addressed: acknowledging it too early (before the reader has reason to care about the thesis) undersells the argument's own case; addressing it too late (after the reader has already mentally dismissed it as unaddressed) reads as evasive. Recommend a specific placement given the overall structure.
5. For each supporting point, note what kind of evidence would actually strengthen it (a statistic, a specific example, an authoritative source, a personal anecdote) — this prompt plans structure, not the prose itself, so it should specify what's needed rather than inventing evidence that isn't in {{SUPPORTING_POINTS}}.
6. Plan the close: does the argument build to a specific call to action or position statement, or does it just stop once the points run out? A structural close needs to be planned as deliberately as the opening.

Output format: Markdown with sections: Sharpened Thesis, Argument Sequence (ordered points with rationale for the order), Strongest Counter-Argument & Where to Address It, Evidence Needs (per point), and Closing Approach.
```

## Variables
- `{{THESIS}}` — the core position, even if currently phrased as a topic rather than a sharp claim. Required.
- `{{SUPPORTING_POINTS}}` — the scattered points/evidence in hand, in whatever order they currently exist. Required.
- `{{AUDIENCE}}` — who this is being written for and their likely starting position on the thesis (already sympathetic, neutral, skeptical). Required — this determines both the ordering strategy and how the counter-argument should be handled.

## Example
**Input:** `{{THESIS}}` = "Remote work policies" (stated as a topic) `{{SUPPORTING_POINTS}}` = "Productivity data shows no meaningful drop in remote settings. Employees report higher satisfaction. Some companies have had culture/collaboration challenges. Commute time savings are substantial." `{{AUDIENCE}}` = "Business leaders skeptical of remote work, likely to have heard the productivity argument before and be unmoved by it"

**Output (excerpt):**
```
### Sharpened Thesis
"Companies should default to remote-friendly policies, not because productivity data alone proves it, but because the culture/collaboration challenges it introduces are solvable with intentional practices — while the alternative (mandating in-office work) forecloses benefits that are much harder to recover once lost (talent access, retention, commute-time savings)."

### Argument Sequence
Given {{AUDIENCE}} has likely already heard and discounted the productivity argument, don't lead with it — leading with an argument the audience is primed to dismiss wastes the opening. Instead: 1) Open with the culture/collaboration challenge directly — naming it first, before the audience assumes you're avoiding it, builds credibility with a skeptical reader. 2) Present it as solvable (not denied) with specific practices. 3) Then bring in productivity data as supporting, not leading, evidence. 4) Close with the harder-to-reverse costs of the alternative (talent/retention), which is likely a fresher argument to this audience than the productivity point they've already discounted.

### Strongest Counter-Argument & Where to Address It
Strongest counter: informal knowledge transfer and mentorship genuinely happen more easily in person, and this is a real cost remote setups struggle to fully replace, not just a solvable logistics problem. {{SUPPORTING_POINTS}} treats culture/collaboration challenges vaguely rather than engaging this specific, credible version of the objection. Address it in the opening section (per the sequence above) — acknowledging the specific mentorship/knowledge-transfer cost directly, rather than a vague "culture challenges," is what will actually earn credibility with a skeptical business-leader audience.

### Evidence Needs
- Culture/collaboration challenges: needs a specific example of a practice that addresses the mentorship-transfer gap (not just an assertion that it's "solvable").
- Productivity data: needs the actual source/study, since {{AUDIENCE}} has likely seen generic productivity claims before and will discount an uncited one.
```

## Tips & Variations
- Pair with `ruthless-line-editor` (writing-and-content, already shipped) once the full prose is drafted from this structure — that prompt tightens the actual sentences; this prompt only plans the argument architecture beforehand, deliberately before any prose exists.
- If step 3 reveals {{SUPPORTING_POINTS}} genuinely has no good answer to the strongest counter-argument, that's important signal before drafting — either the thesis needs qualifying, or more research is needed to find a real response, rather than writing prose that will read as evasive to exactly the skeptical readers {{AUDIENCE}} describes.
- For an audience already sympathetic to {{THESIS}}, the counter-argument handling can be lighter (a brief acknowledgment rather than extended engagement) — this prompt's emphasis on addressing the strongest objection matters most when {{AUDIENCE}} is neutral or skeptical, not preaching to an already-converted readership.

## Changelog
- 1.0.0 (2026-09-01): Initial version.
