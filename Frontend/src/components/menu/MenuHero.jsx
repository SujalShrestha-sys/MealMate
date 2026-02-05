import React from "react";
import { Search } from "lucide-react";

const MenuHero = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="relative w-full bg-gradient-to-br from-[#EAFCF4] via-[#F3FDF8] to-[#FDFBF7] py-20 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
            {/* Decorative blurred blobs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-200/20 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-800 tracking-tight mb-6 animate-fade-in-up">
                    Savor the <span className="text-green-600">Flavor</span>
                </h1>
                <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-100">
                    Discover our delicious range of freshly prepared meals, snacks, and
                    drinks. Your next favorite meal is just a few clicks away!
                </p>

                <div className="relative max-w-xl mx-auto shadow-xl rounded-full animate-fade-in-up delay-200 group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-11 pr-4 py-4 rounded-full border-2 border-transparent bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-green-500/30 focus:ring-4 focus:ring-green-500/10 transition-all duration-300"
                        placeholder="Search for your favorite food..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default MenuHero;
