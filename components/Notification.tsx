'use client';
import { useEffect } from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

interface NotificationProps {
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
    onClose: () => void;
}

export default function Notification({ message, type, isVisible, onClose }: NotificationProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    const types = {
        success: { bg: 'bg-[#00e5ff]/10', border: 'border-[#00e5ff]', icon: <CheckCircle className="w-5 h-5 text-[#00e5ff]" />, text: 'text-[#00e5ff]' },
        error: { bg: 'bg-[#ff2a1f]/10', border: 'border-[#ff2a1f]', icon: <AlertTriangle className="w-5 h-5 text-[#ff2a1f]" />, text: 'text-[#ff2a1f]' },
        info: { bg: 'bg-primary/10', border: 'border-primary', icon: <Info className="w-5 h-5 text-primary" />, text: 'text-primary' }
    };

    const current = types[type];

    return (
        <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className={`flex items-center gap-4 p-4 border-2 ${current.bg} ${current.border} shadow-[4px_4px_0px_#000000] bg-[#070609]`}>
                {current.icon}
                <p className="text-xs font-black uppercase tracking-widest text-white max-w-[250px]">{message}</p>
                <button onClick={onClose} className={`ml-2 p-1 hover:bg-white/10 transition-colors ${current.text}`}>
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}