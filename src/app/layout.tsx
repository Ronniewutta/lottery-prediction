import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LOTTO AI - Smart Lottery Prediction with Horoscope",
  description: "AI-powered lottery prediction system with horoscope integration for Thai, Vietnam, and Laos lotteries",
  keywords: ["lottery", "prediction", "horoscope", "thai lottery", "vietnam lottery", "laos lottery", "AI"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
