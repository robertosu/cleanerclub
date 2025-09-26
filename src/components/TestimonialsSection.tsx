import TestimonialCard from './TestimonialCard';
import type { Testimonial } from '@/types';

export default function TestimonialsSection() {
    const testimonials: Testimonial[] = [
        {
            name: "María Rodríguez",
            rating: 5,
            text: "Excelente servicio! Mi casa quedó impecable y el personal fue muy profesional.",
            service: "Limpieza General"
        },
        {
            name: "Carlos Méndez",
            rating: 5,
            text: "Contraté la limpieza post-obra y quedé impresionado con los resultados. Totalmente recomendado.",
            service: "Limpieza Post-Obra"
        },
        {
            name: "Ana López",
            rating: 4,
            text: "Muy buenos precios y calidad. El servicio express me salvó cuando tuve visitas sorpresa.",
            service: "Servicio Express"
        }
    ];

    return (
        <section id="testimonials" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Lo que dicen nuestros clientes</h2>
                    <p className="text-xl text-gray-600">Experiencias reales de personas satisfechas con nuestros servicios</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard key={index} testimonial={testimonial} />
                    ))}
                </div>
            </div>
        </section>
    );
}