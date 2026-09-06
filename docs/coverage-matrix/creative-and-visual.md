# Coverage Matrix: Creative & Visual

Covers Midjourney/DALL·E/Sora-style image and video generation prompts.

- **Sub-domain**: photography-style, illustration/concept art, product mockups, logo/brand marks, UI mockups, character design, environment/background art, short video/motion, thumbnail design
- **Persona**: hobbyist, indie game dev, marketing designer, product designer
- **JTBD stage**: draft/generate → iterate/refine → style-transfer → consistency across a series
- **Output format**: single-image prompt, prompt series, storyboard sequence

## Shipped

1. [Photoreal Product Shot Prompt Builder](../../en/creative-and-visual/photoreal-product-shot-prompt-builder.md) — product mockups / generate.
2. [Consistent Character Sheet Prompt Series](../../en/creative-and-visual/consistent-character-sheet-prompt-series.md) — character design / consistency.
3. [UI Mockup Prompt for a Specific App Screen](../../en/creative-and-visual/ui-mockup-prompt-for-a-specific-app-screen.md) — UI mockups / generate / product designer.
4. [Style-Transfer Prompt Adapter](../../en/creative-and-visual/style-transfer-prompt-adapter.md) — illustration / style-transfer.
5. `logo-concept-direction-generator` — logo/brand marks / generate — three genuinely distinct directions (wordmark-led, symbol-led, abstract mark) rather than variations on one concept.
6. `negative-prompt-troubleshooter` — generate / debug — the category's one chat-LLM (not direct image-gen) prompt: diagnoses why a generation doesn't match intent and rewrites the prompt to fix it.
7. `isometric-icon-set-prompt-generator` — illustration / generate — applies the character-sheet consistency discipline to a small icon set of unrelated objects.
8. `environment-concept-art-mood-board-set` — environment art / generate — explores time-of-day/framing variations of one location while keeping its defining features consistent.
9. `thumbnail-variant-generator-for-a-b-testing` — thumbnail design / generate — 3 structurally distinct thumbnail approaches (face-led, text-overlay-led, object-led) suitable for real A/B testing.
10. `game-asset-concept-prompt-for-a-specific-genre` — indie game dev / generate — calibrates asset style to a game's specific genre conventions rather than generic fantasy art.
11. `short-form-video-storyboard-prompt-sequence` — motion/video / plan — a 4-6 frame storyboard sequence with consistent style and recurring-subject description across shots.
12. `brand-mood-board-prompt-kit-from-a-brand-brief` — product mockups / generate / marketing designer — 4-6 prompts spanning genuinely different visual territories (texture, lifestyle photography, abstract pattern, typography mood), distinct from `logo-concept-direction-generator`'s specific-mark scope.

## Backlog — ideas ready to draft

_Drawn down to 0 this session (2026-08-31) — the 8 items above cleared the entire starter backlog. Refilled below from the coverage matrix's dimension-crossing method (§6.1) before the next creative-and-visual session._

1. **Product Packaging Mockup Prompt Set** — product mockups / generate — a set of packaging-angle prompts (front, 3/4, on-shelf context) for a described product.
2. **Seasonal/Campaign Variant Prompt Adapter** — style-transfer / generate — adapts an established visual asset to a seasonal or campaign theme while preserving brand consistency.
3. **Texture/Material Study Prompt Set** — illustration / generate — close-up material-study prompts (fabric, metal, wood grain) for a described surface, useful as a reference/mood asset.
4. **Isometric Diorama Scene Builder** — environment art / generate — a single cohesive isometric scene combining multiple described elements at consistent scale/perspective.
5. **Brand Photography Style Guide Prompt Kit** — photography / generate — a set of prompts establishing a consistent photography style (lighting, color grade, framing) across different subjects for one brand.
6. **Emoji/Sticker Set Prompt Generator** — illustration / generate — a consistent small emoji/sticker set sharing style and proportions, the emoji-scale counterpart to `isometric-icon-set-prompt-generator`.
7. **Book/Album Cover Concept Generator** — illustration / generate — cover concept directions calibrated to genre convention, similar in spirit to `game-asset-concept-prompt-for-a-specific-genre` but for print/media covers.
8. **AI Image Upscale/Detail-Pass Prompt Advisor** — generate / optimize-refactor — advises on prompt/parameter adjustments for a detail-enhancement pass on an already-generated base image.
9. **Trade Show Booth Concept Visualizer** — environment art / generate — visualizes a booth/exhibit concept from a brief, useful for pitching a design direction before fabrication.
10. **Consistent Color-Grade LUT-Style Prompt Adapter** — style-transfer / generate — applies a described color-grade mood consistently across a set of otherwise-varied image prompts.
11. **Motion Graphics Style Frame Generator** — motion/video / generate — key style frames for a motion-graphics piece establishing look before animation work begins.
12. **Print Ad Layout Concept Generator** — product mockups / generate — full-bleed print ad layout concepts with reserved copy space, the print counterpart to the thumbnail A/B prompt's reserved-text-space technique.
