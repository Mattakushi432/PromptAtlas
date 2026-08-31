---
id: inbox-triage-rules-drafter
title: Inbox Triage Rules Drafter
category: productivity-and-personal
tags: [email, productivity]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Drafts a concrete set of inbox triage rules (what gets archived, flagged, snoozed, or actioned immediately) from a description of the kinds of email someone actually receives — with the reasoning behind each rule stated explicitly, not a generic "use folders and unsubscribe more" essay that ignores the specific mix of senders and urgency patterns in this particular inbox.

## When to use it
- Your inbox has become a flat, undifferentiated stream and you want a starting rule set that actually reflects how you use email, not a generic productivity-blog template.
- You keep manually re-deciding what to do with the same recurring email types (a weekly report, a specific client's messages, internal notifications) and want that decision made once, as a rule, instead of every time it arrives.
- You're setting up a new email client/filter system and want a first draft of rules to configure, based on your actual inbox patterns rather than starting from a blank rule list.

## The Prompt

```
You draft a concrete set of inbox triage rules from a description of the email someone actually receives. Each rule must state a specific trigger and a specific action — not a vague principle like "handle important emails first."

Categories of email typically received (senders, types, rough volume): {{EMAIL_CATEGORIES}}
Triage goals (what "under control" looks like for this person): {{TRIAGE_GOALS}}
Anything already tried that didn't work, if relevant (optional): {{PRIOR_ATTEMPTS}}

Instructions:
1. For each category in {{EMAIL_CATEGORIES}}, assign one of a fixed set of actions: Archive immediately (no action needed, just a record), Flag for same-day action, Snooze to a specific later time/day, Action now (blocks something else), or Unsubscribe/filter out entirely — do not invent vague actions like "review periodically" that don't specify when or how.
2. State the trigger for each rule as concretely as possible — a specific sender or domain, a subject-line pattern, or a recognizable category, not "unimportant-looking emails," which isn't something a rule (or a person scanning quickly) can reliably apply.
3. Justify each rule's action against {{TRIAGE_GOALS}} — a rule that archives client emails immediately might satisfy an "inbox zero" goal but actively work against a "never miss a client request" goal, so the reasoning has to connect the action to what this person is actually trying to achieve, not a generic best practice.
4. Flag any category that appears in {{EMAIL_CATEGORIES}} but seems to have no rule that would actually reduce time spent on it (e.g. a high-volume category where every rule proposed still requires reading each one) — call this out rather than silently proposing a rule that doesn't solve the actual problem.
5. If {{PRIOR_ATTEMPTS}} describes something that didn't work, diagnose briefly why before proposing something similar again — a filter rule that was too broad and caught wanted emails needs a narrower trigger, not the same rule repeated.
6. Note which rules are safe to fully automate (a mail-client filter) versus which need to stay a manual habit because the trigger requires judgment a filter can't reliably make (e.g. distinguishing an urgent client email from a routine one from the same sender).

Output format: Markdown table with columns Category | Trigger | Action | Reasoning, followed by a short "Automate vs. Manual" note listing which rules can be set up as actual filters.
```

## Variables
- `{{EMAIL_CATEGORIES}}` — the kinds of email regularly received, with enough detail to identify concrete triggers (specific senders, subject patterns, rough volume/frequency). Required.
- `{{TRIAGE_GOALS}}` — what the person is actually trying to achieve (inbox zero, never missing something specific, spending less time on email overall). Required — the correct rule depends entirely on the actual goal, not a generic "better inbox management."
- `{{PRIOR_ATTEMPTS}}` — anything already tried that didn't work. Optional, but helps avoid proposing the same failed approach again.

## Example
**Input:** `{{EMAIL_CATEGORIES}}` = "Automated weekly analytics report (same sender, same subject line every Monday); Slack digest emails (high volume, low importance); Direct emails from 3 key clients (irregular, sometimes urgent); Internal all-hands announcements (infrequent, need to be seen but not urgent)" `{{TRIAGE_GOALS}}` = "Never miss a client email needing same-day response; spend less than 15 min/day on everything else" `{{PRIOR_ATTEMPTS}}` = "Tried a general 'low priority' folder for everything non-client, but stopped checking it entirely and missed the all-hands announcements"

**Output (excerpt):**
```
| Category | Trigger | Action | Reasoning |
|---|---|---|---|
| Weekly analytics report | Sender = [report sender], recurring subject pattern | Archive immediately, no read required unless flagged elsewhere | Purely a record; {{TRIAGE_GOALS}} doesn't mention needing to review this weekly, so archiving avoids it competing for attention with client emails. |
| Slack digest emails | Sender domain = Slack notifications | Unsubscribe or filter to auto-delete | High volume, low importance per {{TRIAGE_GOALS}} — this is exactly the kind of email that shouldn't cost any of the 15-minute daily budget; if the info is needed, it's more reliably found in Slack itself than in a digest email. |
| Client emails (3 key clients) | Sender = any of the 3 named client domains | Flag for same-day action, kept visible (not archived, not filtered to a folder) | This directly serves the "never miss a client email" goal — the previous attempt's failure (a low-priority folder that stopped being checked) shows that anything client-related needs to stay in the primary view, not sorted away. |
| Internal all-hands announcements | Sender = internal all-hands distribution list | Flag for same-day skim, not archived on arrival | {{PRIOR_ATTEMPTS}} shows the generic low-priority folder caused these to be missed — this category needs its own explicit rule rather than being lumped into "everything else," since it has a "need to be seen" requirement the failed folder didn't respect. |

### Automate vs. Manual
Fully automatable as mail-client filters: weekly report archiving, Slack digest unsubscribe/delete. Needs to stay a manual glance rather than a filter: client emails (already un-filtered, just needs to stay visually prioritized) and all-hands announcements (a filter could tag them, but "same-day skim" still requires you to actually look).
```

## Tips & Variations
- Pair with `weekly-priorities-planner-from-a-brain-dump` (productivity-and-personal, already shipped) if triaging the inbox surfaces action items that need to be scheduled rather than just categorized — this prompt sorts what to do with an email, not when to actually do the resulting work.
- Revisit these rules whenever {{EMAIL_CATEGORIES}} changes meaningfully (a new recurring sender, a role change that shifts what's actually urgent) — a rule set tuned for an old inbox pattern can quietly stop matching reality.
- If a single sender legitimately sends both urgent and routine email (a client who sometimes needs same-day response and sometimes doesn't), that category can't be fully solved by a trigger-based rule alone — flag it explicitly as needing a manual judgment call rather than forcing an automated rule to guess.

## Changelog
- 1.0.0 (2026-08-31): Initial version.
