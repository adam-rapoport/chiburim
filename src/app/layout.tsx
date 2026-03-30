import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["latin", "hebrew"],
});

export const metadata: Metadata = {
  title: "חיבורים — משחק חיבורים יומי בעברית",
  description: "משחק חיבורים יומי בעברית — מצאו את ארבע הקבוצות! בהשראת NYT Connections.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable}`}>
      <body className="min-h-screen font-[family-name:var(--font-heebo)] bg-[#FAFAF7] text-[#1A1A1A]">
        {children}
      </body>
    </html>
  );
}
