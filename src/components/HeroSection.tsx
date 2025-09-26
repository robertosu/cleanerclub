interface HeroSectionProps {
    onScrollToSection: (sectionId: string) => void;
}

export default function HeroSection({ onScrollToSection }: HeroSectionProps) {
    return (
        <section id="home" className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-5xl font-bold mb-6">Limpieza Profesional a tu Alcance</h1>
                <p className="text-xl mb-8 max-w-3xl mx-auto">
                    Servicios de limpieza de alta calidad para tu hogar o negocio. Profesionales certificados,
                    productos ecológicos y precios competitivos.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => onScrollToSection('services')}
                        className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                        Ver Servicios
                    </button>
                    <button
                        onClick={() => onScrollToSection('budget')}
                        className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                    >
                        Solicitar Presupuesto
                    </button>
                </div>
            </div>
        </section>
    );
}
