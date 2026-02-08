import React from "react";
import { Shield, CheckCircle, Clock, Leaf } from "lucide-react";
import TrustIndicators from "./TrustIndicators";

const HeroSection = ({ scrollToPlans }) => {
  return (
    <section className="pt-28 pb-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-linear-to-br from-green-500/3 via-transparent to-green-600/5"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-13 items-center">
          {/* Left: Text Content */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-block">
              <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 w-fit">
                <Leaf size={16} />
                Student Meal Plans
              </span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-black text-gray-800 leading-tight">
              Effortless Meals,{" "}
              <span className="text-green-700">All Semester Long</span>
            </h1>

            <p className="text-md text-gray-600 leading-relaxed">
              Save time and money with our weekly and monthly subscription
              plans. Never worry about what to eat again!
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-lg">
                <CheckCircle size={20} className="text-green-600" />
                <span className="text-sm font-semibold text-gray-900">
                  100% Fresh Ingredients
                </span>
              </div>
              <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
                <Clock size={20} className="text-green-600" />
                <span className="text-sm font-semibold text-gray-900">
                  On-Time Delivery
                </span>
              </div>
              <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-lg">
                <Shield size={20} className="text-green-600" />
                <span className="text-sm font-semibold text-gray-900">
                  Quality Assured
                </span>
              </div>
            </div>

            {/* Trust Indicators */}
            <TrustIndicators />

            <button
              onClick={scrollToPlans}
              className="bg-green-600 cursor-pointer hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl transition-all"
            >
              View Plans
            </button>
          </div>

          {/* Right: Hero Image */}
          <div className="relative">
            <div className="aspect-square bg-linear-to-br from-green-600 to-green-600 rounded-full overflow-hidden transform -rotate-4 hover:rotate-0 transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800"
                alt="Healthy meal bowl"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-2 -left-2 bg-white rounded-xl p-3 border border-gray-100 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="text-green-600" size={24} />
                </div>
                <div>
                  <div className="font-bold text-gray-900">100% Safe</div>
                  <div className="text-sm text-gray-600">Quality Assured</div>
                </div>
              </div>
            </div>

            {/* Additional Trust Badge */}
            <div className="absolute top-12 right-10 bg-white rounded-xl p-4 border border-gray-100 shadow-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" size={20} />
                <div className="text-sm font-bold text-green-700">Verified</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
