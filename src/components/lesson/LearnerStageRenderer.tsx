import { useMemo, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  type StyleProp,
  View,
  type ViewStyle,
} from "react-native";

import { batibotAssetRegistry } from "@/src/assets/assetRegistry";
import {
  StandardLessonShell,
  type LessonFeedbackType,
  type LessonStageLabel,
  type StandardLessonButtonLabel,
} from "@/src/components/lesson/StandardLessonShell";
import type { StageTemplate, StageType } from "@/src/domain/admin/curriculum-metadata";
import type {
  StageRenderHandlers,
  StageRenderMode,
  StageRuntimeState,
  StageTemplateContent,
} from "@/src/domain/lesson/stage-render";
import {
  adaptLegacyContentToSharedRenderer,
  adaptLegacyTemplateToSharedRenderer,
  type LegacyStageTemplateLike,
} from "@/src/services/admin/legacyStageRendererAdapter";

export type LearnerStagePreviewState = "default" | "correct" | "wrong";

export type LearnerStageRendererProps = {
  accentColor?: string;
  content: StageTemplateContent | unknown;
  contentStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  handlers?: StageRenderHandlers;
  mode?: StageRenderMode;
  onChoiceResult?: (result: {
    choiceId: string;
    choiceLabel: string;
    correct: boolean;
    stageType: StageType;
  }) => void;
  onClose?: () => void;
  onInstructionPress?: () => void;
  onPlaySubmit?: () => void;
  onPrimaryAction?: () => void;
  onTapReveal?: () => void;
  panelStyle?: StyleProp<ViewStyle>;
  previewMode?: boolean;
  previewState?: LearnerStagePreviewState;
  runtime?: StageRuntimeState;
  stageTemplate?: LegacyStageTemplateLike;
  template?: StageTemplate;
};

export function LearnerStageRenderer(props: LearnerStageRendererProps) {
  const {
    accentColor,
    contentStyle,
    containerStyle,
    handlers,
    mode = props.previewMode ? "adminPreview" : "learner",
    onChoiceResult,
    onClose,
    onInstructionPress,
    onPlaySubmit,
    onPrimaryAction,
    onTapReveal,
    panelStyle,
    runtime,
  } = props;
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [tapRevealed, setTapRevealed] = useState(false);
  const [playSubmitted, setPlaySubmitted] = useState(false);
  const template = useMemo(
    () => props.template ?? adaptLegacyTemplateToSharedRenderer(props.stageTemplate ?? {}),
    [props.stageTemplate, props.template]
  );
  const content = useMemo(
    () => props.template
      ? normalizeSharedContent(props.content, template)
      : adaptLegacyContentToSharedRenderer(props.content, template, props.stageTemplate),
    [props.content, props.stageTemplate, props.template, template]
  );
  const feedbackState = runtime?.feedbackState ?? props.previewState ?? "default";
  const correctChoice = content.choices?.find((choice) => isCorrectChoice(choice, content));
  const selectedId = feedbackState === "correct"
    ? correctChoice?.id ?? null
    : feedbackState === "wrong"
      ? content.choices?.find((choice) => choice.id !== correctChoice?.id)?.id ?? null
      : runtime?.selectedChoiceIds?.[0] ?? selectedChoiceId;
  const selectedCorrect = isCorrectChoice(
    content.choices?.find((choice) => choice.id === selectedId),
    content
  );
  const feedback = resolveFeedback({
    content,
    feedbackState,
    playSubmitted: runtime?.submitted ?? playSubmitted,
    selectedId,
    selectedCorrect,
    tapRevealed,
  });
  const actionEnabled = runtime?.primaryActionEnabled ?? getDefaultActionEnabled(
    template.stageType,
    feedbackState,
    selectedId,
    selectedCorrect
  );

  function handleChoice(choiceId: string) {
    const choice = content.choices?.find((item) => item.id === choiceId);
    const correct = isCorrectChoice(choice, content);
    setSelectedChoiceId(choiceId);
    handlers?.onChoicePress?.(choiceId);
    onChoiceResult?.({
      choiceId,
      choiceLabel: choice?.label ?? choiceId,
      correct,
      stageType: template.stageType,
    });
  }

  function handlePrimaryAction() {
    if (template.stageType === "PLAY" && !playSubmitted && !runtime?.submitted) {
      setPlaySubmitted(true);
      handlers?.onSubmit?.();
      onPlaySubmit?.();
      return;
    }
    if (template.stageType === "PLAY") handlers?.onDone?.();
    else handlers?.onNext?.();
    onPrimaryAction?.();
  }

  return (
    <StandardLessonShell
      accentColor={accentColor}
      buttonDisabled={!actionEnabled}
      buttonLabel={getButtonLabel(template.stageType)}
      contentScrollable={template.mobileLayoutRules.contentScrollable}
      contentStyle={contentStyle}
      containerStyle={containerStyle}
      feedbackMessage={runtime?.feedbackMessage ?? feedback.message}
      feedbackType={feedback.type}
      instruction={content.instruction || " "}
      instructionNumberOfLines={template.mobileLayoutRules.maxInstructionLines}
      onClose={onClose ?? noop}
      onInstructionPress={onInstructionPress}
      onPrimaryAction={handlePrimaryAction}
      panelStyle={panelStyle}
      progressIndex={template.stageIndex}
      showInstructionIcon={false}
      stageLabel={template.stageType as LessonStageLabel}
      totalStages={template.totalStages}
    >
      <StageBody
        content={content}
        mode={mode}
        onChoicePress={handleChoice}
        onTapReveal={() => {
          setTapRevealed(true);
          onTapReveal?.();
        }}
        selectedChoiceId={selectedId}
        tapRevealed={tapRevealed}
        template={template}
      />
    </StandardLessonShell>
  );
}

function StageBody({ content, mode, onChoicePress, onTapReveal, selectedChoiceId, tapRevealed, template }: {
  content: StageTemplateContent;
  mode: StageRenderMode;
  onChoicePress: (choiceId: string) => void;
  onTapReveal: () => void;
  selectedChoiceId: string | null;
  tapRevealed: boolean;
  template: StageTemplate;
}) {
  if (template.stageType === "TRY" || template.stageType === "CHOOSE") {
    return (
      <View style={styles.stack}>
        <ReadableCard text={content.passage || content.body} />
        {content.question ? <View style={styles.questionCard}><Text style={styles.questionText}>{content.question}</Text></View> : null}
        <ChoiceCards choices={content.choices ?? []} onChoicePress={onChoicePress} selectedChoiceId={selectedChoiceId} />
      </View>
    );
  }

  if (template.stageType === "PLAY") {
    return (
      <View style={styles.stack}>
        <ReadableCard text={content.passage || content.body || content.activityPrompt} />
        <ActivityPreview content={content} onChoicePress={onChoicePress} />
      </View>
    );
  }

  if (template.stageType === "TAP") {
    return (
      <Pressable onPress={onTapReveal} style={styles.contentCard}>
        <AssetPreview content={content} />
        <Text style={styles.title}>{content.title || content.word || content.example || "Tap to learn"}</Text>
        <Text style={styles.body}>{tapRevealed ? content.meaning || content.body || content.example : "Tap the card to reveal the meaning."}</Text>
      </Pressable>
    );
  }

  const missingAssets = template.assetSlotRules.filter((rule) =>
    rule.required && (content.assets ?? []).filter((asset) => asset.role === rule.role).length < rule.minCount
  );

  return (
    <View style={styles.contentCard}>
      <AssetPreview content={content} />
      {mode === "adminPreview" && missingAssets.length ? (
        <Text style={styles.assetWarning}>Required asset: {missingAssets.map((rule) => rule.role).join(", ")}</Text>
      ) : null}
      <Text style={styles.title}>{content.title || content.word || (template.stageType === "REWARD" ? "Lesson Complete!" : "Topic")}</Text>
      <Text style={styles.body}>{content.body || content.meaning || content.example || "Add learner-facing content."}</Text>
    </View>
  );
}

function ChoiceCards({ choices, onChoicePress, selectedChoiceId }: {
  choices: NonNullable<StageTemplateContent["choices"]>;
  onChoicePress: (choiceId: string) => void;
  selectedChoiceId: string | null;
}) {
  const singleColumn = choices.some((choice) => choice.label.length > 22);
  if (!choices.length) return <Text style={styles.emptyText}>Add valid choices to preview this stage.</Text>;
  return (
    <View style={[styles.choiceGrid, singleColumn && styles.choiceGridSingle]}>
      {choices.map((choice) => (
        <Pressable
          key={choice.id}
          onPress={() => onChoicePress(choice.id)}
          style={[styles.choiceCard, singleColumn && styles.choiceCardFull, selectedChoiceId === choice.id && styles.choiceCardSelected]}
        >
          <Text numberOfLines={3} style={styles.choiceText}>{choice.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function ActivityPreview({ content, onChoicePress }: { content: StageTemplateContent; onChoicePress: (id: string) => void }) {
  const items = Array.isArray(content.activityData) ? content.activityData.map(asRecord).slice(0, 3) : [];
  if (items.length) {
    return <View style={styles.matchBoard}>{["left", "right"].map((side) => <View key={side} style={styles.matchColumn}>{items.map((item, index) => <Text key={`${side}-${index}`} style={styles.matchCard}>{String(item[side] ?? item[side === "left" ? "source" : "target"] ?? item.label ?? `Item ${index + 1}`)}</Text>)}</View>)}</View>;
  }
  return <ChoiceCards choices={content.choices ?? []} onChoicePress={onChoicePress} selectedChoiceId={null} />;
}

function ReadableCard({ text }: { text?: string }) {
  if (!text) return null;
  return <ScrollView contentContainerStyle={styles.readingCardContent} style={styles.readingCard}><Text style={styles.readingText}>{text}</Text></ScrollView>;
}

function AssetPreview({ content }: { content: StageTemplateContent }) {
  const asset = content.assets?.find((item) => item.type === "image");
  const registryAsset = asset?.assetId ? batibotAssetRegistry[asset.assetId] : null;
  const source = asset?.uri ? { uri: asset.uri } : registryAsset?.source;
  if (!source) return null;
  return <Image accessibilityLabel={registryAsset?.label ?? content.title ?? "Lesson asset"} resizeMode="contain" source={source} style={styles.assetImage} />;
}

function normalizeSharedContent(value: unknown, template: StageTemplate): StageTemplateContent {
  const content = asRecord(value);
  return {
    activityData: content.activityData,
    activityPrompt: stringValue(content.activityPrompt),
    activityType: stringValue(content.activityType),
    assets: normalizeAssets(content.assets ?? content.assetRefs),
    body: stringValue(content.body),
    choices: normalizeChoices(content.choices),
    correctAnswerIds: normalizeStringArray(content.correctAnswerIds ?? content.correctAnswer),
    example: stringValue(content.example),
    feedbackCorrect: stringValue(content.feedbackCorrect) || template.feedbackRules.defaultCorrectText || "Great!",
    feedbackIncorrect: stringValue(content.feedbackIncorrect) || template.feedbackRules.defaultIncorrectText || "Try Again.",
    instruction: stringValue(content.instruction),
    meaning: stringValue(content.meaning),
    passage: stringValue(content.passage),
    pronunciationText: stringValue(content.pronunciationText ?? content.pronunciation),
    question: stringValue(content.question),
    stageType: template.stageType,
    title: stringValue(content.title),
    word: stringValue(content.word),
  };
}

function normalizeAssets(value: unknown): StageTemplateContent["assets"] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const asset = asRecord(item);
    const assetId = stringValue(asset.assetId ?? asset.id).trim();
    const type = stringValue(asset.type) || "image";
    if (!assetId || !["image", "audio", "background", "icon"].includes(type)) return [];
    return [{ assetId, role: stringValue(asset.role) || "primaryVisual", type: type as "image" | "audio" | "background" | "icon", uri: stringValue(asset.uri) || undefined }];
  });
}

function normalizeChoices(value: unknown): StageTemplateContent["choices"] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item, index) => {
    const choice = asRecord(item);
    const label = stringValue(choice.label ?? choice.text).trim();
    if (!label || /^choice\s+[a-d]$/i.test(label)) return [];
    return [{ assetRef: stringValue(choice.assetRef) || undefined, id: stringValue(choice.id) || `choice-${index + 1}`, isCorrect: choice.isCorrect === true || choice.correct === true, label }];
  });
}

function isCorrectChoice(choice: NonNullable<StageTemplateContent["choices"]>[number] | undefined, content: StageTemplateContent) {
  if (!choice) return false;
  return choice.isCorrect === true || Boolean(content.correctAnswerIds?.includes(choice.id) || content.correctAnswerIds?.includes(choice.label));
}

function resolveFeedback(input: { content: StageTemplateContent; feedbackState: LearnerStagePreviewState; playSubmitted: boolean; selectedCorrect: boolean; selectedId: string | null; tapRevealed: boolean }): { message: string; type: LessonFeedbackType | null } {
  if (input.feedbackState === "correct") return { message: input.content.feedbackCorrect ?? "Great!", type: "success" };
  if (input.feedbackState === "wrong") return { message: input.content.feedbackIncorrect ?? "Try Again.", type: "wrong" };
  if (input.selectedId) return input.selectedCorrect ? { message: input.content.feedbackCorrect ?? "Great!", type: "success" } : { message: input.content.feedbackIncorrect ?? "Try Again.", type: "wrong" };
  if (input.tapRevealed || input.playSubmitted) return { message: input.content.feedbackCorrect ?? "Great!", type: "success" };
  return { message: "", type: null };
}

function getDefaultActionEnabled(stageType: StageType, state: LearnerStagePreviewState, selectedId: string | null, selectedCorrect: boolean) {
  if (state === "wrong") return false;
  if (state === "correct") return true;
  if (stageType === "TRY" || stageType === "CHOOSE") return Boolean(selectedId && selectedCorrect);
  return true;
}

function getButtonLabel(stageType: StageType): StandardLessonButtonLabel {
  if (stageType === "PLAY") return "Done";
  if (stageType === "REWARD") return "Reward";
  return "Next";
}

function normalizeStringArray(value: unknown) { return typeof value === "string" ? [value] : Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []; }
function asRecord(value: unknown): Record<string, unknown> { return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {}; }
function stringValue(value: unknown) { return typeof value === "string" ? value : ""; }
function noop() {}

const styles = StyleSheet.create({
  assetImage: { height: 96, width: 128 },
  assetWarning: { color: "#B45309", fontSize: 12, fontWeight: "800", textAlign: "center" },
  body: { color: "#334155", fontSize: 15, fontWeight: "700", lineHeight: 22, textAlign: "center" },
  choiceCard: { alignItems: "center", backgroundColor: "#FFFFFF", borderColor: "#8B5CF6", borderRadius: 14, borderWidth: 2, flexBasis: "47%", justifyContent: "center", minHeight: 64, padding: 10 },
  choiceCardFull: { flexBasis: "100%", minHeight: 74 },
  choiceCardSelected: { backgroundColor: "#EDE9FE", borderColor: "#16A34A" },
  choiceGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "center", width: "100%" },
  choiceGridSingle: { flexDirection: "column" },
  choiceText: { color: "#4C1D95", fontSize: 14, fontWeight: "900", lineHeight: 18, textAlign: "center" },
  contentCard: { alignItems: "center", backgroundColor: "#FFFFFF", borderColor: "#8B5CF6", borderRadius: 16, borderWidth: 2, gap: 10, justifyContent: "center", minHeight: 170, padding: 16, width: "100%" },
  emptyText: { color: "#64748B", fontSize: 13, fontWeight: "800", textAlign: "center" },
  matchBoard: { flexDirection: "row", gap: 10, width: "100%" },
  matchCard: { backgroundColor: "#FFFFFF", borderColor: "#16A34A", borderRadius: 10, borderWidth: 1, color: "#4C1D95", fontSize: 12, fontWeight: "900", minHeight: 42, padding: 8, textAlign: "center" },
  matchColumn: { flex: 1, gap: 8 },
  questionCard: { backgroundColor: "#FFF7ED", borderColor: "#FDBA74", borderRadius: 12, borderWidth: 1, padding: 10, width: "100%" },
  questionText: { color: "#111827", fontSize: 14, fontWeight: "900", lineHeight: 18, textAlign: "center" },
  readingCard: { backgroundColor: "#FFFFFF", borderColor: "#8B5CF6", borderRadius: 14, borderWidth: 2, maxHeight: 116, width: "100%" },
  readingCardContent: { padding: 12 },
  readingText: { color: "#1F2937", fontSize: 14, fontWeight: "800", lineHeight: 20, textAlign: "center" },
  stack: { alignItems: "center", gap: 10, justifyContent: "center", width: "100%" },
  title: { color: "#6D28D9", fontSize: 22, fontWeight: "900", textAlign: "center" },
});
