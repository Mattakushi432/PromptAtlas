---
id: conference-talk-outline-from-a-paper
title: Conference Talk Outline from a Paper
category: research-and-academic
tags: [academic-writing, research]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Turns a paper's written structure into a conference-talk outline built for oral presentation logic — not the same sequence read aloud, but reordered around what an audience needs to hear live, with an explicit cut list to fit the time limit and a named "anchor" result the talk builds toward, rather than trying to compress the whole paper into fewer words.

## When to use it
- You've accepted a conference talk slot for a paper you've already written and need to figure out what actually goes in the talk, not just a shortened read-through of the paper.
- Your draft talk outline still runs long against the time limit and you're not sure what's safe to cut without losing the argument's throughline.
- You're mentoring a student giving their first conference talk and want a structural starting point distinct from "just summarize your paper."

## The Prompt

```
You turn a paper into a conference-talk outline built for oral presentation logic, not a compressed read-through of the paper's written structure.

Paper content (full text, or abstract plus key sections/results): {{PAPER_CONTENT}}
Talk time limit: {{TIME_LIMIT}}
Audience (general conference audience vs. specialists in this exact subfield): {{AUDIENCE}}

Instructions:
1. Identify the single result or finding that should function as the talk's anchor — the thing the audience should remember and that everything else in the talk builds toward or away from. A paper often has several findings of similar written weight; a talk needs one clear center of gravity, chosen based on what's most novel, most surprising, or most directly answers the paper's core question.
2. Reorder content around oral logic, not the paper's section order: a paper's methods-then-results-then-discussion structure works on the page where a reader can flip back, but a talk benefits from motivating the question and stakes first, giving just enough method detail for the anchor result to make sense, then building to that result — don't default to presenting sections in the paper's original order.
3. Given {{TIME_LIMIT}}, allocate rough time per section, and explicitly identify what must be cut to fit — secondary results, robustness checks, and extended related-work discussion are usually the first things to cut from a talk even though they matter in the written paper; name specifically what's being cut and why it's safe to omit for an oral format (available in the paper/Q&A if asked, not essential to the core argument).
4. Calibrate technical depth to {{AUDIENCE}} — a specialist audience can handle denser methodological detail and field-specific shorthand; a general conference audience needs more setup for why the question matters before the technical content, and less time spent justifying methodological choices a specialist audience would take for granted.
5. Flag any content that's essential to the paper's written argument but genuinely doesn't work in oral format (a dense table, an equation-heavy derivation) and suggest how to handle it for the talk (a simplified visual, a one-line summary with detail deferred to Q&A) rather than presenting it as read.
6. Include a brief closing that states the takeaway explicitly rather than trailing off into future work — a talk needs a clear "here's what to remember" moment that a paper's more measured conclusion section doesn't need to force as hard.

Output format: Markdown outline with sections and allocated time (summing to {{TIME_LIMIT}}), the anchor result named explicitly, and a `### Cut List` at the end naming what was left out and why.
```

## Variables
- `{{PAPER_CONTENT}}` — the paper's content, either in full or as abstract plus key sections/results. Required.
- `{{TIME_LIMIT}}` — the talk's actual time limit (e.g. "12 minutes plus 3 for questions"). Required — every cut and pacing decision depends on this.
- `{{AUDIENCE}}` — whether the audience is specialists in this exact subfield or a broader conference audience. Required — this changes what needs explaining versus what can be assumed.

## Example
**Input:** `{{PAPER_CONTENT}}` = "Paper on a new caching algorithm; main result is a 40% latency reduction over the prior baseline, with three additional robustness experiments across different workload types, and a related-work section covering 15 prior approaches." `{{TIME_LIMIT}}` = "15 minutes total" `{{AUDIENCE}}` = "Specialists in distributed systems, general conference track, not a caching-specific workshop"

**Output (excerpt):**
```
### Anchor result
The 40% latency reduction over baseline — this is the clearest, most concrete, most memorable number in the paper and should be the thing the talk visibly builds toward and returns to at the close.

### Outline (15 min)
- Motivation & problem (2 min): why current caching approaches hit a latency ceiling under [specific workload characteristic] — set up the gap this work fills, assuming distributed-systems familiarity but not this specific subproblem.
- Core approach (5 min): the key idea behind the algorithm, at a level that explains why it should help, not full implementation detail.
- Main result (4 min): the 40% latency reduction, with the single clearest supporting chart — build directly to this as the anchor.
- One robustness result (2 min): the single most audience-relevant robustness check (pick the workload type most likely to matter to this specialist audience), not all three.
- Takeaway & close (2 min): explicit one-sentence takeaway, not a fade into open questions.

### Cut List
- Two of the three robustness experiments: available in the paper and via Q&A if asked, but including all three would crowd out time for the anchor result itself; the audience needs to trust the result is robust, not see every robustness check.
- The 15-approach related-work survey: compress to a single sentence positioning this work against the 1-2 most directly comparable prior approaches; a specialist audience already has the broader landscape context and a full related-work walkthrough wastes their time.
```

## Tips & Variations
- Pair with `abstract-compressor-to-word-limit` (research-and-academic, already shipped) if the same underlying compression pressure applies to writing the talk's session-listing abstract — that prompt handles the written word-limit version of a similar tradeoff.
- Practice against {{TIME_LIMIT}} with an actual timer before the talk — an outline that looks right on paper often runs 20-30% over once spoken aloud with natural pacing, so build in a buffer rather than planning to exactly hit the limit.
- If the anchor result identified here doesn't match what you'd instinctively lead with, treat that mismatch as useful signal — it often means the paper's written emphasis and the talk's actual most-compelling finding have quietly diverged, worth resolving before finalizing slides.

## Changelog
- 1.0.0 (2026-08-31): Initial version.
