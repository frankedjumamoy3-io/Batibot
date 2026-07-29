import { useCallback, useEffect, useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";

import {
  AdminButton,
  AdminCard,
  AdminSectionHeader,
  AdminShell,
  AdminStatusBadge,
  adminStyles,
  mergeAdminStyles,
} from "@/src/components/admin/AdminShell";
import { useCurrentUserProfile } from "@/src/presentation/hooks/use-current-user-profile";
import { getAdminAssetCatalog } from "@/src/services/admin/adminAssetCatalogService";
import {
  archiveAdminAsset,
  listAdminAssets,
  selectLocalAdminAssetFile,
  uploadAdminAsset,
  type AdminAsset,
  type AdminAssetType,
  type PickedAdminFile,
} from "@/src/services/admin/adminAssetService";

const TYPE_FILTERS: (AdminAssetType | "all")[] = ["all", "image", "audio", "background", "icon"];

export default function AdminAssetLibraryScreen() {
  const { profile } = useCurrentUserProfile();
  const catalog = getAdminAssetCatalog();
  const [assets, setAssets] = useState<AdminAsset[]>([]);
  const [type, setType] = useState<AdminAssetType | "all">("all");
  const [search, setSearch] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [worldId, setWorldId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [cursor, setCursor] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState<AdminAsset | null>(null);
  const [pendingFile, setPendingFile] = useState<{ file: PickedAdminFile; type: "image" | "audio" } | null>(null);

  const loadAssets = useCallback(async (append = false, nextCursor?: string) => {
    if (!profile) return;
    setLoading(true);
    setMessage("");
    try {
      const result = await listAdminAssets(
        {
          cursor: nextCursor,
          gradeLevel: gradeLevel.trim() || undefined,
          limit: 36,
          search,
          topicId: topicId.trim() || undefined,
          type: type === "all" ? undefined : type,
          worldId: worldId.trim() || undefined,
        },
        profile
      );
      setAssets((current) => append ? [...current, ...result.assets] : result.assets);
      setCursor(result.nextCursor);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load admin assets.");
    } finally {
      setLoading(false);
    }
  }, [gradeLevel, profile, search, topicId, type, worldId]);

  useEffect(() => {
    const timer = setTimeout(() => { void loadAssets(); }, 250);
    return () => clearTimeout(timer);
  }, [loadAssets]);

  async function chooseFile(kind: "image" | "audio") {
    setMessage("");
    try {
      const file = await selectLocalAdminAssetFile(kind);
      setPendingFile(file ? { file, type: kind } : null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : `Unable to select ${kind}.`);
    }
  }

  async function uploadSelected() {
    if (!pendingFile) return;
    setUploading(true);
    setMessage("");
    try {
      const asset = await uploadAdminAsset({
        ...pendingFile.file,
        gradeLevel: gradeLevel.trim() || undefined,
        tags: ["admin-upload"],
        topicId: topicId.trim() || undefined,
        type: pendingFile.type,
        worldId: worldId.trim() || undefined,
      }, profile);
      if (asset) {
        setAssets((current) => [asset, ...current.filter((item) => item.id !== asset.id)]);
        setSelected(asset);
        setMessage(`${asset.name} uploaded and indexed.`);
        setPendingFile(null);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to upload the selected file.");
    } finally {
      setUploading(false);
    }
  }

  async function archiveSelected() {
    if (!selected || !profile) return;
    try {
      await archiveAdminAsset(selected.id, profile);
      setAssets((current) => current.filter((item) => item.id !== selected.id));
      setMessage(`${selected.name} archived. Existing draft references were not deleted.`);
      setSelected(null);
    } catch {
      setMessage("Unable to archive the selected asset.");
    }
  }

  return (
    <AdminShell
      title="Asset Library"
      subtitle="Upload, search, inspect, reuse, and safely archive assets used by admin content drafts."
    >
      <View style={styles.summaryRow}>
        <Summary label="Bundled assets" value={catalog.assets.length} />
        <Summary label="Missing bundled sources" value={catalog.missingSourceCount} warning={catalog.missingSourceCount > 0} />
        <Summary label="Admin uploads" value={assets.length} />
      </View>

      <AdminCard>
        <AdminSectionHeader
          title="Uploaded by Admin"
          subtitle="PNG, JPG, and WEBP images up to 5MB. Web admin also supports MP3, M4A, and WAV audio up to 10MB."
        />
        <View style={styles.toolbar}>
          <TextInput
            onChangeText={setSearch}
            placeholder="Search name, filename, or tags"
            style={styles.input}
            value={search}
          />
          <AdminButton disabled={uploading} label="Choose Image" onPress={() => { void chooseFile("image"); }} />
          <AdminButton disabled={uploading} label="Choose Audio" tone="secondary" onPress={() => { void chooseFile("audio"); }} />
        </View>
        <View style={styles.toolbar}>
          <TextInput onChangeText={setGradeLevel} placeholder="Grade filter" style={styles.scopeInput} value={gradeLevel} />
          <TextInput onChangeText={setWorldId} placeholder="World filter" style={styles.scopeInput} value={worldId} />
          <TextInput onChangeText={setTopicId} placeholder="Topic filter" style={styles.scopeInput} value={topicId} />
        </View>
        {pendingFile ? (
          <View style={styles.pendingFile}>
            <Text style={styles.pendingName}>{pendingFile.file.filename}</Text>
            <Text style={adminStyles.mutedText}>
              {pendingFile.file.mimeType} - {formatBytes(pendingFile.file.sizeBytes)}
            </Text>
            <AdminButton disabled={uploading} label={uploading ? "Uploading..." : "Upload Selected File"} onPress={() => { void uploadSelected(); }} />
          </View>
        ) : null}
        <View style={styles.filters}>
          {TYPE_FILTERS.map((item) => (
            <Pressable key={item} onPress={() => setType(item)} style={mergeAdminStyles(styles.filter, type === item && styles.filterActive)}>
              <Text style={mergeAdminStyles(styles.filterText, type === item && styles.filterTextActive)}>{item}</Text>
            </Pressable>
          ))}
        </View>
        {message ? <Text style={adminStyles.mutedText}>{message}</Text> : null}
        <View style={styles.grid}>
          {assets.map((asset) => (
            <Pressable key={asset.id} onPress={() => setSelected(asset)} style={mergeAdminStyles(styles.assetCard, selected?.id === asset.id && styles.assetCardSelected)}>
              {asset.type === "image" || asset.type === "background" ? (
                <Image accessibilityLabel={asset.name} resizeMode="contain" source={{ uri: asset.uri }} style={styles.thumbnail} />
              ) : (
                <View style={styles.audioPreview}><Text style={styles.audioText}>AUDIO</Text></View>
              )}
              <Text numberOfLines={2} style={styles.assetName}>{asset.name}</Text>
              <View style={styles.badges}>
                <AdminStatusBadge label={asset.type} />
                <AdminStatusBadge label={asset.status} tone={asset.status === "ready" ? "good" : "warning"} />
              </View>
            </Pressable>
          ))}
        </View>
        {!assets.length && !loading ? <Text style={adminStyles.mutedText}>No uploaded assets match these filters.</Text> : null}
        {cursor ? <AdminButton disabled={loading} label={loading ? "Loading..." : "Load More"} tone="secondary" onPress={() => { void loadAssets(true, cursor); }} /> : null}
      </AdminCard>

      {selected ? (
        <AdminCard>
          <AdminSectionHeader title="Asset Details" action={<AdminStatusBadge label={selected.status} tone="good" />} />
          <Detail label="ID" value={selected.id} />
          <Detail label="Storage path" value={selected.storagePath ?? "Bundled / local reference"} />
          <Detail label="Curriculum" value={[selected.gradeLevel, selected.worldId, selected.topicId, selected.stageType].filter(Boolean).join(" / ") || "Shared"} />
          <Detail label="Tags" value={selected.tags.join(", ") || "None"} />
          <Detail label="Original file" value={selected.originalFilename ?? "Unavailable"} />
          <AdminButton label="Archive Asset" tone="danger" onPress={() => { void archiveSelected(); }} />
        </AdminCard>
      ) : null}
    </AdminShell>
  );
}

function Summary({ label, value, warning = false }: { label: string; value: number; warning?: boolean }) {
  return <View style={styles.summary}><Text style={styles.summaryValue}>{value}</Text><Text style={adminStyles.mutedText}>{label}</Text>{warning ? <AdminStatusBadge label="Review" tone="warning" /> : null}</View>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return <View style={styles.detail}><Text style={styles.detailLabel}>{label}</Text><Text style={styles.detailValue}>{value}</Text></View>;
}

function formatBytes(value?: number) {
  if (!value) return "Size unavailable";
  if (value < 1024 * 1024) return `${Math.ceil(value / 1024)} KB`;
  return `${(value / 1024 / 1024).toFixed(1)} MB`;
}

const styles = {
  assetCard: { alignItems: "center" as const, backgroundColor: "#FFFFFF", borderColor: "#E7DDFB", borderRadius: 10, borderWidth: 1, gap: 7, padding: 10, width: 150 },
  assetCardSelected: { backgroundColor: "#F5F3FF", borderColor: "#6D28D9", borderWidth: 2 },
  assetName: { color: "#111827", fontSize: 12, fontWeight: "900" as const, minHeight: 34, textAlign: "center" as const },
  audioPreview: { alignItems: "center" as const, backgroundColor: "#EDE9FE", borderRadius: 8, height: 88, justifyContent: "center" as const, width: 120 },
  audioText: { color: "#6D28D9", fontSize: 13, fontWeight: "900" as const },
  badges: { flexDirection: "row" as const, flexWrap: "wrap" as const, gap: 4, justifyContent: "center" as const },
  detail: { borderBottomColor: "#E7DDFB", borderBottomWidth: 1, gap: 3, paddingVertical: 9 },
  detailLabel: { color: "#64748B", fontSize: 11, fontWeight: "900" as const, textTransform: "uppercase" as const },
  detailValue: { color: "#111827", fontSize: 13, fontWeight: "700" as const },
  filter: { borderColor: "#E7DDFB", borderRadius: 999, borderWidth: 1, paddingHorizontal: 11, paddingVertical: 7 },
  filterActive: { backgroundColor: "#6D28D9", borderColor: "#6D28D9" },
  filterText: { color: "#4C1D95", fontSize: 12, fontWeight: "900" as const },
  filterTextActive: { color: "#FFFFFF" },
  filters: { flexDirection: "row" as const, flexWrap: "wrap" as const, gap: 7 },
  grid: { flexDirection: "row" as const, flexWrap: "wrap" as const, gap: 10 },
  input: { backgroundColor: "#FFFFFF", borderColor: "#E7DDFB", borderRadius: 9, borderWidth: 1, color: "#111827", flex: 1, fontSize: 13, minWidth: 220, padding: 10 },
  pendingFile: { backgroundColor: "#F5F3FF", borderColor: "#C4B5FD", borderRadius: 10, borderWidth: 1, gap: 6, padding: 12 },
  pendingName: { color: "#4C1D95", fontSize: 14, fontWeight: "900" as const },
  scopeInput: { backgroundColor: "#FFFFFF", borderColor: "#E7DDFB", borderRadius: 9, borderWidth: 1, color: "#111827", flex: 1, fontSize: 12, minWidth: 150, padding: 9 },
  summary: { backgroundColor: "#FFFFFF", borderColor: "#E7DDFB", borderRadius: 10, borderWidth: 1, flex: 1, minWidth: 180, padding: 12 },
  summaryRow: { flexDirection: "row" as const, flexWrap: "wrap" as const, gap: 12 },
  summaryValue: { color: "#4C1D95", fontSize: 22, fontWeight: "900" as const },
  thumbnail: { height: 88, width: 120 },
  toolbar: { alignItems: "center" as const, flexDirection: "row" as const, flexWrap: "wrap" as const, gap: 8 },
};
