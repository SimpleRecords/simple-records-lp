const steps = [
  {
    step: "01",
    title: "応募フォームから送信",
    body: "必須項目のみで2〜3分。希望種別（リリース情報／バンド紹介）に応じて内容をお書きください。",
  },
  {
    step: "02",
    title: "3日以内にご連絡",
    body: "いただいた連絡先宛に、こちらから折り返します。内容に応じて取材・掲載の進め方をご相談します。",
  },
  {
    step: "03",
    title: "取材・執筆",
    body: "リリース情報の掲載は、お送りいただいた情報をもとに記事化。バンド紹介は、メールまたは口頭でのインタビューを行います。",
  },
  {
    step: "04",
    title: "原稿確認のうえ、公開",
    body: "固有名詞の確認を含め、公開前に必ず原稿をお送りします。確認後、noteで公開し、Xで告知します。",
  },
];

export function Flow() {
  return (
    <section className="border-t border-neutral-200 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <p className="font-display text-sm uppercase tracking-[0.3em] text-neutral-500">
          Flow
        </p>
        <h2 className="mt-4 text-2xl font-light leading-relaxed sm:text-3xl">
          応募から公開までの流れ
        </h2>
        <ol className="mt-14 space-y-12">
          {steps.map((step) => (
            <li
              key={step.step}
              className="grid gap-3 sm:grid-cols-[80px_1fr] sm:gap-8"
            >
              <span className="font-display text-2xl font-light tracking-wider text-neutral-400">
                {step.step}
              </span>
              <div className="flex flex-col gap-3">
                <p className="text-base font-normal text-neutral-900 sm:text-lg">
                  {step.title}
                </p>
                <p className="text-sm leading-[1.9] text-neutral-600 sm:text-base">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
