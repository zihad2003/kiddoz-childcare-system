import React from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
    primary: "bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-purple-500/30",
    secondary: "bg-amber-400 text-purple-900 hover:bg-amber-500 shadow-lg hover:shadow-amber-400/30",
    outline: "bg-transparent border-2 border-purple-600 text-purple-600 hover:bg-purple-50",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg hover:shadow-red-500/30",
    glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
};

const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-4 text-lg"
};

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    icon: Icon,
    className = "",
    disabled,
    ...props
}) => {
    return (
        <button
            disabled={isLoading || disabled}
            className={`
        relative inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} 
        ${sizes[size]} 
        ${className}
      `}
            {...props}
        >
            {isLoading && <Loader2 className="animate-spin" size={18} />}
            {!isLoading && Icon && <Icon size={18} />}
            {children}
        </button>
    );
};

export default Button;
