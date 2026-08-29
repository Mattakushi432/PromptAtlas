---
id: merge-conflict-resolver-guide
title: Merge Conflict Resolver Guide
category: coding
tags: [git, merge-conflicts, debugging]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Walks through resolving a specific merge conflict safely — explaining what each side changed, why they conflict, and the correct resolution — rather than blindly picking one side. For a real conflict in front of you, distinct from `git-history-archaeologist` (explains existing committed code, not an active conflict).

## When to use it
- Stuck on a merge/rebase conflict where it's not obvious which side is "correct" or how to combine both changes.
- Reviewing someone else's conflict resolution to check whether they accidentally dropped one side's intent.
- Learning to read conflict markers and reason about them systematically instead of guessing.

## The Prompt

```
You walk through resolving a specific merge conflict — explain both sides' intent and produce a correct resolution, not just pick one side.

Conflicted file section (including the `<<<<<<<`/`=======`/`>>>>>>>` markers): {{CONFLICT}}
Context on each side, if known (optional — e.g. "ours is the release branch, theirs is a feature branch that renamed this function"): {{SIDE_CONTEXT}}
Surrounding code for context (optional): {{SURROUNDING_CODE}}

Instructions:
1. Explain what each side (`ours`/`HEAD` and `theirs`/the incoming branch) was trying to accomplish — not just what the text says, but the apparent intent behind the change, inferred from the code itself and any {{SIDE_CONTEXT}} given.
2. Determine whether this is a true logical conflict (both sides changed the same behavior in incompatible ways — a real decision is needed) or a false conflict (both sides made compatible or even identical changes that just happen to touch the same lines, e.g., both renamed a variable to the same new name, or one side's change is a strict superset of the other's).
3. For a true conflict, propose a resolution that preserves the intent of BOTH sides where possible (e.g., if one side added a new parameter and the other side added a new validation check, the resolution likely needs both), rather than defaulting to "keep ours" or "keep theirs."
4. If preserving both sides' intent is genuinely impossible (they made mutually exclusive decisions about the same behavior), say so explicitly, explain the tradeoff between the two options, and recommend one with reasoning — don't silently pick one without flagging that a real decision was made.
5. Write out the exact resolved code (with conflict markers removed) so it can be directly used, not just a description of what to do.
6. Flag anything in the surrounding code (if provided) that might also need updating for consistency with the resolution — a conflict resolution that fixes the marked lines but leaves a related unmarked line now-inconsistent is a common source of subtle post-merge bugs.
7. Recommend what to verify after resolving (a specific test to run, a behavior to manually check) given what changed on both sides.

Output format: Markdown with sections: What Each Side Changed, True or False Conflict, Resolved Code, What to Verify After.
```

## Variables
- `{{CONFLICT}}` — the conflicted section with markers. Required.
- `{{SIDE_CONTEXT}}` — what each branch/side represents or was trying to do. Optional but very helpful for judging intent.
- `{{SURROUNDING_CODE}}` — code near the conflict for broader context. Optional.

## Example
**Input:** `{{CONFLICT}}` = ours adds a `timeout` parameter to a function with default 30, theirs adds input validation to the same function for an existing parameter, both touching the function signature/body.

**Output (excerpt):**
```
## What Each Side Changed
Ours: added a new `timeout` parameter (default 30s) to control request timeout, unrelated to validation.
Theirs: added a validation check on the existing `url` parameter to reject empty strings.

## True or False Conflict
False conflict — both changes are independent and compatible; they only overlap because both touch the same function signature/body region. Both should be kept.

## Resolved Code
```js
function fetchData(url, timeout = 30) {
  if (!url) throw new Error('url is required');
  // ...
}
```

## What to Verify After
Run the existing test suite for this function, and add a test combining both new behaviors: an empty-url call should still throw regardless of the timeout value passed.
```

## Tips & Variations
- For a conflict in a lockfile or generated file (rather than hand-written source), the right answer is usually "regenerate the file, don't hand-merge it" — flag this explicitly if the conflict looks like it's in a generated artifact.
- For a long-running feature branch with many conflicts against a fast-moving main, consider rebasing incrementally and resolving conflicts commit-by-commit rather than one giant merge conflict — mention this as a process suggestion if the conflict looks unusually large/tangled.

## Changelog
- 1.0.0 (2026-08-29): Initial version.
