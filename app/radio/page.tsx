import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { buttonVariants } from "@/components/ui/button";
import { RadioApplicationForm } from "@/components/radio-application-form";
import { Footer } from "@/components/sections/footer";
import { notFound } from "next/navigation";
import { isRadioOpen, radioCampaign as r } from "@/lib/radio";
import { siteConfig } from "@/lib/config";

const description = `${r.station}の生放送に出演するバンドを募集します。放送は${r.airDateShort}14時。聞くのは、音楽に救われた瞬間と、あなたの音楽が誰を救えるか。`;

export const metadata: Metadata = {
  title: "ラジオ生出演バンド募集｜Simple Records",
  description,
  openGraph: {
    title: "ラジオ生出演バンド募集｜Simple Records",
    description,
    type: "website",
    locale: "ja_JP",
    siteName: "Simple Records",
  },
  twitter: {
    card: "summary_large_image",
    title: "ラジオ生出演バンド募集｜Simple Records",
    description,
  },
};

const overview: [string, string][] = [
  ["放送日", r.airDate],
  ["放送局", `${r.station}。${r.listenOnline}`],
  ["出演場所", r.studio],
  ["集合時刻", r.meetingTime],
  ["出演内容", `パーソナリティとのトーク（${r.talkLength}）と、あなたの曲の音源を1曲放送`],
  ["放送用の音源", r.audioFormat],
  ["募集数", `1〜2組（1組あたり1名から${r.maxMembers}名まで出演できます）`],
  ["出演料・参加費", r.fee],
  ["交通費", r.travelCost],
  ["放送回の公開", "放送した回は、後日 YouTube・note などで公開します"],
  ["応募締切", r.deadline],
  ["結果のご連絡", `${r.resultDate}までに${r.resultNotice}へご連絡します`],
];

const conditions = [
  "バンドとして活動している方（編成・人数は問いません）",
  "現在、メジャーレーベルと契約していない方",
  `${r.airDateShort}の放送時間に、メンバーのうち1名以上が上記のスタジオへ来られる方`,
  "オリジナル曲の音源がある方",
];

const benefits: [string, string][] = [
  ["オリジナル曲を1曲、FMで", "江東区のコミュニティFM、レインボータウンFM（FM88.5）で、あなたの曲を1曲放送します。"],
  ["曲だけでなく、話す時間がある", "パーソナリティとのトークで、曲の背景やバンドのことを自分たちの言葉で話せます。"],
  ["放送回のURLが残る", "放送した回は、後日 YouTube・note で公開します。公開された回のURLは、バンドの告知で共有できます。"],
];

export default function RadioPage() {
  if (!isRadioOpen()) notFound();

  return (
    <>
      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 py-24 text-center">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-10">
            <Link href="/" aria-label={siteConfig.name}>
              <Image
                src="/logo-screen.png"
                alt={siteConfig.name}
                width={240}
                height={240}
                priority
                className="h-auto w-28 sm:w-32"
              />
            </Link>
            <p className="font-display text-sm uppercase tracking-[0.3em] text-neutral-500">
              Radio Guest Wanted
            </p>
            <h1 className="text-balance text-3xl font-light leading-[1.5] text-neutral-900 sm:text-4xl md:text-[2.75rem]">
              FM88.5の生放送に、
              <br className="hidden sm:block" />
              あなたのバンドを。
            </h1>
            <div className="flex flex-col gap-2 text-neutral-700">
              <p className="text-sm tracking-wide text-neutral-500">{r.station}</p>
              <p className="text-lg sm:text-xl">{r.programName}</p>
              <p className="text-sm text-neutral-500">
                {r.airDateShort} 14:00〜15:00・生放送
              </p>
              <p className="text-sm text-neutral-500">メンバー1人からでも出演できます</p>
            </div>
            <Link
              href="#apply"
              className={buttonVariants({
                size: "lg",
                className: "h-12 rounded-none px-10 text-base font-normal tracking-wide",
              })}
            >
              応募する
            </Link>
          </div>
        </section>

        {/* About */}
        <section className="border-t border-neutral-200 px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-2xl space-y-8 text-base leading-[2] text-neutral-700">
            <p className="font-display text-sm uppercase tracking-[0.3em] text-neutral-500">
              About
            </p>
            <p>
              Simple Records は、インディーズバンドを取材して note で紹介している音楽メディアです。
              このたび、ラジオ番組のゲストを募集します。
            </p>
            <p>
              10月から、{r.station}の{r.frame}枠で、新しい番組が始まります。
            </p>
            <div className="border-l-2 border-neutral-900 pl-6">
              <p className="text-lg text-neutral-900">{r.programName}</p>
              <p className="text-sm text-neutral-500">{r.schedule}</p>
              <p className="text-sm text-neutral-500">パーソナリティ：{r.personality}</p>
            </div>
          </div>
        </section>

        {/* Themes */}
        <section className="border-t border-neutral-200 bg-neutral-50 px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-3xl">
            <p className="font-display text-sm uppercase tracking-[0.3em] text-neutral-500">
              Themes
            </p>
            <h2 className="mt-4 text-2xl font-light leading-relaxed sm:text-3xl">
              番組で聞くのは、2つのこと
            </h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {["あなたが音楽に救われた瞬間", "あなたの音楽は、誰を救えるか"].map((theme, i) => (
                <div key={theme} className="border border-neutral-200 bg-white p-8">
                  <p className="font-display text-3xl text-neutral-400">0{i + 1}</p>
                  <p className="mt-4 text-lg leading-relaxed text-neutral-900">{theme}</p>
                </div>
              ))}
            </div>
            <p className="mt-10 text-base leading-[2] text-neutral-700">
              どんな音楽をやっているかより、なぜ音楽をやっているのかを聞く番組です。
            </p>
          </div>
        </section>

        {/* Benefits */}
        <section className="border-t border-neutral-200 px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-3xl">
            <p className="font-display text-sm uppercase tracking-[0.3em] text-neutral-500">
              Benefits
            </p>
            <h2 className="mt-4 text-2xl font-light leading-relaxed sm:text-3xl">
              出演すると
            </h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {benefits.map(([title, body]) => (
                <div key={title} className="border border-neutral-200 p-8">
                  <p className="text-lg leading-relaxed text-neutral-900">{title}</p>
                  <p className="mt-3 text-sm leading-[1.9] text-neutral-600">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Overview */}
        <section className="border-t border-neutral-200 px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-3xl">
            <p className="font-display text-sm uppercase tracking-[0.3em] text-neutral-500">
              Overview
            </p>
            <h2 className="mt-4 text-2xl font-light leading-relaxed sm:text-3xl">
              募集の概要
            </h2>
            <dl className="mt-12 divide-y divide-neutral-200 border-y border-neutral-200">
              {overview.map(([term, value]) => (
                <div key={term} className="grid gap-1 py-5 sm:grid-cols-[10rem_1fr] sm:gap-6">
                  <dt className="text-sm text-neutral-500">{term}</dt>
                  <dd className="text-base leading-relaxed text-neutral-900">{value}</dd>
                </div>
              ))}
            </dl>

            <h3 className="mt-16 text-lg font-normal">応募できる方</h3>
            <ul className="mt-6 space-y-3 text-base leading-relaxed text-neutral-700">
              {conditions.map((c) => (
                <li key={c} className="flex gap-3">
                  <span aria-hidden className="mt-3 h-px w-3 shrink-0 bg-neutral-900" />
                  {c}
                </li>
              ))}
              <li className="flex gap-3">
                <span aria-hidden className="mt-3 h-px w-3 shrink-0 bg-neutral-900" />
                <span>
                  Simple Records のXアカウント{" "}
                  <Link
                    href={siteConfig.links.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4"
                  >
                    @SimpleRecords1
                  </Link>{" "}
                  をフォローしている方
                </span>
              </li>
            </ul>

            <h3 className="mt-16 text-lg font-normal">選考</h3>
            <p className="mt-6 text-base leading-[2] text-neutral-700">
              Simple Records が行います。2つの質問への回答を読んで選びます。
            </p>

            <h3 className="mt-16 text-lg font-normal">出演にならなかった応募について</h3>
            <p className="mt-6 text-base leading-[2] text-neutral-700">
              回答は、Simple Records が記事で紹介するバンドを探すときの候補にさせてください。
              取材をお願いするときは、こちらからご連絡します。
            </p>

            <h3 className="mt-16 text-lg font-normal">初回は{r.firstBroadcast}</h3>
            <p className="mt-6 text-base leading-[2] text-neutral-700">
              初回は、パーソナリティのバンド Elizabeth.eight の回です。
              番組の雰囲気を知りたい方は、聴いてみてください。インターネットでは「リスラジ」（アプリ・Web）で聴けます。
            </p>
          </div>
        </section>

        {/* Apply */}
        <section
          id="apply"
          className="scroll-mt-20 border-t border-neutral-200 px-6 py-24 sm:py-32"
        >
          <div className="mx-auto max-w-2xl">
            <p className="font-display text-sm uppercase tracking-[0.3em] text-neutral-500">
              Apply
            </p>
            <h2 className="mt-4 text-2xl font-light leading-relaxed sm:text-3xl">
              応募フォーム
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-neutral-600 sm:text-base">
              質問は、番組と同じ2つです。締切は{r.deadline}。
            </p>
            <div className="mt-14">
              <RadioApplicationForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
