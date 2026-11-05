'use client';
import { useState } from 'react';
import { Loader2, Lock, Gem, Crown, Flame, ShieldCheck } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

interface Package {
    code: string;
    name: string;
    price: number;
}

interface PackageCatalogProps {
    packages: Package[];
    loadingPackages: boolean;
    onRequestCheckout: () => void;
    checkoutLoading: boolean;
}

export default function PackageCatalog({ packages, loadingPackages, onRequestCheckout, checkoutLoading }: PackageCatalogProps) {
    const [activeTab, setActiveTab] = useState<'diamonds' | 'memberships'>('diamonds');
    const { nickname, productCode, price, setProduct } = useCartStore();

    const isMembership = (code: string) => code.includes('weekly') || code.includes('monthly') || code.includes('pass');
    const displayedPackages = packages
        .filter(pkg => activeTab === 'diamonds' ? !isMembership(pkg.code) : isMembership(pkg.code));

    return (
        <div className="h-full bg-[#110f16] border-2 border-white/20 p-6 md:p-8 flex flex-col shadow-[6px_6px_0px_#1f1a29] relative overflow-hidden">

            <div className="absolute top-0 right-0 w-3 h-3 bg-[#00e5ff]" />
            {!nickname && (
                <div className="absolute inset-0 z-20 bg-[#070609]/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in bg-halftone">
                    <div className="bg-[#ff2a1f]/10 border-2 border-[#ff2a1f]/40 p-4 mb-4 -skew-x-6">
                        <Lock className="w-7 h-7 text-[#ff2a1f] skew-x-6" />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Desbloquea el Catálogo</h3>
                    <p className="text-zinc-400 text-sm max-w-sm font-medium">Ingresa tu Player ID en el panel izquierdo para verificar tu cuenta y ver los paquetes disponibles.</p>
                </div>
            )}

            <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-4 relative z-10">
                <div className={`w-9 h-9 border-2 -skew-x-6 flex items-center justify-center text-sm font-black transition-colors ${nickname ? 'bg-primary text-black border-black shadow-[3px_3px_0px_#ff2a1f]' : 'bg-white/5 border-white/15 text-zinc-500'}`}>
                    <span className="skew-x-6">2</span>
                </div>
                Elige tu Paquete
            </h2>

            <div className="flex gap-2 bg-[#070609] border-2 border-white/15 p-1.5 mb-8 relative z-10">
                <button
                    onClick={() => setActiveTab('diamonds')}
                    className={`flex-1 py-3 text-[11px] md:text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer
                        ${activeTab === 'diamonds' ? 'bg-[#ff2a1f] text-white shadow-[2px_2px_0px_#ffb703]' : 'text-zinc-500 hover:text-white'}`}
                >
                    <Gem className="w-4 h-4" /> Diamantes
                </button>
                <button
                    onClick={() => setActiveTab('memberships')}
                    className={`flex-1 py-3 text-[11px] md:text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer
                        ${activeTab === 'memberships' ? 'bg-[#ff2a1f] text-white shadow-[2px_2px_0px_#ffb703]' : 'text-zinc-500 hover:text-white'}`}
                >
                    <Crown className="w-4 h-4" /> Membresías
                </button>
            </div>

            <div className="relative z-10 flex-1">
                {loadingPackages ? (
                    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/10 bg-[#0a080d]">
                        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                        <p className="text-primary text-xs font-black uppercase tracking-[0.3em] animate-pulse">Sincronizando...</p>
                    </div>
                ) : displayedPackages.length === 0 ? (
                    <div className="flex items-center justify-center py-20 border-2 border-dashed border-white/10 bg-[#0a080d]">
                        <p className="text-center text-xs font-black uppercase tracking-[0.25em] text-zinc-500">No hay paquetes disponibles.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 max-h-[450px] overflow-y-auto p-2 pr-3 custom-scrollbar">
                        {displayedPackages.map((pkg) => {
                            const selected = productCode === pkg.code;
                            return (
                                <button
                                    key={pkg.code}
                                    onClick={() => setProduct(pkg.code, pkg.price)}
                                    className={`relative p-4 border-2 transition-all duration-200 flex flex-col items-center justify-center gap-3 group cursor-pointer
                                        ${selected ? 'border-primary bg-primary/10 shadow-[5px_5px_0px_#ff2a1f] -translate-x-1 -translate-y-1' : 'border-white/20 bg-[#0a080d] shadow-[4px_4px_0px_#1f1a29] hover:border-primary hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_#ff2a1f]'}`}
                                >
                                    {selected && <div className="absolute top-0 right-0 w-3 h-3 bg-primary" />}
                                    <div className={`p-2.5 border transition-colors duration-200 ${selected ? 'text-primary bg-primary/15 border-primary/40' : 'text-zinc-400 bg-white/5 border-white/10 group-hover:text-primary'}`}>
                                        {isMembership(pkg.code) ? <Crown className="w-7 h-7" /> : <Gem className="w-7 h-7" />}
                                    </div>
                                    <div className="text-center w-full">
                                        <p className="font-black text-[11px] text-white uppercase tracking-wide mb-3 leading-tight h-8 flex items-center justify-center">{pkg.name}</p>
                                        <div className="flex flex-col items-center justify-center bg-black/50 border border-white/10 py-2 w-full">
                                            <p className={`text-lg font-black tracking-tight font-mono ${selected ? 'text-primary' : 'text-white'}`}>S/ {pkg.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="pt-6 border-t-2 border-white/10 mt-auto relative z-10">
                <button
                    onClick={onRequestCheckout}
                    className={`w-full py-4 lg:py-5 font-black text-sm md:text-base uppercase tracking-[0.18em] border-2 shadow-[6px_6px_0px_#ff2a1f] transition-all flex items-center justify-center gap-3 disabled:opacity-80 disabled:cursor-not-allowed
                        ${checkoutLoading ? 'bg-[#ffc42e] text-black border-black translate-x-1 translate-y-1 shadow-none' : 'bg-primary hover:bg-[#ffc42e] text-black border-black hover:shadow-[2px_2px_0px_#ff2a1f] hover:translate-x-1 hover:translate-y-1 cursor-pointer'}`}
                    disabled={!productCode || checkoutLoading}
                >
                    {checkoutLoading ? (
                        <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            <span>PROCESANDO...</span>
                        </>
                    ) : (
                        <>
                            <Flame className="w-5 h-5 fill-black" />
                            PAGAR CON SALDO VIRTUAL
                            {price > 0 && <span className="bg-black/30 text-white border border-black/20 px-2 py-0.5 font-mono">S/ {price.toFixed(2)}</span>}
                        </>
                    )}
                </button>
                <div className="flex items-center justify-center gap-2 mt-5 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
                    <ShieldCheck className="w-4 h-4 text-[#00e5ff]" /> Pago inmediato desde tu Billetera
                </div>
            </div>
        </div>
    );
}