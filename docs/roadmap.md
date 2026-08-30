# Roadmap

Tracks progress toward the 500-distinct-prompt-per-category floor defined in `CURATOR_PROMPT.md` §6. Updated every session that adds or reviews prompts. Counts here are the source of truth for prompt volume — `docs/taxonomy.md` covers category definitions only.

"Stable" and "Draft" count English/Ukrainian pairs (both files always exist per pair — see `CURATOR_PROMPT.md` §9). "Backlog ideas ready to draft" is the length of that category's list in `docs/coverage-matrix/<slug>.md`; refill a list once it drops below ~20 entries.

| Category | Target | Stable | Draft | Backlog ideas ready to draft |
|---|---|---|---|---|
| [coding](coverage-matrix/coding.md) | 500 | 129 | 0 | 12 |
| [writing-and-content](coverage-matrix/writing-and-content.md) | 500 | 6 | 0 | 6 |
| [marketing-and-sales](coverage-matrix/marketing-and-sales.md) | 500 | 7 | 0 | 5 |
| [business-and-strategy](coverage-matrix/business-and-strategy.md) | 500 | 4 | 0 | 8 |
| [education-and-learning](coverage-matrix/education-and-learning.md) | 500 | 4 | 0 | 8 |
| [productivity-and-personal](coverage-matrix/productivity-and-personal.md) | 500 | 4 | 0 | 8 |
| [data-and-analysis](coverage-matrix/data-and-analysis.md) | 500 | 4 | 0 | 8 |
| [research-and-academic](coverage-matrix/research-and-academic.md) | 500 | 4 | 0 | 8 |
| [creative-and-visual](coverage-matrix/creative-and-visual.md) | 500 | 4 | 0 | 8 |
| [voice-and-audio](coverage-matrix/voice-and-audio.md) | 500 | 4 | 0 | 8 |
| [agents-and-automation](coverage-matrix/agents-and-automation.md) | 500 | 3 | 0 | 9 |
| [career-and-hr](coverage-matrix/career-and-hr.md) | 500 | 7 | 0 | 5 |
| [social-media](coverage-matrix/social-media.md) | 500 | 0 | 0 | 12 |

**Total: 152 stable, 0 draft, out of a 6,500-prompt floor across all categories.**

## Notes

- `coding` is being built out toward its 500 target across multiple sessions per `CURATOR_PROMPT.md` §6.4 (realistic batches of ~10-25, never rushed). At the current pace (~12 rubric-passing, distinctiveness-checked pairs per session), reaching 500 is a multi-session effort spanning roughly 30+ more sessions — sourcing genuinely distinct ideas gets harder, not easier, as the easy matrix cells fill in, so later sessions may ship smaller batches or flag specific sub-areas as near their honest ceiling per §6.4.

- **`writing-and-content` was seeded 2026-08-30**: 6 of the original 12 backlog ideas were drafted through the full pipeline (both languages, rubric self-scored, `status: stable`); the other 6 were left as backlog rather than rushed, and 3 of those 6 are now open as `good-first-contribution` community invite issues (#6, #7, #8). Its backlog (6 ideas) is now below the ~20 refill threshold — refill it with new matrix-derived ideas next session before drawing it down further, per `CURATOR_PROMPT.md` §6.1/§6.3.
- **`marketing-and-sales` was seeded 2026-08-30**: 7 of the 12 backlog ideas were drafted through the full pipeline (both languages, rubric self-scored, `status: stable`). The other 5 (pricing objection auditing, competitive battlecards, referral copy, sales deck review, win-back sequences) were left as backlog rather than rushed to 12. Its backlog (5 ideas) is now below the ~20 refill threshold — refill next session per §6.1/§6.3.
- **`career-and-hr` was seeded 2026-08-30**: 7 of the 12 backlog ideas were drafted through the full pipeline (both languages, rubric self-scored, `status: stable`), deliberately skipping the 3 ideas already open as community invite issues (#9, #10, #11) to avoid the curator duplicating work a contributor might pick up. The remaining 2 non-issue ideas (difficult feedback conversation scripting, LinkedIn profile rewrite) were left as backlog. Its backlog (5 ideas: 3 issue-linked + 2 undrafted) is below the ~20 refill threshold — refill next session per §6.1/§6.3, and check whether issues #9-#11 have been claimed before drafting them directly.
- Every other category's coverage-matrix backlog still holds its starter set of 12 ideas (below the ~20 refill threshold) — the matrices themselves (dimensions to cross) are the durable artifact; the specific title lists are meant to be expanded during real drafting sessions per `CURATOR_PROMPT.md` §6.1/§6.4, not filled to 20+ speculatively in one pass.
- No category has been assessed as "at its honest ceiling" yet (per §6.4) — that determination only applies after a category's matrix has actually been worked through, not on day one.
