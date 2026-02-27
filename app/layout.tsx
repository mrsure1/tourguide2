import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const sans = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Korea Guide Match - 프리미엄 한국 여행 가이드 매칭",
  description: "외국인/내국인 여행자와 현지 가이드를 일정, 지역, 언어별로 일대일 매칭해주는 플랫폼입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${sans.variable} antialiased min-h-screen flex flex-col bg-slate-50`}>
        {children}
      </body>
    </html>
  );
}
