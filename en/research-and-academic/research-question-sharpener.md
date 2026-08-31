---
id: research-question-sharpener
title: Research Question Sharpener
category: research-and-academic
tags: [research-design, academic-writing, planning]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Takes a broad or vague research interest and sharpens it into a specific, answerable research question — pressure-tests scope, feasibility, and specificity rather than just rewording the same broad idea more formally.

## When to use it
- You have a general area of interest ("I want to study X") but haven't narrowed it into something a study could actually answer.
- You have a draft research question and suspect it's too broad, too vague, or not actually answerable with feasible methods, and want that checked directly.
- You're prepping for an advisor meeting and want a sharpened draft to bring rather than the broad interest alone.

## The Prompt

```
You sharpen a broad research interest into a specific, answerable research question. You pressure-test scope and feasibility — you do not just rephrase the same broad idea in more formal academic language, which is not the same as narrowing it.

Broad interest / draft question: {{INTEREST}}
Field/discipline: {{FIELD}}
Available resources/constraints (time, access, methods feasible): {{CONSTRAINTS}}

Instructions:
1. Identify what makes {{INTEREST}} currently too broad or vague to answer directly — usually one or more of: too many variables at once, an unclear population/context, no specified relationship being tested, or a scope that would require resources beyond {{CONSTRAINTS}}.
2. Propose 2-3 sharpened candidate questions, each narrowing {{INTEREST}} along a different specific axis (e.g. narrower population, a specific relationship between two variables instead of a vague "explore X," a bounded time period or context) — show the different ways it could be narrowed rather than picking one silently.
3. For each candidate question, state what specific method it would realistically require (survey, experiment, interview study, secondary data analysis, etc.) and check that against {{CONSTRAINTS}} — flag any candidate that isn't actually feasible given stated resources rather than presenting it as equally viable.
4. Check each candidate against the "answerable" test: could a specific study design actually produce a clear answer to this question, or does it still smuggle in multiple sub-questions or an ambiguous key term that would need its own definition first?
5. For the strongest candidate, note what would still need to be defined precisely before a study could be designed (e.g. an operational definition of a key construct) — a sharpened question is still not fully ready for a methods section without this.
6. Do not narrow the question so much that it becomes trivial or uninteresting — flag this tension explicitly if a candidate risks being answerable but not worth answering.

Output format: Markdown, `### Why the current framing is too broad`, then one section per candidate question with method fit and feasibility check, ending with a recommendation on the strongest candidate and what still needs defining.
```

## Variables
- `{{INTEREST}}` — the broad interest or draft question as currently framed. Required.
- `{{FIELD}}` — the academic field/discipline, since what counts as an answerable question and feasible method varies by field. Required.
- `{{CONSTRAINTS}}` — realistic time, access, and methodological constraints. Required — without this, candidates can't be checked for feasibility.

## Example
**Input:** `{{INTEREST}}` = "I'm interested in how social media affects mental health in teenagers" `{{FIELD}}` = "Psychology (undergraduate honors thesis)" `{{CONSTRAINTS}}` = "One semester, survey-based methods only (no access to clinical populations or longitudinal data collection), likely convenience sample from a university-adjacent population"

**Output (excerpt):**
```
### Why the current framing is too broad
"Social media" covers many distinct platforms and behaviors (passive scrolling vs. active posting vs. direct messaging), "mental health" covers many distinct constructs (anxiety, depression, self-esteem, loneliness), and the question doesn't specify a relationship (correlation? a proposed mechanism? a comparison between groups?). As framed, no single study could address this.

### Candidate 1: "Is passive social media use (scrolling without posting) associated with higher self-reported loneliness in college-age users, compared to active use (posting/commenting)?"
Method fit: cross-sectional survey measuring self-reported usage patterns and a validated loneliness scale — fits available methods and timeline.
Feasibility: Yes, given constraints — achievable with a convenience sample and existing validated measures.

### Candidate 2: "Does social media use cause anxiety in teenagers?"
Method fit: would require experimental or longitudinal design to support a causal claim.
Feasibility: Not feasible given constraints — one semester and survey-only methods can't establish causation; this candidate should be reframed as a correlational question or dropped.

### Recommendation
Candidate 1 is the strongest fit. Still needs defining before a methods section: the specific operational definition of "passive" vs. "active" use (self-report categories, or based on specific behaviors like number of posts vs. minutes scrolling), and which validated loneliness scale will be used.
```

## Tips & Variations
- If every candidate the prompt proposes still gets flagged as infeasible given `{{CONSTRAINTS}}`, that's a real signal worth taking seriously — either the constraints need to loosen (more time, different access) or the interest area itself needs to shift toward something more tractable at this stage.
- Bring the full output (not just the final recommended question) to an advisor meeting — the "why current framing is too broad" and rejected candidates show the actual thinking, which is often more useful for an advisor to react to than a single polished question alone.
- Revisit this after an initial pilot or literature scan — a question that seemed feasible in the abstract sometimes needs re-sharpening once you learn more about what's actually been studied or what data is realistically available.

## Changelog
- 1.0.0 (2026-08-30): Initial version.
