import React, { useState, useEffect } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import MenuFilters from "../components/menu/MenuFilters";
import MenuGrid from "../components/menu/MenuGrid";
import PromoBanner from "../components/menu/PromoBanner";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

import { products } from "../data/products";

const MenuPage = ({ cart, updateQuantity }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  const categories = [
    "All",
    "Breakfast",
    "Lunch",
    "Dinner",
    "Snacks",
    "Appetizers",
    "Beverages",
    "Desserts",
    "Specials",
  ];

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "All" || product.category === activeCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar isLoggedIn={true} />
      <main className="flex-1 pt-24 pb-20">
        {/*  Minimalistic Header */}
        <div className="text-center mb-14 px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 font-semibold text-[10px] uppercase tracking-wider mb-4 animate-fade-in-up border border-green-100/50 shadow-sm">
            <Sparkles size={12} className="text-green-500" />
            <span>Eat Better.</span>
          </div>
          <h1
            className="text-5xl md:text-4xl font-bold text-slate-900 mb-2 tracking-tight animate-fade-in-up"
            style={{ animationDelay: "100ms" }}
          >
            Canteen Excellence.
          </h1>
          <p
            className="text-lg text-slate-500 max-w-xl mx-auto animate-fade-in-up font-medium"
            style={{ animationDelay: "200ms" }}
          >
            Pre-order your campus meals effortlessly and skip the queue.
          </p>
        </div>

        {/* Promotional Banner */}
        <PromoBanner />

        {/* Search & Filter - Separated Component (No Sticky) */}
        <MenuFilters
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          categories={categories}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Grid */}
        <MenuGrid
          products={paginatedProducts}
          cart={cart}
          updateQuantity={updateQuantity}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-center gap-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-3 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-green-50 hover:text-green-600 hover:border-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-full font-medium transition ${currentPage === page
                        ? "bg-green-600 text-white shadow-lg shadow-green-500/30"
                        : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                      }`}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-green-50 hover:text-green-600 hover:border-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MenuPage;
