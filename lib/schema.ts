import { z } from "zod";

export const PURPOSE_LABELS = {
  release: "リリース情報の掲載",
  interview: "バンド紹介記事（インタビュー）",
  other: "その他",
} as const;

export type Purpose = keyof typeof PURPOSE_LABELS;

export const applicationSchema = z.object({
  bandName: z
    .string()
    .trim()
    .min(1, "バンド名を入力してください")
    .max(200, "バンド名が長すぎます"),
  representativeName: z
    .string()
    .trim()
    .min(1, "代表者のお名前を入力してください")
    .max(100, "お名前が長すぎます"),
  contact: z
    .string()
    .trim()
    .min(1, "ご連絡先を入力してください")
    .max(500, "ご連絡先が長すぎます"),
  purpose: z.enum(["release", "interview", "other"], {
    message: "希望種別を選択してください",
  }),
  profile: z
    .string()
    .trim()
    .min(1, "バンドのプロフィールを入力してください")
    .max(3000, "プロフィールが長すぎます"),
  content: z
    .string()
    .trim()
    .min(1, "掲載・取材してほしい内容を入力してください")
    .max(5000, "内容が長すぎます"),
  urls: z.string().trim().max(1000).optional().default(""),
  message: z.string().trim().max(3000).optional().default(""),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
