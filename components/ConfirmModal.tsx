'use client';
import { AlertTriangle, HelpCircle } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({
                                         isOpen, title, message, confirmText = 'Aceptar', cancelText = 'Cancelar', type = 'warning', onConfirm, onCancel
                                     }: ConfirmModalProps) {
    if (!isOpen) return null;

    const isDanger = type === 'danger';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            <div className="bg-[#110f16] border-2 border-white/20 w-full max-w-md shadow-[8px_8px_0px_#1f1a29] flex flex-col relative overflow-hidden">

                <div className={`h-1 w-full ${isDanger ? 'bg-[#ff2a1f]' : 'bg-[#ffb703]'}`} />

                <div className="p-6 md:p-8 relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`p-3 border-2 -skew-x-12 ${isDanger ? 'bg-[#ff2a1f]/10 border-[#ff2a1f]' : 'bg-[#ffb703]/10 border-[#ffb703]'}`}>
                            {isDanger ? <AlertTriangle className={`w-6 h-6 skew-x-12 text-[#ff2a1f]`} /> : <HelpCircle className={`w-6 h-6 skew-x-12 text-[#ffb703]`} />}
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-tighter text-white">{title}</h3>
                    </div>

                    <p className="text-sm font-medium text-zinc-400 mb-8">{message}</p>

                    <div className="flex gap-4">
                        <button
                            onClick={onCancel}
                            className="flex-1 py-3 bg-transparent border-2 border-white/20 hover:border-white/50 text-white font-black text-xs uppercase tracking-widest transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-[1.5] py-3 border-2 font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_rgba(0,0,0,0.5)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none
                                ${isDanger ? 'bg-[#ff2a1f] border-[#ff2a1f] text-white hover:bg-red-600' : 'bg-primary border-primary text-black hover:bg-[#ffc42e]'}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}