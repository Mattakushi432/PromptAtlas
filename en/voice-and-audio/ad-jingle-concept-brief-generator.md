---
id: ad-jingle-concept-brief-generator
title: Ad Jingle Concept Brief Generator
category: voice-and-audio
tags: [audio, sound-design]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Generates a creative brief for an ad jingle — mood/genre direction, a lyrical hook or brand phrase to build around, tempo/energy guidance, and a length constraint tied to the actual ad format — concrete enough for a composer or jingle-production service to work from directly, rather than vague mood-board language like "upbeat and memorable" that could describe almost any jingle.

## When to use it
- You need to commission a jingle (from a freelance composer, a jingle-production service, or an internal creative team) and want a brief that gives them real direction instead of "make something catchy."
- You have a vague sense of what you want ("something like our competitor's jingle but more us") and need help translating that into concrete, briefable creative direction.
- You're evaluating jingle submissions or drafts against a brief and want to check whether a submission actually delivers on the direction given, not just whether it sounds pleasant in isolation.

## The Prompt

```
You write a creative brief for an ad jingle — concrete enough for a composer to work from directly, not a vague mood description.

Brand/product: {{BRAND_DESCRIPTION}}
Campaign goal (what the ad needs to accomplish): {{CAMPAIGN_GOAL}}
Ad format and length constraint (e.g. 15-second radio spot, 6-second pre-roll bumper): {{AD_FORMAT}}
Existing brand voice/tone, if defined elsewhere: {{BRAND_VOICE}}

Instructions:
1. Recommend a specific musical genre/style direction (not "upbeat" alone, but something like "up-tempo acoustic pop, similar energy to a friendly indie coffee-shop playlist") grounded in {{BRAND_DESCRIPTION}} and {{BRAND_VOICE}} — the genre choice should be justifiable, not arbitrary.
2. Draft 1-2 candidate lyrical hooks or a brand phrase the jingle should build around — short, singable, and tied to {{CAMPAIGN_GOAL}} (what the listener should remember or do after hearing it), not just the brand name repeated.
3. Specify tempo and energy guidance in concrete terms a composer can act on (e.g. "120-130 BPM, driving but not aggressive" rather than just "energetic") — vague energy descriptions are one of the most common sources of brief-to-delivery mismatch.
4. Calculate what {{AD_FORMAT}}'s length constraint actually allows: state how many sung words/syllables realistically fit in the format's duration at the recommended tempo, so the brief doesn't ask for more content than the format can hold — a common failure is a brief that implicitly wants a 15-second jingle to say as much as a 30-second one.
5. Note any must-include or must-avoid elements explicit in {{BRAND_VOICE}} or {{CAMPAIGN_GOAL}} (e.g. "must include the tagline verbatim," "avoid anything that sounds like a specific existing competitor's jingle").
6. Flag if {{CAMPAIGN_GOAL}} and the recommended musical direction seem to be in tension (e.g. a goal requiring gravitas paired with a genre direction that reads as silly/novelty) rather than silently picking one and ignoring the mismatch.

Output format: Markdown with sections: Musical Direction, Lyrical Hook/Brand Phrase Candidates, Tempo & Energy, Length & Word-Count Guidance (tied to {{AD_FORMAT}}), Must-Include/Must-Avoid.
```

## Variables
- `{{BRAND_DESCRIPTION}}` — what the brand/product is and its general positioning. Required.
- `{{CAMPAIGN_GOAL}}` — what this specific ad/jingle needs to accomplish (brand recall, a specific call to action, associating the brand with a feeling). Required — this shapes the hook and tone recommendations.
- `{{AD_FORMAT}}` — the specific ad format and its length constraint. Required — length determines how much lyrical/musical content is actually realistic.
- `{{BRAND_VOICE}}` — an existing defined brand voice/tone, if one exists elsewhere, so the jingle direction stays consistent with it rather than inventing a new one. Optional.

## Example
**Input:** `{{BRAND_DESCRIPTION}}` = "A local, family-owned hardware store competing against big-box chains, known for staff who actually know how to help with home repair projects" `{{CAMPAIGN_GOAL}}` = "Make listeners think of this store first when they have a home repair question, not just a purchase to make" `{{AD_FORMAT}}` = "15-second radio spot" `{{BRAND_VOICE}}` = "Warm, knowledgeable, unpretentious — 'the neighbor who happens to know a lot about tools'"

**Output (excerpt):**
```
### Musical Direction
Warm, folksy acoustic guitar-led, mid-tempo — think a friendly front-porch feel rather than a slick corporate jingle. This supports {{BRAND_VOICE}}'s "knowledgeable neighbor" framing better than a polished, produced pop direction would; a too-slick jingle would undercut the "local, unpretentious" positioning in {{BRAND_DESCRIPTION}}.

### Lyrical Hook/Brand Phrase Candidates
1. "Got a question? We've got the answer" (paired with store name) — ties directly to {{CAMPAIGN_GOAL}}'s "first thing you think of for a repair question," not just a purchase.
2. "[Store name] — where the tools talk back" (playful nod to staff expertise) — riskier/more novelty, worth testing against candidate 1.

### Tempo & Energy
100-110 BPM, warm and steady rather than driving — energy should read as reassuring competence, not high-energy excitement, since {{CAMPAIGN_GOAL}} is about trust/first-recall for a question, not urgency to buy right now.

### Length & Word-Count Guidance
At 100-110 BPM, a 15-second spot realistically fits roughly 8-12 sung words for the hook itself, plus a few seconds of instrumental intro/outro — this rules out fitting both candidate hooks in one 15-second spot; pick one, or test both as separate spot variants rather than compressing both into one.

### Must-Include/Must-Avoid
Must include: store name clearly and early, since {{CAMPAIGN_GOAL}} depends on recall. Avoid: anything resembling a big-box chain's slicker jingle style, which would undercut the local/unpretentious differentiation {{BRAND_DESCRIPTION}} depends on.
```

## Tips & Variations
- Pair with `voiceover-script-with-delivery-direction-annotations` (voice-and-audio, already shipped) if the jingle includes a spoken tag line alongside the sung hook — that prompt can annotate the spoken portion's delivery once this brief establishes the overall creative direction.
- If commissioning multiple composers or a jingle-production service with several candidates, use this same brief for all of them rather than tailoring it per composer — a consistent brief makes the resulting submissions genuinely comparable against the same criteria.
- The word-count/length guidance in step 4 is a rough estimate, not a precise music-production calculation — always confirm actual fit with the composer once music is being written, since real melodic phrasing doesn't map perfectly onto a syllables-per-second estimate.

## Changelog
- 1.0.0 (2026-08-31): Initial version.
