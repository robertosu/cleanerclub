import { Phone, Mail, MapPin } from 'lucide-react';

export default function ContactSection() {
    return (
        <section className="py-20 bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Contáctanos</h2>
                    <p className="text-xl text-gray-300">Estamos aquí para ayudarte con todas tus necesidades de limpieza</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="flex flex-col items-center">
                        <Phone className="w-8 h-8 text-blue-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Teléfono</h3>
                        <p className="text-gray-300">+1 (555) 123-4567</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <Mail className="w-8 h-8 text-blue-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Email</h3>
                        <p className="text-gray-300">info@washerclub.com</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <MapPin className="w-8 h-8 text-blue-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Dirección</h3>
                        <p className="text-gray-300">123 Calle Principal, Ciudad</p>
                    </div>
                </div>
            </div>
        </section>
    );
}