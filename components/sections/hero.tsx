import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";

export function Hero() {
  return (
    <section className="relative flex min-h-[88vh] flex-col items-center justify-center px-6 py-24 text-center">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-10">
        <Image
          src="/logo-screen.png"
          alt={siteConfig.name}
          width={220}
          height={220}
          priority
          className="h-auto w-40 sm:w-48"
        />
        <div className="flex flex-col gap-5">
          <p className="font-display text-2xl font-light tracking-[0.2em] text-neutral-500 sm:text-3xl">
            Simple Records
          </p>
          <h1 className="text-2xl font-light leading-[1.7] text-neutral-900 sm:text-3xl">
            {siteConfig.tagline}
          </h1>
          <p className="text-base leading-relaxed text-neutral-600 sm:text-lg">
            {siteConfig.description}
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 pt-4">
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
          <div className="flex items-center gap-4 text-sm text-neutral-500">
            <Link
              href={siteConfig.links.note}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 hover:underline"
            >
              note
            </Link>
            <span className="h-3 w-px bg-neutral-300" />
            <Link
              href={siteConfig.links.x}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 hover:underline"
            >
              X
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
