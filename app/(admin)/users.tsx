import { useEffect, useState } from "react";
import { Text } from "react-native";

import {
  AdminCard,
  AdminSectionHeader,
  AdminShell,
  AdminStatusBadge,
  AdminTable,
} from "@/src/components/admin/AdminShell";
import { useCurrentUserProfile } from "@/src/presentation/hooks/use-current-user-profile";
import { listUserMetadataForAdmin } from "@/src/services/admin/adminUserMetadataService";
import type { UserMetadata } from "@/src/types/user";

export default function AdminUserManagementScreen() {
  const { profile } = useCurrentUserProfile();
  const [users, setUsers] = useState<UserMetadata[]>([]);

  useEffect(() => {
    let mounted = true;

    listUserMetadataForAdmin(profile).then((items) => {
      if (mounted) {
        setUsers(items);
      }
    });

    return () => {
      mounted = false;
    };
  }, [profile]);

  const learners = users.filter((user) => user.role === "learner");
  const admins = users.filter((user) => user.role === "administrator");

  return (
    <AdminShell
      title="User Management"
      subtitle="View learner and administrator metadata. Account actions remain guarded by admin role checks."
    >
      <AdminCard>
        <AdminSectionHeader
          title="User Access Summary"
          subtitle={`${learners.length} learners and ${admins.length} administrators found in normalized metadata.`}
          action={<AdminStatusBadge label="Admin only" tone="good" />}
        />
      </AdminCard>

      <AdminTable
        columns={["Name", "Role", "Grade", "XP", "Stars", "Last Active"]}
        emptyTitle="No users available"
        emptyDescription="User metadata will appear when Firestore is reachable and the signed-in profile has admin access."
        rows={users.map((user) => [
          <Text key="name" style={userStyles.nameText}>
            {user.displayName ?? user.email ?? user.uid}
          </Text>,
          <AdminStatusBadge
            key="role"
            label={user.role}
            tone={user.role === "administrator" ? "warning" : "default"}
          />,
          user.gradeLevel ?? "Not set",
          user.totalXP ?? 0,
          user.totalStars ?? 0,
          user.lastActiveAt ? new Date(user.lastActiveAt).toLocaleDateString() : "Unavailable",
        ])}
      />
    </AdminShell>
  );
}

const userStyles = {
  nameText: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "900" as const,
  },
};
