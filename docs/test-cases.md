# BatiBot Test Cases

## Learner Profile

1. Create a Preschool learner profile.
2. Create a Kindergarten learner profile with the same display name.
3. Confirm both profiles have separate local profile IDs.
4. Confirm the "Who is playing?" picker appears when same name and grade profiles exist.

Expected result: progress does not overwrite between profiles.

## Grade Scoping

1. Log in as Preschool.
2. Confirm Play shows Preschool worlds.
3. Log in as Kindergarten.
4. Confirm Play shows Kindergarten worlds.
5. Open Rank and Reward for each profile.

Expected result: worlds, words, quizzes, rewards, and progress stay grade-scoped.

## Kindergarten Curriculum

1. Open Alphabet Island.
2. Open Letter A.
3. Confirm audio/oral copy says A sound and A for Apple.
4. Open Number Forest.
5. Confirm numbers 11 to 20 use count, order, before/after, and matching logic.
6. Open Pattern Valley.
7. Confirm prompts use "What comes next?" and simple AB/AAB patterns.

Expected result: prompts are short, visible, and do not overlap controls.

## Play Active Learning Framework

For one topic in each grade:

1. Open Discover.
2. Continue through Explore, Interact, Practice, Challenge, Reward, Progress, and Mastery.
3. Confirm there is one node per stage.
4. Confirm Challenge does not introduce new content.

Expected result: all stages render and save progress.

## Admin Draft And Publish

1. Open admin Draft Studio.
2. Select Grade, World, Topic, Phase, Node, Asset, and XP.
3. Generate draft.
4. Save as draft.
5. Open Mobile Play Preview.
6. Send to Review.
7. Publish.

Expected result: publish is blocked until Play mapping and mobile preview are complete.

## Curated Learner Visibility

1. Publish curated content for Kindergarten > Alphabet Island > Letter A > Practice.
2. Log in as Kindergarten.
3. Confirm the item is available only for that matching Play placement.
4. Log in as Preschool.
5. Confirm the item is not visible.

Expected result: curated content is scoped by grade, world, topic, and phase.

## Security

1. Attempt to open admin as a learner.
2. Attempt to call Gemini draft generation without admin.
3. Attempt to publish without admin.

Expected result: access is blocked.
