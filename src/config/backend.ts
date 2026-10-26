// Device profiles stay local; authenticated learners also sync their durable progress cache.
export const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL ?? "").trim().replace(/\/+$/, "");
export const USE_NODE_BACKEND = true;
