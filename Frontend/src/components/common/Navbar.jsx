import React, { useEffect, useState } from "react";
import { Menu, X, UtensilsCrossed, User } from "lucide-react";
import Button from "./Button";

const Navbar = ({ isLoggedIn = true }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Detect scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["Home", "Roles", "Features", "Contact"];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all ${scrolled
        ? "bg-green-50/80 backdrop-blur-xl shadow"
        : "bg-white/50 backdrop-blur"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* Logo */}
        <a href="/Home" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-green-600 text-white">
            <UtensilsCrossed size={20} />
          </div>
          <span className="text-green-600">MealMate</span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6">
          {links.map(link => (
            <a
              key={link}
              href={`/${link}`}
              className="text-slate-700 hover:text-green-600 transition"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 cursor-pointer hover:bg-green-200 transition ring-2 ring-green-500/20">
              <User size={20} />
            </div>
          ) : (
            <>
              <Button variant="secondary" size="sm">Sign In</Button>
              <Button variant="primary" size="sm">Get Started</Button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-6 border-t bg-white">
          <div className="flex flex-col gap-3 pt-4">
            {links.map(link => (
              <a
                key={link}
                href={link}
                className="py-2 text-slate-700"
                onClick={() => setMenuOpen(false)}
              >
                {link}
              </a>
            ))}
            {isLoggedIn ? (
              <div className="flex items-center gap-3 px-2 py-2 text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <User size={16} />
                </div>
                <span className="font-medium">My Profile</span>
              </div>
            ) : (
              <>
                <Button variant="secondary" size="md">Sign In</Button>
                <Button variant="primary" size="md">Get Started</Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
