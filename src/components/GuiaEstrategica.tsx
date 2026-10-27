import React, { useState } from 'react';
import { 
  BookOpen, 
  PhoneCall, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp
} from 'lucide-react';

export const GuiaEstrategica: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const OBJECTIONS = [
    {
      objecion: '"Tengo miedo de que si me presento a la corte el juez de inmigración me deporte inmediatamente."',
      queResponder: 'Estimado/a, entiendo perfectamente su temor, pero la realidad jurídica es la contraria: si usted no se presenta a su audiencia, el juez emitirá automáticamente una Orden de Deportación en Ausencia de manera inmediata y definitiva. Cuando usted comparece representado por nuestro bufete, nosotros ejercemos sus defensas legales, solicitamos tiempo para reunir pruebas, o radicamos su solicitud de asilo o fianza. En la primera audiencia (Master Calendar Hearing) nadie es deportado si tiene defensa legal activa. Asistir es su única garantía de quedarse en el país legalmente.',
      baseLegal: 'INA § 240(b)(5) - Remoción en Ausencia por Falta de Comparecencia.'
    },
    {
      objecion: '"¿Por qué tengo que pagar una fianza al juez si yo no he cometido ningún delito en este país?"',
      queResponder: 'Es una pregunta muy comprensible. La fianza de inmigración no es una multa ni un castigo penal. Es una garantía financiera civil que exige el gobierno de EE.UU. para asegurar que la persona continúe presentándose a sus audiencias en libertad en lugar de esperar su juicio encarcelado en un centro de detención de ICE. Lo más importante: si usted cumple con sus citas ante el juez, el 100% de ese dinero se le reembolsa a su fiador cuando concluya su proceso.',
      baseLegal: 'INA § 236(a) - Custodia y Liberación bajo Fianza Migratoria.'
    },
    {
      objecion: '"Un conocido me dijo que mejor no haga nada y espere a que haya una reforma migratoria."',
      queResponder: 'Ese es el consejo más peligroso que le pueden dar en los Estados Unidos. Si usted deja pasar el primer año desde que entró al país sin radicar su solicitud de asilo (Formulario I-589), pierde para siempre ese derecho por ley federal. Además, acumular presencia ilegal sin un caso pendiente activa los castigos de 3 y 10 años (Sección 212(a)(9)). Iniciar su expediente con nosotros hoy congela su presencia ilegal y le permite obtener un Permiso de Trabajo oficial (EAD) y Número de Seguro Social.',
      baseLegal: 'INA § 208(a)(2)(B) - Plazo Perentorio de 1 Año para Asilo.'
    },
    {
      objecion: '"¿Por qué tengo que hacerme el examen médico (I-693) y las huellas yo mismo?"',
      queResponder: 'Porque la ley federal exige que los exámenes médicos sean practicados personalmente por un Cirujano Civil certificado por USCIS y las huellas tomadas en persona en el centro oficial ASC para cotejar su identidad con el FBI. Ningún abogado en el mundo puede ponerse las vacunas ni poner las huellas por usted. Pero lo positivo es que usted se enfoca en esos dos trámites sencillos, y nosotros nos encargamos de todo el papeleo legal complejo, la estrategia ante el juez, y su defensa.',
      baseLegal: 'Formulario I-693 / INA § 212(a)(1) - Inadmisibilidad Médica.'
    },
    {
      objecion: '"No tengo dinero suficiente en este momento para pagar todos los trámites legales."',
      queResponder: 'Le entendemos perfectamente y sabemos lo duro que es el inicio en este país. Por eso en nuestro bufete estructuramos planes de pago accesibles y fraccionados. Además, lo primero que debe hacer (su examen médico y registro de huellas) lo va pagando a su propio ritmo directamente a los centros autorizados mientras nosotros avanzamos en la preparación de su expediente preliminar. No deje que el dinero sea la razón por la que pierda sus derechos migratorios.',
      baseLegal: 'Flexibilidad de Representación Legal y Defensa Justa.'
    },
    {
      objecion: '"Tengo a mi hermano/esposo detenido por ICE en este momento, ¿lo van a deportar hoy?"',
      queResponder: '¡Mantenga la calma, pero actuemos de inmediato! Mientras la persona está detenida, tiene derecho a una Audiencia de Redeterminación de Fianza ante el Juez de Inmigración, siempre y cuando no tenga una orden de expulsión previa no disputada. Necesitamos su Número A (Alien Number) urgente. En cuanto tengamos su número, localizamos su centro de detención, radicamos la Moción de Fianza demostrando que tiene familia y no es peligroso, y coordinamos con un fiador legal para su liberación.',
      baseLegal: 'Matter of Patel / Audiencias de Fianza EOIR.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="glass-card-gold rounded-2xl p-6 border-amber-500/30 space-y-2">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Manual de Operaciones y Ventas Legales</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
          Manual Estratégico: Cómo Abordar y Guiar al Cliente
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Pautas maestras para el Licenciado David Antony Carrillo: cómo confrontar con seguridad y empatía las llamadas de WhatsApp, las preguntas clave en orden cronológico, y las respuestas para desarmar objeciones y generar compromiso legal inmediato.
        </p>
      </div>

      {/* Las 4 Etapas de la Llamada Telefónica */}
      <div className="glass-card rounded-2xl p-6 border-slate-800 space-y-4">
        <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-emerald-400" />
          <span>Estructura Maestra de la Llamada (15 Minutos)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Bloque 1 */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs border border-amber-500/40">
              1
            </div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Apertura y Secreto Profesional
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Preséntate: <em>"Le habla el Licenciado David Antony Carrillo"</em>. Lo primero que debes hacer es quitarles el miedo: <strong>"Toda la información que me dé es estrictamente confidencial bajo secreto profesional de abogado."</strong>
            </p>
          </div>

          {/* Bloque 2 */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-xs border border-blue-500/40">
              2
            </div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              El Cuestionario de Verdad
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Haz las 5 preguntas cruciales: ¿Cómo entró (visa/frontera)? ¿Fecha de ingreso? ¿Récord policial? ¿Tiene Número A o fecha de corte con juez? ¿Familiares directos con papeles?
            </p>
          </div>

          {/* Bloque 3 */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs border border-emerald-500/40">
              3
            </div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              La División de Trabajo
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Explícales con claridad: <strong>"Usted se encarga de dos trámites que solo usted puede hacer en persona: el examen médico I-693 y las huellas biométricas. De todo lo demás nos encargamos nosotros."</strong>
            </p>
          </div>

          {/* Bloque 4 */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs border border-purple-500/40">
              4
            </div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Cierre y Seguimiento WhatsApp
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Apertura formal de su expediente en la plataforma. Envía de inmediato por WhatsApp el mensaje de confirmación y el guion del examen médico para que sientan el respaldo legal.
            </p>
          </div>
        </div>
      </div>

      {/* Manejo de Objeciones */}
      <div className="glass-card rounded-2xl p-6 border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-400" />
          <h3 className="font-serif text-lg font-bold text-white">
            Banco de Respuestas a las 6 Objeciones Más Difíciles
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          Haz clic en cada objeción para ver la respuesta exacta que debes darle al cliente durante la llamada o por mensaje de voz:
        </p>

        <div className="space-y-3">
          {OBJECTIONS.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-slate-900/80 border border-slate-800 overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-slate-800/40 transition cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-200">
                    {item.objecion}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-4 pt-0 border-t border-slate-800/60 space-y-2 mt-2">
                    <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-100 leading-relaxed">
                      <strong className="text-amber-400 block mb-1">🗣️ Qué responder exactamente:</strong>
                      {item.queResponder}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Fundamento Jurídico: {item.baseLegal}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
