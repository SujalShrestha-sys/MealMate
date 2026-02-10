import React from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import Button from "../common/Button";

const FoodActions = ({ product, quantity, updateQuantity }) => {
  if (!product) return null;

  return (
    <div className="mt-auto text-center">
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-slate-400 font-medium uppercase tracking-wider">
            Total Price
          </span>
          <span className="text-2xl font-bold text-slate-800">
            NPR - {product.price}
          </span>
        </div>

        {quantity > 0 ? (
          <div className="flex items-center justify-between gap-6 bg-white p-2 rounded-xl border border-green-100 shadow-sm w-full sm:w-auto">
            <button
              onClick={() => updateQuantity(product.id, -1)}
              className="w-8 h-8 flex items-center justify-center rounded-full text-green-600 bg-green-50 hover:bg-green-100 transition-colors active:scale-95"
            >
              <Minus size={16} />
            </button>
            <span className="font-bold text-lg text-slate-700 min-w-5 text-center">
              {quantity}
            </span>
            <button
              onClick={() => updateQuantity(product.id, 1)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-200 transition-all active:scale-95"
            >
              <Plus size={16} />
            </button>
          </div>
        ) : (
          <Button
            onClick={() => updateQuantity(product.id, 1)}
            className="rounded-full shadow-lg shadow-slate-200 group"
            icon={
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <ShoppingCart size={14} />
              </div>
            }
            iconPosition="right"
          >
            Add to Cart
          </Button>
        )}
      </div>
    </div>
  );
};

export default FoodActions;
