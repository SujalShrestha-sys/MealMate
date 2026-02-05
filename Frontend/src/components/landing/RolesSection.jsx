import React from 'react';
import { GraduationCap, Users, ShieldCheck } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

const RolesSection = () => {
    const roles = [
        {
            id: 'student',
            title: 'Student',
            icon: <GraduationCap size={32} />,
            iconColor: '#10b981',
            description: 'Browse menus, pre-order meals, and manage your meal plans with ease. Never miss a meal with our flexible ordering system.',
            features: ['Browse daily menus', 'Pre-order meals', 'Track meal history', 'Manage balance'],
            buttonVariant: 'primary'
        },
        {
            id: 'teacher',
            title: 'Teacher',
            icon: <Users size={32} />,
            iconColor: '#fbbf24',
            description: 'Streamlined meal ordering for faculty members. Enjoy priority service and exclusive menu options designed for staff.',
            features: ['Faculty-only menus', 'Priority ordering', 'Monthly plans', 'Custom preferences'],
            buttonVariant: 'warning'
        },
        {
            id: 'admin',
            title: 'Admin',
            icon: <ShieldCheck size={32} />,
            iconColor: '#0f172a',
            description: 'Complete control over dining operations. Manage menus, track orders, analyze data, and optimize campus dining services.',
            features: ['Menu management', 'Order tracking', 'Analytics dashboard', 'User management'],
            buttonVariant: 'dark'
        }
    ];

    return (
        <section className="py-24 bg-white" id="roles">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                        Designed for Every Member of Your Campus
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Tailored experiences that deliver exactly what students, faculty, and administrators need—all in one powerful platform.
                    </p>
                </div>

                {/* Roles Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {roles.map((role) => (
                        <Card key={role.id} icon={role.icon} iconColor={role.iconColor} className="flex flex-col h-full">
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">{role.title}</h3>
                            <p className="text-slate-600 leading-relaxed mb-6">{role.description}</p>

                            <ul className="space-y-3 mb-6 flex-grow">
                                {role.features.map((feature, index) => (
                                    <li key={index} className="flex items-center gap-3 text-slate-700">
                                        <span
                                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: role.iconColor }}
                                        ></span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Button variant={role.buttonVariant} size="md" className="w-full mt-auto">
                                Learn More
                            </Button>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RolesSection;
