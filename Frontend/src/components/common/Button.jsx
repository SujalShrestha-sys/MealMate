import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    icon,
    iconPosition = 'left',
    onClick,
    className = '',
    ...props
}) => {
    // Base styles
    const baseStyles = 'inline-flex items-center justify-center gap-2 cursor-pointer font-semibold rounded-lg transition-all duration-200 hover:-translate-y-0.5';

    // Variant styles
    const variants = {
        primary: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md hover:shadow-lg hover:brightness-110',

        secondary: 'bg-transparent text-green-600 border-2 border-green-600 hover:bg-green-600 hover:text-white',

        dark: 'bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md hover:shadow-lg hover:brightness-125',

        warning: 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 shadow-md hover:shadow-lg hover:brightness-110'
    };

    // Size styles
    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg'
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            onClick={onClick}
            {...props}
        >
            {icon && iconPosition === 'left' && <span>{icon}</span>}
            {children}
            {icon && iconPosition === 'right' && <span>{icon}</span>}
        </button>
    );
};

export default Button;
