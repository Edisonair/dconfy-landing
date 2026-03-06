import type { Metadata } from "next";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google';

// SEO
export const metadata: Metadata = {
  title: "dconfy | Profesionales y Servicios recomendados por gente de tu confianza",
  description: "Encuentra profesionales y servicios validados por tu círculo cercano. El boca a boca de confianza, ahora en una app gratuita.",
  keywords: ["profesionales", "servicios", "recomendaciones", "confianza", "app", "dconfy"],
  openGraph: {
    title: "dconfy | Tu red de confianza",
    description: "El boca a boca de confianza, ahora en una app.",
    url: "https://dconfy.app",
    siteName: "dconfy",
    images: [
      {
        url: "https://dconfy.app/dconfy_icon.png", // La imagen que saldrá al compartir el link
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam:ital,wght@0,100;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,300;1,400;1,500;1,600;1,700;1,800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans text-slate-900 bg-white" style={{ fontFamily: '"Be Vietnam", sans-serif' }}>
        {children}
        {/* El espía de Google Analytics */}
        <GoogleAnalytics gaId="G-9Z17DJR35R" />
      </body>
    </html>
  );
}