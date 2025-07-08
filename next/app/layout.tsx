import type { Metadata } from "next";
import { Inter, M_PLUS_Rounded_1c } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const mPlusRounded1c = M_PLUS_Rounded_1c({
  subsets: ["latin"],
  variable: "--font-m-plus-rounded-1c",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Campus Dashboard | 多機能デジタル時計",
  description: "Web上でタイマー付きの大きなデジタル時計を表示し、役に立つ情報も一目で確認できる多機能ダッシュボード。",
  openGraph: {
    title: "Campus Dashboard | 多機能デジタル時計",
    description: "Web上でタイマー付きの大きなデジタル時計を表示し、役に立つ情報も一目で確認できる多機能ダッシュボード。",
    images: ["https://cpd.cnion.dev/ogp.png"],
  },
  twitter: {
    card: "summary_large_image",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="apple-touch-icon" href="/pwa/apple-touch-icon@192px.png" />
      </head>
      <body
        className={`${inter.variable} ${mPlusRounded1c.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
