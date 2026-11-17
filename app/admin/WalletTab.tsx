'use client'
import { useEffect, useState } from 'react'
import {
  Ban,
  Check,
  CheckCircle2,
  DollarSign,
  Edit2,
  History,
  Image as ImageIcon,
  Inbox,
  Loader2,
  Search,
  ShieldAlert,
  Trophy,
  Users,
  X,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Notification from '@/components/Notification'
import ConfirmModal from '@/components/ConfirmModal'

interface WalletRequest {
  id: string
  user_id: string
  amount: number
  receipt_url: string
  status: string
  created_at: string
  profiles: { email: string; full_name: string; phone: string }
}

interface UserProfile {
  id: string
  email: string
  full_name: string
  phone: string
  balance: number
  status?: 'active' | 'suspended'
  total_recharged: number
}

export default function WalletTab() {
  const [requests, setRequests] = useState<WalletRequest[]>([])
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'pending' | 'history' | 'users'>('pending')
  const [searchQuery, setSearchQuery] = useState('')

  const [notify, setNotify] = useState({
    isVisible: false,
    message: '',
    type: 'info' as 'success' | 'error' | 'info',
  })
  const [modal, setModal] = useState<{
    isOpen: boolean
    action: 'approve' | 'reject' | null
    reqData: any
  }>({ isOpen: false, action: null, reqData: null })

  const [balanceModal, setBalanceModal] = useState<{
    isOpen: boolean
    mode: 'reward' | 'edit'
    user: UserProfile | null
    amountValue: string | number
  }>({ isOpen: false, mode: 'reward', user: null, amountValue: '' })

  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean
    user: UserProfile | null
    nextStatus: 'active' | 'suspended'
  }>({ isOpen: false, user: null, nextStatus: 'suspended' })

  const fetchData = async () => {
    setLoading(true)

    const [reqsRes, profilesRes] = await Promise.all([
      supabase
        .from('wallet_requests')
        .select('*, profiles(email, full_name, phone)')
        .order('created_at', { ascending: false }),
      supabase.from('profiles').select('*'),
    ])

    if (reqsRes.data) {
      setRequests(reqsRes.data as any)
    }

    if (profilesRes.data && reqsRes.data) {
      const approvedReqs = reqsRes.data.filter((r) => r.status === 'approved')
      const totals = approvedReqs.reduce(
        (acc, req) => {
          acc[req.user_id] = (acc[req.user_id] || 0) + req.amount
          return acc
        },
        {} as Record<string, number>
      )

      const rankedUsers = profilesRes.data
        .map((p) => ({
          ...p,
          status: p.status || 'active',
          total_recharged: totals[p.id] || 0,
        }))
        .sort((a, b) => b.total_recharged - a.total_recharged)

      setUsers(rankedUsers)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const requestAction = (req: WalletRequest, action: 'approve' | 'reject') => {
    setModal({ isOpen: true, action, reqData: req })
  }

  const executeAction = async () => {
    if (!modal.reqData || !modal.action) return
    const { id, user_id, amount } = modal.reqData
    const action = modal.action

    setModal({ isOpen: false, action: null, reqData: null })
    setProcessingId(id)

    try {
      const res = await fetch('/api/admin/wallet/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: id, userId: user_id, amount, action }),
      })
      const data = await res.json()

      if (data.success) {
        setRequests(
          requests.map((req) =>
            req.id === id ? { ...req, status: action === 'approve' ? 'approved' : 'rejected' } : req
          )
        )
        setNotify({
          isVisible: true,
          message: action === 'approve' ? 'Saldo aprobado con éxito' : 'Solicitud rechazada',
          type: 'success',
        })
        if (action === 'approve') fetchData()
      } else {
        setNotify({ isVisible: true, message: data.error || 'Ocurrió un error', type: 'error' })
      }
    } catch (error) {
      setNotify({ isVisible: true, message: 'Error de conexión', type: 'error' })
    } finally {
      setProcessingId(null)
    }
  }

  const handleBalanceSubmit = async () => {
    if (!balanceModal.user) return

    const numericValue = Number(balanceModal.amountValue)
    if (isNaN(numericValue) || balanceModal.amountValue === '') {
      setNotify({ isVisible: true, message: 'Ingresa un monto válido', type: 'error' })
      return
    }

    setProcessingId(balanceModal.user.id)

    try {
      const currentBalance = Number(balanceModal.user.balance || 0)
      const nextBalance =
        balanceModal.mode === 'reward'
          ? Number((currentBalance + numericValue).toFixed(2))
          : Number(numericValue.toFixed(2))

      const { data, error } = await supabase
        .from('profiles')
        .update({ balance: nextBalance })
        .eq('id', balanceModal.user.id)
        .select('id, balance')

      if (error) {
        setNotify({
          isVisible: true,
          message: error.message || 'Error al actualizar el saldo',
          type: 'error',
        })
        return
      }

      if (!data || data.length === 0) {
        setNotify({
          isVisible: true,
          message: 'No se pudo actualizar en Supabase (verifica permisos RLS en profiles)',
          type: 'error',
        })
        return
      }

      const updatedBalance = Number(data[0].balance ?? nextBalance)

      setUsers((prev) =>
        prev.map((u) => (u.id === balanceModal.user!.id ? { ...u, balance: updatedBalance } : u))
      )
      setNotify({
        isVisible: true,
        message:
          balanceModal.mode === 'reward'
            ? '¡Premio de saldo sumado con éxito!'
            : '¡Saldo modificado con éxito!',
        type: 'success',
      })
      setBalanceModal({ isOpen: false, mode: 'reward', user: null, amountValue: '' })
    } catch (error) {
      setNotify({ isVisible: true, message: 'Error de conexión', type: 'error' })
    } finally {
      setProcessingId(null)
    }
  }

  const executeStatusChange = async () => {
    if (!statusModal.user) return
    const targetUser = statusModal.user
    const nextStatus = statusModal.nextStatus

    setStatusModal({ isOpen: false, user: null, nextStatus: 'suspended' })
    setProcessingId(targetUser.id)

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ status: nextStatus })
        .eq('id', targetUser.id)
        .select('id, status')

      if (error) {
        setNotify({
          isVisible: true,
          message: error.message || 'Error al actualizar el estado del usuario',
          type: 'error',
        })
        return
      }

      if (!data || data.length === 0) {
        setNotify({
          isVisible: true,
          message: 'No se pudo actualizar en Supabase (verifica permisos RLS en profiles)',
          type: 'error',
        })
        return
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, status: nextStatus } : u))
      )
      setNotify({
        isVisible: true,
        message:
          nextStatus === 'suspended'
            ? 'Usuario suspendido correctamente'
            : 'Usuario activado correctamente',
        type: 'success',
      })
    } catch (error) {
      setNotify({ isVisible: true, message: 'Error de conexión', type: 'error' })
    } finally {
      setProcessingId(null)
    }
  }

  const pendingRequests = requests.filter((req) => req.status === 'pending')
  const historyRequests = requests.filter((req) => req.status !== 'pending')
  const totalIncome = requests
    .filter((req) => req.status === 'approved')
    .reduce((sum, req) => sum + req.amount, 0)

  const rankedUsersWithIndex = users.map((user, idx) => ({ ...user, rankIndex: idx }))
  const filteredUsers = rankedUsersWithIndex.filter((user) => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return true
    return (
      (user.full_name || '').toLowerCase().includes(query) ||
      (user.email || '').toLowerCase().includes(query) ||
      (user.phone || '').toLowerCase().includes(query)
    )
  })

  return (
    <div className="w-full text-white animate-in fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-[#110f16] border-2 border-white/20 p-6 relative overflow-hidden group shadow-[6px_6px_0px_#1f1a29] hover:border-primary transition-colors">
          <div className="absolute top-0 right-0 w-3 h-3 bg-primary" />
          <div className="flex justify-between items-start mb-6">
            <div className="bg-primary/15 border border-primary/40 p-3">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">
              Yapes Aprobados (Ingreso Real)
            </span>
          </div>
          <p className="text-4xl font-black text-white tracking-tighter font-mono">
            S/ {totalIncome.toFixed(2)}
          </p>
        </div>
        <div className="bg-[#110f16] border-2 border-white/20 p-6 relative overflow-hidden group shadow-[6px_6px_0px_#1f1a29] hover:border-[#00e5ff] transition-colors">
          <div className="absolute top-0 right-0 w-3 h-3 bg-[#00e5ff]" />
          <div className="flex justify-between items-start mb-6">
            <div className="bg-[#00e5ff]/15 border border-[#00e5ff]/40 p-3">
              <Inbox className="w-6 h-6 text-[#00e5ff]" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#00e5ff]">
              Bandeja Pendiente
            </span>
          </div>
          <p className="text-4xl font-black text-white tracking-tighter font-mono">
            {pendingRequests.length}{' '}
            <span className="text-sm font-sans text-zinc-500">solicitudes</span>
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-8 border-b-2 border-white/10 pb-5">
        <button
          onClick={() => setViewMode('pending')}
          className={`px-6 py-3 text-[11px] md:text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer ${
            viewMode === 'pending'
              ? 'bg-primary text-black shadow-[3px_3px_0px_#ff2a1f]'
              : 'bg-[#110f16] text-zinc-500 hover:text-white border-2 border-white/10'
          }`}
        >
          <ShieldAlert className="w-4 h-4" /> Por Revisar ({pendingRequests.length})
        </button>
        <button
          onClick={() => setViewMode('history')}
          className={`px-6 py-3 text-[11px] md:text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer ${
            viewMode === 'history'
              ? 'bg-primary text-black shadow-[3px_3px_0px_#ff2a1f]'
              : 'bg-[#110f16] text-zinc-500 hover:text-white border-2 border-white/10'
          }`}
        >
          <History className="w-4 h-4" /> Historial
        </button>
        <button
          onClick={() => setViewMode('users')}
          className={`px-6 py-3 text-[11px] md:text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer ${
            viewMode === 'users'
              ? 'bg-[#00e5ff] text-black shadow-[3px_3px_0px_#0088cc]'
              : 'bg-[#110f16] text-zinc-500 hover:text-white border-2 border-white/10'
          }`}
        >
          <Users className="w-4 h-4" /> Top Clientes
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : viewMode === 'pending' ? (
        pendingRequests.length === 0 ? (
          <div className="bg-[#110f16] border-2 border-dashed border-white/20 p-20 text-center flex flex-col items-center">
            <ImageIcon className="w-12 h-12 text-zinc-600 mb-4" />
            <h3 className="text-xl font-black uppercase text-zinc-400">Bandeja Limpia</h3>
            <p className="text-sm text-zinc-500">No hay pagos pendientes por revisar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-[#110f16] border-2 border-white/20 shadow-[6px_6px_0px_#1f1a29] flex flex-col"
              >
                <div className="w-full h-64 bg-black border-b-2 border-white/10 overflow-hidden relative group">
                  <img
                    src={req.receipt_url}
                    alt="Comprobante"
                    className="w-full h-full object-contain cursor-pointer transition-transform group-hover:scale-110"
                    onClick={() => window.open(req.receipt_url, '_blank')}
                  />
                  <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 text-[10px] font-mono border border-white/10 shadow-[2px_2px_0px_#ff2a1f]">
                    Clic para ampliar
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                        Monto Solicitado
                      </p>
                      <p className="text-2xl font-black text-white font-mono text-primary">
                        S/ {req.amount.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                        Fecha
                      </p>
                      <p className="text-xs font-mono">
                        {new Date(req.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="mb-6 bg-black/30 p-3 border border-white/5">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                      Usuario (Email)
                    </p>
                    <p className="text-sm font-medium truncate">
                      {req.profiles?.email || 'Usuario Desconocido'}
                    </p>
                  </div>
                  <div className="mt-auto flex gap-3">
                    <button
                      onClick={() => requestAction(req, 'reject')}
                      disabled={processingId === req.id}
                      className="flex-1 py-3 bg-[#ff2a1f]/10 hover:bg-[#ff2a1f] text-[#ff2a1f] hover:text-white border-2 border-[#ff2a1f] font-black text-xs uppercase tracking-widest transition-colors flex justify-center items-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      <X className="w-4 h-4" /> Rechazar
                    </button>
                    <button
                      onClick={() => requestAction(req, 'approve')}
                      disabled={processingId === req.id}
                      className="flex-[2] py-3 bg-primary hover:bg-[#ffc42e] text-black border-2 border-primary font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_#ffb703]/20 transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none flex justify-center items-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {processingId === req.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" /> APROBAR
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : viewMode === 'users' ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 max-w-md w-full bg-[#110f16] border-2 border-white/20 focus-within:border-[#00e5ff] px-3.5 py-2.5 transition-colors shadow-[4px_4px_0px_#1f1a29]">
            <Search className="w-4 h-4 text-[#00e5ff] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, correo o teléfono..."
              className="flex-1 min-w-0 bg-transparent border-0 p-0 text-xs font-mono text-white placeholder:text-zinc-400 focus:outline-none focus:ring-0"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="shrink-0 p-1 bg-[#ff2a1f] hover:bg-[#ff2a1f]/80 text-white border border-[#ff2a1f] transition-colors cursor-pointer flex items-center justify-center"
                title="Limpiar búsqueda"
              >
                <X className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            )}
          </div>

          <div className="bg-[#110f16] border-2 border-white/20 overflow-x-auto shadow-[6px_6px_0px_#1f1a29] custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[980px]">
              <thead>
              <tr className="bg-[#0a080d] border-b-2 border-[#00e5ff]">
                <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 w-16 text-center">
                  Rango
                </th>
                <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                  Cliente / Email
                </th>
                <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                  Telefono
                </th>
                <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-right">
                  Saldo Actual
                </th>
                <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#00e5ff] text-right">
                  Total Histórico
                </th>
                <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-center">
                  Acción
                </th>
              </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-zinc-500 text-xs font-black uppercase tracking-widest"
                  >
                    No se encontraron clientes.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isSuspended = user.status === 'suspended'
                  return (
                    <tr key={user.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="p-4 align-middle text-center">
                        {user.rankIndex === 0 ? (
                          <Trophy className="w-6 h-6 text-[#ffd700] mx-auto" />
                        ) : user.rankIndex === 1 ? (
                          <Trophy className="w-5 h-5 text-[#c0c0c0] mx-auto" />
                        ) : user.rankIndex === 2 ? (
                          <Trophy className="w-4 h-4 text-[#cd7f32] mx-auto" />
                        ) : (
                          <span className="text-zinc-500 font-mono text-sm">
                              #{user.rankIndex + 1}
                            </span>
                        )}
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-white">
                            {user.full_name || 'Sin Nombre'}
                          </p>
                          {isSuspended ? (
                            <span className="text-[#ff2a1f] bg-[#ff2a1f]/10 border border-[#ff2a1f]/40 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest">
                                Suspendido
                              </span>
                          ) : (
                            <span className="text-[#00e5ff] bg-[#00e5ff]/10 border border-[#00e5ff]/40 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest">
                                Activo
                              </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 font-mono">{user.email}</p>
                      </td>
                      <td className="p-4 align-middle">
                        <p className="text-sm font-bold text-white">
                          {user.phone || 'Sin Telefono'}
                        </p>
                      </td>
                      <td className="p-4 align-middle text-right text-lg font-black text-white font-mono">
                        S/ {(user.balance || 0).toFixed(2)}
                      </td>
                      <td className="p-4 align-middle text-right text-lg font-black text-[#00e5ff] font-mono">
                        S/ {user.total_recharged.toFixed(2)}
                      </td>
                      <td className="p-4 align-middle text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              setBalanceModal({
                                isOpen: true,
                                mode: 'reward',
                                user,
                                amountValue: '',
                              })
                            }
                            className="px-3 py-2 bg-[#00e5ff]/10 border border-[#00e5ff]/40 hover:bg-[#00e5ff] text-[#00e5ff] hover:text-black transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 cursor-pointer"
                          >
                            <Trophy className="w-3 h-3" /> Premiar
                          </button>
                          <button
                            onClick={() =>
                              setBalanceModal({
                                isOpen: true,
                                mode: 'edit',
                                user,
                                amountValue: user.balance ?? 0,
                              })
                            }
                            className="px-3 py-2 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary text-zinc-300 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3" /> Editar Saldo
                          </button>
                          <button
                            onClick={() =>
                              setStatusModal({
                                isOpen: true,
                                user,
                                nextStatus: isSuspended ? 'active' : 'suspended',
                              })
                            }
                            disabled={processingId === user.id}
                            className={`px-3 py-2 border transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                              isSuspended
                                ? 'bg-[#00e5ff]/10 border-[#00e5ff]/40 hover:bg-[#00e5ff] text-[#00e5ff] hover:text-black'
                                : 'bg-[#ff2a1f]/10 border-[#ff2a1f]/40 hover:bg-[#ff2a1f] text-[#ff2a1f] hover:text-white'
                            }`}
                          >
                            {isSuspended ? (
                              <>
                                <CheckCircle2 className="w-3 h-3" /> Activar
                              </>
                            ) : (
                              <>
                                <Ban className="w-3 h-3" /> Suspender
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-[#110f16] border-2 border-white/20 overflow-x-auto shadow-[6px_6px_0px_#1f1a29] custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
            <tr className="bg-[#0a080d] border-b-2 border-primary">
              <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                Estado
              </th>
              <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                Fecha
              </th>
              <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                Cliente (Email)
              </th>
              <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-right">
                Monto
              </th>
              <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-center">
                Comprobante
              </th>
            </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
            {historyRequests.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-zinc-500 text-xs font-black uppercase tracking-widest"
                >
                  Aún no hay registros.
                </td>
              </tr>
            ) : (
              historyRequests.map((req) => (
                <tr key={req.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="p-4 align-middle">
                    {req.status === 'approved' ? (
                      <span className="text-[#00e5ff] bg-[#00e5ff]/10 border border-[#00e5ff]/40 px-2 py-1 text-[10px] font-black uppercase tracking-widest">
                          <Check className="w-3 h-3 inline mr-1" /> Aprobado
                        </span>
                    ) : (
                      <span className="text-[#ff2a1f] bg-[#ff2a1f]/10 border border-[#ff2a1f]/40 px-2 py-1 text-[10px] font-black uppercase tracking-widest">
                          <X className="w-3 h-3 inline mr-1" /> Rechazado
                        </span>
                    )}
                  </td>
                  <td className="p-4 align-middle text-xs font-mono text-zinc-300">
                    {new Date(req.created_at).toLocaleString()}
                  </td>
                  <td className="p-4 align-middle text-sm font-bold text-white">
                    {req.profiles?.email || 'Desconocido'}
                  </td>
                  <td className="p-4 align-middle text-right text-lg font-black text-primary font-mono">
                    S/ {req.amount.toFixed(2)}
                  </td>
                  <td className="p-4 align-middle text-center">
                    <a
                      href={req.receipt_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block p-2 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-zinc-400 hover:text-white"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </a>
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>
      )}

      {balanceModal.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
          <div
            className={`bg-[#110f16] border-2 p-6 w-full max-w-sm flex flex-col ${
              balanceModal.mode === 'reward'
                ? 'border-[#00e5ff] shadow-[8px_8px_0px_#0088cc]'
                : 'border-primary shadow-[8px_8px_0px_#ff2a1f]'
            }`}
          >
            <h3 className="text-xl font-black uppercase text-white mb-2 flex items-center gap-2">
              {balanceModal.mode === 'reward' ? (
                <>
                  <Trophy className="w-5 h-5 text-[#00e5ff]" /> Otorgar Premio
                </>
              ) : (
                <>
                  <Edit2 className="w-5 h-5 text-primary" /> Modificar Saldo
                </>
              )}
            </h3>
            <p className="text-xs text-zinc-400 font-mono mb-6 border-b-2 border-white/10 pb-4">
              {balanceModal.mode === 'reward'
                ? 'Se sumará saldo al usuario:'
                : 'Se reemplazará el saldo de:'}{' '}
              <br />
              <span
                className={`${balanceModal.mode === 'reward' ? 'text-[#00e5ff]' : 'text-primary'} font-bold`}
              >
                {balanceModal.user?.email}
              </span>{' '}
              <br />
              <span className="text-zinc-500 text-[10px]">
                Saldo actual: S/ {balanceModal.user?.balance?.toFixed(2) || '0.00'}
              </span>
            </p>

            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">
              {balanceModal.mode === 'reward' ? 'Monto a Sumar (S/)' : 'Nuevo Saldo Exacto (S/)'}
            </label>
            <input
              type="number"
              step="0.01"
              placeholder={balanceModal.mode === 'reward' ? 'Ej. 10 o -5' : 'Ej. 50.00'}
              value={balanceModal.amountValue}
              onChange={(e) => setBalanceModal({ ...balanceModal, amountValue: e.target.value })}
              className={`bg-black border-2 border-white/20 p-3 text-white font-mono text-xl focus:outline-none transition-colors mb-8 ${
                balanceModal.mode === 'reward' ? 'focus:border-[#00e5ff]' : 'focus:border-primary'
              }`}
            />

            <div className="flex gap-3 mt-auto">
              <button
                onClick={() =>
                  setBalanceModal({ isOpen: false, mode: 'reward', user: null, amountValue: '' })
                }
                className="flex-1 py-3 bg-transparent hover:bg-white/5 text-zinc-400 border-2 border-white/20 font-black text-[10px] uppercase tracking-widest transition-colors cursor-pointer"
              >
                CANCELAR
              </button>
              <button
                onClick={handleBalanceSubmit}
                disabled={processingId === balanceModal.user?.id}
                className={`flex-1 py-3 text-black border-2 font-black text-[10px] uppercase tracking-widest transition-colors flex justify-center items-center gap-2 disabled:opacity-50 cursor-pointer ${
                  balanceModal.mode === 'reward'
                    ? 'bg-[#00e5ff] hover:bg-white border-[#00e5ff]'
                    : 'bg-primary hover:bg-[#ffc42e] border-primary'
                }`}
              >
                {processingId === balanceModal.user?.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : balanceModal.mode === 'reward' ? (
                  'SUMAR SALDO'
                ) : (
                  'GUARDAR SALDO'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <Notification
        isVisible={notify.isVisible}
        message={notify.message}
        type={notify.type}
        onClose={() => setNotify((prev) => ({ ...prev, isVisible: false }))}
      />
      <ConfirmModal
        isOpen={modal.isOpen}
        title={modal.action === 'approve' ? 'Aprobar Saldo' : 'Rechazar Solicitud'}
        message={`¿Estás seguro de ${modal.action === 'approve' ? 'APROBAR' : 'RECHAZAR'} el pago de S/ ${modal.reqData?.amount.toFixed(2)}?`}
        confirmText={modal.action === 'approve' ? 'SÍ, APROBAR' : 'SÍ, RECHAZAR'}
        cancelText="CANCELAR"
        type={modal.action === 'approve' ? 'warning' : 'danger'}
        onConfirm={executeAction}
        onCancel={() => setModal({ isOpen: false, action: null, reqData: null })}
      />
      <ConfirmModal
        isOpen={statusModal.isOpen}
        title={statusModal.nextStatus === 'suspended' ? 'Suspender Usuario' : 'Activar Usuario'}
        message={`¿Estás seguro de ${statusModal.nextStatus === 'suspended' ? 'SUSPENDER' : 'ACTIVAR'} la cuenta de ${statusModal.user?.email}?`}
        confirmText={statusModal.nextStatus === 'suspended' ? 'SÍ, SUSPENDER' : 'SÍ, ACTIVAR'}
        cancelText="CANCELAR"
        type={statusModal.nextStatus === 'suspended' ? 'danger' : 'warning'}
        onConfirm={executeStatusChange}
        onCancel={() => setStatusModal({ isOpen: false, user: null, nextStatus: 'suspended' })}
      />
    </div>
  )
}