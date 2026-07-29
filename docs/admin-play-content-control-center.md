# Admin Dashboard Structure

## Source Of Truth

The learner app is now organized around `Rank`, `Play`, and `Reward`.
Admin must therefore manage child-facing content as Play-map content, not as a standalone quiz system.

The official admin purpose is:

`Curriculum Content -> AI Drafts -> Validation -> Review -> Publishing -> Monitoring`

The official admin generation path is:

`Admin -> BatiBot Curriculum Intelligence API -> Gemini -> Validator -> Review -> Published`

Gemini is a helper inside BatiBot's curriculum system. It is not the source of truth.

The full prompt modules are documented in `docs/admin-ai-prompt-system.md`.

## BatiBot Curriculum Intelligence API

The API contract must contain:

- `gradeLevel`
- `worldId`
- `topicId`
- `phase`
- `node`
- `assetId`
- active learning phase rules
- child action
- mobile UI contract
- allowed vocabulary
- asset requirement
- reward and XP mapping
- publish validation gates

The contract is built in `src/services/curriculumDraftApi.ts`.

Shared active-learning rules live in `src/domain/rules/gemini-draft-rules.ts`.

Publish validation lives in `src/domain/rules/admin-publish-rules.ts`.

## Admin Navigation

The admin shell uses:

- `Dashboard`
- `Curriculum`
- `World Manager`
- `Topic Manager`
- `Stage Manager`
- `AI Draft Studio`
- `Review Queue`
- `Mobile Preview Testing`
- `Published Content`
- `Learner Monitoring`
- `Reports`
- `Admin Logs`
- `Settings`

The current shell uses a purple BatiBot side rail, active pill navigation, admin handle, top bar, metrics cards, workflow pipeline, priority queue, and recent activity.

Shared TypeScript contracts live in `src/domain/rules/admin-ecosystem.ts`.

## Admin Workflow

```text
Admin Login
-> Dashboard
-> Select Level
-> Select World
-> Select Topic
-> Create / Generate Draft
-> AI Context Engine
-> Gemini API
-> Draft Validation
-> Admin Review
-> Approve / Revise / Reject
-> Publish
-> Monitor Usage
```

## Admin Data Structure

```ts
type AdminContentFlow = {
  level: "preschool" | "kindergarten" | "grade1" | "grade2" | "grade3";
  worldId: string;
  topicId: string;
  stage:
    | "discover"
    | "explore"
    | "interact"
    | "practice"
    | "challenge"
    | "reward"
    | "progress"
    | "mastery";
  status:
    | "draft"
    | "for_review"
    | "needs_fix"
    | "approved"
    | "rejected"
    | "published"
    | "archived";
  source: "manual" | "ai_generated";
  reviewedBy?: string;
  publishedAt?: string;
};
```

## Page Responsibilities

### Dashboard

Shows:

- Total learners
- Active learners
- Published content
- Drafts
- Drafts for review
- Needs fix
- Worlds
- Topics
- AI generated content
- Recent activity
- Quick actions
- Preschool learners
- Kindergarten learners
- Grade 1 learners
- Grade 2 learners
- Grade 3 learners
- Top performing worlds
- Lowest completion worlds
- Leaderboard snapshot

### Curriculum

Admin manages the fixed curriculum structure:

- Preschool
- Kindergarten
- Grade 1
- Grade 2
- Grade 3

Inside each level:

`Worlds -> Topics -> Discover / Explore / Interact / Practice / Challenge / Reward / Progress / Mastery`

### World Manager

Admin can:

- Create world
- Edit world
- Archive world
- Publish world

World fields:

- World name
- Level
- Description
- Emoji
- Icon
- Theme
- Background
- Badge
- Difficulty
- Unlock rule
- Order
- Status
- Metadata

### Topic Manager

Admin can:

- Create topic
- Edit topic
- Archive topic
- Publish topic
- Duplicate topic
- Reorder topic

Topic fields:

- Topic name
- Objective
- Category
- Difficulty
- Image prompt
- Audio prompt
- Unlock rules
- XP reward
- Star reward
- Status

### Stage Manager

Each topic contains exactly one node for each stage:

- Discover
- Explore
- Interact
- Practice
- Challenge
- Reward
- Progress
- Mastery

Stage fields:

- Title
- Instruction
- Activity type
- Choices
- Answers
- Image
- Audio
- Animations
- Feedback
- XP
- Stars
- Validation status

### AI Draft Studio

Generates draft content from:

- Level
- World
- Topic
- Stage
- Activity type

AI context includes:

- Level
- World
- Topic
- Stage
- Framework rules
- Cognitive rules
- UI rules
- Gamification rules
- Validation rules

### Review Queue

Admin checks generated and manual content.

Statuses:

- Draft
- For review
- Needs fix
- Approved
- Rejected
- Published

Actions:

- Edit
- Validate
- Approve
- Reject
- Publish

### Mobile Preview Testing

Every topic must pass mobile testing before publishing.

Simulates:

- Android
- iPhone
- Tablet

Preview stages:

- Discover
- Explore
- Interact
- Practice
- Challenge
- Reward
- Progress
- Mastery

Validation checklist:

- Text overflow
- Missing images
- Missing audio
- Button size
- Touch targets
- Animation issues
- Layout issues
- Challenge logic
- Reward logic
- Unlock logic

Publishing is blocked when preview fails.

### Published Content

Shows live learner content with filters:

- Level
- World
- Topic
- Stage
- Status

### Learner Monitoring

Tracks:

- User / learner name
- Level
- World
- Topic
- Completed topics
- Stars
- XP
- Badges
- Achievements
- Mastery
- Completion
- Streak
- Last active
- Progress percentage

### Reports

Shows:

- Completion rates
- Drop-off rates
- Most difficult topics
- Most completed topics
- World popularity
- Stage performance
- Challenge success rate
- Badge distribution
- Leaderboard analytics

### Admin Logs

Tracks:

- Created world
- Created topic
- Edited topic
- Generated draft
- Edited content
- Published content
- Archived content
- Deleted content
- Review actions

### Settings

Controls:

- XP rules
- Star rules
- Badge rules
- Achievement rules
- Unlock rules
- AI prompt rules
- Validation rules
- Theme rules
- Curriculum metadata

## AI Draft Studio

AI Draft Studio must ask for:

- Grade
- World
- Topic
- Phase
- Node
- Asset id
- Skill action
- Vocabulary source
- Reward mapping
- XP impact

Generated drafts must enter review. They must never publish directly.

## Phase Rules

- `Discover`: introduce only the current word, concept, number, group, or pattern.
- `Explore`: observe known content with gentle support.
- `Interact`: guided mini-action.
- `Practice`: repeat known content with support.
- `Challenge`: check known content with less guidance and no new content.
- `Reward`: celebrate completion.
- `Progress`: show saved learner progress.
- `Mastery`: confirm mastery and next unlock.

## Publish Gates

Publishing should block or warn when:

- grade/world/topic/phase is missing
- image content lacks an approved asset id
- Practice does not repeat known content
- Challenge introduces new content
- mobile preview has not been checked
- reward mapping is missing
- XP is outside the expected phase range

## Learner Preview

Preview should show:

- `Play > World > Topic > Phase`
- world/topic visual context
- phase badge
- child-facing action copy
- large mobile choices or match tiles
- audio/speech controls when needed
- reward and Rank impact

## Security

- Admin stays behind Firebase Auth.
- Only approved admin emails receive admin role.
- Gemini/API calls stay behind the secure function layer.
- No passwords, tokens, API keys, or Gemini secrets are stored in client screens.
