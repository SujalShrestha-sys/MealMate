import React from "react";

const CategoryFilter = ({ categories, activeCategory, setActiveCategory }) => {
  return (
    <div className="py-4 mb-8 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-start md:justify-center space-x-2 sm:space-x-4 overflow-x-auto pb-4 e py-2 px-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`
                px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap
                ${
                  activeCategory === category
                    ? "bg-green-500 text-white shadow-lg shadow-green-500/30 ring-2 ring-green-500 ring-offset-2"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-green-300 hover:text-green-600 hover:shadow-md"
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
