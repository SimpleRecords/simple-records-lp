// Simple in-memory rate-limit (for un-deployed / single-instance use).
// For production multi-instance, replace with Upstash/Redis.

const buckets = new Map<string, { count: number; resetAt: number }>()

export type RateLimitResult = {
  ok: boolean
  remaining: number
  resetAt: number
}

export function rateLimit(
  key: string,
  limit: number = 3,
  windowMs: number = 60_000,
): RateLimitResult {
  const now = Date.now()
  const bucket = buckets.get(key)
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, remaining: limit - 1, resetAt: now + windowMs }
  }
  if (bucket.count >= limit) {
    return { ok: false, remaining: 0, resetAt: bucket.resetAt }
  }
  bucket.count++
  return { ok: true, remaining: limit - bucket.count, resetAt: bucket.resetAt }
}

export async function getServerActionIp(): Promise<string> {
  const { headers } = await import("next/headers");
  const headersList = await headers();
  const forwarded = headersList.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headersList.get("x-real-ip") ?? "unknown";
}
