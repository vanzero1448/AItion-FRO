import type { Metadata } from "next";
import "./globals.css"; // Файл лежит прямо в этой же папке app, поэтому просто точка
import Sidebar from "../src/components/Sidebar"; // Выходим на уровень вверх (..) и идем в src

export const metadata: Metadata = {
  title: "Aition | Executive AI CTO",
  description: "Real-time AI analysis of your engineering health.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f5f5f7] text-[#1d1d1f] flex min-h-screen antialiased selection:bg-blue-200">
        {/* Белое боковое меню */}
        <Sidebar />

        {/* Правая часть с контентом (светло-серая) */}
        <main className="flex-1 px-12 py-10 h-screen overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
