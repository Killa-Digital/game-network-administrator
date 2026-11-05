'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { LogIn, LogOut, Wallet, ShieldAlert, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ADMIN_EMAILS = ['chaos40021@gmail.com'];

export default function AuthButton() {
    const [user, setUser] = useState<any>(null);
    const [balance, setBalance] = useState<number>(0);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async (sessionUser: any) => {
            if (!sessionUser) {
                setUser(null);
                setBalance(0);
                setIsAdmin(false);
                return;
            }

            setUser(sessionUser);
            setIsAdmin(sessionUser.email ? ADMIN_EMAILS.includes(sessionUser.email) : false);

            const { data } = await supabase
                .from('profiles')
                .select('balance')
                .eq('id', sessionUser.id)
                .single();

            if (data) {
                setBalance(data.balance);
            }
        };

        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            fetchUserData(session?.user);
        };
        checkSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            fetchUserData(session?.user);
        });

        return () => authListener.subscription.unsubscribe();
    }, []);

    const handleLogin = async () => {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${baseUrl}/`
            }
        });
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    if (user) {
        return (
            <div className="flex items-center gap-2 md:gap-3">

                {isAdmin && (
                    <Link href="/admin" className="group flex items-center gap-2 bg-[#110f16] border-2 border-white/15 hover:border-[#ffb703] px-3 md:px-4 py-2 -skew-x-12 transition-all duration-150 shadow-[3px_3px_0px_#1f1a29] hover:shadow-[4px_4px_0px_#ffb703]">
                        <ShieldAlert className="w-4 h-4 text-[#ffb703] skew-x-12" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-[#ffb703] hidden lg:block skew-x-12">
                            ADMIN
                        </span>
                    </Link>
                )}

                <Link href="/wallet" className="group flex items-center gap-2 bg-[#110f16] border-2 border-white/15 hover:border-[#00e5ff] px-3 md:px-4 py-2 -skew-x-12 transition-all duration-150 shadow-[3px_3px_0px_#1f1a29] hover:shadow-[4px_4px_0px_#00e5ff]">
                    <Wallet className="w-4 h-4 text-[#00e5ff] skew-x-12" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-zinc-300 group-hover:text-white hidden sm:block skew-x-12">
                        S/ {balance.toFixed(2)}
                    </span>
                </Link>

                <Link href="/perfil" className="group flex items-center gap-2 bg-[#110f16] border-2 border-white/15 hover:border-primary px-3 md:px-4 py-2 -skew-x-12 transition-all duration-150 shadow-[3px_3px_0px_#1f1a29] hover:shadow-[4px_4px_0px_#ff2a1f]">
                    <User className="w-4 h-4 text-[#ff2a1f] skew-x-12" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-zinc-300 group-hover:text-white hidden sm:block skew-x-12">
                        PERFIL
                    </span>
                </Link>

                <button
                    onClick={handleLogout}
                    className="p-2 ml-1 text-zinc-500 hover:text-[#ff2a1f] hover:bg-[#ff2a1f]/10 transition-all border border-transparent hover:border-[#ff2a1f]/30"
                    title="Cerrar sesión"
                >
                    <LogOut className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={handleLogin}
            className="group flex items-center gap-2 bg-[#110f16] border-2 border-white/15 hover:border-primary px-5 py-2 -skew-x-12 transition-all duration-150 hover:-translate-y-0.5 shadow-[3px_3px_0px_#1f1a29] hover:shadow-[4px_4px_0px_#ff2a1f]"
        >
            <LogIn className="w-4 h-4 skew-x-12" />
            <span className="skew-x-12 text-[11px] font-black uppercase tracking-widest text-zinc-300 group-hover:text-white">Ingresar</span>
        </button>
    );
}