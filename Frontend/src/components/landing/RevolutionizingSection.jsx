import React from "react";
import { CheckCircle, Clock, RefreshCcw } from "lucide-react";

const features = [
  {
    title: "Seamless Experience",
    description:
      "Enjoy smooth, reliable ordering from start to finish with zero friction and zero confusion.",
    icon: <CheckCircle size={18} className="text-green-600" />,
  },
  {
    title: "Time-Optimized Ordering",
    description:
      "Pre-order meals, skip long queues, and pick up your food exactly when it suits you.",
    icon: <Clock size={18} className="text-green-600" />,
  },
  {
    title: "Hassle-Free Refunds",
    description:
      "Changed your plans? Get instant refunds with a single tap — fast and stress-free.",
    icon: <RefreshCcw size={18} className="text-green-600" />,
  },
];

const RevolutionizingSection = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* LEFT – IMAGE */}
          <div className="relative flex justify-center">
            <div className="relative shadow-xl rounded-xl">
              <img
                src="/src/assets/images/dashboard_mockup.png"
                alt="MealMate Dashboard"
                className="w-full max-w-md md:max-w-lg object-cover rounded-md"
              />
            </div>

            {/* Subtle decorative blur */}
            <div className="absolute -z-10 w-72 h-72 bg-green-200/70 rounded-full blur-2xl -top-8 -left-8" />
          </div>

          {/* RIGHT – CONTENT */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                Transforming How Campus Dines
              </h2>
              <p className="mt-4 text-lg text-slate-600 max-w-xl leading-relaxed">
                Built with a mission of
                <span className="font-semibold text-slate-800">
                  {" "}
                  zero food waste
                </span>{" "}
                and
                <span className="font-semibold text-slate-800">
                  {" "}
                  zero queues
                </span>
                , MealMate simplifies campus dining for students and staff
                alike.
              </p>
            </div>

            {/* FEATURES */}
            <div className="space-y-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex gap-4 p-5 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-green-50 shrink-0">
                    {feature.icon}
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                      {feature.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RevolutionizingSection;
