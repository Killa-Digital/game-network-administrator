'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  ArrowLeft,
  CheckCircle,
  History,
  KeyRound,
  Loader2,
  Lock,
  Phone,
  Save,
  ShoppingCart,
  User,
  Wallet,
  XCircle,
} from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [balance, setBalance] = useState<number>(0)
  const [displayName, setDisplayName] = useState('')
  const [phone, setPhone] = useState('')
  const [loadingInfo, setLoadingInfo] = useState(false)

  // Estados para el cambio de contraseña
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loadingPassword, setLoadingPassword] = useState(false)

  const [history, setHistory] = useState<any[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user) {
        const u = session.user
        setUser(u)

        const { data: profile } = await supabase
          .from('profiles')
          .select('balance, full_name, phone')
          .eq('id', u.id)
          .single()

        if (profile) {
          setBalance(profile.balance || 0)
          setDisplayName(
            profile.full_name || u.user_metadata?.full_name || u.user_metadata?.name || ''
          )
          setPhone(profile.phone || '')
        }

        const { data: orders } = await supabase.from('orders').select('*').eq('user_id', u.id)
        const { data: recharges } = await supabase
          .from('wallet_requests')
          .select('*')
          .eq('user_id', u.id)
        const combined = [
          ...(orders?.map((o) => ({ ...o, type: 'purchase', date: new Date(o.created_at) })) || []),
          ...(recharges?.map((r) => ({ ...r, type: 'recharge', date: new Date(r.created_at) })) ||
            []),
        ].sort((a, b) => b.date.getTime() - a.date.getTime())
        setHistory(combined)
      }
      setLoadingHistory(false)
    }
    loadProfile()
  }, [])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingInfo(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: displayName,
          phone: phone,
        })
        .eq('id', user.id)

      if (error) throw error
      alert('Perfil actualizado con éxito')
    } catch (error: any) {
      alert('Error: ' + error.message)
    } finally {
      setLoadingInfo(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPassword || newPassword.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (newPassword !== confirmPassword) {
      alert('Las contraseñas no coinciden.')
      return
    }

    setLoadingPassword(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error

      alert('¡Contraseña actualizada con éxito!')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error: any) {
      alert('Error al actualizar contraseña: ' + error.message)
    } finally {
      setLoadingPassword(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#070609] selection:bg-[#ff2a1f] font-sans text-white bg-halftone pb-24 relative">
      <div className="absolute inset-0 bg-speedlines pointer-events-none z-0" />

      <div className="w-full bg-[#0c0a10] border-b-2 border-[#1f1a29] py-3 relative z-20 mb-10">
        <div className="max-w-6xl mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center text-[11px] font-black uppercase tracking-[0.22em] text-zinc-400 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-3 stroke-[3]" /> VOLVER A LA TIENDA
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-[#110f16] border-2 border-[#00e5ff] p-6 shadow-[6px_6px_0px_#00e5ff]/30 text-center">
            <Wallet className="w-8 h-8 text-[#00e5ff] mx-auto mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-2">
              Mi Billetera Virtual
            </p>
            <p className="text-4xl font-black text-white font-mono">S/ {balance.toFixed(2)}</p>
            <Link
              href="/wallet"
              className="mt-6 block w-full py-3 bg-[#00e5ff]/10 hover:bg-[#00e5ff] text-[#00e5ff] hover:text-black border border-[#00e5ff] font-black text-[11px] uppercase tracking-widest transition-colors"
            >
              RECARGAR SALDO
            </Link>
          </div>

          <div className="bg-[#110f16] border-2 border-white/20 p-6 shadow-[6px_6px_0px_#1f1a29]">
            <h2 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Datos de Agente
            </h2>

            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.25em] mb-2">
                  Correo (No editable)
                </label>
                <input
                  type="text"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-zinc-400 font-medium text-sm outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] mb-2">
                  Nombre / Apodo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full pl-10 pr-4 py-3 bg-[#070609] border border-white/20 text-white font-bold text-sm outline-none focus:border-primary transition-colors placeholder:text-zinc-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] mb-2">
                  Teléfono
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej: 999888777"
                    className="w-full pl-10 pr-4 py-3 bg-[#070609] border border-white/20 text-white font-bold text-sm outline-none focus:border-primary transition-colors placeholder:text-zinc-600 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loadingInfo}
                className="w-full py-4 bg-primary hover:bg-[#ffc42e] text-black font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_#ff2a1f] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all flex justify-center items-center gap-2 mt-4"
              >
                {loadingInfo ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" /> GUARDAR DATOS
                  </>
                )}
              </button>
            </form>
          </div>

          {/* NUEVO APARTADO: ACTUALIZAR CONTRASEÑA (Ubicado exactamente entre Datos de Agente y el Historial) */}
          <div className="bg-[#110f16] border-2 border-white/20 p-6 shadow-[6px_6px_0px_#1f1a29]">
            <h2 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-primary" /> Seguridad
            </h2>

            <form onSubmit={handleUpdatePassword} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] mb-2">
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-[#070609] border border-white/20 text-white font-bold text-sm outline-none focus:border-primary transition-colors placeholder:text-zinc-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] mb-2">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-[#070609] border border-white/20 text-white font-bold text-sm outline-none focus:border-primary transition-colors placeholder:text-zinc-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loadingPassword}
                className="w-full py-4 bg-white/10 hover:bg-primary text-white hover:text-black border border-white/20 hover:border-black font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_#1f1a29] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all flex justify-center items-center gap-2 mt-4 cursor-pointer"
              >
                {loadingPassword ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" /> ACTUALIZAR CLAVE
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-[#110f16] border-2 border-white/20 h-full shadow-[6px_6px_0px_#1f1a29] flex flex-col">
            <div className="p-6 border-b-2 border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                <History className="w-6 h-6 text-primary" /> Historial de Operaciones
              </h2>
            </div>

            <div className="flex-1 overflow-x-auto custom-scrollbar p-2">
              {loadingHistory ? (
                <div className="flex justify-center items-center h-48">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-zinc-500">
                  <ShoppingCart className="w-10 h-10 mb-3 opacity-50" />
                  <p className="text-[11px] font-black uppercase tracking-[0.2em]">
                    No has realizado operaciones aún
                  </p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                        Tipo
                      </th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                        Fecha
                      </th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                        Detalle
                      </th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right">
                        Monto
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {history.map((item, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 align-middle">
                          {item.type === 'recharge' ? (
                            <span className="text-[#00e5ff] flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-[#00e5ff]/10 px-2 py-1 w-fit border border-[#00e5ff]/30">
                              <Wallet className="w-3 h-3" /> Yape
                            </span>
                          ) : (
                            <span className="text-[#ffb703] flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-[#ffb703]/10 px-2 py-1 w-fit border border-[#ffb703]/30">
                              <ShoppingCart className="w-3 h-3" /> Compra
                            </span>
                          )}
                        </td>
                        <td className="p-4 align-middle text-xs font-mono text-zinc-400">
                          {item.date.toLocaleDateString()}
                        </td>
                        <td className="p-4 align-middle">
                          {item.type === 'recharge' ? (
                            <div>
                              <p className="text-sm font-bold text-white">Recarga de Saldo</p>
                              <div className="flex items-center gap-1 mt-1">
                                {item.status === 'approved' && (
                                  <>
                                    <CheckCircle className="w-3 h-3 text-[#00e5ff]" />
                                    <span className="text-[10px] text-[#00e5ff] uppercase font-bold tracking-widest">
                                      Aprobado
                                    </span>
                                  </>
                                )}
                                {item.status === 'pending' && (
                                  <>
                                    <Loader2 className="w-3 h-3 text-primary animate-spin" />
                                    <span className="text-[10px] text-primary uppercase font-bold tracking-widest">
                                      En Revisión
                                    </span>
                                  </>
                                )}
                                {item.status === 'rejected' && (
                                  <>
                                    <XCircle className="w-3 h-3 text-[#ff2a1f]" />
                                    <span className="text-[10px] text-[#ff2a1f] uppercase font-bold tracking-widest">
                                      Rechazado
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div>
                              <p className="text-sm font-bold text-white uppercase tracking-tight">
                                {item.nickname}
                              </p>
                              <p className="text-[10px] text-zinc-500 font-mono">
                                ID: {item.player_id} • {item.product_code?.split('___')[0]}
                              </p>
                            </div>
                          )}
                        </td>
                        <td className="p-4 align-middle text-right">
                          <p
                            className={`text-lg font-black font-mono ${item.type === 'recharge' && item.status === 'approved' ? 'text-[#00e5ff]' : item.type === 'purchase' ? 'text-[#ffb703]' : 'text-zinc-500'}`}
                          >
                            {item.type === 'recharge' ? '+' : '-'} S/{' '}
                            {item.amount || item.price?.toFixed(2)}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
