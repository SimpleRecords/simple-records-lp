import { z } from "zod";

const checked = (message: string) =>
  z.literal("on", { message });

export const radioApplicationSchema = z.object({
  bandName: z
    .string()
    .trim()
    .min(1, "バンド名を入力してください")
    .max(200, "バンド名が長すぎます"),
  contactName: z
    .string()
    .trim()
    .min(1, "ご担当者のお名前を入力してください")
    .max(100, "お名前が長すぎます"),
  email: z
    .string()
    .trim()
    .min(1, "メールアドレスを入力してください")
    .max(254, "メールアドレスが長すぎます")
    .pipe(z.email("メールアドレスの形式をご確認ください")),
  xAccount: z
    .string()
    .trim()
    .min(1, "XアカウントのIDを入力してください")
    .max(50, "XアカウントのIDが長すぎます"),
  base: z
    .string()
    .trim()
    .min(1, "活動拠点を入力してください")
    .max(100, "活動拠点が長すぎます"),
  songUrl: z
    .string()
    .trim()
    .min(1, "音源のリンクを入力してください")
    .max(500, "リンクが長すぎます")
    .pipe(z.url("リンクの形式をご確認ください（https:// から）")),
  savedMoment: z
    .string()
    .trim()
    .min(1, "「音楽に救われた瞬間」を入力してください")
    .max(3000, "3000字以内でご記入ください"),
  whoToSave: z
    .string()
    .trim()
    .min(1, "「あなたの音楽は、誰を救えるか」を入力してください")
    .max(3000, "3000字以内でご記入ください"),
  members: z
    .string()
    .trim()
    .min(1, "出演できる人数を入力してください")
    .max(50, "出演できる人数が長すぎます"),
  canAttend: checked("当日スタジオに来られることをご確認ください"),
  consentArchive: checked("放送回の公開への同意が必要です"),
  consentArticle: z.enum(["on", ""]).optional().default(""),
  message: z.string().trim().max(3000).optional().default(""),
});

export type RadioApplicationInput = z.infer<typeof radioApplicationSchema>;
