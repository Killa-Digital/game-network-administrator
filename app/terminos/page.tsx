import Link from 'next/link';
import { ArrowLeft, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function TerminosPage() {
    return (
        <div className="min-h-screen bg-[#070609] selection:bg-[#ff2a1f] selection:text-white font-sans bg-halftone pb-24">

            {/* Cabecera minimalista */}
            <div className="border-b border-white/10 bg-[#0c0a10] sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center">
                    <Link href="/" className="flex items-center gap-3 text-xs font-black text-zinc-400 hover:text-primary transition-colors uppercase tracking-[0.2em]">
                        <ArrowLeft className="w-4 h-4" /> Volver a la Tienda
                    </Link>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 mt-12 md:mt-16 relative z-10">

                {/* Título de la página */}
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 bg-[#ff2a1f]/15 border border-[#ff2a1f] px-3 py-1 mb-4 -skew-x-12">
                        <Shield className="w-4 h-4 text-[#ff2a1f] skew-x-12" />
                        <span className="skew-x-12 text-[#ff2a1f] font-black uppercase tracking-[0.25em] text-[10px]">
                            INFORMACIÓN LEGAL
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
                        Términos y <span className="text-primary">Condiciones</span>
                    </h1>
                    <p className="text-zinc-400 text-sm font-mono tracking-wide">
                        Última actualización: {new Date().toLocaleDateString('es-PE')}
                    </p>
                </div>

                {/* Contenido Legal */}
                <div className="bg-[#110f16] border-2 border-white/10 p-6 md:p-10 text-zinc-300 space-y-8 shadow-[8px_8px_0px_#000000]">

                    <section>
                        <h2 className="text-xl font-black text-white uppercase tracking-widest mb-4 flex items-center gap-3">
                            <span className="w-2 h-2 bg-primary" /> 1. Naturaleza del Servicio
                        </h2>
                        <p className="text-sm leading-relaxed mb-3">
                            <strong>IM SHOP</strong> es una plataforma digital dedicada exclusivamente a la comercialización de bienes intangibles, específicamente recargas de saldo virtual, diamantes, pases y membresías para videojuegos multiplataforma.
                        </p>
                        <p className="text-sm leading-relaxed text-[#00e5ff] font-bold bg-[#00e5ff]/10 p-3 border-l-2 border-[#00e5ff]">
                            No comercializamos bienes físicos, consolas, discos ni periféricos. Todos nuestros productos son 100% digitales.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-white uppercase tracking-widest mb-4 flex items-center gap-3">
                            <span className="w-2 h-2 bg-[#ff2a1f]" /> 2. Política de Entrega y Envíos
                        </h2>
                        <p className="text-sm leading-relaxed mb-3">
                            Al tratarse de bienes digitales, <strong>NO existen envíos físicos mediante couriers ni tiempos de tránsito logístico</strong>.
                        </p>
                        <ul className="space-y-3 text-sm mt-4">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                <span><strong>Inyección Directa:</strong> La entrega se realiza mediante un proceso automatizado (API) que inyecta el saldo virtual directamente a la cuenta del usuario utilizando su Player ID.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                <span><strong>Tiempos de Entrega:</strong> El proceso toma desde unos pocos segundos hasta un máximo de 24 horas hábiles tras la confirmación del pago en nuestra pasarela.</span>
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-white uppercase tracking-widest mb-4 flex items-center gap-3">
                            <span className="w-2 h-2 bg-primary" /> 3. Política de Devoluciones y Reembolsos
                        </h2>
                        <div className="bg-[#ff2a1f]/10 border border-[#ff2a1f]/30 p-4 mb-4">
                            <p className="text-sm leading-relaxed text-white font-bold flex items-center gap-2 mb-2">
                                <AlertTriangle className="w-5 h-5 text-[#ff2a1f]" /> Excepción de Desistimiento
                            </p>
                            <p className="text-sm leading-relaxed text-zinc-300">
                                Debido a la naturaleza de los productos digitales intangibles, los cuales se consumen y vinculan irreversiblemente a una cuenta de juego de terceros en el momento exacto de la inyección, <strong>TODAS LAS VENTAS SON FINALES</strong>. No se emiten reembolsos, devoluciones ni cambios una vez que la orden ha sido procesada con éxito.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-white uppercase tracking-widest mb-4 flex items-center gap-3">
                            <span className="w-2 h-2 bg-primary" /> 4. Responsabilidad del Usuario
                        </h2>
                        <p className="text-sm leading-relaxed mb-3">
                            Es responsabilidad absoluta y exclusiva del cliente ingresar correctamente su <strong>Player ID</strong> al momento de realizar la compra.
                        </p>
                        <p className="text-sm leading-relaxed">
                            IM SHOP utiliza validaciones previas para confirmar el apodo (nickname) del usuario, sin embargo, si el cliente aprueba la compra hacia un ID equivocado que resultó ser válido, el saldo será transferido a esa cuenta y no se podrá revertir la transacción ni exigir compensación alguna.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-white uppercase tracking-widest mb-4 flex items-center gap-3">
                            <span className="w-2 h-2 bg-primary" /> 5. Prevención de Fraude
                        </h2>
                        <p className="text-sm leading-relaxed">
                            Todas las transacciones son procesadas a través de pasarelas de pago reguladas. IM SHOP se reserva el derecho de cancelar cualquier orden, reembolsar el dinero de manera automática y bloquear preventivamente a usuarios si los sistemas de riesgo detectan actividad sospechosa, uso de tarjetas no autorizadas o intentos de fraude.
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
}