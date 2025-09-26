import { CheckCircle } from 'lucide-react';
import type { Service } from '@/types';

interface ServiceCardProps {
    service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
    return (
        <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow border border-gray-200">
            <div className="text-blue-600 mb-4">{service.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
            <p className="text-gray-600 mb-4">{service.description}</p>
            <ul className="space-y-2 mb-4">
                {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {feature}
                    </li>
                ))}
            </ul>
            <div className="text-lg font-bold text-blue-600">{service.price}</div>
        </div>
    );
}