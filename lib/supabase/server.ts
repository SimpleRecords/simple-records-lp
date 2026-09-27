import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * 管理ページ用。ログインしている人の権限（RLS）で読み書きする。
 * 応募の保存（service_role）は lib/db.ts。
 */
export async function createSessionClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (list) => {
          try {
            list.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component からは書けない。セッションの更新は proxy.ts が行う
          }
        },
      },
    }
  );
}
