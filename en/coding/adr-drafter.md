---
id: adr-drafter
title: ADR Drafter
category: coding
tags: [architecture, documentation, decision-records]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Turns a messy decision discussion (Slack thread, meeting notes, a rough writeup) into a formal Architecture Decision Record — for a decision that's already been made and needs to be documented properly, not for weighing options that are still open.

## When to use it
- A team just decided on an approach in a meeting/thread and someone needs to write it up before the context is lost.
- Onboarding a new team member and wanting to backfill an ADR for a past decision that was never formally recorded.
- Standardizing scattered decision rationale (in PR descriptions, Slack, tribal knowledge) into the team's ADR log.

## The Prompt

```
You draft a formal Architecture Decision Record (ADR) from the raw discussion below. The decision has already been made — your job is to document it clearly, not to re-litigate or re-evaluate the options.

Raw discussion/notes (meeting notes, thread, rough writeup): {{RAW_DISCUSSION}}
ADR template to follow (optional, otherwise use the standard Context/Decision/Consequences format): {{ADR_TEMPLATE}}
ADR number/title (optional): {{ADR_ID_AND_TITLE}}

Instructions:
1. Extract the actual decision made — state it as a single clear declarative sentence, not a summary of the debate.
2. Write the Context section: what problem/forces led to needing this decision, written so someone with zero background on the discussion understands why it mattered. Include relevant constraints (technical, team, timeline) that shaped the decision.
3. Write the Decision section: what was decided, stated plainly and specifically enough to be actionable.
4. Write the Consequences section: both positive and negative — what this decision makes easier, what it makes harder or forecloses, and any known risks or debt being knowingly accepted. Don't only list upsides; a decision with no listed tradeoffs is a red flag that the analysis was incomplete.
5. List the alternatives that were considered and rejected, with a one-sentence reason each for why they weren't chosen — even if the raw discussion only mentions them briefly, capture what's there rather than omitting them.
6. If the raw discussion leaves the actual decision ambiguous (people discussed options but the final call isn't clearly stated), say so explicitly rather than guessing which option "won."
7. Use neutral, factual language — an ADR is a historical record, not a persuasive pitch for the decision.

Output format: Markdown following the ADR template (Title, Status, Context, Decision, Consequences, Alternatives Considered).
```

## Variables
- `{{RAW_DISCUSSION}}` — the unstructured source material documenting the decision. Required.
- `{{ADR_TEMPLATE}}` — a specific ADR format to follow if the team has one. Optional.
- `{{ADR_ID_AND_TITLE}}` — the record's number/title in the team's ADR log. Optional.

## Example
**Input:** `{{RAW_DISCUSSION}}` = a Slack thread where the team debated Postgres vs. DynamoDB for a new service and settled on Postgres because of existing team expertise and the need for complex joins, despite DynamoDB's better horizontal scaling story.

**Output (excerpt):**
```markdown
## Decision
We will use PostgreSQL as the primary datastore for the new order service.

## Consequences
- Positive: the team's existing operational expertise with Postgres reduces onboarding and on-call risk; complex reporting queries requiring joins across orders, users, and inventory are straightforward.
- Negative: horizontal write scaling will require more deliberate work (read replicas, eventual sharding) than DynamoDB would have provided out of the box; this is an accepted tradeoff given current traffic projections.

## Alternatives Considered
- **DynamoDB** — rejected primarily because of its weaker support for ad-hoc relational queries needed by the reporting feature, despite its scaling advantages.
```

## Tips & Variations
- For a lightweight ADR culture, ask for a condensed one-paragraph-per-section version instead of the full template.
- If the raw discussion includes multiple decisions tangled together, ask it to split them into separate ADR drafts rather than merging unrelated decisions into one record.

## Changelog
- 1.0.0 (2026-08-29): Initial version.
