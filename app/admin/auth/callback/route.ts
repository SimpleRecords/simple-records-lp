import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createSessionClient } from "@/lib/supabase/server";

/**
 * メールのログインリンクの着地。セッションを作って一覧へ。
 *   ?code=...                 … 標準のメール（同じブラウザで開いたとき）
 *   ?token_hash=...&type=...  … メール本文のリンクを token_hash 形式にしたとき（別の端末で開いても通る）
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const code = params.get("code");
  const tokenHash = params.get("token_hash");
  const type = params.get("type") as EmailOtpType | null;

  const supabase = await createSessionClient();
  const { error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : tokenHash && type
      ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
      : { error: new Error("missing code") };

  if (!error) return NextResponse.redirect(new URL("/admin", request.url));
  console.error("[admin callback]", error.message);
  return NextResponse.redirect(new URL("/admin/login?error=1", request.url));
}
