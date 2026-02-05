import React from "react";
import MenuCard from "./MenuCard";

const MenuGrid = ({ products, cart, updateQuantity }) => {
    if (products.length === 0) {
        return (
            <div className="text-center py-18 animate-fade-in-up">
                <p className="text-xl text-slate-500">
                    No items found matching your criteria.
                </p>
                <p className="text-sm text-slate-400 mt-2">Try adjusting your filters.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-4 sm:px-6 lg:px-8 pb-20 max-w-7xl mx-auto">
            {products.map((product, index) => (
                <div
                    key={product.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                >
                    <MenuCard
                        product={product}
                        quantity={cart[product.id] || 0}
                        updateQuantity={updateQuantity}
                    />
                </div>
            ))}
        </div>
    );
};

export default MenuGrid;
