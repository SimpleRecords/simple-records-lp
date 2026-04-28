import Link from "next/link";
import { siteConfig } from "@/lib/config";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-950 px-6 py-16 text-neutral-300">
      <div className="mx-auto flex max-w-3xl flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-4">
          <p className="font-display text-lg font-light tracking-[0.2em] text-white">
            Simple Records
          </p>
          <p className="text-sm leading-relaxed text-neutral-400">
            インディーズバンドの背景と音楽を、書いています。
          </p>
        </div>
        <nav className="flex flex-col gap-3 text-sm">
          <Link
            href={siteConfig.links.note}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-300 underline-offset-4 hover:text-white hover:underline"
          >
            note（記事一覧）
          </Link>
          <Link
            href={siteConfig.links.x}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-300 underline-offset-4 hover:text-white hover:underline"
          >
            X（@SimpleRecords1）
          </Link>
          <Link
            href="#apply"
            className="text-neutral-300 underline-offset-4 hover:text-white hover:underline"
          >
            掲載応募フォーム
          </Link>
        </nav>
      </div>
      <div className="mx-auto mt-16 max-w-3xl border-t border-neutral-800 pt-6 text-xs text-neutral-500">
        <p>© {new Date().getFullYear()} Simple Records</p>
      </div>
    </footer>
  );
}
