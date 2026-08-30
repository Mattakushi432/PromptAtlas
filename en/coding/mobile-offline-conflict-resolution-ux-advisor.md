---
id: mobile-offline-conflict-resolution-ux-advisor
title: Mobile Offline Conflict Resolution UX Advisor
category: coding
tags: [mobile, offline-first, state-management]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Designs the user-facing experience for resolving sync conflicts in an offline-first mobile app — a UX-layer counterpart to `offline-first-sync-designer` (coding, already shipped)'s data-layer/technical sync strategy: that prompt designs how conflicts are detected and merged at the data layer; this one designs what the user actually sees and does when a conflict needs their input.

## When to use it
- You've designed (or are using) a technical conflict-resolution strategy (last-write-wins, CRDT merge, etc.) but haven't designed what happens when a conflict genuinely needs human judgment to resolve.
- Users are confused or losing data because conflicts are being silently auto-resolved in a way that surprises them, and you need a UX approach that surfaces conflicts appropriately.
- You're adding offline support to a feature and want to think through the conflict UX before implementation, not retrofit it after users start hitting confusing edge cases.

## The Prompt

```
You design the user-facing experience for resolving sync conflicts in an offline-first mobile app. You design for the specific data type and conflict scenarios described — you do not propose a generic "show a merge dialog" solution disconnected from what's actually being edited and how conflicts actually arise here.

Feature/data being synced: {{FEATURE}}
Technical conflict scenario(s) that can occur: {{CONFLICT_SCENARIOS}}
Current or planned technical resolution strategy: {{TECHNICAL_STRATEGY}}

Instructions:
1. For each scenario in {{CONFLICT_SCENARIOS}}, determine whether it's safe to auto-resolve silently (e.g. non-overlapping edits to different fields, additive changes like adding items to a list from two devices) or whether it genuinely needs user input (e.g. the same field edited differently on two devices, a delete on one device conflicting with an edit on another) — do not default to always surfacing conflicts to the user, since over-surfacing trivial conflicts trains users to dismiss the UI without reading it.
2. For scenarios needing user input, design the specific conflict-resolution UI: what's shown (both versions side by side? a diff view? just a choice between "keep mine" / "keep theirs"?), calibrated to {{FEATURE}}'s actual data type — a text note conflict needs different UI than a conflicting numeric value or a conflicting boolean toggle.
3. Design for the case where the user is offline again when the conflict resolution UI would need to show — can resolution be deferred until back online, and if so, what does the interim state look like (which version does the user see/edit against in the meantime)?
4. Design an explicit "no data loss" fallback: even when auto-resolving, is the losing version ever fully discarded, or is there a way to recover it (e.g. a version history, an undo window) — silent, unrecoverable data loss from an auto-resolved conflict is one of the most damaging offline-sync failure modes, and the design should address it explicitly rather than leaving it implicit.
5. Consider notification/timing: should the user be interrupted immediately when a conflict is detected (e.g. right when they come back online), or can resolution wait until they naturally navigate to the affected content — an immediate interrupt for a low-stakes conflict can feel more disruptive than the conflict itself.
6. If {{TECHNICAL_STRATEGY}} already commits to always-auto-resolve with no user-facing conflict UI at all, check whether that's actually appropriate given {{CONFLICT_SCENARIOS}} — flag any scenario in that list where silent auto-resolution would plausibly cause a user-visible, confusing data loss, since that's a mismatch between the technical strategy and the UX needs.

Output format: Markdown, one entry per conflict scenario: auto-resolve vs. needs-user-input verdict, and (for user-input cases) a description of the specific UI/flow, plus a `### Data Loss Safety Net` section addressing recovery for auto-resolved cases.
```

## Variables
- `{{FEATURE}}` — the specific feature/data type being synced (e.g. "a personal notes app's note content," "a shopping cart's item list"). Required.
- `{{CONFLICT_SCENARIOS}}` — the specific ways a conflict can technically arise for this feature. Required.
- `{{TECHNICAL_STRATEGY}}` — the current or planned data-layer resolution approach. Required — the UX design has to work with (or push back on) what the technical layer actually does.

## Example
**Input:** `{{FEATURE}}` = "A personal task list app — task title, completion status, due date" `{{CONFLICT_SCENARIOS}}` = "Same task's title edited differently on two offline devices; task marked complete on one device while its due date was changed on another; task deleted on one device while edited on another" `{{TECHNICAL_STRATEGY}}` = "Currently last-write-wins for all fields, no user-facing conflict UI"

**Output (excerpt):**
```
### Scenario: Title edited differently on two devices
Verdict: Needs user input — two genuinely different intended titles can't be safely merged automatically without risking the user losing their intended edit on one device.
UI: A simple two-option choice ("Keep '[Device A title]'" / "Keep '[Device B title]'") rather than a complex diff view — task titles are short enough that side-by-side full text is more readable than a diff.

### Scenario: Completed on one device, due date changed on another
Verdict: Auto-resolve — these are non-overlapping field edits (completion status vs. due date) and can be safely merged by applying both changes rather than picking one device's full state.
Note: current last-write-wins strategy would incorrectly discard one of these two legitimate edits — flag this as a mismatch: field-level merge (not whole-record last-write-wins) is needed for this scenario specifically.

### Scenario: Deleted on one device, edited on another
Verdict: Needs user input — a delete-vs-edit conflict is a classic case where auto-resolving either direction risks a surprising, unrecoverable outcome (either the user's edit silently vanishes, or a task they meant to delete reappears).
UI: Surface as "This task was deleted on another device, but you have unsaved changes here — restore it, or confirm the deletion?" rather than silently picking one side.

### Data Loss Safety Net
Given current last-write-wins strategy has no recovery mechanism, recommend adding at minimum a short-lived (e.g. 30-day) soft-delete/version-snapshot so an incorrectly auto-resolved conflict can still be manually recovered by the user or support, even for the auto-resolve cases above.
```

## Tips & Variations
- The "auto-resolve vs. needs-user-input" line is the single highest-leverage design decision here — get this classification wrong in either direction (over-surfacing trivial conflicts, or silently auto-resolving genuinely ambiguous ones) and the rest of the UI design won't compensate for it.
- Pair with `offline-first-sync-designer` (coding, already shipped) early in the same design pass rather than after the technical strategy is already locked in — the UX needs identified here (e.g. needing field-level rather than whole-record merge) can and should inform the technical design, not just adapt around it after the fact.
- For a B2B/collaborative context (multiple users editing shared data, not just one user's own devices) rather than personal multi-device sync, the same scenario-classification approach applies, but the UI needs to also communicate *who* made the conflicting change, which this single-user example doesn't need to address.

## Changelog
- 1.0.0 (2026-08-30): Initial version.
