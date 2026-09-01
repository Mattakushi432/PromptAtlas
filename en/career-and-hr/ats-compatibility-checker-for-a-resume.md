---
id: ats-compatibility-checker-for-a-resume
title: ATS Compatibility Checker for a Resume
category: career-and-hr
tags: [resume]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-01
---

## Description
Audits a resume's format and structure for applicant-tracking-system (ATS) parseability — problematic tables/columns/graphics, non-standard section headers, inconsistent date formats, and keyword coverage against a target job posting — distinct from `resume-bullet-rewriter-for-impact` (career-and-hr, already shipped)'s bullet-level content and impact rewriting, since this prompt checks whether the resume gets correctly parsed and surfaced to a human at all, not whether the writing itself is compelling.

## When to use it
- You're applying through an online portal that almost certainly runs your resume through an ATS before a human sees it, and want to check the format won't cause it to be misread or dropped, independent of how good the content is.
- Your resume looks great when you open it, but you suspect a formatting choice (columns, a graphic, an unusual header) might not survive being parsed by an ATS.
- You're applying to a specific posting and want to check keyword alignment between the resume and the job description, since many ATS platforms rank or filter based on keyword match.

## The Prompt

```
You audit a resume's format and structure for ATS (applicant-tracking-system) parseability. You are not reviewing the quality of the writing or bullet content — only whether the resume's structure will be correctly read by an ATS and surfaced to a human reviewer.

Resume content and structure (as formatted, describe layout if not plain text): {{RESUME}}
Target job posting, if checking keyword alignment: {{JOB_POSTING}}
ATS platform, if known (some have documented quirks): {{ATS_PLATFORM}}

Instructions:
1. Check for multi-column layouts, text boxes, or tables used for layout (not genuine tabular data) — many ATS parsers read left-to-right, top-to-bottom and will scramble a multi-column resume's content order, or skip text inside a text box entirely. Flag any such layout element explicitly.
2. Check for graphics, icons, or embedded images used to convey information (a skill-level bar chart, an icon instead of a section label) — ATS parsers typically can't read text embedded in an image, so any information conveyed only visually is effectively invisible to the system.
3. Check section headers against standard conventions the resume is likely to be parsed against — a creatively-named section ("My Journey" instead of "Work Experience") may not be recognized as the section type it actually is, causing content to be misfiled or dropped from the relevant parsed field.
4. Check date format consistency across all entries — inconsistent formats (some as "Jan 2023," others as "01/2023," others as "2023") can cause a parser to misread employment duration or ordering, which affects both correctness and any duration-based filtering the ATS applies.
5. If {{JOB_POSTING}} is provided, check keyword alignment: identify key terms/skills/qualifications from the posting that don't appear anywhere in {{RESUME}} in a matching or close-synonym form — many ATS platforms rank or filter on keyword match, so a genuinely qualified candidate can be filtered out for using different terminology than the posting even when they have the actual skill. Flag missing keywords the candidate likely does have grounds to include honestly (do not suggest adding a keyword for a skill not evidenced anywhere in the resume).
6. If {{ATS_PLATFORM}} is known and has a documented specific quirk (e.g. particular sensitivity to a certain file format or header style), check for that specifically rather than only generic ATS best practices.

Output format: Markdown. For each finding: the specific format issue, why it's an ATS risk (not a stylistic preference), and the specific fix. If {{JOB_POSTING}} was provided, a separate "Keyword Gaps" section listing terms present in the posting but missing from the resume, each flagged only if the candidate's actual described experience would honestly support adding it. End with an overall parseability verdict.
```

## Variables
- `{{RESUME}}` — the resume's content and structure; if not plain text, describe the actual layout (columns, tables, headers used) since visual formatting is exactly what this prompt needs to assess. Required.
- `{{JOB_POSTING}}` — the target job posting text, if keyword alignment should be checked. Optional — omit for a format-only check.
- `{{ATS_PLATFORM}}` — the specific ATS platform, if known. Optional — most checks apply generically across ATS platforms regardless.

## Example
**Input:** `{{RESUME}}` = "Two-column layout: left column has a 'Skills' section with a visual bar-chart graphic showing proficiency levels; right column has 'Experience' with entries dated inconsistently (some 'Jan 2023 - Present', one just '2022-2023'). Section header for work history is titled 'Where I've Made Impact.'" `{{JOB_POSTING}}` = "...requires experience with stakeholder management and cross-functional collaboration..." `{{ATS_PLATFORM}}` = "Not specified"

**Output (excerpt):**
```
### Finding: Two-column layout
Multi-column layouts are a high-risk ATS parsing issue — many parsers read left-to-right across the full page width, which can interleave the left column's Skills content with the right column's Experience content in the parsed output, scrambling both sections.
Fix: switch to a single-column layout with sections stacked vertically.

### Finding: Skills bar-chart graphic
Proficiency levels conveyed only through a visual bar chart are invisible to an ATS parser — the skill names might parse if they're also present as text, but the proficiency-level information itself is lost entirely.
Fix: state proficiency in text if it needs to be conveyed at all (e.g. "Advanced: Python" as plain text), though for many roles simply listing the skill without a self-rated proficiency level is both ATS-safe and more credible to a human reviewer.

### Finding: Non-standard section header "Where I've Made Impact"
This is unlikely to be recognized as the standard "Work Experience" section by parsers looking for conventional headers, risking the entire section being misfiled or dropped from the structured "experience" field the ATS surfaces to reviewers.
Fix: use "Work Experience" or "Professional Experience" — a conventional header, even if less distinctive, ensures correct parsing.

### Finding: Inconsistent date formats
Mixing "Jan 2023 - Present" with "2022-2023" risks incorrect duration/date parsing for at least one entry.
Fix: standardize to one format across every entry (e.g. "Jan 2023 - Present" throughout).

### Keyword Gaps
"Cross-functional collaboration" doesn't appear in {{RESUME}} in this or a close-synonym form — if the candidate's actual experience involves working across teams/functions (common enough to check honestly), this specific phrase or a close equivalent is worth including, since it's a term directly from {{JOB_POSTING}} an ATS keyword match may be scanning for.

### Overall Verdict
Not currently ATS-safe — the two-column layout and non-standard section header are the highest-risk issues and should be fixed before applying through any ATS-mediated portal, regardless of how strong the content itself is.
```

## Tips & Variations
- Pair with `resume-bullet-rewriter-for-impact` (career-and-hr, already shipped) after this format check — fix parseability first, then strengthen bullet content, rather than polishing bullets on a resume structure that might not even reach a human reviewer.
- Not every application goes through an ATS — for a role you're applying to via a warm referral or direct email to a hiring manager, this prompt's findings matter less, since a human is reading the actual file rather than a parsed version of it; don't over-index on ATS-safety at the cost of visual polish for those situations.
- If {{JOB_POSTING}} keyword gaps surface a skill genuinely missing from the resume (not just missing terminology for a skill that's there), that's a signal to address in the resume's actual content, not just add the keyword — inserting a keyword for a skill not actually evidenced is a form of the same misrepresentation this prompt's honesty principle is built to avoid.

## Changelog
- 1.0.0 (2026-09-01): Initial version.
