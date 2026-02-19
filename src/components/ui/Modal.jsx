import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-md" }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className={`bg-white text-slate-900 rounded-3xl shadow-2xl w-full ${maxWidth} max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-8 duration-300 relative`}
            >
                <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-600">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition text-slate-500"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;
