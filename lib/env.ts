/**
 * サーバー側で必要な環境変数を読み出し、欠けていれば例外を投げる。
 * Server Actionからのみ呼ばれる前提。
 */
function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optional(name: string, fallback = ""): string {
  return process.env[name] ?? fallback;
}

export function getMailEnv() {
  return {
    apiKey: required("RESEND_API_KEY"),
    from: required("MAIL_FROM"),
    to: required("MAIL_TO"),
  };
}

/**
 * Service Account認証情報を取得する。
 * 優先順位:
 *   1. GOOGLE_SERVICE_ACCOUNT_B64（推奨）— JSONをBase64エンコードしたもの
 *   2. GOOGLE_SERVICE_ACCOUNT_JSON — 1行化したJSON文字列
 */
function readServiceAccountJson(): string {
  const b64 = process.env.GOOGLE_SERVICE_ACCOUNT_B64?.trim();
  if (b64) {
    try {
      return Buffer.from(b64, "base64").toString("utf8");
    } catch (err) {
      throw new Error(`GOOGLE_SERVICE_ACCOUNT_B64 is not valid base64: ${err}`);
    }
  }

  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (raw) return raw;

  throw new Error(
    "Missing Service Account credentials. Set GOOGLE_SERVICE_ACCOUNT_B64 (recommended) or GOOGLE_SERVICE_ACCOUNT_JSON."
  );
}

export function getSheetsEnv() {
  return {
    serviceAccountJson: readServiceAccountJson(),
    sheetId: required("GOOGLE_SHEET_ID"),
    sheetTab: optional("GOOGLE_SHEET_TAB", ""),
  };
}

export function isSheetsConfigured(): boolean {
  const hasCredentials = Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_B64 ||
      process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  );
  return hasCredentials && Boolean(process.env.GOOGLE_SHEET_ID);
}
