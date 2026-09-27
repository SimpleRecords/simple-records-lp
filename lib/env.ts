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

export function getMailEnv() {
  return {
    apiKey: required("RESEND_API_KEY"),
    from: required("MAIL_FROM"),
    to: required("MAIL_TO"),
  };
}

/**
 * 応募の保存先（Supabase）。service_role キーはサーバー側だけで使う。
 * NEXT_PUBLIC_ を付けないこと（ブラウザに渡る）。
 */
export function getSupabaseAdminEnv() {
  return {
    url: required("SUPABASE_URL"),
    serviceRoleKey: required("SUPABASE_SERVICE_ROLE_KEY"),
  };
}

export function isDbConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
