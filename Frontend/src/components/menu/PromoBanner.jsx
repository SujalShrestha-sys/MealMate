import React from "react";
import { ArrowRight, Star, ShieldCheck, Clock } from "lucide-react";

// Import local images
import khaltiLogo from '../../assets/images/khalti_logo.svg';
import burgerCombo from '../../assets/images/burger_combo.jpg';

const PromoBanner = () => {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">

            {/* MAIN CONTAINER */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-50 via-white to-green-100 shadow-xl border border-green-100">

                {/* Subtle Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#22c55e12_1px,transparent_1px),linear-gradient(to_bottom,#22c55e12_1px,transparent_1px)] bg-[size:32px_32px]" />

                {/* Glow Orbs */}
                <div className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-green-300/40 rounded-full blur-[120px]" />
                <div className="absolute -bottom-32 -left-32 w-[300px] h-[300px] bg-emerald-300/40 rounded-full blur-[120px]" />

                {/* CONTENT */}
                <div className="relative z-10 grid md:grid-cols-2 gap-14 items-center p-10 md:p-16">

                    {/* LEFT SIDE */}
                    <div className="space-y-6">

                        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                            MealMate • College Canteen Pre-Order System
                        </span>

                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                            Order Ahead. <br />
                            Eat Better. <br />
                            Skip the Queue.
                        </h1>

                        <p className="text-slate-600 text-lg max-w-md">
                            A smarter way for students to pre-order meals, avoid long lines,
                            and enjoy fresh campus food — powered by MealMate.
                        </p>

                        {/* CTA BUTTONS */}
                        <div className="flex flex-wrap gap-4">

                            <button className="group inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-500 transition shadow-lg">
                                Pre-Order Now
                                <ArrowRight
                                    size={18}
                                    className="group-hover:translate-x-1 transition-transform"
                                />
                            </button>

                            <button
                                onClick={() => document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' })}
                                className="inline-flex items-center gap-2 border border-green-300 text-green-700 px-8 py-4 rounded-xl hover:bg-green-50 transition"
                            >
                                View Menu
                            </button>

                        </div>

                        {/* TRUST INDICATORS */}
                        <div className="flex flex-wrap gap-6 pt-6 text-sm text-slate-600">

                            <div className="flex items-center gap-2">
                                <Star className="text-green-600" size={16} />
                                <span>4.8 Student Rating</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Clock className="text-green-600" size={16} />
                                <span>Fast Pickup</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <ShieldCheck className="text-green-600" size={16} />
                                <span>Secure Payment</span>
                            </div>

                        </div>

                    </div>

                    {/* RIGHT SIDE */}
                    <div className="relative">

                        <div className="absolute inset-0 bg-green-200/40 blur-3xl rounded-full"></div>

                        {/* APP PREVIEW CARD */}
                        <div className="relative bg-white/80 backdrop-blur-xl border border-green-100 rounded-3xl shadow-xl max-w-sm mx-auto overflow-hidden">

                            {/* Header */}
                            <div className="p-5 border-b border-green-100">
                                <h3 className="text-slate-900 font-semibold text-lg">
                                    MealMate App
                                </h3>
                                <p className="text-slate-500 text-sm">
                                    Order Summary
                                </p>
                            </div>

                            {/* FOOD IMAGE */}
                            <img
                                src={burgerCombo}
                                alt="Meal"
                                className="w-full h-44 object-cover"
                            />

                            {/* BODY */}
                            <div className="p-5 space-y-4">

                                <div className="flex items-center justify-between">
                                    <span className="text-slate-700 font-medium">
                                        Veg Burger Combo
                                    </span>
                                    <span className="text-green-600 font-semibold">
                                        Rs. 160
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm text-slate-500">
                                    <span>Pickup Time</span>
                                    <span>12:30 PM</span>
                                </div>

                                {/* PAYMENTS */}
                                <div>
                                    <p className="text-xs text-slate-500 mb-2">
                                        Supported Payments
                                    </p>

                                    <div className="flex items-center gap-3">

                                        <img
                                            src={khaltiLogo}
                                            alt="Khalti"
                                            className="h-8 object-contain"
                                        />

                                        <div className="px-3 py-1 rounded-md bg-green-50 text-green-700 text-sm font-medium">
                                            Cash
                                        </div>

                                    </div>
                                </div>

                                {/* STATUS */}
                                <div className="p-3 rounded-lg bg-green-50 text-green-700 text-sm font-medium text-center">
                                    Ready for Pickup
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
};

export default PromoBanner;
