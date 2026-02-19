import React, { useState, useEffect } from 'react';

const Preloader = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(() => setIsVisible(false), 500);
                    return 100;
                }
                return prev + 2;
            });
        }, 50);

        return () => clearInterval(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-50 transition-opacity duration-1000 ${progress === 100 ? 'opacity-0' : 'opacity-100'}`}>
            <div className="relative">
                {/* Animated Logo Container */}
                <div className="w-32 h-32 mb-8 relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-primary-100 rounded-full animate-ping opacity-20"></div>
                    <div className="absolute inset-2 bg-primary-200 rounded-full animate-pulse opacity-40"></div>
                    <div className="text-5xl font-black text-primary-600 relative z-10 animate-bounce">
                        K<span className="text-secondary-500">Z</span>
                    </div>
                </div>
            </div>

            {/* Loading Text */}
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">Kiddo<span className="text-primary-600 font-black">Z</span> System</h2>
                <p className="text-slate-400 text-sm font-medium animate-pulse uppercase tracking-[0.2em]">Initializing Childcare Ecosystem</p>
            </div>

            {/* Progress Bar Container */}
            <div className="mt-12 w-64 h-1 bg-slate-100 rounded-full overflow-hidden relative">
                <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-600 to-secondary-500 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(147,51,234,0.5)]"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            <div className="mt-4 text-slate-400 font-mono text-xs font-bold">
                {progress}%
            </div>

            {/* Floating Decorative Blobs */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary-50 rounded-full blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-secondary-50 rounded-full blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        </div>
    );
};

export default Preloader;
