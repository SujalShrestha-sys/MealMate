import React from 'react';
import { Check, ArrowRight, Clock, Star, CreditCard, Heart } from 'lucide-react';
import Button from '../common/Button';

const benefits = [
  {
    icon: Clock,
    iconColor: 'text-amber-500',
    title: 'Flexible Timing',
    description: 'Enjoy meals whenever it fits your schedule.'
  },
  {
    icon: Star,
    iconColor: 'text-indigo-500',
    title: 'Priority Access',
    description: 'Get early access to new menu items and offers.'
  },
  {
    icon: CreditCard,
    iconColor: 'text-green-500',
    title: 'Easy Payments',
    description: 'Pay via meal plans, wallets, or cards.'
  },
  {
    icon: Heart,
    iconColor: 'text-pink-500',
    title: 'Personalized Meals',
    description: 'Customize meals to your taste and dietary needs.'
  }
];

const SubscriptionSection = () => {
  return (
    <section className="relative py-20 bg-linear-to-br from-amber-50 via-white to-amber-100 overflow-hidden">
      {/* Background blur circles */}
      <div className="absolute -top-36 -left-36 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-44 -right-28 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-extrabold text-gray-800 leading-snug">
            Upgrade Your Campus Dining
          </h2>
          <p className="mt-4 text-gray-600 text-sm md:text-base leading-relaxed">
            Simple, flexible subscription plans that make dining effortless.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-14 items-center">

          {/* Left - Large Illustration */}
          <div className="flex justify-center md:justify-start">
            <img
              src="/src/assets/images/subscription_illustration.png"
              alt="Meal plan subscription"
              className="w-full max-w-xl md:max-w-lg h-auto rounded-xl shadow-lg border border-gray-200"
            />
          </div>

          {/* Right - Small Text Benefits */}
          <div className="flex flex-col gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className={`shrink-0 h-10 w-10 flex items-center justify-center rounded-md bg-gray-50 ${benefit.iconColor}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-semibold text-lg">{benefit.title}</h3>
                    <p className="text-gray-600 text-sm mt-0.5">{benefit.description}</p>
                  </div>
                </div>
              );
            })}

            {/* CTA Button */}
            <div className="mt-4 flex justify-center md:justify-start">
              <Button
                variant="primary"
                size="sm"
                icon={<ArrowRight size={16} />}
                iconPosition="right"
                className="px-5 py-2 shadow hover:shadow-md transition-all duration-300"
              >
                Choose Plan
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SubscriptionSection;
