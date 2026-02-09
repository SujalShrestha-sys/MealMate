import React from "react";
import { Star, Clock, Flame, Heart, Share2 } from "lucide-react";

const FoodInfo = ({ product }) => {
  if (!product) return null;

  return (
    <div>
      <div className="flex justify-between items-start mb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-xs font-semibold uppercase tracking-wider mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          {product.category}
        </div>
        <div className="flex gap-2">
          <button className="p-2 rounded-full border border-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all active:scale-95">
            <Heart size={18} />
          </button>
          <button className="p-2 rounded-full border border-slate-100 text-slate-400 hover:text-blue-500 hover:bg-blue-50 hover:border-blue-100 transition-all active:scale-95">
            <Share2 size={18} />
          </button>
        </div>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3 leading-tight">
        {product.name}
      </h1>

      {/* Meta Items */}
      <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 mb-3 pb-3 border-b border-slate-50">
        <div className="flex items-center gap-2 bg-amber-50 px-2 py-1 rounded-md border border-amber-100/50">
          <Star size={14} className="text-amber-400 fill-amber-400" />
          <span className="font-bold text-slate-700">4.8</span>
          <span className="text-slate-400 text-xs">(124)</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-green-500" />
          <span>15-20 min</span>
        </div>
        <div className="flex items-center gap-2">
          <Flame size={16} className="text-orange-500" />
          <span>320 kcal</span>
        </div>
      </div>

      <p className="text-slate-600 leading-relaxed mb-6 text-base">
        {product.description}
      </p>
    </div>
  );
};

export default FoodInfo;
