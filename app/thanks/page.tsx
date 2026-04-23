import Link from "next/link";
import type { Metadata } from "next";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "応募ありがとうございました｜Simple Records",
  robots: { index: false, follow: false },
};

export default function ThanksPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-8">
        <p className="font-display text-sm uppercase tracking-[0.3em] text-neutral-500">
          Thank you
        </p>
        <h1 className="text-2xl font-light leading-relaxed text-neutral-900 sm:text-3xl">
          応募ありがとうございました
        </h1>
        <div className="space-y-4 text-sm leading-[2] text-neutral-600 sm:text-base">
          <p>
            このたびはSimple Recordsの応募フォームをご利用いただき、
            ありがとうございます。
          </p>
          <p>
            内容を確認のうえ、
            <strong className="font-normal text-neutral-900">
              3日以内
            </strong>
            にご返信いたします。
          </p>
          <p className="text-xs text-neutral-500">
            万が一返信がない場合は、迷惑メール等でお手元に届いていない可能性があります。
            <br />
            <Link
              href={`mailto:${siteConfig.email}`}
              className="underline underline-offset-4"
            >
              {siteConfig.email}
            </Link>
            まで直接ご連絡ください。
          </p>
        </div>
        <Link
          href="/"
          className={buttonVariants({
            variant: "outline",
            className:
              "mt-4 h-12 rounded-none px-10 text-base font-normal tracking-wide",
          })}
        >
          トップに戻る
        </Link>
      </div>
    </main>
  );
}
