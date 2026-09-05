import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { firmData } from '../config/firmData';

const AuditReportPDF: React.FC = () => {
  const { folio } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpediente = async () => {
      if (!folio || !supabase) return;
      try {
        const { data, error } = await supabase
          .from('expedientes_auditoria')
          .select('*')
          .eq('folio', folio)
          .single();
          
        if (data && !error) {
          setData(data);
        }
      } catch (err) {
        console.error("Error al obtener expediente:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExpediente();
  }, [folio]);

  if (loading) return <div className="p-10 text-center font-bold font-serif">Generando Reporte Oficial...</div>;
  if (!data) return <div className="p-10 text-center text-red-600 font-bold font-serif">Expediente no encontrado.</div>;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-200 min-h-screen py-8 print:p-0 print:bg-white flex flex-col items-center">
      {/* Controles de UI (ocultos al imprimir) */}
      <div className="mb-6 flex gap-4 print:hidden">
        <button 
          onClick={handlePrint}
          className="bg-navy-900 hover:bg-navy-800 text-white font-bold py-3 px-8 rounded-lg shadow-lg flex items-center gap-2"
        >
          <i className="fa-solid fa-print"></i> Guardar como PDF / Imprimir
        </button>
        <button 
          onClick={() => window.close()}
          className="bg-slate-300 hover:bg-slate-400 text-slate-800 font-bold py-3 px-6 rounded-lg shadow-md"
        >
          Cerrar
        </button>
      </div>

      {/* Página Carta (A4 aprox) */}
      <div className="w-[850px] bg-white shadow-2xl relative overflow-hidden print:w-full print:shadow-none print:m-0" style={{ minHeight: '1100px' }}>
        
        {/* Bordes Dorados Perimetrales */}
        <div className="absolute inset-0 border-[12px] border-double border-gold-500 m-8 pointer-events-none opacity-80"></div>
        <div className="absolute inset-0 border border-slate-300 m-[34px] pointer-events-none"></div>
        
        {/* Marca de agua (Escudo / Balanza) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <i className="fa-solid fa-scale-balanced text-[400px]"></i>
        </div>

        <div className="p-20 relative z-10">
          
          {/* Cabecera */}
          <div className="flex justify-between items-start border-b-2 border-navy-900 pb-6 mb-8">
            <div className="flex items-center gap-4">
              <i className="fa-solid fa-landmark text-5xl text-navy-900"></i>
              <div>
                <h1 className="font-serif font-black text-2xl text-navy-900 tracking-wider">REPORTE OFICIAL DE AUDITORÍA</h1>
                <p className="text-sm font-bold text-gold-600 tracking-widest uppercase">Centro Nacional de Verificación Legal</p>
                <p className="text-xs text-slate-500 mt-1">{firmData.practiceJurisdiction}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 mb-1">Folio de Expediente:</div>
              <div className="font-mono font-bold text-lg text-red-700 bg-red-50 px-3 py-1 border border-red-200">{data.folio}</div>
              <div className="text-xs text-slate-500 mt-2">Fecha de Emisión:</div>
              <div className="font-bold text-sm">{new Date().toLocaleDateString('es-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          </div>

          <div className="mb-8 bg-slate-50 border border-slate-200 p-6 rounded-sm">
            <h2 className="text-sm font-bold text-navy-900 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2 flex items-center gap-2">
              <i className="fa-solid fa-user-check text-gold-500"></i> Datos del Solicitante
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-slate-500 uppercase">Nombre Registrado:</p>
                <p className="font-bold text-lg text-slate-800">{data.nombre_completo}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase">Identificador Principal (A-Number):</p>
                <p className="font-mono font-bold text-lg text-navy-900">{data.a_number || 'NO REGISTRADO'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase">Número de Recibo (USCIS):</p>
                <p className="font-mono font-bold text-slate-800">{data.numero_recibo || 'NO REGISTRADO'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase">Estado / Jurisdicción:</p>
                <p className="font-bold text-slate-800">{data.estado_usa || 'NO DECLARADO'}</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-sm font-bold text-navy-900 uppercase tracking-widest mb-4 border-b-2 border-navy-900 pb-2 flex items-center gap-2">
              <i className="fa-solid fa-gavel text-gold-500"></i> Resultados de Búsqueda Oficial
            </h2>
            
            <table className="w-full text-sm border-collapse mb-6">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="py-4 font-bold text-slate-600 w-1/3 bg-slate-50 px-4">Estatus Actual en Corte (EOIR):</td>
                  <td className="py-4 px-4 font-bold text-lg text-navy-900 uppercase">{data.estatus_corte || 'No Encontrado'}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-4 font-bold text-slate-600 w-1/3 bg-slate-50 px-4">Fecha de Próxima Audiencia:</td>
                  <td className="py-4 px-4 font-bold">{data.fecha_audiencia || 'No Programada / Concluido'}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-4 font-bold text-slate-600 w-1/3 bg-slate-50 px-4">Juez / Sede Asignada:</td>
                  <td className="py-4 px-4">{data.juez_asignado || 'No Asignado'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Módulo de Fianza (El Gancho) */}
          <div className={`p-6 border-2 ${data.hubo_fianza ? 'border-emerald-600 bg-emerald-50' : 'border-slate-300 bg-slate-50'} relative mb-12`}>
            <div className={`absolute -top-3 left-6 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white ${data.hubo_fianza ? 'bg-emerald-600' : 'bg-slate-600'}`}>
              Análisis Financiero Federal
            </div>
            
            <div className="flex items-start gap-4">
              {data.hubo_fianza ? (
                <>
                  <i className="fa-solid fa-circle-check text-4xl text-emerald-600 mt-1"></i>
                  <div>
                    <h3 className="font-bold text-emerald-800 text-lg mb-1">REGISTRO DE FIANZA DETECTADO</h3>
                    <p className="text-sm text-emerald-700 leading-relaxed">
                      El sistema gubernamental refleja que existe una fianza en efectivo (Immigration Bond) vinculada a este expediente por un valor estimado original de <strong>${data.monto_estimado?.toLocaleString() || '0'} USD</strong> a nombre de <strong>{data.nombre_fiador || 'Fiador no especificado'}</strong>.
                    </p>
                    {data.estatus_corte === 'Cerrado' || data.estatus_corte === 'Orden Final' ? (
                      <div className="mt-4 bg-emerald-100 p-4 border border-emerald-200 text-emerald-900 font-bold text-sm">
                        <i className="fa-solid fa-bell mr-2 animate-pulse"></i>
                        ALERTA DE COBRO: Dado que el caso está cerrado, estos fondos son 100% elegibles para ser reclamados inmediatamente ante el Departamento del Tesoro (incluyendo intereses acumulados). Contáctenos para proceder con el trámite oficial I-395.
                      </div>
                    ) : (
                      <div className="mt-4 text-xs text-emerald-800 font-bold">
                        * Los fondos se mantienen retenidos por el gobierno federal hasta la conclusión oficial del caso.
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-circle-xmark text-4xl text-slate-400 mt-1"></i>
                  <div>
                    <h3 className="font-bold text-slate-700 text-lg mb-1">SIN REGISTRO DE FIANZAS</h3>
                    <p className="text-sm text-slate-600">No se encontraron depósitos de fianza migratoria asociados a este A-Number en los registros federales de ICE.</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Firmas y Disclaimer */}
          <div className="mt-20 pt-8 border-t border-slate-300">
            <div className="flex justify-between items-end">
              <div className="w-1/2">
                <div className="text-[10px] text-slate-400 leading-tight text-justify">
                  <strong>Aviso Legal:</strong> La información contenida en este documento se deriva directamente de las bases de datos públicas automatizadas del gobierno de los EE. UU. (EOIR/USCIS) consultadas en la fecha indicada. Este reporte constituye una verificación administrativa independiente y NO reemplaza el consejo legal formalizado. La oficina legal no asume responsabilidad por actualizaciones del sistema federal posteriores a la fecha y hora de esta emisión.
                </div>
              </div>
              <div className="w-1/3 text-center">
                {/* Simulated Signature */}
                <div className="font-signature text-4xl text-navy-900 opacity-80 mb-2 transform -rotate-2">
                  F. Hernandez
                </div>
                <div className="border-t border-slate-800 pt-2">
                  <p className="font-bold text-sm text-navy-900">{firmData.lawyerName}</p>
                  <p className="text-xs text-slate-500">{firmData.barAssociation} #{firmData.barNumber}</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AuditReportPDF;
