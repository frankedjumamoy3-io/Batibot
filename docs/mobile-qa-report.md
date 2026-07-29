# BatiBot Mobile QA and Accessibility Report

Status: Partially Implemented
Date: 2026-06-21

## Scope

This checklist covers the learner-side Play, Rank, and Reward surfaces after the curriculum renderer upgrade. It is intended for small Android, medium Android, large Android, and tablet verification.

## Device Acceptance Checklist

| Device class | Required checks | Status |
| --- | --- | --- |
| Small Android | Lesson card content fits; bottom tabs do not block Next; Grade 3 evidence cards remain readable; Rank empty state fits. | Pending real-device QA |
| Medium Android | Choice buttons stay at least 44px; renderer model rows wrap without overlap; Reward cards fit. | Pending real-device QA |
| Large Android | Play map nodes, lesson stages, Rank rows, and Reward badges scale without excessive whitespace. | Pending real-device QA |
| Tablet | Lesson cards remain centered; long passages scroll inside the screen; tap targets remain large. | Pending real-device QA |

## Renderer Acceptance Tests

- Grade 1 Sentence Builder: shows sentence strip, missing word choices, and feedback.
- Grade 1 Word Category Sorter: shows noun, verb, adjective bins with color cues.
- Grade 1 Mini Story: shows short evidence sentences and who/did what/where prompts.
- Grade 1 Number Line: shows ordered tick marks and missing-number prompt.
- Grade 1 Add/Take-Away Counter: shows grouped counters and number sentence.
- Grade 1 Shape Property: shows property bins for sides, corners, and round shapes.
- Grade 1 Time: shows clock/routine model and time-of-day choices.
- Grade 2 Vocabulary Relationship: shows same/opposite bins and context prompt.
- Grade 2 Passage Evidence: shows evidence sentences before answer choices.
- Grade 2 Community Scenario Map: shows place/helper/action model.
- Grade 2 Place Value: shows hundreds, tens, ones columns.
- Grade 2 Problem Workspace: shows operation steps and final answer choices.
- Grade 2 Measurement Tool: shows measurement model tokens before choices.
- Grade 2 Multiplication: shows equal groups/repeated addition.
- Grade 2 Challenge Arena: uses mixed multi-step workspace, not pure multiple choice.
- Grade 3 Context/Passage/Story: shows evidence or story-map model before choices.
- Grade 3 Multi-Step: shows step tracker and carries Step 1 into Step 2.
- Grade 3 Multiplication/Division/Fraction/Money: shows arrays/groups, sharing, partitions, and money tokens.

## Accessibility Checklist

- Preschool and Kindergarten instruction rows include audio speaker controls.
- Icon-only controls must keep accessibility labels.
- Repeated touch targets should remain at least 44px tall or wide.
- Long Grade 3 text must be scrollable and not hidden behind bottom tabs.
- Reduced-motion handling remains a recommended next phase for animated lesson effects.
- Non-reader flows remain testable through audio support in Preschool and Kindergarten.

## Known Gaps

- Physical-device QA has not been completed in this report.
- Dedicated Grade 1-3 topic-level art files are not present in the asset pack; the app maps topics to the closest instructional world/task art.
- Drag-and-drop is represented with tap-to-place interactions in the current mobile-safe renderer; full drag physics is a recommended next phase.
