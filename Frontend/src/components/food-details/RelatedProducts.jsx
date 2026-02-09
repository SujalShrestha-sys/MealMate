import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { products } from "../../data/products";

const RelatedProducts = ({ currentProduct }) => {
  if (!currentProduct) return null;

  const relatedProducts = products
    .filter(
      (p) =>
        p.category === currentProduct.category && p.id !== currentProduct.id,
    )
    .slice(0, 5);

  if (relatedProducts.length === 0) return null;

  return (
    <div className="animate-fade-in-up">
      <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        You might also like
        <span className="h-px bg-slate-200 flex-1 ml-4"></span>
      </h3>
      <div className="flex overflow-x-auto gap-4 pb-8 -mx-4 px-4 scrollbar-hide snap-x">
        {relatedProducts.map((related) => (
          <Link
            key={related.id}
            to={`/food/${related.id}`}
            className="min-w-[200px] w-[200px] snap-start bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="aspect-4/3 bg-slate-100 relative">
              <img
                src={related.image}
                alt={related.name}
                className="w-full h-full object-cover"
              />
              {related.badge && (
                <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[10px] font-bold px-2 py-0.5 rounded-full text-slate-700 shadow-sm">
                  {related.badge}
                </span>
              )}
            </div>
            <div className="p-4">
              <h4 className="font-bold text-slate-800 text-sm truncate mb-1">
                {related.name}
              </h4>
              <div className="flex items-center justify-between">
                <span className="text-green-600 font-bold text-sm">
                  NPR {related.price}
                </span>
                <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <ChevronLeft size={14} className="rotate-180" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
