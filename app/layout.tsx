/* app/layout.tsx */
import './globals.css';
import { vazir } from './fonts';

import type { Metadata } from "next";

/* SEO ---------------------------------------------------- */
export const metadata: Metadata = {
  title: "جلسه دفاع دکتری - علیرضا قادری",
  description: "سنجش برخط هوشیاری و خستگی خدمه پروازی به کمک یادگیری ماشین",
};

/* Root layout ------------------------------------------- */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={`scroll-smooth ${vazir.className}`}>
      <body suppressHydrationWarning className={`bg-background text-foreground transition-colors ${vazir.className}`}>
        {children}
      </body>
    </html>
  );
}
