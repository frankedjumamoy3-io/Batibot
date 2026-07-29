# Chapter I - Introduction

This is the official Chapter I documentation source for BatiBot. System design, README summaries, admin workflow notes, and implementation checks should stay aligned to this chapter.

## Project Context

Nowadays, digital technologies have become valuable tools in supporting the learning needs of young learners. Mobile learning applications provide opportunities for children to learn through pictures, sounds, interactive activities, and game-based experiences. In the Preschool to Grade 3 levels, vocabulary and numeracy skills serve as important foundations for communication, reading, critical thinking, and problem-solving. Since young learners often learn best through active participation, immediate feedback, and continuous motivation, a gamified mobile learning application can help make learning more engaging, enjoyable, and meaningful.

However, maintaining learner engagement and monitoring individual progress remain challenges in traditional learning environments. Learning materials such as worksheets, flashcards, and classroom activities are useful, but they may not always provide personalized progression, immediate feedback, or detailed progress monitoring. Furthermore, learners from different curriculum levels have different developmental needs. Preschool learners require highly visual and recognition-based activities, while Kindergarten and Grade 1 to Grade 3 learners require progressively more advanced vocabulary, reading, comprehension, and numeracy activities. Providing curriculum-aligned content that is appropriate for each learner level can therefore be challenging for content administrators.

To address these concerns, this project proposes BatiBot: A Gamified Mobile Application for Primary Vocabulary and Numeracy, Progress Tracking and AI-Assisted Content Curation. The application provides curriculum-specific learning experiences aligned with foundational literacy and numeracy competencies for Preschool, Kindergarten, Grade 1, Grade 2, and Grade 3 learners. The Preschool content is based on foundational early childhood learning competencies that support Kindergarten readiness, while the Kindergarten to Grade 3 content is aligned with the foundational literacy and numeracy competencies of the MATATAG Curriculum. Upon login, learners are presented only with learning worlds, topics, activities, and assessments appropriate to their assigned curriculum level. The system implements an Active Learning Framework composed of Discover, Explore, Interact, Practice, Challenge, Reward, Progress, and Mastery stages, where each topic follows a structured one-node-per-stage progression. The application also includes Play, Rank, and Reward features, learner progress tracking, gamification systems, administrator monitoring, and an AI-assisted content curation workflow that supports the creation and management of curriculum-aligned learning content.

## Objectives Of The Study

The main goal of this study is to design and develop BatiBot: A Gamified Mobile Application for Primary Vocabulary and Numeracy, Progress Tracking and AI-Assisted Content Curation that provides curriculum-specific learning experiences for Preschool, Kindergarten, Grade 1, Grade 2, and Grade 3 learners.

Specifically, the project aims to achieve the following objectives:

1. To design and develop a mobile learning application that provides curriculum-specific vocabulary and numeracy learning content, activities, assessments, rewards, and progress tracking for Preschool, Kindergarten, Grade 1, Grade 2, and Grade 3 learners.

2. To implement interactive learning and assessment features that:
   - Utilize the Discover, Explore, Interact, Practice, Challenge, Reward, Progress, and Mastery active learning framework.
   - Provide age-appropriate vocabulary and numeracy learning activities and assessments aligned with foundational literacy and numeracy competencies and learner developmental needs.
   - Deliver immediate feedback and mastery-based progression through a one-node-per-stage learning structure.

3. To develop additional system features that:
   - Provide learner progress tracking and mastery monitoring.
   - Implement gamification features including stars, XP, levels, streaks, badges, achievements, rewards, rankings, notifications, and unlockable content.
   - Support AI-assisted content curation through a curriculum intelligence layer integrated with the Gemini API to assist administrators in generating, validating, reviewing, and publishing curriculum-aligned content.

4. To evaluate the developed application in terms of:
   - Functionality of learning modules, activities, assessments, progress tracking, ranking, rewards, and administrator features.
   - Usability and suitability for Preschool, Kindergarten, Grade 1, Grade 2, and Grade 3 learners.
   - Learner engagement and effectiveness of the active learning framework.
   - Reliability of content management and data security.

## Purpose And Description

The application is designed to provide a curriculum-specific mobile learning environment that supports Preschool, Kindergarten, Grade 1, Grade 2, and Grade 3 learners in developing foundational vocabulary and numeracy skills through active learning experiences. The learning content is organized according to learner level and aligned with foundational literacy and numeracy competencies appropriate to each stage of development. Upon login, learners are assigned to their respective curriculum level and are presented with appropriate learning worlds, topics, activities, and assessments. Learning is organized through the Discover, Explore, Interact, Practice, Challenge, Reward, Progress, and Mastery framework, where each stage is represented by a single learning node that guides learners through a structured progression path.

The application includes a Play section that contains the Active Learning Framework, a Rank section that displays learner rankings based on accumulated stars earned through completed topics, and a Reward section that displays badges, progress badges, achievements, and learner accomplishments. The system also provides administrators with tools to create, review, organize, validate, publish, and monitor learning content and activities. AI assistance is utilized through a curriculum intelligence layer integrated with the Gemini API. However, all AI-generated content must undergo administrator review, validation, and approval before publication. Through these features, the system aims to provide a child-friendly, engaging, curriculum-aligned, and organized learning environment that supports learner development and effective content management.

Once implemented, the BatiBot Learning Application will benefit the following:

- Preschool Learners, Kindergarten Learners, Grade 1 Learners, Grade 2 Learners, and Grade 3 Learners. They can develop vocabulary and numeracy skills through curriculum-specific learning worlds, active learning activities, assessments, rewards, rankings, achievements, and progress tracking aligned with their assigned curriculum level.
- Administrators. They can efficiently manage, monitor, review, validate, organize, and publish curriculum-aligned learning content and activities while utilizing AI-assisted content curation to improve content preparation and management.
- Researchers. The proponents will gain knowledge and experience in mobile application development, educational technology, artificial intelligence integration, database management, curriculum-based system design, and user-centered application development.
- Future Researchers. This study may serve as a reference for future research involving gamified learning systems, active learning frameworks, curriculum-specific educational applications, learner progression systems, and AI-assisted educational content curation.

## Scope And Limitations Of The Study

The scope of this project covers the design and development of BatiBot as a mobile learning application that provides curriculum-specific vocabulary and numeracy learning experiences for Preschool, Kindergarten, Grade 1, Grade 2, and Grade 3 learners. The system supports active learning, gamification, progress tracking, learner rankings, rewards, administrator monitoring, and AI-assisted content curation to support curriculum-aligned learning and content management.

Specifically, the scope of the project includes the following:

- Curriculum-specific learner profiles that provide learning content, activities, and assessments appropriate to Preschool, Kindergarten, Grade 1, Grade 2, and Grade 3 learners.
- Learning worlds and topics focused on foundational vocabulary and numeracy competencies. Preschool content is based on early childhood learning competencies and Kindergarten readiness skills, while Kindergarten to Grade 3 content is aligned with foundational literacy and numeracy competencies appropriate to the learners' curriculum level.
- Active learning implementation through the Discover, Explore, Interact, Practice, Challenge, Reward, Progress, and Mastery framework using a one-node-per-stage progression structure.
- Play, Rank, and Reward features that support learning activities, learner rankings based on earned stars, badges, achievements, rewards, and learner progression.
- Learner progress tracking and gamification features including stars, XP, levels, streaks, badges, achievements, notifications, and unlockable learning content.
- Administrator content management and monitoring features for creating, reviewing, validating, publishing, and monitoring curriculum-aligned learning content and learner progress.
- AI-assisted content curation through a curriculum intelligence layer and Gemini API integration that supports draft generation, validation, administrator review, and content publishing workflows.

The study is limited to the following:

- The application is designed primarily for mobile devices and requires internet connectivity for Firebase and AI-assisted content curation services.
- The learning content is limited to selected foundational vocabulary and numeracy competencies for Preschool, Kindergarten, Grade 1, Grade 2, and Grade 3 learners and does not cover all learning areas of the basic education curriculum.
- AI assistance is limited to administrator-side content generation and curation. All AI-generated content requires administrator review, validation, and approval before publication.
- The effectiveness and evaluation of the system are limited to the available users, devices, testing environment, development period, and resources of the project team.

## System Alignment Checkpoints

The implementation should be reviewed against these official Chapter I checkpoints:

1. Learners are assigned to Preschool, Kindergarten, Grade 1, Grade 2, or Grade 3 and only see learning worlds, topics, activities, and assessments appropriate to that level.
2. The learner app exposes Play, Rank, and Reward as the main child-facing sections.
3. Play implements Discover, Explore, Interact, Practice, Challenge, Reward, Progress, and Mastery as the standard topic rhythm.
4. Each topic follows one node per stage unless a later approved design revision changes the progression model.
5. Progress tracking includes XP, stars, levels, streaks, badges, achievements, notifications, unlocks, and mastery state where applicable.
6. Admin tools can create, review, organize, validate, publish, and monitor curriculum-aligned content.
7. AI-generated content is generated through a BatiBot curriculum intelligence layer, sent to Gemini only as a constrained draft request, validated by BatiBot, reviewed by an admin, and only then published.
8. System evaluation should cover functionality, usability, learner suitability, active-learning engagement, content-management reliability, and data security.
