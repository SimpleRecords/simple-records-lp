import { describe, it, expect } from "vitest";
import { applicationSchema } from "@/lib/schema";

const validInput = {
  bandName: "THE POLONS",
  representativeName: "Yusuke Omata",
  contact: "contact@example.com",
  purpose: "interview" as const,
  profile: "歌謡パンクバンド・池袋拠点・2023年結成",
  content: "新作リリースに合わせたインタビュー希望",
  urls: "https://example.com",
  message: "よろしくお願いします",
};

describe("applicationSchema", () => {
  it("passes a valid input", () => {
    const result = applicationSchema.safeParse(validInput);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.bandName).toBe("THE POLONS");
      expect(result.data.purpose).toBe("interview");
    }
  });

  it("rejects when required fields are missing", () => {
    const { bandName: _bandName, ...withoutBand } = validInput;
    const result = applicationSchema.safeParse(withoutBand);
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join("."));
      expect(paths).toContain("bandName");
    }
  });

  it("rejects when purpose is not in the allowed enum", () => {
    const result = applicationSchema.safeParse({
      ...validInput,
      purpose: "not-a-valid-purpose",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join("."));
      expect(paths).toContain("purpose");
    }
  });

  it("rejects when bandName exceeds the max length", () => {
    const result = applicationSchema.safeParse({
      ...validInput,
      bandName: "x".repeat(201),
    });
    expect(result.success).toBe(false);
  });

  it("makes optional fields default to empty string when omitted", () => {
    const { urls: _urls, message: _message, ...minimal } = validInput;
    const result = applicationSchema.safeParse(minimal);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.urls).toBe("");
      expect(result.data.message).toBe("");
    }
  });
});
