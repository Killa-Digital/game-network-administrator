'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  ArrowLeft,
  Crosshair,
  DollarSign,
  Gamepad2,
  LayoutDashboard,
  ShieldAlert,
  Wallet,
} from 'lucide-react'
import Link from 'next/link'
import OrdersTab from './OrdersTab'
import GamesTab from './GamesTab'
import PricingTab from './PricingTab'
import WalletTab from './WalletTab'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'orders' | 'games' | 'pricing' | 'wallet'>('wallet')

  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showOnlyFailed, setShowOnlyFailed] = useState(false)

  const [games, setGames] = useState<any[]>([])
  const [rawCatalog, setRawCatalog] = useState<any[]>([])
  const [productConfigs, setProductConfigs] = useState<Record<string, any>>({})
  const [loadingConfig, setLoadingConfig] = useState(false)

  const [selectedGameTab, setSelectedGameTab] = useState<string>('')

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    if (activeTab === 'games' || activeTab === 'pricing') {
      fetchConfigData()
    }
  }, [activeTab])

  useEffect(() => {
    if (activeTab === 'pricing' && games.length > 0 && !selectedGameTab) {
      setSelectedGameTab(games[0].slug)
    }
  }, [games, activeTab, selectedGameTab])

  const fetchOrders = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setOrders(data)
    setLoading(false)
  }

  const fetchConfigData = async () => {
    setLoadingConfig(true)
    const { data: gData } = await supabase.from('games_config').select('*')
    if (gData) setGames(gData)

    const { data: pData } = await supabase.from('product_config').select('*')
    const configMap: Record<string, any> = {}
    if (pData) pData.forEach((p) => (configMap[p.product_code] = p))
    setProductConfigs(configMap)

    const res = await fetch('/api/admin/catalog')
    const catData = await res.json()
    if (catData.success && catData.data?.catalog) {
      setRawCatalog(catData.data.catalog)
    }
    setLoadingConfig(false)
  }

  const handleGameChange = (index: number, field: string, value: any) => {
    const newGames = [...games]
    newGames[index][field] = value
    setGames(newGames)
  }

  const handleCatalogSelect = (index: number, packageName: string) => {
    const newGames = [...games]
    const catalogItem = rawCatalog.find((c) => c.packageName === packageName)

    newGames[index].codestore_match = packageName

    if (catalogItem) {
      if (!newGames[index].name) {
        newGames[index].name = catalogItem.packageName
          .replace(/\s*\(.*?\)\s*/g, '')
          .trim()
          .toUpperCase()
      }
      if (!newGames[index].slug) {
        newGames[index].slug =
          catalogItem.slug ||
          catalogItem.packageName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '')
      }
    }
    setGames(newGames)
  }

  const addEmptyGame = () => {
    setGames([
      { slug: '', name: '', publisher: '', image_url: '', codestore_match: '', is_active: true },
      ...games,
    ])
  }

  const saveGame = async (game: any) => {
    if (!game.slug || !game.codestore_match)
      return alert('El Slug y el Juego del Proveedor son obligatorios.')
    const { error } = await supabase.from('games_config').upsert({
      slug: game.slug,
      name: game.name,
      publisher: game.publisher,
      image_url: game.image_url,
      codestore_match: game.codestore_match,
      is_active: game.is_active,
    })
    if (error) alert('Error: ' + error.message)
    else alert(`Juego ${game.name} guardado correctamente`)
  }

  const handlePriceChange = (code: string, field: string, value: any) => {
    setProductConfigs((prev) => ({
      ...prev,
      [code]: { ...(prev[code] || { is_active: true, price_pen: 0 }), [field]: value },
    }))
  }

  const savePriceConfig = async (code: string, gameSlug: string) => {
    const conf = productConfigs[code]
    const { error } = await supabase.from('product_config').upsert(
      {
        product_code: code,
        price_pen: Number(conf.price_pen) || 0,
        is_active: conf.is_active ?? true,
        game_slug: gameSlug,
      },
      {
        onConflict: 'product_code',
      }
    )
    if (error) alert('Error al guardar: ' + error.message)
    else alert('Precio actualizado en la tienda')
  }

  const getCodeType = (name: string) => {
    const n = name.toLowerCase()
    if (n.includes('semanal') || n.includes('weekly')) return 'weekly'
    if (n.includes('mensual') || n.includes('monthly')) return 'monthly'
    if (n.includes('pase') || n.includes('level') || n.includes('pass') || n.includes('booyah'))
      return 'pass'
    if (n.includes('fragment') || n.includes('fragmento')) return 'fragment'
    if (n.includes('caja') || n.includes('token')) return 'box'
    return 'diamonds'
  }

  const tabs = [
    { id: 'wallet' as const, label: 'Depósitos', Icon: Wallet },
    { id: 'orders' as const, label: 'Saldo', Icon: LayoutDashboard },
    { id: 'games' as const, label: 'Juegos', Icon: Gamepad2 },
    { id: 'pricing' as const, label: 'Precios', Icon: DollarSign },
  ]

  return (
    <div className="min-h-screen bg-[#070609] selection:bg-[#ff2a1f] selection:text-white font-sans pb-20 relative overflow-hidden bg-halftone">
      <div className="absolute inset-0 bg-speedlines pointer-events-none z-0" />

      <div className="border-b-2 border-[#1f1a29] bg-[#0c0a10] sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-3 text-[11px] font-black text-zinc-300 hover:text-primary transition-colors uppercase tracking-[0.22em]"
          >
            <ArrowLeft className="w-4 h-4 text-[#ff2a1f] stroke-[3] group-hover:-translate-x-2 transition-transform" />{' '}
            Volver a la Tienda
          </Link>
          <div className="flex items-center gap-2 bg-[#ff2a1f]/10 border border-[#ff2a1f] px-3 py-1 -skew-x-12">
            <span className="skew-x-12 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#ff2a1f]" />
              <span className="text-[10px] font-black text-[#ff2a1f] uppercase tracking-[0.25em]">
                Acceso Maestro
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="border-b-4 border-[#ff2a1f] pt-12 pb-8 px-4 relative overflow-hidden z-10">
        <div className="absolute -top-4 left-4 lg:left-10 z-0 pointer-events-none select-none overflow-hidden">
          <span className="text-[6rem] sm:text-[9rem] lg:text-[12rem] font-black uppercase tracking-tighter leading-none text-stroke-subtle block">
            ADMIN
          </span>
        </div>
        <div className="absolute right-[5%] top-0 w-[320px] h-[320px] rounded-full blur-[130px] pointer-events-none z-0 bg-gradient-to-tr from-[#ff2a1f]/30 via-[#ffb703]/20 to-[#00e5ff]/10" />

        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="inline-flex items-center gap-3 bg-[#120e17] border-2 border-[#ff2a1f] px-4 py-1.5 mb-5 -skew-x-12 shadow-[4px_4px_0px_#ff2a1f]">
            <span className="skew-x-12 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.25em] text-white">
              <Crosshair
                className="w-3.5 h-3.5 text-primary animate-spin"
                style={{ animationDuration: '8s' }}
              />
              PANEL — <span className="text-primary">CONTROL TOTAL</span>
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-8 drop-shadow-[5px_5px_0px_#000000]">
            CENTRO DE{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2a1f] via-[#ff6b00] to-[#ffb703]">
              MANDO
            </span>
          </h1>

          <div className="inline-flex flex-wrap gap-2 bg-[#070609] border-2 border-white/15 p-1.5">
            {tabs.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`px-6 py-3 text-[11px] md:text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === id
                    ? 'bg-[#ff2a1f] text-white shadow-[2px_2px_0px_#ffb703]'
                    : 'text-zinc-500 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 mt-10 relative z-10">
        {activeTab === 'orders' && (
          <OrdersTab
            orders={orders}
            loading={loading}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            showOnlyFailed={showOnlyFailed}
            setShowOnlyFailed={setShowOnlyFailed}
            fetchOrders={fetchOrders}
          />
        )}

        {activeTab === 'games' && (
          <GamesTab
            games={games}
            rawCatalog={rawCatalog}
            loadingConfig={loadingConfig}
            addEmptyGame={addEmptyGame}
            handleCatalogSelect={handleCatalogSelect}
            handleGameChange={handleGameChange}
            saveGame={saveGame}
          />
        )}

        {activeTab === 'pricing' && (
          <PricingTab
            games={games}
            rawCatalog={rawCatalog}
            productConfigs={productConfigs}
            loadingConfig={loadingConfig}
            selectedGameTab={selectedGameTab}
            setSelectedGameTab={setSelectedGameTab}
            handlePriceChange={handlePriceChange}
            savePriceConfig={savePriceConfig}
            getCodeType={getCodeType}
            refreshConfigs={fetchConfigData}
          />
        )}

        {activeTab === 'wallet' && <WalletTab />}
      </div>
    </div>
  )
}
