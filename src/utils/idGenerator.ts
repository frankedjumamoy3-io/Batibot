function sanitizeIdPart(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 32);
}

export function createSafeId(prefix: string): string {
  const safePrefix = sanitizeIdPart(prefix) || "id";
  const time = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 12);

  return `${safePrefix}_${time}_${random}`;
}

export function createLearnerProfileId(): string {
  return createSafeId("learner");
}

export function createDeviceId(): string {
  return createSafeId("device");
}

export function createSessionId(): string {
  return createSafeId("session");
}
