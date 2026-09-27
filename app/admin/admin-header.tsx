import Link from "next/link";
import { signOut } from "@/app/admin/actions";

export function AdminHeader() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/admin" className="text-sm tracking-wide">
          Simple Records 応募管理
        </Link>
        <form action={signOut}>
          <button type="submit" className="text-xs text-neutral-500 underline-offset-4 hover:underline">
            ログアウト
          </button>
        </form>
      </div>
    </header>
  );
}
