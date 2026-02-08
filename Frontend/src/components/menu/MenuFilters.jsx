import React from "react";
import { Search } from "lucide-react";
import CategoryFilter from "./CategoryFilter";

const MenuFilters = ({
  activeCategory,
  setActiveCategory,
  categories,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div
      id="menu-section"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 scroll-mt-24"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            {activeCategory === "All" ? "Full Dish Items" : activeCategory}
          </h2>
          <p className="text-slate-500 mt-1">
            Select a category to filter the menu
          </p>
        </div>

        <div className="relative w-full md:w-96 group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors pointer-events-none">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Search for dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all duration-300 shadow-sm hover:shadow-md text-slate-700 placeholder:text-slate-400"
          />
        </div>
      </div>

      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
    </div>
  );
};

export default MenuFilters;
