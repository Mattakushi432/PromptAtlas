# Coverage Matrix: Voice & Audio

- **Sub-domain**: podcast production, voiceover scripting, text-to-speech tuning, audio editing notes, sound design briefs, transcription cleanup, dialogue writing, ad jingle briefs
- **Persona**: podcaster, indie game/app dev, e-learning creator, marketer
- **JTBD stage**: plan/script → generate → edit/clean → direct/tune delivery
- **Output format**: script with annotations, brief, cleaned transcript

## Shipped

1. [Podcast Episode Outline from Raw Notes](../../en/voice-and-audio/podcast-episode-outline-from-raw-notes.md) — podcast production / plan.
2. [Voiceover Script with Delivery Direction Annotations](../../en/voice-and-audio/voiceover-script-with-delivery-direction-annotations.md) — voiceover scripting / generate.
3. [Raw Transcript Cleanup Pass](../../en/voice-and-audio/raw-transcript-cleanup-pass.md) — transcription cleanup / edit.
4. [Sound Design Brief from a Scene Description](../../en/voice-and-audio/sound-design-brief-from-a-scene-description.md) — sound design briefs / plan.
5. `tts-pronunciation-fix-list-generator` — TTS tuning / edit / intermediate — flags proper nouns, acronyms, heteronyms, and jargon likely mispronounced and generates phonetic respellings/SSML.
6. `voice-consistency-checker-across-a-script` — TTS tuning / critique / intermediate — flags unintentional tone/character drift across a long script's sections, distinguishing it from deliberate tonal shifts.
7. `audio-description-script-writer-for-accessibility` — dialogue writing / generate / intermediate — writes timed audio description that fits available silence gaps without over- or under-describing.
8. `podcast-show-notes-and-timestamp-generator` — podcast production / document / beginner — generates show notes and accurate timestamped chapters from a recorded episode, distinct from `podcast-episode-outline-from-raw-notes`'s pre-recording planning scope.
9. `dialogue-naturalizer-for-e-learning-narration` — dialogue writing / edit / intermediate — rewrites stiff textbook narration into natural spoken instruction while preserving exact instructional content.
10. `multi-speaker-script-formatter-for-tts-pipelines` — TTS tuning / generate / intermediate — reformats dialogue into a TTS platform's exact multi-speaker syntax, flagging ambiguous speaker attribution.
11. `ad-jingle-concept-brief-generator` — ad jingle briefs / plan / beginner (marketer) — generates a composer-usable creative brief (mood, hooks, tempo, length) rather than vague mood-board language.
12. `interview-question-set-for-a-podcast-guest` — podcast production / plan / beginner — a structured, logically-building question set including one likely to surface something not already covered elsewhere.

## Backlog — ideas ready to draft

_Drawn down to 0 this session (2026-08-31) — the 8 items above cleared the entire starter backlog. Refilled below from the coverage matrix's dimension-crossing method (§6.1) before the next voice-and-audio session._

1. **Audiobook Chapter Pacing Reviewer** — voiceover scripting / critique — checks a chapter's estimated reading pace against genre convention and flags sections that would drag or rush.
2. **Podcast Ad Read Script Blender** — voiceover scripting / generate — drafts a host-read ad script that blends sponsor talking points with the host's established voice rather than reading like a foreign insert.
3. **Sound Effects Library Tagging Assistant** — sound-design / document — generates consistent, searchable tags/descriptions for a batch of sound effect files from raw filenames/descriptions.
4. **Voice Actor Casting Brief Generator** — voiceover scripting / plan — drafts a casting brief (character voice qualities, reference examples, audition sides) from a character/project description.
5. **Podcast Cold-Open Hook Writer** — podcast production / draft-generate — writes a short cold-open hook from an episode's key moment to pull listeners in before the intro.
6. **Multilingual Dubbing Script Timing Adapter** — TTS tuning / edit — adapts a translated dubbing script's phrasing to fit the original's timing/lip-flap constraints.
7. **Audio Ad Length Variant Generator** — ad jingle briefs / generate — adapts one ad concept into 15/30/60-second script variants without just truncating the longest version.
8. **Podcast Guest Pre-Interview Briefing Doc** — podcast production / document — drafts what to send a guest beforehand (topics, format expectations, technical setup) distinct from `interview-question-set-for-a-podcast-guest`'s host-facing question prep.
9. **Character Voice Bible Builder** — dialogue writing / document — documents a recurring character's speech patterns (vocabulary tics, sentence rhythm, catchphrases) for consistency across a long-running series.
10. **Silence/Filler-Word Cleanup Marker Generator** — transcription cleanup / edit — marks likely-removable silences and filler words in a raw transcript for an editor, distinct from `raw-transcript-cleanup-pass`'s full-text cleanup scope.
11. **Binaural/Spatial Audio Scene Direction Writer** — sound-design / plan — plans directional/spatial audio cues for an immersive or VR audio scene.
12. **Voice Search Query Response Script Writer** — voiceover scripting / generate — drafts concise, voice-assistant-appropriate spoken responses to common queries for a brand's voice app/skill.
