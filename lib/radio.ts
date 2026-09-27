/**
 * ラジオ出演バンド募集（2026-12-23 放送回）の募集内容。
 * ページ本文・フォーム・通知メールはすべてここを参照する。
 *
 * 【要確認】の値は、公開前にオーナーが決めて埋める。
 * test/radio-schema.test.ts の `it.todo` が残っている間は未確定の値がある。
 */
export const radioCampaign = {
  station: "レインボータウンFM（FM88.5）",
  frame: "「Juke Hit☆Magic」第4水曜",
  programName: "Elizabeth.eightミワユータの ロックンナイチンゲール",
  personality: "ミワユータ（ロックバンド Elizabeth.eight のボーカル）",
  schedule: "毎月第4水曜 14:00〜15:00・生放送",
  listenOnline: "インターネットでは「リスラジ」で同時に聴けます",

  airDate: "2026年12月23日（水）14:00〜15:00・生放送",
  airDateShort: "12月23日（水）",
  deadline: "2026年11月15日（日）",
  resultDate: "11月22日（日）",
  firstBroadcast: "10月28日（水）14時",

  studio: "東京都江東区のスタジオ（場所は、出演が決まった方にお知らせします）",
  meetingTime: "出演が決まった方に、別途お知らせします",
  audioFormat: "形式と提出方法は、出演が決まった方にお知らせします",
  fee: "どちらもありません",
  travelCost: "各自でご負担ください（お支払いはありません）",
  resultNotice: "出演をお願いする方には、11月22日（日）までにメールでご連絡します",
} as const;

export const RADIO_PLACEHOLDER = "【要確認";

/** 未確定の値が残っている間は、本番では募集ページを出さない（プレビュー・手元では見える） */
export function isRadioOpen(): boolean {
  const unresolved = Object.values(radioCampaign).some((v) => v.includes(RADIO_PLACEHOLDER));
  return !(unresolved && process.env.VERCEL_ENV === "production");
}
