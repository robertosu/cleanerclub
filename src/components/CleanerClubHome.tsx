'use client';

import React, { useState, useEffect } from 'react';
import {
    MessageCircle, Phone, Mail, MapPin, Star, Clock, CheckCircle,
    Zap, Sparkles, Shield, Users, Home, Building, Car, Sofa,
    Calendar, User, PhoneCall, Send, X, Plus, Minus, Calculator, Bot
} from 'lucide-react';

// Types
interface Service {
    id: string;
    title: string;
    description: string;
    features: string[];
    basePrice: number;
    roomMultiplier: number;
    bathroomMultiplier: number;
    consultation?: boolean;
}

interface ExtraService {
    id: string;
    name: string;
    price: number;
}

interface Testimonial {
    name: string;
    rating: number;
    text: string;
    service: string;
    avatar: string;
}

interface ChatMessage {
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    isWhatsAppButton?: boolean;
}

interface TimeSlot {
    time: string;
    available: boolean;
}

interface BudgetCalculator {
    rooms: number;
    bathrooms: number;
    serviceType: string;
    extras: string[];
    frequency: string;
}

interface BookingForm {
    name: string;
    email: string;
    phone: string;
    address: string;
    date: string;
    time: string;
    serviceDetails: any;
}

type FrequencyKey = 'once' | 'weekly' | 'biweekly' | 'monthly';
type BotResponseKey = 'greeting' | 'services' | 'pricing' | 'booking' | 'human' | 'default';

interface CleanerClubHomeProps {
    services: Service[];
    extraServices: ExtraService[];
    testimonials: Testimonial[];
}

const CleanerClubHome: React.FC<CleanerClubHomeProps> = ({
                                                             services,
                                                             extraServices,
                                                             testimonials
                                                         }) => {
    // State management
    const [activeSection, setActiveSection] = useState<string>('home');
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        {
            text: "¡Hola! Soy el asistente virtual de CleanerClub. ¿En qué puedo ayudarte hoy?",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [chatInput, setChatInput] = useState<string>('');
    const [isTyping, setIsTyping] = useState<boolean>(false);

    // Budget Calculator State
    const [budgetCalculator, setBudgetCalculator] = useState<BudgetCalculator>({
        rooms: 1,
        bathrooms: 1,
        serviceType: 'general',
        extras: [],
        frequency: 'once'
    });

    // Booking State
    const [bookingForm, setBookingForm] = useState<BookingForm>({
        name: '',
        email: '',
        phone: '',
        address: '',
        date: '',
        time: '',
        serviceDetails: null
    });

    // Available time slots (simulated)
    const [availableSlots, setAvailableSlots] = useState<Record<string, TimeSlot[]>>({});
    const [selectedDate, setSelectedDate] = useState<string>('');

    // Constants
    const frequencyDiscounts: Record<FrequencyKey, { label: string; discount: number }> = {
        'once': { label: 'Una vez', discount: 0 },
        'weekly': { label: 'Semanal', discount: 0.15 },
        'biweekly': { label: 'Quincenal', discount: 0.10 },
        'monthly': { label: 'Mensual', discount: 0.05 }
    };

    // Service icons mapping
    const serviceIcons: Record<string, React.ReactElement> = {
        'general': <Home className="w-8 h-8" />,
        'deep': <Building className="w-8 h-8" />,
        'post-construction': <Car className="w-8 h-8" />,
        'windows': <Users className="w-8 h-8" />,
        'upholstery': <Sofa className="w-8 h-8" />,
        'express': <Sparkles className="w-8 h-8" />
    };

    // Bot responses simulation
    const botResponses: Record<BotResponseKey, string[]> = {
        greeting: [
            "¡Hola! Soy el asistente virtual de CleanerClub. ¿En qué puedo ayudarte hoy?",
            "¡Bienvenido a CleanerClub! ¿Necesitas información sobre nuestros servicios de limpieza?"
        ],
        services: [
            "Ofrecemos 6 tipos de servicios: Limpieza General, Profunda, Post-Obra, Ventanas, Tapicería y Express. ¿Te interesa alguno en particular?",
            "Nuestros servicios van desde limpieza básica hasta trabajos especializados. Puedes usar nuestra calculadora para obtener un presupuesto instantáneo."
        ],
        pricing: [
            "Los precios varían según el número de habitaciones y tipo de servicio. Nuestra calculadora te dará un precio exacto al instante.",
            "Ofrecemos descuentos de hasta 15% para servicios recurrentes. ¿Te gustaría conocer más detalles?"
        ],
        booking: [
            "Puedes agendar directamente aquí en la web. Selecciona tu fecha preferida y te mostraré los horarios disponibles.",
            "El proceso de agendamiento es súper fácil. Solo necesitas completar tus datos y elegir fecha y hora."
        ],
        human: [
            "Te conectaré con un asesor humano. Haz clic en el botón de WhatsApp para chatear directamente con nuestro equipo.",
            "¿Necesitas hablar con una persona? No hay problema, te redirijo a WhatsApp para atención personalizada."
        ],
        default: [
            "Interesante pregunta. ¿Te gustaría que te conecte con un asesor humano para una respuesta más detallada?",
            "No estoy seguro de cómo responder a eso. ¿Prefieres hablar con nuestro equipo de soporte?"
        ]
    };

    // Initialize available slots (simulated)
    useEffect(() => {
        const slots: Record<string, TimeSlot[]> = {};
        const today = new Date();

        for (let i = 1; i < 15; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dateString = date.toISOString().split('T')[0];

            // Skip Sundays
            if (date.getDay() !== 0) {
                slots[dateString] = [
                    { time: '08:00', available: Math.random() > 0.3 },
                    { time: '10:00', available: Math.random() > 0.3 },
                    { time: '12:00', available: Math.random() > 0.3 },
                    { time: '14:00', available: Math.random() > 0.3 },
                    { time: '16:00', available: Math.random() > 0.3 },
                    { time: '18:00', available: Math.random() > 0.3 }
                ];
            }
        }
        setAvailableSlots(slots);
    }, []);

    // Calculate price
    const calculatePrice = (): number => {
        const service = services.find(s => s.id === budgetCalculator.serviceType);
        if (!service) return 0;

        const basePrice = service.basePrice;
        const roomPrice = budgetCalculator.rooms * basePrice * service.roomMultiplier;
        const bathroomPrice = budgetCalculator.bathrooms * basePrice * service.bathroomMultiplier;

        const extrasPrice = budgetCalculator.extras.reduce((sum, extraId) => {
            const extra = extraServices.find(e => e.id === extraId);
            return sum + (extra ? extra.price : 0);
        }, 0);

        const subtotal = roomPrice + bathroomPrice + extrasPrice;
        const discount = frequencyDiscounts[budgetCalculator.frequency as FrequencyKey].discount;
        const total = subtotal * (1 - discount);

        return Math.round(total);
    };

    // Handle chat
    const handleChatSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const userMessage: ChatMessage = {
            text: chatInput,
            sender: 'user',
            timestamp: new Date()
        };

        setChatMessages(prev => [...prev, userMessage]);
        setChatInput('');
        setIsTyping(true);

        // Simulate bot response
        setTimeout(() => {
            const input = chatInput.toLowerCase();
            let responseCategory: BotResponseKey = 'default';

            if (input.includes('servicio') || input.includes('limpieza')) {
                responseCategory = 'services';
            } else if (input.includes('precio') || input.includes('costo') || input.includes('cuanto')) {
                responseCategory = 'pricing';
            } else if (input.includes('agendar') || input.includes('cita') || input.includes('horario')) {
                responseCategory = 'booking';
            } else if (input.includes('humano') || input.includes('persona') || input.includes('asesor')) {
                responseCategory = 'human';
            }

            const responses = botResponses[responseCategory];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];

            const botMessage: ChatMessage = {
                text: randomResponse,
                sender: 'bot',
                timestamp: new Date()
            };

            setIsTyping(false);
            setChatMessages(prev => [...prev, botMessage]);

            // Add WhatsApp button for human support
            if (responseCategory === 'human' || responseCategory === 'default') {
                setTimeout(() => {
                    const whatsappMessage: ChatMessage = {
                        text: "👆 Haz clic aquí para contactar a WhatsApp",
                        sender: 'bot',
                        timestamp: new Date(),
                        isWhatsAppButton: true
                    };
                    setChatMessages(prev => [...prev, whatsappMessage]);
                }, 500);
            }
        }, 1500);
    };

    // Handle booking
    const handleBooking = (e: React.FormEvent): void => {
        e.preventDefault();
        const service = services.find(s => s.id === budgetCalculator.serviceType);
        const total = calculatePrice();

        const booking = {
            ...bookingForm,
            serviceDetails: {
                service: service?.title,
                rooms: budgetCalculator.rooms,
                bathrooms: budgetCalculator.bathrooms,
                extras: budgetCalculator.extras.map(id =>
                    extraServices.find(e => e.id === id)?.name
                ).filter(Boolean),
                frequency: frequencyDiscounts[budgetCalculator.frequency as FrequencyKey].label,
                total: total
            },
            id: Date.now(),
            status: 'confirmed'
        };

        alert(`¡Reserva confirmada! 
    
Servicio: ${service?.title}
Fecha: ${bookingForm.date}
Hora: ${bookingForm.time}
Total: $${total}

Recibirás una confirmación por email y SMS.`);

        // Reset forms
        setBookingForm({
            name: '', email: '', phone: '', address: '', date: '', time: '', serviceDetails: null
        });
    };

    // Toggle extra service
    const toggleExtra = (extraId: string): void => {
        setBudgetCalculator(prev => ({
            ...prev,
            extras: prev.extras.includes(extraId)
                ? prev.extras.filter(id => id !== extraId)
                : [...prev.extras, extraId]
        }));
    };

    const scrollToSection = (sectionId: string): void => {
        setActiveSection(sectionId);
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const openWhatsApp = (): void => {
        window.open('https://wa.me/56912345678?text=Hola%20CleanerClub%2C%20necesito%20ayuda', '_blank');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-lg sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <Sparkles className="w-8 h-8 text-blue-600" />
                            <span className="text-2xl font-bold text-gray-900">CleanerClub</span>
                        </div>
                        <div className="hidden md:flex space-x-8">
                            <button onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-blue-600 transition-colors">Inicio</button>
                            <button onClick={() => scrollToSection('services')} className="text-gray-700 hover:text-blue-600 transition-colors">Servicios</button>
                            <button onClick={() => scrollToSection('calculator')} className="text-gray-700 hover:text-blue-600 transition-colors">Calculadora</button>
                            <button onClick={() => scrollToSection('booking')} className="text-gray-700 hover:text-blue-600 transition-colors">Agendar</button>
                            <button onClick={() => scrollToSection('testimonials')} className="text-gray-700 hover:text-blue-600 transition-colors">Testimonios</button>
                        </div>
                        <button
                            onClick={() => setIsChatOpen(!isChatOpen)}
                            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors relative"
                        >
                            <MessageCircle className="w-6 h-6" />
                            {chatMessages.length > 1 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {chatMessages.length - 1}
                </span>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="home" className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl font-bold mb-6">Limpieza Profesional a tu Alcance</h1>
                    <p className="text-xl mb-8 max-w-3xl mx-auto">
                        Servicios de limpieza de alta calidad para tu hogar o negocio. Profesionales certificados,
                        productos ecológicos y precios transparentes con nuestra calculadora automática.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => scrollToSection('calculator')}
                            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                        >
                            <Calculator className="w-5 h-5 inline mr-2" />
                            Calcular Precio
                        </button>
                        <button
                            onClick={() => scrollToSection('booking')}
                            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                        >
                            <Calendar className="w-5 h-5 inline mr-2" />
                            Agendar Ahora
                        </button>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestros Servicios</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Ofrecemos una amplia gama de servicios de limpieza con precios transparentes y calculadora automática
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service) => (
                            <div key={service.id} className="bg-gray-50 rounded-xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-200">
                                <div className="text-blue-600 mb-4">{serviceIcons[service.id]}</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                                <p className="text-gray-600 mb-4">{service.description}</p>
                                <ul className="space-y-2 mb-4">
                                    {service.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center text-gray-700">
                                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <div className="text-lg font-bold text-blue-600 mb-3">
                                    Desde ${service.basePrice}/hora
                                </div>
                                <button
                                    onClick={() => {
                                        setBudgetCalculator(prev => ({ ...prev, serviceType: service.id }));
                                        scrollToSection('calculator');
                                    }}
                                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Calcular Precio
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Price Calculator Section */}
            <section id="calculator" className="py-20 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Calculadora de Precios</h2>
                        <p className="text-xl text-gray-600">Obtén tu presupuesto instantáneo y transparente</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Calculator Form */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Tipo de Servicio</label>
                                    <select
                                        value={budgetCalculator.serviceType}
                                        onChange={(e) => setBudgetCalculator({...budgetCalculator, serviceType: e.target.value})}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        {services.map(service => (
                                            <option key={service.id} value={service.id}>{service.title}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">Habitaciones</label>
                                        <div className="flex items-center space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => setBudgetCalculator({...budgetCalculator, rooms: Math.max(1, budgetCalculator.rooms - 1)})}
                                                className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 transition-colors"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="text-2xl font-bold text-gray-900 w-12 text-center">{budgetCalculator.rooms}</span>
                                            <button
                                                type="button"
                                                onClick={() => setBudgetCalculator({...budgetCalculator, rooms: Math.min(10, budgetCalculator.rooms + 1)})}
                                                className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">Baños</label>
                                        <div className="flex items-center space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => setBudgetCalculator({...budgetCalculator, bathrooms: Math.max(1, budgetCalculator.bathrooms - 1)})}
                                                className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 transition-colors"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="text-2xl font-bold text-gray-900 w-12 text-center">{budgetCalculator.bathrooms}</span>
                                            <button
                                                type="button"
                                                onClick={() => setBudgetCalculator({...budgetCalculator, bathrooms: Math.min(5, budgetCalculator.bathrooms + 1)})}
                                                className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Frecuencia</label>
                                    <select
                                        value={budgetCalculator.frequency}
                                        onChange={(e) => setBudgetCalculator({...budgetCalculator, frequency: e.target.value})}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        {Object.entries(frequencyDiscounts).map(([key, value]) => (
                                            <option key={key} value={key}>
                                                {value.label} {value.discount > 0 && `(-${Math.round(value.discount * 100)}%)`}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Servicios Adicionales</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {extraServices.map(extra => (
                                            <label key={extra.id} className="flex items-center space-x-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={budgetCalculator.extras.includes(extra.id)}
                                                    onChange={() => toggleExtra(extra.id)}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="text-gray-700 text-sm">{extra.name} (+${extra.price})</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Price Summary */}
                            <div className="bg-gray-50 rounded-xl p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Resumen del Presupuesto</h3>

                                <div className="space-y-3 text-gray-700">
                                    <div className="flex justify-between">
                                        <span>Servicio:</span>
                                        <span className="font-semibold">
                      {services.find(s => s.id === budgetCalculator.serviceType)?.title}
                    </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Habitaciones:</span>
                                        <span>{budgetCalculator.rooms}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Baños:</span>
                                        <span>{budgetCalculator.bathrooms}</span>
                                    </div>
                                    {budgetCalculator.extras.length > 0 && (
                                        <div className="flex justify-between">
                                            <span>Extras:</span>
                                            <span>{budgetCalculator.extras.length}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span>Frecuencia:</span>
                                        <span>{frequencyDiscounts[budgetCalculator.frequency as FrequencyKey].label}</span>
                                    </div>

                                    {frequencyDiscounts[budgetCalculator.frequency as FrequencyKey].discount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Descuento:</span>
                                            <span>-{Math.round(frequencyDiscounts[budgetCalculator.frequency as FrequencyKey].discount * 100)}%</span>
                                        </div>
                                    )}

                                    <hr className="my-4" />

                                    <div className="flex justify-between text-xl font-bold text-blue-600">
                                        <span>Total:</span>
                                        <span>${calculatePrice()}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => scrollToSection('booking')}
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-6"
                                >
                                    Agendar Este Servicio
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Booking Section */}
            <section id="booking" className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Agenda tu Servicio</h2>
                        <p className="text-xl text-gray-600">Selecciona fecha y hora disponible para tu servicio</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <form onSubmit={handleBooking} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
                                    <input
                                        type="text"
                                        value={bookingForm.name}
                                        onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
                                    <input
                                        type="email"
                                        value={bookingForm.email}
                                        onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                                    <input
                                        type="tel"
                                        value={bookingForm.phone}
                                        onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha del servicio</label>
                                    <input
                                        type="date"
                                        value={bookingForm.date}
                                        onChange={(e) => {
                                            setBookingForm({...bookingForm, date: e.target.value, time: ''});
                                            setSelectedDate(e.target.value);
                                        }}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                                <input
                                    type="text"
                                    value={bookingForm.address}
                                    onChange={(e) => setBookingForm({...bookingForm, address: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Dirección completa donde se realizará el servicio"
                                    required
                                />
                            </div>

                            {/* Time Slots */}
                            {bookingForm.date && availableSlots[bookingForm.date] && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Horarios disponibles</label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                                        {availableSlots[bookingForm.date].map((slot) => (
                                            <button
                                                key={slot.time}
                                                type="button"
                                                disabled={!slot.available}
                                                onClick={() => setBookingForm({...bookingForm, time: slot.time})}
                                                className={`p-3 rounded-lg border text-center transition-colors ${
                                                    !slot.available
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                                                        : bookingForm.time === slot.time
                                                            ? 'bg-blue-600 text-white border-blue-600'
                                                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                                                }`}
                                            >
                                                {slot.time}
                                                {!slot.available && (
                                                    <div className="text-xs mt-1">No disponible</div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Service Summary */}
                            {calculatePrice() > 0 && (
                                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                    <h4 className="font-semibold text-blue-900 mb-2">Resumen del servicio a agendar:</h4>
                                    <div className="text-blue-800 text-sm space-y-1">
                                        <p>• Servicio: {services.find(s => s.id === budgetCalculator.serviceType)?.title}</p>
                                        <p>• {budgetCalculator.rooms} habitación(es) + {budgetCalculator.bathrooms} baño(s)</p>
                                        {budgetCalculator.extras.length > 0 && (
                                            <p>• Extras: {budgetCalculator.extras.map(id => extraServices.find(e => e.id === id)?.name).join(', ')}</p>
                                        )}
                                        <p>• Frecuencia: {frequencyDiscounts[budgetCalculator.frequency as FrequencyKey].label}</p>
                                        <p className="font-bold text-lg">• Total: ${calculatePrice()}</p>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={!bookingForm.time}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                {bookingForm.time ? 'Confirmar Reserva' : 'Selecciona un horario'}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Lo que dicen nuestros clientes</h2>
                        <p className="text-xl text-gray-600">Experiencias reales de personas satisfechas con nuestros servicios</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                                <div className="flex items-center mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <p className="text-gray-700 mb-4 italic text-sm">"{testimonial.text}"</p>
                                <div className="flex items-center">
                                    <div className="bg-blue-600 text-white rounded-full w-10 h-10 mr-3 flex items-center justify-center font-semibold text-sm">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
                                        <p className="text-xs text-gray-600">{testimonial.service}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">¿Por qué elegir CleanerClub?</h2>
                        <p className="text-xl text-gray-600">Tecnología y calidad al servicio de tu hogar</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <Bot className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Asistente IA 24/7</h3>
                            <p className="text-gray-600 text-sm">Chatbot inteligente para resolver tus dudas al instante</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <Calculator className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Precios Transparentes</h3>
                            <p className="text-gray-600 text-sm">Calculadora automática sin sorpresas ni costos ocultos</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <Clock className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Agendamiento Fácil</h3>
                            <p className="text-gray-600 text-sm">Reserva en segundos con horarios disponibles en tiempo real</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8 text-orange-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Garantía Total</h3>
                            <p className="text-gray-600 text-sm">Personal certificado y seguro de satisfacción garantizada</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
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
                            <p className="text-gray-300">+56 9 1234 5678</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <Mail className="w-8 h-8 text-blue-400 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Email</h3>
                            <p className="text-gray-300">info@cleanerclub.cl</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <MapPin className="w-8 h-8 text-blue-400 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Cobertura</h3>
                            <p className="text-gray-300">La Serena y alrededores</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <Sparkles className="w-6 h-6 text-blue-400" />
                                <span className="text-xl font-bold">CleanerClub</span>
                            </div>
                            <p className="text-gray-300 text-sm">Limpieza profesional con tecnología moderna para tu comodidad.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Servicios</h4>
                            <ul className="space-y-2 text-gray-300 text-sm">
                                <li>Limpieza General</li>
                                <li>Limpieza Profunda</li>
                                <li>Post-Construcción</li>
                                <li>Servicios Express</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Empresa</h4>
                            <ul className="space-y-2 text-gray-300 text-sm">
                                <li>Sobre Nosotros</li>
                                <li>Términos y Condiciones</li>
                                <li>Política de Privacidad</li>
                                <li>Trabajar con Nosotros</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Síguenos</h4>
                            <div className="flex space-x-4">
                                <button className="bg-blue-600 p-2 rounded hover:bg-blue-700 transition-colors">
                                    <Phone className="w-4 h-4" />
                                </button>
                                <button className="bg-green-600 p-2 rounded hover:bg-green-700 transition-colors">
                                    <MessageCircle className="w-4 h-4" />
                                </button>
                                <button className="bg-gray-600 p-2 rounded hover:bg-gray-700 transition-colors">
                                    <Mail className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <hr className="my-8 border-gray-700" />
                    <div className="text-center text-gray-400 text-sm">
                        <p>&copy; 2024 CleanerClub. Todos los derechos reservados. | Desarrollado con ❤️ en La Serena, Chile</p>
                    </div>
                </div>
            </footer>

            {/* Chatbot */}
            {isChatOpen && (
                <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-xl shadow-2xl flex flex-col z-50 border border-gray-200">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-xl flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Bot className="w-5 h-5" />
                            <span className="font-semibold">CleanerClub Bot</span>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                        <button
                            onClick={() => setIsChatOpen(false)}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                        {chatMessages.map((msg, index) => (
                            <div key={index} className={`mb-3 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                <div className={`inline-block p-3 rounded-lg max-w-xs ${
                                    msg.sender === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-sm'
                                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm'
                                }`}>
                                    {msg.isWhatsAppButton ? (
                                        <button
                                            onClick={openWhatsApp}
                                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2 text-sm"
                                        >
                                            <PhoneCall className="w-4 h-4" />
                                            <span>Contactar WhatsApp</span>
                                        </button>
                                    ) : (
                                        <p className="text-sm">{msg.text}</p>
                                    )}
                                    <div className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                                        {msg.timestamp.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="text-left mb-3">
                                <div className="inline-block bg-white text-gray-800 border border-gray-200 rounded-lg rounded-bl-sm shadow-sm p-3">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleChatSubmit} className="p-4 border-t bg-white rounded-b-xl">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder="Escribe tu mensaje..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                disabled={isTyping}
                            />
                            <button
                                type="submit"
                                disabled={isTyping || !chatInput.trim()}
                                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Quick Actions Floating Buttons */}
            <div className="fixed bottom-4 left-4 space-y-3 z-40">
                <button
                    onClick={openWhatsApp}
                    className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors hover:scale-110"
                    title="Contactar por WhatsApp"
                >
                    <PhoneCall className="w-6 h-6" />
                </button>
                <button
                    onClick={() => scrollToSection('calculator')}
                    className="bg-purple-500 text-white p-3 rounded-full shadow-lg hover:bg-purple-600 transition-colors hover:scale-110"
                    title="Calcular precio"
                >
                    <Calculator className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default CleanerClubHome;