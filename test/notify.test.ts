import { describe, it, expect, vi } from "vitest";
import { notify } from "@/lib/notify";

const failing = () => Promise.reject(new Error("mail down"));

describe("notify", () => {
  it("swallows a mail failure when the application is already saved", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(notify(failing, true)).resolves.toBeUndefined();
  });

  it("throws when the application was not saved and the mail failed", async () => {
    await expect(notify(failing, false)).rejects.toThrow("mail down");
  });

  it("sends the mail in both cases", async () => {
    const send = vi.fn().mockResolvedValue(undefined);
    await notify(send, true);
    await notify(send, false);
    expect(send).toHaveBeenCalledTimes(2);
  });
});
