'use client';
import { useState } from 'react';
import { Search, Loader2, ChevronRight, Flame, XCircle, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export default function PlayerValidation() {
    const [localPlayerId, setLocalPlayerId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { nickname, setPlayer } = useCartStore();

    const validateId = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!localPlayerId) return;
        setLoading(true);
        setError('');
        useCartStore.getState().clearCart();

        try {
            const response = await fetch('/api/validate-id', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerId: localPlayerId, gameCode: 'freefire' }),
            });
            const data = await response.json();

            if (response.ok && data.success) {
                setPlayer(localPlayerId, data.nickname);
            } else {
                const errorMessage = data.error?.toUpperCase() || '';
                if (errorMessage.includes('NOT ENABLED')) {
                    setPlayer(localPlayerId, 'USUARIO_DE_PRUEBA');
                    return;
                }
                setError(data.error || 'No se pudo validar el ID');
            }
        } catch (err) {
            setError('Error de conexión con el servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full bg-[#110f16] border-2 border-white/20 p-6 md:p-8 flex flex-col shadow-[6px_6px_0px_#1f1a29] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-3 h-3 bg-primary" />
            <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-4">
                <div className="w-9 h-9 bg-primary text-black border-2 border-black shadow-[3px_3px_0px_#ff2a1f] -skew-x-6 flex items-center justify-center text-sm font-black">
                    <span className="skew-x-6">1</span>
                </div>
                Verificación de ID
            </h2>
            <form onSubmit={validateId} className="space-y-6">
                <div>
                    <label className="block text-[10px] font-black text-zinc-400 mb-3 uppercase tracking-[0.25em]">ID del Jugador</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={localPlayerId}
                            onChange={(e) => setLocalPlayerId(e.target.value)}
                            placeholder="Ej: 123456789"
                            className="w-full pl-5 pr-12 py-4 bg-[#070609] border-2 border-white/15 outline-none focus:border-primary focus:shadow-[4px_4px_0px_#ff2a1f] transition-all text-white font-black text-lg tracking-wider placeholder:text-zinc-700"
                            disabled={loading}
                        />
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                    </div>
                </div>
                <button
                    type="submit"
                    className="group w-full inline-flex items-center justify-center gap-3 py-4 bg-primary hover:bg-[#ffc42e] text-black font-black text-sm uppercase tracking-[0.18em] border-2 border-black shadow-[6px_6px_0px_#ff2a1f] hover:shadow-[2px_2px_0px_#ff2a1f] hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:hover:shadow-[6px_6px_0px_#ff2a1f] disabled:hover:translate-x-0 disabled:hover:translate-y-0 cursor-pointer disabled:cursor-not-allowed"
                    disabled={!localPlayerId || loading}
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                        <>
                            <Flame className="w-5 h-5 fill-black group-hover:scale-110 transition-transform" /> Buscar Cuenta <ChevronRight className="w-5 h-5 stroke-[3]" />
                        </>
                    )}
                </button>
            </form>
            {error && (
                <div className="mt-8 p-4 border-2 border-[#ff2a1f] bg-[#ff2a1f]/10 flex items-start gap-4 shadow-[4px_4px_0px_#ff2a1f] animate-in fade-in">
                    <XCircle className="w-5 h-5 text-[#ff2a1f] shrink-0 mt-0.5" />
                    <p className="text-[11px] font-black text-[#ff6b60] uppercase tracking-widest mt-0.5 leading-relaxed">{error}</p>
                </div>
            )}
            {nickname && (
                <div className="mt-8 p-5 bg-[#00e5ff]/10 border-2 border-[#00e5ff] shadow-[4px_4px_0px_#00e5ff]/40 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="bg-[#00e5ff]/15 border border-[#00e5ff]/40 p-2.5">
                        <CheckCircle2 className="w-6 h-6 text-[#00e5ff]" />
                    </div>
                    <div>
                        <p className="text-[10px] text-[#00e5ff] font-black uppercase tracking-[0.25em] mb-1">Cuenta Validada</p>
                        <p className="text-xl font-black text-white tracking-tight uppercase">{nickname}</p>
                    </div>
                </div>
            )}
        </div>
    );
}