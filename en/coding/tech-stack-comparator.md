---
id: tech-stack-comparator
title: Tech Stack Comparator
category: coding
tags: [architecture, decision-making, technology-selection]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Compares 2-3 named technology options against your team's actual stated constraints — not a generic "X vs Y" listicle — and gives a specific recommendation with reasoning tied to those constraints. For a concrete decision that needs to get made, not general research.

## When to use it
- Choosing between specific technologies (databases, frameworks, message queues) for a real project with real constraints.
- Needing to justify a technology choice to stakeholders with a clear, constraint-based rationale rather than a preference.
- Revisiting an old technology choice to check whether it's still the right fit given how constraints have changed.

## The Prompt

```
You compare specific technology options against explicitly stated constraints — not a generic feature comparison. The recommendation must follow from the constraints given, not from which technology is more popular or "modern" in the abstract.

Options to compare: {{OPTIONS}}
What this is for (the actual use case): {{USE_CASE}}
Constraints (team skills, scale, budget, timeline, existing infra, compliance needs — whatever applies): {{CONSTRAINTS}}

Instructions:
1. For each option, evaluate it specifically against the stated constraints — not a generic strengths/weaknesses list. If a constraint doesn't apply to a given option, say so rather than forcing a comparison point.
2. Be explicit about tradeoffs: no realistic option wins on every constraint. If your analysis makes one option look strictly superior with no downsides, treat that as a signal to look harder for the tradeoff you're missing.
3. Weight constraints by how much they actually matter for this specific use case — a constraint like "team has zero experience with X" should be weighted more heavily for a small team on a tight timeline than for a large team with time to ramp up.
4. Give a specific recommendation, not just a comparison — state which option you'd choose given these constraints and why, in one clear paragraph.
5. Note any constraint where you don't have enough information to judge confidently, and say what you'd need to know to be more certain.
6. If the honest answer is "these are close enough that the choice doesn't matter much, pick based on team preference," say that instead of manufacturing a false precision.

Output format: Markdown table comparing options against each constraint, followed by a "Recommendation" section with the reasoning paragraph.
```

## Variables
- `{{OPTIONS}}` — the specific technologies being compared (2-3). Required.
- `{{USE_CASE}}` — what this technology will actually be used for. Required.
- `{{CONSTRAINTS}}` — the real limiting factors for this decision. Required — without this, the comparison degrades into generic marketing-page content.

## Example
**Input:** `{{OPTIONS}}` = "PostgreSQL, MongoDB", `{{USE_CASE}}` = "storing product catalog with frequently changing, semi-structured attributes per category", `{{CONSTRAINTS}}` = "team has strong SQL experience, no NoSQL experience; need complex cross-category reporting queries".

**Output (excerpt):**
```
| Constraint | PostgreSQL | MongoDB |
|---|---|---|
| Team experience | Strong existing SQL skills, minimal ramp-up | Team would need to learn document modeling and aggregation pipeline from scratch |
| Semi-structured attributes | Handled via JSONB columns — flexible enough for varying per-category fields, with the option to add structure later | Native fit for this, but the flexibility advantage is smaller than it initially appears given JSONB |
| Cross-category reporting | Strong — standard SQL joins and aggregations | Weaker — cross-collection aggregation is more awkward and slower for complex reporting |

**Recommendation:** PostgreSQL, using JSONB for the variable per-category attributes. The reporting requirement is a hard constraint that MongoDB handles worse, and it avoids the team ramp-up cost entirely — the "semi-structured data" argument for MongoDB doesn't hold up once JSONB is considered.
```

## Tips & Variations
- For a build-vs-buy decision instead of a tech comparison, adapt `{{OPTIONS}}` to name the vendor/SaaS choices and add a cost/vendor-lock-in row to the constraint set.
- If stakeholders have a stated bias toward one option, name that explicitly as a (non-technical) constraint so the prompt doesn't silently ignore organizational reality.

## Changelog
- 1.0.0 (2026-08-29): Initial version.
