'use client'
import { Eye, EyeOff, ImageIcon, Link as LinkIcon, Plus, Save } from 'lucide-react'

interface GamesTabProps {
  games: any[]
  rawCatalog: any[]
  loadingConfig: boolean
  addEmptyGame: () => void
  handleCatalogSelect: (index: number, packageName: string) => void
  handleGameChange: (index: number, field: string, value: any) => void
  saveGame: (game: any) => void
}

const inputClass =
  'w-full bg-[#070609] border-2 border-white/15 px-3 py-2.5 text-sm font-bold text-white outline-none focus:border-primary focus:shadow-[3px_3px_0px_#ff2a1f] transition-all placeholder:text-zinc-700'

const labelClass = 'block text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1.5'

export default function GamesTab({
  games,
  rawCatalog,
  loadingConfig,
  addEmptyGame,
  handleCatalogSelect,
  handleGameChange,
  saveGame,
}: GamesTabProps) {
  return (
    <div className="animate-in fade-in space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-[#110f16] border-2 border-[#ff2a1f] p-6 shadow-[6px_6px_0px_#ff2a1f] relative">
        <div className="absolute top-0 right-0 w-3 h-3 bg-primary" />
        <div>
          <div className="inline-flex items-center bg-[#ff2a1f]/15 border border-[#ff2a1f] px-3 py-1 mb-3 -skew-x-12">
            <span className="skew-x-12 text-[#ff2a1f] font-black uppercase tracking-[0.25em] text-[10px]">
              ARSENAL
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter leading-none">
            Catálogo de Juegos
          </h2>
          <p className="text-xs text-zinc-400 mt-2 font-medium">
            Vincula juegos desde el proveedor y configura cómo se verán en tu tienda.
          </p>
        </div>
        <button
          onClick={addEmptyGame}
          className="group bg-primary hover:bg-[#ffc42e] text-black px-6 py-3.5 text-xs font-black uppercase tracking-[0.18em] flex items-center gap-2 border-2 border-black shadow-[5px_5px_0px_#ff2a1f] hover:shadow-[2px_2px_0px_#ff2a1f] hover:translate-x-1 hover:translate-y-1 transition-all w-fit cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Añadir Juego
        </button>
      </div>

      {loadingConfig ? (
        <div className="py-16 flex items-center justify-center border-2 border-dashed border-white/10 bg-[#110f16]">
          <p className="text-primary text-xs font-black uppercase tracking-[0.3em] animate-pulse">
            Cargando...
          </p>
        </div>
      ) : (
        games.map((game, index) => (
          <div
            key={index}
            className="bg-[#110f16] border-2 border-white/20 shadow-[6px_6px_0px_#1f1a29] p-6 flex flex-col md:flex-row gap-6 relative"
          >
            <div className="absolute top-0 right-0 w-3 h-3 bg-[#00e5ff]" />

            <div className="w-full md:w-48 h-48 bg-[#0a080d] bg-halftone-crimson border-2 border-white/10 flex items-center justify-center overflow-hidden relative shrink-0">
              {game.image_url ? (
                <img
                  src={game.image_url}
                  alt="Portada"
                  className="w-full h-full object-contain p-3 drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)]"
                />
              ) : (
                <ImageIcon className="w-10 h-10 text-zinc-700" />
              )}
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 bg-primary/5 p-4 border-2 border-primary/40">
                <label className="block text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                  <LinkIcon className="w-3 h-3" /> 1. Vincular con catálogo de proveedor
                </label>
                <select
                  value={game.codestore_match || ''}
                  onChange={(e) => handleCatalogSelect(index, e.target.value)}
                  className="w-full bg-[#070609] border-2 border-white/15 px-3 py-3 text-sm font-bold text-white outline-none focus:border-primary cursor-pointer"
                >
                  <option value="">-- Selecciona un juego de Codestore --</option>
                  {rawCatalog.map((c) => (
                    <option key={c.packageName} value={c.packageName}>
                      {c.packageName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>2. Slug (URL de tu tienda)</label>
                <input
                  type="text"
                  value={game.slug || ''}
                  onChange={(e) => handleGameChange(index, 'slug', e.target.value)}
                  placeholder="ej: free-fire"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>3. Nombre al Público</label>
                <input
                  type="text"
                  value={game.name || ''}
                  onChange={(e) => handleGameChange(index, 'name', e.target.value)}
                  placeholder="FREE FIRE"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>4. Distribuidor (Opcional)</label>
                <input
                  type="text"
                  value={game.publisher || ''}
                  onChange={(e) => handleGameChange(index, 'publisher', e.target.value)}
                  placeholder="GARENA"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>5. Logo / Portada (URL)</label>
                <input
                  type="text"
                  value={game.image_url || ''}
                  onChange={(e) => handleGameChange(index, 'image_url', e.target.value)}
                  placeholder="/freefirelogo.webp"
                  className={inputClass}
                />
              </div>

              <div className="md:col-span-2 flex flex-col sm:flex-row items-center justify-between pt-4 mt-2 border-t-2 border-white/10 gap-4">
                <button
                  onClick={() => handleGameChange(index, 'is_active', !game.is_active)}
                  className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest px-3 py-2 border-2 transition-colors cursor-pointer ${
                    game.is_active
                      ? 'text-[#00e5ff] border-[#00e5ff]/50 bg-[#00e5ff]/10'
                      : 'text-zinc-500 border-white/10 bg-white/5'
                  }`}
                >
                  {game.is_active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  {game.is_active ? 'Visible en Tienda' : 'Oculto al público'}
                </button>
                <button
                  onClick={() => saveGame(game)}
                  className="w-full sm:w-auto bg-primary hover:bg-[#ffc42e] text-black px-6 py-3 text-xs font-black uppercase tracking-[0.18em] flex items-center justify-center gap-2 border-2 border-black shadow-[4px_4px_0px_#ff2a1f] hover:shadow-[2px_2px_0px_#ff2a1f] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}