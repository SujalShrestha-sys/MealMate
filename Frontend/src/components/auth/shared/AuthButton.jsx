import React from 'react';
import { ArrowRight } from 'lucide-react';

const AuthButton = ({ children, type = 'button', onClick, className = '' }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-md shadow-green-600/20 hover:shadow-lg hover:shadow-green-600/30 active:scale-[0.98] flex items-center justify-center gap-2 ${className}`}
        >
            {children}
            <ArrowRight size={18} />
        </button>
    );
};

export default AuthButton;
