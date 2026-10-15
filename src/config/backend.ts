// Controlled APKs use the API when configured; learner data always stays local.
export const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL ?? "").trim().replace(/\/+$/, "");
export const USE_NODE_BACKEND = true;
