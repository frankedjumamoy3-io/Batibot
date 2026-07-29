# Refactor Component

Read `AGENTS.md` first and keep behavior stable.

Refactor only when it reduces real duplication, improves type safety, or matches an established BatiBot pattern.
Start by auditing the component and listing the planned files before editing.

Check:
- Ownership layer: `app`, `components`, `constants`, `hooks`, `src/data`, `src/store`, or service layer
- Learner progress and reward behavior
- Centralized asset resolver usage
- Mobile layout stability
- Validation coverage

Return:
1. What changed
2. Why it is safer
3. Files touched
4. Validation results
