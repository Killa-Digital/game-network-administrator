'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Download,
  Image as ImageIcon,
  Loader2,
  QrCode,
  ShieldCheck,
  Upload,
  Wallet,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function WalletPage() {
  const [amount, setAmount] = useState<number | ''>('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [balance, setBalance] = useState<number>(0)
  const [userId, setUserId] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'yape' | 'transferencia'>('yape')

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        const { data } = await supabase
          .from('profiles')
          .select('balance')
          .eq('id', user.id)
          .single()
        if (data) setBalance(data.balance)
      }
    }
    fetchUserData()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0]
      if (selected.size > 5 * 1024 * 1024) {
        setError('La imagen no puede pesar más de 5MB')
        return
      }
      setFile(selected)
      setError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || amount < 10) {
      setError('El monto mínimo de recarga es S/ 10.00')
      return
    }
    if (!file) {
      setError(
        `Debes adjuntar la captura ${paymentMethod === 'yape' ? 'del Yape' : 'de la transferencia'}`
      )
      return
    }
    if (!userId) {
      setError('Debes iniciar sesión para recargar saldo')
      return
    }

    setLoading(true)
    setError('')

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/${Date.now()}.${fileExt}`
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('receipts')
        .upload(fileName, file)

      if (uploadError) throw new Error('Error al subir la imagen')

      const {
        data: { publicUrl },
      } = supabase.storage.from('receipts').getPublicUrl(fileName)

      const { error: dbError } = await supabase.from('wallet_requests').insert([
        {
          user_id: userId,
          amount: Number(amount),
          receipt_url: publicUrl,
          status: 'pending',
        },
      ])

      if (dbError) throw new Error('Error al registrar la solicitud')

      const { data: userData } = await supabase.auth.getUser()
      fetch('/api/notify-recharge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(amount),
          userId,
          userEmail: userData?.user?.email,
        }),
      }).catch(console.error)

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado')
    } finally {
      setLoading(false)
    }
  }

  const downloadQR = () => {
    const link = document.createElement('a')
    link.href = '/qr-placeholder.jpeg'
    link.download = 'QR_Yape_Recargas.jpeg'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-[#070609] selection:bg-[#ff2a1f] selection:text-white font-sans bg-halftone pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-speedlines pointer-events-none z-0" />

      <div className="w-full bg-[#0c0a10] border-b-2 border-[#1f1a29] py-3 relative z-20">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Link
            href="/"
            className="group flex items-center text-[11px] font-black uppercase tracking-[0.22em] text-zinc-300 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-3 group-hover:-translate-x-2 transition-transform text-[#ff2a1f] stroke-[3]" />
            VOLVER AL INICIO
          </Link>
          <span className="hidden md:flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-zinc-300">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00e5ff]" />
            PAGOS 100% <strong className="text-[#00e5ff]">SEGUROS</strong>
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-12 relative z-10">
        <div className="mb-10 border-b-2 border-white/10 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#120e17] border-2 border-primary px-3 py-1 mb-4 -skew-x-12 shadow-[3px_3px_0px_#ffb703]">
              <span className="skew-x-12 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-white">
                <Wallet className="w-3.5 h-3.5 text-primary" />
                BILLETERA VIRTUAL
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
              RECARGAR <span className="text-primary">SALDO</span>
            </h1>
          </div>
          <div className="bg-[#110f16] border-2 border-white/20 p-4 shadow-[4px_4px_0px_#1f1a29] min-w-[200px]">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">
              Saldo Actual
            </p>
            <p className="text-3xl font-black text-white font-mono flex items-center gap-2">
              <span className="text-primary">S/</span> {balance.toFixed(2)}
            </p>
          </div>
        </div>

        {success ? (
          <div className="bg-[#110f16] border-2 border-[#00e5ff] p-10 md:p-16 flex flex-col items-center text-center shadow-[8px_8px_0px_#00e5ff]/30 animate-in fade-in zoom-in">
            <div className="bg-[#00e5ff]/10 border-2 border-[#00e5ff]/40 p-5 mb-6 -skew-x-6">
              <CheckCircle2 className="w-12 h-12 text-[#00e5ff] skew-x-6" />
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">
              ¡Depósito en Revisión!
            </h2>
            <p className="text-zinc-400 font-medium max-w-md mb-8">
              Hemos recibido tu captura. Un administrador validará el pago y tu saldo se actualizará
              en unos minutos para que puedas comprar diamantes al instante.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#110f16] border-2 border-white/20 p-8 shadow-[6px_6px_0px_#1f1a29] flex flex-col items-center text-center relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary" />

              {/* Selector de Método de Pago */}
              <div className="w-full flex gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('yape')}
                  className={`flex-1 py-3 text-[11px] font-black uppercase tracking-widest border-2 transition-all ${paymentMethod === 'yape' ? 'bg-[#00e5ff]/10 border-[#00e5ff] text-[#00e5ff]' : 'border-white/10 text-zinc-500 hover:border-white/30'}`}
                >
                  Por Yape
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('transferencia')}
                  className={`flex-1 py-3 text-[11px] font-black uppercase tracking-widest border-2 transition-all ${paymentMethod === 'transferencia' ? 'bg-[#00e5ff]/10 border-[#00e5ff] text-[#00e5ff]' : 'border-white/10 text-zinc-500 hover:border-white/30'}`}
                >
                  Transferencia
                </button>
              </div>

              {paymentMethod === 'yape' ? (
                <QrCode className="w-8 h-8 text-primary mb-3" />
              ) : (
                <CreditCard className="w-8 h-8 text-[#00e5ff] mb-3" />
              )}

              <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">
                {paymentMethod === 'yape' ? 'Escanea y Paga' : 'Transferencia Bancaria'}
              </h3>
              <p className="text-sm text-zinc-400 font-medium mb-6">
                Monto mínimo de recarga: <strong className="text-white">S/ 10.00</strong>
              </p>

              <div className="flex flex-col items-center mb-6">
                {paymentMethod === 'yape' ? (
                  <>
                    <div className="w-48 h-48 bg-white p-2 mb-3 shadow-[0_0_25px_rgba(255,183,3,0.15)] border-4 border-primary/20 group relative overflow-hidden">
                      <img
                        src="/qr-placeholder.jpeg"
                        alt="QR Yape"
                        className="w-full h-full object-cover"
                      />

                      <div
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm cursor-pointer"
                        onClick={downloadQR}
                      >
                        <Download className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {paymentMethod === 'yape' && (
                      <p className="text-sm font-black text-white tracking-wide mb-5">910233265</p>
                    )}

                    <button
                      onClick={downloadQR}
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#00e5ff] hover:text-white border-b border-[#00e5ff]/30 hover:border-white transition-colors pb-0.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Descargar QR
                    </button>
                  </>
                ) : (
                  <div className="w-48 h-48 bg-[#0c0a10] flex items-center justify-center mb-3 shadow-[0_0_25px_rgba(0,229,255,0.1)] border-4 border-[#00e5ff]/20">
                    <CreditCard className="w-16 h-16 text-[#00e5ff]" />
                  </div>
                )}
              </div>

              <div className="w-full bg-black/40 border border-white/10 p-4 mt-auto text-left">
                <div className="text-center mb-2">
                  <p className="text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-1">
                    Titular de la cuenta
                  </p>
                  <p className="text-sm font-black text-white tracking-wide">
                    Ivan Sambrano Mendoza Gonzales
                  </p>
                </div>

                {paymentMethod === 'transferencia' && (
                  <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                    <p className="text-[11px] text-zinc-400 font-mono leading-relaxed">
                      <strong className="text-[#00e5ff] font-sans text-[10px] uppercase tracking-widest block mb-0.5">
                        Mi número de cuenta BCP Soles es:
                      </strong>
                      <span className="text-white text-sm">19479710954013</span>
                    </p>
                    <p className="text-[11px] text-zinc-400 font-mono leading-relaxed">
                      <strong className="text-[#00e5ff] font-sans text-[10px] uppercase tracking-widest block mb-0.5">
                        Mi número de cuenta interbancaria es:
                      </strong>
                      <span className="text-white text-sm">00219417971095401398</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[#110f16] border-2 border-white/20 p-8 shadow-[6px_6px_0px_#1f1a29]">
              <form onSubmit={handleSubmit} className="flex flex-col h-full">
                <div className="mb-6">
                  <label className="block text-[11px] font-black text-zinc-400 mb-3 uppercase tracking-[0.25em]">
                    1. {paymentMethod === 'yape' ? 'Monto Yapeado' : 'Monto Transferido'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-black text-lg">
                      S/
                    </span>
                    <input
                      type="number"
                      min="10"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      placeholder="10.00"
                      className="w-full pl-12 pr-4 py-4 bg-[#070609] border-2 border-white/15 outline-none focus:border-primary focus:shadow-[4px_4px_0px_#ff2a1f] transition-all text-white font-black text-xl tracking-wider placeholder:text-zinc-700 font-mono"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="mb-8 flex-1">
                  <label className="block text-[11px] font-black text-zinc-400 mb-3 uppercase tracking-[0.25em]">
                    2. Captura de Pantalla
                  </label>
                  <label
                    className={`w-full h-40 border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${file ? 'border-primary bg-primary/5' : 'border-white/20 hover:border-white/40 bg-[#070609]'}`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                      disabled={loading}
                    />
                    {file ? (
                      <div className="text-center">
                        <CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-2" />
                        <p className="text-xs font-black text-white uppercase tracking-widest">
                          {file.name}
                        </p>
                        <p className="text-[10px] text-zinc-500 mt-1">Clic para cambiar</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                        <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">
                          SUBIR COMPROBANTE
                        </p>
                        <p className="text-[10px] text-zinc-600 mt-1">JPG o PNG (Máx 5MB)</p>
                      </div>
                    )}
                  </label>
                </div>

                {error && (
                  <div className="mb-6 p-4 border-2 border-[#ff2a1f] bg-[#ff2a1f]/10 flex items-start gap-3 shadow-[4px_4px_0px_#ff2a1f]">
                    <AlertCircle className="w-5 h-5 text-[#ff2a1f] shrink-0" />
                    <p className="text-[11px] font-black text-[#ff6b60] uppercase tracking-widest leading-tight mt-0.5">
                      {error}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !amount || !file}
                  className="group w-full inline-flex items-center justify-center gap-3 py-4 bg-primary hover:bg-[#ffc42e] text-black font-black text-sm uppercase tracking-[0.18em] border-2 border-black shadow-[6px_6px_0px_#ff2a1f] hover:shadow-[2px_2px_0px_#ff2a1f] hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:hover:shadow-[6px_6px_0px_#ff2a1f] disabled:hover:translate-x-0 disabled:hover:translate-y-0 cursor-pointer disabled:cursor-not-allowed mt-auto"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      ENVIAR VALIDACIÓN
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
