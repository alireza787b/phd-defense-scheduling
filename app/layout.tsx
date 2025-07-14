/* app/layout.tsx */
import "./globals.css";
import type { Metadata } from "next";

/* SEO ---------------------------------------------------- */
export const metadata: Metadata = {
  title: "جلسه دفاع دکتری - علیرضا قادری",
  description: "سنجش برخط هوشیاری و خستگی خدمه پروازی به کمک یادگیری ماشین",
};

/* Root layout ------------------------------------------- */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /* ————————————————————————————————————————————————
       ❶  Add the “dark” class alongside scroll-smooth so
           Tailwind’s dark-mode tokens become active.
       ———————————————————————————————————————————————— */
    <html lang="fa" dir="rtl" className="scroll-smooth">
      {/* Google font in a proper App-Router <head> file, not here. */}
      <body
        suppressHydrationWarning
        className="font-vazir bg-background text-foreground transition-colors"
      >
        {children}
      </body>
    </html>
  );
}
