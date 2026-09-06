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
13. `product-packaging-mockup-prompt-set` — product mockups / generate — front/3-4/on-shelf-context packaging angles for a described product, distinct from `photoreal-product-shot-prompt-builder`'s single hero shot.
14. `seasonal-campaign-variant-prompt-adapter` — style-transfer / generate — holds art style and brand identity constant while layering a temporary seasonal/campaign theme, distinct from `style-transfer-prompt-adapter`'s medium/technique swap.
15. `texture-material-study-prompt-set` — illustration / generate — close-up material-study prompts (fabric, metal, wood grain) as a reference/mood asset, feeding into `environment-concept-art-mood-board-set`'s `{{LOCATION_DESCRIPTION}}` for full-scene consistency.
16. `isometric-diorama-scene-builder` — environment art / generate — one unified multi-element isometric scene with explicit relative-scale control, distinct from `isometric-icon-set-prompt-generator`'s series of separate single-icon generations.
17. `brand-photography-style-guide-prompt-kit` — photography / generate — a cross-subject photography style system (lighting, color grade, framing), distinct from `photoreal-product-shot-prompt-builder`'s single hero shot and reusing `consistent-character-sheet-prompt-series`'s verbatim-reuse discipline.
18. `emoji-sticker-set-prompt-generator` — illustration / generate — the emoji-scale counterpart to `isometric-icon-set-prompt-generator`, applied to one mascot's expressions rather than unrelated objects.
19. `book-album-cover-concept-generator` — illustration / generate — cover concepts calibrated to genre convention (per `game-asset-concept-prompt-for-a-specific-genre`) using `thumbnail-variant-generator-for-a-b-testing`'s reserved-negative-space technique for cover text.
20. `ai-image-upscale-detail-pass-prompt-advisor` — generate / optimize-refactor — the category's second chat-LLM (not direct image-gen) prompt: advises on a detail-enhancement pass once composition is already right, distinct from `negative-prompt-troubleshooter`'s compositional/content fixes.
21. `trade-show-booth-concept-visualizer` — environment art / generate — applies `environment-concept-art-mood-board-set`'s base+variant consistency discipline to a commercial exhibit/booth structure.
22. `consistent-color-grade-lut-style-prompt-adapter` — style-transfer / generate — unifies only color grade across several varied subjects/styles, distinct from `style-transfer-prompt-adapter`'s whole-style swap on one fixed subject.
23. `motion-graphics-style-frame-generator` — motion/video / generate — a subject-less graphic-design style system, distinct from `short-form-video-storyboard-prompt-sequence`'s recurring-subject narrative sequence.
24. `print-ad-layout-concept-generator` — product mockups / generate — the print counterpart of `thumbnail-variant-generator-for-a-b-testing`'s reserved-copy-space technique, adapted to full-bleed print aspect ratios.

## Backlog — ideas ready to draft

_Drawn down to 0 again this session (2026-09-06) via three parallel forks (4 each) — items 13-24 above cleared the entire refilled backlog. Refilled below from the coverage matrix's dimension-crossing method (§6.1) before the next creative-and-visual session._

1. **UI Dark/Light Theme Variant Adapter** — UI mockups / style-transfer — adapts an existing app-screen mockup prompt to a light/dark theme pair while preserving layout.
2. **Character Turnaround Sheet Prompt Generator** — character design / consistency — front/3-4/side/back turnaround views of one character at fixed proportions for animation/3D reference, distinct from `consistent-character-sheet-prompt-series`'s expression/pose variety (verify against that prompt's exact scope before drafting).
3. **Icon Style Guide Extrapolator from a Single Reference Icon** — icon design / consistency — derives a full icon-set style guide (stroke weight, corner radius, palette) from one approved icon, non-isometric counterpart to `isometric-icon-set-prompt-generator`.
4. **Product Launch Teaser Reveal Image Sequence** — product mockups / motion — a silhouette-to-full-reveal teaser sequence for a product launch.
5. **Merch/Apparel Mockup Prompt Set** — product mockups / generate — apparel mockups (t-shirt, hoodie, tote) for a given print design across body types/contexts.
6. **Historical/Period-Accurate Illustration Detail Advisor** — illustration / generate — a chat-LLM prompt (third of its kind, alongside `negative-prompt-troubleshooter` and `ai-image-upscale-detail-pass-prompt-advisor`) that helps pick period-accurate visual details for historical settings before generation.
7. **Seamless Vector Pattern/Tile Repeat Generator** — illustration / generate — a seamless repeating pattern prompt for textile/wallpaper use.
8. **AI Avatar/Profile Picture Style Kit** — character design / generate — a small set of stylistically consistent profile-picture crops for a described persona, distinct from the character sheet's full-body/expression scope.
9. **Explainer-Video Mascot Style Frame Set** — motion/video / character design — key frames establishing a friendly explainer-video mascot's look, distinct from `motion-graphics-style-frame-generator`'s subject-less graphic system.
10. **Infographic Illustration Style Kit** — illustration / generate — a consistent icon/color/illustration style for a set of infographic panels.
11. **Storefront/Retail Window Display Mockup Generator** — environment art / generate — visualizes a retail window/storefront display concept, distinct from `trade-show-booth-concept-visualizer`'s exhibit-booth scope.
12. **Podcast/YouTube Channel Branding Kit** — thumbnail design / generate — cover art, banner, and thumbnail-template prompts styled consistently for a content creator's channel, a channel-level counterpart to `thumbnail-variant-generator-for-a-b-testing`'s single-video scope.
