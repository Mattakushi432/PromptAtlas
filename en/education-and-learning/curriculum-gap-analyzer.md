---
id: curriculum-gap-analyzer
title: Curriculum Gap Analyzer
category: education-and-learning
tags: [curriculum-design, education]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Checks a course or curriculum's actual content against its stated learning objectives — finding objectives no unit actually teaches toward, units that don't clearly serve any stated objective, and sequencing problems where a later unit assumes knowledge the curriculum hasn't taught yet — rather than a general "is this curriculum good" review.

## When to use it
- You're designing or revising a course and want to check that every stated learning objective is actually covered by specific content, not just implied.
- You inherited someone else's curriculum and want to understand what it's actually teaching versus what it claims to teach before revising it.
- Students consistently struggle with a specific unit, and you suspect a missing prerequisite earlier in the sequence rather than a problem with that unit itself.

## The Prompt

```
You analyze a curriculum for gaps between its stated learning objectives and its actual content and sequencing — you do not evaluate teaching quality or pedagogy, only whether the structure delivers on what it claims to.

Stated learning objectives: {{OBJECTIVES}}
Curriculum content (units/lessons in sequence, with a brief description of what each covers): {{CURRICULUM_CONTENT}}

Instructions:
1. For each objective in {{OBJECTIVES}}, check whether {{CURRICULUM_CONTENT}} contains at least one unit that directly teaches toward it — not just touches on it tangentially. Flag any objective with no clearly corresponding unit as an uncovered objective.
2. For each unit in {{CURRICULUM_CONTENT}}, check whether it clearly serves at least one stated objective — flag any unit that doesn't map to anything in {{OBJECTIVES}} as an orphan unit (it may still be valuable, but it's outside what's officially being assessed/claimed, which is worth knowing).
3. Check sequencing: for each unit, does it assume knowledge or skills that are only taught in a later unit? Trace this explicitly — name the specific prerequisite concept and which later unit is where it's actually introduced.
4. Check for objectives that are covered too early relative to when they'd actually be needed, or too late relative to when a later unit depends on them — timing gaps in either direction cause real problems, not just missing-content gaps.
5. Check for redundancy: multiple units that substantively re-teach the same objective without adding new depth or application — this isn't automatically wrong (reinforcement can be intentional), but flag it so the redundancy is a deliberate choice rather than an unnoticed overlap.
6. Rank findings by likely impact: an uncovered objective that's explicitly assessed (e.g. on a final exam) is a higher-priority gap than an orphan unit that's simply extra content.

Output format: Markdown with sections: Uncovered Objectives, Orphan Units, Sequencing/Prerequisite Issues, Redundancy, Priority Ranking. For each finding, name the specific objective(s) and unit(s) involved, not a general description.
```

## Variables
- `{{OBJECTIVES}}` — the curriculum's stated learning objectives. Required.
- `{{CURRICULUM_CONTENT}}` — the actual units/lessons in sequence, each with enough description to judge what it teaches. Required.

## Example
**Input:** `{{OBJECTIVES}}` = "1) Students can write a balanced chemical equation. 2) Students can calculate molar mass. 3) Students can perform stoichiometric calculations to find reactant/product quantities." `{{CURRICULUM_CONTENT}}` = "Unit 1: Atoms and elements. Unit 2: Balancing chemical equations. Unit 3: Stoichiometry problem sets (moles, mass, volume conversions)."

**Output (excerpt):**
```
### Uncovered Objectives
Objective 2 (calculate molar mass) has no dedicated unit — Unit 1 covers atoms/elements generally but the description doesn't mention molar mass calculation specifically, and Unit 3 (stoichiometry) assumes this skill rather than teaching it.

### Sequencing/Prerequisite Issues
Unit 3 (stoichiometry) requires molar mass calculation as a prerequisite skill (stoichiometric conversions are built on mole-to-mass conversions), but that skill isn't explicitly taught in Unit 1 or 2 based on the given descriptions. If molar mass calculation is genuinely absent, students will hit Unit 3 without a skill the unit assumes they have.

### Priority Ranking
1. (Highest) Missing molar mass calculation content — this is both an uncovered objective (#2) and a hard prerequisite blocker for Unit 3, so it likely explains real student struggle in stoichiometry rather than a stoichiometry-specific teaching problem.
2. Verify Unit 1's actual content — if molar mass is taught within Unit 1 but wasn't mentioned in the given description, this may be a documentation gap rather than a curriculum gap; recommend clarifying Unit 1's content description either way.
```

## Tips & Variations
- Pair with `lesson-plan-generator-from-learning-objectives` (education-and-learning, already shipped) once a gap is identified — that prompt can draft the missing unit's lesson plan directly from the uncovered objective.
- This prompt works from the descriptions given — if {{CURRICULUM_CONTENT}}'s unit descriptions are too brief to judge accurately, the analysis will be limited accordingly; provide enough detail per unit (not just a title) for a meaningful check.
- For a curriculum spanning a full year or program rather than a single course, run this per term/module rather than all at once — cross-referencing objectives and content across dozens of units in a single pass risks missing subtler prerequisite chains that a smaller scope would catch.

## Changelog
- 1.0.0 (2026-08-31): Initial version.
