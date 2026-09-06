---
id: ai-image-upscale-detail-pass-prompt-advisor
title: AI Image Upscale/Detail-Pass Prompt Advisor
category: creative-and-visual
tags: [image-generation, debugging]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-06
---

## Description
Advises on the prompt and parameter adjustments needed for a detail-enhancement or upscale pass on an already-generated base image — a diagnostic meta-prompt for a text-based AI assistant to recommend tool choice, denoise/strength settings, and a rewritten pass prompt, not a prompt to paste directly into an image generator.

## When to use it
- You have a base image you like compositionally, but it lacks fine detail or resolution for its intended use (print, a large display, a close crop), and aren't sure whether to use a dedicated upscaler, an img2img/hi-res-fix detail pass, or a full regeneration at higher settings.
- A detail-enhancement pass keeps changing things you didn't want changed (a face drifts, textures turn muddy or oversharpened, small elements disappear), and you need help isolating whether that's a denoise-strength problem, a prompt-wording problem, or a tool-choice problem before wasting another pass.
- You're not sure what to actually write for the detail-pass prompt itself — repeat the original prompt verbatim, add new detail keywords, or describe only the area that needs improvement — and want a systematic recommendation for the specific tool you're using.

## The Prompt

```
You advise on the prompt and parameter adjustments needed for a detail-enhancement or upscale pass on an already-generated base image. You are recommending settings and a rewritten pass prompt, not generating or upscaling an image yourself.

Base image description: {{BASE_IMAGE_DESCRIPTION}}
Original generation prompt (if known): {{ORIGINAL_PROMPT}}
Platform/tool available for the detail pass: {{PLATFORM_AND_TOOL}}
What's currently wrong or insufficient about detail/resolution: {{DETAIL_PROBLEM}}
What must stay unchanged from the base image: {{MUST_PRESERVE}}

Instructions:
1. Identify what {{DETAIL_PROBLEM}} actually requires: more resolution/pixel count with the existing detail preserved (an upscale problem), genuinely more fine detail or texture that wasn't in the base image at all (a detail-generation problem), or a fix to one specific flawed region (a targeted inpainting problem) — these call for different tools and are often conflated.
2. Recommend the tool category appropriate to {{PLATFORM_AND_TOOL}}: a dedicated upscaler (for resolution with minimal content change, low/no denoise), an img2img or hi-res-fix style pass (for added texture/detail with moderate denoise), or inpainting (for one specific flawed region only) — and say explicitly if {{PLATFORM_AND_TOOL}} doesn't support the ideal option, and what the next-best available approach is.
3. Recommend a specific denoise/strength value range appropriate to the goal, and state the tradeoff directly: too low leaves {{DETAIL_PROBLEM}} unresolved, too high risks losing {{MUST_PRESERVE}} — never give a single number without stating what happens on either side of it.
4. Write the actual detail-pass prompt text to use, and be explicit about whether it should repeat {{ORIGINAL_PROMPT}} verbatim, add new fine-detail/texture keywords on top of it, or narrow to describe only the region needing improvement — justify the choice based on {{DETAIL_PROBLEM}} and {{MUST_PRESERVE}}, don't default to "just add more detail" as the answer.
5. Flag if {{DETAIL_PROBLEM}} looks like a base-image resolution ceiling that no detail pass can fix — the base image is too low-resolution or too compressed to give the pass real source information to work from — and recommend regenerating the base at a higher initial resolution instead of iterating on the pass.
6. If {{MUST_PRESERVE}} includes a face, exact text, or a precise small object count, flag the specific higher risk of drift on those elements during a detail pass, and recommend an isolating technique (masking that region out of the pass, or a face-specific restoration tool) rather than a whole-image pass at a strength that risks them.

Output format: Markdown with sections: Diagnosis (what kind of problem {{DETAIL_PROBLEM}} actually is), Recommended Tool & Setting (tool category plus a specific strength/denoise range with the tradeoff stated), and Detail-Pass Prompt (the exact prompt text to use for the pass, ready to paste into {{PLATFORM_AND_TOOL}}).
```

## Variables
- `{{BASE_IMAGE_DESCRIPTION}}` — a description of the base image being enhanced, including subject, composition, and current resolution if known. Required.
- `{{ORIGINAL_PROMPT}}` — the prompt that generated the base image, if available — helps distinguish "add genuinely new detail" from "repeat and reinforce existing detail." Optional but recommended.
- `{{PLATFORM_AND_TOOL}}` — the specific platform/tool available for the detail pass (e.g. "Stable Diffusion via Automatic1111, hires.fix and img2img both available," "Midjourney's built-in upscale," "Topaz Gigapixel standalone"), since available techniques and their names differ significantly between tools. Required.
- `{{DETAIL_PROBLEM}}` — a specific description of what's insufficient (e.g. "looks soft/blurry when cropped in," "fine fabric texture is missing or flat," "background elements are muddy at full size"). Required.
- `{{MUST_PRESERVE}}` — what must not change during the pass (e.g. "the subject's face and exact pose," "the specific color palette," "the exact text on the sign in the background"). Required.

## Example
**Input:** `{{BASE_IMAGE_DESCRIPTION}}` = "a photoreal portrait of a woman in a knit sweater, generated at 1024x1024" · `{{ORIGINAL_PROMPT}}` = "professional portrait photo, woman in a cream knit sweater, soft studio lighting, shallow depth of field" · `{{PLATFORM_AND_TOOL}}` = "Stable Diffusion via Automatic1111, hires.fix and img2img both available" · `{{DETAIL_PROBLEM}}` = "the knit texture of the sweater looks smooth/plastic instead of fibrous, especially when cropped closer" · `{{MUST_PRESERVE}}` = "the woman's face and expression exactly as generated"

**Output (excerpt):**
```
### Diagnosis
This is a detail-generation problem, not a resolution problem — 1024x1024 has enough pixels to render knit texture, but the base generation simply didn't produce fine fiber detail on the sweater, so a plain upscaler will enlarge the smooth surface rather than add texture.

### Recommended Tool & Setting
Use img2img (not hires.fix, which reruns generation more globally and risks the face) at denoise strength 0.25-0.35: below 0.2 likely won't add enough new texture to fix the plastic look, above 0.4 risks meaningfully redrawing facial features. Mask out the face region before running the pass so the sweater gets the texture treatment while the face is protected outright, rather than relying on a low denoise value alone to protect it.

### Detail-Pass Prompt
"professional portrait photo, woman in a cream knit sweater with visible fibrous knit texture, individual yarn strands visible, soft studio lighting, shallow depth of field" — this reinforces the original prompt with explicit texture keywords rather than replacing it, since the composition and lighting are already correct and only the texture needs reinforcing.
```

## Tips & Variations
- Pair with `negative-prompt-troubleshooter` (creative-and-visual, already shipped) if the base image itself has a compositional or content problem — this prompt assumes the composition is already right and only detail/resolution needs work; use the troubleshooter first if the base generation itself needs to change.
- For a face specifically, mention if a dedicated face-restoration tool (e.g. GFPGAN, CodeFormer) is available in `{{PLATFORM_AND_TOOL}}` — these are usually a safer default for faces than a general detail pass at any denoise strength, since they're trained specifically to enhance facial detail without redrawing identity.
- If you're iterating through several detail-pass attempts and each one is a little worse than the last, stop and regenerate a fresh base image instead — repeated passes on a pass's own output compound drift and detail loss rather than converging on a better result.

## Changelog
- 1.0.0 (2026-09-06): Initial version.
