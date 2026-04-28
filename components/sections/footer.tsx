import Link from "next/link";
import { siteConfig } from "@/lib/config";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-950 px-6 py-12 text-neutral-300">
      <nav className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm">
        <Link
          href={siteConfig.links.note}
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-300 underline-offset-4 hover:text-white hover:underline"
        >
          note
        </Link>
        <Link
          href={siteConfig.links.x}
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-300 underline-offset-4 hover:text-white hover:underline"
        >
          X
        </Link>
        <Link
          href="#apply"
          className="text-neutral-300 underline-offset-4 hover:text-white hover:underline"
        >
          掲載応募フォーム
        </Link>
      </nav>
      <p className="mt-8 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} Simple Records
      </p>
    </footer>
  );
}
