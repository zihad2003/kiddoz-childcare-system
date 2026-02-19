import React from 'react';

const Skeleton = ({ className, width, height, variant = 'text' }) => {
    // variant: 'text' | 'circular' | 'rectangular' | 'rounded'

    const baseClasses = "animate-pulse bg-slate-200/80";
    const variantClasses = {
        text: "rounded-md",
        circular: "rounded-full",
        rectangular: "rounded-none",
        rounded: "rounded-xl"
    };

    const style = {
        width: width,
        height: height
    };

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className || ''}`}
            style={style}
        />
    );
};

export default Skeleton;
