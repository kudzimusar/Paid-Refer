# Project Governance & Alignment Rules

To ensure Refer 2.0 remains strictly aligned with its core objectives and technical roadmap, the following operational rules are **MANDATORY** for all developers and AI assistants:

## 1. The "Feature Alignment" Rule (MANDATORY)
**Whenever a new feature is added, modified, or prototyped, you MUST update the three core documentation pillars:**

1.  **[CONTEXT.md](./CONTEXT.md)**: Update the roadmap, current sprint, and build status.
2.  **[KNOWLEDGE.md](./KNOWLEDGE.md)**: Add any new domain specificities, regional rules, or technical logic discovered/implemented.
3.  **[SKILLS.md](./SKILLS.md)**: Add any new technical competencies, library mastery, or architectural patterns introduced.

## 2. Why this exists
Missing these updates creates "documentation debt" which leads to:
- Desynchronization from the project goal.
- Future AI iterations making incorrect assumptions based on old context.
- Failure to adhere to regional compliance (ZW/ZA/JP).

## 3. Compliance Check
Before marking a feature as "Done" or ending a task, check the status of these three files. If they don't reflect the current state of the code, the task is NOT complete.
