import React from 'react';
import { Smartphone, Calendar, TrendingUp, Zap } from 'lucide-react';
import Card from '../common/Card';

const StreamliningSection = () => {
    const features = [
        {
            icon: <Smartphone size={28} />,
            iconColor: '#10b981',
            title: 'Contactless Payment',
            description: 'Secure digital payments at your fingertips. Pay with your phone and eliminate the need for cash.'
        },
        {
            icon: <Calendar size={28} />,
            iconColor: '#3b82f6',
            title: 'Smart Meal Planning',
            description: 'Preview upcoming menus and reserve your favorites in advance. Never miss out on your preferred dishes.'
        },
        {
            icon: <TrendingUp size={28} />,
            iconColor: '#8b5cf6',
            title: 'Skip the Lines',
            description: 'Pre-ordering means zero waiting. Grab your prepared meal and get on with your day.'
        },
        {
            icon: <Zap size={28} />,
            iconColor: '#f97316',
            title: 'Real-Time Notifications',
            description: 'Stay informed with instant updates on orders, menu highlights, and exclusive promotional offers.'
        }
    ];

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                        Everything You Need, All in One Place
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        A complete suite of features designed for effortless campus dining—all accessible from one intuitive platform.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} icon={feature.icon} iconColor={feature.iconColor} className="text-center">
                            <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                            <p className="text-slate-600">{feature.description}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StreamliningSection;
