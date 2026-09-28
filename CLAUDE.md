@AGENTS.md

# simple-records-lp

Simple Records（音楽メディア・個人事業）の**掲載応募LP**。バンドが「記事にしてほしい」と応募するための1枚ページ。

応募が送られると、Supabase の `applications` 表に1行入り、同時にメールが飛ぶ。掲載応募（`/`）とラジオ出演応募（`/radio`）を同じ表に `kind` で分けて持つ。

---

## インフラ情報

- GitHubリポジトリ: `SimpleRecords/simple-records-lp` … **PUBLIC**
- Googleアカウント: simple.records.2022@gmail.com
- Vercelアカウント: simple.records.2022@gmail.com
- Supabase: simple.records.2022@gmail.com／プロジェクト `bpmknpjmvftfbxstwdfw`（Tokyo）。キーは 1Password「Simple Records」保管庫の `project_url` `anon_key` `service_role_key`
- 区分: Simple Records（個人事業）

⚠️ **PUBLIC リポジトリ。** GCP サービスアカウント鍵は 27d9cbf で `.gitignore` に入れた。
鍵・トークンの類はコードにも設定ファイルにも置かない（1Password の `op://` 参照を使う）。

---

## コマンド

```bash
npm run verify   # npx tsc --noEmit && npm run test:ci && npm run build（提出前はこれ）
op run --env-file=.env.op -- npm run dev   # next dev -p 3001 ← 3000 ではない。Supabase のキーを 1Password から展開する
npm run test:ci  # vitest（1回実行）
```

⚠️ **`dev` のポートは 3001。** `package.json` で `-p 3001` を指定している。
`localhost:3000` を開いても何も無い。

---

## 構成

```
app/
  page.tsx                     LP本体
  layout.tsx / opengraph-image.tsx / icon.png
  thanks/page.tsx              送信後の着地
  actions/submit-application.ts  応募の受け口（Server Action）
components/
  application-form.tsx         フォーム
  sections/                    hero / about / flow / apply / faq / footer
lib/
  schema.ts                    zod。応募の項目と検証
  db.ts                        Supabase への保存（service_role・サーバー専用）
  notify.ts                    通知メールの失敗の扱い（DB保存済みなら応募者に見せない）
  radio.ts / radio-schema.ts   ラジオ出演募集の募集内容と入力検証
supabase/migrations/           表の定義。適用は Supabase の SQL Editor に貼って実行
app/admin/                     応募の管理ページ（一覧・詳細・段階/選考/メモの更新）
  login/ auth/callback/        メールのリンクでログイン（新規ユーザーは作らない）
proxy.ts                       /admin 配下：未ログインはログイン画面へ
lib/supabase/server.ts         ログインした人の権限（RLS）で読み書きするクライアント
lib/admin.ts                   段階・種別・選考の表示名
  mail.ts                      Resend でのメール送信
  rate-limit.ts                送信回数の制限
  env.ts                       環境変数の読み出し（欠けたら例外）
  config.ts                    サイト名・連絡先・SNSリンク
test/                          schema と rate-limit の単体テスト
```

**応募1件が通る道**：フォーム → `submitApplication`（Server Action）→ ①honeypot 判定 →
②レート制限 → ③zod 検証 → ④DB保存 → ⑤メール送信 → `/thanks` へ。
DB に入らなかったときは件名の頭に「[管理ページ未登録]」を付けてメールだけで受け付ける。

---

## 応募台帳を手元から読み書きする

管理ページ（/admin）と同じ `applications` 表を、AI のセッションや手元から触るためのコマンド。service_role キーを使うので手元だけで動かす。

```bash
npm run -s apps -- list                      # 進行中（--stage all / published など、--kind radio）
npm run -s apps -- show <id|バンド名>
npm run -s apps -- add --band <名前> --purpose <種別> --stage replied --next "<次アクション>"
npm run -s apps -- update <id|バンド名> --stage drafting --next "<次アクション>" --memo-append "<追記>"
```

別のフォルダからは `npm run -s apps --prefix ~/ai-projects/projects/simple-records-lp -- list`。
同じバンド名が複数あるときは、進行中が1件ならそれを選び、それ以外は id を求めて止まる。

## 環境変数

`lib/env.ts` が読む。**欠けていると例外を投げて応募が失敗する**（黙って落ちない設計）。

| 変数 | 用途 |
|---|---|
| `RESEND_API_KEY` `MAIL_FROM` `MAIL_TO` | 応募通知メール |
| `SUPABASE_URL` `SUPABASE_SERVICE_ROLE_KEY` | 応募の保存（サーバー専用） |
| `SUPABASE_ANON_KEY` | 管理ページのログイン（`SUPABASE_URL` と組み合わせる） |

DB が未設定・停止中でも、メールが送れれば応募は受け付ける（応募を落とさないための設計）。

---

## 落とし穴

- ⚠️ **`applications` に anon の権限を付けないこと。**書き込みはサーバーの service_role だけ、
  閲覧・更新は `admin_users` に載ったログインユーザーだけ（RLS）。
- ⚠️ Supabase の無料プランは、しばらくアクセスが無いとプロジェクトが一時停止する。停止中の応募は「[管理ページ未登録]」メールで届く。
- ⚠️ **レート制限はプロセス内のメモリで持っている**（3回/分/IP）。
  Vercel が複数インスタンスに分かれると、インスタンスごとに別カウントになる。
  厳密にするなら Upstash などの外部ストアに置き換える（`lib/rate-limit.ts` 冒頭に同じ注記）。
- honeypot（`website` フィールド）に入力があると、**エラーを返さず静かに `/thanks` へ送る**。
  bot に「弾かれた」と教えないための挙動なので、バグではない。

---

## 現在地（2026-09-27 時点）

- 応募の保存先は Supabase。`/radio`（12/23放送のゲスト募集）と `/admin`（応募管理）がある
- 2026-09-27 PR #2 マージ・本番反映。応募ボードの20件を `applications` に移行済み（`source='import'`）、テスト応募は削除済み。以後の台帳の正本はこの表（AI は `npm run apps`）
- 本番でメールのリンクからのログインを確認済み（2026-09-27 オーナー）。`npm run apps` は PR #3 でマージ済み
- `/radio` は `lib/radio.ts` に【要確認】が1つでも残ると本番で404になる。2026-09-27 に全項目を埋めて本番公開（PR #5）
- Next.js（`app/` ルーター）+ Tailwind + shadcn/base-ui。Sentry 導入済み（`instrumentation*.ts`）
- セキュリティ対応は Phase 1 が main に入っている（鍵の除外・レート制限。数式インジェクション対策はスプレッドシート廃止で不要になった）
- テストは `schema` `rate-limit` `radio-schema` `notify` の4本
- **`node_modules` が無い状態で置かれていることがある。** その場合 `npm install` から
- ビルドが `next/font/google queries have exactly one entry` で落ちることがある（Google Fonts の取得失敗）。もう一度流すと通る
