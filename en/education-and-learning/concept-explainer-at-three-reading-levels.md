---
id: concept-explainer-at-three-reading-levels
title: Concept Explainer at Three Reading Levels
category: education-and-learning
tags: [tutoring, education, explain]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Explains the same concept three times at genuinely different reading/complexity levels (child, teen, adult) rather than just shortening the same explanation — each version uses age-appropriate framing, vocabulary, and analogies rather than the same content with words trimmed out. Distinct from `socratic-tutor-for-a-specific-concept` (education-and-learning, already shipped), which draws understanding out through guided questions rather than explaining directly at all.

## When to use it
- You need to explain something to people at very different levels (explaining your job to a child versus a colleague) and want a starting point for each rather than writing three explanations from scratch.
- You're a parent or teacher who understood a concept as an adult but is struggling to translate it down to a child's level without losing the actual substance.
- You want to check your own understanding of a concept — if you can't get a genuinely correct child-level explanation, you may not understand it as well as you think.

## The Prompt

```
You explain one concept three separate times, each genuinely calibrated to a different reading level — not the same explanation with words swapped out, but a different framing, vocabulary, and set of analogies appropriate to each audience.

Concept: {{CONCEPT}}
Anything specific the explanation should preserve or emphasize (optional): {{MUST_INCLUDE}}

Instructions:
1. Write a Child version (roughly age 7-10): use concrete, physical analogies from a child's everyday experience, short sentences, no jargon at all — if a term is unavoidable, define it in the same breath using something the child already knows.
2. Write a Teen version (roughly age 14-17): can use more abstract reasoning and some domain vocabulary if defined on first use, can reference school-level knowledge (basic algebra, general science) as a foundation, but should still avoid professional jargon and dense technical language.
3. Write an Adult version: can use standard domain vocabulary and denser explanation, but should still be genuinely clear — not a dumbed-down technical definition either, an actual clear explanation for a smart adult without background in this specific area.
4. All three versions must be substantively correct — do not oversimplify the child version into something that's actually wrong or that the learner will have to unlearn later. If a genuinely accurate child-level explanation requires leaving out a real nuance, say so explicitly in a short note after that version, don't silently distort the concept to make it fit.
5. If {{MUST_INCLUDE}} specifies something to preserve, make sure it survives all three versions in some form, even if phrased very differently at each level.
6. Do not just take the adult version and cut it down — write each version as if starting fresh for that audience, since good explanations for different audiences use fundamentally different entry points and analogies, not the same structure at different lengths.

Output format: Markdown with three headed sections: Child, Teen, Adult. If any version required leaving out a nuance for accuracy reasons, add a one-line "Simplification note" after that section.
```

## Variables
- `{{CONCEPT}}` — the concept to explain at three levels. Required.
- `{{MUST_INCLUDE}}` — anything specific that must survive in all three versions (a key term, a specific application, a common misconception to address). Optional.

## Example
**Input:** `{{CONCEPT}}` = "Why the sky is blue (Rayleigh scattering)" `{{MUST_INCLUDE}}` = "should mention that sunsets are red for a related reason"

**Output (excerpt):**
```
### Child
Sunlight looks white, but it's actually made of all the colors mixed together, like a rainbow all blended up. When sunlight hits the tiny bits of air way up in the sky, blue light bounces around way more than the other colors — kind of like a small bouncy ball bounces around a room more than a big beach ball would. So when you look up, you're seeing all that bounced-around blue light coming from everywhere in the sky. At sunset, the light has to travel through way more air to reach your eyes, and almost all the blue has already bounced away by then — mostly red and orange light makes it through, which is why sunsets look red.

### Teen
Sunlight is made of all wavelengths of visible light combined. When it hits molecules in the atmosphere, it scatters — but not evenly across all colors. Shorter wavelengths (blue, toward the violet end of the spectrum) scatter much more strongly than longer wavelengths (red, orange) — this is called Rayleigh scattering, and the amount of scattering increases sharply as wavelength gets shorter. Since blue scatters so much more, it gets redirected all across the sky, which is why the whole sky looks blue instead of just a single point where the sun is. At sunset, sunlight travels through much more atmosphere at a low angle, so by the time it reaches you, most of the blue has already scattered away in other directions — what's left is shifted toward red and orange.

### Adult
The sky is blue due to Rayleigh scattering: atmospheric gas molecules scatter light with an intensity inversely proportional to the fourth power of wavelength, so blue light (~450nm) scatters roughly 5-6x more strongly than red light (~700nm). Because this scattering is roughly isotropic, sunlight gets redirected across the entire sky, producing diffuse blue illumination from all directions rather than just from the sun's direct position. At sunset, the increased atmospheric path length at low solar angles scatters out most of the blue and even green wavelengths before they reach an observer, leaving the direct transmitted light dominated by red and orange.

**Simplification note (Child):** omits that violet light actually scatters even more than blue — human eyes are less sensitive to violet and it's partially absorbed by the upper atmosphere, which is why we perceive the sky as blue rather than violet; not essential to the core mechanism at this level.
```

## Tips & Variations
- Pair with `socratic-tutor-for-a-specific-concept` (education-and-learning, already shipped) once a learner has a version of the explanation that fits their level — that prompt then draws out active engagement with the concept through questions, rather than providing another direct explanation.
- If you only need one or two of the three levels, say so explicitly rather than discarding the unneeded output — asking only for what's needed avoids wasted explanation and lets the prompt spend more depth on the level(s) that matter.
- For a concept that's genuinely difficult to make accurate at the child level (deep physics, advanced math), expect more or longer simplification notes — that's a signal about the concept's actual complexity, not a flaw in the explanation.

## Changelog
- 1.0.0 (2026-08-31): Initial version.
