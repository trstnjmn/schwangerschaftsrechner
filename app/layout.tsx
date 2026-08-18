import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import type { Viewport } from 'next'
import React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Schwangerschaftsrechner – Berechne deine SSW & Geburtstermin",
  description: "Berechne ganz einfach deine aktuelle Schwangerschaftswoche (SSW) und deinen voraussichtlichen Entbindungstermin mit unserer Entwicklungs-Zeitleiste.",
    keywords: ['Schwangerschaftsrechner', 'SSW berechnen', 'Geburtstermin Rechner', 'Ultraschall Termine', 'OGTT Zuckertest SSW'],
    openGraph: {
        title: 'Schwangerschaftsrechner – SSW & Termine berechnen',
        description: 'Übersicht über SSW, Vorsorgekontrollen und Entwicklungsstufen deines Babys.',
        type: 'website',
        locale: 'de_DE',
    },
    icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
    themeColor: '#FAF7F1',
}

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html
          lang="de"
          className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >

      <body className="min-h-full flex flex-col">
      <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'WebApplication',
                  name: 'Schwangerschaftsrechner',
                  applicationCategory: 'HealthApplication',
                  operatingSystem: 'All',
                  offers: {
                      '@type': 'Offer',
                      price: '0',
                      priceCurrency: 'EUR',
                  },
              }),
          }}
      />
      {children}
      </body>
      </html>
  );
}