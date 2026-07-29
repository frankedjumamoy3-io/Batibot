const DEFAULT_ADMIN_EMAILS = ["admin@batibot.app", "admin123@gmail.com"];

export function normalizeAdminEmail(email?: string | null) {
  return email?.trim().toLowerCase() ?? "";
}

export const BATIBOT_ADMIN_EMAILS = [
  ...DEFAULT_ADMIN_EMAILS,
  ...(process.env.EXPO_PUBLIC_BATIBOT_ADMIN_EMAIL ?? "").split(","),
]
  .join(",")
  .split(",")
  .map(normalizeAdminEmail)
  .filter(Boolean);

export function isAllowedAdminEmail(email?: string | null) {
  return BATIBOT_ADMIN_EMAILS.includes(normalizeAdminEmail(email));
}
