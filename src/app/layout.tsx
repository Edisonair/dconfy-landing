import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({ subsets: ["latin"] });

// SEO
export const metadata: Metadata = {
  title: "dconfy | Profesionales y Servicios recomendados por gente de tu confianza",
  description: "Encuentra profesionales y servicios validados por tu círculo cercano. El boca a boca de confianza, ahora en una app gratuita.",
  keywords: ["profesionales", "servicios", "recomendaciones", "confianza", "app", "dconfy"],
  openGraph: {
    title: "dconfy | Tu red de confianza",
    description: "El boca a boca de confianza ahora en una app.",
    url: "https://dconfy.io",
    siteName: "dconfy",
    images: [
      {
        url: "https://dconfy.io/dconfy_icon.png", // La imagen que saldrá al compartir el link
        width: 1200,
        height: 630,
      }
    ],
    locale: "es_ES",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={inter.className}>
        {children}
        {/* El espía de Google Analytics */}
        <GoogleAnalytics gaId="G-9Z17DJR35R" />
      </body>
    </html>
  );
}