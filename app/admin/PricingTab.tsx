'use client';
import { useState } from 'react';
import { Gamepad2, AlertTriangle, Eye, EyeOff, Layers, Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Notification from '@/components/Notification';

interface PricingTabProps {
    games: any[];
    rawCatalog: any[];
    productConfigs: Record<string, any>;
    loadingConfig: boolean;
    selectedGameTab: string;
    setSelectedGameTab: (slug: string) => void;
    handlePriceChange: (code: string, field: string, value: any) => void;
    savePriceConfig: (code: string, gameSlug: string) => void;
    getCodeType: (name: string) => string;
    refreshConfigs: () => void;
}

export default function PricingTab({
                                       games, rawCatalog, productConfigs, loadingConfig, selectedGameTab, setSelectedGameTab, handlePriceChange, savePriceConfig, getCodeType, refreshConfigs
                                   }: PricingTabProps) {

    const [notify, setNotify] = useState({ isVisible: false, message: '', type: 'info' as 'success'|'error'|'info' });
    const [comboName, setComboName] = useState('');
    const [comboPrice, setComboPrice] = useState('');
    const [comboItems, setComboItems] = useState<string[]>([]);
    const [selectedNativeItem, setSelectedNativeItem] = useState('');

    const saveCombo = async (gameSlug: string) => {
        if (!comboName || !comboPrice || comboItems.length < 2) {
            return setNotify({ isVisible: true, message: 'Falta nombre, precio o al menos 2 paquetes.', type: 'error' });
        }

        const comboCode = `combo___${Date.now()}`;

        try {
            const { error } = await supabase.from('product_config').insert({
                product_code: comboCode,
                custom_name: comboName,
                price_pen: Number(comboPrice),
                is_active: true,
                game_slug: gameSlug,
                is_combo: true,
                combo_items: comboItems
            });

            if (error) throw error;
            setNotify({ isVisible: true, message: 'Combo creado exitosamente', type: 'success' });

            setComboName(''); setComboPrice(''); setComboItems([]);

            // AÑADIDO: Disparar recarga de datos para actualizar la UI instantáneamente
            refreshConfigs();

        } catch (error: any) {
            setNotify({ isVisible: true, message: 'Error al crear el combo', type: 'error' });
        }
    };

    const handleSavePrice = async (code: string, gameSlug: string) => {
        try {
            await savePriceConfig(code, gameSlug);
            setNotify({ isVisible: true, message: 'Precio actualizado en la tienda', type: 'success' });
        } catch (error) {
            setNotify({ isVisible: true, message: 'Error al guardar el precio', type: 'error' });
        }
    };

    return (
        <div className="animate-in fade-in flex flex-col md:flex-row gap-8 relative">
            <div className="w-full md:w-64 flex flex-col gap-3 shrink-0">
                <h2 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] mb-1 px-1 border-b-2 border-white/10 pb-3">Seleccionar Juego</h2>
                {games.map(game => (
                    <button
                        key={game.slug}
                        onClick={() => setSelectedGameTab(game.slug)}
                        className={`flex items-center gap-3 p-3 border-2 transition-all duration-200 text-left cursor-pointer ${
                            selectedGameTab === game.slug
                                ? 'bg-primary/10 border-primary text-white shadow-[5px_5px_0px_#ff2a1f] -translate-x-1 -translate-y-1'
                                : 'bg-[#110f16] border-white/20 text-zinc-400 shadow-[4px_4px_0px_#1f1a29] hover:text-white hover:border-primary hover:-translate-x-1 hover:-translate-y-1'
                        }`}
                    >
                        {game.image_url ? (
                            <img src={game.image_url} className="w-8 h-8 object-contain" alt="Icon" />
                        ) : (
                            <Gamepad2 className="w-6 h-6" />
                        )}
                        <span className="text-[10px] font-black uppercase tracking-widest truncate">{game.name || 'Sin Nombre'}</span>
                    </button>
                ))}
                {games.length === 0 && (
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] p-4 text-center border-2 border-dashed border-white/10 bg-[#110f16]">No hay juegos agregados.</p>
                )}
            </div>

            <div className="flex-1 bg-[#110f16] border-2 border-white/20 shadow-[6px_6px_0px_#1f1a29] relative min-w-0">
                <div className="absolute top-0 right-0 w-3 h-3 bg-[#00e5ff] z-10" />
                {loadingConfig ? (
                    <p className="text-primary text-xs font-black uppercase tracking-[0.3em] animate-pulse text-center py-20">Conectando con Codestore...</p>
                ) : (
                    <>
                        {games.map(game => {
                            if (game.slug !== selectedGameTab) return null;

                            const catalogData = rawCatalog.find(c => c.packageName === game.codestore_match);
                            if (!catalogData) return (
                                <div key={game.slug} className="p-10 text-center">
                                    <div className="inline-block bg-[#ff2a1f]/10 border-2 border-[#ff2a1f]/40 p-4 mb-4 -skew-x-6">
                                        <AlertTriangle className="w-10 h-10 text-[#ff2a1f] skew-x-6" />
                                    </div>
                                    <p className="text-zinc-300 text-sm font-bold">No se encontró el catálogo en Codestore.</p>
                                </div>
                            );

                            const combos = Object.values(productConfigs).filter(c => c.game_slug === game.slug && c.is_combo);

                            return (
                                <div key={game.slug} className="animate-in fade-in flex flex-col h-full">
                                    <div className="bg-[#0a080d] border-b-2 border-[#ff2a1f] p-6">
                                        <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter leading-none">{game.name}</h3>
                                    </div>

                                    <div className="overflow-x-auto p-4 custom-scrollbar">
                                        <h4 className="text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <Gamepad2 className="w-4 h-4 text-[#00e5ff]" /> Paquetes Oficiales
                                        </h4>
                                        <table className="w-full text-left mb-8">
                                            <thead>
                                            <tr className="border-b-2 border-white/15">
                                                <th className="pb-3 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Paquete</th>
                                                <th className="pb-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-center">Costo USD</th>
                                                <th className="pb-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary">Precio Venta (PEN)</th>
                                                <th className="pb-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-right pr-4">Acciones</th>
                                            </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/10">
                                            {catalogData.products.map((product: any) => {
                                                const code = `${getCodeType(product.name)}___${product.productId}___${product.sku}`;
                                                const config = productConfigs[code] || { price_pen: 0, is_active: true };

                                                return (
                                                    <tr key={code} className={`hover:bg-white/[0.03] transition-colors ${config.is_active ? '' : 'opacity-40 grayscale'}`}>
                                                        <td className="py-4 px-4 min-w-[200px]"><p className="text-xs font-black text-white uppercase tracking-widest">{product.name}</p></td>
                                                        <td className="py-4 text-center"><span className="bg-black/50 border border-white/10 text-zinc-300 px-3 py-1.5 text-[10px] font-mono">${product.price.toFixed(2)} USD</span></td>
                                                        <td className="py-4">
                                                            <div className="relative w-32">
                                                                <span className="absolute left-3 top-2.5 text-xs font-black text-zinc-500">S/</span>
                                                                <input type="number" value={config.price_pen} onChange={(e) => handlePriceChange(code, 'price_pen', e.target.value)} className="w-full bg-[#070609] border-2 border-white/15 pl-8 pr-3 py-2 text-sm font-black font-mono text-primary outline-none focus:border-primary transition-all" />
                                                            </div>
                                                        </td>
                                                        <td className="py-4 pr-4 text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <button onClick={() => handlePriceChange(code, 'is_active', !config.is_active)} className={`p-2 border-2 transition-colors cursor-pointer ${config.is_active ? 'text-[#00e5ff] border-[#00e5ff]/40 bg-[#00e5ff]/10' : 'text-zinc-500 border-white/10 hover:text-white'}`}>{config.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}</button>
                                                                <button onClick={() => handleSavePrice(code, game.slug)} className="bg-primary hover:bg-[#ffc42e] text-black border-2 border-black px-4 py-2 text-[10px] font-black uppercase tracking-widest cursor-pointer shadow-[3px_3px_0px_#ff2a1f] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#ff2a1f] transition-all">Guardar</button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            </tbody>
                                        </table>

                                        <div className="mt-12 border-t-2 border-white/10 pt-8">
                                            <h4 className="text-[11px] font-black text-primary uppercase tracking-widest mb-6 flex items-center gap-2">
                                                <Layers className="w-4 h-4" /> Combos Personalizados
                                            </h4>

                                            {combos.length > 0 && (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                                    {combos.map(combo => (
                                                        <div key={combo.product_code} className={`p-4 border-2 ${combo.is_active ? 'border-[#ffb703] bg-[#ffb703]/5' : 'border-white/10 opacity-50'} flex justify-between items-center`}>
                                                            <div>
                                                                <p className="font-black uppercase text-sm text-white">{combo.custom_name}</p>
                                                                <p className="text-[10px] text-zinc-500 font-mono mt-1">Inyecciones: {combo.combo_items?.length}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-black text-primary font-mono">S/ {combo.price_pen}</p>
                                                                <button onClick={() => handlePriceChange(combo.product_code, 'is_active', !combo.is_active)} className="text-[9px] uppercase tracking-widest text-zinc-400 hover:text-white mt-1 border-b border-zinc-600">Ocultar/Mostrar</button>
                                                                <button onClick={() => handleSavePrice(combo.product_code, game.slug)} className="text-[9px] uppercase tracking-widest text-[#00e5ff] ml-3 hover:text-white border-b border-[#00e5ff]/50 cursor-pointer">Guardar Estado</button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="bg-black/40 border border-white/10 p-5 shadow-inner">
                                                <p className="text-[10px] font-black uppercase text-zinc-400 mb-4">Crear Nuevo Combo</p>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                    <input type="text" placeholder="Nombre (Ej: 220 DIAMANTES)" value={comboName} onChange={e => setComboName(e.target.value)} className="bg-[#070609] border border-white/15 px-4 py-2 text-xs font-bold text-white outline-none focus:border-primary" />
                                                    <input type="number" placeholder="Precio en Soles (S/)" value={comboPrice} onChange={e => setComboPrice(e.target.value)} className="bg-[#070609] border border-white/15 px-4 py-2 text-xs font-black font-mono text-primary outline-none focus:border-primary" />
                                                    <button onClick={() => saveCombo(game.slug)} className="bg-[#ffb703] hover:bg-white text-black font-black text-[10px] uppercase tracking-widest border-2 border-black shadow-[3px_3px_0px_#ff2a1f] transition-all cursor-pointer">Guardar Combo Final</button>
                                                </div>

                                                <div className="flex flex-col md:flex-row gap-3 items-end p-4 border border-dashed border-white/20 bg-[#110f16]">
                                                    <div className="flex-1 w-full">
                                                        <label className="text-[10px] text-zinc-500 uppercase font-black block mb-2">Selecciona un paquete para sumar al combo:</label>
                                                        <select value={selectedNativeItem} onChange={e => setSelectedNativeItem(e.target.value)} className="w-full bg-[#070609] border border-white/15 px-3 py-2 text-xs font-bold text-white outline-none">
                                                            <option value="">-- Elige un paquete base --</option>
                                                            {catalogData.products.map((p: any) => (
                                                                <option key={p.sku} value={`${getCodeType(p.name)}___${p.productId}___${p.sku}`}>
                                                                    {p.name} (${p.price} USD)
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <button onClick={() => { if(selectedNativeItem) setComboItems([...comboItems, selectedNativeItem]) }} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase flex items-center gap-2 border border-white/20 h-9 cursor-pointer">
                                                        <Plus className="w-4 h-4" /> Añadir
                                                    </button>
                                                </div>

                                                {comboItems.length > 0 && (
                                                    <div className="mt-4 flex flex-wrap gap-2">
                                                        {comboItems.map((item, idx) => {
                                                            const [, , sku] = item.split('___');
                                                            const prodName = catalogData.products.find((p:any) => p.sku === sku)?.name || sku;
                                                            return (
                                                                <span key={idx} className="bg-primary/20 border border-primary/50 text-white text-[10px] font-black px-3 py-1 flex items-center gap-2 rounded-full">
                                                                    Inyección {idx + 1}: {prodName}
                                                                    <Trash2 className="w-3 h-3 text-[#ff2a1f] cursor-pointer hover:scale-125 transition-transform" onClick={() => setComboItems(comboItems.filter((_, i) => i !== idx))} />
                                                                </span>
                                                            )
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </>
                )}
            </div>

            <Notification
                isVisible={notify.isVisible}
                message={notify.message}
                type={notify.type}
                onClose={() => setNotify(prev => ({ ...prev, isVisible: false }))}
            />
        </div>
    );
}