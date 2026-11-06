'use client'
import { useState } from 'react'
import {
  Box,
  CheckSquare,
  Crown,
  Flame,
  Gem,
  Loader2,
  Lock,
  Package,
  Puzzle,
  ShieldCheck,
  X,
} from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'

interface PackageData {
  code: string
  name: string
  price: number
}

interface PackageCatalogProps {
  packages: PackageData[]
  loadingPackages: boolean
  onRequestCheckout: () => void
  checkoutLoading: boolean
}

type ModalCategory = 'FRAGMENTOS' | 'CAJAS' | 'MEMBRESÍAS' | null

export default function PackageCatalog({
  packages,
  loadingPackages,
  onRequestCheckout,
  checkoutLoading,
}: PackageCatalogProps) {
  const [activeTab, setActiveTab] = useState<'diamonds' | 'extras'>('diamonds')
  const [modalCategory, setModalCategory] = useState<ModalCategory>(null)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const { nickname, productCode, price, setProduct } = useCartStore()

  // Clasificación dinámica basada en el código Y el nombre del paquete
  const isPass = (code: string, name: string = '') =>
    code.toLowerCase().includes('pass') ||
    name.toLowerCase().includes('pase') ||
    name.toLowerCase().includes('booyah')

  const isFragment = (code: string, name: string = '') =>
    code.toLowerCase().includes('fragment') || name.toLowerCase().includes('fragment')

  const isBox = (code: string, name: string = '') =>
    code.toLowerCase().includes('caja') ||
    code.toLowerCase().includes('token') ||
    code.toLowerCase().includes('box')

  const isMembership = (code: string, name: string = '') =>
    code.toLowerCase().includes('weekly') ||
    code.toLowerCase().includes('monthly') ||
    name.toLowerCase().includes('semanal') ||
    name.toLowerCase().includes('mensual')

  const isExtra = (code: string, name: string) =>
    isPass(code, name) || isFragment(code, name) || isBox(code, name) || isMembership(code, name)

  const diamonds = packages.filter((pkg) => !isExtra(pkg.code, pkg.name))
  const passes = packages.filter((pkg) => isPass(pkg.code, pkg.name))
  const fragments = packages.filter((pkg) => isFragment(pkg.code, pkg.name))
  const boxes = packages.filter((pkg) => isBox(pkg.code, pkg.name))
  const memberships = packages.filter((pkg) => isMembership(pkg.code, pkg.name))

  const openModal = (category: ModalCategory) => {
    // Si abre fragmentos, mantenemos o reiniciamos el check según convenga, pero ya no se muestra doble
    setModalCategory(category)
  }

  const closeModal = () => {
    setModalCategory(null)
  }

  // Obtener los paquetes correspondientes al modal abierto
  const currentModalPackages =
    modalCategory === 'FRAGMENTOS'
      ? fragments
      : modalCategory === 'CAJAS'
        ? boxes
        : modalCategory === 'MEMBRESÍAS'
          ? memberships
          : []

  // Encontrar el nombre del paquete seleccionado actualmente
  const selectedPackage = packages.find((pkg) => pkg.code === productCode)
  const isSelectedProductFragment = productCode
    ? isFragment(productCode, selectedPackage?.name || '')
    : false

  // Validar si debe bloquearse el botón de pago porque es fragmento y no aceptó términos
  const isCheckoutDisabled =
    !productCode || checkoutLoading || (isSelectedProductFragment && !termsAccepted)

  return (
    <div className="h-full bg-[#110f16] border-2 border-white/20 p-6 md:p-8 flex flex-col shadow-[6px_6px_0px_#1f1a29] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-3 h-3 bg-[#00e5ff]" />

      {!nickname && (
        <div className="absolute inset-0 z-30 bg-[#070609]/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in bg-halftone">
          <div className="bg-[#ff2a1f]/10 border-2 border-[#ff2a1f]/40 p-4 mb-4 -skew-x-6">
            <Lock className="w-7 h-7 text-[#ff2a1f] skew-x-6" />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">
            Desbloquea el Catálogo
          </h3>
          <p className="text-zinc-400 text-sm max-w-sm font-medium">
            Ingresa tu Player ID en el panel izquierdo para verificar tu cuenta y ver los paquetes
            disponibles.
          </p>
        </div>
      )}

      {/* MODAL INTERNO DE OPCIONES EXTRAS (Limpio, sin advertencia repetida) */}
      {modalCategory && (
        <div className="absolute inset-0 z-40 bg-[#0c0a10]/95 backdrop-blur-md flex flex-col p-6 animate-in fade-in zoom-in-95">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-black text-[#ffb703] uppercase tracking-tighter">
                {modalCategory}
              </h3>
              <p className="text-zinc-400 text-xs font-medium mt-1">
                Selecciona una opción para continuar.
              </p>
            </div>
            <button
              onClick={closeModal}
              className="p-2 border-2 border-white/10 hover:border-white text-zinc-400 hover:text-white transition-colors bg-[#070609]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
            {currentModalPackages.map((pkg) => {
              const isSelected = productCode === pkg.code

              return (
                <button
                  key={pkg.code}
                  onClick={() => {
                    setProduct(pkg.code, pkg.price)
                    closeModal()
                  }}
                  className={`w-full flex items-center justify-between p-4 border-2 transition-all group
                    ${isSelected ? 'border-primary bg-primary/10 shadow-[4px_4px_0px_#ff2a1f]' : 'border-white/10 bg-[#110f16] hover:border-primary/50'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#00e5ff]/10 flex items-center justify-center border border-[#00e5ff]/30">
                      {modalCategory === 'FRAGMENTOS' && (
                        <Puzzle className="w-5 h-5 text-[#00e5ff]" />
                      )}
                      {modalCategory === 'CAJAS' && <Box className="w-5 h-5 text-[#00e5ff]" />}
                      {modalCategory === 'MEMBRESÍAS' && (
                        <Crown className="w-5 h-5 text-[#00e5ff]" />
                      )}
                    </div>
                    <span className="font-black text-white text-xs md:text-sm uppercase tracking-wide text-left">
                      {pkg.name}
                    </span>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-primary font-black font-mono text-lg tracking-tight">
                      S/ {pkg.price.toFixed(2)}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-6 flex items-center gap-4 relative z-10">
        <div
          className={`w-9 h-9 border-2 -skew-x-6 flex items-center justify-center text-sm font-black transition-colors ${nickname ? 'bg-primary text-black border-black shadow-[3px_3px_0px_#ff2a1f]' : 'bg-white/5 border-white/15 text-zinc-500'}`}
        >
          <span className="skew-x-6">2</span>
        </div>
        Elige tu Paquete
      </h2>

      <div className="flex gap-2 bg-[#070609] border-2 border-white/15 p-1.5 mb-6 relative z-10">
        <button
          onClick={() => setActiveTab('diamonds')}
          className={`flex-1 py-3 text-[11px] md:text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer
                        ${activeTab === 'diamonds' ? 'bg-[#ff2a1f] text-white shadow-[2px_2px_0px_#ffb703]' : 'text-zinc-500 hover:text-white'}`}
        >
          <Gem className="w-4 h-4" /> Diamantes
        </button>
        <button
          onClick={() => setActiveTab('extras')}
          className={`flex-1 py-3 text-[11px] md:text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer
                        ${activeTab === 'extras' ? 'bg-[#ff2a1f] text-white shadow-[2px_2px_0px_#ffb703]' : 'text-zinc-500 hover:text-white'}`}
        >
          <Package className="w-4 h-4" /> Extras
        </button>
      </div>

      <div className="relative z-10 flex-1">
        {loadingPackages ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/10 bg-[#0a080d]">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-primary text-xs font-black uppercase tracking-[0.3em] animate-pulse">
              Sincronizando...
            </p>
          </div>
        ) : (
          <div className="h-full max-h-[450px] overflow-y-auto p-1 pr-2 custom-scrollbar">
            {/* VISTA DIAMANTES */}
            {activeTab === 'diamonds' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-4">
                {diamonds.length === 0 && (
                  <p className="col-span-full text-center text-xs font-black uppercase tracking-[0.25em] text-zinc-500 py-10">
                    No hay diamantes disponibles.
                  </p>
                )}
                {diamonds.map((pkg) => {
                  const selected = productCode === pkg.code
                  return (
                    <button
                      key={pkg.code}
                      onClick={() => setProduct(pkg.code, pkg.price)}
                      className={`relative p-4 border-2 transition-all duration-200 flex flex-col items-center justify-center gap-3 group cursor-pointer
                        ${selected ? 'border-primary bg-primary/10 shadow-[5px_5px_0px_#ff2a1f] -translate-x-1 -translate-y-1' : 'border-white/20 bg-[#0a080d] shadow-[4px_4px_0px_#1f1a29] hover:border-primary hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_#ff2a1f]'}`}
                    >
                      {selected && <div className="absolute top-0 right-0 w-3 h-3 bg-primary" />}
                      <div
                        className={`p-2.5 border transition-colors duration-200 ${selected ? 'text-primary bg-primary/15 border-primary/40' : 'text-zinc-400 bg-white/5 border-white/10 group-hover:text-primary'}`}
                      >
                        <Gem className="w-7 h-7" />
                      </div>
                      <div className="text-center w-full">
                        <p className="font-black text-[11px] text-white uppercase tracking-wide mb-3 leading-tight h-8 flex items-center justify-center">
                          {pkg.name}
                        </p>
                        <div className="flex flex-col items-center justify-center bg-black/50 border border-white/10 py-2 w-full">
                          <p
                            className={`text-lg font-black tracking-tight font-mono ${selected ? 'text-primary' : 'text-white'}`}
                          >
                            S/ {pkg.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            {/* VISTA EXTRAS */}
            {activeTab === 'extras' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
                {/* 1. Pase Booyah (Selección Directa) */}
                {passes.map((pkg) => {
                  const selected = productCode === pkg.code
                  return (
                    <button
                      key={pkg.code}
                      onClick={() => setProduct(pkg.code, pkg.price)}
                      className={`col-span-full sm:col-span-1 p-5 border-2 flex flex-col transition-all text-left cursor-pointer
                        ${selected ? 'border-[#ffb703] bg-[#ffb703]/10 shadow-[4px_4px_0px_#ffb703] -translate-y-1' : 'border-[#ffb703]/30 bg-[#110f16] hover:border-[#ffb703]/80 shadow-[4px_4px_0px_#1f1a29]'}`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <div className="bg-[#ffb703] text-black px-2 py-0.5 text-[9px] font-black uppercase tracking-widest skew-x-12">
                          <span className="-skew-x-12 block">Destacado</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <Crown
                            className={`w-8 h-8 ${selected ? 'text-[#ffb703]' : 'text-white'}`}
                          />
                          <span className="font-black text-white uppercase tracking-wide text-sm">
                            {pkg.name}
                          </span>
                        </div>
                        <span className="text-[#ffb703] font-black font-mono text-lg">
                          S/ {pkg.price.toFixed(2)}
                        </span>
                      </div>
                    </button>
                  )
                })}

                {/* 2. Fragmentos (Abre Modal) */}
                {fragments.length > 0 && (
                  <button
                    onClick={() => openModal('FRAGMENTOS')}
                    className="p-5 border-2 border-white/10 bg-[#110f16] shadow-[4px_4px_0px_#1f1a29] flex items-center gap-4 hover:border-white/40 hover:-translate-y-1 transition-all text-left group cursor-pointer"
                  >
                    <div className="w-14 h-14 bg-[#00e5ff]/10 flex items-center justify-center shrink-0 border border-[#00e5ff]/20 group-hover:border-[#00e5ff]/50 transition-colors">
                      <Puzzle className="w-7 h-7 text-[#00e5ff]" />
                    </div>
                    <div>
                      <p className="font-black text-white uppercase tracking-wide">Fragmentos</p>
                      <p className="text-[10px] text-zinc-500 font-medium">
                        {fragments.length} cantidades disponibles
                      </p>
                      <p className="text-[#ffb703] text-[11px] font-black uppercase tracking-widest mt-1 group-hover:text-primary transition-colors">
                        Seleccionar &gt;
                      </p>
                    </div>
                  </button>
                )}

                {/* 3. Cajas (Abre Modal) */}
                {boxes.length > 0 && (
                  <button
                    onClick={() => openModal('CAJAS')}
                    className="p-5 border-2 border-white/10 bg-[#110f16] shadow-[4px_4px_0px_#1f1a29] flex items-center gap-4 hover:border-white/40 hover:-translate-y-1 transition-all text-left group cursor-pointer"
                  >
                    <div className="w-14 h-14 bg-[#00e5ff]/10 flex items-center justify-center shrink-0 border border-[#00e5ff]/20 group-hover:border-[#00e5ff]/50 transition-colors">
                      <Box className="w-7 h-7 text-[#00e5ff]" />
                    </div>
                    <div>
                      <p className="font-black text-white uppercase tracking-wide">Cajas</p>
                      <p className="text-[10px] text-zinc-500 font-medium">
                        {boxes.length} cantidades disponibles
                      </p>
                      <p className="text-[#ffb703] text-[11px] font-black uppercase tracking-widest mt-1 group-hover:text-primary transition-colors">
                        Seleccionar &gt;
                      </p>
                    </div>
                  </button>
                )}

                {/* 4. Membresías (Abre Modal) */}
                {memberships.length > 0 && (
                  <button
                    onClick={() => openModal('MEMBRESÍAS')}
                    className="p-5 border-2 border-white/10 bg-[#110f16] shadow-[4px_4px_0px_#1f1a29] flex items-center gap-4 hover:border-white/40 hover:-translate-y-1 transition-all text-left group cursor-pointer"
                  >
                    <div className="w-14 h-14 bg-[#00e5ff]/10 flex items-center justify-center shrink-0 border border-[#00e5ff]/20 group-hover:border-[#00e5ff]/50 transition-colors">
                      <Crown className="w-7 h-7 text-[#00e5ff]" />
                    </div>
                    <div>
                      <p className="font-black text-white uppercase tracking-wide">Membresías</p>
                      <p className="text-[10px] text-zinc-500 font-medium">
                        {memberships.length} cantidades disponibles
                      </p>
                      <p className="text-[#ffb703] text-[11px] font-black uppercase tracking-widest mt-1 group-hover:text-primary transition-colors">
                        Seleccionar &gt;
                      </p>
                    </div>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="pt-6 border-t-2 border-white/10 mt-auto relative z-10">
        {/* SECCIÓN: Mostrar el nombre del paquete seleccionado y advertencia de demora única si es fragmento */}
        {selectedPackage && (
          <div className="mb-4 bg-[#070609] border-2 border-white/15 p-4 relative">
            <div className="absolute top-0 right-0 w-2 h-2 bg-[#ffb703]" />
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                Paquete Seleccionado:
              </span>
              <span className="text-primary font-mono text-xs font-black">
                S/ {selectedPackage.price.toFixed(2)}
              </span>
            </div>
            <p className="text-white text-xs md:text-sm font-black uppercase tracking-wide">
              {selectedPackage.name}
            </p>

            {/* Única advertencia y check de términos si es un fragmento */}
            {isSelectedProductFragment && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-[#ffb703] text-[10px] md:text-xs leading-relaxed mb-2.5 font-medium">
                  La entrega de este producto podría demorar dependiendo de la disponibilidad.
                  <br />
                  <strong className="font-black mt-0.5 block text-white">
                    Requisito: la cuenta de Free Fire debe ser como mínimo nivel 15.
                  </strong>
                </p>
                <label className="flex items-center gap-3 cursor-pointer group w-fit">
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  />
                  <div
                    className={`w-4 h-4 border-2 flex items-center justify-center transition-colors ${termsAccepted ? 'bg-[#ffb703] border-[#ffb703]' : 'border-white/30 bg-black group-hover:border-white/60'}`}
                  >
                    {termsAccepted && <CheckSquare className="w-3.5 h-3.5 text-black" />}
                  </div>
                  <span className="text-white text-[11px] font-bold group-hover:text-[#ffb703] transition-colors">
                    He leído y acepto este aviso.
                  </span>
                </label>
              </div>
            )}
          </div>
        )}

        <button
          onClick={onRequestCheckout}
          className={`w-full py-4 lg:py-5 font-black text-sm md:text-base uppercase tracking-[0.18em] border-2 shadow-[6px_6px_0px_#ff2a1f] transition-all flex items-center justify-center gap-3 disabled:opacity-80 disabled:cursor-not-allowed
                        ${checkoutLoading ? 'bg-[#ffc42e] text-black border-black translate-x-1 translate-y-1 shadow-none' : 'bg-primary hover:bg-[#ffc42e] text-black border-black hover:shadow-[2px_2px_0px_#ff2a1f] hover:translate-x-1 hover:translate-y-1 cursor-pointer'}`}
          disabled={isCheckoutDisabled}
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
              {price > 0 && (
                <span className="bg-black/30 text-white border border-black/20 px-2 py-0.5 font-mono">
                  S/ {price.toFixed(2)}
                </span>
              )}
            </>
          )}
        </button>
        <div className="flex items-center justify-center gap-2 mt-5 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
          <ShieldCheck className="w-4 h-4 text-[#00e5ff]" /> Pago inmediato desde tu Billetera
        </div>
      </div>
    </div>
  )
}
