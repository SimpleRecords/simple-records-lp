"use server";

import { redirect } from "next/navigation";
import { radioApplicationSchema } from "@/lib/radio-schema";
import { sendRadioApplicationMail } from "@/lib/mail";
import { saveRadioApplication } from "@/lib/db";
import { isRadioOpen } from "@/lib/radio";
import { rateLimit, getServerActionIp } from "@/lib/rate-limit";
import type { FormState } from "@/app/actions/submit-application";
import { notify } from "@/lib/notify";

const FIELDS = [
  "bandName",
  "contactName",
  "email",
  "xAccount",
  "base",
  "songUrl",
  "savedMoment",
  "whoToSave",
  "members",
  "canAttend",
  "consentArchive",
  "consentArticle",
  "message",
] as const;

export async function submitRadioApplication(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  if (!isRadioOpen()) {
    return { ok: false, message: "現在、応募を受け付けていません。" };
  }

  // Honeypot
  if (formData.get("website")) {
    redirect("/radio/thanks");
  }

  const ip = await getServerActionIp();
  const rl = rateLimit(`radio:${ip}`, 3, 60_000);
  if (!rl.ok) {
    const waitSec = Math.ceil((rl.resetAt - Date.now()) / 1000);
    return {
      ok: false,
      message: `送信回数の上限に達しました。${waitSec}秒後に再度お試しください。`,
    };
  }

  const raw = Object.fromEntries(
    FIELDS.map((key) => [key, String(formData.get(key) ?? "")])
  ) as Record<(typeof FIELDS)[number], string>;

  const parsed = radioApplicationSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      message: "入力内容をご確認ください",
      values: raw,
    };
  }

  try {
    const saved = await saveRadioApplication(parsed.data);
    await notify(() => sendRadioApplicationMail(parsed.data, { saved }), saved);
  } catch (err) {
    console.error("[submit-radio-application]", err);
    return {
      ok: false,
      message:
        "送信中にエラーが発生しました。時間をおいて再度お試しいただくか、simple.records.2022@gmail.com まで直接ご連絡ください。",
      values: raw,
    };
  }

  redirect("/radio/thanks");
}
