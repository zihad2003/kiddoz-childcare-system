import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle className="text-green-500" size={24} />,
        error: <XCircle className="text-red-500" size={24} />,
        warning: <AlertCircle className="text-amber-500" size={24} />,
        info: <Info className="text-blue-500" size={24} />
    };

    const borders = {
        success: 'border-l-green-500',
        error: 'border-l-red-500',
        warning: 'border-l-amber-500',
        info: 'border-l-blue-500'
    };

    return (
        <div className={`fixed top-6 right-6 z-[100] bg-white shadow-2xl rounded-lg p-4 flex items-center gap-4 min-w-[300px] border-l-4 animate-in slide-in-from-right-10 fade-in duration-300 ${borders[type]}`}>
            <div>{icons[type]}</div>
            <div className="flex-1">
                <p className="font-bold text-slate-800 capitalize">{type}</p>
                <p className="text-sm text-slate-600">{message}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
                <X size={18} />
            </button>
        </div>
    );
};

export default Toast;
