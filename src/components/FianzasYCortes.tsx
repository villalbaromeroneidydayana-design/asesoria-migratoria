import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Scale, 
  AlertTriangle, 
  CheckCircle, 
  Building2, 
  Send, 
  Copy, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { sendWhatsAppMessage } from '../utils/speech';

export const FianzasYCortes: React.FC = () => {
  // Simulator State
  const [hasSponsor, setHasSponsor] = useState(true);
  const [sponsorStatus, setSponsorStatus] = useState<'citizen' | 'resident' | 'none'>('citizen');
  const [timeInUS, setTimeInUS] = useState('more_than_2');
  const [hasFamilyTies, setHasFamilyTies] = useState(true);
  const [hasCleanRecord, setHasCleanRecord] = useState(true);
  const [hasStableAddress, setHasStableAddress] = useState(true);

  const [copied, setCopied] = useState(false);
  const [clientPhone, setClientPhone] = useState('');
  const [detaineeName, setDetaineeName] = useState('');
  const [bondAmount, setBondAmount] = useState('7500');

  // Calculate bond viability score
  const calculateBondViability = () => {
    let score = 0;
    if (hasSponsor && sponsorStatus !== 'none') score += 25;
    if (sponsorStatus === 'citizen') score += 10;
    if (hasCleanRecord) score += 30;
    if (hasFamilyTies) score += 15;
    if (hasStableAddress) score += 10;
    if (timeInUS === 'more_than_2') score += 10;

    let rating: 'Excelente' | 'Favorable' | 'Riesgoso' = 'Favorable';
    let estimatedBond = '$4,000 - $7,500 USD';
    let recommendations = [];

    if (score >= 80) {
      rating = 'Excelente';
      estimatedBond = '$2,500 - $5,000 USD (Cercana al mínimo legal)';
      recommendations.push('Presentar de inmediato la Moción de Fianza ante el Juez con cartas de apoyo comunitarias.');
      recommendations.push('El fiador debe tener listos sus impuestos (Taxes) y prueba de estatus legal.');
    } else if (score >= 50) {
      rating = 'Favorable';
      estimatedBond = '$5,000 - $10,000 USD';
      recommendations.push('Reforzar la evidencia de que no hay riesgo de fuga (contrato de renta, lazos de iglesia/trabajo).');
      recommendations.push('El fiador debe demostrar solvencia económica suficiente.');
    } else {
      rating = 'Riesgoso';
      estimatedBond = '$10,000 - $20,000 USD o Detención Obligatoria (Mandatory Detention)';
      recommendations.push('Verificar si existe causal de detención obligatoria bajo la Sección INA 236(c) por antecedentes penales.');
      recommendations.push('Solicitar audiencia Matter of Joseph si se disputa la detención obligatoria.');
    }

    return { score, rating, estimatedBond, recommendations };
  };

  const viability = calculateBondViability();

  const bondInstructionsMsg = `🏛️ *INFORMACIÓN OFICIAL DE FIANZA Y LIBERACIÓN MIGRATORIA*
*Bufete de Abogados David Antony Carrillo*

Estimada familia de ${detaineeName || 'nuestro cliente'}:

Le explicamos detalladamente cómo proceder con el trámite de fianza ante el Juez de Inmigración y el Servicio de Inmigración (ICE):

1️⃣ *¿Qué es la fianza migratoria?*
Es un depósito de garantía en custodia del gobierno para que la persona sea liberada del centro de detención y continúe su proceso legal en libertad. El mínimo por ley es de $1,500 USD.${bondAmount ? `\n• *Monto estimado / fijado:* $${Number(bondAmount).toLocaleString()} USD.` : ''}

2️⃣ *Requisitos para el Fiador (Sponsor / Obligor):*
• Debe ser Ciudadano Estadounidense o Residente Permanente Legal (Green Card).
• Identificación válida con foto y Número de Seguro Social.
• Comprobante de domicilio (factura de servicios o contrato de arrendamiento).

3️⃣ *Formas oficiales y seguras de pago:*
⚠️ *NUNCA entregue dinero en efectivo ni haga transferencias por Zelle a desconocidos.*
• Se realiza en línea por el sistema oficial del gobierno: *CeBONDS de ICE* (https://cebonds.ice.gov)
• O de forma presencial en la oficina de ICE ERO con un *Cheque de Caja Bancario Certificado (Cashier's Check)* a nombre del "Department of Homeland Security".

4️⃣ *Devolución del dinero:*
El 100% del monto de la fianza es devuelto al fiador una vez que el cliente concluya todas sus comparecencias ante la corte.

Estamos redactando la moción legal para solicitar al juez la reducción de la fianza. Comuníquese con nosotros para asistirle paso a paso.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(bondInstructionsMsg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="glass-card rounded-2xl p-6 border-red-500/20 relative overflow-hidden space-y-2">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-2 text-red-400 text-xs font-semibold uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4" />
          <span>Defensa de Detenidos y Cortes de Inmigración (EOIR / ICE)</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
          Fianzas de Inmigración y Pagos al Juez
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Estrategias para lograr la liberación de personas capturadas por ICE o en centros de detención migratoria. Moción de redeterminación de fianza, cálculo de factores de reducción y proceso oficial de pago seguro para el fiador.
        </p>
      </div>

      {/* Main Grid: Bond Calculator & Official Payment Protocol */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Interactive Bond Viability Calculator */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-6 border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-400" />
              <h3 className="font-serif text-lg font-bold text-white">
                Calculadora de Factores de Fianza ante el Juez
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">INA § 236(a)</span>
          </div>

          <p className="text-xs text-slate-300">
            Para que el Juez de Inmigración conceda una fianza baja, la ley exige demostrar dos cosas: <strong>1. Que el detenido no es un peligro para la comunidad</strong> y <strong>2. Que no existe riesgo de que se fugue</strong>.
          </p>

          {/* Form Factors */}
          <div className="space-y-4 pt-1">
            {/* Factor 1: Fiador */}
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
              <label className="text-xs font-semibold text-slate-200 block">
                1. ¿Cuenta con un Fiador (Sponsor / Obligor) con estatus legal?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'citizen', label: 'Ciudadano EE.UU.', desc: 'Máxima solidez' },
                  { id: 'resident', label: 'Residente Legal (LPR)', desc: 'Totalmente válido' },
                  { id: 'none', label: 'No tiene fiador', desc: 'Imposibilita el pago' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setSponsorStatus(opt.id as any);
                      setHasSponsor(opt.id !== 'none');
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                      sponsorStatus === opt.id
                        ? 'bg-amber-500/20 border-amber-500 text-white font-semibold'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div>{opt.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Factor 2: Récord Penal */}
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
              <label className="text-xs font-semibold text-slate-200 block">
                2. ¿Tiene antecedentes penales o arrestos previos en EE.UU.?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setHasCleanRecord(true)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                    hasCleanRecord
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-semibold'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  ✓ Récord completamente limpio
                  <div className="text-[10px] text-slate-400">Sin arrestos ni DUI</div>
                </button>

                <button
                  type="button"
                  onClick={() => setHasCleanRecord(false)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                    !hasCleanRecord
                      ? 'bg-red-500/20 border-red-500 text-red-200 font-semibold'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  ⚠ Tiene algún arresto / DUI / Faltas
                  <div className="text-[10px] text-slate-400">Riesgo de fianza elevada</div>
                </button>
              </div>
            </div>

            {/* Factor 3: Lazos Familiares y Domicilio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                <label className="text-xs font-semibold text-slate-200 block">
                  3. Lazos familiares en EE.UU.:
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setHasFamilyTies(true)}
                    className={`flex-1 py-2 text-xs rounded-lg border text-center transition ${
                      hasFamilyTies ? 'bg-amber-500/20 border-amber-500 text-white font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    Hijos/Esposa en EE.UU.
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasFamilyTies(false)}
                    className={`flex-1 py-2 text-xs rounded-lg border text-center transition ${
                      !hasFamilyTies ? 'bg-amber-500/20 border-amber-500 text-white font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    Sin familia aquí
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                <label className="text-xs font-semibold text-slate-200 block">
                  4. Domicilio fijo y comprobable:
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setHasStableAddress(true)}
                    className={`flex-1 py-2 text-xs rounded-lg border text-center transition ${
                      hasStableAddress ? 'bg-amber-500/20 border-amber-500 text-white font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    Tiene contrato / recibos
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasStableAddress(false)}
                    className={`flex-1 py-2 text-xs rounded-lg border text-center transition ${
                      !hasStableAddress ? 'bg-amber-500/20 border-amber-500 text-white font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    Sin dirección fija
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
              <label className="text-xs font-semibold text-slate-200 block">
                5. Tiempo viviendo en EE.UU.:
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTimeInUS('more_than_2')}
                  className={`flex-1 py-2 text-xs rounded-lg border text-center transition ${
                    timeInUS === 'more_than_2' ? 'bg-amber-500/20 border-amber-500 text-white font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Más de 2 años en EE.UU.
                </button>
                <button
                  type="button"
                  onClick={() => setTimeInUS('less_than_2')}
                  className={`flex-1 py-2 text-xs rounded-lg border text-center transition ${
                    timeInUS !== 'more_than_2' ? 'bg-amber-500/20 border-amber-500 text-white font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Menos de 2 años
                </button>
              </div>
            </div>
          </div>

          {/* Viability Result Box */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-slate-900 border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Diagnóstico de Fianza ante el Juez:
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                viability.rating === 'Excelente' 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : viability.rating === 'Favorable'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-red-500/20 text-red-300 border-red-500/40'
              }`}>
                Pronóstico: {viability.rating} ({viability.score}/100 pts)
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-y border-slate-800">
              <span className="text-xs text-slate-300">Rango de fianza esperable:</span>
              <span className="text-sm font-mono font-bold text-amber-300">{viability.estimatedBond}</span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400">Recomendaciones para el Abogado Francisco:</span>
              {viability.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs text-slate-300">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Official Payment Instructions & Family Guidance */}
        <div className="lg:col-span-5 space-y-5">
          {/* Official ICE Payment Gateways */}
          <div className="glass-card rounded-2xl p-6 border-slate-800 space-y-4">
            <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              <span>Cómo Pagar la Fianza Oficialmente</span>
            </h3>

            <div className="space-y-3 text-xs">
              {/* Option A */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <strong className="text-white text-xs">Opción 1: En Línea (CeBONDS ICE)</strong>
                  <a
                    href="https://cebonds.ice.gov"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300"
                  >
                    <span>cebonds.ice.gov</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  El fiador crea una cuenta oficial en el portal de ICE CeBONDS y paga con tarjeta de débito o transferencia ACH directamente al Departamento de Seguridad Nacional (DHS). Es el método más rápido (liberación en 24-48 hrs).
                </p>
              </div>

              {/* Option B */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <strong className="text-white text-xs">Opción 2: Presencial en Oficina de ICE ERO</strong>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  El fiador acude con su Green Card o pasaporte estadounidense a la oficina de ICE Enforcement and Removal Operations (ERO) con un <strong>Cheque de Caja (Cashier's Check)</strong> bancario o Money Order emitido exactamente a nombre de: <em>"Department of Homeland Security"</em>.
                </p>
              </div>

              {/* Fraud Warning */}
              <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 flex items-start gap-2 text-xs text-red-200">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Prevención de Estafas:</strong> Advierta a la familia que NUNCA entregue dinero en efectivo ni transfiera por aplicaciones (Zelle/Venmo) a supuestos oficiales de ICE. El gobierno federal NUNCA cobra fianzas por WhatsApp o teléfonos personales.
                </div>
              </div>
            </div>
          </div>

          {/* Quick WhatsApp Dispatch to Family */}
          <div className="glass-card rounded-2xl p-5 border-slate-800 space-y-3">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
              Enviar Guía de Fianza a la Familia por WhatsApp:
            </span>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="Nombre del familiar detenido (ej. Carlos Castillo)"
                value={detaineeName}
                onChange={(e) => setDetaineeName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 outline-none"
              />
              <input
                type="number"
                placeholder="Monto de fianza en USD (ej. 7500)"
                value={bondAmount}
                onChange={(e) => setBondAmount(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 outline-none"
              />
              <input
                type="tel"
                placeholder="Número de WhatsApp del familiar/fiador"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 outline-none"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopy}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 border border-slate-700 transition cursor-pointer"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '¡Copiado!' : 'Copiar Guion'}</span>
              </button>

              <button
                type="button"
                onClick={() => sendWhatsAppMessage(clientPhone, bondInstructionsMsg)}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
