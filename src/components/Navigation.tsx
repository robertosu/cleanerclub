'use client'

import { MessageCircle, Sparkles } from 'lucide-react';

interface NavigationProps {
    onScrollToSection: (sectionId: string) => void;
    onToggleChat: () => void;
}

export default function Navigation({ onScrollToSection, onToggleChat }: NavigationProps) {
    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-2">
                        <Sparkles className="w-8 h-8 text-blue-600" />
                        <span className="text-2xl font-bold text-gray-900">WasherClub</span>
                    </div>
                    <div className="hidden md:flex space-x-8">
                        <button onClick={() => onScrollToSection('home')} className="text-gray-700 hover:text-blue-600 transition-colors">
                            Inicio
                        </button>
                        <button onClick={() => onScrollToSection('services')} className="text-gray-700 hover:text-blue-600 transition-colors">
                            Servicios
                        </button>
                        <button onClick={() => onScrollToSection('budget')} className="text-gray-700 hover:text-blue-600 transition-colors">
                            Presupuesto
                        </button>
                        <button onClick={() => onScrollToSection('testimonials')} className="text-gray-700 hover:text-blue-600 transition-colors">
                            Testimonios
                        </button>
                    </div>
                    <button
                        onClick={onToggleChat}
                        className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                    >
                        <MessageCircle className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </nav>
    );
}