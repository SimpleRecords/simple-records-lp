import Link from "next/link";
import type { Metadata } from "next";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";
import { notFound } from "next/navigation";
import { isRadioOpen, radioCampaign as r } from "@/lib/radio";

export const metadata: Metadata = {
  title: "応募ありがとうございました｜Simple Records",
  robots: { index: false, follow: false },
};

export default function RadioThanksPage() {
  if (!isRadioOpen()) notFound();

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
            {r.resultDate}までに、{r.resultNotice}へご連絡します。
          </p>
          <p>
            初回放送は{r.firstBroadcast}。{r.listenOnline}。
          </p>
          <p className="text-xs text-neutral-500">
            ご不明な点は
            <Link href={`mailto:${siteConfig.email}`} className="underline underline-offset-4">
              {siteConfig.email}
            </Link>
            までご連絡ください。
          </p>
        </div>
        <Link
          href="/radio"
          className={buttonVariants({
            variant: "outline",
            className: "mt-4 h-12 rounded-none px-10 text-base font-normal tracking-wide",
          })}
        >
          募集ページに戻る
        </Link>
      </div>
    </main>
  );
}
