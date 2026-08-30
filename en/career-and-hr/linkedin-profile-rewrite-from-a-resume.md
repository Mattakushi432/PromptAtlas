---
id: linkedin-profile-rewrite-from-a-resume
title: LinkedIn Profile Rewrite from a Resume
category: career-and-hr
tags: [resume, career, drafting]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Converts resume content into LinkedIn-appropriate profile sections (headline, About, experience descriptions) — adapts to the platform's actual conventions (first-person prose, networking/discovery framing, different length norms) rather than pasting resume bullets in verbatim, distinct from `resume-bullet-rewriter-for-impact` (career-and-hr, already shipped), which improves resume bullets in the resume's own format rather than converting them to a different platform's format.

## When to use it
- You have a solid resume but your LinkedIn profile is stale, sparse, or just a copy-pasted version of resume bullets that doesn't read naturally on the platform.
- You're updating your LinkedIn profile after a resume update and want it to reflect the same accomplishments without redoing the writing from scratch.
- You want your profile to work for LinkedIn's actual use cases (recruiters skimming, connections understanding what you do, search discoverability) rather than just looking like an uploaded resume.

## The Prompt

```
You convert resume content into LinkedIn profile sections. You adapt to LinkedIn's actual conventions — first-person voice, prose rather than terse bullets, and framing suited to networking/discovery rather than an ATS scan — using only the accomplishments and facts already in the resume. You do not invent achievements or embellish scope beyond what the resume states.

Resume content: {{RESUME_CONTENT}}
Target role/field for the profile's overall framing: {{TARGET_FRAMING}}
Sections needed: {{SECTIONS}}

Instructions:
1. For the Headline (if requested), write a specific, keyword-relevant line beyond just a job title — something a person would actually want to click into, reflecting what the resume shows as the real specialty or focus, not a generic "Experienced Professional" phrase.
2. For the About section (if requested), write in first person, in prose (not bullets), telling a coherent narrative across the person's background rather than restating the resume chronologically — this section's job is to give a reader context and personality, which a bullet-point resume format doesn't do.
3. For Experience descriptions (if requested), convert resume bullets into slightly fuller prose/mixed-format entries appropriate to LinkedIn's more conversational norm — but do not pad with content not grounded in the original resume bullets; the goal is format adaptation, not embellishment.
4. Preserve every factual claim (numbers, scope, technologies, dates) exactly as stated in {{RESUME_CONTENT}} — LinkedIn's more narrative format is not license to round up a number or imply broader scope than the resume actually supports.
5. Weight tone and emphasis toward {{TARGET_FRAMING}} where the resume supports it (e.g. if the resume shows both technical and leadership experience and the target framing is a technical role, lead with the technical depth) — but do not omit real, resume-documented experience just because it doesn't fit the target framing; reframe emphasis, don't erase facts.
6. If the resume is thin in a way that would make a requested section feel padded or generic (e.g. very limited experience for a full About section), say so explicitly and suggest a shorter, honest version rather than stretching thin content to fill an expected section length.

Output format: Markdown, one section per item in {{SECTIONS}} requested, each clearly labeled.
```

## Variables
- `{{RESUME_CONTENT}}` — the resume text/bullets to draw from. Required.
- `{{TARGET_FRAMING}}` — the type of role/opportunity the profile should be optimized toward (e.g. "staying in current specialty," "pivoting toward a management track"). Required — the same resume content can be framed several honest ways depending on what's being emphasized.
- `{{SECTIONS}}` — which LinkedIn sections to draft (headline, About, one or more Experience entries). Required.

## Example
**Input:** `{{RESUME_CONTENT}}` = "Senior Backend Engineer, led migration of monolith to microservices (12 services), reduced deployment time from 45min to 8min, mentored 3 junior engineers" `{{TARGET_FRAMING}}` = "Staying in a senior IC engineering track, emphasizing technical depth" `{{SECTIONS}}` = "Headline, one Experience entry"

**Output (excerpt):**
```
## Headline
Senior Backend Engineer | Microservices Architecture & Deployment Systems

## Experience Entry
Led the migration of our core monolith into a 12-service microservices architecture, taking deployment time from 45 minutes down to 8. Beyond the technical build-out, I mentored three junior engineers through the transition — a project that was as much about building team capability with the new architecture as building the architecture itself.
```

## Tips & Variations
- Once the draft is written, this is a strong candidate for `tone-adapter` (writing-and-content) if the initial tone needs further adjustment (e.g. more casual, or more formal for a specific industry norm) beyond what this prompt's LinkedIn-conventions pass produces.
- For a full profile overhaul, request all sections at once rather than piecemeal — the About section and Experience entries read better when they're not repeating the exact same phrasing for the same accomplishment, which is easier to avoid when drafted together with visibility into each other.
- This prompt doesn't address Skills, Recommendations, or other LinkedIn profile elements beyond Headline/About/Experience — those need separate, more platform-mechanical handling (skill tagging, requesting endorsements) outside this prompt's scope.

## Changelog
- 1.0.0 (2026-08-30): Initial version.
