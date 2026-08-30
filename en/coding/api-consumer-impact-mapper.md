---
id: api-consumer-impact-mapper
title: Cross-Team API Consumer Impact Mapper
category: coding
tags: [backend, api-design, migration]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Maps which internal consumers a breaking API change would actually affect before it ships. For a senior engineer planning a breaking change to an internal/shared API — distinct from `api-contract-consistency-reviewer` (checks consistency across endpoints, not who calls them) and `dependency-upgrade-impact-assessor` (external library upgrades, not an internal API you own).

## When to use it
- Planning a breaking change to a widely-used internal API and need to know who to notify or coordinate with before shipping.
- A past breaking change caused an unexpected outage in a team that wasn't consulted, and you want to do it properly this time.
- Deciding whether a change is actually safe to ship without broad coordination, or genuinely needs it.

## The Prompt

```
You are mapping the impact of a proposed breaking change to an internal API across its known and potentially-unknown consumers — before the change ships, not after an incident reveals who was actually affected.

Proposed change (what's changing about the API): {{PROPOSED_CHANGE}}

Known consumer list (teams/services known to call this API, however incomplete this list might be): {{KNOWN_CONSUMER_LIST}}

Discovery methods available (optional — API gateway logs, service mesh telemetry, code search across a monorepo, a service catalog): {{DISCOVERY_METHODS_AVAILABLE}}

For each known consumer:
1. Assess whether the proposed change actually affects their usage — not every consumer of an API is affected by every change to it; judge based specifically on what fields, endpoints, or behaviors they're described as depending on.
2. Flag consumers where impact is genuinely uncertain from the given description and needs direct confirmation from that team, rather than an assumption made from the outside.

Then, propose a concrete discovery plan for consumers not on the known list, using whichever discovery methods are actually available — don't skip straight past this step by treating the known list as necessarily complete.

Output: a per-consumer impact table (affected / not affected / needs confirmation, with reasoning for each), a "must confirm before shipping" list drawn from the uncertain ones, and a discovery plan for unknowns.

If no known-consumer list is provided at all, don't jump straight to proposing discovery methods from scratch — first ask whether a consumer list already exists somewhere that simply wasn't included (a service catalog, an API gateway's client registry, prior documentation) before assuming none exists.
```

## Variables
- `{{PROPOSED_CHANGE}}` — what's changing about the API. Required.
- `{{KNOWN_CONSUMER_LIST}}` — teams/services known to call it, as far as known. Required.
- `{{DISCOVERY_METHODS_AVAILABLE}}` — what tooling exists to find consumers not already known. Optional; without it, generic discovery approaches are suggested and flagged as needing tooling-specific adaptation.

## Example
**Input:** `{{PROPOSED_CHANGE}}` = "removing the deprecated `legacy_status` field from the `/orders/{id}` response, in favor of the existing `status` field", `{{KNOWN_CONSUMER_LIST}}` = "checkout-service (confirmed uses `status`, not `legacy_status`), reporting-service (unclear which field it reads), a partner integration (no direct contact, discovered via API gateway logs only)", `{{DISCOVERY_METHODS_AVAILABLE}}` = "API gateway access logs with client ID tagging, a monorepo for internal services".

**Output (excerpt):**
```
checkout-service: NOT AFFECTED. Confirmed to already use `status`, not the field being removed — no action needed, but worth a quick "FYI, no action required" note rather than silence, so they're not left wondering if they missed something.

reporting-service: NEEDS CONFIRMATION. Field usage is unclear from the given description — do not assume based on general expectation that a reporting service "probably" uses whatever the current field is. Grep the reporting-service repo in the monorepo for `legacy_status` directly (discovery method available) rather than only asking the team, since code search will give a definitive answer faster than waiting on a reply.

Partner integration: NEEDS CONFIRMATION, highest risk. No direct contact channel and only indirect discovery via gateway logs — this is the consumer most likely to be broken silently by this change. Before shipping, check the gateway logs specifically for whether this client's actual request/response handling touches `legacy_status` (if request payloads are logged) or reach out through whatever partner-relationship channel exists, even if it's not a direct engineering contact.

Discovery plan for unknowns: query API gateway logs for all distinct client IDs hitting `/orders/{id}` over the last 30 days, cross-reference against the known consumer list above, and treat any unmatched client ID as an unknown consumer requiring the same confirmation process before the change ships.
```

## Tips & Variations
- If a service mesh or API gateway can generate a definitive list of all callers over a recent window, prioritize using that over relying on the (frequently outdated) known-consumer list from documentation or memory.
- For a genuinely low-risk change (e.g., adding a new optional field, not removing one), this level of consumer mapping is likely overkill — reserve it for changes that are actually breaking, not routine additive ones.

## Changelog
- 1.0.0 (2026-08-30): Initial version.
