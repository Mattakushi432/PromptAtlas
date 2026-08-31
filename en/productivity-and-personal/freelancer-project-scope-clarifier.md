---
id: freelancer-project-scope-clarifier
title: Freelancer Project Scope Clarifier
category: productivity-and-personal
tags: [task-planning, requirements]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Generates the specific scoping questions a freelancer needs answered before quoting or starting a vague client project — deliverables, revision rounds, what's explicitly out of scope, and client-side dependencies — turning an underspecified brief into a concrete list of gaps to close before work begins, rather than starting work on assumptions that later become disputed scope creep.

## When to use it
- A client sent a project description that's exciting but vague, and you want to know exactly what to ask before quoting a price or timeline you might regret.
- You've been burned by scope creep before (endless "just one more small thing") and want to build the guardrails into the very first conversation rather than after the project's already underway.
- You're reviewing your own draft proposal before sending it and want to check whether it actually locks down scope or just restates the client's vague brief back to them.

## The Prompt

```
You generate the specific scoping questions a freelancer needs answered before quoting or starting a project, from a vague or underspecified client brief. You are not writing the proposal itself — you are surfacing exactly what's unclear or undefined that would cause a dispute or scope creep later if left unaddressed.

Client's project description (as given, however vague): {{PROJECT_DESCRIPTION}}
Type of work / freelancer's discipline (e.g. web design, copywriting, video editing): {{WORK_TYPE}}
Anything already clarified or agreed on (optional): {{ALREADY_CLARIFIED}}

Instructions:
1. Identify what {{PROJECT_DESCRIPTION}} does and doesn't specify about deliverables — not just "a website" but how many pages, what specific assets (do they need copy written, or just the design?), in what file formats/handoff method. Generic descriptions almost always hide an assumed deliverable list that isn't actually agreed on.
2. Ask specifically about revision rounds: how many rounds of feedback/revision are included, what counts as a revision versus a new request, and what happens if more rounds are needed than scoped — this is one of the most common sources of freelancer scope creep and is almost never specified in an initial client brief.
3. Generate at least 2-3 explicit "what's NOT included" questions relevant to {{WORK_TYPE}} — the things clients commonly assume are included but freelancers commonly don't (e.g. ongoing hosting/maintenance after a website launches, stock photo licensing costs, rush delivery, minor edits after "final" delivery).
4. Identify dependencies on the client that could delay or block the work (client needs to provide brand assets, approve a concept before the next phase starts, respond within some timeframe) and generate a question that pins down what happens if the client is the one causing delay — this protects the freelancer's timeline commitments from being blamed for a client-side bottleneck.
5. If {{ALREADY_CLARIFIED}} is given, don't re-ask what's already answered — build only on the genuine remaining gaps.
6. Prioritize the questions: mark the 3-5 most important as "must clarify before quoting," and the rest as "clarify before starting, can wait until after the quote is accepted" — not every open question needs to block sending a quote.

Output format: Markdown with two sections: Must Clarify Before Quoting, and Clarify Before Starting. Each question should be specific enough to send directly to the client, not a category label.
```

## Variables
- `{{PROJECT_DESCRIPTION}}` — the client's project description, as given. Required.
- `{{WORK_TYPE}}` — the freelancer's discipline, since common scope gaps differ significantly by type of work. Required.
- `{{ALREADY_CLARIFIED}}` — anything already discussed and agreed on with the client. Optional, but prevents redundant questions.

## Example
**Input:** `{{PROJECT_DESCRIPTION}}` = "We need a new website for our small bakery — something modern that shows off our products and lets people see our menu." `{{WORK_TYPE}}` = "Web design" `{{ALREADY_CLARIFIED}}` = "Client confirmed they'll provide their own product photos."

**Output (excerpt):**
```
### Must Clarify Before Quoting
1. How many pages, specifically? "A website" could mean a single landing page or a 6-page site (home, menu, about, contact, gallery, ordering) — these are very different scopes and prices.
2. Who's writing the copy (page text, product descriptions, about-us content)? Is that included in this quote, or does the client provide finished text?
3. Is the "menu" a static page, or does it need to be editable by the client themselves later without hiring you again (i.e. does this need a CMS or admin panel)? This significantly changes the technical scope.
4. How many rounds of design revision are included before additional rounds are billed separately?

### Clarify Before Starting
5. What's NOT included that the client might assume is: e.g. ongoing hosting setup/maintenance after launch, domain registration, SEO work beyond basic setup, and any online-ordering/e-commerce functionality if "menu" later turns out to mean "order online."
6. Since {{ALREADY_CLARIFIED}} confirms the client provides product photos: what happens to the timeline if those photos are delayed — is there a firm date by which they need to be delivered to you to keep the project on schedule?
7. What does "modern" mean to the client, concretely — do they have 2-3 reference sites they like, or is this purely subjective and worth pinning down with examples before design work starts?
```

## Tips & Variations
- Pair with `pricing-strategy-stress-tester` (business-and-strategy, already shipped) if the scoping process reveals the project could reasonably be quoted at multiple tiers (e.g. basic vs. full-featured site) — that prompt is built for company-level pricing tiers but the same segmented-offer thinking can help structure a tiered freelance quote.
- Send the "Must Clarify Before Quoting" questions before giving any price — a quote based on an unclarified scope is effectively a guess, and revising a quote upward after the client has already anchored on a number is a much harder conversation than asking first.
- If a client is reluctant to answer specific scoping questions and wants "just a rough idea" of price, it's reasonable to give a wide range explicitly conditioned on scope ("$X-$3X depending on page count and whether copywriting is included") rather than either refusing to quote or committing to a number you don't have enough information to stand behind.

## Changelog
- 1.0.0 (2026-08-31): Initial version.
