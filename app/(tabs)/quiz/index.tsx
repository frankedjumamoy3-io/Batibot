import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AnimatedButton } from "@/components/animation/animated-button";
import { AnimatedAchievementCard } from "@/components/animation/animated-achievement-card";
import { AnimatedProgressBar } from "@/components/animation/animated-progress-bar";
import { AnimatedQuizOption } from "@/components/animation/animated-quiz-option";
import { AnimatedRewardChest } from "@/components/animation/animated-reward-chest";
import { useCurrentUserProfile } from "@/src/presentation/hooks/use-current-user-profile";
import {
  XP_REWARDS,
  getCurriculumForGrade,
} from "@/src/data/curriculum/learning-path";
import { type QuizPreset, type QuizQuestion } from "@/src/data/quiz";
import { useGradeQuizzes } from "@/src/presentation/hooks/use-grade-quizzes";
import {
  SIMPLE_COLORS,
  simpleStyles as styles,
} from "@/src/screens/simple/simple-batibot.styles";
import {
  getLevelFromXP,
  getXPForNextLevel,
  getXPInCurrentLevel,
} from "@/src/store/gameStore";
import { useLearnerProgress } from "@/src/presentation/state/learner-progress-provider";
import {
  recordLearnerQuizAttempt,
  type LearnerQuestionResponse,
} from "@/src/services/learnerAnalyticsService";

function normalizeAnswer(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function getCorrectAnswers(question: QuizQuestion) {
  return Array.isArray(question.answer) ? question.answer : [question.answer];
}

function isCorrectAnswer(question: QuizQuestion, answer: string) {
  return getCorrectAnswers(question).some(
    (correctAnswer) => normalizeAnswer(correctAnswer) === normalizeAnswer(answer)
  );
}

function getOptions(question: QuizQuestion) {
  if (question.options?.length) {
    return question.options;
  }

  if (question.wordBank?.length) {
    return question.wordBank;
  }

  if (question.type === "trueFalse") {
    return ["True", "False"];
  }

  return getCorrectAnswers(question);
}

function getFirstName(name?: string | null, email?: string | null) {
  return name?.trim().split(" ")[0] || email?.split("@")[0] || "Learner";
}

function Header() {
  const { profile } = useCurrentUserProfile();
  const { progress } = useLearnerProgress();
  const firstName = getFirstName(profile?.displayName, profile?.email);
  const level = getLevelFromXP(progress.totalXp);
  const xpInLevel = getXPInCurrentLevel(progress.totalXp);
  const xpNeeded = getXPForNextLevel(level);

  return (
    <View style={[styles.header, { paddingTop: 24 }]}>
      <View style={styles.headerBubbleLarge} />
      <View style={styles.headerBubbleSmall} />
      <View style={styles.headerRow}>
        <View style={{ flexDirection: "row", gap: 14, alignItems: "center" }}>
          <View style={styles.profileIcon}>
            <Text style={{ fontSize: 28 }}>🐱</Text>
          </View>
          <View>
            <Text style={styles.subtitle}>Ready to play?</Text>
            <Text style={styles.name}>{firstName}</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={[styles.chip, { backgroundColor: SIMPLE_COLORS.orange }]}>
            <Ionicons name="flame" size={16} color="#FFFFFF" />
            <Text style={styles.chipText}>{progress.streak}</Text>
          </View>
          <View style={[styles.chip, { backgroundColor: SIMPLE_COLORS.yellow }]}>
            <Ionicons name="flash" size={16} color="#FFFFFF" />
            <Text style={styles.chipText}>{progress.totalXp}</Text>
          </View>
        </View>
      </View>
      <View style={styles.progressLine}>
        <Text style={styles.progressText}>Level {level}</Text>
        <Text style={styles.progressText}>{xpInLevel}/{xpNeeded} XP</Text>
      </View>
      <AnimatedProgressBar
        progress={Math.min((xpInLevel / xpNeeded) * 100, 100)}
        trackStyle={styles.progressBar}
        fillStyle={styles.progressFill}
      />
    </View>
  );
}

export default function QuizScreen() {
  const insets = useSafeAreaInsets();
  const { progress, recordQuizCompletion } = useLearnerProgress();
  const { profile } = useCurrentUserProfile();
  const [activeQuiz, setActiveQuiz] = useState<QuizPreset | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [responses, setResponses] = useState<LearnerQuestionResponse[]>([]);
  const [feedback, setFeedback] = useState<{ answer: string; correct: boolean } | null>(null);
  const [finished, setFinished] = useState(false);

  const quizList = useGradeQuizzes(profile?.gradeLevel);
  const dailyQuiz = quizList[0];
  const curriculum = getCurriculumForGrade(profile?.gradeLevel);
  const currentQuestion = activeQuiz?.questions[questionIndex] ?? null;
  const questionTotal = activeQuiz ? (activeQuiz.id.startsWith("curated-") ? activeQuiz.questions.length : Math.min(activeQuiz.questions.length, 5)) : 5;
  const options = currentQuestion ? getOptions(currentQuestion) : [];

  function startQuiz(quiz: QuizPreset) {
    setActiveQuiz(quiz);
    setQuestionIndex(0);
    setScore(0);
    setResponses([]);
    setFeedback(null);
    setFinished(false);
  }

  function closeQuiz() {
    setActiveQuiz(null);
    setQuestionIndex(0);
    setScore(0);
    setResponses([]);
    setFeedback(null);
    setFinished(false);
  }

  function answerQuestion(answer: string) {
    if (!activeQuiz || !currentQuestion || feedback) {
      return;
    }

    const correct = isCorrectAnswer(currentQuestion, answer);
    const nextScore = correct ? score + 1 : score;
    const nextResponses = [
      ...responses,
      {
        answer,
        correct,
        correctAnswer: getCorrectAnswers(currentQuestion)[0] ?? "",
        prompt: currentQuestion.prompt,
        questionId: currentQuestion.id,
      },
    ];

    setFeedback({ answer, correct });
    setScore(nextScore);
    setResponses(nextResponses);

    setTimeout(() => {
      setFeedback(null);

      if (questionIndex + 1 < questionTotal) {
        setQuestionIndex((current) => current + 1);
        return;
      }

      recordQuizCompletion({
        quizId: activeQuiz.id,
        title: activeQuiz.title,
        category: activeQuiz.category,
        curriculumLevel: activeQuiz.curriculumLevel,
        rewardsXp: 50,
        score: nextScore,
        total: questionTotal,
      });
      if (profile) {
        void recordLearnerQuizAttempt({
          activityType: "quiz",
          attempts: 1,
          category: activeQuiz.category,
          completed: true,
          curriculumLevel: activeQuiz.curriculumLevel,
          excludeFromAnalytics: profile.excludeFromAnalytics,
          excludeFromLeaderboard: profile.excludeFromLeaderboard,
          isTestAccount: profile.isTestAccount || progress.isTestAccount,
          learnerEmail: profile.email,
          learnerName: profile.displayName || "Learner",
          learnerUid: profile.uid,
          percentage: questionTotal > 0 ? Math.round((nextScore / questionTotal) * 100) : 0,
          quizId: activeQuiz.id,
          quizTitle: activeQuiz.title,
          responses: nextResponses,
          score: nextScore,
          total: questionTotal,
        }).catch(() => undefined);
      }
      setFinished(true);
    }, 520);
  }

  return (
    <View style={styles.page}>
      <View style={[styles.topInset, { height: insets.top }]} />
      {!activeQuiz ? (
        <ScrollView style={styles.surface} contentContainerStyle={{ paddingBottom: 28 }}>
          <Header />
          <View style={styles.content}>
            <AnimatedButton
              style={styles.challengeCard}
              onPress={() => dailyQuiz ? startQuiz(dailyQuiz) : undefined}
            >
              <Text style={styles.challengeEyebrow}>Play Practice</Text>
              <Text style={styles.challengeTitle}>Practice Time</Text>
              <Text style={styles.challengeSubtitle}>Answer 5 questions from your grade module</Text>
              <View style={styles.pillButton}>
                <Ionicons name="play" size={18} color="#FF6400" />
                <Text style={styles.pillButtonText}>Play Now</Text>
              </View>
            </AnimatedButton>

            <Text style={styles.screenTitle}>Play Worlds</Text>
            <View style={{ gap: 12, marginTop: 18 }}>
              {curriculum.worlds.slice(0, 4).map((world) => (
                <AnimatedAchievementCard
                  key={world.id}
                  icon={world.emoji}
                  title={world.title}
                  description={world.activities.slice(0, 3).join(" • ")}
                />
              ))}
            </View>

            <Text style={[styles.screenTitle, { fontSize: 22 }]}>Grade Practice</Text>
            <View style={{ gap: 16, marginTop: 22 }}>
              {quizList.map((quiz, index) => {
                const completed = progress.completedQuizIds.includes(quiz.id);
                const icon = index % 2 === 0 ? "flash" : "school";

                return (
                  <AnimatedButton
                    key={quiz.id}
                    style={[styles.card, styles.cardRow]}
                    onPress={() => startQuiz(quiz)}
                  >
                    <View
                      style={[
                        styles.iconBox,
                        { backgroundColor: completed ? "#D9FBEA" : SIMPLE_COLORS.purpleLight },
                      ]}
                    >
                      <Ionicons
                        name={icon}
                        size={30}
                        color={completed ? SIMPLE_COLORS.completed : SIMPLE_COLORS.purple}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text numberOfLines={1} style={styles.lessonTitle}>{quiz.title}</Text>
                      <Text style={styles.lessonMeta}>
                        {completed ? "Completed ✅" : `${quiz.questions.length} questions`}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={26} color={SIMPLE_COLORS.purple} />
                  </AnimatedButton>
                );
              })}
            </View>
          </View>
        </ScrollView>
      ) : finished ? (
        <View style={styles.surface}>
          <View style={styles.content}>
            <View style={[styles.card, { padding: 26, marginTop: 28, alignItems: "center" }]}>
              <Text style={{ fontSize: 58 }}>🎉</Text>
              <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Great job!</Text>
              <Text style={[styles.lessonMeta, { textAlign: "center" }]}>
                Score: {score}/{questionTotal}
              </Text>
              <View style={{ alignSelf: "stretch", marginTop: 20 }}>
                <AnimatedRewardChest
                  coins={score * 2}
                  stars={score === questionTotal ? 3 : 1}
                  xp={XP_REWARDS.masterTopic}
                />
              </View>
              <AnimatedButton
                style={[styles.actionButton, { marginTop: 24, alignSelf: "stretch" }]}
                onPress={closeQuiz}
              >
                <Text style={styles.actionButtonText}>Back to Play Practice</Text>
              </AnimatedButton>
            </View>
          </View>
        </View>
      ) : currentQuestion ? (
        <ScrollView style={styles.surface} contentContainerStyle={[styles.content, { paddingTop: 24 }]}>
          <View style={styles.sectionHeader}>
            <AnimatedButton
              style={[styles.profileIcon, { backgroundColor: "#EEF0F5" }]}
              onPress={closeQuiz}
            >
              <Ionicons name="chevron-back" size={24} color={SIMPLE_COLORS.text} />
            </AnimatedButton>
            <Text style={{ color: SIMPLE_COLORS.purple, fontSize: 18, fontWeight: "900" }}>
              {questionIndex + 1}/{questionTotal}
            </Text>
          </View>

          <View style={[styles.card, { padding: 24, marginTop: 24 }]}>
            <Text style={[styles.challengeEyebrow, { color: SIMPLE_COLORS.purple }]}>
              {activeQuiz.title}
            </Text>
            <Text style={[styles.sectionTitle, { marginTop: 12 }]}>
              {currentQuestion.prompt}
            </Text>
          </View>

          <View style={{ gap: 14, marginTop: 20 }}>
            {options.slice(0, 4).map((option) => {
              const optionFeedback =
                feedback?.answer === option
                  ? feedback.correct
                    ? "correct"
                    : "wrong"
                  : "idle";

              return (
                <AnimatedQuizOption
                  key={option}
                  feedback={optionFeedback}
                  style={[
                    styles.card,
                    styles.cardRow,
                    optionFeedback === "correct" && {
                      backgroundColor: "#EAFBF3",
                      borderColor: "#22C55E",
                      borderWidth: 2,
                    },
                    optionFeedback === "wrong" && {
                      backgroundColor: "#FEF2F2",
                      borderColor: "#EF4444",
                      borderWidth: 2,
                    },
                  ]}
                  onPress={() => answerQuestion(option)}
                >
                  <Text style={[styles.lessonTitle, { flex: 1 }]}>{option}</Text>
                </AnimatedQuizOption>
              );
            })}
          </View>
        </ScrollView>
      ) : null}
    </View>
  );
}
