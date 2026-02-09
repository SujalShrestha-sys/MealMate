import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { products } from "../data/products";

// Sub-components
import ImageGallery from "../components/food-details/ImageGallery";
import FoodInfo from "../components/food-details/FoodInfo";
import FoodActions from "../components/food-details/FoodActions";
import FoodTabs from "../components/food-details/FoodTabs";
import RelatedProducts from "../components/food-details/RelatedProducts";

const FoodDetailsPage = ({ cart, updateQuantity }) => {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50/30">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Item not found
          </h2>
          <Link
            to="/menu"
            className="text-green-600 hover:text-green-700 font-medium hover:underline transition-colors"
          >
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  const quantity = cart[product.id] || 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar isLoggedIn={true} />

      <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb / Back Navigation */}
          <Link
            to="/menu"
            className="inline-flex items-center text-slate-500 hover:text-green-600 transition-colors mb-6 group"
          >
            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center mr-2 group-hover:border-green-200 group-hover:bg-green-50 group-hover:shadow-sm transition-all duration-300">
              <ChevronLeft
                size={18}
                className="group-hover:-translate-x-0.5 transition-transform"
              />
            </div>
            <span className="font-medium text-sm">Back to Menu</span>
          </Link>

          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 overflow-hidden mb-14">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left Column: Image Gallery (Span 7) */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <ImageGallery product={product} />
              </div>

              {/* Right Column: Details (Span 5) */}
              <div className="lg:col-span-5 p-8 lg:p-8 flex flex-col relative bg-white">
                <FoodInfo product={product} />

                <FoodActions
                  product={product}
                  quantity={quantity}
                  updateQuantity={updateQuantity}
                />
              </div>
            </div>

            {/* Tabs Section */}
            <FoodTabs />
          </div>

          {/* Related Items Section */}
          <RelatedProducts currentProduct={product} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FoodDetailsPage;
