import "server-only";
import { Resend } from "resend";
import { getMailEnv } from "@/lib/env";
import { PURPOSE_LABELS, type ApplicationInput } from "@/lib/schema";
import type { RadioApplicationInput } from "@/lib/radio-schema";
import { radioCampaign } from "@/lib/radio";

/** DB に保存できなかった応募の件名の頭。管理ページに出ないので、このメールから手で拾う */
const UNSAVED = "[管理ページ未登録] ";

export async function sendApplicationMail(
  input: ApplicationInput,
  { saved }: { saved: boolean }
) {
  const env = getMailEnv();
  const resend = new Resend(env.apiKey);

  const subject = `${saved ? "" : UNSAVED}【応募】${input.bandName}｜${PURPOSE_LABELS[input.purpose]}`;

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

export async function sendRadioApplicationMail(
  input: RadioApplicationInput,
  { saved }: { saved: boolean }
) {
  const env = getMailEnv();
  const resend = new Resend(env.apiKey);

  const subject = `${saved ? "" : UNSAVED}【ラジオ出演応募】${input.bandName}｜${radioCampaign.airDateShort}`;

  const text = [
    `■ バンド名`,
    input.bandName,
    ``,
    `■ ご担当者`,
    input.contactName,
    ``,
    `■ メールアドレス`,
    input.email,
    ``,
    `■ X`,
    input.xAccount,
    ``,
    `■ 活動拠点`,
    input.base,
    ``,
    `■ 番組でかけたい曲`,
    input.songUrl,
    ``,
    `■ 音楽に救われた瞬間`,
    input.savedMoment,
    ``,
    `■ あなたの音楽は、誰を救えるか`,
    input.whoToSave,
    ``,
    `■ 出演できる人数`,
    input.members,
    ``,
    `■ 記事の参考にすることへの同意`,
    input.consentArticle === "on" ? "同意する" : "同意しない",
    ``,
    `■ その他`,
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
    replyTo: input.email,
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
