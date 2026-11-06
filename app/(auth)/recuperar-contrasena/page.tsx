'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Crosshair, Loader2, LogIn, Mail, XCircle } from 'lucide-react'

export default function RecuperarContrasenaPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/actualizar-contrasena`,
      })
      if (error) throw error
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'No se pudo enviar el correo de recuperación.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full pl-4 pr-12 py-3.5 bg-[#070609] border-2 border-white/15 outline-none focus:border-primary focus:shadow-[4px_4px_0px_#ff2a1f] text-white font-black text-sm tracking-wide transition-all placeholder:text-zinc-700'

  return (
    <>
      <div className="mb-8">
        <div className="inline-flex items-center gap-3 bg-[#120e17] border-2 border-[#ff2a1f] px-4 py-1.5 mb-5 -skew-x-12 shadow-[4px_4px_0px_#ff2a1f]">
          <span className="skew-x-12 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-white">
            <Crosshair
              className="w-3.5 h-3.5 text-primary animate-spin"
              style={{ animationDuration: '8s' }}
            />
            SOPORTE — <span className="text-primary">RECUPERACIÓN</span>
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-[0.9] drop-shadow-[4px_4px_0px_#000000]">
          RECUPERAR <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2a1f] via-[#ff6b00] to-[#ffb703]">
            CONTRASEÑA
          </span>
        </h1>
      </div>

      {submitted ? (
        <div className="text-center py-6 animate-in fade-in">
          <div className="bg-[#00e5ff]/10 border-2 border-[#00e5ff]/40 p-4 mb-4 -skew-x-6 inline-flex">
            <CheckCircle2 className="w-8 h-8 text-[#00e5ff] skew-x-6" />
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-2">
            ¡Correo Enviado!
          </h2>
          <p className="text-zinc-400 text-xs font-medium mb-6">
            Hemos enviado las instrucciones a <strong className="text-white">{email}</strong> para
            que puedas restablecer tu acceso.
          </p>
        </div>
      ) : (
        <form onSubmit={handleResetRequest} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black text-zinc-400 mb-2 uppercase tracking-[0.25em]">
              CORREO ELECTRÓNICO REGISTRADO
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@ejemplo.com"
                className={inputClass}
              />
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
            </div>
          </div>

          {error && (
            <div className="p-3 border-2 border-[#ff2a1f] bg-[#ff2a1f]/10 shadow-[4px_4px_0px_#ff2a1f] flex items-start gap-3">
              <XCircle className="w-4 h-4 text-[#ff2a1f] shrink-0 mt-0.5" />
              <p className="text-[10px] font-black text-[#ff6b60] uppercase tracking-widest leading-relaxed">
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group w-full mt-2 py-4 bg-primary hover:bg-[#ffc42e] text-black font-black text-sm uppercase tracking-[0.18em] border-2 border-black shadow-[6px_6px_0px_#ff2a1f] hover:shadow-[2px_2px_0px_#ff2a1f] hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:shadow-[6px_6px_0px_#ff2a1f] disabled:hover:translate-x-0 disabled:hover:translate-y-0 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                ENVIAR ENLACE DE ACCESO
                <ArrowRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      )}

      <div className="-mx-8 -mb-8 md:-mx-10 md:-mb-10 mt-8 bg-[#0a080d] p-5 border-t-2 border-white/10 flex flex-col items-center justify-center">
        <Link
          href="/login"
          className="text-[10px] font-black text-zinc-400 hover:text-primary transition-colors uppercase tracking-[0.22em] flex items-center gap-2 cursor-pointer"
        >
          <LogIn className="w-3.5 h-3.5 text-[#ff2a1f]" />[ VOLVER AL INICIO DE SESIÓN ]
        </Link>
      </div>
    </>
  )
}
