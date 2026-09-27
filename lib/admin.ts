export const KIND_LABELS = {
  listing: "掲載応募",
  radio: "ラジオ出演",
} as const;

export const STAGE_LABELS = {
  received: "受付",
  replied: "返信済",
  scheduling: "取材調整中",
  interviewed: "取材実施",
  drafting: "ドラフト中",
  review: "本人確認待ち",
  ready: "公開準備",
  published: "公開済",
  on_hold: "保留",
  declined: "辞退",
} as const;

export const SELECTION_LABELS = {
  pending: "選考前",
  selected: "出演",
  not_selected: "出演なし",
} as const;

/** フォームの回答（details）の表示名と並び順 */
export const DETAIL_LABELS: Record<string, string> = {
  profile: "バンドのプロフィール",
  content: "掲載・取材してほしい内容",
  urls: "SNS・音源のURL",
  xAccount: "X",
  base: "活動拠点",
  songUrl: "番組でかけたい曲",
  savedMoment: "音楽に救われた瞬間",
  whoToSave: "あなたの音楽は、誰を救えるか",
  members: "出演できる人数",
  consentArticle: "記事の参考にすることへの同意",
  message: "その他",
};

export type Kind = keyof typeof KIND_LABELS;
export type Stage = keyof typeof STAGE_LABELS;
export type Selection = keyof typeof SELECTION_LABELS;

export type Application = {
  id: string;
  created_at: string;
  updated_at: string;
  kind: Kind;
  band_name: string;
  contact_name: string | null;
  contact: string | null;
  purpose: string | null;
  details: Record<string, string | boolean>;
  stage: Stage;
  radio_selection: Selection | null;
  next_action: string | null;
  publish_date: string | null;
  article_url: string | null;
  memo: string | null;
  source: "form" | "import";
};

export const isKind = (v: unknown): v is Kind =>
  typeof v === "string" && v in KIND_LABELS;
export const isStage = (v: unknown): v is Stage =>
  typeof v === "string" && v in STAGE_LABELS;
export const isSelection = (v: unknown): v is Selection =>
  typeof v === "string" && v in SELECTION_LABELS;

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
