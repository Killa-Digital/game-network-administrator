'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Gamepad2, ArrowLeft, ShieldCheck, Zap, Crosshair, Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { supabase } from '@/lib/supabase';

import Notification from '@/components/Notification';
import ConfirmModal from '@/components/ConfirmModal';
import PlayerValidation from './components/PlayerValidation';
import PackageCatalog from './components/PackageCatalog';

const LOADING_MESSAGES = [
    "PROCESANDO PAGO...",
    "CONECTANDO CON EL SERVIDOR...",
    "INYECTANDO DIAMANTES...",
    "VERIFICANDO ENTREGA...",
    "POR FAVOR, NO CIERRES LA VENTANA..."
];

export default function GamePage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [packages, setPackages] = useState<any[]>([]);
    const [loadingPackages, setLoadingPackages] = useState(true);
    const [gameExists, setGameExists] = useState(true);
    const [userBalance, setUserBalance] = useState<number | null>(null);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [loadingText, setLoadingText] = useState(LOADING_MESSAGES[0]);

    const [notify, setNotify] = useState({ isVisible: false, message: '', type: 'info' as 'success'|'error'|'info' });
    const [modal, setModal] = useState<{ isOpen: boolean }>({ isOpen: false });

    const { nickname, productCode, price } = useCartStore();

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (checkoutLoading) {
            let currentIndex = 0;
            setLoadingText(LOADING_MESSAGES[0]);
            interval = setInterval(() => {
                currentIndex = (currentIndex + 1) % LOADING_MESSAGES.length;
                setLoadingText(LOADING_MESSAGES[currentIndex]);
            }, 3500);
        }
        return () => clearInterval(interval);
    }, [checkoutLoading]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/packages?slug=${slug}`);
                const data = await res.json();
                if (data.success) setPackages(data.packages);
                else setGameExists(false);
            } catch (err) {
                setGameExists(false);
            } finally {
                setLoadingPackages(false);
            }
        };

        const fetchBalance = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const { data } = await supabase.from('profiles').select('balance').eq('id', session.user.id).single();
                if (data) setUserBalance(data.balance);
            }
        };

        fetchData();
        fetchBalance();
        return () => useCartStore.getState().clearCart();
    }, [slug]);

    const requestCheckout = () => {
        if (userBalance === null) {
            setNotify({ isVisible: true, message: 'Inicia sesión para poder comprar.', type: 'info' });
            return;
        }
        if (userBalance < price) {
            setNotify({ isVisible: true, message: 'Saldo insuficiente. Recarga en tu billetera.', type: 'error' });
            return;
        }
        setModal({ isOpen: true });
    };

    const executeCheckout = async () => {
        setModal({ isOpen: false });
        setCheckoutLoading(true);

        try {
            const response = await fetch('/api/purchase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    playerId: useCartStore.getState().playerId,
                    nickname,
                    productCode,
                    price
                }),
            });
            const data = await response.json();

            if (data.success) {
                setNotify({ isVisible: true, message: '¡Recarga exitosa! Diamantes enviados.', type: 'success' });
                useCartStore.getState().clearCart();
                setTimeout(() => router.push('/'), 2000);
            } else {
                setCheckoutLoading(false);
                setNotify({ isVisible: true, message: data.error === 'INSUFFICIENT_FUNDS' ? 'Saldo insuficiente. Recarga tu billetera.' : (data.message || data.error || 'Intenta de nuevo'), type: 'error' });
            }
        } catch (error) {
            setCheckoutLoading(false);
            setNotify({ isVisible: true, message: 'Error de conexión con el servidor', type: 'error' });
        }
    };

    if (!gameExists) {
        return (
            <div className="w-full flex-1 flex flex-col items-center justify-center py-32 px-4 bg-[#070609] selection:bg-[#ff2a1f] min-h-[80vh] relative overflow-hidden bg-halftone">
                <div className="relative z-10 bg-[#110f16] border-2 border-[#ff2a1f] p-10 flex flex-col items-center max-w-xl text-center shadow-[8px_8px_0px_#ff2a1f]">
                    <Gamepad2 className="w-14 h-14 text-[#ff2a1f] mb-6" />
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-5">Juego en <span className="text-primary">Desarrollo</span></h1>
                    <button onClick={() => router.push('/')} className="bg-primary hover:bg-[#ffc42e] text-black font-black text-sm px-8 py-3.5 uppercase transition-all">VOLVER AL INICIO</button>
                </div>
            </div>
        );
    }

    const selectedPackageName = packages.find(p => p.code === productCode)?.name || 'Paquete';
    const modalMessage = `Vas a recargar ${selectedPackageName} a la cuenta de ${nickname}. Saldo Actual: S/ ${(userBalance || 0).toFixed(2)} | Costo: S/ ${price.toFixed(2)} | Nuevo Saldo: S/ ${((userBalance || 0) - price).toFixed(2)}`;

    return (
        <div className="w-full pb-32 bg-[#070609] selection:bg-[#ff2a1f] min-h-screen relative overflow-hidden font-sans bg-halftone">

            {checkoutLoading && (
                <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#070609]/90 backdrop-blur-md animate-in fade-in duration-300 pointer-events-auto">
                    <div className="bg-primary/20 border-2 border-primary p-6 mb-8 -skew-x-6 shadow-[0_0_30px_rgba(255,183,3,0.3)]">
                        <Loader2 className="w-16 h-16 text-primary animate-spin skew-x-6" />
                    </div>

                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 text-center px-4 animate-pulse drop-shadow-[4px_4px_0px_#000000]">
                        {loadingText}
                    </h2>

                    <div className="flex items-center justify-center gap-2 mt-4 text-[#00e5ff] text-xs md:text-sm font-black uppercase tracking-[0.2em] bg-black/50 px-6 py-3 border border-white/10 shadow-lg">
                        <ShieldCheck className="w-5 h-5" />
                        Procesamiento encriptado de alta seguridad
                    </div>
                </div>
            )}

            <Notification isVisible={notify.isVisible} message={notify.message} type={notify.type} onClose={() => setNotify(prev => ({ ...prev, isVisible: false }))} />
            <ConfirmModal isOpen={modal.isOpen} title="Confirmar Recarga" message={modalMessage} confirmText="SÍ, PAGAR AHORA" cancelText="CANCELAR" type="warning" onConfirm={executeCheckout} onCancel={() => setModal({ isOpen: false })} />

            <div className="absolute inset-0 bg-speedlines pointer-events-none z-0" />

            <div className="w-full bg-[#0c0a10] border-b-2 border-[#1f1a29] py-3 relative z-20">
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
                    <Link href="/#catalogo" className="flex items-center text-[11px] font-black uppercase text-zinc-300 hover:text-primary transition-colors"><ArrowLeft className="w-4 h-4 mr-3 text-[#ff2a1f]" /> VOLVER AL CATÁLOGO</Link>
                    <span className="hidden md:flex items-center gap-2 text-[11px] font-black uppercase text-zinc-300"><ShieldCheck className="w-3.5 h-3.5 text-[#00e5ff]" /> SISTEMA ANTI-BAN <strong className="text-[#00e5ff]">VERIFICADO</strong></span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 mt-12 md:mt-16 relative z-10">
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-white/10 pb-6">
                    <div>
                        <div className="inline-flex items-center gap-3 bg-[#120e17] border-2 border-[#ff2a1f] px-4 py-1.5 mb-5 -skew-x-12 shadow-[4px_4px_0px_#ff2a1f]">
                            <span className="skew-x-12 flex items-center gap-2 text-[11px] font-black uppercase text-white"><Crosshair className="w-3.5 h-3.5 text-primary" /> RECARGA DIRECTA — <span className="text-primary">AL ID</span></span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9]">{slug.replace(/-/g, ' ')} <span className="text-primary">ID</span></h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-5 h-full">
                        <PlayerValidation />
                    </div>
                    <div className="lg:col-span-7 h-full">
                        <PackageCatalog
                            packages={packages}
                            loadingPackages={loadingPackages}
                            onRequestCheckout={requestCheckout}
                            checkoutLoading={checkoutLoading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}