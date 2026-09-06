# Coverage Matrix: Career & HR

- **Sub-domain**: resume/CV writing, cover letters, interview prep, job description writing, performance reviews, onboarding, compensation benchmarking, career pathing, exit interviews
- **Persona**: job seeker, hiring manager, HR/People team, new manager
- **JTBD stage**: draft → prep/practice → critique → plan
- **Output format**: draft document, question bank, script, plan

## Shipped

1. [Resume Bullet Rewriter for Impact](../../en/career-and-hr/resume-bullet-rewriter-for-impact.md) — resume writing / edit / job seeker.
2. [Mock Interview Practice Partner](../../en/career-and-hr/mock-interview-practice-partner.md) — interview prep / practice / job seeker.
3. [Performance Review Draft from Bullet Notes](../../en/career-and-hr/performance-review-draft-from-bullet-notes.md) — performance reviews / draft / new manager.
4. [30-60-90 Day Onboarding Plan Builder](../../en/career-and-hr/30-60-90-day-onboarding-plan-builder.md) — onboarding / plan.
5. [Compensation Band Rationale Writer](../../en/career-and-hr/compensation-band-rationale-writer.md) — compensation benchmarking / draft.
6. [Career Path Options Explorer](../../en/career-and-hr/career-path-options-explorer.md) — career pathing / plan / job seeker.
7. [Exit Interview Question Set + Theme Synthesizer](../../en/career-and-hr/exit-interview-question-set-theme-synthesizer.md) — exit interviews / plan+analyze.
8. [Difficult Feedback Conversation Scripter](../../en/career-and-hr/difficult-feedback-conversation-scripter.md) — performance reviews / plan / new manager.
9. [LinkedIn Profile Rewrite from a Resume](../../en/career-and-hr/linkedin-profile-rewrite-from-a-resume.md) — resume writing / draft.
10. `job-description-drafter-from-role-requirements` — job description writing / draft / beginner — the generation counterpart to the bias-auditor's critique focus (#11), writing a new JD from raw notes rather than reviewing an existing one.
11. `interview-panel-feedback-synthesizer` — interview prep / critique+plan / intermediate — turns multiple interviewers' independent notes into a structured hire/no-hire recommendation, surfacing genuine panel disagreement rather than averaging it away.
12. `offer-competitiveness-auditor` — compensation benchmarking / critique / intermediate — checks a drafted offer against stated market bands before it's sent, a pre-send counterpart to `compensation-band-rationale-writer`'s after-the-fact documentation.
13. `individual-development-plan-idp-drafter` — career pathing / draft / intermediate — drafts a direct report's growth plan combining performance signal and stated career interest, the manager-facing counterpart to `career-path-options-explorer`'s job-seeker-facing self-exploration.
14. `new-hire-pre-boarding-welcome-kit-drafter` — onboarding / draft / beginner — the first-touchpoint welcome communication before day one, an earlier stage than `30-60-90-day-onboarding-plan-builder`'s working plan.
15. `stay-interview-question-designer` — exit interviews / plan / beginner — a proactive retention-focused counterpart to exit interviews, asked before someone decides to leave rather than after.
16. `ats-compatibility-checker-for-a-resume` — resume writing / critique / beginner — audits format/parseability for applicant-tracking systems, distinct from `resume-bullet-rewriter-for-impact`'s bullet-level impact rewriting.
17. `performance-calibration-prep-brief` — performance reviews / critique / intermediate — prepares a cross-team ratings-consistency brief for a calibration meeting, an HR-facing counterpart to the individual-manager-facing review drafting already shipped.
18. `reference-check-question-set-builder` — interview prep / plan / intermediate — designs targeted reference-check questions tied to specific concerns raised in the interview loop.
19. `internal-mobility-pitch-drafter` — career pathing / draft / intermediate — helps an employee draft a concrete pitch for an internal transfer/promotion to a specific decision-maker, distinct from `career-path-options-explorer`'s open-ended exploration.

## Backlog — ideas ready to draft

_10 of the original 13 backlog items were drafted this session (2026-09-01). The remaining 3 stay reserved as open GitHub good-first-contribution issues (checked 2026-09-01: all still open, unclaimed, uncommented) and were deliberately left for contributors. Refilled below with new matrix-derived ideas per `CURATOR_PROMPT.md` §6.3._

1. **Cover Letter Drafter from Resume + Job Post** — cover letters / draft. (Invite issue open: [#9](https://github.com/Mattakushi432/PromptAtlas/issues/9))
2. **Behavioral Interview Question Bank Generator** — interview prep / plan / hiring manager. (Invite issue open: [#10](https://github.com/Mattakushi432/PromptAtlas/issues/10))
3. **Job Description Bias Auditor** — job description writing / critique. (Invite issue open: [#11](https://github.com/Mattakushi432/PromptAtlas/issues/11))
4. **Promotion Packet Drafter** — career pathing / draft / job seeker — assembles a formal promotion case packet (accomplishments, scope growth, peer/stakeholder feedback) for a formal review committee, distinct from `internal-mobility-pitch-drafter`'s single-decision-maker pitch.
5. **Team Restructuring Communication Drafter** — management / draft / new manager — drafts the announcement and individual conversations needed when a team reorg affects reporting lines or roles.
6. **Skills Gap Analysis for a Team** — career pathing / analyze / HR-People team — maps a team's current skill inventory against upcoming project/roadmap needs to identify hiring vs. upskilling priorities.
7. **New Manager First 90-Days Plan Builder** — onboarding / plan / new manager — a first-time-manager-specific onboarding plan distinct from `30-60-90-day-onboarding-plan-builder`'s general new-hire scope.
8. **Layoff/RIF Notification Script Drafter** — management / plan — scripts the specific, humane notification conversation for a reduction-in-force situation, distinct from `difficult-feedback-conversation-scripter`'s performance-feedback scope.
9. **Peer Recognition Nomination Writer** — coaching / draft / job seeker — helps an employee write a specific, evidence-based peer recognition/award nomination rather than generic praise.
10. **Return-to-Work Transition Plan Builder** — onboarding / plan / HR-People team — plans a structured re-onboarding for an employee returning from extended leave.
