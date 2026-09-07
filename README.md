# simple-records-lp

Simple Records の掲載応募LP。バンドが「記事にしてほしい」と応募するための1枚ページ。

応募は Google スプレッドシートに1行追記され、同時に通知メールが飛ぶ。データベースは使っていない。

## 動かす

```bash
npm install
npm run dev      # http://localhost:3001 ← 3000 ではない
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
| `GOOGLE_SERVICE_ACCOUNT_B64` | Service Account JSON の Base64（推奨） |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | 上が無いときの代替（1行化した JSON） |
| `GOOGLE_SHEET_ID` | 追記先スプレッドシート |
| `GOOGLE_SHEET_TAB` | タブ名。省略時は先頭タブ |

スプレッドシートの設定が無い場合はメール送信のみ行い、応募自体は成功する。

## 注意

**このリポジトリは PUBLIC。** 鍵・トークンをコードにも設定ファイルにも置かないこと。

スプレッドシートへの書き込みは `valueInputOption: "RAW"`。
`USER_ENTERED` に変えると応募内容が数式として評価される。

設計の詳細と落とし穴は [CLAUDE.md](./CLAUDE.md)。
