import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { rateLimit } from "@/lib/rate-limit";

describe("rateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows up to N requests within the window", () => {
    const key = `allow-N-${Math.random()}`;
    const r1 = rateLimit(key, 3, 60_000);
    const r2 = rateLimit(key, 3, 60_000);
    const r3 = rateLimit(key, 3, 60_000);

    expect(r1.ok).toBe(true);
    expect(r1.remaining).toBe(2);
    expect(r2.ok).toBe(true);
    expect(r2.remaining).toBe(1);
    expect(r3.ok).toBe(true);
    expect(r3.remaining).toBe(0);
  });

  it("blocks the N+1 request within the window", () => {
    const key = `block-Nplus1-${Math.random()}`;
    rateLimit(key, 3, 60_000);
    rateLimit(key, 3, 60_000);
    rateLimit(key, 3, 60_000);
    const blocked = rateLimit(key, 3, 60_000);

    expect(blocked.ok).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it("resets the bucket after the window expires", () => {
    const key = `reset-${Math.random()}`;
    rateLimit(key, 2, 60_000);
    rateLimit(key, 2, 60_000);
    const blocked = rateLimit(key, 2, 60_000);
    expect(blocked.ok).toBe(false);

    // Advance past the window.
    vi.advanceTimersByTime(60_001);

    const afterReset = rateLimit(key, 2, 60_000);
    expect(afterReset.ok).toBe(true);
    expect(afterReset.remaining).toBe(1);
  });
});
