import { describe, it, expect } from "vitest";
import { radioApplicationSchema } from "@/lib/radio-schema";
import { radioCampaign, RADIO_PLACEHOLDER } from "@/lib/radio";

const validInput = {
  bandName: "THE POLONS",
  contactName: "Yusuke Omata",
  email: "contact@example.com",
  xAccount: "@example",
  base: "東京・池袋",
  songUrl: "https://example.com/song",
  savedMoment: "高校生のとき、ライブハウスで",
  whoToSave: "昔の自分のような人",
  members: "2名",
  canAttend: "on",
  consentArchive: "on",
  consentLine: "on",
  consentArticle: "",
  message: "",
};

const pathsOf = (input: Record<string, string>) => {
  const result = radioApplicationSchema.safeParse(input);
  return result.success ? [] : result.error.issues.map((i) => i.path.join("."));
};

describe("radioApplicationSchema", () => {
  it("passes a valid input", () => {
    expect(radioApplicationSchema.safeParse(validInput).success).toBe(true);
  });

  it("requires the two theme answers", () => {
    const paths = pathsOf({ ...validInput, savedMoment: "", whoToSave: " " });
    expect(paths).toContain("savedMoment");
    expect(paths).toContain("whoToSave");
  });

  it("requires attendance and archive consent to be checked", () => {
    const paths = pathsOf({ ...validInput, canAttend: "", consentArchive: "", consentLine: "" });
    expect(paths).toContain("canAttend");
    expect(paths).toContain("consentArchive");
    expect(paths).toContain("consentLine");
  });

  it("treats article consent as optional", () => {
    expect(pathsOf({ ...validInput, consentArticle: "on" })).toEqual([]);
    expect(pathsOf({ ...validInput, consentArticle: "" })).toEqual([]);
  });

  it("rejects a malformed email and song URL", () => {
    const paths = pathsOf({ ...validInput, email: "not-an-email", songUrl: "example" });
    expect(paths).toContain("email");
    expect(paths).toContain("songUrl");
  });
});

describe("radioCampaign", () => {
  const unresolved = Object.entries(radioCampaign)
    .filter(([, v]) => v.includes(RADIO_PLACEHOLDER))
    .map(([k]) => k);

  // 公開前にオーナーが決めて埋める値。埋まったら todo が消える
  for (const key of unresolved) {
    it.todo(`fill ${key} before publishing`);
  }

  it("keeps the fixed facts", () => {
    expect(radioCampaign.airDate).toContain("2026年12月23日（水）");
    expect(radioCampaign.deadline).toContain("2026年11月15日（日）");
  });
});

describe("isRadioOpen", () => {
  it("hides the page in production while placeholders remain, shows it elsewhere", async () => {
    const { isRadioOpen } = await import("@/lib/radio");
    const unresolved = Object.values(radioCampaign).some((v) => v.includes(RADIO_PLACEHOLDER));
    const prev = process.env.VERCEL_ENV;
    process.env.VERCEL_ENV = "production";
    expect(isRadioOpen()).toBe(!unresolved);
    process.env.VERCEL_ENV = "preview";
    expect(isRadioOpen()).toBe(true);
    process.env.VERCEL_ENV = prev;
  });
});
