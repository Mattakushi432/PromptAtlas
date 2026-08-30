---
id: compensation-band-rationale-writer
title: Compensation Band Rationale Writer
category: career-and-hr
tags: [compensation, hr, drafting]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Drafts a clear, defensible written rationale explaining why a role or a specific offer sits at a given compensation band/level — for an HR/People team member or hiring manager who needs to document and communicate a comp decision, not a tool for setting the actual number (it requires that input already).

## When to use it
- You've decided on a compensation band/level for a role or a specific candidate and need to document the reasoning clearly, for internal record or to explain to the candidate/employee.
- A comp decision is being challenged (an employee asking "why am I at this level") and you need a clear, specific written explanation rather than a vague policy citation.
- You're standardizing how comp rationales get written across a hiring team so decisions are documented consistently.

## The Prompt

```
You write a clear, specific rationale explaining why a role/offer sits at a given compensation band. You use only the factors given — you do not invent market data, benchmarks, or comparisons not provided.

Role/candidate context: {{CONTEXT}}
Assigned band/level: {{BAND}}
Factors considered: {{FACTORS}}
Audience for this rationale: {{AUDIENCE}}

Instructions:
1. Structure the rationale around the specific factors in {{FACTORS}} (e.g. scope of role, years of relevant experience, internal equity with similar roles, market data if provided, specific skills/certifications) — do not use generic filler ("this reflects our compensation philosophy") without connecting it to a specific factor from the input.
2. If {{FACTORS}} includes market data or benchmarks, cite it as given, attributed to its source if the source is named — do not present it more precisely or confidently than the input supports (e.g. if given a range, don't state it as a single precise figure).
3. If {{FACTORS}} is thin (e.g. only "this is our standard band for the role") and the rationale needs to withstand a specific challenge or question, say so explicitly and suggest what additional factor(s) would make the rationale more defensible, rather than padding out a thin justification with vague language to make it sound more substantial.
4. Adjust tone and detail level to {{AUDIENCE}}: an internal HR record can be more clinical/data-dense; a rationale being shared with the candidate/employee needs to be clear and respectful, avoiding jargon, and should acknowledge their perspective if this is in response to a question or pushback.
5. Do not include any factor that could read as based on a protected characteristic or something outside legitimate compensation criteria (e.g. never reference the candidate's current/previous salary as sole justification if that's not a permitted factor in the relevant jurisdiction, and never reference personal characteristics) — flag if `{{FACTORS}}` seems to include something like this rather than silently incorporating it.
6. Keep it factual and specific rather than persuasive/sales-like — this is documentation and explanation, not an attempt to talk someone into accepting a lower number than they were hoping for.

Output format: a short written rationale (roughly 150-300 words depending on {{AUDIENCE}}), structured around the factors given, in plain language appropriate to the audience.
```

## Variables
- `{{CONTEXT}}` — the role and/or candidate's background relevant to the decision. Required.
- `{{BAND}}` — the assigned compensation band/level. Required.
- `{{FACTORS}}` — the specific factors that went into the decision (experience level, scope, internal equity, market data, etc.). Required — the rationale's defensibility is bounded by how specific this is.
- `{{AUDIENCE}}` — who will read this (internal HR file, the candidate/employee directly, a hiring manager). Required — changes tone and detail level significantly.

## Example
**Input:** `{{CONTEXT}}` = "Candidate for Senior Backend Engineer, 7 years experience, 4 of which at companies of comparable scale" · `{{BAND}}` = "L5, upper-mid of the band" · `{{FACTORS}}` = "Years of relevant experience at comparable-scale companies; strong system design signal in interview loop; internal equity — comparable to 2 current L5 engineers with similar tenure" · `{{AUDIENCE}}` = "Candidate, in response to their question about the offer level"

**Output (excerpt):**
```
Your offer places you at L5, in the upper-middle portion of that band. This reflects your 7 years of backend engineering experience, including 4 years at companies operating at a comparable scale to ours — which lines up with what we look for at this level. Your system design performance in the interview loop was also a strong signal for L5 scope specifically. For internal consistency, this level and position within the band is comparable to two current engineers on the team with similar tenure and scope of experience.
```

## Tips & Variations
- If the rationale is being prepared before a negotiation conversation rather than after a question, note that explicitly in `{{AUDIENCE}}` — the tone should stay factual either way, but a pre-conversation rationale can be slightly more anticipatory about likely questions.
- This prompt doesn't determine the band itself — if you need help deciding what band a role should sit at (not just explaining a decision already made), that's a different task requiring actual market benchmarking, which this prompt explicitly doesn't fabricate.
- For a role-level (not individual candidate) rationale — e.g. documenting why an entire job family sits at a given band — the same structure applies with `{{CONTEXT}}` describing the role family rather than one candidate.

## Changelog
- 1.0.0 (2026-08-30): Initial version.
