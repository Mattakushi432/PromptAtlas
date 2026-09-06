---
id: offer-competitiveness-auditor
title: Offer Competitiveness Auditor
category: career-and-hr
tags: [compensation, hr]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-01
---

## Description
Checks a drafted offer against stated market bands and the candidate's actual context before it's sent — flags a component that's off-band, a total package that looks fine in aggregate but is weak on the specific component the candidate likely cares most about, and internal-equity risk against comparable existing employees — the pre-send counterpart to `compensation-band-rationale-writer` (career-and-hr, already shipped), which documents the rationale for a band after a decision is made rather than auditing a specific offer before it goes out.

## When to use it
- An offer has been drafted and you want a check against the stated market bands and internal equity before it's sent, catching an error or a weak component while it's still cheap to fix.
- A candidate has expressed hesitation about an offer and you want to systematically check whether the offer is actually competitive on the dimension they likely care about, rather than guessing.
- You're reviewing an offer drafted by someone else (a newer recruiter, a hiring manager without deep comp context) and want a structured second check before it's extended.

## The Prompt

```
You audit a drafted offer against stated market bands and candidate context before it's sent. You check for genuine competitiveness gaps — you do not simply confirm the offer looks reasonable without checking it against the specifics given.

Drafted offer (base, bonus, equity, other components): {{OFFER}}
Market band for this role/level: {{MARKET_BAND}}
Candidate context (what they've signaled matters, their current comp if known, any competing offer context): {{CANDIDATE_CONTEXT}}

Instructions:
1. Check each component of {{OFFER}} against {{MARKET_BAND}} individually, not just the total package — a total package that lands mid-band can still have one component (e.g. base salary) below band while another (e.g. equity) is above, and a candidate focused on base salary specifically will notice a below-band base regardless of a strong total number.
2. If {{CANDIDATE_CONTEXT}} indicates what the candidate actually cares about (cash now vs. long-term equity, a specific comp component they've flagged, a competing offer's structure), check whether {{OFFER}} is actually competitive on that specific dimension — an offer that's strong in aggregate but weak on the candidate's actual priority is more likely to be declined than the total-package number would suggest.
3. If {{CANDIDATE_CONTEXT}} mentions a competing offer, check for structural mismatches beyond the headline number — a candidate comparing a higher-cash-lower-equity offer against a lower-cash-higher-equity one needs the comparison actually explained, not just a bigger number thrown at the gap.
4. Flag internal equity risk: if {{CANDIDATE_CONTEXT}} or additional context indicates this offer would be notably higher or lower than existing employees in comparable roles/levels, flag this explicitly — an externally-competitive offer that creates an internal equity problem trades one risk for another, and that tradeoff should be visible to the decision-maker, not silently accepted.
5. Check for a common offer-drafting error: a below-band component justified only by "that's what we usually offer" rather than any specific rationale tied to this candidate or role — if {{OFFER}} has a component below {{MARKET_BAND}} with no stated justification, flag it as needing one before the offer goes out.
6. If everything checks out, say so directly rather than manufacturing a finding — an audit that finds no real issues is a useful, confidence-building result, not a failure to be thorough.

Output format: Markdown. For each component: band comparison (above/at/below), any flag, and — if off-band or a candidate-priority mismatch — the specific concern and a suggested adjustment or justification to document. End with an internal-equity flag if applicable and an overall verdict: competitive as drafted, or specific adjustments to consider before sending.
```

## Variables
- `{{OFFER}}` — the drafted offer's components (base, bonus, equity, sign-on, other). Required.
- `{{MARKET_BAND}}` — the stated market band for this role/level, ideally per-component. Required — without this, "competitive" can't be assessed against anything concrete.
- `{{CANDIDATE_CONTEXT}}` — what's known about the candidate's priorities, current comp, or a competing offer. Optional, but substantially sharpens which findings actually matter to this specific candidate versus generic band compliance.

## Example
**Input:** `{{OFFER}}` = "Base: $145K. Bonus target: 10%. Equity: $40K/4yr vest." `{{MARKET_BAND}}` = "Base: $150K-$175K. Bonus target: 10-15%. Equity: $30K-$60K/4yr vest." `{{CANDIDATE_CONTEXT}}` = "Candidate has a competing offer they described as 'similar total comp but more cash upfront'; has 2 young kids and mentioned cash flow matters to them right now"

**Output (excerpt):**
```
### Base: $145K — Below band ($150K-$175K)
Base is $5K below the low end of {{MARKET_BAND}}. Given {{CANDIDATE_CONTEXT}} explicitly signals cash-flow sensitivity right now, a below-band base is the specific component most likely to matter to this candidate — even though equity sits comfortably mid-band, that doesn't offset a cash-focused candidate's actual priority.
Suggested adjustment: raise base to at least the low end of band ($150K); if budget-constrained, this is a higher-leverage fix than adding equity, given the candidate's stated cash preference.

### Structural mismatch vs. competing offer
{{CANDIDATE_CONTEXT}} describes the competing offer as similar total comp but more cash upfront — this offer's structure (below-band base, mid-band equity) is the opposite of what the candidate said they'd prefer. A larger total-package number wouldn't necessarily close this gap if the cash/equity mix itself is the mismatch.

### Overall Verdict
Specific adjustment to consider before sending: raise base toward the low end of band. As currently structured, the offer's cash-vs-equity mix runs counter to both the candidate's stated preference and their described competing offer's structure — the total package number alone doesn't capture this risk.
```

## Tips & Variations
- Pair with `compensation-band-rationale-writer` (career-and-hr, already shipped) once an off-band component is confirmed as intentional (not an error) — that prompt documents the rationale for the record; this prompt is the pre-send check that surfaces whether a rationale is actually needed in the first place.
- If {{CANDIDATE_CONTEXT}} is thin (no signal on priorities), this prompt's component-by-component band check still works, but the candidate-priority-specific findings will be limited — flag this explicitly rather than guessing what the candidate cares about without evidence.
- For a counter-offer situation (the candidate has pushed back on an initial offer), re-run this audit on the counter before sending it — the same band/equity/priority checks apply, and a counter-offer drafted under time pressure is exactly when a below-band component is likely to slip through unflagged.

## Changelog
- 1.0.0 (2026-09-01): Initial version.
