import React, { useState, useEffect } from "react";
import { products } from "../../data/products";

const ImageGallery = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(
    product ? product.image : null,
  );

  // Reset selected image when product changes
  useEffect(() => {
    if (product) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedImage(product.image);
    }
  }, [product]);

  // Mock gallery images: Use current product image + 3 others
  const galleryImages = product
    ? [
        product.image,
        ...products
          .filter((p) => p.id !== product.id)
          .slice(0, 3)
          .map((p) => p.image),
      ]
    : [];

  if (!product) return null;

  return (
    <div className="bg-green-50/30 p-6 lg:p-10 flex flex-col justify-center h-full">
      {/* Main Image Container */}
      <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-lg shadow-green-900/5 bg-white mb-6 group">
        <img
          src={selectedImage || product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.badge && (
            <span className="bg-green-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg shadow-green-900/20 backdrop-blur-sm animate-fade-in">
              {product.badge}
            </span>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex justify-center gap-3">
        {galleryImages.map((img, index) => (
          <div
            key={index}
            onMouseEnter={() => setSelectedImage(img)}
            className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-300 ${
              selectedImage === img
                ? "border-green-500 shadow-md shadow-green-100 ring-2 ring-green-100 ring-offset-2 -translate-y-1"
                : "border-white/50 opacity-80 hover:opacity-100 hover:border-green-300"
            }`}
          >
            <img
              src={img}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
