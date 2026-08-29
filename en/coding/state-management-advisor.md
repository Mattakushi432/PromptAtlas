---
id: state-management-advisor
title: State Management Advisor
category: coding
tags: [frontend, state-management, architecture]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Recommends (or critiques an existing) state-management approach for a frontend app's actual shape — what kind of state it has and how it flows — rather than defaulting to whichever library is trendy. For a real architecture decision or an existing app showing state-management pain.

## When to use it
- Starting a new frontend app and deciding between local state, context, and a dedicated state library.
- An existing app has state management pain (prop drilling, redundant re-fetching, state going stale) and needs a diagnosis, not just "add Redux."
- Reviewing whether a proposed state architecture actually fits the app's data shape before a team commits to it.

## The Prompt

```
You recommend a state management approach based on the actual categories of state in this app — not a default library preference.

App description (what it does, roughly how many distinct pieces of state, how components relate): {{APP_DESCRIPTION}}
Current approach and pain points, if any (optional): {{CURRENT_APPROACH}}
Framework: {{FRAMEWORK}}

Instructions:
1. Categorize the app's state into: server state (data fetched from an API — has its own caching/staleness/refetch concerns), client/UI state (a modal being open, a form's current input, purely local to one interaction), URL state (things that should be shareable/bookmarkable — filters, pagination, active tab), and global client state that's genuinely shared across distant, unrelated components (rare, and often over-assumed).
2. Recommend a distinct tool/pattern per category rather than one library for everything — server state usually wants a dedicated data-fetching library (e.g., TanStack Query, SWR, or framework-native equivalents) rather than being stuffed into a general state store; UI state usually wants local component state; genuinely global state is the only category that needs a dedicated global store.
3. If {{CURRENT_APPROACH}} describes pain (prop drilling, stale data, excessive re-renders), diagnose which state category is being mismanaged and why — prop drilling is usually a component composition problem solvable without a new library (lifting state, composition) as often as it's a "need context/redux" problem.
4. Don't recommend a heavyweight global store if the described app doesn't actually have much genuinely global state — a small app doesn't need what a large one does, and over-engineering the state layer has real maintenance cost.
5. If recommending a specific library, justify it against the actual described needs (e.g., "TanStack Query specifically because you described frequent background refetching and cache invalidation needs, which raw fetch + useState doesn't handle well") rather than naming it as a default.
6. Flag any state that's currently duplicated between server state and local state (a classic source of staleness bugs) and recommend treating the server as the source of truth.

Output format: Markdown table mapping state categories found in the app to a recommended approach, followed by a short migration note if {{CURRENT_APPROACH}} needs to change.
```

## Variables
- `{{APP_DESCRIPTION}}` — what the app does and its rough component/data shape. Required.
- `{{FRAMEWORK}}` — e.g. "React", "Vue", "Svelte". Required — available patterns and libraries differ by framework.
- `{{CURRENT_APPROACH}}` — the existing state setup and any known pain points. Optional but turns this from a greenfield recommendation into a targeted diagnosis.

## Example
**Input:** `{{APP_DESCRIPTION}}` = "a dashboard that fetches a list of projects from an API, has a filter/sort UI, and a modal for editing a project", `{{FRAMEWORK}}` = "React", `{{CURRENT_APPROACH}}` = "everything, including the fetched project list, lives in a single Redux store; components re-render often and the list goes stale after edits until a manual refresh".

**Output (excerpt):**
```
| State category | Current approach | Recommended |
|---|---|---|
| Project list (server state) | Manually fetched into Redux, never auto-refetched | TanStack Query — handles caching, background refetch, and cache invalidation on mutation automatically, fixing the staleness issue directly |
| Filter/sort selection | Redux | URL search params — makes the filtered view shareable/bookmarkable, and removes this from the global store entirely |
| Modal open/edit-in-progress state | Redux | Local component state (`useState` in the modal's parent) — this is UI state scoped to one interaction, not global |

**Note:** after this split, there's likely no remaining state that's genuinely global — re-evaluate whether Redux is needed at all, or whether React Context for the rare cross-cutting concern (e.g., current user) is sufficient.
```

## Tips & Variations
- For a team that's already deeply invested in one state library, frame the recommendation as "which state should live where within your current library" rather than proposing a library switch, unless the pain genuinely can't be solved within the current tool.
- If the app has real-time/collaborative state (websocket-driven updates), treat that as a distinct category from both server and client state, since its consistency model differs.

## Changelog
- 1.0.0 (2026-08-29): Initial version.
