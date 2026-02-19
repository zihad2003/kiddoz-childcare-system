import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, error, icon: Icon, className = "", ...props }, ref) => {
    return (
        <div className="w-full">
            {label && <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">{label}</label>}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <Icon size={20} />
                    </div>
                )}
                <input
                    ref={ref}
                    className={`
            w-full bg-white border border-slate-200 text-slate-800 rounded-xl py-3 
            ${Icon ? 'pl-10' : 'pl-4'} pr-4 
            focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500
            placeholder:text-slate-400 transition-all duration-200
            disabled:bg-slate-50 disabled:text-slate-500
            ${error ? 'border-red-500 ring-red-200' : ''}
            ${className}
          `}
                    {...props}
                />
            </div>
            {error && <p className="mt-1 text-sm text-red-500 ml-1 font-medium">{error}</p>}
        </div>
    );
});

Input.displayName = "Input";

export default Input;
