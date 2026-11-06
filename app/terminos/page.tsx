import Link from 'next/link'
import { AlertTriangle, ArrowLeft, CheckCircle2, Shield, Wallet } from 'lucide-react'

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-[#070609] selection:bg-[#ff2a1f] selection:text-white font-sans bg-halftone pb-24">
      <div className="border-b border-white/10 bg-[#0c0a10] sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center">
          <Link
            href="/"
            className="flex items-center gap-3 text-xs font-black text-zinc-400 hover:text-primary transition-colors uppercase tracking-[0.2em]"
          >
            <ArrowLeft className="w-4 h-4" /> Volver a la Tienda
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-12 md:mt-16 relative z-10">
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
              <strong>IM SHOP</strong> es una plataforma digital dedicada exclusivamente a la
              comercialización y distribución de bienes intangibles, específicamente recargas de
              saldo virtual, diamantes, pases, fragmentos y membresías para videojuegos
              multiplataforma.
            </p>
            <p className="text-sm leading-relaxed text-[#00e5ff] font-bold bg-[#00e5ff]/10 p-3 border-l-2 border-[#00e5ff]">
              No comercializamos bienes físicos, consolas, discos ni periféricos. Todos nuestros
              productos son 100% digitales y se vinculan directamente a las cuentas de los usuarios.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-4 flex items-center gap-3">
              <Wallet className="w-5 h-5 text-primary" /> 2. Billetera Virtual y Pagos
            </h2>
            <p className="text-sm leading-relaxed mb-3">
              Nuestra plataforma opera mediante un sistema de <strong>Billetera Virtual</strong>.
              Los usuarios pueden recargar saldo en su cuenta de IM SHOP mediante métodos de pago
              aprobados (ej. transferencias, billeteras móviles) sujeto a verificación.
            </p>
            <ul className="space-y-3 text-sm mt-4 list-disc pl-5 text-zinc-400">
              <li>
                El saldo de la Billetera Virtual es personal, intransferible y no puede ser canjeado
                por dinero en efectivo.
              </li>
              <li>
                Las recargas de saldo están sujetas a revisión manual. El usuario debe proporcionar
                los comprobantes correspondientes cuando el sistema lo requiera.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-4 flex items-center gap-3">
              <span className="w-2 h-2 bg-[#ff2a1f]" /> 3. Política de Entrega y Envíos
            </h2>
            <p className="text-sm leading-relaxed mb-3">
              Al tratarse de bienes digitales,{' '}
              <strong>
                NO existen envíos físicos mediante couriers ni tiempos de tránsito logístico
              </strong>
              .
            </p>
            <ul className="space-y-4 text-sm mt-4">
              <li className="flex items-start gap-3 bg-white/5 p-3 border border-white/10">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <span>
                  <strong className="text-white">
                    Productos Automatizados (Diamantes y Pases):
                  </strong>{' '}
                  La entrega se realiza mediante un proceso automatizado (API) que inyecta el saldo
                  virtual directamente a la cuenta del usuario utilizando su Player ID. El proceso
                  toma desde unos segundos hasta un máximo de 24 horas.
                </span>
              </li>
              <li className="flex items-start gap-3 bg-white/5 p-3 border border-white/10">
                <AlertTriangle className="w-5 h-5 text-[#ffb703] shrink-0" />
                <span>
                  <strong className="text-white">Productos Manuales (Fragmentos y Cajas):</strong>{' '}
                  La entrega de estos productos depende de la disponibilidad del stock interno y se
                  procesa de forma manual. Requieren condiciones específicas (ej. Nivel 15 mínimo en
                  la cuenta) y el tiempo de entrega puede prolongarse.
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-4 flex items-center gap-3">
              <span className="w-2 h-2 bg-primary" /> 4. Política de Devoluciones y Reembolsos
            </h2>
            <div className="bg-[#ff2a1f]/10 border border-[#ff2a1f]/30 p-4 mb-4">
              <p className="text-sm leading-relaxed text-white font-bold flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-[#ff2a1f]" /> Excepción de Desistimiento
              </p>
              <p className="text-sm leading-relaxed text-zinc-300">
                Debido a la naturaleza de los productos digitales intangibles, los cuales se
                consumen y vinculan irreversiblemente a una cuenta de juego de terceros en el
                momento exacto de la inyección, <strong>TODAS LAS VENTAS SON FINALES</strong>. No se
                emiten reembolsos, devoluciones ni cambios una vez que la orden ha sido procesada
                con éxito hacia el Player ID indicado.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-4 flex items-center gap-3">
              <span className="w-2 h-2 bg-primary" /> 5. Responsabilidad del Usuario
            </h2>
            <p className="text-sm leading-relaxed mb-3">
              Es responsabilidad absoluta y exclusiva del cliente ingresar correctamente su{' '}
              <strong>Player ID</strong> al momento de realizar la compra.
            </p>
            <p className="text-sm leading-relaxed mb-3">
              IM SHOP expone el apodo (nickname) asociado al Player ID como medida de seguridad para
              que el usuario confirme su identidad. Si el cliente aprueba y concreta la compra hacia
              un ID equivocado que resultó ser válido, el saldo será transferido a esa cuenta y no
              se podrá revertir la transacción.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-4 flex items-center gap-3">
              <span className="w-2 h-2 bg-primary" /> 6. Prevención de Fraude y Abuso
            </h2>
            <p className="text-sm leading-relaxed">
              IM SHOP se reserva el derecho de rechazar recargas de billetera, cancelar cualquier
              orden de compra, y bloquear o suspender permanentemente cuentas de usuarios si
              nuestros sistemas detectan actividad sospechosa, comprobantes falsos, manipulación de
              la plataforma o intentos de fraude.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
