import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "CYCLOSA HRM | Enterprise Human Capital Management",
    template: "%s | CYCLOSA HRM",
  },
  description: "Hệ thống Quản trị Nhân sự & Vận hành Doanh nghiệp Toàn diện - FSI Enterprise HCM",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning className={inter.variable}>
      <body className={`${inter.className} font-sans antialiased text-foreground bg-background`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
