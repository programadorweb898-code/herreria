import type { Metadata } from "next";
import * as Sentry from "@sentry/nextjs";
import { Inter } from "next/font/google";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "600"],
  variable: "--font-inter",
});

const baseMetadata: Metadata = {
  title: "Herrería Estudio",
  description: "Muebles de hierro y madera con una estética industrial contemporánea.",
};

export function generateMetadata(): Metadata {
  const traceData = Object.fromEntries(
    Object.entries(Sentry.getTraceData()).filter(([, value]) => value !== undefined),
  ) as NonNullable<Metadata["other"]>;

  return {
    ...baseMetadata,
    other: {
      ...baseMetadata.other,
      ...traceData,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={inter.variable} lang="es">
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <ScrollToTop />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
