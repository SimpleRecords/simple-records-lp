import Image from "next/image";
import Link from "next/link";
import { FaXTwitter } from "react-icons/fa6";
import { SiNote } from "react-icons/si";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";

export function Hero() {
  return (
    <section className="relative flex min-h-[88vh] flex-col items-center justify-center px-6 py-24 text-center">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-12">
        <Image
          src="/logo-screen.png"
          alt={siteConfig.name}
          width={240}
          height={240}
          priority
          className="h-auto w-44 sm:w-52"
        />
        <div className="flex flex-col gap-6">
          <h1 className="text-balance text-3xl font-light leading-[1.5] text-neutral-900 sm:text-4xl md:text-[2.75rem]">
            {siteConfig.tagline}
          </h1>
          <p className="text-balance text-base leading-relaxed text-neutral-600 sm:text-lg md:text-xl">
            {siteConfig.description}
          </p>
        </div>
        <div className="flex flex-col items-center gap-6 pt-2">
          <Link
            href="#apply"
            className={buttonVariants({
              size: "lg",
              className:
                "h-12 rounded-none px-10 text-base font-normal tracking-wide",
            })}
          >
            掲載に応募する
          </Link>
          <div className="flex items-center gap-6 text-neutral-700">
            <Link
              href={siteConfig.links.note}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="note"
              className="transition-opacity hover:opacity-60"
            >
              <SiNote className="size-6" aria-hidden />
              <span className="sr-only">note</span>
            </Link>
            <Link
              href={siteConfig.links.x}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (旧Twitter)"
              className="transition-opacity hover:opacity-60"
            >
              <FaXTwitter className="size-5" aria-hidden />
              <span className="sr-only">X</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
