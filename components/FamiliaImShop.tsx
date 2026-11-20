'use client'
import { useEffect, useState } from 'react'
import { Crown, Flame, Loader2, Trophy, Users, X } from 'lucide-react'

interface TopUser {
  rank: number
  name: string
  total: number
}

const GOLD = '#ffd700'
const SILVER = '#c0c0c0'
const BRONZE = '#cd7f32'
const CYAN = '#00e5ff'
const CRIMSON = '#ff2a1f'

const RANK_META: Record<number, { color: string; label: string }> = {
  1: { color: GOLD, label: 'Leyenda' },
  2: { color: SILVER, label: 'Élite' },
  3: { color: BRONZE, label: 'Veterano' },
  4: { color: CYAN, label: 'Familia' },
  5: { color: CYAN, label: 'Familia' },
}

function useCountUp(target: number, active: boolean, duration = 1100) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) {
      setValue(0)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(target * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, active, duration])
  return value
}

function Amount({ value, className, style }: { value: number; className?: string; style?: React.CSSProperties }) {
  const v = useCountUp(value, true)
  return (
    <span className={className} style={style}>
      S/ {v.toFixed(2)}
    </span>
  )
}

function Avatar({ name, color, size }: { name: string; color: string; size: string }) {
  return (
    <div
      className={`${size} shrink-0 flex items-center justify-center border-2 font-black font-mono uppercase`}
      style={{ borderColor: color, backgroundColor: `${color}1a`, color }}
    >
      {name.charAt(0)}
    </div>
  )
}

export default function FamiliaImShop() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [top, setTop] = useState<TopUser[] | null>(null)

  useEffect(() => {
    if (!open || top) return
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await fetch('/api/top-recharged')
        const data = await res.json()
        if (data.success) setTop(data.top)
        else setError(data.error || 'Ocurrió un error')
      } catch {
        setError('Error de conexión')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [open, top])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const first = top?.[0]
  const podium = top?.slice(1, 3) ?? []
  const rest = top?.slice(3, 5) ?? []

  return (
    <>
      <style>{`
        @keyframes fam-pop { from { opacity: 0; transform: translateY(18px) scale(.96) } to { opacity: 1; transform: none } }
        @keyframes fam-shine { from { transform: translateX(-130%) skewX(-20deg) } to { transform: translateX(260%) skewX(-20deg) } }
        @keyframes fam-float { 0%,100% { transform: translateY(0) rotate(-6deg) } 50% { transform: translateY(-6px) rotate(6deg) } }
        @keyframes fam-glow { 0%,100% { opacity: .35 } 50% { opacity: .7 } }
        .fam-pop { opacity: 0; animation: fam-pop .55s cubic-bezier(.2,.9,.3,1.2) forwards }
        .fam-shine { animation: fam-shine 3.2s ease-in-out infinite }
        .fam-float { animation: fam-float 2.6s ease-in-out infinite }
        .fam-glow { animation: fam-glow 2.4s ease-in-out infinite }
        @media (prefers-reduced-motion: reduce) {
          .fam-pop, .fam-shine, .fam-float, .fam-glow { animation: none; opacity: 1 }
        }
      `}</style>

      <button
        onClick={() => setOpen(true)}
        className="group fixed bottom-6 left-6 z-50 flex items-center gap-3 pl-3 pr-4 py-2.5 bg-[#110f16] text-white border-2 border-[#00e5ff] font-black text-[11px] md:text-xs uppercase tracking-[0.2em] shadow-[4px_4px_0px_#0088cc] hover:bg-[#00e5ff] hover:text-black hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_#0088cc] transition-all cursor-pointer"
      >
        <span className="relative flex items-center justify-center w-7 h-7 bg-[#00e5ff]/15 border border-[#00e5ff]/50 group-hover:bg-black/10 group-hover:border-black/40 transition-colors">
          <Crown className="w-4 h-4 text-[#ffd700] group-hover:text-black transition-colors" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#ff2a1f] animate-pulse" />
        </span>
        Familia{' '}
        <span className="text-[#00e5ff] group-hover:text-black transition-colors">ImShop</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#110f16] border-2 border-primary shadow-[8px_8px_0px_#ff2a1f] w-full max-w-xl max-h-[92vh] overflow-y-auto custom-scrollbar relative"
          >
            {/* Header */}
            <div
              className="relative px-6 pt-6 pb-5 border-b-2 border-white/10 overflow-hidden"
              style={{
                background:
                  'repeating-linear-gradient(135deg, rgba(255,183,3,.06) 0 12px, transparent 12px 24px)',
              }}
            >
              <div className="absolute top-0 right-0 w-3 h-3 bg-primary" />
              <div className="absolute top-0 left-0 w-3 h-3" style={{ backgroundColor: CRIMSON }} />

              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-5 p-1 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                title="Cerrar"
              >
                <X className="w-5 h-5 stroke-[3]" />
              </button>

              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00e5ff] mb-2 flex items-center gap-2">
                <Flame className="w-3.5 h-3.5" /> Salón de la fama
              </p>
              <h3 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tighter -skew-x-6 flex items-center gap-3">
                <Crown className="w-8 h-8 text-primary fam-float" />
                Familia <span className="text-primary">ImShop</span>
              </h3>
              <p className="text-xs text-zinc-400 font-mono mt-3">
                Los 5 clientes que más han recargado con nosotros.
              </p>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="bg-[#ff2a1f]/10 border-2 border-[#ff2a1f]/40 p-6 text-center text-[#ff2a1f] text-xs font-black uppercase tracking-widest">
                  {error}
                </div>
              ) : !top || top.length === 0 ? (
                <div className="border-2 border-dashed border-white/20 p-12 text-center flex flex-col items-center">
                  <Trophy className="w-12 h-12 text-zinc-600 mb-4" />
                  <h4 className="text-xl font-black uppercase text-zinc-400">Aún sin miembros</h4>
                  <p className="text-sm text-zinc-500">Sé el primero en entrar a la familia.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {first && (
                    <div
                      className="fam-pop relative overflow-hidden border-2 p-5 md:p-6"
                      style={{
                        borderColor: GOLD,
                        boxShadow: `8px 8px 0px ${CRIMSON}`,
                        background: `repeating-linear-gradient(135deg, rgba(255,215,0,.07) 0 10px, transparent 10px 20px), linear-gradient(180deg, #1c1608 0%, #110f16 100%)`,
                      }}
                    >
                      <div
                        className="fam-glow absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl pointer-events-none"
                        style={{ backgroundColor: GOLD }}
                      />
                      <div className="fam-shine absolute inset-y-0 left-0 w-1/4 bg-white/10 pointer-events-none" />
                      <div
                        className="absolute top-0 right-0 w-4 h-4"
                        style={{ backgroundColor: GOLD }}
                      />

                      <div className="relative flex items-center justify-between mb-5">
                        <span
                          className="-skew-x-12 px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-black"
                          style={{ backgroundColor: GOLD, boxShadow: `3px 3px 0px ${CRIMSON}` }}
                        >
                          <span className="inline-block skew-x-12">N°1 · {RANK_META[1].label}</span>
                        </span>
                        <Crown className="w-7 h-7 fam-float" style={{ color: GOLD }} />
                      </div>

                      <div className="relative flex items-center gap-4 md:gap-5">
                        <Avatar
                          name={first.name}
                          color={GOLD}
                          size="w-16 h-16 md:w-20 md:h-20 text-3xl md:text-4xl"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-2xl md:text-3xl font-black uppercase text-white tracking-tighter truncate">
                            {first.name}
                          </p>
                          {/*<p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 mt-1">*/}
                          {/*  Total recargado*/}
                          {/*</p>*/}
                          {/*<Amount*/}
                          {/*  value={first.total}*/}
                          {/*  className="text-3xl md:text-4xl font-black font-mono tracking-tighter"*/}
                          {/*  style={{ color: GOLD, textShadow: `3px 3px 0px ${CRIMSON}66` }}*/}
                          {/*/>*/}
                        </div>
                      </div>
                    </div>
                  )}

                  {podium.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      {podium.map((u, i) => {
                        const { color, label } = RANK_META[u.rank]
                        return (
                          <div
                            key={u.rank}
                            className="fam-pop relative overflow-hidden border-2 p-4 bg-[#0a080d]"
                            style={{
                              borderColor: `${color}99`,
                              boxShadow: `5px 5px 0px ${color}40`,
                              animationDelay: `${0.12 * (i + 1)}s`,
                            }}
                          >
                            <div
                              className="absolute top-0 right-0 w-3 h-3"
                              style={{ backgroundColor: color }}
                            />
                            <div className="flex items-center justify-between mb-4">
                              <span
                                className="text-[10px] font-black uppercase tracking-[0.2em]"
                                style={{ color }}
                              >
                                #{u.rank} · {label}
                              </span>
                              <Trophy className="w-5 h-5" style={{ color }} />
                            </div>
                            <div className="flex items-center gap-3 mb-3">
                              <Avatar name={u.name} color={color} size="w-11 h-11 text-xl" />
                              <p className="text-sm font-black uppercase text-white truncate">
                                {u.name}
                              </p>
                            </div>
                            {/*<Amount*/}
                            {/*  value={u.total}*/}
                            {/*  className="text-xl font-black font-mono text-white"*/}
                            {/*/>*/}
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {rest.length > 0 && (
                    <div className="space-y-3">
                      {rest.map((u, i) => (
                        <div
                          key={u.rank}
                          className="fam-pop flex items-center gap-4 bg-black/30 border-2 border-white/10 hover:border-[#00e5ff] p-3 pr-4 transition-colors"
                          style={{ animationDelay: `${0.12 * (i + 3)}s` }}
                        >
                          <span className="w-8 text-center text-zinc-500 font-mono text-sm font-black">
                            #{u.rank}
                          </span>
                          <Avatar name={u.name} color={CYAN} size="w-9 h-9 text-base" />
                          <p className="flex-1 min-w-0 text-sm font-black uppercase text-white truncate">
                            {u.name}
                          </p>
                          {/*<Amount*/}
                          {/*  value={u.total}*/}
                          {/*  className="text-base font-black font-mono text-[#00e5ff]"*/}
                          {/*/>*/}
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-center text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 pt-1">
                    Recarga y escala hasta la cima
                  </p>
                </div>
              )}

              <button
                onClick={() => setOpen(false)}
                className="mt-6 w-full py-3 bg-transparent hover:bg-white/5 text-zinc-400 border-2 border-white/20 font-black text-[10px] uppercase tracking-widest transition-colors cursor-pointer"
              >
                CERRAR
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}