# Coverage Matrix: Education & Learning

- **Sub-domain**: lesson planning, curriculum design, assessment/quiz creation, tutoring/explaining, study techniques, feedback on student work, language learning, professional certification prep
- **Persona**: K-12 teacher, university instructor, self-directed learner, corporate trainer, parent helping a child
- **JTBD stage**: plan → generate materials → explain/teach → assess → give feedback
- **Output format**: lesson plan, quiz, rubric, script, study plan

## Shipped

1. [Lesson Plan Generator from Learning Objectives](../../en/education-and-learning/lesson-plan-generator-from-learning-objectives.md) — lesson planning / plan / teacher.
2. [Socratic Tutor for a Specific Concept](../../en/education-and-learning/socratic-tutor-for-a-specific-concept.md) — tutoring / explain / self-directed learner.
3. [Quiz Generator with Difficulty Tiers](../../en/education-and-learning/quiz-generator-with-difficulty-tiers.md) — assessment / generate / teacher.
4. [Spaced-Repetition Study Plan Builder](../../en/education-and-learning/spaced-repetition-study-plan-builder.md) — study techniques / plan / self-directed learner.
5. `concept-explainer-at-three-reading-levels` — tutoring / explain / beginner — re-explains the same concept for a child, a teen, and an adult with genuinely different framings, not a shortened version of one explanation.
6. `rubric-based-essay-feedback-giver` — feedback / assess / intermediate — scores an essay against a stated rubric with textual evidence per criterion, distinct from generic writing feedback.
7. `peer-review-feedback-coach-for-students` — feedback / assess / beginner — coaches a student on turning vague peer-review comments into specific, actionable feedback, teaching the skill rather than rewriting for them.
8. `curriculum-gap-analyzer` — curriculum design / analyze / intermediate (instructor) — finds objectives with no covering unit, units with no clear objective, and prerequisite-sequencing problems.
9. `language-learning-conversation-partner` — language learning / practice / beginner — turn-by-turn conversation practice at a specified proficiency level with gentle in-flow error correction.
10. `certification-exam-weak-area-diagnostic` — professional cert prep / assess / intermediate — diagnoses the underlying cause of a missed-question pattern from practice exam results and prioritizes remaining study time, distinct from `spaced-repetition-study-plan-builder`'s scheduling-only scope.
11. `corporate-training-module-outline-builder` — corporate training / plan / intermediate (trainer) — outlines a training module with objectives, timed sections, interaction points, and a landing check.
12. `parents-homework-help-script` — tutoring / explain / beginner (parent) — coaches a parent on guiding a child through homework without giving the answer, including handling the parent's own uncertainty about the material.

## Backlog — ideas ready to draft

_Drawn down to 0 this session (2026-08-31) — the 8 items above cleared the entire starter backlog. Refilled below from the coverage matrix's dimension-crossing method (§6.1) before the next education-and-learning session._

1. **Misconception Diagnostic from a Wrong Answer** — assess / plan — given a student's incorrect answer and work shown, infers the likely underlying misconception rather than just marking it wrong.
2. **Group Project Role Assignment Advisor** — plan / instructor — assigns roles/tasks for a group project given team size, skill mix, and the project's actual deliverable structure.
3. **Reading Comprehension Question Generator by Bloom's Level** — assessment / generate — generates comprehension questions spanning recall through analysis/evaluation for a given text.
4. **Classroom Discussion Prompt Sequencer** — lesson planning / plan — sequences discussion questions from low-stakes/accessible to higher-order for a given topic and class level.
5. **IEP/Accommodation-Aware Lesson Adapter** — lesson planning / plan / teacher — adapts an existing lesson plan for a stated accommodation need without diluting the learning objective.
6. **Study Group Session Agenda Builder** — study techniques / plan / self-directed learner — structures a peer study session's agenda so it doesn't devolve into unfocused chat.
7. **Exam Question Difficulty Calibrator** — assessment / critique — reviews a drafted exam for whether question difficulty actually matches its intended level, flagging trick questions and giveaways.
8. **Learning Objective Writer from a Topic Description** — curriculum design / draft-generate — turns a vague topic into measurable, Bloom's-taxonomy-anchored learning objectives, the upstream counterpart to `lesson-plan-generator-from-learning-objectives`.
9. **Student Progress Narrative Report Writer** — feedback / draft-generate / teacher — drafts a narrative progress report from raw gradebook/observation notes for a specific student.
10. **Flashcard Deck Generator from Source Material** — study techniques / generate — extracts genuinely testable flashcard pairs from a text or lecture transcript, distinct from `spaced-repetition-study-plan-builder`'s scheduling-only scope.
11. **Cross-Cultural Classroom Norms Briefing** — plan / teacher — briefs an instructor on likely cultural differences in classroom participation norms for a described international student mix.
12. **Self-Assessment Reflection Prompt Builder** — feedback / plan / self-directed learner — generates structured reflection questions for a learner to self-assess after completing a unit, before instructor feedback arrives.
