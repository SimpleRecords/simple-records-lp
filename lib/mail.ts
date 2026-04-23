import "server-only";
import { Resend } from "resend";
import { getMailEnv } from "@/lib/env";
import { PURPOSE_LABELS, type ApplicationInput } from "@/lib/schema";

export async function sendApplicationMail(input: ApplicationInput) {
  const env = getMailEnv();
  const resend = new Resend(env.apiKey);

  const subject = `【応募】${input.bandName}｜${PURPOSE_LABELS[input.purpose]}`;

  const text = [
    `■ 希望種別`,
    PURPOSE_LABELS[input.purpose],
    ``,
    `■ バンド名`,
    input.bandName,
    ``,
    `■ 代表者`,
    input.representativeName,
    ``,
    `■ ご連絡先`,
    input.contact,
    ``,
    `■ バンドのプロフィール`,
    input.profile,
    ``,
    `■ 掲載・取材してほしい内容`,
    input.content,
    ``,
    `■ SNS・音源URL`,
    input.urls || "（未記入）",
    ``,
    `■ その他・メッセージ`,
    input.message || "（未記入）",
    ``,
    `---`,
    `送信日時: ${new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}`,
  ].join("\n");

  const result = await resend.emails.send({
    from: env.from,
    to: env.to,
    subject,
    text,
    replyTo: extractEmail(input.contact),
  });

  if (result.error) {
    throw new Error(`Resend error: ${result.error.message}`);
  }

  return result.data;
}

/** 連絡先欄がメールアドレスならreplyToに使う。SNS URLの場合は無視 */
function extractEmail(value: string): string | undefined {
  const match = value.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  return match?.[0];
}
