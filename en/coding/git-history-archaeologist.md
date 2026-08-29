---
id: git-history-archaeologist
title: Git History Archaeologist
category: coding
tags: [git, blame, code-history]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Explains why a specific line or block of code likely exists, given `git blame`/`git log` context — reconstructing intent from commit messages, surrounding history, and code shape. For understanding unfamiliar, seemingly-odd existing code, distinct from `merge-conflict-resolver-guide` (active conflict) and `legacy-code-modernizer` (migrating a known pattern, not investigating an unclear one).

## When to use it
- Encountering a strange-looking line of code (an odd special case, a magic number, a workaround) and wanting to understand why it's there before touching it.
- Deciding whether it's safe to remove/change something by first understanding why it was added in the first place.
- Onboarding onto unfamiliar code and using its history as a faster way to understand intent than reading the code cold.

## The Prompt

```
You reconstruct why a specific piece of code likely exists, using git history evidence — reasoning from commit messages, surrounding changes, and code shape, not just describing what the code currently does.

Code in question: {{CODE}}
Git blame/log output for this code (commit messages, dates, possibly diffs of the introducing commit): {{GIT_HISTORY}}
Related context (optional — linked ticket numbers found in commit messages, adjacent code): {{RELATED_CONTEXT}}

Instructions:
1. Identify the commit that introduced this specific code (or its current form, if it's been modified since) and extract what the commit message says about intent — take the stated reason at face value first, then check whether the code shape is consistent with that stated reason.
2. If the commit message is unhelpful (generic like "fix bug" or "update code"), look at surrounding evidence: what else changed in the same commit (a bug fix commit that also touches a test file suggests what bug was being fixed and how), the commit's date relative to other related changes, referenced ticket/issue numbers.
3. Distinguish different likely categories of "why": a workaround for a specific external bug/limitation (often has a comment nearby, or a commit message mentioning a library/API name), a business-requirement-driven special case (a specific customer/edge case), a defensive check against a bug that occurred in production (often introduced alongside a test reproducing that specific bug), or genuinely dead/obsolete code that outlived its original reason.
4. If multiple commits touched this code over time, trace the evolution — the original reason may no longer be the current reason if later commits repurposed or extended the original code.
5. State your confidence: HIGH (commit message + code shape + surrounding evidence all point the same direction), MEDIUM (a plausible story but some ambiguity), LOW (the history doesn't give enough to reconstruct intent confidently — say what's missing, like a linked ticket that would clarify it).
6. If asked implicitly or explicitly whether this code is now safe to remove/change, answer that based on the reconstructed intent: if the original reason (e.g., a bug in a since-upgraded dependency) is confirmed no longer applicable, say so; if the reason is still plausibly relevant, flag that removing it carries real risk.

Output format: Markdown with sections: Introducing Commit & Stated Intent, Supporting/Contradicting Evidence, Likely Category, Confidence, and (if relevant) Safety-to-Remove Assessment.
```

## Variables
- `{{CODE}}` — the code whose history is being investigated. Required.
- `{{GIT_HISTORY}}` — the actual `git blame`/`git log -p` output or equivalent for this code. Required — without real history data, this degrades into speculation from the code alone.
- `{{RELATED_CONTEXT}}` — ticket references, adjacent code, or other supporting evidence. Optional but helps confirm the hypothesis.

## Example
**Input:** `{{CODE}}` = `if (userId === 'user_4471') { skipValidation = true; }`, `{{GIT_HISTORY}}` = commit message "hotfix: unblock acme-corp signup, ticket SUPPORT-892, remove after their data is cleaned up".

**Output (excerpt):**
```
## Introducing Commit & Stated Intent
The commit message directly states this is a temporary hotfix for a specific customer (implied by "acme-corp") to work around a data issue, explicitly flagged for removal once their data is cleaned up (SUPPORT-892).

## Likely Category
A defensive/workaround special case for a specific known issue — explicitly temporary by the commit's own admission, not a permanent business requirement.

## Confidence
HIGH — the commit message is unusually explicit about both the reason and the intended lifespan of this code.

## Safety-to-Remove Assessment
This code was explicitly meant to be temporary. Check ticket SUPPORT-892's current status — if it's resolved/closed, this special case is very likely safe to remove now; if still open, confirm with whoever owns that ticket before removing, since the underlying data issue may not actually be resolved yet.
```

## Tips & Variations
- For code with no useful commit message at all (a common problem with old squashed history), be explicit that the confidence will be capped at MEDIUM/LOW, and suggest asking the original author directly if they're still reachable, rather than presenting a speculative story with unwarranted confidence.
- Pair with `git blame -w -C` output (ignoring whitespace, tracking code movement across files) for code that's been moved/refactored, since a naive blame on a moved line often points to the refactor commit rather than the original authorial intent.

## Changelog
- 1.0.0 (2026-08-29): Initial version.
