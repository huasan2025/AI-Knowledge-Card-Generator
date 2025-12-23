import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cardify AI - AI 图文知识卡片生成器",
  description: "将你的灵感转化为精美的知识卡片",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className="antialiased">{children}</body>
    </html>
  );
}
