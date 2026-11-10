import { Wrench, AlertTriangle } from 'lucide-react'

export default function Maintenance() {
  return (
    <div className="min-h-screen bg-[#070609] flex flex-col items-center justify-center relative overflow-hidden bg-halftone px-4">
      <div className="absolute inset-0 bg-speedlines pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] bg-gradient-to-tr from-[#ff2a1f]/30 via-[#ffb703]/20 to-[#00e5ff]/10 blur-[130px] rounded-full pointer-events-none z-0" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none select-none overflow-hidden opacity-40">
        <span className="text-[6rem] sm:text-[10rem] lg:text-[14rem] font-black uppercase tracking-tighter leading-none text-stroke-subtle block text-center">
          OFFLINE
        </span>
      </div>

      <div className="relative z-10 bg-[#110f16] border-2 border-[#ff2a1f] p-8 md:p-14 max-w-2xl w-full text-center shadow-[12px_12px_0px_#ff2a1f] flex flex-col items-center">
        <div className="absolute top-0 right-0 w-4 h-4 bg-[#ff2a1f]" />
        <div className="absolute bottom-0 left-0 w-4 h-4 bg-[#ff2a1f]" />

        <div className="inline-block bg-[#ff2a1f]/10 border-2 border-[#ff2a1f] p-5 mb-8 shadow-[6px_6px_0px_#000000]">
          <Wrench className="w-10 h-10 text-[#ff2a1f]" />
        </div>

        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 bg-[#ffb703] border-2 border-black px-4 py-1.5 -skew-x-12 shadow-[4px_4px_0px_#ff2a1f]">
            <span className="skew-x-12 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.25em] text-black">
              <AlertTriangle className="w-4 h-4 stroke-[3]" />
              PROTOCOLO DE ACTUALIZACIÓN
            </span>
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-8 drop-shadow-[4px_4px_0px_#000000]">
          SITIO EN <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2a1f] via-[#ff6b00] to-[#ffb703]">
            MANTENIMIENTO
          </span>
        </h1>

        <p className="text-zinc-400 font-mono text-sm md:text-base leading-relaxed border-t-2 border-white/10 pt-8 max-w-lg">
          <span className="text-white font-bold bg-[#ff2a1f]/20 px-2 py-1 border border-[#ff2a1f]/40 inline-block mt-2">
            VOLVEREMOS MUY PRONTO.
          </span>
        </p>
      </div>
    </div>
  )
}
