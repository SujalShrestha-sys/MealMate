import React, { useState } from "react";
import { CheckCircle2, Star, User } from "lucide-react";

const FoodTabs = () => {
  const [activeTab, setActiveTab] = useState("details");

  return (
    <div className="bg-slate-50 text-center border-slate-100 px-8 lg:px-12 py-8">
      <div className="items-center gap-2 mb-8 bg-white p-2 rounded-xl border border-slate-200/60 inline-flex shadow-sm">
        {["Details", "Nutrition", "Customer Reviews"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase().split(" ")[0])}
            className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
              activeTab === tab.toLowerCase().split(" ")[0]
                ? "bg-green-600 text-white shadow-md shadow-green-200"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="min-h-[200px]">
        {activeTab === "details" && (
          <div className="animate-fade-in bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-green-600 rounded-full" />
              About this meal
            </h3>
            <p className="text-slate-600 leading-7 mb-6 text-base text-justify">
              Prepared fresh daily using locally sourced ingredients. Our chefs
              take pride in delivering the authentic taste of homemade goodness.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "Freshly prepared upon order",
                "Contains natural ingredients",
                "No artificial preservatives",
                "Locally sourced vegetables",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-xl bg-green-100/50 border border-green-100/50"
                >
                  <CheckCircle2 size={20} className="text-green-600" />
                  <span className="text-slate-700 text-sm font-medium">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === "nutrition" && (
          <div className="animate-fade-in grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Calories", value: "320", unit: "kcal" },
              { label: "Protein", value: "24", unit: "g" },
              { label: "Carbs", value: "45", unit: "g" },
              { label: "Fat", value: "12", unit: "g" },
            ].map((item, i) => (
              <div
                key={i}
                className={`p-4 rounded-full border border-slate-100 bg-white shadow-sm text-center transform transition-all hover:scale-105 duration-300 group hover:border-green-200 hover:shadow-green-100/50`}
              >
                <span
                  className={`block text-xs uppercase font-bold mb-2 text-slate-400 group-hover:text-green-600 transition-colors`}
                >
                  {item.label}
                </span>
                <div
                  className={`text-2xl font-black text-slate-800 group-hover:text-green-700 transition-colors`}
                >
                  {item.value}
                  <span className="text-sm font-medium ml-1 opacity-60">
                    {item.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === "customer" && (
          <div className="animate-fade-in space-y-4">
            {[1, 2].map((review) => (
              <div
                key={review}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <User size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">
                        Alex Johnson
                      </h4>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} fill="currentColor" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    2 days ago
                  </span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  "Absolutely delicious! The flavors were perfectly balanced and
                  the portion size was just right."
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodTabs;
