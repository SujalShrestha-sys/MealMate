import React from "react";
import Button from "../common/Button";
import { ShoppingCart, Plus, Minus } from "lucide-react";

const MenuCard = ({ product, quantity = 0, updateQuantity }) => {
  return (
    <div className="relative group pt-12 h-full">
      <div className="bg-white rounded-4xl p-6 shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-300 h-full flex flex-col border border-slate-100 relative group-hover:-translate-y-2">
        {/* Image Container - Popping out */}
        <div className="relative -mt-16 mb-6 mx-2 rounded-2xl overflow-hidden shadow-xl shadow-green-900/5 group-hover:shadow-2xl group-hover:shadow-green-500/20 group-hover:scale-105 transition-all duration-500 h-52 bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
          />
          {/* Badge */}
          {product.badge && (
            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-green-600 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1 border border-green-100 z-10">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              {product.badge}
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="flex flex-col grow">
          <div className="grow">
            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-green-600 transition-colors line-clamp-1">
              {product.name}
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
              {product.description}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                Price
              </span>
              <span className="text-md font-bold text-green-600">
                NPR - {product.price.toFixed(0)}
              </span>
            </div>

            {quantity === 0 ? (
              <Button
                size="sm"
                variant="primary"
                icon={<Plus size={18} />}
                iconPosition="right"
                className="rounded-full shadow-green-500/20 hover:shadow-green-500/40"
                onClick={() => updateQuantity(product.id, 1)}
              >
                Add
              </Button>
            ) : (
              <div className="flex items-center gap-3 bg-green-50 p-1 rounded-full border border-green-100 shadow-sm animate-fade-in">
                <button
                  onClick={() => updateQuantity(product.id, -1)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-green-600 border border-green-100 hover:bg-green-600 hover:text-white transition-all shadow-sm active:scale-95"
                >
                  <Minus size={16} />
                </button>
                <span className="text-green-700 font-bold min-w-5 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => updateQuantity(product.id, 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-green-600 text-white hover:bg-green-700 transition-all shadow-md shadow-green-200 active:scale-95"
                >
                  <Plus size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
