import "server-only";
import { google, type sheets_v4 } from "googleapis";
import { getSheetsEnv } from "@/lib/env";
import { PURPOSE_LABELS, type ApplicationInput } from "@/lib/schema";

/**
 * 応募1件をスプレッドシートに追記する。
 * 列順: timestamp | 希望種別 | バンド名 | 代表者 | ご連絡先 | プロフィール | 掲載内容 | SNS/音源 | その他
 */
export async function appendApplicationRow(input: ApplicationInput) {
  const env = getSheetsEnv();

  const credentials = JSON.parse(env.serviceAccountJson);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const tabName = await resolveTabName(sheets, env.sheetId, env.sheetTab);

  const timestamp = new Date().toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
  });

  const row = [
    timestamp,
    PURPOSE_LABELS[input.purpose],
    input.bandName,
    input.representativeName,
    input.contact,
    input.profile,
    input.content,
    input.urls || "",
    input.message || "",
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: env.sheetId,
    range: `${tabName}!A:I`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [row],
    },
  });
}

/**
 * タブ名を解決する。
 *   - GOOGLE_SHEET_TAB が明示指定されていればそれを使う
 *   - 未指定 or 指定タブが存在しない場合、先頭のシートタブ名を自動採用
 *     （日本語環境では "シート1"、英語環境では "Sheet1" など、ロケールに応じて変わるため）
 */
async function resolveTabName(
  sheets: sheets_v4.Sheets,
  spreadsheetId: string,
  override: string
): Promise<string> {
  const meta = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "sheets.properties.title",
  });

  const titles =
    meta.data.sheets
      ?.map((s) => s.properties?.title)
      .filter((t): t is string => Boolean(t)) ?? [];

  if (titles.length === 0) {
    throw new Error("No sheets found in spreadsheet");
  }

  if (override && titles.includes(override)) {
    return override;
  }

  return titles[0];
}
