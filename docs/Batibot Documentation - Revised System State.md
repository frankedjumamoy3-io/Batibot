# BatiBot: A Curriculum-Aware Gamified Mobile Application for Early Vocabulary, Numeracy, Progress Tracking, and Admin-Curated AI Quiz Support

> Official Chapter I source: `docs/chapter-1-introduction.md`.
>
> This revised system-state document is the implementation companion. When academic wording, scope, objectives, or limitations differ, Chapter I is the source of truth. Current implementation gaps are tracked in `docs/chapter-1-system-alignment-audit.md`.

## Chapter 1 - Introduction

### Introduction

Digital learning tools have become an important support for early childhood education, especially for learners who need repeated practice, visual guidance, and immediate feedback. For Preschool to Grade 3 learners, vocabulary and numeracy are foundational skills that influence reading readiness, communication, problem-solving, and classroom participation. However, many young learners have short attention spans and may lose interest when learning activities rely only on static materials or one-way instruction.

BatiBot is framed as a personal learning app rather than a parent-managed or teacher-managed platform. Learners need a simple way to review words, numbers, sounds, and simple problem-solving activities without creating an email account first. At the same time, the app owner still needs a safer and more organized way to prepare, review, and publish learning materials that are appropriate for young users.

BatiBot addresses these needs through a mobile-first gamified learning application focused on early vocabulary, numeracy, quizzes, rewards, and progress tracking. The system provides vocabulary cards with pronunciation support, quiz activities across linguistic, numeric, and mixed learning domains, and a reward system that includes experience points, levels, streaks, badges, achievements, and unlockable activities. These features are designed to make practice more engaging while allowing learners to see their growth over time. The application is structured into separated learner curriculum modules for Preschool, Kindergarten, Grade 1, Grade 2, and Grade 3 so that the learner's selected grade level controls the visible Play worlds, quiz presets, learning activities, copy length, interaction style, and progression expectations.

The system also includes email-free local learner profiles, Firebase-backed app-owner authentication, secured storage where needed, local learner progress tracking, and an administrator dashboard for quiz curation. Its artificial intelligence support is currently implemented through an admin-side quiz draft generator that uses a secure backend function. The revised system direction adds a BatiBot-owned curriculum API layer between the administrator module and Gemini. This API stores and serves the preset grade-specific curriculum, UI/UX rules, active learning phase rules, question formats, cognitive-level constraints, and content validation requirements before any Gemini draft is requested. This means AI-generated quiz content is not published directly to learners; instead, Gemini output must first follow BatiBot curriculum constraints, then pass through administrator review, checklist validation, and publication controls. To keep the learner experience child-friendly, the interface also uses lightweight motion and feedback patterns powered by React Native Reanimated for buttons, cards, progress bars, result feedback, and guided screen transitions. Through this approach, BatiBot combines gamified learning, progress monitoring, controlled AI assistance, and responsive child-appropriate interaction while keeping content safety and learner experience as major priorities.

### Objectives of the Study

The general objective of this project is to design, develop, and evaluate BatiBot as an AI-assisted gamified mobile application that supports early vocabulary, numeracy, and learner progress tracking for Preschool to Grade 3 learners.

Specifically, this study aims to:

1. Design and develop a mobile-first personal learning application with email-free local learner profiles, grade-specific curriculum module routing, and secured app-owner administrator access.

2. Develop separated Preschool, Kindergarten, Grade 1, Grade 2, and Grade 3 vocabulary and quiz modules that support early linguistic, numeric, and mixed learning activities through age-appropriate content, grade-level alignment, and child-friendly interaction.

3. Implement gamification features such as experience points, levels, streaks, unlock requirements, badges, achievements, notifications, recent activity tracking, and animation-supported feedback to encourage learner engagement.

4. Implement a learner progress tracking system that records viewed vocabulary, completed quizzes, quiz scores, mastery indicators, rewards, learner-level progress, and quiz attempt analytics.

5. Develop an administrator dashboard that allows authorized administrators to create, edit, review, duplicate, publish, unpublish, archive, and delete curated quiz content.

6. Integrate a secure AI-assisted quiz draft generation workflow that allows administrators to generate editable quiz drafts through a BatiBot curriculum API and backend Gemini function before human review and publication.

7. Evaluate the application in terms of functionality, usability, content appropriateness, progress tracking reliability, and security of learner and administrator data flows.

### Purpose and Description

BatiBot is developed to provide early learners with an engaging and structured way to practice vocabulary, numeracy, and simple reasoning skills through a gamified mobile learning environment. The system aims to make learning more interactive by combining vocabulary exploration, quiz practice, pronunciation support, rewards, progress monitoring, and grade-specific curriculum presentation in one application.

The project is intended primarily to benefit individual learners using BatiBot as a personal learning app. Learners can use the application to explore words, answer quizzes, earn rewards, and monitor their growth through a child-friendly interface with smooth visual feedback. When a learner logs in or signs up with a selected grade level, the app should route that learner to the matching curriculum module. A Preschool learner should see Preschool worlds and activities, a Kindergarten learner should see Kindergarten worlds and activities, and Grade 1 to Grade 3 learners should see their own grade-specific modules. The app owner or administrator can manage curated quiz content and use AI-assisted draft generation as a preparation tool while still maintaining human review before publication.

The learner-side implementation now uses shared grade-scoped content helpers for key personal-app surfaces. These helpers scope visible quiz presets, vocabulary words, dashboard totals, reward summaries, word nudges, Rank statistics, and Challenge timing to the learner's selected grade module. This helps prevent Preschool, Kindergarten, Grade 1, Grade 2, and Grade 3 users from receiving mixed module content in normal learner flows.

### Scope and Limitations of the Study

The scope of this study covers the design and development of the BatiBot mobile learning application and its supporting Firebase-backed services. The system includes email-free learner profile creation, local learner session login, generated local learner profile identity, grade-specific learner module routing, profile settings, reset progress controls, and role-based routing for app-owner administrator accounts.

For personal learner login, the learner's name is treated only as a display label. The system should not use name and grade level as the real account identity because two learners can have the same name and grade. Instead, each local learner profile uses a generated `profileId` as the true identity. The selected grade level controls the curriculum module, while the learner name and buddy/avatar help the child recognize the correct profile. If multiple saved profiles share the same name and grade level, the login screen should ask "Who is playing?" and show profile choices with name, grade, buddy/avatar, and last played date. Learners can also create a new profile with the same display name without overwriting another learner's progress.

For the learner module, the system includes vocabulary browsing, vocabulary detail pages, pronunciation playback, category and subcategory filtering, search, compatible voice search, quiz selection, quiz answering, speech-supported quiz prompts where supported, structured hints, score calculation, progress tracking, reward unlocking, and grade-specific curriculum visibility for Preschool to Grade 3 learners. The quiz module covers preset and curated quizzes across linguistic, numeric, and mixed domains, with activities such as multiple choice, fill-in-the-blank, image choice, true or false, word problems, listening prompts, speaking prompts, matching-type questions, and timed challenges.

For the progress and rewards module, the system tracks experience points, current level, streaks, viewed vocabulary, completed quizzes, quiz scores, mastery indicators, badges, achievements, recent activity, and learning notifications for the local learner profile. Progress should be scoped to the selected learner grade module so Preschool progress does not mix with Grade 1, Grade 2, or Grade 3 curriculum paths unless a future promotion or grade migration feature is intentionally added. Learner quiz attempts may also be recorded in Firestore for app-owner reporting and analytics when authenticated backend flows are available.

For the administrator module, the system includes a secured app-owner dashboard for curated quiz management, AI-assisted draft generation, quiz review checklist validation, quiz publishing workflows, admin activity logs, learner quiz attempt viewing where available, and report generation. Reports include learner progress, curriculum coverage, quiz performance, and admin curation summaries. Admin-side AI draft generation should not communicate with Gemini as a loose prompt-only feature. It should call a BatiBot curriculum API that resolves the selected grade module, learning objective, active learning phase, allowed question types, UI/UX format, answer style, vocabulary source, cognitive level, safety rules, and validation checklist before forwarding a controlled request to Gemini.

The system also includes Firebase security rules for Firestore and Storage. Firestore rules restrict access to user profiles, curated quizzes, admin activity logs, and quiz attempts. Storage rules restrict profile image upload, viewing, and deletion based on user ownership and administrator access. Profile images are limited to supported image types and file size requirements. React Native Reanimated is used to support simple, lightweight animations for key learner interactions such as buttons, cards, progress changes, and result feedback.

### Grade-Specific Learner Module Routing

BatiBot should use the learner's selected grade level as a first-class routing and content filter. The selected grade should determine:

1. The visible Play map and world list.
2. The available vocabulary, quiz presets, and curated quizzes.
3. The expected active learning actions, such as tap, match, count, say, choose, compare, solve, or complete.
4. The reading length, instruction style, hint level, and visual density.
5. The reward, progress, and mastery records shown to the learner.
6. The default curriculum level and unlock requirements.

This separation prevents a Preschool learner from seeing Grade 3 content and prevents upper-grade learners from receiving overly simple activities. The route structure can remain shared, but the data and rendered modules must be filtered by the local learner profile's grade level. If a learner changes grade level in settings, the app should clearly explain whether it is starting a new module path, switching to an existing saved path, or migrating progress.

Current learner-side grade scoping applies to Play, hidden Quiz presets, Vocabulary lookups, Reward progress summaries, Word of Day, floating helper totals, and Rank. Future curated quiz publication and admin preview should use the same grade contract so administrator-published content cannot appear in the wrong learner module.

### BatiBot Curriculum Intelligence API Direction

The implementation now includes a BatiBot Curriculum Intelligence API contract layer as the alignment layer for AI-assisted authoring. This API/service contract is owned by the application and should not be treated as a direct replacement for Gemini or as a plain CRUD API. Its role is to define the BatiBot-specific curriculum structure, active learning behavior, cognitive rules, template rules, validation rules, and learner progression impact that Gemini must follow.

The API should contain or expose:

1. Grade-specific curriculum maps for Preschool, Kindergarten, Grade 1, Grade 2, and Grade 3.
2. Topic objectives, vocabulary sources, numeracy targets, and prerequisite rules.
3. The eight-phase active learning framework: Discover, Explore, Interact, Practice, Challenge, Reward, Progress, and Mastery.
4. UI/UX format rules for each grade, such as maximum instruction length, choice count, image usage, button size expectations, and feedback style.
5. Allowed activity and question formats, such as image choice, matching, counting, listening, speaking, pattern completion, sentence understanding, story comprehension, and word problems.
6. Cognitive-level constraints for each grade so generated drafts match the learner's expected reading, reasoning, and attention level.
7. Content safety rules, including no unsupported new content in Challenge, no adult-facing explanations in child prompts, and no direct publication without admin review.
8. Validation schemas that can reject or flag Gemini output before it becomes an editable admin draft.

The expected workflow is:

```text
Admin selects grade, topic, objective, and activity type
-> BatiBot Curriculum Intelligence API resolves the preset curriculum contract
-> Backend function sends a constrained request to Gemini
-> Gemini returns a draft
-> BatiBot Curriculum Intelligence API validates and normalizes the draft
-> Admin reviews, edits, and publishes
-> Learners see only drafts published for their selected grade module
```

This design keeps BatiBot's curriculum identity inside the application instead of depending only on prompt wording. Gemini becomes a draft assistant, while BatiBot remains the source of truth for curriculum, active learning logic, UI format, learner safety, and publication rules.

The following limitations apply to the current implementation:

1. The system is designed primarily for mobile use. A web build is supported by the technology stack, but the main interface and user experience are mobile-first.

2. AI support is limited to administrator-side quiz draft generation through a secure backend function and BatiBot curriculum API constraints. The system does not yet include a full learner-facing conversational tutor or fully adaptive AI learning path.

3. AI-generated quiz drafts require human review, editing, checklist validation, and administrator publication before learners can access them.

4. Learner hints are structured and context-based rather than fully generative or deeply personalized.

5. Admin access is currently restricted through an approved administrator email and role checks. A broader multi-admin approval and promotion system is not yet implemented.

6. Core learner progress is stored locally for the email-free learner profile through device storage, while Firestore is used for curated quizzes, admin logs, published learning data, profile image references where enabled, and optional quiz attempt analytics. Because learner login is intentionally local and email-free, progress synchronization across multiple devices may be limited unless a future optional sync feature is added.

7. Voice recognition and speech-supported features depend on platform support, device permissions, browser capability, and user settings.

8. Internet access is not required to create a local learner profile, but it is required for Firebase-backed admin authentication, curated quiz retrieval, admin reporting, profile image storage where enabled, and AI-assisted quiz draft generation.

9. The learning content is currently focused on English-language vocabulary, numeracy, and early learning materials aligned with separated Preschool to Grade 3 curriculum modules.

10. The evaluation of the application is limited to the available testing environment, selected users, project timeline, and resources of the development team.
