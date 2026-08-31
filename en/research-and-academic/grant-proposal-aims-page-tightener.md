---
id: grant-proposal-aims-page-tightener
title: Grant Proposal Aims Page Tightener
category: research-and-academic
tags: [grant-writing, academic-writing]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Tightens a drafted grant proposal specific-aims page for the structural weaknesses that make reviewers hesitate — aims that are secretly dependent on each other, significance framing that restates the field's importance instead of this proposal's specific contribution, and a risk profile that's either too safe to be competitive or too ambitious to be credible in the funding period.

## When to use it
- You've drafted a specific-aims page and want a critical read before it goes to a mentor or co-PI, catching the kind of structural issues a study section would flag rather than line-editing prose.
- You're revising after a prior submission's summary statement flagged the aims as "interdependent" or the significance as "not clearly differentiated," and want to check whether the revision actually fixes that specific critique.
- You're mentoring a junior colleague on their first proposal and want a structured way to explain what makes an aims page competitive beyond "make it clearer."

## The Prompt

```
You tighten a grant proposal's specific-aims page for the structural weaknesses reviewers actually flag — not prose style, and not the science itself, but the proposal's structural logic.

Specific-aims page text: {{AIMS_TEXT}}
Funding mechanism and typical period/budget (e.g. NIH R01, 5 years; NSF standard grant, 3 years): {{MECHANISM}}
Known competing/prior work in this specific area, if any: {{COMPETING_WORK}}

Instructions:
1. Check aim independence: for each aim, could it be pursued and yield meaningful results even if a different aim fails or is delayed? Flag any aim that's actually a precondition for another (e.g. Aim 2's method assumes Aim 1 successfully develops a tool) — reviewers read hidden interdependency as risk to the whole proposal if one aim stalls, and it should either be restructured or the dependency should be explicitly acknowledged with a contingency plan.
2. Check the significance/innovation framing: does it explain why this specific proposal's approach or question hasn't already been addressed, or does it mostly restate the general importance of the broader field (which every proposal in the field could equally claim)? If {{COMPETING_WORK}} is given, check whether the significance section actually differentiates from it explicitly, or leaves a reviewer to wonder how this differs.
3. Check risk calibration across the whole set of aims: is at least one aim safe/incremental enough to guarantee some result even if the more ambitious aims don't fully pan out, and is at least one aim ambitious enough to justify the funding level and be genuinely exciting — a set of aims that's uniformly safe reads as incremental and unfundable; a set that's uniformly ambitious reads as unrealistic for {{MECHANISM}}'s period and budget.
4. Check feasibility against {{MECHANISM}}'s actual timeframe: does each aim's described scope of work look achievable within the stated period, or does it implicitly assume more time/resources than the mechanism provides? Flag any aim whose described work looks like it needs 1.5-2x the stated period.
5. Check that each aim has a clear, falsifiable expected outcome, not just an activity description — "we will investigate X" is an activity; "we will determine whether X causes Y, expecting [specific predicted result]" is a testable aim reviewers can evaluate.
6. Flag any aim that reads as a fishing expedition (open-ended exploration with no stated hypothesis or success criterion) unless the proposal explicitly frames it as an exploratory aim with appropriately scoped-down claims about what it will establish.

Output format: Markdown. For each aim: independence check, risk-level assessment, and feasibility note. Then a Significance/Innovation section addressing point 2. End with an overall risk-profile assessment across the full set (too safe / well-balanced / too ambitious) and the single highest-priority structural fix.
```

## Variables
- `{{AIMS_TEXT}}` — the drafted specific-aims page. Required.
- `{{MECHANISM}}` — the funding mechanism and its typical period/budget, since feasibility and appropriate ambition scale differently by mechanism. Required.
- `{{COMPETING_WORK}}` — known prior or concurrent work in this specific area, if relevant to checking differentiation. Optional, but sharpens the significance/innovation check.

## Example
**Input:** `{{AIMS_TEXT}}` = "Aim 1: Develop a novel assay to measure protein X in tissue samples. Aim 2: Using the assay from Aim 1, measure protein X levels across 200 patient samples and correlate with disease outcome." `{{MECHANISM}}` = "NIH R01, 5 years" `{{COMPETING_WORK}}` = "Not provided"

**Output (excerpt):**
```
### Aim 1
Independence: Yes, standalone — assay development is a self-contained deliverable regardless of Aim 2's outcome.
Risk level: Moderate — assay development has inherent technical risk but is a common, well-precedented type of aim.
Feasibility: Plausible within a 5-year R01 if assay development is the primary early-period focus.

### Aim 2
Independence: **Not independent — this is a critical flag.** Aim 2 explicitly requires Aim 1's assay to exist and work before it can proceed ("using the assay from Aim 1"). If Aim 1's assay development fails, stalls, or takes longer than planned, Aim 2 cannot proceed at all. Reviewers will read this as a single point of failure for half the proposal's aims.
Fix: Either (a) reframe Aim 2 to include a fallback measurement approach that doesn't depend entirely on the novel assay succeeding, or (b) explicitly address this dependency in the approach section with a described contingency plan and preliminary data suggesting Aim 1's assay is very likely to succeed (de-risking it before the aims page is finalized).

### Significance/Innovation
The text as given doesn't specify what makes this correlation study novel relative to existing approaches to measuring protein X — without {{COMPETING_WORK}}, it's not possible to confirm differentiation, but the aims page itself should explicitly state why existing measurement approaches are inadequate for this question, not just that this one is new.

Overall risk profile: Too dependent as structured — the core issue isn't safety vs. ambition but that Aim 2 is not actually independent of Aim 1, which is the single highest-priority fix before any other revision.
```

## Tips & Variations
- Pair with `methodology-section-critique` (research-and-academic, already shipped) once the aims-page structure is solid — that prompt goes deeper into whether the specific methods described for each aim are adequately justified, a level below the structural aims-page check this prompt does.
- Run this early in drafting, not just as a final polish pass — a dependency or risk-calibration problem found late often requires restructuring the whole proposal's narrative, not just editing the aims page in isolation.
- If a prior submission's summary statement is available, feed its specific critiques into {{COMPETING_WORK}} or as additional context — checking whether a revision actually resolves a reviewer's stated concern (not just adds more text near it) is one of the most valuable uses of this prompt.

## Changelog
- 1.0.0 (2026-08-31): Initial version.
