'use client';
import { useEffect, useState } from 'react';
import { ShieldAlert, Check, X, Loader2, Image as ImageIcon, DollarSign, History, Inbox } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Notification from '@/components/Notification';
import ConfirmModal from '@/components/ConfirmModal';

interface WalletRequest {
    id: string;
    user_id: string;
    amount: number;
    receipt_url: string;
    status: string;
    created_at: string;
    profiles: { email: string, full_name: string, phone: string };
}

export default function WalletTab() {
    const [requests, setRequests] = useState<WalletRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'pending' | 'history'>('pending');
    const [notify, setNotify] = useState({ isVisible: false, message: '', type: 'info' as 'success'|'error'|'info' });
    const [modal, setModal] = useState<{ isOpen: boolean, action: 'approve'|'reject'|null, reqData: any }>({ isOpen: false, action: null, reqData: null });

    const fetchRequests = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('wallet_requests')
            .select('*, profiles(email, full_name, phone)')
            .order('created_at', { ascending: false });

        if (data) setRequests(data as any);
        setLoading(false);
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const requestAction = (req: WalletRequest, action: 'approve' | 'reject') => {
        setModal({ isOpen: true, action, reqData: req });
    };

    const executeAction = async () => {
        if (!modal.reqData || !modal.action) return;
        const { id, user_id, amount } = modal.reqData;
        const action = modal.action;

        setModal({ isOpen: false, action: null, reqData: null });
        setProcessingId(id);

        try {
            const res = await fetch('/api/admin/wallet/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestId: id, userId: user_id, amount, action })
            });
            const data = await res.json();

            if (data.success) {
                setRequests(requests.map(req => req.id === id ? { ...req, status: action === 'approve' ? 'approved' : 'rejected' } : req));
                setNotify({ isVisible: true, message: action === 'approve' ? 'Saldo aprobado con éxito' : 'Solicitud rechazada', type: 'success' });
            } else {
                setNotify({ isVisible: true, message: data.error || 'Ocurrió un error', type: 'error' });
            }
        } catch (error) {
            setNotify({ isVisible: true, message: 'Error de conexión', type: 'error' });
        } finally {
            setProcessingId(null);
        }
    };

    const pendingRequests = requests.filter(req => req.status === 'pending');
    const historyRequests = requests.filter(req => req.status !== 'pending');

    const totalIncome = requests.filter(req => req.status === 'approved').reduce((sum, req) => sum + req.amount, 0);

    return (
        <div className="w-full text-white animate-in fade-in">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-[#110f16] border-2 border-white/20 p-6 relative overflow-hidden group shadow-[6px_6px_0px_#1f1a29] hover:border-primary transition-colors">
                    <div className="absolute top-0 right-0 w-3 h-3 bg-primary" />
                    <div className="flex justify-between items-start mb-6">
                        <div className="bg-primary/15 border border-primary/40 p-3"><DollarSign className="w-6 h-6 text-primary" /></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">Yapes Aprobados (Ingreso Real)</span>
                    </div>
                    <p className="text-4xl font-black text-white tracking-tighter font-mono">S/ {totalIncome.toFixed(2)}</p>
                </div>
                <div className="bg-[#110f16] border-2 border-white/20 p-6 relative overflow-hidden group shadow-[6px_6px_0px_#1f1a29] hover:border-[#00e5ff] transition-colors">
                    <div className="absolute top-0 right-0 w-3 h-3 bg-[#00e5ff]" />
                    <div className="flex justify-between items-start mb-6">
                        <div className="bg-[#00e5ff]/15 border border-[#00e5ff]/40 p-3"><Inbox className="w-6 h-6 text-[#00e5ff]" /></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#00e5ff]">Bandeja Pendiente</span>
                    </div>
                    <p className="text-4xl font-black text-white tracking-tighter font-mono">{pendingRequests.length} <span className="text-sm font-sans text-zinc-500">solicitudes</span></p>
                </div>
            </div>

            <div className="flex items-center gap-4 mb-8 border-b-2 border-white/10 pb-5">
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
                    <History className="w-4 h-4" /> Historial de Depósitos
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
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
                            <div key={req.id} className="bg-[#110f16] border-2 border-white/20 shadow-[6px_6px_0px_#1f1a29] flex flex-col">
                                <div className="w-full h-64 bg-black border-b-2 border-white/10 overflow-hidden relative group">
                                    <img
                                        src={req.receipt_url}
                                        alt="Comprobante"
                                        className="w-full h-full object-contain cursor-pointer transition-transform group-hover:scale-110"
                                        onClick={() => window.open(req.receipt_url, '_blank')}
                                    />
                                    <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 text-[10px] font-mono border border-white/10 shadow-[2px_2px_0px_#ff2a1f]">Clic para ampliar</div>
                                </div>

                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Monto Solicitado</p>
                                            <p className="text-2xl font-black text-white font-mono text-primary">S/ {req.amount.toFixed(2)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Fecha</p>
                                            <p className="text-xs font-mono">{new Date(req.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="mb-6 bg-black/30 p-3 border border-white/5">
                                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Usuario (Email)</p>
                                        <p className="text-sm font-medium truncate">{req.profiles?.email || 'Usuario Desconocido'}</p>
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
                                            {processingId === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4 stroke-[3]" /> APROBAR</>}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            ) : (
                <div className="bg-[#110f16] border-2 border-white/20 overflow-x-auto shadow-[6px_6px_0px_#1f1a29] custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                        <tr className="bg-[#0a080d] border-b-2 border-[#ff2a1f]">
                            <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Estado</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Fecha</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Cliente (Email)</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Nombre</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Telefono</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-right">Monto</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-center">Comprobante</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                        {historyRequests.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-zinc-500 text-xs font-black uppercase tracking-widest">
                                    Aún no hay registros procesados.
                                </td>
                            </tr>
                        ) : (
                            historyRequests.map(req => (
                                <tr key={req.id} className="hover:bg-white/[0.03] transition-colors">
                                    <td className="p-4 align-middle">
                                        {req.status === 'approved'
                                            ? <span className="text-[#00e5ff] bg-[#00e5ff]/10 border border-[#00e5ff]/40 px-2 py-1 text-[10px] font-black uppercase tracking-widest"><Check className="w-3 h-3 inline mr-1" /> Aprobado</span>
                                            : <span className="text-[#ff2a1f] bg-[#ff2a1f]/10 border border-[#ff2a1f]/40 px-2 py-1 text-[10px] font-black uppercase tracking-widest"><X className="w-3 h-3 inline mr-1" /> Rechazado</span>
                                        }
                                    </td>
                                    <td className="p-4 align-middle text-xs font-mono text-zinc-300">
                                        {new Date(req.created_at).toLocaleString()}
                                    </td>
                                    <td className="p-4 align-middle text-sm font-bold text-white">
                                        {req.profiles?.email || 'Desconocido'}
                                    </td>
                                    <td className="p-4 align-middle text-sm font-bold text-white">
                                        {req.profiles?.full_name || 'Desconocido'}
                                    </td>
                                    <td className="p-4 align-middle text-sm font-bold text-white">
                                        {req.profiles?.phone || 'Desconocido'}
                                    </td>
                                    <td className="p-4 align-middle text-right text-lg font-black text-primary font-mono">
                                        S/ {req.amount.toFixed(2)}
                                    </td>
                                    <td className="p-4 align-middle text-center">
                                        <a href={req.receipt_url} target="_blank" rel="noreferrer" className="inline-block p-2 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-zinc-400 hover:text-white">
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
            <Notification
                isVisible={notify.isVisible}
                message={notify.message}
                type={notify.type}
                onClose={() => setNotify(prev => ({ ...prev, isVisible: false }))}
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
        </div>
    );
}