"use server";

import { redirect } from "next/navigation";
import { applicationSchema } from "@/lib/schema";
import { sendApplicationMail } from "@/lib/mail";
import { appendApplicationRow } from "@/lib/sheets";
import { isSheetsConfigured } from "@/lib/env";

export type FormState = {
  ok: boolean | null;
  errors?: Record<string, string[]>;
  message?: string;
  // 入力保持用（エラー時に再表示）
  values?: Record<string, string>;
};

export async function submitApplication(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  // Honeypot
  if (formData.get("website")) {
    // bot判定。静かに成功扱いでthanksへ
    redirect("/thanks");
  }

  const raw = {
    bandName: String(formData.get("bandName") ?? ""),
    representativeName: String(formData.get("representativeName") ?? ""),
    contact: String(formData.get("contact") ?? ""),
    purpose: String(formData.get("purpose") ?? ""),
    profile: String(formData.get("profile") ?? ""),
    content: String(formData.get("content") ?? ""),
    urls: String(formData.get("urls") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  const parsed = applicationSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      message: "入力内容をご確認ください",
      values: raw,
    };
  }

  try {
    // メール送信は必須。Sheets は設定されていれば追記。
    await sendApplicationMail(parsed.data);

    if (isSheetsConfigured()) {
      try {
        await appendApplicationRow(parsed.data);
      } catch (sheetErr) {
        // Sheets失敗はユーザー通知せず、サーバーログに留める
        console.error("[sheets append failed]", sheetErr);
      }
    }
  } catch (err) {
    console.error("[submit-application]", err);
    return {
      ok: false,
      message:
        "送信中にエラーが発生しました。時間をおいて再度お試しいただくか、simple.records.2022@gmail.com まで直接ご連絡ください。",
      values: raw,
    };
  }

  redirect("/thanks");
}
