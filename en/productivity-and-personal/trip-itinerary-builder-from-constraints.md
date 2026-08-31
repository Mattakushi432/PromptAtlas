---
id: trip-itinerary-builder-from-constraints
title: Trip Itinerary Builder from Constraints
category: productivity-and-personal
tags: [travel-planning, planning]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Builds a day-by-day trip itinerary that explicitly respects the stated constraints — budget, pacing needs, must-see items, things to avoid — rather than a generic "top 10 things to do in [city]" list, and flags when two must-see items don't actually fit together within the given time or geography instead of silently cramming them in.

## When to use it
- You're planning a trip with specific constraints (traveling with young kids, a tight budget, a physical limitation, an early-morning-averse schedule) and generic travel-blog itineraries assume none of that.
- You have a list of must-see items gathered from different sources and want to check whether they actually fit together in the time available before building a day-by-day plan around them.
- You want a realistic pacing check — whether the itinerary as drafted is a relaxing trip or a rushed one, given how much is packed into each day.

## The Prompt

```
You build a day-by-day trip itinerary that explicitly respects the stated constraints, rather than a generic list of attractions. You flag conflicts between must-see items and the available time/geography rather than silently forcing everything in.

Destination: {{DESTINATION}}
Trip length: {{TRIP_LENGTH}}
Budget range: {{BUDGET}}
Must-see items or priorities: {{MUST_SEE}}
Constraints (pacing needs, physical limitations, things to avoid, traveling with kids, etc.): {{CONSTRAINTS}}

Instructions:
1. Before building the day-by-day plan, check {{MUST_SEE}} for items that are geographically far apart or require significantly more time than the days available — if two must-see items can't realistically both happen given {{TRIP_LENGTH}}, say so explicitly and ask which takes priority, rather than cramming both in at the cost of realistic pacing.
2. Build the itinerary day by day, grouping activities by geographic proximity so each day doesn't involve backtracking across the destination — a day plan should follow a sensible physical route, not a list ordered by importance regardless of location.
3. Respect {{CONSTRAINTS}} explicitly in the day structure, not just as a footnote: if traveling with young kids, build in downtime and avoid over-packing a single day; if there's a physical limitation, avoid routes with excessive walking/stairs, or explicitly note which activities may not be accessible; if red-eye flights or early mornings are to be avoided, don't schedule an activity requiring a 6am start.
4. Stay within {{BUDGET}} — for each day, keep a rough running estimate of major costs (entry fees, notable meals), and flag if the itinerary as built is trending over budget rather than silently ignoring the constraint.
5. Include realistic transit/buffer time between activities, not just activity-to-activity with zero gap — an itinerary that looks full on paper but ignores transit time will fail in practice.
6. Flag at least one day (or half-day) as intentionally lighter/flexible unless {{CONSTRAINTS}} explicitly says the traveler wants every day fully packed — real trips need slack for delays, fatigue, or spontaneous changes, and an itinerary with zero flex is more fragile than it looks.

Output format: Markdown, one section per day with a short list of activities in geographic/logical order, approximate cost, and any {{CONSTRAINTS}}-specific note for that day. Start with a "Conflicts & Tradeoffs" section if any {{MUST_SEE}} items didn't fit.
```

## Variables
- `{{DESTINATION}}` — the trip destination. Required.
- `{{TRIP_LENGTH}}` — number of days/nights. Required.
- `{{BUDGET}}` — an approximate budget range for the trip. Required — without it, cost-flagging can't happen.
- `{{MUST_SEE}}` — the specific priorities or must-see items. Required.
- `{{CONSTRAINTS}}` — pacing needs, physical limitations, things to avoid, travel-with-kids considerations, or anything else that shapes what a workable day looks like. Required — this is what differentiates the itinerary from a generic list.

## Example
**Input:** `{{DESTINATION}}` = "Rome, Italy" `{{TRIP_LENGTH}}` = "3 days" `{{BUDGET}}` = "Moderate, ~$150/day excluding lodging" `{{MUST_SEE}}` = "Colosseum, Vatican Museums/Sistine Chapel, a day trip to Pompeii" `{{CONSTRAINTS}}` = "Traveling with a 5-year-old — no more than one major timed-entry attraction per day, need a midday rest break"

**Output (excerpt):**
```
### Conflicts & Tradeoffs
A day trip to Pompeii from Rome takes roughly 4-5 hours round trip on top of the visit itself — combined with {{CONSTRAINTS}}'s "no more than one major attraction per day with a kid" and only 3 days total, fitting Pompeii alongside both the Colosseum and Vatican Museums as full separate days means the trip has zero flex or rest days. Recommend either extending to 4 days, or dropping Pompeii for this trip and returning to it on a future visit — flagging this rather than cramming it into day 3 alongside travel fatigue from days 1-2.

### Day 1: Colosseum & Ancient Rome
- Morning: Colosseum + Roman Forum (timed entry, book ahead) — this is the day's one major timed attraction per {{CONSTRAINTS}}.
- Midday: Rest break near the Forum (lunch, downtime) before continuing.
- Afternoon: Short, low-intensity walk to Piazza Venezia — nothing requiring another timed ticket.
- Approx. cost: ~$130 (tickets + meals for the day, within {{BUDGET}}).

### Day 2: Vatican Museums & Sistine Chapel
- Morning: Vatican Museums (timed entry, book ahead) — the day's one major attraction.
- Midday: Rest break as required by {{CONSTRAINTS}}.
- Afternoon: St. Peter's Square (outdoor, low-intensity, flexible with a tired kid).
- Approx. cost: ~$110.
```

## Tips & Variations
- Pair with `decision-matrix-builder-for-a-hard-choice` (productivity-and-personal, already shipped) if the "Conflicts & Tradeoffs" section surfaces a genuinely hard call between competing must-see items — that prompt can help weigh the tradeoff explicitly rather than defaulting to whichever was listed first.
- If {{MUST_SEE}} is very short or the trip is intentionally unstructured, say so — this prompt still works but should produce a lighter skeleton (anchor activities plus open time) rather than forcing a fully scheduled day when that's not what's wanted.
- For a multi-destination trip (more than one city), run this prompt once per destination after the overall city-to-city split is decided, rather than asking it to solve inter-city routing and day-by-day pacing at the same time.

## Changelog
- 1.0.0 (2026-08-31): Initial version.
