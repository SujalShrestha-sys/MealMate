import React, { useEffect, useState } from "react";
import { ArrowRight, Play, Users, Building2, Star } from "lucide-react";
import Button from "../common/Button";

const useCountUp = (target, speed = 20) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= target) {
          clearInterval(interval);
          return target;
        }
        return prev + 1;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [target, speed]);

  return count;
};

const HeroSection = () => {
  const users = useCountUp(150, 10);
  const campuses = useCountUp(50, 10);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center from-green-50 to-white pt-28 pb-28"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* LEFT CONTENT */}
          <div href='/Home' className="space-y-8">
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
              Elevate Your Campus Dining
              <span className="text-green-600">.</span>
            </h1>

            <p className="text-base md:text-lg text-slate-600 max-w-xl">
              Plan meals effortlessly, order instantly, and pay flexibly. A
              smarter and more enjoyable campus dining experience.
            </p>

            {/* BUTTONS */}
            <div className="flex gap-4 flex-wrap">
              <Button
                variant="primary"
                size="md"
                icon={<ArrowRight size={18} />}
                iconPosition="right"
              >
                Get Started
              </Button>

              <Button variant="secondary" size="md" icon={<Play size={16} />}>
                Watch Demo
              </Button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <StatCard
                icon={<Users className="text-green-600" />}
                value={`${users.toLocaleString()}+`}
                label="Active Users"
              />
              <StatCard
                icon={<Building2 className="text-green-600" />}
                value={`${campuses}+`}
                label="Campus Partners"
              />
              <StatCard
                icon={<Star className="text-green-600" />}
                value="4.5"
                label="User Rating"
              />
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative flex justify-center">
            <div className="relative rounded-3xl bg-white/80 backdrop-blur-xl border border-slate-200 shadow-xl p-6">
              <img
                src="/src/assets/images/hero_illustration.png"
                alt="Campus dining illustration"
                className=" w-full max-w-lg object-contain transform rotate-y-[-8deg] rotate-x-8 shadow-xl rounded-lg"
              />

              {/* Floating stats */}
              <FloatingBadge
                position="-top-6 -right-6"
                icon={<Users size={16} />}
                value="10K+"
                label="Users"
              />

              <FloatingBadge
                position="-bottom-6 -left-6"
                icon={<Building2 size={16} />}
                value="50+"
                label="Campuses"
              />
            </div>

            {/* Background blur */}
            <div className="absolute -z-10 w-80 h-80 bg-green-200/60 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

/* Reusable small components */

const StatCard = ({ icon, value, label }) => (
  <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-sm text-slate-600">{label}</p>
    </div>
  </div>
);

const FloatingBadge = ({ position, icon, value, label }) => (
  <div
    className={`absolute ${position} bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3`}
  >
    <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-600">
      {icon}
    </div>
    <div>
      <p className="font-semibold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  </div>
);

export default HeroSection;
