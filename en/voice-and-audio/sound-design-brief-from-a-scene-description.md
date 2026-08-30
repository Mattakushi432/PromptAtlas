---
id: sound-design-brief-from-a-scene-description
title: Sound Design Brief from a Scene Description
category: voice-and-audio
tags: [sound-design, audio, planning]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Turns a scene description (game level, video segment, animation) into a structured sound design brief — layered ambience, specific sound effects tied to on-screen action, and music mood direction — a planning document for a sound designer, not the audio itself.

## When to use it
- You're briefing a sound designer (or yourself, wearing that hat) on a scene and want a structured brief rather than a vague "make it sound good" note.
- You want to check whether a scene's sound needs are actually being thought through systematically (ambience, specific SFX, music) rather than only the most obvious sounds being planned for.
- You're working solo on a small project and need a checklist-style brief to make sure you don't forget a sound layer once you're in the audio tool.

## The Prompt

```
You turn a scene description into a structured sound design brief covering ambience, specific sound effects, and music direction. You reason from what's actually described in the scene — you do not invent scene elements or actions not present in the description.

Scene description: {{SCENE}}
Medium (game, film/video, animation): {{MEDIUM}}
Mood/tone target: {{MOOD}}

Instructions:
1. Identify the ambience layer: the continuous background sound(s) implied by the scene's setting (e.g. a forest scene implies wind, distant birds, rustling leaves) — list what's plausible given the specific setting described, not a generic "ambient sound" placeholder.
2. Identify specific sound effects tied to distinct actions or objects mentioned in {{SCENE}} — for each, note what's making the sound and roughly when it occurs in the scene's sequence, so it's clear this is diegetic sound tied to visible/implied action, not a floating effect.
3. Distinguish sounds that need to feel realistic/grounded from ones that can be stylized for effect (e.g. a footstep in a realistic drama needs to sound like an actual footstep; a footstep in a stylized platformer can be a satisfying stylized "thud") — flag this distinction based on {{MEDIUM}} and {{MOOD}}.
4. Propose a music direction (mood, instrumentation hints, tempo/energy) that supports {{MOOD}} without dictating a specific existing track — this is direction for a composer or a description for selecting stock music, not a literal music brief with copyrighted references.
5. Flag any moment in {{SCENE}} where silence (the absence of music/ambience) would be more effective than filling the space — silence is a sound design tool too, and a brief that reflexively fills every moment misses that.
6. If {{SCENE}} is too sparse to derive a specific sound layer confidently (e.g. no indication of surface type for footstep sound), flag it rather than guessing a specific effect that may not match what's actually intended.

Output format: Markdown with `## Ambience`, `## Sound Effects` (each tied to a specific scene moment/action), `## Music Direction`, and a `## Notes` section for any flagged gaps or intentional-silence suggestions.
```

## Variables
- `{{SCENE}}` — the scene description: setting, action, key objects/characters. Required — the brief's specificity is bounded by how detailed this is.
- `{{MEDIUM}}` — game, film/video, or animation. Required — affects whether sounds should be more realistic or more stylized by convention.
- `{{MOOD}}` — the intended emotional tone (tense, whimsical, melancholic, triumphant). Required — shapes both SFX stylization and music direction.

## Example
**Input:** `{{SCENE}}` = "A player character sneaks through an abandoned warehouse at night. They step carefully over broken glass, a metal door creaks open ahead, and a rat scurries away in the shadows." `{{MEDIUM}}` = "game (stealth genre)" `{{MOOD}}` = "tense, quiet dread"

**Output (excerpt):**
```
## Ambience
Low-level warehouse ambience: distant dripping water, faint building settling/creaking, a subtle low drone to support tension. Kept sparse and quiet given the "tense, quiet dread" mood — an overly busy ambience bed would undercut the tension of near-silence.

## Sound Effects
- Footsteps on broken glass: crunchy, sharp glass-specific texture, distinct from a generic footstep — this is a stealth-genre detail where the player likely needs audio feedback on how "loud" their movement is.
- Metal door creak: a slow, high-tension creak, could be stretched slightly longer than a realistic door for dramatic effect given the stylized tension goal — flag this as a stylization choice appropriate to {{MOOD}}, not a realism requirement.
- Rat scurrying: quick, light scratching/scampering sound, positioned to trigger a small startle without being a full jump-scare sting, consistent with "quiet dread" rather than a horror-genre jump moment.

## Music Direction
Minimal or no music during this segment — sparse, low drone or near-silence supports tension better than a scored cue here; if any music is used, suggest extremely sparse, low-register sustained tones, no percussion, to avoid competing with the sound-design-driven tension.

## Notes
No indication of the warehouse's overall size/echo characteristics — reverb/space treatment for the door creak and footsteps should be confirmed once level geometry is known, since a cavernous warehouse and a small one would each need different reverb treatment.
```

## Tips & Variations
- The "Notes" section's flagged gaps are often the most useful part for a solo creator — they surface exactly the details you'd otherwise only discover once already in the audio tool trying to place a sound that doesn't have enough scene context to choose confidently.
- For a full level/episode rather than a single scene, run this per key scene/beat rather than one pass over the whole thing — a single brief covering too much scope tends to produce shallow, generic coverage of each individual moment.
- This prompt produces a brief, not audio — for actual sound selection/creation, pair with a sound library search, foley recording session, or a composer brief built from the "Music Direction" section.

## Changelog
- 1.0.0 (2026-08-30): Initial version.
