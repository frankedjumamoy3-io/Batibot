import { useEffect, useMemo, useState } from "react";
import { Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { AdminButton, AdminStatusBadge, mergeAdminStyles } from "@/src/components/admin/AdminShell";
import { batibotAssetRegistry, type BatibotAssetGrade, type BatibotAssetMeta } from "@/src/assets/assetRegistry";
import type { AssetSlotRule, StageType } from "@/src/domain/admin/curriculum-metadata";
import type { AdminStageAssetReference } from "@/src/domain/admin/topic-draft";
import { useCurrentUserProfile } from "@/src/presentation/hooks/use-current-user-profile";
import {
  chooseAndUploadAdminImageAsset,
  chooseAndUploadAdminAudioAsset,
  listAdminAssets,
  validateAdminAssetForSlot,
  type AdminAsset,
} from "@/src/services/admin/adminAssetService";

type AdminAssetSelectorProps = {
  currentGrade?: string;
  currentTopicId?: string;
  currentWorldId?: string;
  currentStageType?: StageType;
  onAttach?: (asset: AdminStageAssetReference) => void;
  onInsert?: (asset: BatibotAssetMeta | AdminAsset, targetId: string) => void;
  onRemove?: (assetId: string, role: string) => void;
  rules?: AssetSlotRule[];
  selectedAssetRefs?: AdminStageAssetReference[];
  targets?: { id: string; label: string }[];
};

const GRADE_OPTIONS: (BatibotAssetGrade | "all")[] = [
  "all",
  "preschool",
  "kindergarten",
  "grade1",
  "grade2",
  "grade3",
  "shared",
];

export function AdminAssetSelector({
  currentGrade,
  currentTopicId,
  currentWorldId,
  currentStageType,
  onAttach,
  onInsert,
  onRemove,
  rules = [],
  selectedAssetRefs = [],
  targets: providedTargets,
}: AdminAssetSelectorProps) {
  const { profile } = useCurrentUserProfile();
  const [query, setQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState<BatibotAssetGrade | "all">(toRegistryGrade(currentGrade) ?? "all");
  const targets = providedTargets?.length
    ? providedTargets
    : rules.map((rule) => ({ id: rule.role, label: `${rule.role} (${rule.required ? "required" : "optional"})` }));
  const [targetId, setTargetId] = useState(targets[0]?.id ?? rules[0]?.role ?? "primaryVisual");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedAdminAssetId, setSelectedAdminAssetId] = useState<string | null>(null);
  const [adminAssets, setAdminAssets] = useState<AdminAsset[]>([]);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    let mounted = true;

    if (!profile) return () => { mounted = false; };

    listAdminAssets({}, profile)
      .then((result) => {
        if (mounted) setAdminAssets(result.assets);
      })
      .catch((error) => {
        if (mounted) setUploadMessage(error instanceof Error ? error.message : "Unable to load admin assets.");
      });

    return () => {
      mounted = false;
    };
  }, [profile]);

  const assets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return Object.values(batibotAssetRegistry)
      .filter((asset) => asset.source)
      .filter((asset) => gradeFilter === "all" || asset.grade === gradeFilter)
      .filter((asset) => {
        if (!normalizedQuery) return true;

        const searchable = [
          asset.key,
          asset.label,
          asset.grade,
          asset.world,
          asset.topic,
          ...(asset.tags ?? []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchable.includes(normalizedQuery);
      })
      .sort((left, right) => scoreAsset(right, currentWorldId) - scoreAsset(left, currentWorldId))
      .slice(0, 48);
  }, [currentWorldId, gradeFilter, query]);

  const selectedAsset = selectedKey ? batibotAssetRegistry[selectedKey] : null;
  const selectedAdminAsset = selectedAdminAssetId
    ? adminAssets.find((asset) => asset.id === selectedAdminAssetId) ?? null
    : null;

  async function uploadLocalImage() {
    setUploading(true);
    setUploadMessage("");

    try {
      const asset = await chooseAndUploadAdminImageAsset(
        {
          gradeLevel: currentGrade,
          name: query.trim() || undefined,
          tags: query.trim() ? [query.trim()] : [],
          topicId: currentTopicId,
          stageType: currentStageType,
          worldId: currentWorldId,
        },
        profile
      );

      if (asset) {
        setAdminAssets((items) => [asset, ...items.filter((item) => item.id !== asset.id)]);
        setSelectedAdminAssetId(asset.id);
        setSelectedKey(null);
        setUploadMessage("Local image uploaded to admin assets.");
      }
    } catch (error) {
      setUploadMessage(error instanceof Error ? error.message : "Unable to upload image asset.");
    } finally {
      setUploading(false);
    }
  }

  async function uploadLocalAudio() {
    setUploading(true);
    setUploadMessage("");
    try {
      const asset = await chooseAndUploadAdminAudioAsset(
        {
          gradeLevel: currentGrade,
          name: query.trim() || undefined,
          stageType: currentStageType,
          tags: query.trim() ? [query.trim()] : [],
          topicId: currentTopicId,
          worldId: currentWorldId,
        },
        profile
      );
      if (asset) {
        setAdminAssets((items) => [asset, ...items.filter((item) => item.id !== asset.id)]);
        setSelectedAdminAssetId(asset.id);
        setSelectedKey(null);
        setUploadMessage("Local audio uploaded to admin assets.");
      }
    } catch (error) {
      setUploadMessage(error instanceof Error ? error.message : "Unable to upload audio asset.");
    } finally {
      setUploading(false);
    }
  }

  function attachSelectedAsset() {
    const slot = rules.find((rule) => rule.role === targetId);
    if (selectedAdminAsset) {
      if (slot) {
        const errors = validateAdminAssetForSlot(selectedAdminAsset, slot);
        if (errors.length) {
          setUploadMessage(errors.join(" "));
          return;
        }
      }
      onAttach?.({ assetId: selectedAdminAsset.id, id: selectedAdminAsset.id, role: targetId, type: selectedAdminAsset.type, uri: selectedAdminAsset.uri });
      onInsert?.(selectedAdminAsset, targetId);
      return;
    }
    if (selectedAsset) {
      onAttach?.({ assetId: selectedAsset.key, id: selectedAsset.key, role: targetId, type: "image" });
      onInsert?.(selectedAsset, targetId);
    }
  }

  return (
    <View style={assetStyles.wrapper}>
      <Text style={assetStyles.label}>Search Assets</Text>
      <TextInput
        onChangeText={setQuery}
        placeholder="Search by label, key, or tag"
        style={assetStyles.input}
        value={query}
      />
      <View style={assetStyles.uploadBox}>
        <Text style={assetStyles.helpText}>
          Insert a local image from this device. Uploaded files are stored as admin assets before they are attached.
        </Text>
        <AdminButton
          disabled={uploading}
          label={uploading ? "Uploading..." : "Upload Local Image"}
          tone="secondary"
          onPress={uploadLocalImage}
        />
        <AdminButton
          disabled={uploading}
          label={uploading ? "Uploading..." : "Upload Local Audio"}
          tone="secondary"
          onPress={uploadLocalAudio}
        />
        {uploadMessage ? <Text style={assetStyles.helpText}>{uploadMessage}</Text> : null}
      </View>
      <Text style={assetStyles.label}>Filter Grade</Text>
      <View style={assetStyles.chipRow}>
        {GRADE_OPTIONS.map((grade) => (
          <Pressable
            key={grade}
            onPress={() => setGradeFilter(grade)}
            style={mergeAdminStyles(assetStyles.chip, gradeFilter === grade && assetStyles.chipActive)}
          >
            <Text style={mergeAdminStyles(assetStyles.chipText, gradeFilter === grade && assetStyles.chipTextActive)}>
              {grade}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text style={assetStyles.label}>Insert Target</Text>
      <View style={assetStyles.chipRow}>
        {targets.map((target) => (
          <Pressable
            key={target.id}
            onPress={() => setTargetId(target.id)}
            style={mergeAdminStyles(assetStyles.chip, targetId === target.id && assetStyles.chipActive)}
          >
            <Text style={mergeAdminStyles(assetStyles.chipText, targetId === target.id && assetStyles.chipTextActive)}>
              {target.label}
            </Text>
          </Pressable>
        ))}
      </View>
      {selectedAssetRefs.length ? (
        <View style={assetStyles.attachedList}>
          <Text style={assetStyles.label}>Attached to Current Stage</Text>
          {selectedAssetRefs.map((asset) => (
            <View key={`${asset.role}:${asset.assetId ?? asset.id}`} style={assetStyles.attachedRow}>
              <Text style={assetStyles.helpText}>{asset.role}: {asset.assetId ?? asset.id}</Text>
              {onRemove ? <AdminButton label="Remove" tone="secondary" onPress={() => onRemove(asset.assetId ?? asset.id, asset.role)} /> : null}
            </View>
          ))}
        </View>
      ) : null}
      <ScrollView style={assetStyles.assetScroll} contentContainerStyle={assetStyles.assetGrid}>
        {adminAssets.map((asset) => (
          <Pressable
            key={asset.id}
            onPress={() => {
              setSelectedAdminAssetId(asset.id);
              setSelectedKey(null);
            }}
            style={mergeAdminStyles(assetStyles.assetCard, selectedAdminAssetId === asset.id && assetStyles.assetCardActive)}
          >
            {asset.uri ? <Image source={{ uri: asset.uri }} resizeMode="contain" style={assetStyles.thumbnail} /> : null}
            <Text numberOfLines={2} style={assetStyles.assetLabel}>{asset.name}</Text>
            <AdminStatusBadge label="admin image" tone="warning" />
          </Pressable>
        ))}
        {assets.map((asset) => (
          <Pressable
            key={asset.key}
            onPress={() => {
              setSelectedKey(asset.key);
              setSelectedAdminAssetId(null);
            }}
            style={mergeAdminStyles(assetStyles.assetCard, selectedKey === asset.key && assetStyles.assetCardActive)}
          >
            {asset.source ? <Image source={asset.source} resizeMode="contain" style={assetStyles.thumbnail} /> : null}
            <Text numberOfLines={2} style={assetStyles.assetLabel}>{asset.label}</Text>
            <AdminStatusBadge label={asset.grade ?? "shared"} />
          </Pressable>
        ))}
      </ScrollView>
      {selectedAdminAsset ? (
        <View style={assetStyles.selectedRow}>
          <Text style={assetStyles.selectedText}>Selected: {selectedAdminAsset.name}</Text>
          <AdminButton label="Attach Asset" onPress={attachSelectedAsset} />
        </View>
      ) : selectedAsset ? (
        <View style={assetStyles.selectedRow}>
          <Text style={assetStyles.selectedText}>Selected: {selectedAsset.label}</Text>
          <AdminButton label="Attach Asset" onPress={attachSelectedAsset} />
        </View>
      ) : (
        <Text style={assetStyles.helpText}>Select an existing bundled BatiBot asset to insert into the draft.</Text>
      )}
    </View>
  );
}

function scoreAsset(asset: BatibotAssetMeta, currentWorldId?: string) {
  let score = 0;

  if (asset.world && asset.world === currentWorldId) score += 5;
  if (asset.grade === "shared") score += 1;

  return score;
}

function toRegistryGrade(grade?: string): BatibotAssetGrade | null {
  const normalized = grade?.toLowerCase().replace(/\s+/g, "");

  if (normalized === "preschool") return "preschool";
  if (normalized === "kindergarten") return "kindergarten";
  if (normalized === "grade1") return "grade1";
  if (normalized === "grade2") return "grade2";
  if (normalized === "grade3") return "grade3";

  return null;
}

const assetStyles = {
  attachedList: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    gap: 8,
    padding: 10,
  },
  attachedRow: {
    alignItems: "center" as const,
    flexDirection: "row" as const,
    gap: 8,
    justifyContent: "space-between" as const,
  },
  assetCard: {
    alignItems: "center" as const,
    backgroundColor: "#FFFFFF",
    borderColor: "#E7DDFB",
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
    padding: 10,
    width: 134,
  },
  assetCardActive: {
    backgroundColor: "#F5F3FF",
    borderColor: "#6D28D9",
    borderWidth: 2,
  },
  assetGrid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 10,
    paddingBottom: 10,
  },
  assetLabel: {
    color: "#111827",
    fontSize: 12,
    fontWeight: "900" as const,
    minHeight: 34,
    textAlign: "center" as const,
  },
  assetScroll: {
    maxHeight: 360,
  },
  chip: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E7DDFB",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  chipActive: {
    backgroundColor: "#6D28D9",
    borderColor: "#6D28D9",
  },
  chipRow: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 8,
  },
  chipText: {
    color: "#4C1D95",
    fontSize: 12,
    fontWeight: "900" as const,
  },
  chipTextActive: {
    color: "#FFFFFF",
  },
  helpText: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "700" as const,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E7DDFB",
    borderRadius: 10,
    borderWidth: 1,
    color: "#111827",
    fontSize: 14,
    fontWeight: "700" as const,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  label: {
    color: "#4C1D95",
    fontSize: 13,
    fontWeight: "900" as const,
  },
  selectedRow: {
    alignItems: "center" as const,
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 10,
    justifyContent: "space-between" as const,
  },
  selectedText: {
    color: "#111827",
    flex: 1,
    fontSize: 14,
    fontWeight: "900" as const,
  },
  thumbnail: {
    height: 72,
    width: 96,
  },
  uploadBox: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E7DDFB",
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    padding: 12,
  },
  wrapper: {
    gap: 12,
  },
};
