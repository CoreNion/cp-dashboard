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
  title: "Campus Dashboard",
  description: "Web上でタイマー付きの大きなデジタル時計を表示し、役に立つ情報も一目で確認できる多機能ダッシュボード。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${inter.variable} ${mPlusRounded1c.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
