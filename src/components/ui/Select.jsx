import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const Select = forwardRef(({
    label,
    error,
    icon: Icon,
    options = [],
    className = "",
    placeholder = "Select an option",
    value,
    onChange,
    disabled = false,
    ...props
}, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Filter out disabled/placeholder from options if needed
    const validOptions = options.filter(opt => opt.value !== "");

    const selectedOption = options.find(opt => String(opt.value) === String(value));

    const handleToggle = () => {
        if (!disabled) setIsOpen(!isOpen);
    };

    const handleSelect = (val) => {
        if (onChange) {
            // Simulate an event object for compatibility with common form handlers
            onChange({ target: { value: val, name: props.name } });
        }
        setIsOpen(false);
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`w-full group/select ${className}`} ref={containerRef}>
            {label && (
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1 italic">
                    {label}
                </label>
            )}

            <div className="relative">
                {/* Trigger */}
                <div
                    onClick={handleToggle}
                    className={`
                        relative w-full flex items-center gap-4 bg-slate-50/50 backdrop-blur-md border border-slate-200/60 
                        rounded-2xl px-5 py-4 cursor-pointer transition-all duration-300
                        ${isOpen ? 'border-primary-500 shadow-xl bg-white ring-4 ring-primary-500/10' : 'hover:border-slate-300 hover:bg-white'}
                        ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}
                        ${error ? 'border-rose-500 ring-rose-500/10' : ''}
                    `}
                >
                    {Icon && (
                        <div className={`transition-colors duration-300 ${isOpen ? 'text-primary-600' : 'text-slate-400'}`}>
                            <Icon size={20} />
                        </div>
                    )}

                    <span className={`flex-1 font-bold text-sm tracking-tight truncate ${selectedOption ? 'text-slate-900 italic' : 'text-slate-400 italic'}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>

                    <ChevronDown
                        size={18}
                        className={`text-slate-400 transition-transform duration-500 ${isOpen ? 'rotate-180 text-primary-600' : ''}`}
                    />
                </div>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="absolute z-[100] mt-3 w-full bg-white/95 backdrop-blur-2xl border border-slate-200/60 rounded-[2rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] p-3 animate-in fade-in slide-in-from-top-4 duration-300 overflow-hidden">
                        <div className="max-h-64 overflow-y-auto scrollbar-hide space-y-1">
                            {options.length === 0 ? (
                                <div className="p-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                                    No signatures found
                                </div>
                            ) : (
                                options.map((opt) => (
                                    <div
                                        key={opt.value}
                                        onClick={() => handleSelect(opt.value)}
                                        className={`
                                            flex items-center justify-between px-5 py-4 rounded-xl cursor-pointer transition-all duration-200
                                            ${String(opt.value) === String(value)
                                                ? 'bg-[#0f172a] text-white shadow-lg shadow-slate-900/20'
                                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                                        `}
                                    >
                                        <span className={`text-[10px] font-black uppercase tracking-widest italic ${String(opt.value) === String(value) ? 'text-white' : ''}`}>
                                            {opt.label}
                                        </span>
                                        {String(opt.value) === String(value) && (
                                            <Check size={14} className="text-primary-400" />
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <p className="mt-2 text-[10px] font-black text-rose-500 ml-1 uppercase tracking-widest italic animate-bounce">
                    {error}
                </p>
            )}
        </div>
    );
});

Select.displayName = "Select";

export default Select;
