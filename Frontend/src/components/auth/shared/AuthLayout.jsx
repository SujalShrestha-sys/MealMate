import React from "react";
import { UtensilsCrossed } from "lucide-react";

const AuthLayout = ({
  children,
  imageSrc,
  title,
  subtitle,
  extraLeftContent,
}) => {
  return (
    <div className="flex w-full h-screen overflow-hidden">
      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        {/* Background image */}
        <img
          src={imageSrc}
          alt="App Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-green-900/80 via-green-800/70 to-emerald-900/80" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between w-full p-12 h-full">
          {/* Logo (Static) */}
          <div className="flex items-center gap-3 select-none">
            <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
              <UtensilsCrossed size={22} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              MealMate
            </span>
          </div>

          {/* Center Text */}
          <div className="flex-1 flex flex-col justify-center max-w-md">
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-5">
              {title}
            </h1>
            <p className="text-lg text-green-100/90 leading-relaxed font-medium">
              {subtitle}
            </p>

            {/* Extra Content (Stats/Benefits) */}
            {extraLeftContent && (
              <div className="mt-10">{extraLeftContent}</div>
            )}
          </div>

          {/* Copyright */}
          <p className="text-sm text-green-200/60">
            &copy; 2026 MealMate. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 bg-gray-50 h-full relative">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-2.5 mb-8 select-none">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-green-600 text-white">
            <UtensilsCrossed size={20} />
          </div>
          <span className="text-xl font-bold text-green-600 tracking-tight">
            MealMate
          </span>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
