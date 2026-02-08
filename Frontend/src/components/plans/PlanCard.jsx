import React from "react";
import { Check, Package } from "lucide-react";

const PlanCard = ({ plan }) => {
  return (
    <div
      className={`relative bg-white rounded-2xl p-6 transition-all duration-300 flex flex-col group ${
        plan.popular
          ? "border-2 border-green-500 hover:shadow-lg "
          : "border border-gray-200 hover:border-green-300 hover:shadow-md"
      }`}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-linear-to-r from-orange-300 to-orange-400 text-white text-xs font-bold px-4 py-1.5 rounded-full">
            Most Popular
          </span>
        </div>
      )}

      {/* Plan Header */}
      <div className="mb-6">
        <h3 className="text-xl font-extrabold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
          {plan.name}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {plan.description}
        </p>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-gray-900">
            NRs - {plan.price}
          </span>
          <span className="text-gray-500">/ {plan.period}</span>
        </div>
        <div className="mt-2 inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
          <Package size={16} />
          <span>{plan.meals} meals included</span>
        </div>
      </div>

      {/* Features List */}
      <div className="grow mb-6">
        <div className="space-y-3">
          {plan.features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="mt-0.5">
                <Check size={18} className="text-green-600" />
              </div>
              <span className="text-sm text-gray-700 leading-relaxed">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 my-4"></div>

      {/* Additional Info */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Delivery</span>
          <span className="font-semibold text-gray-900">Free</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Cancellation</span>
          <span className="font-semibold text-gray-900">Anytime</span>
        </div>
      </div>

      {/* CTA Button */}
      <button
        className={`w-full py-3.5 rounded-xl font-semibold transition-all ${
          plan.popular
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200"
        }`}
      >
        Choose Plan
      </button>
    </div>
  );
};

export default PlanCard;
