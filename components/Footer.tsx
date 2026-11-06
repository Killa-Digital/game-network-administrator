import Link from 'next/link'
import { ChevronRight, Flame, Shield, Zap } from 'lucide-react'

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

          <div className="mt-6">
            <a
              href="https://whatsapp.com/channel/0029VbCaMrJ3AzNRvZ6PAA3W"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 bg-[#25D366]/10 border-2 border-[#25D366] px-5 py-3 -skew-x-12 shadow-[4px_4px_0px_#25D366] hover:shadow-none hover:bg-[#25D366] hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              <div className="skew-x-12 flex items-center gap-2.5">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 text-[#25D366] group-hover:text-black transition-colors"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
                <span className="text-[#25D366] group-hover:text-black font-black uppercase tracking-[0.2em] text-[11px] transition-colors mt-0.5">
                  Comunidad de WhatsApp
                </span>
              </div>
            </a>
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
            href="/privacidad"
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
  )
}
