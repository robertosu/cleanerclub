'use client'

import { useState } from 'react';
import type { BudgetForm as BudgetFormType } from '@/types';

export default function BudgetForm() {
    const [budgetForm, setBudgetForm] = useState<BudgetFormType>({
        name: '',
        email: '',
        phone: '',
        serviceType: 'general',
        address: '',
        date: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('¡Gracias por tu solicitud! Nos pondremos en contacto contigo pronto para confirmar tu presupuesto.');
        setBudgetForm({
            name: '',
            email: '',
            phone: '',
            serviceType: 'general',
            address: '',
            date: '',
            message: ''
        });
    };

    return (
        <section id="budget" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Solicita tu Presupuesto</h2>
                    <p className="text-xl text-gray-600">Completa el formulario y recibirás una cotización personalizada</p>
                </div>
                <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
                                <input
                                    type="text"
                                    value={budgetForm.name}
                                    onChange={(e) => setBudgetForm({...budgetForm, name: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
                                <input
                                    type="email"
                                    value={budgetForm.email}
                                    onChange={(e) => setBudgetForm({...budgetForm, email: e.target.value})}
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
                                    value={budgetForm.phone}
                                    onChange={(e) => setBudgetForm({...budgetForm, phone: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de servicio</label>
                                <select
                                    value={budgetForm.serviceType}
                                    onChange={(e) => setBudgetForm({...budgetForm, serviceType: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="general">Limpieza General</option>
                                    <option value="deep">Limpieza Profunda</option>
                                    <option value="post-construction">Post-Obra</option>
                                    <option value="windows">Ventanas</option>
                                    <option value="upholstery">Tapicería</option>
                                    <option value="express">Express</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                            <input
                                type="text"
                                value={budgetForm.address}
                                onChange={(e) => setBudgetForm({...budgetForm, address: e.target.value})}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha preferida</label>
                            <input
                                type="date"
                                value={budgetForm.date}
                                onChange={(e) => setBudgetForm({...budgetForm, date: e.target.value})}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje adicional</label>
                            <textarea
                                value={budgetForm.message}
                                onChange={(e) => setBudgetForm({...budgetForm, message: e.target.value})}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Solicitar Presupuesto
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}