import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, UtensilsCrossed } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white py-16 mt-12" id="footer">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm text-white shadow-lg">
                                <UtensilsCrossed size={24} />
                            </div>
                            <span className="text-2xl font-bold">MealMate</span>
                        </div>
                        <p className="text-green-50 leading-relaxed">
                            Transforming campus dining with seamless meal planning,
                            ordering, and management for students, teachers, and administrators.
                        </p>
                        <div className="flex gap-3">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className="w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white hover:text-green-600 hover:-translate-y-1 transition-all duration-200"
                                >
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Company</h3>
                        <ul className="space-y-3">
                            {['About Us', 'Careers', 'Press', 'Blog'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-green-50 hover:text-white transition-colors">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Support</h3>
                        <ul className="space-y-3">
                            {['Help Center', 'Contact Us', 'FAQ', 'Community'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-green-50 hover:text-white transition-colors">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact</h3>
                        <ul className="space-y-3 text-green-50">
                            <li className="flex items-center gap-2">
                                <Mail size={16} />
                                Support@mealmate.com
                            </li>
                            <li>+977 9800925222</li>
                            <li>Dharan, Sunsari</li>
                            <li>Nepal</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/20 text-green-50 text-sm">
                    <p>&copy; {new Date().getFullYear()} MealMate. All rights reserved.</p>
                    <div className="flex gap-6">
                        {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                            <a key={item} href="#" className="hover:text-white transition-colors">
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
