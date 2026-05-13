import { Metadata } from 'next';
import DirectoryClient from './DirectoryClient';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export const metadata: Metadata = {
    title: 'Explorar Profesionales | dconfy',
    description: 'Encuentra a los mejores profesionales y servicios recomendados. Busca por profesión, especialidad y ubicación en dconfy.',
    openGraph: {
        title: 'Explorar Profesionales | dconfy',
        description: 'Encuentra a los mejores profesionales y servicios recomendados. Busca por profesión, especialidad y ubicación en dconfy.',
        url: 'https://dconfy.app/explorar',
        siteName: 'dconfy',
        images: [
            {
                url: 'https://dconfy.app/icon.png',
                width: 512,
                height: 512,
                alt: 'dconfy Logo'
            }
        ]
    }
};

export default function DirectorioPage() {
    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans selection:bg-violet-200">
            <Header />
            <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <DirectoryClient />
            </main>
            <Footer />
        </div>
    );
}
