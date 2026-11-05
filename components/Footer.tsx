import Link from 'next/link';
import { Zap, Flame, Shield, ChevronRight } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#070609] border-t-4 border-[#ff2a1f] mt-auto pt-16 pb-10 relative overflow-hidden bg-halftone">

            <div className="absolute inset-0 bg-speedlines pointer-events-none z-0" />

            <div className="absolute -bottom-8 right-4 pointer-events-none select-none z-0">
                <span className="text-[6rem] md:text-[10rem] font-black uppercase tracking-tighter leading-none text-stroke-subtle block">
                    SYNDICATE
                </span>
            </div>

            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-start justify-between gap-12 mb-14 relative z-10">

                <div className="flex flex-col items-start max-w-sm">
                    <Link href="/" className="flex items-center group mb-6">
                        <img
                            src="/logo.png"
                            alt="IM Shop"
                            className="h-16 md:h-20 object-contain drop-shadow-[5px_5px_0px_#000000] group-hover:scale-105 group-hover:-rotate-2 transition-transform duration-200"
                        />
                    </Link>

                    <div className="bg-[#110f16] border-l-4 border-[#ff2a1f] border-y border-r border-white/10 p-4 shadow-[4px_4px_0px_#1f1a29]">
                        <p className="text-zinc-300 text-xs font-black uppercase tracking-[0.18em] leading-relaxed">
                            Recargas oficiales al instante. <br />
                            <span className="text-primary">Domina el juego sin esperas.</span>
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-3.5">
                    <div className="inline-flex items-center gap-2 bg-[#ff2a1f] px-3 py-1 mb-2 -skew-x-12 w-fit shadow-[3px_3px_0px_#ffb703]">
                        <Flame className="w-3.5 h-3.5 text-white fill-white skew-x-12" />
                        <h4 className="text-white font-black uppercase tracking-[0.22em] text-[11px] skew-x-12">
                            Plataforma
                        </h4>
                    </div>

                    <Link
                        href="/#catalogo"
                        className="group flex items-center gap-2 text-zinc-400 text-xs font-black uppercase tracking-widest hover:text-primary transition-colors"
                    >
                        <ChevronRight className="w-4 h-4 text-[#ff2a1f] group-hover:translate-x-1 transition-transform stroke-[3]" />
                        Catálogo de Juegos
                    </Link>
                    <Link
                        href="#"
                        className="group flex items-center gap-2 text-zinc-400 text-xs font-black uppercase tracking-widest hover:text-primary transition-colors"
                    >
                        <ChevronRight className="w-4 h-4 text-[#ff2a1f] group-hover:translate-x-1 transition-transform stroke-[3]" />
                        Soporte Técnico
                    </Link>
                </div>

                <div className="flex flex-col gap-3.5">
                    <div className="inline-flex items-center gap-2 bg-[#110f16] border-2 border-primary px-3 py-1 mb-2 -skew-x-12 w-fit shadow-[3px_3px_0px_#ff2a1f]">
                        <Shield className="w-3.5 h-3.5 text-primary skew-x-12" />
                        <h4 className="text-white font-black uppercase tracking-[0.22em] text-[11px] skew-x-12">
                            Legal
                        </h4>
                    </div>

                    <Link
                        href="/terminos"
                        className="group flex items-center gap-2 text-zinc-400 text-xs font-black uppercase tracking-widest hover:text-primary transition-colors"
                    >
                        <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform stroke-[3]" />
                        Términos y Condiciones
                    </Link>
                    <Link
                        href="#"
                        className="group flex items-center gap-2 text-zinc-400 text-xs font-black uppercase tracking-widest hover:text-primary transition-colors"
                    >
                        <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform stroke-[3]" />
                        Políticas de Privacidad
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 border-t-2 border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.22em] text-center md:text-left">
                    © {new Date().getFullYear()} IM SHOP // TODOS LOS DERECHOS RESERVADOS.
                </p>

                <div className="flex items-center gap-2 text-[#00e5ff] text-[10px] font-black uppercase tracking-[0.2em] bg-[#110f16] px-4 py-1.5 -skew-x-12 border-2 border-[#00e5ff] shadow-[3px_3px_0px_#ff2a1f]">
                    <span className="skew-x-12 flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 fill-[#00e5ff]" /> LIMA, PE
                    </span>
                </div>
            </div>
        </footer>
    );
}