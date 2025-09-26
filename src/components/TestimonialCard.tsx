import { Star } from 'lucide-react';
import type { Testimonial } from '@/types';

interface TestimonialCardProps {
    testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
    return (
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
            </div>
            <p className="text-gray-700 mb-4 italic">&quot;{testimonial.text}&quot;</p>
            <div className="flex items-center">
                <div className="bg-gray-300 rounded-full w-10 h-10 mr-3"></div>
                <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.service}</p>
                </div>
            </div>
        </div>
    );
}
