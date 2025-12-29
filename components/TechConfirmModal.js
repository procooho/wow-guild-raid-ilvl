import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import WarningIcon from '@mui/icons-material/Warning';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

export default function TechConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = "CONFIRM", cancelText = "CANCEL" }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onCancel}>
            <div className="relative w-full max-w-lg bg-black/95 border border-red-500/30 p-8 shadow-[0_0_30px_rgba(239,68,68,0.2)]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Decorative corners */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-500" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-500" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-500" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-500" />

                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none" />

                <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6 border-b border-red-500/20 pb-4">
                        <WarningIcon className="text-red-500 animate-pulse" fontSize="large" />
                        <div>
                            <h2 className="text-xl font-black text-white uppercase tracking-widest leading-none">
                                {title || "CONFIRMATION REQUIRED"}
                            </h2>
                            <p className="text-[10px] text-red-500/80 font-mono tracking-[0.2em] mt-1 uppercase">
                                {/* IRREVERSIBLE ACTION DETECTED */}
                            </p>
                        </div>
                    </div>

                    {/* Message */}
                    <div className="mb-8 pl-4 border-l-2 border-red-500/30">
                        <p className="text-gray-300 font-mono text-sm leading-relaxed uppercase tracking-wider">
                            {message}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 justify-end pt-2">
                        <button
                            onClick={onCancel}
                            className="px-6 py-3 border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white font-mono text-xs font-bold uppercase tracking-widest transition-all"
                        >
                            <span className="flex items-center gap-2">
                                <CloseIcon fontSize="small" /> {cancelText}
                            </span>
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                            style={{ clipPath: "polygon(10% 0, 100% 0, 100% 80%, 90% 100%, 0 100%, 0 20%)" }}
                        >
                            <span className="flex items-center gap-2">
                                <CheckIcon fontSize="small" /> {confirmText}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        , document.body);
}
