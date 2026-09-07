@AGENTS.md

# simple-records-lp

Simple Records（音楽メディア・個人事業）の**掲載応募LP**。バンドが「記事にしてほしい」と応募するための1枚ページ。

応募が送られると、Google スプレッドシートに1行追記され、同時にメールが飛ぶ。DB は無い。

---

## インフラ情報

- GitHubリポジトリ: `SimpleRecords/simple-records-lp` … **PUBLIC**
- Googleアカウント: simple.records.2022@gmail.com
- Vercelアカウント: simple.records.2022@gmail.com
- Supabase: 不要（応募先はスプレッドシート）
- 区分: Simple Records（個人事業）

⚠️ **PUBLIC リポジトリ。** GCP サービスアカウント鍵は 27d9cbf で `.gitignore` に入れた。
鍵・トークンの類はコードにも設定ファイルにも置かない（1Password の `op://` 参照を使う）。

---

## コマンド

```bash
npm run verify   # npx tsc --noEmit && npm run test:ci && npm run build（提出前はこれ）
npm run dev      # next dev -p 3001 ← 3000 ではない
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
  sheets.ts                    Google Sheets への追記
  mail.ts                      Resend でのメール送信
  rate-limit.ts                送信回数の制限
  env.ts                       環境変数の読み出し（欠けたら例外）
  config.ts                    サイト名・連絡先・SNSリンク
test/                          schema と rate-limit の単体テスト
```

**応募1件が通る道**：フォーム → `submitApplication`（Server Action）→ ①honeypot 判定 →
②レート制限 → ③zod 検証 → ④スプレッドシート追記 → ⑤メール送信 → `/thanks` へ。

---

## 環境変数

`lib/env.ts` が読む。**欠けていると例外を投げて応募が失敗する**（黙って落ちない設計）。

| 変数 | 用途 |
|---|---|
| `RESEND_API_KEY` `MAIL_FROM` `MAIL_TO` | 応募通知メール |
| `GOOGLE_SERVICE_ACCOUNT_B64` | Service Account の JSON を Base64 にしたもの（**推奨**） |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | 上が無いときの代替。1行化した JSON |
| `GOOGLE_SHEET_ID` | 追記先のスプレッドシート |
| `GOOGLE_SHEET_TAB` | タブ名。省略可（省略時は先頭タブを解決） |

スプレッドシートの設定が無いときは `isSheetsConfigured()` が false を返し、
**メールだけ飛んで応募自体は成功する**（応募を落とさないための設計）。

---

## 落とし穴

- ⚠️ **スプレッドシートへの書き込みは `valueInputOption: "RAW"` を変えないこと。**
  `USER_ENTERED` に戻すと、応募者が `=IMPORTXML(...)` と入力したときに
  スプレッドシート側で数式として評価される（f26f0b7 で塞いだ）。
- ⚠️ **レート制限はプロセス内のメモリで持っている**（3回/分/IP）。
  Vercel が複数インスタンスに分かれると、インスタンスごとに別カウントになる。
  厳密にするなら Upstash などの外部ストアに置き換える（`lib/rate-limit.ts` 冒頭に同じ注記）。
- honeypot（`website` フィールド）に入力があると、**エラーを返さず静かに `/thanks` へ送る**。
  bot に「弾かれた」と教えないための挙動なので、バグではない。

---

## 現在地（2026-09-07 時点）

- Next.js（`app/` ルーター）+ Tailwind + shadcn/base-ui。Sentry 導入済み（`instrumentation*.ts`）
- セキュリティ対応は Phase 1 が main に入っている（数式インジェクション・鍵の除外・レート制限）
- テストは `schema` と `rate-limit` の2本
- **`node_modules` が無い状態で置かれていることがある。** その場合 `npm install` から
