import { ImageResponse } from "next/og";
import fs from "node:fs/promises";
import path from "node:path";

export const alt = "Simple Records — 音楽に救われた経験を、次の誰かへ。";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Google FontsからWeb文字を1サブセット分だけTTFで取得する。
 * Satoriはwoff2非対応。User-Agentを送らないとGoogle Fontsはtruetypeを返す。
 */
async function loadGoogleFont(
  family: string,
  weight: number,
  text: string
): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}&text=${encodeURIComponent(text)}`;
  // 注意: User-Agentヘッダを送らない（送るとwoff2が返ってくる）
  const css = await fetch(url).then((r) => r.text());
  const match = css.match(
    /src:\s*url\((.+?)\)\s*format\(['"]?(opentype|truetype)['"]?\)/
  );
  if (!match) throw new Error(`TTF/OTF font URL not found for ${family}`);
  return await fetch(match[1]).then((r) => r.arrayBuffer());
}

async function loadLogoDataUrl(): Promise<string> {
  const filePath = path.join(process.cwd(), "public/og-logo.png");
  const buffer = await fs.readFile(filePath);
  const base64 = buffer.toString("base64");
  return `data:image/png;base64,${base64}`;
}

export default async function OpengraphImage() {
  const brand = "SIMPLE RECORDS";
  const taglineLine1 = "音楽に救われた経験を、";
  const taglineLine2 = "次の誰かへ。";
  const description =
    "インディーズバンドの背景と音楽を、記事にして残す音楽メディア。";
  const allText = brand + taglineLine1 + taglineLine2 + description;

  const [notoLight, notoRegular, logoSrc] = await Promise.all([
    loadGoogleFont("Noto Sans JP", 300, allText),
    loadGoogleFont("Noto Sans JP", 400, allText),
    loadLogoDataUrl(),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          padding: "60px 100px",
          fontFamily: "NotoSansJP",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          width={180}
          height={180}
          alt=""
          style={{ marginBottom: 36 }}
        />
        <div
          style={{
            fontSize: 64,
            color: "#111",
            textAlign: "center",
            lineHeight: 1.4,
            fontWeight: 300,
            letterSpacing: "0.04em",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span>{taglineLine1}</span>
          <span>{taglineLine2}</span>
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#666",
            marginTop: 40,
            textAlign: "center",
            fontWeight: 400,
          }}
        >
          {description}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "NotoSansJP",
          data: notoLight,
          style: "normal",
          weight: 300,
        },
        {
          name: "NotoSansJP",
          data: notoRegular,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
