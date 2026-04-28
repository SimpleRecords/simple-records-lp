const principles = [
  {
    title: "評論ではなく、体験記として書く",
    body: "「〜は優れている」ではなく、「〜で、こう感じた」。判断を下す前に、見聞きしたものを描きます。",
  },
  {
    title: "言葉のニュアンスを、削らずに残す",
    body: "インタビューの書き起こしは、話し手の言葉や口調をそのまま残して、自然な日本語に整えます。",
  },
  {
    title: "肯定を基本に、無批判にはしない",
    body: "紹介する以上、肯定に寄せる。違和感があったときは、切り捨てずに「ここで引っかかった」と書きます。",
  },
  {
    title: "固有名詞は、本人確認を取る",
    body: "楽曲名、会場名、作品名。公開前に必ず本人にチェックしてもらいます。",
  },
];

export function Editorial() {
  return (
    <section className="border-t border-neutral-200 bg-neutral-50 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <p className="font-display text-sm uppercase tracking-[0.3em] text-neutral-500">
          Editorial
        </p>
        <h2 className="mt-4 text-2xl font-light leading-relaxed sm:text-3xl">
          編集の姿勢
        </h2>
        <p className="mt-6 text-base leading-relaxed text-neutral-600">
          売れた数や星の数ではなく、バンドの背景と、音楽との向き合い方を、そのまま書きます。
        </p>
        <ul className="mt-12 space-y-10">
          {principles.map((principle, idx) => (
            <li key={principle.title} className="flex gap-6 sm:gap-8">
              <span className="font-display text-xl font-light tracking-wider text-neutral-400">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-2">
                <p className="text-base font-normal text-neutral-900 sm:text-lg">
                  {principle.title}
                </p>
                <p className="text-sm leading-relaxed text-neutral-600 sm:text-base">
                  {principle.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
