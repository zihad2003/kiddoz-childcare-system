import React from 'react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

export const BentoGrid = ({ className, children }) => {
    return (
        <div
            className={cn(
                "grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-4 lg:gap-5 p-4 md:p-6",
                className
            )}
        >
            {children}
        </div>
    );
};

export const BentoItem = ({
    className,
    title,
    description,
    header,
    icon,
    children,
    colSpan = { sm: 12, md: 4, lg: 4 }, // Default spans
    rowSpan = 1,
    gradient = false
}) => {

    const getColSpanClass = (span) => {
        if (typeof span === 'number') return `lg:col-span-${span}`;
        return `col-span-${span.sm || 12} md:col-span-${span.md || 4} lg:col-span-${span.lg || 4}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
                "relative overflow-hidden rounded-3xl bg-surface border border-gray-100 dark:border-white/10 shadow-card hover:shadow-card-hover transition-all duration-300 group/bento",
                getColSpanClass(colSpan),
                rowSpan > 1 && `row-span-${rowSpan}`,
                gradient && "bg-gradient-to-br from-white to-gray-50",
                className
            )}
        >
            {header}
            <div className="p-6 h-full flex flex-col">
                {icon && <div className="mb-4 text-primary">{icon}</div>}
                {title && (
                    <div className="font-sans font-bold text-lg text-text-primary mb-2 group-hover/bento:text-primary transition-colors">
                        {title}
                    </div>
                )}
                {description && (
                    <div className="font-sans font-normal text-sm text-text-secondary mb-4">
                        {description}
                    </div>
                )}
                <div className="flex-1">
                    {children}
                </div>
            </div>
            {/* Decorative Gradient Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover/bento:opacity-100 transition-opacity duration-500" />
        </motion.div>
    );
};
