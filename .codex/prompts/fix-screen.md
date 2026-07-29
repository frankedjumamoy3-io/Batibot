# Fix Selected Screen

Read `AGENTS.md` first and preserve the existing architecture.

Requirements:
- Start by auditing the screen and listing the fix plan before editing.
- Keep TypeScript strict.
- Keep business logic out of visual-only components.
- Reuse existing components and resolver helpers.
- Use large child-safe touch targets.
- Keep text short, visible, and speaker-aligned.
- Do not expose learner-facing debug or placeholder text.
- Validate correct answer, duplicate choice, and distractor integrity before rendering.

After fixing:
- Summarize changed files.
- Explain behavior changes.
- List validation results and remaining risks.
