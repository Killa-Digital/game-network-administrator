import Link from 'next/link'
import { ArrowLeft, Lock, ShieldCheck, UserCheck } from 'lucide-react'

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-[#070609] selection:bg-[#00e5ff] selection:text-black font-sans bg-halftone pb-24">
      <div className="border-b border-white/10 bg-[#0c0a10] sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center">
          <Link
            href="/"
            className="flex items-center gap-3 text-xs font-black text-zinc-400 hover:text-[#00e5ff] transition-colors uppercase tracking-[0.2em]"
          >
            <ArrowLeft className="w-4 h-4" /> Volver a la Tienda
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-12 md:mt-16 relative z-10">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-[#00e5ff]/15 border border-[#00e5ff] px-3 py-1 mb-4 -skew-x-12">
            <Lock className="w-4 h-4 text-[#00e5ff] skew-x-12" />
            <span className="skew-x-12 text-[#00e5ff] font-black uppercase tracking-[0.25em] text-[10px]">
              PROTECCIÓN DE DATOS
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
            Políticas de <span className="text-[#00e5ff]">Privacidad</span>
          </h1>
          <p className="text-zinc-400 text-sm font-mono tracking-wide">
            Última actualización: {new Date().toLocaleDateString('es-PE')}
          </p>
        </div>

        <div className="bg-[#110f16] border-2 border-white/10 p-6 md:p-10 text-zinc-300 space-y-8 shadow-[8px_8px_0px_#000000]">
          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-4 flex items-center gap-3">
              <UserCheck className="w-5 h-5 text-[#00e5ff]" /> 1. Información que Recopilamos
            </h2>
            <p className="text-sm leading-relaxed mb-4">
              En <strong>IM SHOP</strong> respetamos tu privacidad. Para brindar nuestros servicios
              de manera eficiente, recopilamos únicamente la información estrictamente necesaria
              cuando interactúas con nuestra plataforma:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <li className="bg-white/5 p-4 border border-white/10">
                <strong className="text-white block mb-1">Datos de Cuenta:</strong> Correo
                electrónico, nombre de usuario y teléfono (proporcionados al registrarte o vincular
                tu cuenta de Google).
              </li>
              <li className="bg-white/5 p-4 border border-white/10">
                <strong className="text-white block mb-1">Datos de Juego:</strong> Player ID de los
                juegos que recargas para poder realizar la inyección de saldo y verificar el
                nickname.
              </li>
              <li className="bg-white/5 p-4 border border-white/10">
                <strong className="text-white block mb-1">Historial de Transacciones:</strong>{' '}
                Registro de tus recargas a la Billetera Virtual y comprobantes subidos para
                validación.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-4 flex items-center gap-3">
              <span className="w-2 h-2 bg-[#00e5ff]" /> 2. Uso de la Información
            </h2>
            <p className="text-sm leading-relaxed mb-3">
              Los datos recopilados son utilizados exclusivamente con los siguientes fines
              operativos y de seguridad:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-zinc-400">
              <li>
                Procesar y completar de manera automática o manual la entrega de tus productos
                digitales.
              </li>
              <li>
                Mantener el registro histórico de tu Billetera Virtual y tus comprobantes de
                recarga.
              </li>
              <li>Brindar soporte técnico y resolver inconvenientes vinculados a tus pedidos.</li>
              <li>
                Notificarte sobre el estado de tus recargas o problemas con tu cuenta (ej.
                requerimientos de nivel mínimo en la cuenta del juego).
              </li>
              <li>Prevenir fraudes y garantizar la seguridad de nuestra plataforma.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-4 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#00e5ff]" /> 3. Protección y Almacenamiento
            </h2>
            <div className="bg-[#00e5ff]/10 border border-[#00e5ff]/30 p-4 mb-4">
              <p className="text-sm leading-relaxed text-zinc-300">
                Toda la información es gestionada mediante infraestructuras en la nube altamente
                seguras (como Supabase) que encriptan contraseñas y datos sensibles.{' '}
                <strong>IM SHOP no vende, alquila ni comparte tu información personal</strong> con
                terceros para fines publicitarios o comerciales ajenos a la plataforma.
              </p>
            </div>
            <p className="text-sm leading-relaxed text-zinc-400">
              * Nota: IM SHOP no procesa directamente tarjetas de crédito/débito en sus servidores.
              En caso de implementar pasarelas de pago, los datos financieros son manejados
              íntegramente por los procesadores de pago externos regulados.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-4 flex items-center gap-3">
              <span className="w-2 h-2 bg-[#00e5ff]" /> 4. Cookies y Sesiones
            </h2>
            <p className="text-sm leading-relaxed mb-3">
              Utilizamos tecnologías locales (como Local Storage y cookies de sesión seguras)
              estrictamente para mantener tu sesión activa y persistir la información de tu carrito
              de compras mientras navegas por nuestro catálogo.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-4 flex items-center gap-3">
              <span className="w-2 h-2 bg-[#00e5ff]" /> 5. Tus Derechos
            </h2>
            <p className="text-sm leading-relaxed mb-3">
              Como usuario, tienes el control sobre tu información. Desde el panel de{' '}
              <strong>Perfil (Datos de Agente)</strong>, puedes en cualquier momento acceder y
              actualizar tu nombre y número de teléfono. Asimismo, puedes modificar la contraseña de
              tu cuenta para mantener tus accesos seguros.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
