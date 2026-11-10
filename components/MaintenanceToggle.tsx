'use client'
import { useState, useEffect } from 'react'
import { AlertTriangle, Power, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Notification from '@/components/Notification'

export default function MaintenanceToggle() {
  const [isMaintenance, setIsMaintenance] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notify, setNotify] = useState({
    isVisible: false,
    message: '',
    type: 'success' as 'success' | 'error',
  })

  useEffect(() => {
    const fetchStatus = async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('maintenance_mode')
        .eq('id', 1)
        .single()

      if (data) setIsMaintenance(data.maintenance_mode)
      setLoading(false)
    }
    fetchStatus()
  }, [])

  const toggleStatus = async () => {
    setSaving(true)
    const newValue = !isMaintenance

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maintenanceMode: newValue }),
      })
      const data = await res.json()

      if (data.success) {
        setIsMaintenance(newValue)
        setNotify({
          isVisible: true,
          message: newValue ? '¡Sitio en Mantenimiento!' : '¡Sitio Público y en Línea!',
          type: 'success',
        })
      } else {
        setNotify({ isVisible: true, message: data.error || 'Error al guardar', type: 'error' })
      }
    } catch (error) {
      setNotify({ isVisible: true, message: 'Error de conexión', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-[#110f16] border-2 border-white/20 p-4 flex items-center justify-center w-64 h-24">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
      </div>
    )
  }

  return (
    <div
      className={`border-2 p-5 relative overflow-hidden group transition-colors flex flex-col justify-between w-full max-w-sm shadow-[6px_6px_0px_#000000] ${
        isMaintenance ? 'bg-[#ff2a1f]/10 border-[#ff2a1f]' : 'bg-[#110f16] border-[#00e5ff]'
      }`}
    >
      <div
        className={`absolute top-0 right-0 w-3 h-3 ${isMaintenance ? 'bg-[#ff2a1f]' : 'bg-[#00e5ff]'}`}
      />

      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
            {isMaintenance ? (
              <AlertTriangle className="w-4 h-4 text-[#ff2a1f]" />
            ) : (
              <Power className="w-4 h-4 text-[#00e5ff]" />
            )}
            Estado del Sitio
          </h3>
          <p
            className={`text-xs font-mono mt-1 ${isMaintenance ? 'text-[#ff2a1f]' : 'text-zinc-400'}`}
          >
            {isMaintenance ? 'Bloqueado para clientes' : 'Público (Operativo)'}
          </p>
        </div>
      </div>

      <button
        onClick={toggleStatus}
        disabled={saving}
        className={`py-3 px-4 w-full font-black text-xs uppercase tracking-widest border-2 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer ${
          isMaintenance
            ? 'bg-transparent text-white border-[#ff2a1f] hover:bg-[#ff2a1f] shadow-[3px_3px_0px_#ff2a1f]'
            : 'bg-[#00e5ff] text-black border-[#00e5ff] hover:bg-white hover:border-white shadow-[3px_3px_0px_#0088cc]'
        }`}
      >
        {saving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isMaintenance ? (
          'APAGAR MANTENIMIENTO'
        ) : (
          'ACTIVAR MANTENIMIENTO'
        )}
      </button>

      <Notification
        isVisible={notify.isVisible}
        message={notify.message}
        type={notify.type}
        onClose={() => setNotify((prev) => ({ ...prev, isVisible: false }))}
      />
    </div>
  )
}
