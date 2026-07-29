import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import {
  AdminSectionHeader,
  AdminShell,
  AdminStatusBadge,
  adminStyles,
  mergeAdminStyles,
} from "@/src/components/admin/AdminShell";
import {
  getWorldTopicTemplate,
  listGrades,
  listTopicsByWorld,
  listWorldsByGrade,
  validateMetadataIndex,
} from "@/src/services/admin/batibotMetadataApi";

export default function AdminCurriculumScreen() {
  const grades = listGrades();
  const [activeGrade, setActiveGrade] = useState(grades[0]?.id ?? "grade1");
  const grade = grades.find((item) => item.id === activeGrade) ?? grades[0];
  const worlds = grade ? listWorldsByGrade(grade.id) : [];
  const diagnostics = validateMetadataIndex();

  return (
    <AdminShell
      title="Curriculum Management"
      subtitle="View the grade, world, topic, stage, and content-rule structure used for content curation."
    >
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {grades.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => setActiveGrade(item.id)}
            style={mergeAdminStyles(
              curriculumStyles.gradeTab,
              activeGrade === item.id && curriculumStyles.gradeTabActive
            )}
          >
            <Text
              style={mergeAdminStyles(
                curriculumStyles.gradeTabText,
                activeGrade === item.id && curriculumStyles.gradeTabTextActive
              )}
            >
              {item.title}
            </Text>
          </Pressable>
        ))}
      </View>

      <AdminSectionHeader
        title={grade?.title ?? "Curriculum"}
        subtitle={`${worlds.length} learner worlds resolved from the canonical curriculum index.`}
      />

      {diagnostics.length ? (
        <View style={curriculumStyles.diagnosticBox}>
          <Text style={curriculumStyles.diagnosticTitle}>Metadata diagnostics</Text>
          <Text style={adminStyles.mutedText}>
            {diagnostics.filter((item) => item.severity === "error").length} errors and{" "}
            {diagnostics.filter((item) => item.severity === "warning").length} warnings. Missing challenge
            topics use append placement and remain visible to developers.
          </Text>
        </View>
      ) : null}

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 14 }}>
        {worlds.map((world) => {
          const topics = listTopicsByWorld(grade.id, world.id, { includeChallenge: true });
          const template = getWorldTopicTemplate({ gradeLevel: grade.id, worldId: world.id });

          return (
          <View key={world.id} style={curriculumStyles.worldCard}>
            <View style={{ alignItems: "center", flexDirection: "row", gap: 10 }}>
              <Text style={curriculumStyles.worldTitle}>{world.title}</Text>
              <AdminStatusBadge label={`${topics.length} topics`} />
            </View>
            <Text style={adminStyles.mutedText}>World ID: {world.id}</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
              <AdminStatusBadge label={`${template.stageOrder.length} stages`} />
              <AdminStatusBadge
                label={world.challengeTopicId ? "Challenge detected" : "Append placement"}
                tone={world.challengeTopicId ? "good" : "warning"}
              />
            </View>
            <Text style={adminStyles.mutedText}>Stages: {template.stageOrder.join(" -> ")}</Text>
            <Text style={adminStyles.mutedText}>
              Template source: {template.sourceTopicId ?? "structural default"}
            </Text>
            <Text style={adminStyles.mutedText}>
              Topics: {topics.slice(0, 6).map((topic) => topic.title).join(", ")}
              {topics.length > 6 ? "..." : ""}
            </Text>
          </View>
          );
        })}
      </View>
    </AdminShell>
  );
}

const curriculumStyles = {
  diagnosticBox: {
    backgroundColor: "#FFFBEB",
    borderColor: "#FDE68A",
    borderRadius: 10,
    borderWidth: 1,
    gap: 4,
    padding: 12,
  },
  diagnosticTitle: {
    color: "#92400E",
    fontSize: 14,
    fontWeight: "900" as const,
  },
  gradeTab: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E7DDFB",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  gradeTabActive: {
    backgroundColor: "#6D28D9",
    borderColor: "#6D28D9",
  },
  gradeTabText: {
    color: "#4C1D95",
    fontSize: 13,
    fontWeight: "900" as const,
  },
  gradeTabTextActive: {
    color: "#FFFFFF",
  },
  worldCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E7DDFB",
    borderRadius: 12,
    borderWidth: 1,
    flexGrow: 1,
    gap: 8,
    minWidth: 300,
    padding: 14,
  },
  worldTitle: {
    color: "#111827",
    flex: 1,
    fontSize: 16,
    fontWeight: "900" as const,
  },
};
