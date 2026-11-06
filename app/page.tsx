'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Clock, Crosshair, Flame, Shield, ShoppingCart, Zap } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const heroSlides = [
  {
    src: '/hero.png',
    codename: 'SYNDICATE // 01',
    styleName: 'ESPECTRO CARMESÍ',
    accentColor: 'from-[#ff2a1f] via-[#ff6b00] to-[#ffb703]',
    glowColor: 'bg-[#ff2a1f]/25',
    badgeBorder: 'border-[#ff2a1f]',
    badgeText: 'text-[#ff2a1f]',
  },
  {
    src: '/hero2.png',
    codename: 'SYNDICATE // 02',
    styleName: 'ORO FUNDIDO',
    accentColor: 'from-[#ffb703] via-[#ff7b00] to-[#ff2a1f]',
    glowColor: 'bg-[#ffb703]/25',
    badgeBorder: 'border-primary',
    badgeText: 'text-primary',
  },
]

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [games, setGames] = useState<any[]>([])
  const [loadingGames, setLoadingGames] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const fetchGames = async () => {
      const { data } = await supabase
        .from('games_config')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true })

      if (data) setGames(data)
      setLoadingGames(false)
    }
    fetchGames()
  }, [])

  const activeSlide = heroSlides[currentSlide]

  return (
    <div className="w-full bg-[#070609] selection:bg-[#ff2a1f] selection:text-white font-sans">
      <div className="w-full bg-[#0c0a10] border-b-2 border-[#1f1a29] py-2 hidden md:block z-50 relative">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-[11px] font-black uppercase tracking-[0.22em]">
          <div className="flex items-center gap-8">
            <span className="flex items-center gap-2 text-zinc-300">
              <Flame className="w-3.5 h-3.5 text-[#ff2a1f] fill-[#ff2a1f]" />
              INYECCIÓN DIRECTA AL ID
            </span>
            <span className="flex items-center gap-2 text-zinc-300">
              <Shield className="w-3.5 h-3.5 text-[#00e5ff]" />
              SISTEMA ANTI-BAN <strong className="text-[#00e5ff]">VERIFICADO</strong>
            </span>
          </div>
        </div>
      </div>

      <section className="relative w-full min-h-[92vh] lg:min-h-[88vh] flex items-center overflow-hidden border-b-4 border-[#ff2a1f] bg-[#070609] bg-halftone">
        <div className="absolute inset-0 bg-speedlines pointer-events-none z-0" />

        <div className="absolute -top-6 left-4 lg:left-10 z-0 pointer-events-none select-none overflow-hidden">
          <span className="text-[7rem] sm:text-[11rem] lg:text-[15rem] font-black uppercase tracking-tighter leading-none text-stroke-subtle block">
            CRIMINAL
          </span>
        </div>

        <div className="absolute right-[5%] lg:right-[12%] bottom-[10%] w-[380px] sm:w-[520px] h-[380px] sm:h-[520px] rounded-full blur-[130px] pointer-events-none z-0 transition-colors duration-1000 bg-gradient-to-tr from-[#ff2a1f]/35 via-[#ffb703]/25 to-[#00e5ff]/10" />

        <div className="max-w-7xl mx-auto px-4 w-full relative z-20 pt-10 pb-64 lg:py-16">
          <div className="w-full lg:w-[52%] flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-3 bg-[#120e17] border-2 border-[#ff2a1f] px-4 py-1.5 mb-6 -skew-x-12 shadow-[4px_4px_0px_#ff2a1f]">
              <span className="skew-x-12 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.25em] text-white">
                <Crosshair
                  className="w-3.5 h-3.5 text-primary animate-spin"
                  style={{ animationDuration: '8s' }}
                />
                {activeSlide.codename} —{' '}
                <span className="text-primary">{activeSlide.styleName}</span>
              </span>
            </div>
            <h1 className="text-[4.2rem] sm:text-[5.5rem] lg:text-[6.8rem] font-black text-white uppercase tracking-tighter leading-[0.86] mb-6 drop-shadow-[6px_6px_0px_#000000]">
              DOMINA <br />
              <span
                className={`text-transparent bg-clip-text bg-gradient-to-r ${activeSlide.accentColor}`}
              >
                EL FUEGO
              </span>
            </h1>

            <div className="pl-5 border-l-4 border-primary mb-10 max-w-lg bg-black/40 py-2 pr-4 backdrop-blur-xs">
              <p className="text-zinc-300 text-base md:text-lg font-medium leading-relaxed">
                Recargas oficiales al instante. Ingresa tu ID de jugador, desbloquea diamantes sin
                esperas y{' '}
                <strong className="text-white font-black underline decoration-[#ff2a1f] decoration-2 underline-offset-4">
                  haz arder la partida.
                </strong>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5 w-full sm:w-auto">
              <a
                href="#catalogo"
                className="group relative inline-flex items-center justify-center gap-3 bg-primary hover:bg-[#ffc42e] text-black font-black text-base md:text-lg px-9 py-4 uppercase tracking-[0.18em] border-2 border-black shadow-[6px_6px_0px_#ff2a1f] hover:shadow-[2px_2px_0px_#ff2a1f] hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                <Flame className="w-5 h-5 fill-black group-hover:scale-110 transition-transform" />
                <span>Recargar Ahora</span>
                <ChevronRight className="w-5 h-5 stroke-[3]" />
              </a>

              <div className="flex items-center gap-2 bg-[#110f16] border-2 border-white/15 p-1.5 self-start sm:self-auto">
                {heroSlides.map((slide, idx) => (
                  <button
                    key={slide.src}
                    onClick={() => setCurrentSlide(idx)}
                    className={`px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                      currentSlide === idx
                        ? 'bg-[#ff2a1f] text-white shadow-[2px_2px_0px_#ffb703]'
                        : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    0{idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-[-10%] sm:bottom-0 right-[-10%] lg:right-[5%] w-[110%] sm:w-full lg:w-[48%] h-[50%] sm:h-[68%] lg:h-[96%] z-10 pointer-events-none flex justify-center lg:justify-end items-end">
          {heroSlides.map((slide, index) => (
            <img
              key={slide.src}
              src={slide.src}
              alt={slide.styleName}
              className={`absolute bottom-0 w-auto max-w-[100%] h-full object-contain object-bottom origin-bottom transition-all duration-700 ease-out drop-shadow-[0_15px_35px_rgba(0,0,0,0.95)] ${
                currentSlide === index
                  ? 'opacity-100 scale-100 translate-y-0 rotate-0'
                  : 'opacity-0 scale-90 translate-y-6 rotate-1'
              }`}
            />
          ))}

          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[#070609] via-[#070609]/90 to-transparent z-20" />
        </div>
      </section>

      <section id="catalogo" className="max-w-7xl mx-auto px-4 py-24 relative z-10">
        <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#ff2a1f]/15 border border-[#ff2a1f] px-3 py-1 mb-3 -skew-x-12">
              <span className="skew-x-12 text-[#ff2a1f] font-black uppercase tracking-[0.25em] text-[10px]">
                ARSENAL OFICIAL
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
              SELECCIONA TU <span className="text-primary">JUEGO</span>
            </h2>
          </div>
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-400">
            [ ENTREGA EN SEGUNDOS VÍA ID ]
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loadingGames ? (
            <div className="col-span-full py-16 flex flex-col items-center justify-center border-2 border-dashed border-white/10 bg-[#110f16]">
              <p className="text-primary text-xs font-black uppercase tracking-[0.3em] animate-pulse">
                CARGANDO ARSENAL DE JUEGOS...
              </p>
            </div>
          ) : (
            games.map((game) => (
              <Link key={game.slug} href={`/game/${game.slug}`} className="block h-full group">
                <div className="relative h-full flex flex-col bg-[#110f16] border-2 border-white/20 transition-all duration-200 group-hover:-translate-x-1.5 group-hover:-translate-y-1.5 shadow-[6px_6px_0px_#1f1a29] group-hover:shadow-[8px_8px_0px_#ff2a1f] group-hover:border-primary overflow-hidden">
                  <div className="absolute top-3 left-3 z-20">
                    <span className="inline-block bg-black border-2 border-primary text-primary text-[10px] font-black uppercase tracking-widest px-2.5 py-1 -skew-x-12 shadow-[3px_3px_0px_#ff2a1f]">
                      <span className="skew-x-12 inline-block">🔥 RECARGA ID</span>
                    </span>
                  </div>

                  <div className="w-full h-56 flex items-center justify-center p-6 relative z-10 bg-[#0a080d] bg-halftone-crimson border-b-2 border-white/10 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#ff2a1f]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <img
                      src={game.image_url}
                      alt={game.name}
                      className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)] group-hover:scale-110 group-hover:-rotate-2 transition-transform duration-300 ease-out relative z-10"
                    />
                  </div>

                  <div className="p-6 relative z-10 flex-1 flex flex-col bg-[#110f16]">
                    <p className="text-[10px] text-[#ff2a1f] font-black uppercase tracking-[0.25em] mb-1">
                      {game.publisher || 'OFICIAL'}
                    </p>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-5 group-hover:text-primary transition-colors">
                      {game.name}
                    </h3>

                    <div className="mt-auto flex flex-col gap-2.5 pt-4 border-t-2 border-white/10">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="text-zinc-400 flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-primary" /> Sistema
                        </span>
                        <span className="text-[#00e5ff] bg-[#00e5ff]/10 border border-[#00e5ff]/30 px-2 py-0.5">
                          AUTOMÁTICO
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="text-zinc-400 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#ff2a1f]" /> Velocidad
                        </span>
                        <span className="text-white font-mono">INSTANTÁNEO</span>
                      </div>
                    </div>

                    <div className="mt-5 w-full bg-white/5 group-hover:bg-primary text-zinc-300 group-hover:text-black font-black text-xs uppercase tracking-[0.2em] py-2.5 px-4 flex items-center justify-between transition-colors border border-white/10 group-hover:border-black">
                      <span>ENTRAR</span>
                      <ChevronRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}

          <div className="h-full min-h-[360px] relative select-none">
            <div className="relative h-full flex flex-col bg-[#0b090e] border-2 border-dashed border-white/15 p-6 justify-center items-center opacity-70 bg-halftone">
              <div className="bg-[#ff2a1f]/10 border-2 border-[#ff2a1f]/40 p-4 mb-4 -skew-x-6">
                <ShoppingCart className="w-8 h-8 text-[#ff2a1f] skew-x-6" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-1 text-center">
                NUEVOS TÍTULOS
              </h3>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary text-center">
                PRÓXIMAMENTE
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}