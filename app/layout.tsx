import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const notoSansJp = Noto_Sans_JP({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Simple Records｜インディーズバンドの魅力を記事にする音楽メディア",
  description:
    "Simple Recordsは、インディーズバンドの背景や音楽への想いを記事にして届ける音楽メディアです。リリース情報の掲載・バンド紹介記事（インタビュー）の応募を受け付けています。",
  openGraph: {
    title: "Simple Records",
    description:
      "シンプルで良い音楽を、もっと多くの人に。インディーズバンドの紹介・インタビュー記事を発信する音楽メディア。",
    type: "website",
    locale: "ja_JP",
    siteName: "Simple Records",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ja"
      className={`${cormorant.variable} ${notoSansJp.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-neutral-900">
        {children}
      </body>
    </html>
  );
}
