# simple-records-lp

Simple Records の応募ページ。掲載応募（`/`）とラジオ出演応募（`/radio`）。

応募は Supabase の `applications` 表に1行入り、同時に通知メールが飛ぶ。

## 動かす

```bash
npm install
op run --env-file=.env.op -- npm run dev   # http://localhost:3001 ← 3000 ではない
```

## 出す前に

```bash
npm run verify   # 型チェック + テスト + build
```

## 環境変数

`lib/env.ts` が読む。欠けていると応募が例外で失敗する。

| 変数 | 用途 |
|---|---|
| `RESEND_API_KEY` `MAIL_FROM` `MAIL_TO` | 応募通知メール |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | 応募の保存先（サーバー専用） |
| `SUPABASE_ANON_KEY` | 管理ページのログイン |

DB に保存できなかった場合もメールが送れれば応募は受け付ける（件名に「[管理ページ未登録]」が付く）。

## 注意

**このリポジトリは PUBLIC。** 鍵・トークンをコードにも設定ファイルにも置かないこと。

`applications` 表に anon の権限を付けないこと（書き込みはサーバーの service_role だけ）。

設計の詳細と落とし穴は [CLAUDE.md](./CLAUDE.md)。
