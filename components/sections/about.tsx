const audiences = [
  {
    title: "これからバンドを始めたい人",
    body: "楽器を手にした、あるいは迷っている。「自分にもできるかも」と思える最初の一歩を描きます。",
  },
  {
    title: "ライブハウスに行ったことがない人",
    body: "好きなバンドはサブスクで聴いている。その先にある「場」の手触りを、具体的に伝えます。",
  },
  {
    title: "いまバンド活動を続けている人",
    body: "演者、スタッフ、制作サイド。内輪ではなく、外にも開かれた言葉で、続けている人に敬意を。",
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
            ロックを好きでいる理由にロジックはなく、シンプルに好きだと思える。
            その純度を基盤に置き、インディーズバンドの背景や音楽への想いを記事にして発信しています。
          </p>
          <p>
            バンド・ライブハウス文化が続いていくことを支援する。
            いつかロックに救われる人がいるかもしれない、
            その入り口や、続ける理由になる場所をつくる——そんな想いで運営する個人メディアです。
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
