import React, { useState, useRef } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import HeroSection from "../components/plans/HeroSection";
import PlanCard from "../components/plans/PlanCard";

const PlansPage = () => {
  const [planType, setPlanType] = useState("weekly");
  const plansRef = useRef(null);

  const scrollToPlans = () => {
    plansRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const weeklyPlans = [
    {
      name: "Weekly Veg Delight",
      price: 25,
      period: "week",
      description: "Perfect for vegetarians who want fresh, healthy meals",
      meals: 5,
      features: [
        "5 Vegetarian Lunches",
        "Fresh, local ingredients",
        "Daily drink included",
        "Customizable menu",
      ],
      popular: false,
    },
    {
      name: "Weekly Basic",
      price: 30,
      period: "week",
      description: "Great starter plan for busy students",
      meals: 5,
      features: [
        "5 Lunches",
        "Standard meal rotation",
        "Save 5% vs daily",
        "Flexible delivery",
      ],
      popular: false,
    },
    {
      name: "Weekly Power Pack",
      price: 35,
      period: "week",
      description: "Most popular choice for active students",
      meals: 5,
      features: [
        "5 Lunches",
        "Breakfast add-on option",
        "Save over 10%",
        "Priority support",
      ],
      popular: true,
    },
    {
      name: "Weekly Premium",
      price: 45,
      period: "week",
      description: "Premium experience with gourmet selections",
      meals: 5,
      features: [
        "5 Premium Lunches",
        "Gourmet meal choices",
        "Includes dessert",
        "VIP treatment",
      ],
      popular: false,
    },
  ];

  const monthlyPlans = [
    {
      name: "Monthly Veg Delight",
      price: 95,
      period: "month",
      description: "Perfect for vegetarians who want fresh, healthy meals",
      meals: 20,
      features: [
        "20 Vegetarian Lunches",
        "Fresh, local ingredients",
        "Daily drink included",
        "Customizable menu",
      ],
      popular: false,
    },
    {
      name: "Monthly Basic",
      price: 115,
      period: "month",
      description: "Great starter plan for busy students",
      meals: 20,
      features: [
        "20 Lunches",
        "Standard meal rotation",
        "Save 10% vs daily",
        "Flexible delivery",
        "Pre-order priority",
      ],
      popular: false,
    },
    {
      name: "Monthly Power Pack",
      price: 120,
      period: "month",
      description: "Most popular choice for active students",
      meals: 20,
      features: [
        "20 Lunches",
        "Breakfast add-on option",
        "Save over 15%",
        "Priority support",
      ],
      popular: true,
    },
    {
      name: "Monthly Premium",
      price: 150,
      period: "month",
      description: "Premium experience with gourmet selections",
      meals: 20,
      features: [
        "20 Premium Lunches",
        "Gourmet meal choices",
        "Includes dessert",
        "VIP treatment",
      ],
      popular: false,
    },
  ];

  const currentPlans = planType === "weekly" ? weeklyPlans : monthlyPlans;

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-green-50/30 flex flex-col">
      <Navbar isLoggedIn={true} />

      {/* Hero Section Component */}
      <HeroSection scrollToPlans={scrollToPlans} />

      {/* Plans Section */}
      <section ref={plansRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Choose Your Perfect Plan
            </h2>
            <p className="text-lg text-gray-600">
              Flexible plans designed for student life
            </p>
          </div>

          {/* Plan Type Toggle */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-gray-100 rounded-xl p-1.5">
              <button
                onClick={() => setPlanType("weekly")}
                className={`px-8 py-3 rounded-lg font-bold text-sm transition-all ${
                  planType === "weekly"
                    ? "bg-white text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Weekly Plans
              </button>
              <button
                onClick={() => setPlanType("monthly")}
                className={`px-8 py-3 rounded-lg font-bold text-sm transition-all ${
                  planType === "monthly"
                    ? "bg-white text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Monthly Plans
              </button>
            </div>
          </div>

          {/* Plan Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentPlans.map((plan, index) => (
              <PlanCard key={index} plan={plan} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PlansPage;
