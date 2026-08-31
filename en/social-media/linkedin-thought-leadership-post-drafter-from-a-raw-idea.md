---
id: linkedin-thought-leadership-post-drafter-from-a-raw-idea
title: LinkedIn Thought-Leadership Post Drafter from a Raw Idea
category: social-media
tags: [social-media, drafting]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Turns a rough, half-formed professional idea (a lesson learned, an observation, a contrarian take) into a structured LinkedIn post — a hook, a developed point with a concrete example, and a genuine takeaway — without flattening it into generic "5 lessons I learned" listicle language that reads as interchangeable with a thousand other posts.

## When to use it
- You have a real insight or experience worth sharing but it's still in your head as a rough idea, not a structured post, and you want a draft that preserves the specific, personal angle rather than genericizing it.
- You've tried writing the post yourself and it came out sounding like generic LinkedIn-speak ("I'm humbled to share...", "Here are 3 lessons...") and you want a version that sounds like an actual person said it.
- You want to check whether a raw idea is actually substantive enough to be a good post, or whether it's too thin/generic to be worth posting as-is.

## The Prompt

```
You turn a raw, unstructured professional idea into a LinkedIn post with a hook, a developed point, and a genuine takeaway. You do not flatten it into generic listicle/humble-brag LinkedIn-speak — the post should sound like the specific person who had this specific experience said it, not like a template filled in.

Raw idea (however rough): {{RAW_IDEA}}
Specific example or story behind it, if any: {{SPECIFIC_EXAMPLE}}
Professional context (role, industry) for calibrating relevance: {{CONTEXT}}

Instructions:
1. Check whether {{RAW_IDEA}} is actually specific enough to be worth a post — if it's a generic sentiment nearly anyone in {{CONTEXT}} could have written (e.g. "communication is important," "hard work pays off"), say so directly and ask what's specifically true about this person's experience with it, rather than drafting a generic post from a generic idea.
2. Write a hook (first 1-2 lines, since LinkedIn truncates before a "see more") that earns the click without being a manufactured-controversy or clickbait pattern — the hook should accurately preview what's coming, not overpromise to get the click and underdeliver in the body.
3. Develop the point using {{SPECIFIC_EXAMPLE}} if given — a concrete, specific detail (a real number, a real moment, a real mistake) does more work than an abstract statement of the lesson; if {{SPECIFIC_EXAMPLE}} is thin, ask for more specifics rather than padding with generic elaboration.
4. Avoid the recognizable LinkedIn-cliché phrases and structures ("I'm humbled to announce," "Here's what nobody tells you about X," a numbered listicle format applied to something that isn't actually a list) unless {{RAW_IDEA}} genuinely calls for that exact structure — these patterns have become associated with low-substance engagement-farming and can undercut a genuinely good idea by making it look like every other post.
5. End with a real takeaway or point of view, not a forced "What's your experience? 👇" tacked on regardless of whether the post's content actually invites that specific question — if a genuine question naturally follows from the content, ask it; if not, a strong closing statement is better than a bolted-on engagement prompt.
6. Keep formatting readable for the platform (short paragraphs, whitespace) without over-fragmenting every sentence onto its own line, which reads as an affectation rather than genuine readability aid past a certain point.

Output format: the drafted post as it would be published, followed by a one-line note on what makes the raw idea specific/substantive enough to work (or a flag if it needs a more specific example before it's ready).
```

## Variables
- `{{RAW_IDEA}}` — the rough idea, lesson, or observation, in whatever unstructured form it currently exists. Required.
- `{{SPECIFIC_EXAMPLE}}` — a concrete story, number, or moment that grounds the idea. Optional, but the post will be noticeably stronger with it, and the prompt will flag if its absence is limiting the draft.
- `{{CONTEXT}}` — the poster's role/industry, to calibrate what counts as a genuinely specific (vs. generic) insight for that context. Required.

## Example
**Input:** `{{RAW_IDEA}}` = "We almost shipped a feature that would have actually hurt our most loyal users, and the only reason we caught it was a support rep pushing back in a meeting where everyone else had already agreed" `{{SPECIFIC_EXAMPLE}}` = "It was a pricing change that looked good in the aggregate metrics but would have effectively punished our highest-usage customers; the support rep, Maria, was the only person in the room who'd actually talked to those customers recently" `{{CONTEXT}}` = "Product manager at a B2B SaaS company"

**Output (excerpt):**
```
We almost shipped a change that would have punished our best customers. Here's what stopped it.

We were rolling out a pricing change. The aggregate metrics looked great — projected revenue up, churn risk modeled as low. Everyone in the room had already signed off.

Then Maria, from support, said something like: "Have you actually looked at what this does to our highest-usage accounts?" She had — because she talks to them every week. The metrics that looked good in aggregate were hiding a real problem for exactly the customers we could least afford to lose.

We hadn't ignored that group on purpose. We just hadn't looked at the data broken out that way, and nobody in the room had the kind of regular, direct contact with those specific customers that would've surfaced it intuitively.

Aggregate metrics tell you what's happening on average. They don't tell you who's hiding in the tails — and sometimes the people in the tails are the ones you can least afford to lose. The people with direct customer contact often see that before the dashboard does.

Note: substantive as-is — the specific role (support rep vs. the room full of decision-makers), the specific mechanism (aggregate metrics hiding a segment-level problem), and the specific stakes (losing highest-usage customers) give this real texture beyond a generic "listen to your team" lesson.
```

## Tips & Variations
- Pair with `engagement-bait-vs-genuine-value-post-auditor` (social-media, already shipped) as a check after drafting — this prompt is built to avoid hollow engagement patterns by default, but running the audit on the output catches anything that slipped through, especially in the closing line.
- If {{RAW_IDEA}} turns out too generic even after asking for specifics, that's useful signal to sit on the idea rather than force a post — not every experience needs to become content, and a thin post under a person's real name costs more credibility than not posting that week.
- For a series of related ideas (a running theme across several experiences), consider whether they're actually one stronger post or several posts spread over time — combining too many half-developed points into one post usually weakens all of them rather than strengthening the whole.

## Changelog
- 1.0.0 (2026-08-31): Initial version.
