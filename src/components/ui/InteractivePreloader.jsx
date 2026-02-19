import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

const InteractivePreloader = ({ onComplete }) => {
    const [entered, setEntered] = useState(false);
    const [exiting, setExiting] = useState(false);
    const [textIndex, setTextIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    const phrases = ["Smart Monitoring", "AI Health Insights", "Secure Environment", "Happy Kids"];

    useEffect(() => {
        const interval = setInterval(() => {
            setTextIndex((prev) => (prev + 1) % phrases.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    // Auto-progress logic
    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    handleEnter();
                    return 100;
                }
                if (exiting) return 100; // Stop if already exiting
                return prev + 1; // Approx 3s load time (30ms * 100)
            });
        }, 30);
        return () => clearInterval(timer);
    }, [exiting]);

    const handleEnter = () => {
        if (exiting) return;
        setExiting(true);
        setTimeout(() => {
            setEntered(true);
            if (onComplete) onComplete();
        }, 800); // 800ms exit animation
    };

    if (entered) return null;

    return (
        <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900 overflow-hidden transition-all duration-700 ${exiting ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100'}`}>

            {/* Background Animations */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center flex flex-col items-center">
                {/* Logo */}
                <div className="mb-8 relative group cursor-default">
                    <div className="absolute inset-0 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                    <div className="w-24 h-24 bg-gradient-to-tr from-primary-600 to-primary-500 rounded-2xl flex items-center justify-center shadow-2xl transform hover:rotate-6 transition-all duration-500">
                        <span className="text-4xl font-black text-white tracking-tighter">K</span>
                    </div>
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
                    Kiddo<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">Z</span>
                </h1>

                {/* Changing Text */}
                <div className="h-8 mb-8 overflow-hidden">
                    <p className="text-slate-400 text-sm md:text-base font-medium tracking-[0.2em] uppercase animate-slide-up key={textIndex}">
                        {phrases[textIndex]}
                    </p>
                </div>

                {/* Progress Bar (Replaces Button) */}
                <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden relative">
                    <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-75 ease-linear shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="mt-4 text-slate-500 text-xs font-mono">
                    <span className="animate-pulse">Loading System... {progress}%</span>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-8 text-slate-500 text-xs font-mono">
                v2.0.0 • AI-Powered Childcare System
            </div>
        </div>
    );
};

export default InteractivePreloader;
