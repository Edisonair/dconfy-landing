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
      <body className="antialiased text-slate-900 bg-white">
        {children}
      </body>
    </html>
  );
}