---
id: community-guidelines-enforcement-response-templates
title: Community Guidelines Enforcement Response Templates
category: social-media
tags: [community-management, social-media]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Drafts moderator response templates for enforcing a community's actual guidelines against common violation types — spam, harassment, off-topic promotion, misinformation — clear about which specific rule was broken and what happens next, firm without being needlessly hostile, and calibrated differently for a first-time versus repeat violation.

## When to use it
- You're setting up moderation for a new community and need a starting set of enforcement response templates rather than improvising tone and wording in the moment for each violation.
- Multiple moderators are enforcing the same guidelines inconsistently (different tone, different clarity about what happens next) and you want a shared template set to standardize responses.
- You want to check a moderator's drafted response against the actual guideline violated, since an enforcement message that doesn't name the specific rule can read as arbitrary to the person receiving it.

## The Prompt

```
You draft moderator enforcement response templates for a community's actual guidelines. Each template must name the specific rule violated and state clearly what happens next — vague enforcement language that doesn't explain the "why" reads as arbitrary and increases pushback, even when the moderation action itself is correct.

Community/platform guidelines (the actual rules): {{GUIDELINES}}
Violation types to cover: {{VIOLATION_TYPES}}
Platform: {{PLATFORM}}

Instructions:
1. For each violation type in {{VIOLATION_TYPES}}, draft a first-offense template and a repeat-offense template separately — a repeat violation warrants a different tone (less benefit-of-the-doubt, clearer statement of escalating consequence) than a first instance, which is often better handled as an assumption of unfamiliarity with the rules rather than bad faith.
2. Name the specific rule from {{GUIDELINES}} being enforced in every template — quote or closely paraphrase the actual guideline text, not a generic "this violates our community standards" that doesn't tell the person what they actually did.
3. State the concrete consequence/next step clearly: content removed, a warning logged, a temporary restriction, or escalation to a ban — whichever is appropriate to the violation type and offense count, and make sure the stated consequence is one the moderation team can actually and consistently enforce.
4. Keep tone firm but not hostile even for serious violations (harassment, misinformation) — a template that's needlessly aggressive tends to escalate the interaction rather than close it, while a template that's too soft for a serious violation undersells how seriously the community takes it; calibrate specifically to the violation's actual severity.
5. For violation types where good-faith mistakes are common (off-topic promotion, misunderstanding a nuanced rule), include a brief path for the person to ask a clarifying question or appeal, rather than a purely one-way notification — this reduces repeat friction from genuine confusion versus deliberate rule-breaking.
6. For violation types that are rarely good-faith mistakes (spam, harassment, deliberate misinformation), the template can be more direct and doesn't need to over-explain or over-apologize for the enforcement action.

Output format: Markdown, one section per violation type, each with a "First offense" and "Repeat offense" template. Include a one-line note per template on what specifically differs between the two versions.
```

## Variables
- `{{GUIDELINES}}` — the community's actual stated rules/guidelines. Required — templates need to reference real rules, not generic ones.
- `{{VIOLATION_TYPES}}` — the specific violation types to draft templates for (spam, harassment, off-topic promotion, misinformation, or others specific to this community). Required.
- `{{PLATFORM}}` — the platform, since tone norms and available moderation actions (mute, temp-ban, content removal) differ by platform. Required.

## Example
**Input:** `{{GUIDELINES}}` = "Rule 3: No promotional content or links outside the designated #self-promo channel." `{{VIOLATION_TYPES}}` = "Off-topic promotion" `{{PLATFORM}}` = "Discord"

**Output (excerpt):**
```
### Off-topic promotion

**First offense:**
"Hey [name] — I removed your message in #general since it's promotional content, which per Rule 3 needs to go in #self-promo instead of the main channels. No worries, this happens — feel free to repost it there! Let me know if you have questions about what counts."

Note: Assumes good faith (may not have known about the dedicated channel), gives a clear path to actually share the content correctly rather than just removing it with no resolution, and offers a clarifying-question opening.

**Repeat offense:**
"Hey [name] — this is the second time promotional content's been posted outside #self-promo (Rule 3). I removed it again. Since this is a repeat, further posts outside #self-promo may result in a temporary mute. Please stick to #self-promo for anything promotional going forward."

Note: States the repeat explicitly (removes benefit-of-the-doubt framing), names the concrete escalation consequence for next time, and drops the "no worries" softening since the good-faith assumption is weaker on a second occurrence.
```

## Tips & Variations
- Pair with `crisis-response-statement-drafter` (social-media, already shipped) if a moderation action itself becomes publicly contentious (a high-profile user disputes an enforcement decision publicly) — that prompt is built for public crisis statements, a different and higher-stakes situation than routine one-on-one enforcement messaging.
- Review and update these templates whenever {{GUIDELINES}} changes — a template that quotes an outdated rule undermines the "why" explanation this prompt is built to provide, and moderators using a stale template can create real confusion about what the actual current rule is.
- For a large moderation team, store the generated templates in a shared reference doc rather than having each moderator improvise independently — the consistency benefit only holds if everyone's actually using the same base templates, adapted per situation rather than written from scratch each time.

## Changelog
- 1.0.0 (2026-08-31): Initial version.
