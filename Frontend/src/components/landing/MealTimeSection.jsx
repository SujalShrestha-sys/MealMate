import React from 'react';
import { Clock, CheckCircle, CreditCard, Sparkles } from 'lucide-react';

const benefits = [
  {
    icon: Clock,
    title: 'Flexible Timing',
    text: 'Enjoy meals whenever it fits your schedule — no fixed hours.',
  },
  {
    icon: CheckCircle,
    title: 'Smart Pre-Ordering',
    text: 'Order ahead and pick up right when your meal is ready.',
  },
  {
    icon: CreditCard,
    title: 'Easy Payments',
    text: 'Pay your way with meal plans, wallets, or cards.',
  },
  {
    icon: Sparkles,
    title: 'Personalized Meals',
    text: 'Customize meals to match your taste and dietary needs.',
  },
];

const MealTimeSection = () => {
  return (
    <section className="py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4">

        {/* Centered Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <span className="text-sm font-semibold uppercase tracking-wide text-green-600">
            Smart Dining
          </span>

          <h2 className="mt-3 text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
            Dining That Fits Your Life
          </h2>

          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            MealMate adapts to your routine — fast, flexible, and fully personalized. Perfect for busy campus life or relaxed dining.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Left – Image */}
          <div className="relative flex justify-center md:justify-end">
            <img
              src="/src/assets/images/meal_time_lifestyle.png"
              alt="Flexible campus dining"
              className="w-full max-w-md md:max-w-lg object-cover rounded-xl border border-slate-200"
            />
          </div>

          {/* Right – Benefits Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {benefits.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group relative rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:shadow-lg overflow-auto"
                >
                  {/* Icon */}
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600 mb-4">
                    <Icon size={20} />
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                    {item.text}
                  </p>

                  {/* Accent hover bar */}
                  <span className="absolute left-0 right-0 bottom-0 h-1 bg-linear-to-r from-green-400 to-green-600 scale-x-0 group-hover:scale-x-100 transform origin-left transition-transform duration-500 ease-in-out rounded-full" />
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

export default MealTimeSection;
