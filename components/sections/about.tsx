const audiences = [
  {
    title: "これからバンドを始めたい人",
    body: "楽器を手にした、迷っている、これから買うか考えている。最初の一歩がどんな景色かを、記事にしています。",
  },
  {
    title: "ライブハウスに行ったことがない人",
    body: "サブスクで聴く先にある「場」の手触り。チケットの買い方も、当日の動線も、固有名詞のまま伝えます。",
  },
  {
    title: "いまバンド活動を続けている人",
    body: "演者、スタッフ、制作サイド。内輪に閉じない言葉で、続けている人と、その周りを書きます。",
  },
];

export function About() {
  return (
    <section className="border-t border-neutral-200 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <p className="font-display text-sm uppercase tracking-[0.3em] text-neutral-500">
          About
        </p>
        <h2 className="mt-4 text-2xl font-light leading-relaxed sm:text-3xl">
          Simple Records について
        </h2>
        <div className="mt-10 space-y-6 text-base leading-[2] text-neutral-700 sm:text-lg">
          <p>
            ロックに救われた経験が、このメディアの起点にあります。
            好きでいる理由にロジックはなく、シンプルに、好き。
            その純度のまま、インディーズバンドの背景と音楽を記事にしています。
          </p>
          <p>
            バンドとライブハウスの文化が、誰かの入り口になり、誰かの続ける理由になる——
            そのために、個人で書いています。
          </p>
        </div>

        <div className="mt-20">
          <h3 className="text-lg font-normal text-neutral-900">
            こんな人に届けたい
          </h3>
          <ul className="mt-8 grid gap-8 sm:grid-cols-3 sm:gap-6">
            {audiences.map((audience) => (
              <li
                key={audience.title}
                className="flex flex-col gap-3 border-t border-neutral-300 pt-5"
              >
                <p className="text-base font-normal text-neutral-900">
                  {audience.title}
                </p>
                <p className="text-sm leading-relaxed text-neutral-600">
                  {audience.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
