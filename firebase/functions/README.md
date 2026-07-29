# BatiBot Firebase Functions

This backend keeps the Gemini API key out of the Expo app. The admin UI calls
`generateQuizDraft`, and the function verifies that the signed-in Firebase user
matches the single approved admin email before calling Gemini.

The quiz endpoint now runs generation as a quality pipeline:

- Gemini creates the first structured draft.
- The function scores each question for alignment, clarity, depth, uniqueness,
  answer validity, and age fit.
- Repeated, shallow, unclear, incomplete, or metadata-light questions receive
  `validationFlags`.
- If any question is flagged, the function asks Gemini for one repair pass and
  returns the better reviewed result.
- The response includes `qualitySummary`, `promptVersion`, and `modelName` so
  admin reviews can trace how a draft was produced.

## Setup

Install function dependencies:

```bash
cd firebase/functions
npm ci
```

Set the Gemini secret:

```bash
firebase functions:secrets:set GEMINI_API_KEY
```

Optionally set the one approved admin email for the function environment by
copying `firebase/functions/.env.example` to `firebase/functions/.env`. If you
skip this, it defaults to `admin@batibot.app`.

```env
BATIBOT_ADMIN_EMAIL=admin@batibot.app
```

Keep this value aligned with `EXPO_PUBLIC_BATIBOT_ADMIN_EMAIL` in the Expo app
if you change the admin account.

Deploy:

```bash
cd ../..
firebase deploy --only functions
```

The app defaults to:

```text
https://us-central1-batibot-app-e3cc9.cloudfunctions.net/generateQuizDraft
```

If you deploy to a different project or region, set this in the Expo app env:

```env
EXPO_PUBLIC_GEMINI_QUIZ_ENDPOINT=https://your-function-url
```

Restart Expo after changing environment variables.
