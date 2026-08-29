---
id: mobile-battery-drain-diagnostic
title: Mobile Battery Drain Diagnostic
category: coding
tags: [mobile, performance, battery]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Diagnoses likely causes of excessive battery/CPU drain in a mobile app from code patterns and/or profiler data — distinct from crash diagnosis and general performance profiling, focused specifically on background wakefulness and energy-inefficient patterns. For an app users or app-store energy reports have flagged as a battery drainer.

## When to use it
- Users are reporting the app drains battery quickly, or it's flagged in iOS Battery settings / Android's battery usage stats as a top consumer.
- Reviewing code that uses location, background processing, or networking before it ships, to catch energy-inefficient patterns early.
- Investigating a regression where battery usage got worse after a specific release.

## The Prompt

```
You diagnose likely causes of excessive battery/CPU drain in mobile app code — energy-specific analysis, not general performance or crash debugging.

Code/feature area suspected (location, background tasks, networking, rendering, etc.): {{CODE_OR_FEATURE}}
Platform: {{PLATFORM}}
Profiler data if available (Xcode Energy Log, Android Battery Historian, etc.): {{PROFILER_DATA}}

Instructions:
1. Check for excessive wakefulness: background tasks, timers, or location updates that fire more frequently than the feature actually needs, keeping the device from entering low-power states. Distinguish continuous/high-frequency location tracking (a major battery cost) from significant-change or geofence-based location (much cheaper), and flag if the code uses the expensive mode without a clear need for that precision/frequency.
2. Check for polling instead of push: a network request loop on a timer instead of push notifications/websockets for data that changes infrequently — polling keeps the radio active far more than event-driven updates.
3. Check for missing platform power-management API usage: not respecting iOS's Low Power Mode or background task time limits, not using Android's Doze/App Standby-aware APIs (WorkManager with appropriate constraints instead of raw background services or wake locks held longer than necessary).
4. Check for CPU-heavy work on a busy-loop or excessively frequent trigger: continuous sensor polling, unthrottled scroll/animation handlers doing heavy work per frame, or a background thread doing repeated work that could be batched or debounced.
5. Check for unreleased wake locks or background execution that outlives its purpose — a wake lock acquired but not released on an error path is a common, hard-to-spot drain source.
6. For each finding, estimate its likely severity (a location update every second is a bigger deal than an inefficient one-time computation) and give the specific fix using the platform's actual energy-efficient API for that use case.
7. If {{PROFILER_DATA}} is provided, ground findings in its actual evidence (which subsystem — CPU, radio, GPS, display — is shown consuming the most energy) rather than guessing broadly.

Output format: Markdown, one entry per finding, ranked by likely impact, each with: what's happening, why it drains battery, and the specific fix.
```

## Variables
- `{{CODE_OR_FEATURE}}` — the code or feature area suspected of causing drain. Required.
- `{{PLATFORM}}` — "iOS" or "Android" (with version if relevant). Required — power management APIs are platform-specific.
- `{{PROFILER_DATA}}` — actual energy profiling output. Optional but turns broad suspicion into targeted diagnosis.

## Example
**Input:** `{{PLATFORM}}` = "Android", `{{CODE_OR_FEATURE}}` = a foreground service that requests location updates every 1 second continuously, even when the app is backgrounded and the feature (a "nearby friends" map) doesn't need second-level precision.

**Output (excerpt):**
```
### Finding: Continuous 1-second location updates — HIGH impact
Requesting GPS-precision location updates every second keeps the radio and GPS chip active almost continuously, one of the largest battery costs an app can impose. For a "nearby friends" feature, second-level precision is very unlikely to be needed.

Fix: increase the location request interval significantly (e.g., 30-60 seconds) using `FusedLocationProviderClient` with an appropriate `Priority` (e.g., `PRIORITY_BALANCED_POWER_ACCURACY` instead of `PRIORITY_HIGH_ACCURACY`), and stop requesting updates entirely when the app is backgrounded unless background location is a core, user-consented feature — consider `LocationRequest.Builder` with a longer `setMinUpdateIntervalMillis` and battery-aware priority.
```

## Tips & Variations
- For iOS, ask it to specifically check `CLLocationManager`'s `desiredAccuracy` and `distanceFilter` settings, and whether `significantLocationChangeMonitoring` could replace continuous updates for the described use case.
- Pair with real Battery Historian (Android) or Xcode's Energy Log (iOS) output for a diagnosis grounded in actual measured subsystem consumption rather than code-pattern inference alone.

## Changelog
- 1.0.0 (2026-08-29): Initial version.
