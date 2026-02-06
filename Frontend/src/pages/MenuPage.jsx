import React, { useState, useEffect } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import MenuFilters from "../components/menu/MenuFilters";
import MenuGrid from "../components/menu/MenuGrid";
import PromoBanner from "../components/menu/PromoBanner";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [cart, setCart] = useState({}); // { productId: quantity }
  const itemsPerPage = 6;

  const updateQuantity = (productId, delta) => {
    //simplified logic to update cart quantity without mutating state directly
    /*   setCart((prevCart) => {
    
            const cartCopy = {...prevCart};
            const currentQty = cartCopy[productId] || 0;
            const newQty = currentQty + delta;
    
            if(newQty <= 0) {
                delete cartCopy[productId];
            }
            else {
                cartCopy[productId] = newQty;
            }
    
            return cartCopy;
        });
      }; */

    setCart((prevCart) => {
      const newQuantity = (prevCart[productId] || 0) + delta;
      if (newQuantity <= 0) {
        const { [productId]: _, ...rest } = prevCart;
        return rest;
      }
      return { ...prevCart, [productId]: newQuantity };
    });
  };

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

  const products = [
    {
      id: 1,
      name: "Classic Pancakes (Stack)",
      description:
        "Fluffy buttermilk pancakes served with maple syrup, whipped cream and fresh berries.",
      price: 650,
      image:
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=1380&q=80",
      category: "Breakfast",
      badge: "Bestseller",
    },
    {
      id: 2,
      name: "Avocado Sourdough Toast",
      description:
        "Toasted artisanal sourdough topped with smashed avocado, poached egg, and chili flakes.",
      price: 750,
      image:
        "https://images.unsplash.com/photo-1588137372308-15f09a040a22?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80",
      category: "Breakfast",
      badge: "Healthy",
    },
    {
      id: 3,
      name: "Caesar Salad Supreme",
      description:
        "Crisp romaine lettuce, parmesan cheese, herb croutons, and creamy Caesar dressing.",
      price: 800,
      image:
        "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      category: "Lunch",
    },
    {
      id: 4,
      name: "Grilled Chicken Deluxe",
      description:
        "Grilled chicken breast with lettuce, tomato, caramelized onions and mayo on a brioche bun.",
      price: 950,
      image:
        "https://images.unsplash.com/photo-1606754752377-f2da70790150?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      category: "Lunch",
      badge: "Chef's Choice",
    },
    {
      id: 5,
      name: "Premium Steak Frites",
      description:
        "Grilled sirloin steak served with crispy french fries and garlic herb butter.",
      price: 2500,
      image:
        "https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      category: "Dinner",
      badge: "Premium",
    },
    {
      id: 6,
      name: "Norwegian Salmon Fillet",
      description:
        "Pan-seared salmon served with roasted root vegetables and lemon butter sauce.",
      price: 2200,
      image:
        "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      category: "Dinner",
    },
    {
      id: 7,
      name: "Berry Blast Smoothie",
      description:
        "A refreshing blend of strawberries, blueberries, bananas, and Greek yogurt.",
      price: 450,
      image:
        "https://images.unsplash.com/photo-1610970881699-44a5587cabec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80",
      category: "Beverages",
    },
    {
      id: 8,
      name: "Triple Chocolate Brownie",
      description:
        "Rich chocolate brownie topped with vanilla bean ice cream and chocolate sauce.",
      price: 550,
      image:
        "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80",
      category: "Desserts",
      badge: "Sweet treat",
    },
    {
      id: 9,
      name: "Spicy Chicken Wings",
      description:
        "Crispy fried wings tossed in our signature buffalo sauce, served with ranch dip.",
      price: 850,
      image:
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=1380&q=80",
      category: "Appetizers",
    },
    {
      id: 10,
      name: "Mango Lassi",
      description:
        "Traditional yogurt-based drink blended with sweet ripe mangoes.",
      price: 350,
      image:
        "https://images.unsplash.com/photo-1543362145-6674f38fe1cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80",
      category: "Beverages",
    },
    {
      id: 11,
      name: "Vegetable Spring Rolls",
      description:
        "Crispy rolls filled with cabbage, carrots and glass noodles, served with sweet chili sauce.",
      price: 500,
      image:
        "https://images.unsplash.com/photo-1544681280-d2dc0cbbade7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80",
      category: "Appetizers",
    },
    {
      id: 12,
      name: "New York Cheesecake",
      description:
        "Classic creamy cheesecake with a graham cracker crust and strawberry coulis.",
      price: 650,
      image:
        "https://images.unsplash.com/photo-1508737027454-e6454ef45afd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1372&q=80",
      category: "Desserts",
    },
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
                    className={`w-10 h-10 rounded-full font-medium transition ${
                      currentPage === page
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
