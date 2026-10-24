import { useEffect, useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { router } from "expo-router";

import {
  AdminButton,
  AdminCard,
  AdminSectionHeader,
  AdminShell,
  AdminStatusBadge,
  adminStyles,
  mergeAdminStyles,
} from "@/src/components/admin/AdminShell";
import {
  ADMIN_REQUIRED_STAGES,
  getAdminCurriculumMetadata,
  getCurriculumMetadataForContentDraft,
  type CurriculumContentMetadata,
  type LessonStageType,
} from "@/src/services/admin/batibotCurriculumApi";
import {
  generateAdminContentDraft,
  type ContentDraftKind,
} from "@/src/services/admin/adminContentDraftService";
import { useCurrentUserProfile } from "@/src/presentation/hooks/use-current-user-profile";

const CONTENT_KIND_OPTIONS: ContentDraftKind[] = [
  "meaning",
  "example",
  "instruction",
  "activity",
  "question",
  "readingPassage",
  "story",
  "assessment",
  "playActivity",
];

const STAGE_OPTIONS: Exclude<LessonStageType, "PROGRESS" | "MASTERY">[] = [
  "LOOK",
  "TAP",
  "TRY",
  "CHOOSE",
  "PLAY",
  "REWARD",
];

export default function AdminCreateDraftScreen() {
  const { profile, user } = useCurrentUserProfile();
  const curriculumMetadata = useMemo(() => getAdminCurriculumMetadata(), []);
  const [gradeLevel, setGradeLevel] = useState<string>(curriculumMetadata[0]?.gradeLevel ?? "Grade 1");
  const worlds = useMemo(
    () => curriculumMetadata.find((grade) => grade.gradeLevel === gradeLevel)?.worlds ?? [],
    [gradeLevel, curriculumMetadata]
  );
  const [worldId, setWorldId] = useState(worlds[0]?.worldId ?? "");
  const selectedWorld = worlds.find((world) => world.worldId === worldId) ?? worlds[0];
  const [topicTitle, setTopicTitle] = useState(selectedWorld?.topicTitles[0] ?? "");
  const [topicId, setTopicId] = useState(toTopicId(selectedWorld?.topicTitles[0] ?? ""));
  const [stageType, setStageType] = useState<Exclude<LessonStageType, "PROGRESS" | "MASTERY">>("LOOK");
  const [contentKind, setContentKind] = useState<ContentDraftKind>("activity");
  const [topicType, setTopicType] = useState(selectedWorld?.allowedTopicTypes[0] ?? "concept");
  const [exampleCount, setExampleCount] = useState("4");
  const [adminPrompt, setAdminPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [metadataBusy, setMetadataBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [canRetry, setCanRetry] = useState(false);
  const [draftMetadata, setDraftMetadata] = useState<CurriculumContentMetadata | null>(null);

  useEffect(() => {
    let mounted = true;

    if (!gradeLevel || !selectedWorld?.worldId || !topicId || !stageType) {
      setDraftMetadata(null);
      return undefined;
    }

    setMetadataBusy(true);
    getCurriculumMetadataForContentDraft({
      gradeLevel,
      stageType,
      topicId,
      worldId: selectedWorld.worldId,
    })
      .then((resolvedMetadata) => {
        if (mounted) {
          setDraftMetadata(resolvedMetadata);
        }
      })
      .catch(() => {
        if (mounted) {
          setDraftMetadata(null);
          setMessage("Unable to resolve curriculum metadata for this draft request.");
        }
      })
      .finally(() => {
        if (mounted) {
          setMetadataBusy(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [gradeLevel, selectedWorld?.worldId, stageType, topicId]);

  async function createDraft() {
    if (!selectedWorld || !topicTitle.trim()) {
      setMessage("Choose a world and topic title first.");
      return;
    }

    if (!draftMetadata) {
      setMessage("Resolve curriculum metadata before generating a draft.");
      return;
    }

    setBusy(true);
    setMessage("");
    setCanRetry(false);

    try {
      const draft = await generateAdminContentDraft(
        {
          adminPrompt,
          contentKind,
          exampleCount: Number(exampleCount) || 4,
          gradeLevel,
          stageType,
          stageStructure: ADMIN_REQUIRED_STAGES,
          topicId,
          topicTitle,
          topicType,
          worldId: selectedWorld.worldId,
        },
        user,
        profile
      );

      if (!draft.id?.trim()) {
        setCanRetry(true);
        setMessage("Unable to save draft.");
        return;
      }

      router.push({
        pathname: "/(admin)/draft-review/[draftId]",
        params: { draftId: draft.id },
      });
    } catch (error) {
      setCanRetry(true);
      setMessage(error instanceof Error ? error.message : "Unable to generate draft.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminShell
      title="Create Content Draft"
      subtitle="Structure a lesson, activity, assessment, or stage-content request, let OpenAI assist, then review and validate before publishing."
    >
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
        <View style={{ flex: 2, minWidth: 360 }}>
          <AdminCard>
            <AdminSectionHeader
              title="Content Draft Request"
              subtitle="Choose the curriculum target and describe the learning content or activity."
            />
            <SegmentedOptions
              label="Grade"
              options={curriculumMetadata.map((grade) => grade.gradeLevel)}
              value={gradeLevel}
              onChange={(value) => {
                const nextWorld = curriculumMetadata.find((grade) => grade.gradeLevel === value)?.worlds[0];
                setGradeLevel(value);
                setWorldId(nextWorld?.worldId ?? "");
                setTopicTitle(nextWorld?.topicTitles[0] ?? "");
                setTopicId(toTopicId(nextWorld?.topicTitles[0] ?? ""));
                setTopicType(nextWorld?.allowedTopicTypes[0] ?? "concept");
              }}
            />
            <SegmentedOptions
              label="World"
              options={worlds.map((world) => world.worldId)}
              value={selectedWorld?.worldId ?? ""}
              onChange={(value) => {
                const nextWorld = worlds.find((world) => world.worldId === value);
                setWorldId(value);
                setTopicTitle(nextWorld?.topicTitles[0] ?? "");
                setTopicId(toTopicId(nextWorld?.topicTitles[0] ?? ""));
                setTopicType(nextWorld?.allowedTopicTypes[0] ?? "concept");
              }}
            />
            <SegmentedOptions
              label="Topic"
              options={selectedWorld?.topicTitles ?? []}
              value={topicTitle}
              onChange={(value) => {
                setTopicTitle(value);
                setTopicId(toTopicId(value));
              }}
            />
            <Text style={formStyles.label}>Topic Title</Text>
            <TextInput
              onChangeText={(value) => {
                setTopicTitle(value);
                setTopicId(toTopicId(value));
              }}
              placeholder="Example: Context Clues"
              style={formStyles.input}
              value={topicTitle}
            />
            <SegmentedOptions
              label="Stage"
              options={STAGE_OPTIONS}
              value={stageType}
              onChange={(value) =>
                setStageType(value as Exclude<LessonStageType, "PROGRESS" | "MASTERY">)
              }
            />
            <SegmentedOptions
              label="Content Kind"
              options={CONTENT_KIND_OPTIONS}
              value={contentKind}
              onChange={(value) => setContentKind(value as ContentDraftKind)}
            />
            <SegmentedOptions
              label="Topic Type"
              options={selectedWorld?.allowedTopicTypes ?? ["concept"]}
              value={topicType}
              onChange={setTopicType}
            />
            <Text style={formStyles.label}>Number of Examples</Text>
            <TextInput
              keyboardType="numeric"
              onChangeText={setExampleCount}
              style={formStyles.input}
              value={exampleCount}
            />
            <Text style={formStyles.label}>Prompt / Instruction</Text>
            <TextInput
              multiline
              onChangeText={setAdminPrompt}
              placeholder="Tell OpenAI what learning content, activity, question, or instruction should be drafted. Output remains draft-only."
              style={mergeAdminStyles(formStyles.input, { minHeight: 120, textAlignVertical: "top" })}
              value={adminPrompt}
            />
            {message ? <Text style={adminStyles.mutedText}>{message}</Text> : null}
            {canRetry ? (
              <AdminButton
                disabled={busy}
                label="Retry Generate Draft"
                tone="secondary"
                onPress={createDraft}
              />
            ) : null}
            <AdminButton
              disabled={busy || metadataBusy || !draftMetadata}
              label={busy ? "Generating..." : draftMetadata ? "Generate Draft" : "Resolve Metadata First"}
              onPress={createDraft}
            />
          </AdminCard>
        </View>
        <View style={{ flex: 1, minWidth: 300 }}>
          <AdminCard>
            <AdminSectionHeader
              eyebrow={metadataBusy ? "Resolving Metadata" : "Resolved Metadata"}
              title={draftMetadata?.worldTitle ?? selectedWorld?.title ?? "Select a world"}
              subtitle="BatiBot resolves learner-side metadata before OpenAI can generate content."
            />
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
              <AdminStatusBadge label={selectedWorld?.subjectArea ?? "subject"} />
              <AdminStatusBadge label={`${selectedWorld?.maxExamples ?? 0} max examples`} tone="good" />
              <AdminStatusBadge
                label={draftMetadata ? "metadata ready" : "metadata required"}
                tone={draftMetadata ? "good" : "warning"}
              />
            </View>
            <View style={{ gap: 8, marginTop: 12 }}>
              <Text style={formStyles.label}>Current Topic</Text>
              <Text style={adminStyles.mutedText}>
                {draftMetadata?.topicTitle ?? (topicTitle || "Select a topic")}
              </Text>
              <Text style={formStyles.label}>Stage Type</Text>
              <Text style={adminStyles.mutedText}>
                {draftMetadata
                  ? `${draftMetadata.stageType} (${draftMetadata.stageIndex}/${draftMetadata.totalStages})`
                  : stageType}
              </Text>
              <Text style={formStyles.label}>Existing Instruction</Text>
              <Text style={adminStyles.mutedText}>
                {draftMetadata?.currentContent?.instruction ?? "Resolve metadata to inspect existing instruction."}
              </Text>
              <Text style={formStyles.label}>Required Stages</Text>
              <Text style={adminStyles.mutedText}>
                {(selectedWorld?.requiredStages ?? ADMIN_REQUIRED_STAGES).join(" -> ")}
              </Text>
              <Text style={formStyles.label}>Selected Request</Text>
              <Text style={adminStyles.mutedText}>
                {stageType} / {contentKind} / {topicId || "topic-id"}
              </Text>
              <Text style={formStyles.label}>Content Rules</Text>
              {(selectedWorld?.contentRules ?? []).slice(0, 5).map((rule) => (
                <Text key={rule} style={adminStyles.mutedText}>
                  {rule}
                </Text>
              ))}
              <Text style={formStyles.label}>Allowed Activity Types</Text>
              <Text style={adminStyles.mutedText}>
                {(draftMetadata?.learnerUiSchema.allowedInteractionTypes ?? []).join(", ") || "Resolve metadata first."}
              </Text>
              <Text style={formStyles.label}>Existing Assets</Text>
              <Text style={adminStyles.mutedText}>
                {draftMetadata
                  ? `${draftMetadata.existingAssetRefs.images.length} images, ${draftMetadata.existingAssetRefs.audio.length} audio, ${draftMetadata.existingAssetRefs.backgrounds.length} backgrounds, ${draftMetadata.existingAssetRefs.icons.length} icons`
                  : "Resolve metadata first."}
              </Text>
              <Text style={formStyles.label}>Validation Hints</Text>
              <Text style={adminStyles.mutedText}>TAP needs an explanation or meaning.</Text>
              <Text style={adminStyles.mutedText}>PLAY must fit the selected world and grade.</Text>
              <Text style={adminStyles.mutedText}>Assets must already exist in the BatiBot asset library.</Text>
              <Text style={adminStyles.mutedText}>Publishing is blocked until validation passes.</Text>
            </View>
          </AdminCard>
        </View>
      </View>
    </AdminShell>
  );
}

function SegmentedOptions({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: string[];
  value: string;
}) {
  return (
    <View style={{ gap: 8, marginBottom: 14 }}>
      <Text style={formStyles.label}>{label}</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {options.map((option) => (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            style={mergeAdminStyles(
              formStyles.option,
              value === option && formStyles.optionActive
            )}
          >
            <Text style={mergeAdminStyles(formStyles.optionText, value === option && formStyles.optionTextActive)}>
              {option}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function toTopicId(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const formStyles = {
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E7DDFB",
    borderRadius: 10,
    borderWidth: 1,
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "700" as const,
    marginBottom: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  label: {
    color: "#4C1D95",
    fontSize: 13,
    fontWeight: "900" as const,
    marginBottom: 6,
  },
  option: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E7DDFB",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  optionActive: {
    backgroundColor: "#6D28D9",
    borderColor: "#6D28D9",
  },
  optionText: {
    color: "#4C1D95",
    fontSize: 12,
    fontWeight: "800" as const,
  },
  optionTextActive: {
    color: "#FFFFFF",
  },
};
