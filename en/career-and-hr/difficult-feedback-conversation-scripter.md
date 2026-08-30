---
id: difficult-feedback-conversation-scripter
title: Difficult Feedback Conversation Scripter
category: career-and-hr
tags: [performance-review, management, coaching]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Plans and scripts talking points for a specific difficult feedback conversation — a live-conversation planning tool, distinct from `performance-review-draft-from-bullet-notes` (career-and-hr, already shipped), which drafts the written review document itself rather than planning how to deliver a specific hard message verbally.

## When to use it
- You need to deliver feedback you know will be hard to hear (a significant performance gap, a behavioral concern, news the person won't want) and want to plan the conversation rather than improvise it.
- You tend to either soften hard feedback into vagueness or deliver it too bluntly, and want a structure that helps you land in between.
- You're preparing for a conversation where you expect pushback or an emotional reaction and want to think through how to stay grounded rather than get derailed.

## The Prompt

```
You script talking points for a specific difficult feedback conversation. You work from the actual situation given — you do not invent details about the person or the issue not provided, and you do not soften the core message into vagueness in the name of being "nice."

The feedback that needs to be delivered: {{FEEDBACK}}
Context/relationship: {{CONTEXT}}
What you're worried about in this conversation: {{CONCERNS}}

Instructions:
1. Open with a direct statement of the topic within the first 1-2 sentences — do not bury the actual point under a long preamble of unrelated positive comments ("sandwich" openers that delay the real message read as evasive and can make the recipient more anxious while they wait for the actual point).
2. State the specific behavior/pattern and its impact using concrete, observable language — not trait labels or vague characterizations ("you're not a team player") but specific instances and effects ("in the last two sprints, three deliverables missed their date without an earlier heads-up, which meant downstream teams found out at the last minute").
3. If {{CONCERNS}} mentions anticipated pushback or a specific reaction, script a planned response to that specific reaction — not a generic "stay calm" note, but what you'll actually say if, for example, the person disputes the facts, gets defensive, or gets emotional, so you're not scripting only your opening and improvising the harder part.
4. Include a genuine space for the other person's perspective — script an actual open question ("What's your read on this?" or "Is there context I'm missing?") rather than a rhetorical one that doesn't leave real room for a different account of events.
5. End with a concrete next step or expectation, not just the criticism on its own — what changes, by when, and how it'll be checked on, so the conversation lands as feedback aimed at a path forward rather than a complaint with no resolution.
6. If {{FEEDBACK}} as described is actually about a policy/process issue rather than the individual's performance (e.g. the "problem" is really unclear expectations that were never communicated), flag that distinction — delivering this as personal feedback when the root cause is a process gap sets up an unfair conversation, and the script should account for that if it's the case.

Output format: a scripted talking-points outline (not a verbatim transcript) organized as Opening / Core Message / Anticipated Reactions & Responses / Space for Their Perspective / Next Steps.
```

## Variables
- `{{FEEDBACK}}` — the specific feedback that needs to be delivered, as concretely as possible. Required.
- `{{CONTEXT}}` — the relationship and relevant history (how long you've worked together, any prior related conversations). Required.
- `{{CONCERNS}}` — what you're specifically worried about in this conversation (defensiveness, tears, denial, escalation). Required — without this, the script can't prepare you for the actual hard part.

## Example
**Input:** `{{FEEDBACK}}` = "Direct report has missed three consecutive sprint deadlines without flagging it in advance, causing downstream teams to be blindsided each time" `{{CONTEXT}}` = "Been managing them for 8 months, previously strong performer, no prior conversation about this specific pattern yet" `{{CONCERNS}}` = "Worried they'll get defensive and blame unclear requirements from the team lead, which has happened before in team meetings"

**Output (excerpt):**
```
### Opening
"I want to talk about the last three sprints — each one missed its deadline, and in each case downstream teams found out at the last minute rather than getting a heads-up. I want to understand what's going on and figure out a path forward together."

### Core Message
Specific pattern: three consecutive misses, no advance flag in any of them. Impact: downstream teams (name them if relevant) had to scramble each time, which affects their planning too. This is a new pattern for them, not something we've discussed before, so it's worth naming clearly rather than assuming they already know it's a problem.

### Anticipated Reactions & Responses
If they blame unclear requirements from the team lead (per your stated concern): acknowledge the specific instance if it's real ("if requirements were genuinely unclear on X, that's worth addressing separately") without letting it fully absorb the actual pattern being raised — the advance-flagging gap exists independent of whether requirements were clear, since even unclear requirements can be flagged early rather than discovered at the deadline.

### Space for Their Perspective
"What's been going on for you across these three sprints — is there something structural I'm missing, or has something changed?"

### Next Steps
Going forward: flag any at-risk deadline at least 2 days before it's due, even if the risk is uncertain. Check-in: revisit in the next 1:1 (2 weeks out) to see if the pattern is shifting.
```

## Tips & Variations
- If `{{CONCERNS}}` includes a real possibility the conversation could escalate significantly (a formal complaint, a legal-adjacent situation), loop in HR/People before the conversation rather than relying solely on this prompt's script — this prompt is for standard difficult-but-normal management conversations, not situations needing formal process.
- After the actual conversation, it's worth noting where the real conversation diverged from the script — feedback conversations rarely go exactly as planned, and reviewing the gap helps calibrate the next one.
- For a positive-but-still-hard conversation (e.g. someone genuinely is a strong performer but needs to hear a boundary was crossed), the same structure applies — this prompt isn't scoped only to negative performance feedback, but to any conversation where the honest message is one the person won't want to hear.

## Changelog
- 1.0.0 (2026-08-30): Initial version.
