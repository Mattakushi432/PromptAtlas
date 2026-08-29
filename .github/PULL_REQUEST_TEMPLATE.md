## Summary

What prompt(s) are you adding or changing, and why?

## Bilingual parity

- [ ] Both `en/<category>/<id>.md` and `uk/<category>/<id>.md` are included (for a new prompt), or both were updated in lockstep with the same `version` bump (for an edit).
- [ ] The `uk/` prompt text is a native localization, not a literal translation.
- [ ] Frontmatter `id`, `category`, and `version` match exactly between the two files.

## Quality Rubric self-score

Score each 1–5 (see [`CONTRIBUTING.md`](../CONTRIBUTING.md#quality-rubric) for definitions). Needs an average of 4.0+, no dimension below 3, to ship as `status: stable`.

| Dimension | Score (1-5) |
|---|---|
| Clarity | |
| Specificity | |
| Structure | |
| Output control | |
| Robustness | |
| Reusability | |
| Bilingual equivalence | |
| Distinctiveness | |

- [ ] If any dimension scored below 3, or the average is below 4.0, both files are set to `status: draft`.

## Checklist

- [ ] Filename doubles as a stable `id` (no renaming an existing published prompt).
- [ ] `## Example` section has a realistic, filled-in input/output.
- [ ] Checked against the category's `docs/coverage-matrix/<slug>.md` index — this idea isn't a near-duplicate of an existing prompt.
- [ ] `docs/roadmap.md` counts (Stable/Draft/Backlog) updated for the affected category, and the idea removed from its backlog list.
- [ ] `CHANGELOG.md` has a new entry.
