import './globals.css'; // Asegúrate de que la ruta a tu CSS es correcta
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'dconfy | El boca a boca de confianza',
  description: 'Encuentra profesionales recomendados por tu red de confianza.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam:ital,wght@0,100;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,300;1,400;1,500;1,600;1,700;1,800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased text-slate-900 bg-white" style={{ fontFamily: '"Be Vietnam", sans-serif' }}>
        {children}
      </body>
    </html>
  );
}