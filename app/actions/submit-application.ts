"use server";

import { redirect } from "next/navigation";
import { applicationSchema } from "@/lib/schema";
import { sendApplicationMail } from "@/lib/mail";
import { saveListingApplication } from "@/lib/db";
import { notify } from "@/lib/notify";
import { rateLimit, getServerActionIp } from "@/lib/rate-limit";

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

  // Rate limit: 3 submissions per minute per IP
  const ip = await getServerActionIp();
  const rl = rateLimit(`submit:${ip}`, 3, 60_000);
  if (!rl.ok) {
    const waitSec = Math.ceil((rl.resetAt - Date.now()) / 1000);
    return {
      ok: false,
      message: `送信回数の上限に達しました。${waitSec}秒後に再度お試しください。`,
    };
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
    // DB に保存 → 通知メール。DB に入らなかった応募は件名で分かるようにし、メールだけで受け付ける
    const saved = await saveListingApplication(parsed.data);
    await notify(() => sendApplicationMail(parsed.data, { saved }), saved);
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
