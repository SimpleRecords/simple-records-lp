"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSessionClient } from "@/lib/supabase/server";
import { isSelection, isStage } from "@/lib/admin";
import { rateLimit, getServerActionIp } from "@/lib/rate-limit";

export type LoginState = { sent?: boolean; message?: string };

/**
 * ログイン用のリンクをメールで送る。新しいユーザーは作らない（shouldCreateUser: false）。
 * 登録されていないアドレスでも同じ表示を返す（誰が管理者かを外に教えない）。
 */
export async function sendLoginLink(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { message: "メールアドレスを入力してください" };

  const ip = await getServerActionIp();
  if (!rateLimit(`login:${ip}`, 3, 60_000).ok) {
    return { message: "しばらく時間をおいてから再度お試しください" };
  }

  const h = await headers();
  const origin = `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host")}`;

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: `${origin}/admin/auth/callback`,
    },
  });
  if (error) console.error("[admin login]", error.message);

  return { sent: true };
}

export async function signOut() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

const text = (v: FormDataEntryValue | null, max: number) => {
  const s = String(v ?? "").trim();
  return s ? s.slice(0, max) : null;
};

export async function updateApplication(id: string, formData: FormData) {
  const stage = formData.get("stage");
  const selection = formData.get("radio_selection");
  const publishDate = text(formData.get("publish_date"), 10);

  const patch: Record<string, unknown> = {
    next_action: text(formData.get("next_action"), 1000),
    article_url: text(formData.get("article_url"), 500),
    memo: text(formData.get("memo"), 10000),
    publish_date: publishDate && /^\d{4}-\d{2}-\d{2}$/.test(publishDate) ? publishDate : null,
  };
  if (isStage(stage)) patch.stage = stage;
  if (formData.has("radio_selection")) {
    patch.radio_selection = isSelection(selection) ? selection : null;
  }

  const supabase = await createSessionClient();
  const { error } = await supabase.from("applications").update(patch).eq("id", id);
  if (error) {
    console.error("[admin update]", error.message);
    redirect(`/admin/${id}?error=1`);
  }

  revalidatePath("/admin");
  redirect(`/admin/${id}?saved=1`);
}
