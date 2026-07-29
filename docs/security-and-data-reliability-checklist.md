# Security And Data Reliability Checklist

## Authentication And Roles

- Admin UI is behind Firebase Auth.
- Admin access checks use approved emails and/or Firestore role.
- New learner profiles default to learner behavior.
- Learners cannot access admin routes.

## AI And Backend Safety

- Gemini API keys are stored as backend/function secrets.
- Client screens never store Gemini secrets.
- Admin draft generation sends a BatiBot curriculum contract before Gemini prompt text.
- Gemini output is normalized and validated before admin editing.
- AI drafts are never published directly.

## Publish Safety

- Publishing blocks missing grade, world, topic, or phase.
- Publishing blocks missing approved asset for image-based content.
- Publishing blocks missing mobile preview check.
- Practice content must repeat known content with support.
- Challenge content must not introduce new content.
- Reward impact is visible before publish.

## Learner Data

- Local learner profile identity uses generated profile IDs, not display name.
- Same-name learners can keep separate progress.
- Progress is scoped to learner profile and grade module.
- Reset progress is intentional and user-triggered.

## Firestore Reliability

- Admin writes use curated content collections.
- Learner reads only published content.
- Admin logs are recorded for publishing actions.
- Report data gracefully falls back when admin reads are unavailable.

## UI Reliability

- Play, Rank, and Reward controls remain visible on mobile.
- Text uses bounded cards and `numberOfLines` where needed.
- Bottom tab content has enough padding to avoid covering final controls.
- Loading and permission errors are visible.
