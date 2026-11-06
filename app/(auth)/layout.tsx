import { ShieldCheck } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#070609] flex flex-col items-center justify-center relative overflow-hidden px-4 py-12 font-sans selection:bg-[#ff2a1f] selection:text-white bg-halftone">
      <div className="absolute inset-0 bg-speedlines pointer-events-none z-0" />

      <div className="absolute -top-4 left-4 lg:left-10 z-0 pointer-events-none select-none overflow-hidden">
        <span className="text-[6rem] sm:text-[10rem] lg:text-[14rem] font-black uppercase tracking-tighter leading-none text-stroke-subtle block">
          ACCESO
        </span>
      </div>

      <div className="relative z-10 w-full max-w-[440px]">
        <div className="flex justify-center mb-8">
          <img
            src="/logo.png"
            alt="IM Shop"
            className="h-16 drop-shadow-[0_0_15px_rgba(255,42,31,0.35)]"
          />
        </div>

        <div className="bg-[#110f16] border-2 border-[#ff2a1f] flex flex-col relative overflow-hidden shadow-[8px_8px_0px_#ff2a1f]">
          <div className="absolute top-0 right-0 w-3 h-3 bg-primary" />

          <div className="p-8 md:p-10">{children}</div>
        </div>

        <div className="mt-6 flex justify-center items-center gap-2 text-zinc-500 text-[9px] font-black uppercase tracking-[0.22em]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00e5ff]" /> Portal protegido por encriptación
          de 256 bits
        </div>
      </div>
    </div>
  )
}
