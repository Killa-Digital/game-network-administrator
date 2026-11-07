'use client'
import { useState } from 'react'
import {
  AlertTriangle,
  Box,
  ChevronDown,
  ChevronUp,
  Crown,
  Eye,
  EyeOff,
  Gamepad2,
  Layers,
  Pencil,
  Plus,
  Puzzle,
  Save,
  Trash2,
  X,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Notification from '@/components/Notification'

interface PricingTabProps {
  games: any[]
  rawCatalog: any[]
  productConfigs: Record<string, any>
  loadingConfig: boolean
  selectedGameTab: string
  setSelectedGameTab: (slug: string) => void
  handlePriceChange: (code: string, field: string, value: any) => void
  savePriceConfig: (code: string, gameSlug: string) => void
  getCodeType: (name: string) => string
  refreshConfigs: () => void
}

export default function PricingTab({
  games,
  rawCatalog,
  productConfigs,
  loadingConfig,
  selectedGameTab,
  setSelectedGameTab,
  handlePriceChange,
  savePriceConfig,
  getCodeType,
  refreshConfigs,
}: PricingTabProps) {
  const [notify, setNotify] = useState({
    isVisible: false,
    message: '',
    type: 'info' as 'success' | 'error' | 'info',
  })
  const [comboName, setComboName] = useState('')
  const [comboPrice, setComboPrice] = useState('')
  const [comboItems, setComboItems] = useState<string[]>([])
  const [selectedNativeItem, setSelectedNativeItem] = useState('')
  const [manualName, setManualName] = useState('')
  const [manualPrice, setManualPrice] = useState('')
  const [manualType, setManualType] = useState<'fragment' | 'box' | 'passe'>('fragment')

  // Estados de control para colapsar/expandir las secciones de cada juego
  const [openSections, setOpenSections] = useState<
    Record<string, { official: boolean; combos: boolean; manual: boolean }>
  >({})

  const toggleSection = (gameSlug: string, section: 'official' | 'combos' | 'manual') => {
    setOpenSections((prev) => {
      const current = prev[gameSlug] || { official: true, combos: true, manual: true }
      return {
        ...prev,
        [gameSlug]: {
          ...current,
          [section]: !current[section],
        },
      }
    })
  }

  // Estado para editar productos manuales en línea
  const [editingManualCode, setEditingManualCode] = useState<string | null>(null)
  const [editManualName, setEditManualName] = useState('')
  const [editManualPrice, setEditManualPrice] = useState('')

  // Estado para editar combos personalizados en línea
  const [editingComboCode, setEditingComboCode] = useState<string | null>(null)
  const [editComboName, setEditComboName] = useState('')
  const [editComboPrice, setEditComboPrice] = useState('')
  const [editComboItems, setEditComboItems] = useState<string[]>([])
  const [editSelectedNativeItem, setEditSelectedNativeItem] = useState('')

  const saveCombo = async (gameSlug: string) => {
    if (!comboName || !comboPrice || comboItems.length < 2) {
      return setNotify({
        isVisible: true,
        message: 'Falta nombre, precio o al menos 2 paquetes.',
        type: 'error',
      })
    }

    const comboCode = `combo___${Date.now()}`

    try {
      const { error } = await supabase.from('product_config').insert({
        product_code: comboCode,
        custom_name: comboName,
        price_pen: Number(comboPrice),
        is_active: true,
        game_slug: gameSlug,
        is_combo: true,
        combo_items: comboItems,
      })

      if (error) throw error
      setNotify({ isVisible: true, message: 'Combo creado exitosamente', type: 'success' })

      setComboName('')
      setComboPrice('')
      setComboItems([])
      refreshConfigs()
    } catch (error: any) {
      setNotify({ isVisible: true, message: 'Error al crear el combo', type: 'error' })
    }
  }

  const handleSavePrice = async (code: string, gameSlug: string) => {
    try {
      await savePriceConfig(code, gameSlug)
      setNotify({ isVisible: true, message: 'Precio actualizado en la tienda', type: 'success' })
    } catch (error) {
      setNotify({ isVisible: true, message: 'Error al guardar el precio', type: 'error' })
    }
  }

  return (
    <div className="animate-in fade-in flex flex-col md:flex-row gap-8 relative">
      <div className="w-full md:w-64 flex flex-col gap-3 shrink-0">
        <h2 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] mb-1 px-1 border-b-2 border-white/10 pb-3">
          Seleccionar Juego
        </h2>
        {games.map((game) => (
          <button
            key={game.slug}
            onClick={() => setSelectedGameTab(game.slug)}
            className={`flex items-center gap-3 p-3 border-2 transition-all duration-200 text-left cursor-pointer ${
              selectedGameTab === game.slug
                ? 'bg-primary/10 border-primary text-white shadow-[5px_5px_0px_#ff2a1f] -translate-x-1 -translate-y-1'
                : 'bg-[#110f16] border-white/20 text-zinc-400 shadow-[4px_4px_0px_#1f1a29] hover:text-white hover:border-primary hover:-translate-x-1 hover:-translate-y-1'
            }`}
          >
            {game.image_url ? (
              <img src={game.image_url} className="w-8 h-8 object-contain" alt="Icon" />
            ) : (
              <Gamepad2 className="w-6 h-6" />
            )}
            <span className="text-[10px] font-black uppercase tracking-widest truncate">
              {game.name || 'Sin Nombre'}
            </span>
          </button>
        ))}
        {games.length === 0 && (
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] p-4 text-center border-2 border-dashed border-white/10 bg-[#110f16]">
            No hay juegos agregados.
          </p>
        )}
      </div>

      <div className="flex-1 bg-[#110f16] border-2 border-white/20 shadow-[6px_6px_0px_#1f1a29] relative min-w-0">
        <div className="absolute top-0 right-0 w-3 h-3 bg-[#00e5ff] z-10" />
        {loadingConfig ? (
          <p className="text-primary text-xs font-black uppercase tracking-[0.3em] animate-pulse text-center py-20">
            Conectando con Codestore...
          </p>
        ) : (
          <>
            {games.map((game) => {
              if (game.slug !== selectedGameTab) return null

              const catalogData = rawCatalog.find((c) => c.packageName === game.codestore_match)
              if (!catalogData)
                return (
                  <div key={game.slug} className="p-10 text-center">
                    <div className="inline-block bg-[#ff2a1f]/10 border-2 border-[#ff2a1f]/40 p-4 mb-4 -skew-x-6">
                      <AlertTriangle className="w-10 h-10 text-[#ff2a1f] skew-x-6" />
                    </div>
                    <p className="text-zinc-300 text-sm font-bold">
                      No se encontró el catálogo en Codestore.
                    </p>
                  </div>
                )

              const combos = Object.values(productConfigs).filter(
                (c) => c.game_slug === game.slug && c.is_combo
              )

              const sectionsState = openSections[game.slug] || {
                official: true,
                combos: true,
                manual: true,
              }

              return (
                <div key={game.slug} className="animate-in fade-in flex flex-col h-full">
                  <div className="bg-[#0a080d] border-b-2 border-[#ff2a1f] p-6">
                    <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter leading-none">
                      {game.name}
                    </h3>
                  </div>

                  <div className="p-4 border-b-2 border-white/10">
                    <button
                      onClick={() => toggleSection(game.slug, 'official')}
                      className="w-full flex items-center justify-between text-[11px] font-black text-zinc-400 uppercase tracking-widest cursor-pointer hover:text-white transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Gamepad2 className="w-4 h-4 text-[#00e5ff]" /> Paquetes Oficiales
                      </span>
                      {sectionsState.official ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    {sectionsState.official && (
                      <div className="overflow-x-auto pt-4 custom-scrollbar">
                        <table className="w-full text-left mb-4">
                          <thead>
                            <tr className="border-b-2 border-white/15">
                              <th className="pb-3 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                                Paquete
                              </th>
                              <th className="pb-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-center">
                                Costo USD
                              </th>
                              <th className="pb-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                                Precio Venta (PEN)
                              </th>
                              <th className="pb-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-right pr-4">
                                Acciones
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/10">
                            {catalogData.products.map((product: any) => {
                              const code = `${getCodeType(product.name)}___${product.productId}___${product.sku}`
                              const config = productConfigs[code] || {
                                price_pen: 0,
                                is_active: true,
                              }

                              return (
                                <tr
                                  key={code}
                                  className={`hover:bg-white/[0.03] transition-colors ${config.is_active ? '' : 'opacity-40 grayscale'}`}
                                >
                                  <td className="py-4 px-4 min-w-[200px]">
                                    <p className="text-xs font-black text-white uppercase tracking-widest">
                                      {product.name}
                                    </p>
                                  </td>
                                  <td className="py-4 text-center">
                                    <span className="bg-black/50 border border-white/10 text-zinc-300 px-3 py-1.5 text-[10px] font-mono">
                                      ${product.price.toFixed(2)} USD
                                    </span>
                                  </td>
                                  <td className="py-4">
                                    <div className="relative w-32">
                                      <span className="absolute left-3 top-2.5 text-xs font-black text-zinc-500">
                                        S/
                                      </span>
                                      <input
                                        type="number"
                                        value={config.price_pen}
                                        onChange={(e) =>
                                          handlePriceChange(code, 'price_pen', e.target.value)
                                        }
                                        className="w-full bg-[#070609] border-2 border-white/15 pl-8 pr-3 py-2 text-sm font-black font-mono text-primary outline-none focus:border-primary transition-all"
                                      />
                                    </div>
                                  </td>
                                  <td className="py-4 pr-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                      <button
                                        onClick={() =>
                                          handlePriceChange(code, 'is_active', !config.is_active)
                                        }
                                        className={`p-2 border-2 transition-colors cursor-pointer ${config.is_active ? 'text-[#00e5ff] border-[#00e5ff]/40 bg-[#00e5ff]/10' : 'text-zinc-500 border-white/10 hover:text-white'}`}
                                      >
                                        {config.is_active ? (
                                          <Eye className="w-4 h-4" />
                                        ) : (
                                          <EyeOff className="w-4 h-4" />
                                        )}
                                      </button>
                                      <button
                                        onClick={() => handleSavePrice(code, game.slug)}
                                        className="bg-primary hover:bg-[#ffc42e] text-black border-2 border-black px-4 py-2 text-[10px] font-black uppercase tracking-widest cursor-pointer shadow-[3px_3px_0px_#ff2a1f] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#ff2a1f] transition-all"
                                      >
                                        Guardar
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  <div className="p-4 border-b-2 border-white/10">
                    <button
                      onClick={() => toggleSection(game.slug, 'combos')}
                      className="w-full flex items-center justify-between text-[11px] font-black text-primary uppercase tracking-widest cursor-pointer hover:text-white transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Layers className="w-4 h-4" /> Combos Personalizados
                      </span>
                      {sectionsState.combos ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    {sectionsState.combos && (
                      <div className="pt-4">
                        {combos.length > 0 && (
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                            {combos.map((combo) => {
                              const isEditing = editingComboCode === combo.product_code

                              return (
                                <div
                                  key={combo.product_code}
                                  className={`p-4 border-2 ${combo.is_active ? 'border-[#ffb703] bg-[#ffb703]/5' : 'border-white/10 opacity-50'} flex flex-col justify-center`}
                                >
                                  {isEditing ? (
                                    // MODO EDICIÓN
                                    <div className="flex flex-col gap-4 animate-in fade-in">
                                      <div className="flex flex-col sm:flex-row gap-3">
                                        <div className="flex-1">
                                          <label className="text-[9px] font-black text-[#ffb703] uppercase tracking-widest mb-1 block">
                                            Nombre del Combo
                                          </label>
                                          <input
                                            type="text"
                                            value={editComboName}
                                            onChange={(e) => setEditComboName(e.target.value)}
                                            className="w-full bg-[#070609] border border-[#ffb703]/50 px-3 py-2 text-xs font-bold text-white outline-none focus:border-[#ffb703]"
                                          />
                                        </div>
                                        <div className="w-full sm:w-32">
                                          <label className="text-[9px] font-black text-[#ffb703] uppercase tracking-widest mb-1 block">
                                            Precio (S/)
                                          </label>
                                          <input
                                            type="number"
                                            step="0.10"
                                            value={editComboPrice}
                                            onChange={(e) => setEditComboPrice(e.target.value)}
                                            className="w-full bg-[#070609] border border-[#ffb703]/50 px-3 py-2 text-xs font-black font-mono text-[#ffb703] outline-none focus:border-[#ffb703]"
                                          />
                                        </div>
                                      </div>

                                      <div className="bg-black/30 p-3 border border-white/5">
                                        <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-2 block">
                                          Inyecciones (Paquetes)
                                        </label>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                          {editComboItems.map((item, idx) => {
                                            const [, , sku] = item.split('___')
                                            const prodName =
                                              catalogData.products.find((p: any) => p.sku === sku)
                                                ?.name || sku
                                            return (
                                              <span
                                                key={idx}
                                                className="bg-primary/20 border border-primary/50 text-white text-[10px] font-black px-2 py-1 flex items-center gap-2 rounded-sm"
                                              >
                                                {prodName}
                                                <X
                                                  className="w-3 h-3 text-[#ff2a1f] cursor-pointer hover:scale-125 transition-transform"
                                                  onClick={() =>
                                                    setEditComboItems(
                                                      editComboItems.filter((_, i) => i !== idx)
                                                    )
                                                  }
                                                />
                                              </span>
                                            )
                                          })}
                                        </div>
                                        <div className="flex gap-2">
                                          <select
                                            value={editSelectedNativeItem}
                                            onChange={(e) =>
                                              setEditSelectedNativeItem(e.target.value)
                                            }
                                            className="flex-1 bg-[#070609] border border-white/15 px-2 py-1 text-[10px] font-bold text-white outline-none"
                                          >
                                            <option value="">-- Añadir paquete --</option>
                                            {catalogData.products.map((p: any) => (
                                              <option
                                                key={p.sku}
                                                value={`${getCodeType(p.name)}___${p.productId}___${p.sku}`}
                                              >
                                                {p.name}
                                              </option>
                                            ))}
                                          </select>
                                          <button
                                            onClick={() => {
                                              if (editSelectedNativeItem) {
                                                setEditComboItems([
                                                  ...editComboItems,
                                                  editSelectedNativeItem,
                                                ])
                                                setEditSelectedNativeItem('')
                                              }
                                            }}
                                            className="bg-white/10 hover:bg-white/20 text-white px-3 text-[10px] font-black uppercase border border-white/20 transition-colors cursor-pointer"
                                          >
                                            Sumar
                                          </button>
                                        </div>
                                      </div>

                                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                                        <button
                                          onClick={() => setEditingComboCode(null)}
                                          className="px-3 py-1.5 text-[10px] font-black text-zinc-400 hover:text-white uppercase tracking-widest transition-colors cursor-pointer"
                                        >
                                          Cancelar
                                        </button>
                                        <button
                                          onClick={async () => {
                                            if (
                                              !editComboName ||
                                              !editComboPrice ||
                                              editComboItems.length < 2
                                            ) {
                                              return setNotify({
                                                isVisible: true,
                                                message:
                                                  'Falta nombre, precio o al menos 2 paquetes.',
                                                type: 'error',
                                              })
                                            }
                                            const { error } = await supabase
                                              .from('product_config')
                                              .update({
                                                custom_name: editComboName,
                                                price_pen: Number(editComboPrice),
                                                combo_items: editComboItems,
                                              })
                                              .eq('product_code', combo.product_code)

                                            if (error) {
                                              setNotify({
                                                isVisible: true,
                                                message: 'Error al actualizar',
                                                type: 'error',
                                              })
                                            } else {
                                              setNotify({
                                                isVisible: true,
                                                message: 'Combo actualizado',
                                                type: 'success',
                                              })
                                              setEditingComboCode(null)
                                              refreshConfigs()
                                            }
                                          }}
                                          className="bg-[#ffb703] text-black px-4 py-1.5 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2 cursor-pointer"
                                        >
                                          <Save className="w-3.5 h-3.5" /> Guardar Combo
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    // MODO VISTA NORMAL
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <p className="font-black uppercase text-sm text-white">
                                          {combo.custom_name}
                                        </p>
                                        <div className="text-[10px] text-zinc-400 font-mono mt-2 flex flex-col gap-1">
                                          <span className="text-[#ffb703] font-bold">
                                            Inyecciones ({combo.combo_items?.length || 0}):
                                          </span>
                                          {combo.combo_items?.map((item: string, idx: number) => {
                                            const [, , sku] = item.split('___')
                                            const prodName =
                                              catalogData.products.find((p: any) => p.sku === sku)
                                                ?.name || sku
                                            return <span key={idx}>- {prodName}</span>
                                          })}
                                        </div>
                                      </div>
                                      <div className="flex flex-col items-end gap-3 shrink-0">
                                        <p className="font-black text-[#ffb703] text-xl font-mono">
                                          S/ {combo.price_pen.toFixed(2)}
                                        </p>
                                        <div className="flex items-center gap-2">
                                          {/* Ojito - Ocultar/Mostrar */}
                                          <button
                                            onClick={() =>
                                              handlePriceChange(
                                                combo.product_code,
                                                'is_active',
                                                !combo.is_active
                                              )
                                            }
                                            className={`p-2 border-2 transition-colors cursor-pointer ${combo.is_active ? 'text-[#00e5ff] border-[#00e5ff]/40 bg-[#00e5ff]/10' : 'text-zinc-500 border-white/10 hover:text-white'}`}
                                            title="Ocultar/Mostrar"
                                          >
                                            {combo.is_active ? (
                                              <Eye className="w-4 h-4" />
                                            ) : (
                                              <EyeOff className="w-4 h-4" />
                                            )}
                                          </button>

                                          {/* Lápiz - Editar */}
                                          <button
                                            onClick={() => {
                                              setEditingComboCode(combo.product_code)
                                              setEditComboName(combo.custom_name || '')
                                              setEditComboPrice(combo.price_pen?.toString() || '')
                                              setEditComboItems(combo.combo_items || [])
                                            }}
                                            className="p-2 border-2 border-white/10 text-zinc-400 hover:text-[#ffb703] hover:border-[#ffb703]/40 hover:bg-[#ffb703]/10 transition-colors cursor-pointer"
                                            title="Editar Combo"
                                          >
                                            <Pencil className="w-4 h-4" />
                                          </button>

                                          {/* Basurero - Eliminar permanentemente */}
                                          <button
                                            onClick={async () => {
                                              if (
                                                window.confirm(
                                                  '¿Estás seguro de que deseas eliminar este combo permanentemente?'
                                                )
                                              ) {
                                                const { error } = await supabase
                                                  .from('product_config')
                                                  .delete()
                                                  .eq('product_code', combo.product_code)

                                                if (!error) {
                                                  setNotify({
                                                    isVisible: true,
                                                    message: 'Combo eliminado de la base de datos',
                                                    type: 'success',
                                                  })
                                                  refreshConfigs()
                                                } else {
                                                  setNotify({
                                                    isVisible: true,
                                                    message: 'Error al eliminar',
                                                    type: 'error',
                                                  })
                                                }
                                              }
                                            }}
                                            className="p-2 border-2 border-white/10 text-zinc-400 hover:text-[#ff2a1f] hover:border-[#ff2a1f]/40 hover:bg-[#ff2a1f]/10 transition-colors cursor-pointer"
                                            title="Eliminar Combo"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}

                        <div className="bg-black/40 border border-white/10 p-5 shadow-inner">
                          <p className="text-[10px] font-black uppercase text-zinc-400 mb-4">
                            Crear Nuevo Combo
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <input
                              type="text"
                              placeholder="Nombre (Ej: 220 DIAMANTES)"
                              value={comboName}
                              onChange={(e) => setComboName(e.target.value)}
                              className="bg-[#070609] border border-white/15 px-4 py-2 text-xs font-bold text-white outline-none focus:border-primary"
                            />
                            <input
                              type="number"
                              placeholder="Precio en Soles (S/)"
                              value={comboPrice}
                              onChange={(e) => setComboPrice(e.target.value)}
                              className="bg-[#070609] border border-white/15 px-4 py-2 text-xs font-black font-mono text-primary outline-none focus:border-primary"
                            />
                            <button
                              onClick={() => saveCombo(game.slug)}
                              className="bg-[#ffb703] hover:bg-white text-black font-black text-[10px] uppercase tracking-widest border-2 border-black shadow-[3px_3px_0px_#ff2a1f] transition-all cursor-pointer"
                            >
                              Guardar Combo Final
                            </button>
                          </div>

                          <div className="flex flex-col md:flex-row gap-3 items-end p-4 border border-dashed border-white/20 bg-[#110f16]">
                            <div className="flex-1 w-full">
                              <label className="text-[10px] text-zinc-500 uppercase font-black block mb-2">
                                Selecciona un paquete para sumar al combo:
                              </label>
                              <select
                                value={selectedNativeItem}
                                onChange={(e) => setSelectedNativeItem(e.target.value)}
                                className="w-full bg-[#070609] border border-white/15 px-3 py-2 text-xs font-bold text-white outline-none"
                              >
                                <option value="">-- Elige un paquete base --</option>
                                {catalogData.products.map((p: any) => (
                                  <option
                                    key={p.sku}
                                    value={`${getCodeType(p.name)}___${p.productId}___${p.sku}`}
                                  >
                                    {p.name} (${p.price} USD)
                                  </option>
                                ))}
                              </select>
                            </div>
                            <button
                              onClick={() => {
                                if (selectedNativeItem)
                                  setComboItems([...comboItems, selectedNativeItem])
                              }}
                              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase flex items-center gap-2 border border-white/20 h-9 cursor-pointer"
                            >
                              <Plus className="w-4 h-4" /> Añadir
                            </button>
                          </div>

                          {comboItems.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {comboItems.map((item, idx) => {
                                const [, , sku] = item.split('___')
                                const prodName =
                                  catalogData.products.find((p: any) => p.sku === sku)?.name || sku
                                return (
                                  <span
                                    key={idx}
                                    className="bg-primary/20 border border-primary/50 text-white text-[10px] font-black px-3 py-1 flex items-center gap-2 rounded-full"
                                  >
                                    Inyección {idx + 1}: {prodName}
                                    <Trash2
                                      className="w-3 h-3 text-[#ff2a1f] cursor-pointer hover:scale-125 transition-transform"
                                      onClick={() =>
                                        setComboItems(comboItems.filter((_, i) => i !== idx))
                                      }
                                    />
                                  </span>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <button
                      onClick={() => toggleSection(game.slug, 'manual')}
                      className="w-full flex items-center justify-between text-[11px] font-black text-white uppercase tracking-tighter cursor-pointer hover:text-[#00e5ff] transition-colors mb-4"
                    >
                      <div className="flex items-center gap-2">
                        <Puzzle className="w-4 h-4 text-[#00e5ff]" />
                        <span>
                          Productos Manuales{' '}
                          <span className="text-[#00e5ff]">(Fragmentos y Cajas)</span>
                        </span>
                      </div>
                      {sectionsState.manual ? (
                        <ChevronUp className="w-4 h-4 text-white" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-white" />
                      )}
                    </button>

                    {sectionsState.manual && (
                      <div className="pt-2 animate-in fade-in">
                        <p className="text-xs text-zinc-400 font-medium mb-6">
                          Crea productos personalizados que se enviarán de forma manual. Al comprar
                          estos productos, se generará una orden y te llegará una alerta al correo.
                        </p>

                        {/* Formulario de Creación */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-[#0a080d] p-4 border-2 border-white/5">
                          <div>
                            <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2">
                              Tipo de Producto
                            </label>
                            <select
                              value={manualType}
                              onChange={(e) =>
                                setManualType(e.target.value as 'fragment' | 'box' | 'passe')
                              }
                              className="w-full bg-[#070609] border-2 border-white/15 px-3 py-3 text-sm font-bold text-white outline-none focus:border-[#00e5ff] cursor-pointer"
                            >
                              <option value="fragment">Fragmentos</option>
                              <option value="box">Cajas Tokens</option>
                              <option value="passe">Pase Booyah</option>
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2">
                              Nombre al Público
                            </label>
                            <input
                              type="text"
                              value={manualName}
                              onChange={(e) => setManualName(e.target.value)}
                              placeholder="Ej: 90 FRAGMENTOS"
                              className="w-full bg-[#070609] border-2 border-white/15 px-3 py-3 text-sm font-bold text-white outline-none focus:border-[#00e5ff] placeholder:text-zinc-700"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2">
                              Precio (S/)
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="number"
                                step="0.10"
                                value={manualPrice}
                                onChange={(e) => setManualPrice(e.target.value)}
                                placeholder="18.00"
                                className="w-full bg-[#070609] border-2 border-white/15 px-3 py-3 text-sm font-bold text-white outline-none focus:border-[#00e5ff] font-mono"
                              />
                              <button
                                onClick={async () => {
                                  if (!manualName || !manualPrice)
                                    return alert('Completa nombre y precio')
                                  const newCode = `MANUAL_${manualType.toUpperCase()}_${Date.now()}`

                                  const { error } = await supabase.from('product_config').insert({
                                    product_code: newCode,
                                    price_pen: Number(manualPrice),
                                    game_slug: selectedGameTab,
                                    is_active: true,
                                    manual_name: manualName,
                                    manual_type: manualType,
                                  })

                                  if (error) alert('Error al guardar: ' + error.message)
                                  else {
                                    setNotify({
                                      isVisible: true,
                                      message: 'Producto manual creado con éxito',
                                      type: 'success',
                                    })
                                    setManualName('')
                                    setManualPrice('')
                                    refreshConfigs()
                                  }
                                }}
                                className="bg-[#00e5ff] hover:bg-white text-black px-4 flex items-center justify-center transition-colors shadow-[3px_3px_0px_rgba(255,255,255,0.2)] cursor-pointer"
                              >
                                <Plus className="w-5 h-5 stroke-[3]" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Lista de Productos Manuales Creados (Agrupados) */}
                        <div className="mt-8 pt-6 border-t-2 border-white/5">
                          <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-6">
                            Inventario de Productos Manuales
                          </h4>

                          {[
                            {
                              id: 'fragment',
                              title: 'Fragmentos',
                              icon: Puzzle,
                              items: Object.values(productConfigs).filter(
                                (p: any) =>
                                  p.game_slug === selectedGameTab && p.manual_type === 'fragment'
                              ),
                            },
                            {
                              id: 'box',
                              title: 'Cajas Tokens',
                              icon: Box,
                              items: Object.values(productConfigs).filter(
                                (p: any) =>
                                  p.game_slug === selectedGameTab && p.manual_type === 'box'
                              ),
                            },
                            {
                              id: 'passe',
                              title: 'Pases Booyah',
                              icon: Crown,
                              items: Object.values(productConfigs).filter(
                                (p: any) =>
                                  p.game_slug === selectedGameTab && p.manual_type === 'passe'
                              ),
                            },
                          ].map((group) => {
                            if (group.items.length === 0) return null

                            return (
                              <div key={group.id} className="mb-6 last:mb-0 animate-in fade-in">
                                {/* Subtítulo de la Categoría */}
                                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#00e5ff]/20">
                                  <group.icon className="w-4 h-4 text-[#00e5ff]" />
                                  <label className="text-[10px] font-black text-[#00e5ff] uppercase tracking-[0.2em]">
                                    {group.title}
                                  </label>
                                  <span className="text-[9px] font-bold text-zinc-500 bg-white/5 px-2 py-0.5 ml-2 border border-white/5">
                                    {group.items.length}{' '}
                                    {group.items.length === 1 ? 'creado' : 'creados'}
                                  </span>
                                </div>

                                {/* Elementos de la Categoría */}
                                <div className="space-y-2">
                                  {group.items.map((pkg: any) => {
                                    const isEditing = editingManualCode === pkg.product_code

                                    return (
                                      <div
                                        key={pkg.product_code}
                                        className={`flex items-center justify-between bg-white/5 border border-white/10 p-3 hover:bg-white/10 transition-colors gap-4 ${
                                          pkg.is_active ? '' : 'opacity-40 grayscale'
                                        }`}
                                      >
                                        {isEditing ? (
                                          <div className="flex-1 flex items-center gap-3">
                                            <input
                                              type="text"
                                              value={editManualName}
                                              onChange={(e) => setEditManualName(e.target.value)}
                                              className="bg-[#070609] border border-[#00e5ff] px-2 py-1 text-xs font-bold text-white outline-none w-full max-w-xs uppercase"
                                            />
                                            <div className="relative w-28">
                                              <span className="absolute left-2 top-1 text-xs text-zinc-400">
                                                S/
                                              </span>
                                              <input
                                                type="number"
                                                step="0.10"
                                                value={editManualPrice}
                                                onChange={(e) => setEditManualPrice(e.target.value)}
                                                className="w-full bg-[#070609] border border-[#00e5ff] pl-6 pr-2 py-1 text-xs font-black font-mono text-[#ffb703] outline-none"
                                              />
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="flex items-center gap-3">
                                            <group.icon className="w-4 h-4 text-[#00e5ff]" />
                                            <span className="font-black text-sm uppercase tracking-wide text-white">
                                              {pkg.manual_name}
                                            </span>
                                          </div>
                                        )}

                                        <div className="flex items-center gap-4">
                                          {!isEditing && (
                                            <span className="text-[#ffb703] font-black font-mono">
                                              S/ {Number(pkg.price_pen).toFixed(2)}
                                            </span>
                                          )}

                                          {isEditing ? (
                                            <div className="flex items-center gap-2">
                                              <button
                                                onClick={() => setEditingManualCode(null)}
                                                className="p-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                                                title="Cancelar"
                                              >
                                                <X className="w-4 h-4" />
                                              </button>
                                              <button
                                                onClick={async () => {
                                                  if (!editManualName || !editManualPrice)
                                                    return alert('Completa los campos')
                                                  const { error } = await supabase
                                                    .from('product_config')
                                                    .update({
                                                      manual_name: editManualName,
                                                      price_pen: Number(editManualPrice),
                                                    })
                                                    .eq('product_code', pkg.product_code)

                                                  if (error) {
                                                    setNotify({
                                                      isVisible: true,
                                                      message: 'Error al actualizar',
                                                      type: 'error',
                                                    })
                                                  } else {
                                                    setEditingManualCode(null)
                                                    setNotify({
                                                      isVisible: true,
                                                      message: 'Producto manual actualizado',
                                                      type: 'success',
                                                    })
                                                    refreshConfigs()
                                                  }
                                                }}
                                                className="bg-[#00e5ff] text-black px-3 py-1 text-[10px] font-black uppercase tracking-widest cursor-pointer flex items-center gap-1 hover:bg-white transition-colors"
                                              >
                                                <Save className="w-3.5 h-3.5" /> Guardar
                                              </button>
                                            </div>
                                          ) : (
                                            <div className="flex items-center gap-2">
                                              {/* Ojito - Ocultar/Mostrar */}
                                              <button
                                                onClick={async () => {
                                                  const { error } = await supabase
                                                    .from('product_config')
                                                    .update({ is_active: !pkg.is_active })
                                                    .eq('product_code', pkg.product_code)
                                                  if (!error) refreshConfigs()
                                                }}
                                                className={`p-2 border-2 transition-colors cursor-pointer ${
                                                  pkg.is_active
                                                    ? 'text-[#00e5ff] border-[#00e5ff]/40 bg-[#00e5ff]/10'
                                                    : 'text-zinc-500 border-white/10 hover:text-white'
                                                }`}
                                                title="Ocultar/Mostrar"
                                              >
                                                {pkg.is_active ? (
                                                  <Eye className="w-4 h-4" />
                                                ) : (
                                                  <EyeOff className="w-4 h-4" />
                                                )}
                                              </button>

                                              {/* Lápiz - Editar */}
                                              <button
                                                onClick={() => {
                                                  setEditingManualCode(pkg.product_code)
                                                  setEditManualName(pkg.manual_name || '')
                                                  setEditManualPrice(pkg.price_pen || '')
                                                }}
                                                className="p-2 border-2 border-white/10 text-zinc-400 hover:text-[#00e5ff] hover:border-[#00e5ff]/40 hover:bg-[#00e5ff]/10 transition-colors cursor-pointer"
                                                title="Editar producto manual"
                                              >
                                                <Pencil className="w-4 h-4" />
                                              </button>

                                              {/* Basurero - Eliminar */}
                                              <button
                                                onClick={async () => {
                                                  if (
                                                    window.confirm(
                                                      '¿Estás seguro de que deseas eliminar este producto manual?'
                                                    )
                                                  ) {
                                                    const { error } = await supabase
                                                      .from('product_config')
                                                      .delete()
                                                      .eq('product_code', pkg.product_code)
                                                    if (!error) {
                                                      setNotify({
                                                        isVisible: true,
                                                        message: 'Producto manual eliminado',
                                                        type: 'success',
                                                      })
                                                      refreshConfigs()
                                                    } else {
                                                      setNotify({
                                                        isVisible: true,
                                                        message: 'Error al eliminar',
                                                        type: 'error',
                                                      })
                                                    }
                                                  }
                                                }}
                                                className="p-2 border-2 border-white/10 text-zinc-400 hover:text-[#ff2a1f] hover:border-[#ff2a1f]/40 hover:bg-[#ff2a1f]/10 transition-colors cursor-pointer"
                                                title="Eliminar producto"
                                              >
                                                <Trash2 className="w-4 h-4" />
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )
                          })}

                          {/* Mensaje por si no hay absolutamente ningún producto manual */}
                          {Object.values(productConfigs).filter(
                            (p: any) => p.game_slug === selectedGameTab && p.manual_type
                          ).length === 0 && (
                            <p className="text-xs text-zinc-500 font-bold italic text-center py-6 border border-dashed border-white/10 bg-white/5">
                              No hay productos manuales creados todavía.
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </>
        )}
      </div>

      <Notification
        isVisible={notify.isVisible}
        message={notify.message}
        type={notify.type}
        onClose={() => setNotify((prev) => ({ ...prev, isVisible: false }))}
      />
    </div>
  )
}
