'use client';
import {useState} from 'react';
import {supabase} from '@/lib/supabase';
import {useRouter} from 'next/navigation';
import {ArrowRight, Crosshair, Loader2, Lock, Mail, ShieldCheck, XCircle, Zap} from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                alert('¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.');
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                router.push('/');
            }
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error. Verifica tus credenciales.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${baseUrl}/` }
        });
    };

    const inputClass =
        'w-full pl-4 pr-12 py-3.5 bg-[#070609] border-2 border-white/15 outline-none focus:border-primary focus:shadow-[4px_4px_0px_#ff2a1f] text-white font-black text-sm tracking-wide transition-all placeholder:text-zinc-700';

    return (
        <div className="min-h-screen bg-[#070609] flex flex-col items-center justify-center relative overflow-hidden px-4 py-12 font-sans selection:bg-[#ff2a1f] selection:text-white bg-halftone">

            <div className="absolute inset-0 bg-speedlines pointer-events-none z-0" />

            <div className="absolute -top-4 left-4 lg:left-10 z-0 pointer-events-none select-none overflow-hidden">
                <span className="text-[6rem] sm:text-[10rem] lg:text-[14rem] font-black uppercase tracking-tighter leading-none text-stroke-subtle block">
                    ACCESO
                </span>
            </div>


            <div className="relative z-10 w-full max-w-[440px]">

                <div className="flex justify-center mb-8">
                    <img src="/logo.png" alt="IM Shop" className="h-16 drop-shadow-[0_0_15px_rgba(255,42,31,0.35)]" />
                </div>

                <div className="bg-[#110f16] border-2 border-[#ff2a1f] flex flex-col relative overflow-hidden shadow-[8px_8px_0px_#ff2a1f]">

                    <div className="absolute top-0 right-0 w-3 h-3 bg-primary" />

                    <div className="p-8 md:p-10">
                        <div className="mb-8">
                            <div className="inline-flex items-center gap-3 bg-[#120e17] border-2 border-[#ff2a1f] px-4 py-1.5 mb-5 -skew-x-12 shadow-[4px_4px_0px_#ff2a1f]">
                                <span className="skew-x-12 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-white">
                                    <Crosshair className="w-3.5 h-3.5 text-primary animate-spin" style={{ animationDuration: '8s' }} />
                                    ACCESO — <span className="text-primary">RESTRINGIDO</span>
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-[0.9] drop-shadow-[4px_4px_0px_#000000]">
                                IDENTIFICACIÓN <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2a1f] via-[#ff6b00] to-[#ffb703]">
                                    REQUERIDA
                                </span>
                            </h1>
                        </div>

                        <button
                            onClick={handleGoogleLogin}
                            className="w-full mb-8 py-4 bg-[#070609] border-2 border-white/20 text-white font-black text-xs uppercase tracking-[0.18em] shadow-[4px_4px_0px_#1f1a29] hover:bg-white hover:text-black hover:border-black hover:shadow-[4px_4px_0px_#ff2a1f] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-3 group cursor-pointer"
                        >
                            <svg className="w-4 h-4 group-hover:hidden" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <svg className="w-4 h-4 hidden group-hover:block" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            AUTENTICAR CON GOOGLE
                        </button>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex-1 h-0.5 bg-white/10" />
                            <span className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.3em]">Credenciales</span>
                            <div className="flex-1 h-0.5 bg-white/10" />
                        </div>

                        <form onSubmit={handleEmailAuth} className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-black text-zinc-400 mb-2 uppercase tracking-[0.25em]">
                                    CORREO ELECTRÓNICO
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

                            <div>
                                <label className="block text-[10px] font-black text-zinc-400 mb-2 uppercase tracking-[0.25em]">
                                    CONTRASEÑA DE ACCESO
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
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        {isSignUp ? 'CREAR CUENTA NUEVA' : 'INICIAR SESIÓN'}
                                        <ArrowRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="bg-[#0a080d] p-5 border-t-2 border-white/10 flex flex-col items-center justify-center">
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-[10px] font-black text-zinc-400 hover:text-primary transition-colors uppercase tracking-[0.22em] flex items-center gap-2 cursor-pointer"
                        >
                            <Zap className="w-3 h-3 text-[#ff2a1f]" />
                            {isSignUp ? '[ CAMBIAR A MODO INGRESO ]' : '[ SOLICITAR REGISTRO ]'}
                        </button>
                    </div>

                </div>

                <div className="mt-6 flex justify-center items-center gap-2 text-zinc-500 text-[9px] font-black uppercase tracking-[0.22em]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#00e5ff]" /> Portal protegido por encriptación de 256 bits
                </div>
            </div>
        </div>
    );
}