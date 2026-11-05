'use client';
import { DollarSign, CheckCircle, AlertTriangle, RefreshCcw, Filter } from 'lucide-react';

interface OrdersTabProps {
    orders: any[];
    loading: boolean;
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    showOnlyFailed: boolean;
    setShowOnlyFailed: (val: boolean) => void;
    fetchOrders: () => void;
}

export default function OrdersTab({
                                      orders, loading, searchTerm, setSearchTerm, showOnlyFailed, setShowOnlyFailed, fetchOrders
                                  }: OrdersTabProps) {
    const totalIncome = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + (o.price || 0), 0);
    const failedOrders = orders.filter(o => o.status === 'failed_injection');
    const successfulOrders = orders.filter(o => o.status === 'completed');

    const filteredOrders = orders.filter(o => {
        const matchesSearch = o.player_id?.includes(searchTerm) || o.nickname?.toLowerCase().includes(searchTerm.toLowerCase()) || o.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) || o.id.includes(searchTerm);
        const matchesStatus = showOnlyFailed ? o.status === 'failed_injection' : true;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-[#110f16] border-2 border-white/20 p-6 relative overflow-hidden group shadow-[6px_6px_0px_#1f1a29] hover:border-primary transition-colors">
                    <div className="absolute top-0 right-0 w-3 h-3 bg-primary" />
                    <div className="flex justify-between items-start mb-6">
                        <div className="bg-primary/15 border border-primary/40 p-3"><DollarSign className="w-6 h-6 text-primary" /></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">Saldo Usado</span>
                    </div>
                    <p className="text-4xl font-black text-white tracking-tighter font-mono">S/ {totalIncome.toFixed(2)}</p>
                </div>
                <div className="bg-[#110f16] border-2 border-white/20 p-6 relative overflow-hidden group shadow-[6px_6px_0px_#1f1a29] hover:border-[#00e5ff] transition-colors">
                    <div className="absolute top-0 right-0 w-3 h-3 bg-[#00e5ff]" />
                    <div className="flex justify-between items-start mb-6">
                        <div className="bg-[#00e5ff]/15 border border-[#00e5ff]/40 p-3"><CheckCircle className="w-6 h-6 text-[#00e5ff]" /></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#00e5ff]">Recargas Exitosas</span>
                    </div>
                    <p className="text-4xl font-black text-white tracking-tighter font-mono">{successfulOrders.length}</p>
                </div>
                <div className="bg-[#110f16] border-2 border-[#ff2a1f] p-6 relative overflow-hidden group shadow-[6px_6px_0px_#ff2a1f]">
                    <div className="absolute top-0 right-0 w-3 h-3 bg-[#ff2a1f]" />
                    <div className="flex justify-between items-start mb-6">
                        <div className="bg-[#ff2a1f]/15 border border-[#ff2a1f]/50 p-3"><AlertTriangle className="w-6 h-6 text-[#ff2a1f]" /></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ff2a1f]">Alertas Inyección</span>
                    </div>
                    <p className="text-4xl font-black text-[#ff2a1f] tracking-tighter font-mono">{failedOrders.length}</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 border-b-2 border-white/10 pb-5">
                <button onClick={fetchOrders} className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-300 hover:text-primary transition-colors cursor-pointer w-fit">
                    <RefreshCcw className={`w-4 h-4 text-[#ff2a1f] ${loading ? 'animate-spin' : ''}`} /> Actualizar tabla
                </button>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <button
                        onClick={() => setShowOnlyFailed(!showOnlyFailed)}
                        className={`px-4 py-3 text-[10px] font-black uppercase tracking-widest border-2 transition-all cursor-pointer ${
                            showOnlyFailed
                                ? 'bg-[#ff2a1f] text-white border-[#ff2a1f] shadow-[2px_2px_0px_#ffb703]'
                                : 'text-zinc-400 border-white/15 hover:text-white hover:border-white/40'
                        }`}
                    >
                        <Filter className="w-4 h-4 inline-block mr-2" /> Fallidos
                    </button>
                    <input
                        type="text"
                        placeholder="Buscar ID, correo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-64 px-4 py-3 bg-[#070609] border-2 border-white/15 text-xs font-bold text-white outline-none focus:border-primary focus:shadow-[3px_3px_0px_#ff2a1f] transition-all placeholder:text-zinc-600"
                    />
                </div>
            </div>

            <div className="bg-[#110f16] border-2 border-white/20 overflow-x-auto shadow-[6px_6px_0px_#1f1a29] custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                    <tr className="bg-[#0a080d] border-b-2 border-[#ff2a1f]">
                        <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Estado</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Fecha/ID</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Cliente</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Cuenta</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-right">Monto</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                    {filteredOrders.map(order => (
                        <tr key={order.id} className="hover:bg-white/[0.03] transition-colors">
                            <td className="p-4 align-top">
                                {order.status === 'completed' && <span className="text-[#00e5ff] bg-[#00e5ff]/10 border border-[#00e5ff]/40 px-2 py-1 text-[10px] font-black uppercase tracking-widest"><CheckCircle className="w-3 h-3 inline mr-1" /> Completado</span>}
                                {order.status === 'failed_injection' && <span className="text-white bg-[#ff2a1f] border border-black px-2 py-1 text-[10px] font-black uppercase tracking-widest animate-pulse"><AlertTriangle className="w-3 h-3 inline mr-1" /> Falló API</span>}
                                {order.status !== 'completed' && order.status !== 'failed_injection' && <span className="text-primary bg-primary/10 border border-primary/40 px-2 py-1 text-[10px] font-black uppercase tracking-widest">Pendiente</span>}
                            </td>
                            <td className="p-4 align-top">
                                <p className="text-xs font-black text-white mb-1">{new Date(order.created_at).toLocaleDateString()}</p>
                                <p className="text-[10px] text-zinc-500 font-mono">ID: {order.id.split('-')[0]}</p>
                            </td>
                            <td className="p-4 align-top">
                                <p className="text-xs font-bold text-white">{order.user_email || 'No registrado'}</p>
                            </td>
                            <td className="p-4 align-top">
                                <p className="text-sm font-black text-white uppercase tracking-tight">{order.nickname}</p>
                                <p className="text-[10px] text-zinc-500 font-mono">ID: {order.player_id}</p>
                            </td>
                            <td className="p-4 align-top text-right">
                                <p className="text-lg font-black text-primary font-mono">S/ {order.price?.toFixed(2)}</p>
                                <span className="text-[9px] text-zinc-500 uppercase tracking-widest">{order.product_code.split('___')[0]}</span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}