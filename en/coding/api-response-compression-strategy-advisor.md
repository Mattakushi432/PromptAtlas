---
id: api-response-compression-strategy-advisor
title: API Response Compression Strategy Advisor
category: coding
tags: [api, performance, backend]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Advises on response compression tradeoffs (gzip/brotli, compression level, what to compress) for a specific API's actual payload characteristics — a decision-support tool for a concrete situation, not a generic "just enable gzip" recommendation that ignores what's actually being served.

## When to use it
- You're deciding whether/how to add compression to an API and want the tradeoffs reasoned through for your actual traffic pattern, not a one-size-fits-all default.
- Response sizes have grown and you want to check whether compression settings still match the current payload mix.
- You're debugging unexpectedly high CPU usage and suspect compression settings (too aggressive a level, compressing already-compressed content) as a possible cause.

## The Prompt

```
You advise on response compression strategy for a specific API's payload characteristics. You reason from what's actually being served — you do not give generic "enable gzip" advice disconnected from the specific tradeoffs at hand.

Payload characteristics (typical size, content type, structure): {{PAYLOAD_INFO}}
Traffic profile (requests/sec, client types): {{TRAFFIC_PROFILE}}
Current setup (if any): {{CURRENT_SETUP}}

Instructions:
1. Recommend whether compression is worth enabling at all given {{PAYLOAD_INFO}} — very small responses (a few hundred bytes) often aren't worth the CPU overhead of compression relative to the bytes saved; state the rough size threshold below which compression's benefit is marginal for the described content type.
2. Compare gzip vs. brotli for the specific situation: brotli generally compresses better but costs more CPU at higher quality levels and has less universal client support than gzip — recommend based on {{TRAFFIC_PROFILE}}'s client mix and whether CPU or bandwidth is the more constrained resource here, not a blanket "brotli is better" statement.
3. Recommend a compression level appropriate to {{TRAFFIC_PROFILE}}'s request volume — a high compression level trades CPU time for smaller output, which matters differently at low request volume (CPU cost is negligible, maximize compression) versus high request volume (CPU cost compounds, a mid-level setting balancing size and CPU is often better than the maximum level).
4. Check whether {{CURRENT_SETUP}} (if given) is compressing content that's already compressed (images, video, already-gzipped assets, some binary formats) — compressing already-compressed data wastes CPU for little to no size benefit and is a common misconfiguration worth flagging explicitly if present.
5. For a JSON/text API specifically, note that response structure matters: highly repetitive JSON (e.g. many objects with the same keys) compresses very well, while already-compact or high-entropy payloads (e.g. base64-encoded binary data embedded in JSON) compress poorly — factor this into the size-savings estimate rather than assuming uniform compression ratios.
6. If {{TRAFFIC_PROFILE}} indicates CPU is already a bottleneck, weigh that explicitly against the bandwidth savings — compression is not free, and recommending it without checking CPU headroom can trade one bottleneck for another.

Output format: Markdown with `## Recommendation` (enable/adjust/keep as-is), `## Algorithm Choice` (gzip/brotli, with reasoning), `## Compression Level`, and `## Flags` (e.g. compressing already-compressed content, if found in {{CURRENT_SETUP}}).
```

## Variables
- `{{PAYLOAD_INFO}}` — typical response size, content type, and rough structure. Required.
- `{{TRAFFIC_PROFILE}}` — request volume and what's known about client types (browsers, mobile apps, server-to-server) since client compression support varies. Required.
- `{{CURRENT_SETUP}}` — the current compression configuration, if any exists to review. Optional — omit for a fresh recommendation with nothing to audit.

## Example
**Input:** `{{PAYLOAD_INFO}}` = "JSON API responses, typically 50-200KB, highly repetitive structure (arrays of similar objects)" `{{TRAFFIC_PROFILE}}` = "~500 req/sec, mix of browser clients and mobile app clients, CPU currently at ~40% average utilization" `{{CURRENT_SETUP}}` = "No compression currently enabled"

**Output (excerpt):**
```
## Recommendation
Enable compression. 50-200KB is well above the threshold where compression is worth the CPU cost, and the highly repetitive JSON structure described should compress very well (often 70-90% size reduction for this kind of repetitive-key JSON).

## Algorithm Choice
Gzip as the baseline (near-universal client support across browsers and typical mobile HTTP clients), with brotli as an additional option if the server stack supports content negotiation and a meaningful share of clients advertise brotli support — brotli's better compression ratio is worth capturing where supported, but gzip should remain the fallback given the mixed client base.

## Compression Level
Mid-range compression level (not maximum) given ~500 req/sec and 40% average CPU utilization — there's headroom for compression's CPU cost, but maximum-level compression on every request at this volume risks pushing CPU utilization meaningfully higher for diminishing size returns beyond the mid-level setting.

## Flags
None — no current compression to audit for the "compressing already-compressed content" issue.
```

## Tips & Variations
- If actual before/after payload sizes and CPU measurements are available after implementing a recommendation, feed them back in as an updated `{{CURRENT_SETUP}}` to sanity-check whether the real-world compression ratio and CPU cost matched the estimate — repetitive-structure assumptions don't always hold exactly in practice.
- For an API serving a genuine mix of payload types (some highly compressible JSON, some near-incompressible binary), consider running this prompt separately per endpoint/content-type category rather than one blanket recommendation for the whole API.
- This prompt covers response compression specifically — for reducing payload size at the source (removing unnecessary fields, pagination, field selection), that's a separate schema/API-design concern this prompt doesn't address.

## Changelog
- 1.0.0 (2026-08-30): Initial version.
