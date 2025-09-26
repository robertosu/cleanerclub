'use client'

import { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import type { ChatMessage } from '@/types';

interface ChatbotProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Chatbot({ isOpen, onClose }: ChatbotProps) {
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatInput, setChatInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (chatInput.trim()) {
            const newMessage: ChatMessage = { text: chatInput, sender: 'user' };
            setChatMessages([...chatMessages, newMessage]);
            setChatInput('');

            // Simular respuesta del chatbot
            setTimeout(() => {
                const responses = [
                    "¡Hola! Gracias por contactar con WasherClub. ¿En qué puedo ayudarte hoy?",
                    "Ofrecemos servicios de limpieza a domicilio con profesionales certificados.",
                    "Puedes solicitar un presupuesto gratuito a través de nuestro formulario.",
                    "Nuestros servicios incluyen limpieza general, profunda, post-obra, ventanas y más.",
                    "¿Te gustaría saber más sobre alguno de nuestros servicios específicos?"
                ];
                const botResponse: ChatMessage = {
                    text: responses[Math.floor(Math.random() * responses.length)],
                    sender: 'bot'
                };
                setChatMessages(prev => [...prev, botResponse]);
            }, 1000);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-xl shadow-2xl flex flex-col z-50">
            <div className="bg-blue-600 text-white p-4 rounded-t-xl flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-semibold">WasherClub Bot</span>
                </div>
                <button
                    onClick={onClose}
                    className="text-white hover:text-gray-200"
                >
                    ✕
                </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {chatMessages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                        <p>¡Hola! ¿En qué puedo ayudarte hoy?</p>
                    </div>
                ) : (
                    chatMessages.map((msg, index) => (
                        <div key={index} className={`mb-3 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                            <div className={`inline-block p-3 rounded-lg ${
                                msg.sender === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-800'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))
                )}
            </div>
            <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Escribe tu mensaje..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
}