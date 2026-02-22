import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

export const metadata: Metadata = {
  title: "Hafsa'nın Oyunları 🌈",
  description: "İyilik dolu bir oyun dünyası!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${quicksand.variable} font-sans antialiased overflow-x-hidden transition-colors duration-500`}>
        {children}
      </body>
    </html>
  );
}
