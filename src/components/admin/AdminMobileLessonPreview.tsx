import { useMemo, useState } from "react";
import { ImageBackground, View } from "react-native";

import { batibotAssetRegistry } from "@/src/assets/assetRegistry";
import { AdminButton } from "@/src/components/admin/AdminShell";
import {
  LearnerStageRenderer,
  type LearnerStagePreviewState,
} from "@/src/components/lesson/LearnerStageRenderer";
import type { StageTemplate } from "@/src/domain/admin/curriculum-metadata";
import type { StageRuntimeState } from "@/src/domain/lesson/stage-render";
import {
  buildStageTemplateFromMetadata,
  type CurriculumContentMetadata,
} from "@/src/services/admin/batibotCurriculumApi";

type AdminMobileLessonPreviewProps = {
  backgroundRef?: string;
  content: unknown;
  metadata?: CurriculumContentMetadata | null;
  previewState?: LearnerStagePreviewState;
  template?: StageTemplate | null;
  topicTitle?: string;
};

export function AdminMobileLessonPreview({
  backgroundRef,
  content,
  metadata,
  previewState = "default",
  template,
}: AdminMobileLessonPreviewProps) {
  const [previewKey, setPreviewKey] = useState(0);
  const legacyTemplate = useMemo(
    () => !template && metadata ? buildStageTemplateFromMetadata(metadata) : null,
    [metadata, template]
  );
  const runtime: StageRuntimeState = {
    feedbackState: previewState,
    primaryActionEnabled: previewState !== "wrong",
    submitted: previewState !== "default",
  };
  const resolvedBackgroundRef = backgroundRef ?? legacyTemplate?.worldBackgroundRef;
  const backgroundSource = resolvedBackgroundRef
    ? batibotAssetRegistry[resolvedBackgroundRef]?.source
    : undefined;

  if (!template && !legacyTemplate) {
    return <View style={previewStyles.phone} />;
  }

  return (
    <View style={previewStyles.wrapper}>
      {backgroundSource ? (
      <ImageBackground resizeMode="cover" source={backgroundSource} style={previewStyles.phone} imageStyle={previewStyles.phoneImage}>
        <LearnerStageRenderer
          key={`${template?.stageType ?? legacyTemplate?.id}-${previewKey}-${previewState}`}
          content={content}
          mode="adminPreview"
          runtime={runtime}
          stageTemplate={legacyTemplate ?? undefined}
          template={template ?? undefined}
        />
      </ImageBackground>
      ) : (
        <View style={previewStyles.phone}>
          <LearnerStageRenderer
            key={`${template?.stageType ?? legacyTemplate?.id}-${previewKey}-${previewState}`}
            content={content}
            mode="adminPreview"
            runtime={runtime}
            stageTemplate={legacyTemplate ?? undefined}
            template={template ?? undefined}
          />
        </View>
      )}
      <View style={previewStyles.actions}>
        <AdminButton
          label="Reset Preview"
          tone="secondary"
          onPress={() => setPreviewKey((current) => current + 1)}
        />
      </View>
    </View>
  );
}

const previewStyles = {
  actions: {
    flexDirection: "row" as const,
    gap: 10,
    justifyContent: "center" as const,
  },
  phone: {
    backgroundColor: "#312E81",
    borderColor: "#1E1B4B",
    borderRadius: 24,
    borderWidth: 6,
    height: 680,
    padding: 14,
    maxWidth: 390,
    width: "100%" as const,
  },
  phoneImage: {
    borderRadius: 18,
  },
  wrapper: {
    alignItems: "center" as const,
    gap: 12,
  },
};
