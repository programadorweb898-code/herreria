import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "600"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Herrería Estudio",
  description: "Muebles de hierro y madera con una estética industrial contemporánea.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={inter.variable} lang="es">
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
