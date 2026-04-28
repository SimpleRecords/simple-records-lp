const faqs = [
  {
    q: "費用はかかりますか？",
    a: "かかりません。掲載・取材・執筆すべて無料です。",
  },
  {
    q: "どのような形式で取材を受けられますか？",
    a: "「リリース情報の掲載」はメールでの情報提供のみで完結します。「バンド紹介記事」は、メールでのやりとり、もしくは対面・オンラインでの口頭インタビューに対応しています。",
  },
  {
    q: "記事はどこで公開されますか？",
    a: "公式noteで公開し、X（旧Twitter）で告知します。公開後、バンド側からも自由にシェアいただいて構いません。",
  },
  {
    q: "応募後、いつまでに返信がもらえますか？",
    a: "3日以内にご返信します。もし4日経っても返信がない場合は、お手数ですが再送ください（迷惑メール等で届いていない可能性があります）。",
  },
];

export function Faq() {
  return (
    <section className="border-t border-neutral-200 bg-neutral-50 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <p className="font-display text-sm uppercase tracking-[0.3em] text-neutral-500">
          FAQ
        </p>
        <h2 className="mt-4 text-2xl font-light leading-relaxed sm:text-3xl">
          よくあるご質問
        </h2>
        <dl className="mt-12 space-y-10">
          {faqs.map((faq) => (
            <div
              key={faq.q}
              className="border-t border-neutral-300 pt-6 sm:grid sm:grid-cols-[auto_1fr] sm:gap-8"
            >
              <dt className="text-base font-normal text-neutral-900 sm:text-lg">
                {faq.q}
              </dt>
              <dd className="mt-3 text-sm leading-[1.9] text-neutral-600 sm:mt-0 sm:text-base">
                {faq.a}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
