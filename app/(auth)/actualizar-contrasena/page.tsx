'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle2,
  Crosshair,
  Loader2,
  Lock,
  LogIn,
  Mail,
  XCircle,
} from 'lucide-react'

export default function ActualizarContrasenaPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const [sessionValid, setSessionValid] = useState(false)

  // Estados por si desea solicitar un nuevo enlace al expirar el actual
  const [resendEmail, setResendEmail] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handlePasswordRecoverySession = async () => {
      try {
        const hash = window.location.hash
        if (hash && hash.includes('type=recovery')) {
          const params = new URLSearchParams(hash.replace('#', '?'))
          const accessToken = params.get('access_token')
          const refreshToken = params.get('refresh_token')

          if (accessToken && refreshToken) {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            })
            if (error) throw error
          }
        }

        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          setSessionValid(true)
        } else {
          setError('El enlace de recuperación ha expirado o es inválido.')
        }
      } catch (err: any) {
        setError('Enlace inválido o expirado. Vuelve a solicitar la recuperación.')
      } finally {
        setVerifying(false)
      }
    }

    handlePasswordRecoverySession()
  }, [])

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error

      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'No se pudo actualizar la contraseña. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setResendLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resendEmail, {
        redirectTo: `${window.location.origin}/actualizar-contrasena`,
      })
      if (error) throw error
      setResendSuccess(true)
    } catch (err: any) {
      setError(err.message || 'No se pudo enviar el nuevo enlace.')
    } finally {
      setResendLoading(false)
    }
  }

  const inputClass =
    'w-full pl-4 pr-12 py-3.5 bg-[#070609] border-2 border-white/15 outline-none focus:border-primary focus:shadow-[4px_4px_0px_#ff2a1f] text-white font-black text-sm tracking-wide transition-all placeholder:text-zinc-700'

  if (verifying) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-zinc-400 text-xs font-black uppercase tracking-widest">
          Verificando enlace de seguridad...
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="mb-8">
        <div className="inline-flex items-center gap-3 bg-[#120e17] border-2 border-[#ff2a1f] px-4 py-1.5 mb-5 -skew-x-12 shadow-[4px_4px_0px_#ff2a1f]">
          <span className="skew-x-12 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-white">
            <Crosshair
              className="w-3.5 h-3.5 text-primary animate-spin"
              style={{ animationDuration: '8s' }}
            />
            SEGURIDAD — <span className="text-primary">ACTUALIZACIÓN</span>
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-[0.9] drop-shadow-[4px_4px_0px_#000000]">
          NUEVA <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2a1f] via-[#ff6b00] to-[#ffb703]">
            CONTRASEÑA
          </span>
        </h1>
      </div>

      {!sessionValid ? (
        /* VISTA SI EL ENLACE EXPIRÓ O NO HAY SESIÓN: Permite pedir uno nuevo aquí mismo */
        <div className="space-y-5">
          <div className="p-3 border-2 border-[#ff2a1f] bg-[#ff2a1f]/10 shadow-[4px_4px_0px_#ff2a1f] flex items-start gap-3">
            <XCircle className="w-4 h-4 text-[#ff2a1f] shrink-0 mt-0.5" />
            <p className="text-[10px] font-black text-[#ff6b60] uppercase tracking-widest leading-relaxed">
              {error || 'El enlace de recuperación no es válido o ya ha expirado.'}
            </p>
          </div>

          {resendSuccess ? (
            <div className="text-center py-4 bg-[#00e5ff]/10 border-2 border-[#00e5ff]/40 p-4">
              <CheckCircle2 className="w-6 h-6 text-[#00e5ff] mx-auto mb-2" />
              <p className="text-white text-xs font-black uppercase">
                ¡Nuevo enlace enviado con éxito!
              </p>
              <p className="text-zinc-400 text-[10px] mt-1">Revisa tu bandeja de entrada.</p>
            </div>
          ) : (
            <form onSubmit={handleResendLink} className="space-y-4 pt-2">
              <p className="text-zinc-400 text-xs font-medium">
                Ingresa tu correo para generarte un enlace nuevo y fresco:
              </p>
              <div>
                <label className="block text-[10px] font-black text-zinc-400 mb-2 uppercase tracking-[0.25em]">
                  CORREO ELECTRÓNICO
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    placeholder="usuario@ejemplo.com"
                    className={inputClass}
                  />
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                </div>
              </div>
              <button
                type="submit"
                disabled={resendLoading}
                className="group w-full py-4 bg-primary hover:bg-[#ffc42e] text-black font-black text-sm uppercase tracking-[0.18em] border-2 border-black shadow-[6px_6px_0px_#ff2a1f] hover:shadow-[2px_2px_0px_#ff2a1f] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {resendLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'SOLICITAR NUEVO ENLACE'
                )}
              </button>
            </form>
          )}
        </div>
      ) : success ? (
        /* VISTA DE ÉXITO AL CAMBIAR CLAVE */
        <div className="text-center py-6 animate-in fade-in">
          <div className="bg-[#00e5ff]/10 border-2 border-[#00e5ff]/40 p-4 mb-4 -skew-x-6 inline-flex">
            <CheckCircle2 className="w-8 h-8 text-[#00e5ff] skew-x-6" />
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-2">
            ¡Contraseña Actualizada!
          </h2>
          <p className="text-zinc-400 text-xs font-medium mb-6">
            Tu clave ha sido modificada con éxito. Redirigiendo al inicio de sesión...
          </p>
        </div>
      ) : (
        /* VISTA NORMAL DE CAMBIO DE CONTRASEÑA */
        <form onSubmit={handleUpdatePassword} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black text-zinc-400 mb-2 uppercase tracking-[0.25em]">
              NUEVA CONTRASEÑA
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-zinc-400 mb-2 uppercase tracking-[0.25em]">
              CONFIRMAR CONTRASEÑA
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
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
                ACTUALIZAR CONTRASEÑA
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
