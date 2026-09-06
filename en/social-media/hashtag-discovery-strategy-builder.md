---
id: hashtag-discovery-strategy-builder
title: Hashtag / Discovery Strategy Builder
category: social-media
tags: [hashtag-strategy, social-media]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Recommends a specific mix of hashtags — a small number of high-volume/broad tags for reach, a few medium-competition niche tags, and 1-2 branded/community tags — rather than a generic "use 5-10 relevant hashtags," and flags tags that look topically relevant but actually surface an audience unrelated to the post's actual content.

## When to use it
- You're about to publish a post and want a deliberate hashtag mix instead of guessing or reusing the same tag list on every post regardless of topic.
- A post underperformed and you suspect the hashtags pulled in the wrong audience (high impressions, low relevant engagement) rather than the content itself being weak.
- You're building a repeatable hashtag strategy for an account and want the reasoning behind tag tiers documented, not just a list to copy-paste.

## The Prompt

```
You recommend a hashtag mix for a specific post, balancing reach against relevance. You do not just list generically "relevant" tags — you tier them by competition/reach level and flag any tag whose actual top-post content likely doesn't match this post's real audience.

Post topic/content: {{POST_TOPIC}}
Platform: {{PLATFORM}}
Target audience: {{TARGET_AUDIENCE}}
Existing branded/community hashtag, if any: {{BRANDED_TAG}}

Instructions:
1. Recommend 1-2 broad, high-volume tags directly relevant to {{POST_TOPIC}} — these maximize reach but face the most competition for visibility; note that they're a discovery-volume play, not where most qualified engagement will come from.
2. Recommend 3-5 medium-competition niche tags more specific to {{POST_TOPIC}} and {{TARGET_AUDIENCE}} — these are typically where the best ratio of reach to genuinely interested viewers comes from, since less competition means a post has a better chance of surfacing prominently within the tag.
3. Recommend 1-2 tags specific to {{BRANDED_TAG}} or a niche community/event tag if relevant — these build a searchable archive and community identity over time even though their individual-post reach is small.
4. For each recommended tag, flag if you have reason to suspect it commonly surfaces content unrelated to {{POST_TOPIC}} (e.g. a tag that's topically named but has drifted to mean something else in practice, or is dominated by an unrelated use case) — this is a real risk with broad single-word tags especially, and using a mismatched tag can attract impressions that don't convert to relevant engagement.
5. Calibrate the total count and tag style to {{PLATFORM}} norms — hashtag conventions and effective counts differ meaningfully between platforms (e.g. Instagram traditionally supports many tags, X/LinkedIn conventions favor far fewer), and a strategy copied from one platform to another without adjustment often underperforms.
6. If {{TARGET_AUDIENCE}} is a narrow or specialized group, prioritize niche tags over broad ones even if it means lower total reach — a smaller, more relevant audience surfaced by niche tags is usually worth more than a larger, less-relevant one from broad tags, especially if {{TARGET_AUDIENCE}} isn't itself a mass-market group.

Output format: Markdown with three tiers: Broad/Reach Tags, Niche/Relevance Tags, Branded/Community Tags. For each tag, a one-line rationale. Flag any tag with a relevance-mismatch risk explicitly.
```

## Variables
- `{{POST_TOPIC}}` — what the post is actually about. Required.
- `{{PLATFORM}}` — the specific platform, since hashtag conventions and effective tag counts differ. Required.
- `{{TARGET_AUDIENCE}}` — who this post is trying to reach, since niche-tag selection depends on knowing who actually counts as a relevant viewer. Required.
- `{{BRANDED_TAG}}` — an existing branded or community hashtag to include, if the account has one. Optional.

## Example
**Input:** `{{POST_TOPIC}}` = "A tutorial on sourdough starter maintenance for beginners" `{{PLATFORM}}` = "Instagram" `{{TARGET_AUDIENCE}}` = "Home bakers who are new to sourdough specifically, not general cooking enthusiasts" `{{BRANDED_TAG}}` = "#MyStarterJourney (account's own recurring tag)"

**Output (excerpt):**
```
### Broad/Reach Tags
- #Sourdough — high volume, directly on-topic; expect strong reach but heavy competition for visibility within it.
- #BakingFromScratch — broad but relevant; note this tag is somewhat mixed with general baking content beyond bread, so expect some reach dilution outside {{TARGET_AUDIENCE}}.

### Niche/Relevance Tags
- #SourdoughStarter — more specific than #Sourdough, likely to surface content genuinely relevant to beginners maintaining a starter specifically.
- #SourdoughForBeginners — directly matches {{TARGET_AUDIENCE}}'s actual skill level, better relevance-to-reach ratio than the broad tags above.
- #StarterMaintenance — niche enough that competition is low, but check current usage volume before relying on it — very low-volume tags can mean near-zero discovery if the tag isn't actively searched.

### Branded/Community Tags
- #MyStarterJourney — builds the account's searchable archive; minimal reach on its own but valuable for community/repeat-viewer discovery over time.

Flag: #BakingFromScratch's top posts likely include general recipe content (not sourdough-specific), so while topically adjacent, it may pull in viewers less specifically interested in starter maintenance than the niche tags above — worth monitoring engagement quality from this tag specifically if performance data becomes available.
```

## Tips & Variations
- Pair with `social-analytics-report-summarizer-for-stakeholders` (social-media, already shipped) after a few posts using a given hashtag mix — comparing actual engagement quality across tags (not just impression counts) is how a suspected relevance-mismatch flag gets confirmed or ruled out with real data.
- Hashtag effectiveness and platform conventions shift over time — treat this as a starting strategy to test and refine with real performance data, not a fixed formula to reuse indefinitely without revisiting.
- For an account posting frequently on a similar topic, avoid using the exact same tag set on every post — some platforms' discovery algorithms deprioritize content that looks templated/repetitive, and varying the niche tier tags across posts also tests which specific niche tags actually perform.

## Changelog
- 1.0.0 (2026-08-31): Initial version.
