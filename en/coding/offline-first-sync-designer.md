---
id: offline-first-sync-designer
title: Offline-First Sync Designer
category: coding
tags: [mobile, offline-first, data-sync]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Designs an offline-first data sync strategy for a mobile app — local storage model, sync queue, conflict resolution — for a feature that needs to work without connectivity and reconcile changes later. Architecture-level, distinct from any single-platform crash/performance prompt.

## When to use it
- Building a feature that must work offline (field data collection, note-taking, task management) and needs a real sync design before implementation starts.
- An existing "mostly online" app is being retrofitted with offline support and needs a plan for handling the transition.
- Debugging data inconsistency issues that trace back to an ad-hoc sync implementation without clear conflict-resolution rules.

## The Prompt

```
You design an offline-first sync strategy for a mobile app feature — local storage, sync mechanics, and conflict resolution — as a concrete architecture, not general offline-first principles.

Feature description (what data, what operations — create/edit/delete): {{FEATURE_DESCRIPTION}}
Multi-device/multi-user considerations (optional — e.g. "same user on two devices", "multiple users editing shared data"): {{CONCURRENCY_CONTEXT}}
Platform/stack: {{PLATFORM}}

Instructions:
1. Recommend a local storage approach appropriate to the data shape and platform (e.g., SQLite/Room/Core Data for structured relational data, a local-first sync engine like WatermelonDB/Realm if the ecosystem fits) — justify against the specific data shape, not a default choice.
2. Design the sync queue: how local changes are tracked while offline (a change log / outbox pattern is usually more robust than diffing full local vs. remote state), and how the queue is processed when connectivity returns — including partial failure handling (some queued operations succeed, others fail; the queue must not be all-or-nothing).
3. Design conflict resolution explicitly for the described concurrency scenario: last-write-wins is simple but loses data silently — only recommend it where the feature and {{CONCURRENCY_CONTEXT}} make that an acceptable tradeoff (e.g., a single user's own notes across their own devices, low collision likelihood). For genuinely concurrent multi-user edits, recommend field-level merging, a CRDT-based approach, or explicit conflict surfacing to the user, based on which fits the data's actual structure and how much complexity is justified by the collision rate.
4. Address deletion explicitly: a hard local delete that syncs as a delete can race badly with a concurrent edit on another device — recommend soft-delete/tombstone records that sync properly and eventually get garbage-collected, rather than an immediate hard delete.
5. Address sync triggers: on reconnect, periodically, on app foreground, or push-triggered — and note the tradeoff between sync freshness and battery/data usage.
6. Note what user-visible feedback is needed for a sync-pending or sync-failed state — silent background sync failure is a common source of "my data disappeared" bug reports; the UI needs to represent unsynced/conflicted state honestly.
7. If {{CONCURRENCY_CONTEXT}} isn't provided, default to the single-user, low-collision case but flag that assumption explicitly, since it materially changes the recommended conflict strategy.

Output format: Markdown with sections: Local Storage, Sync Queue & Processing, Conflict Resolution, Deletion Handling, Sync Triggers, User-Facing Sync State.
```

## Variables
- `{{FEATURE_DESCRIPTION}}` — what data and operations need offline support. Required.
- `{{PLATFORM}}` — the mobile stack (native iOS/Android, React Native, Flutter). Required — available local storage/sync libraries differ.
- `{{CONCURRENCY_CONTEXT}}` — how many users/devices can edit the same data concurrently. Optional but materially affects the conflict-resolution recommendation.

## Example
**Input:** `{{FEATURE_DESCRIPTION}}` = "a task list app where users create/edit/complete/delete tasks", `{{CONCURRENCY_CONTEXT}}` = "same user across phone and tablet, no shared/collaborative editing", `{{PLATFORM}}` = "React Native".

**Output (excerpt):**
```
## Conflict Resolution
Given single-user, cross-device (not collaborative) editing, last-write-wins per task, keyed by a server-assigned `updated_at` timestamp, is an acceptable tradeoff — the collision window (same user editing the same task on two devices within seconds of each other, offline on both) is narrow and low-consequence for a task list. This would NOT be acceptable if {{CONCURRENCY_CONTEXT}} involved multiple distinct users editing shared tasks — that would need field-level merge or explicit conflict surfacing instead.

## Deletion Handling
Implement soft deletes: a `deleted_at` timestamp field rather than a hard row delete. This avoids a race where Device A deletes a task offline while Device B edits the same task offline — on sync, the deletion and the edit can both be seen and reconciled (e.g., deletion wins, or the edit is surfaced to the user) rather than one operation silently failing against a row that no longer exists.
```

## Tips & Variations
- For a feature with real multi-user collaborative editing (e.g., shared documents), explicitly ask for a CRDT- or OT-based approach and name specific libraries (e.g., Yjs, Automerge) rather than hand-rolled field merging, since correct concurrent merge logic is easy to get subtly wrong from scratch.
- If retrofitting offline support onto an existing online-only app, ask it to also flag which existing API endpoints/data models would need to change to support the sync queue (e.g., needing a stable `updated_at` and a way to fetch "changes since X" rather than full resource dumps).

## Changelog
- 1.0.0 (2026-08-29): Initial version.
