---
id: meeting-agenda-to-notes-to-actions-converter
title: Meeting Agenda-to-Notes-to-Actions Converter
category: productivity-and-personal
tags: [meeting-management, productivity, documentation]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Converts raw meeting notes (taken against an agenda) into clean, distributable meeting notes with clearly extracted action items — an organization tool for notes already taken, not a live transcription or meeting-attendance tool.

## When to use it
- You took messy notes during a meeting and need them turned into something you can actually send to attendees, with action items clearly separated from discussion.
- You want to check whether every agenda item actually got a decision or a clear next step, rather than trailing off into "we'll figure it out later."
- You're the one responsible for meeting follow-through and want extracted actions with owners, not just a wall of notes someone has to re-read to find what they're on the hook for.

## The Prompt

```
You convert raw meeting notes into clean, distributable notes with clearly extracted action items. You organize what was actually discussed and decided — you do not invent decisions or action items that weren't actually captured in the notes.

Meeting agenda: {{AGENDA}}
Raw notes: {{RAW_NOTES}}
Attendees: {{ATTENDEES}}

Instructions:
1. Organize the cleaned notes by agenda item from {{AGENDA}}, summarizing what was actually discussed under each — if the raw notes cover something not on the agenda, include it in an "Other topics" section rather than forcing it under an unrelated agenda item.
2. For each agenda item, check whether the notes show a clear decision or next step was reached. If not, flag it explicitly (`No clear resolution — needs follow-up`) rather than writing a vague summary that implies closure when there wasn't any.
3. Extract action items as a separate list: each with a specific owner (from {{ATTENDEES}} if named in the notes, otherwise flag `[OWNER UNCLEAR]`) and, if stated, a deadline. Do not assign an owner the notes didn't actually name — guessing who's responsible creates false accountability.
4. Distinguish decisions (something was actually agreed) from open questions (something was discussed but not resolved) in the summary — conflating the two makes a meeting look more productive than it was.
5. Keep the discussion summary concise — this is not a transcript; capture the substance and outcome of each discussion, not every comment made.
6. If the raw notes are thin or unclear for a given agenda item, say so rather than padding a vague summary to look complete — thin notes on an important topic are themselves useful information (maybe it needs more discussion time next meeting).

Output format: Markdown with `## Discussion Summary` (organized by agenda item, including any "no resolution" flags), `## Action Items` (owner + deadline for each), and `## Open Questions` (unresolved items needing follow-up).
```

## Variables
- `{{AGENDA}}` — the meeting's planned agenda items. Required.
- `{{RAW_NOTES}}` — the messy notes taken during the meeting. Required.
- `{{ATTENDEES}}` — who was in the meeting, for accurate action-item attribution. Required.

## Example
**Input:** `{{AGENDA}}` = "1. Q3 launch timeline 2. Budget for the marketing push 3. Open roles" `{{RAW_NOTES}}` = "launch — sarah thinks sept 15 still works, mike worried about the integration testing not being done. no final call made, need to check with eng lead. budget - approved $50k, sarah owns spending it. open roles - didn't get to this, ran out of time" `{{ATTENDEES}}` = "Sarah, Mike, Jen"

**Output (excerpt):**
```
## Discussion Summary
### 1. Q3 launch timeline
Sarah proposed Sept 15 remains feasible; Mike raised a concern that integration testing isn't complete yet. **No clear resolution — needs follow-up** with the engineering lead before the date can be confirmed.

### 2. Budget for the marketing push
$50k approved. Sarah owns spending it.

### 3. Open roles
Not discussed — ran out of time.

## Action Items
- Check with engineering lead on integration testing status to confirm/adjust Sept 15 launch date. Owner: [OWNER UNCLEAR — notes don't say who's following up with eng lead].
- Spend the approved $50k marketing budget. Owner: Sarah.

## Open Questions
- Q3 launch date not confirmed — pending engineering testing status.
- Open roles agenda item not discussed — needs to be covered next meeting.
```

## Tips & Variations
- If `[OWNER UNCLEAR]` shows up often, that's worth raising directly in the next meeting — it's a signal that action items are being discussed without anyone explicitly claiming them in the room, which is a common reason follow-through fails.
- For a recurring meeting series, keep a running log of "Open Questions" across sessions and check at the start of each new conversion whether previous open items were actually resolved this time — prevents the same unresolved item from silently dropping off the radar.
- This prompt doesn't listen to audio or generate notes from a transcript — for that, use a dedicated transcription tool first, then feed the resulting text in as `{{RAW_NOTES}}`.

## Changelog
- 1.0.0 (2026-08-30): Initial version.
