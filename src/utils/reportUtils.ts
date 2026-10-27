import type { ClientLead } from '../types';

/**
 * Genera un reporte ejecutivo detallado del expediente de un cliente,
 * formateado específicamente para ser copiado y enviado a los jefes/supervisores
 * por WhatsApp o correo electrónico, explicando exactamente qué pasó y qué falta.
 */
export const generateBossReport = (client: ClientLead): string => {
  const lineas: string[] = [];

  lineas.push(`📋 *REPORTE DETALLADO DE EXPEDIENTE — PARA JEFATURA*`);
  lineas.push(`Bufete Legal | Licenciado David Antony Carrillo`);
  lineas.push(`══════════════════════════════════════`);
  lineas.push(`📂 *EXPEDIENTE:* ${client.numeroExpediente}`);
  lineas.push(`👤 *CLIENTE:* ${client.nombre}`);
  lineas.push(`📱 *TELÉFONO:* ${client.telefono}`);
  lineas.push(`💬 *WHATSAPP:* ${client.whatsapp || client.telefono}`);
  if (client.email) {
    lineas.push(`✉️ *CORREO:* ${client.email}`);
  }
  lineas.push(`🌎 *PAÍS DE ORIGEN:* ${client.paisOrigen}`);
  lineas.push(`📍 *RESIDENCIA EN EE.UU.:* ${client.estadoResidenciaEEUU || 'No especificado'}`);
  if (client.numeroIdentificacion) {
    lineas.push(`🪪 *ID / PASAPORTE:* ${client.numeroIdentificacion} ${client.tipoDocumentoIdentidad ? `(${client.tipoDocumentoIdentidad})` : ''}`);
  }
  if (client.numeroA) {
    lineas.push(`🔢 *NÚMERO A (ALIEN REGISTRATION):* ${client.numeroA}`);
  }
  lineas.push(`📅 *REGISTRADO EL:* ${client.fechaRegistro} a las ${client.horaRegistro || 'N/A'}`);
  lineas.push(`🏷️ *FUENTE:* ${client.fuenteContacto.toUpperCase()} ${client.referidoPor ? `(Referido por: ${client.referidoPor})` : ''}`);
  
  lineas.push(``);
  lineas.push(`⚖️ *TRÁMITE SOLICITADO Y DIAGNÓSTICO LEGAL:*`);
  lineas.push(`• Trámite: ${client.tramiteSolicitado}`);
  lineas.push(`• Vía Migratoria Sugerida: ${client.viaMigratoriaSugerida || 'Pendiente de evaluación detallada'}`);
  lineas.push(`• Probabilidad Preliminar: ${
    client.probabilidadExito === 'alta' ? '🟢 ALTA VIABILIDAD' : 
    client.probabilidadExito === 'media' ? '🟡 MEDIA' : 
    '🔴 REQUIERE ANÁLISIS PROFUNDO'
  }`);

  lineas.push(``);
  lineas.push(`🚨 *SITUACIÓN DE CORTE Y DETENCIÓN:*`);
  if (client.estaDetenido) {
    lineas.push(`• ⚠️ *ESTADO:* CLIENTE DETENIDO POR ICE`);
    lineas.push(`• Centro de Detención: ${client.centroDetencion || 'Centro de Detención Federal'}`);
    lineas.push(`• Fianza fijada/sugerida: ${client.montoFianzaSugerido ? `$${client.montoFianzaSugerido.toLocaleString()} USD` : 'Por determinar'}`);
    lineas.push(`• Estatus de Fianza: ${client.fianzaPagada ? 'PAGADA' : 'PENDIENTE DE PAGO'}`);
  } else {
    lineas.push(`• ¿Detenido?: NO (En libertad)`);
  }
  if (client.tieneCorte) {
    lineas.push(`• Audiencia en Corte EOIR: SÍ PROGRAMADA`);
    lineas.push(`• Fecha de Corte: ${client.fechaCorte || 'Pendiente en ACIS'}`);
    if (client.juezNombre) lineas.push(`• Juez Asignado: ${client.juezNombre}`);
    if (client.ciudadCorte) lineas.push(`• Tribunal: ${client.ciudadCorte}`);
  } else {
    lineas.push(`• Audiencia en Corte: No tiene corte asignada`);
  }

  lineas.push(``);
  lineas.push(`📞 *GESTIÓN DE LLAMADAS Y CONTACTO:*`);
  lineas.push(`• Estado de Contacto: ${
    client.estadoContacto === 'nuevo_por_contactar' ? 'Nuevo (Por contactar)' :
    client.estadoContacto === 'llamada_realizada' ? 'Llamada realizada y atendida' :
    client.estadoContacto === 'sin_respuesta' ? 'Sin respuesta / Enviado a buzón' :
    'En seguimiento activo'
  }`);
  lineas.push(`• Llamadas Atendidas: ${client.llamadasRealizadasCount || 0}`);
  lineas.push(`• Llamadas Sin Respuesta / Buzón: ${client.llamadasSinRespuestaCount || 0}`);
  lineas.push(`• Última Interacción: ${client.ultimaLlamada || 'Sin registros'}`);

  lineas.push(``);
  lineas.push(`📑 *DOCUMENTOS Y TRÁMITES PREVIOS DEL CLIENTE:*`);
  lineas.push(`• Estado Documentación: ${
    client.estadoDocumentos === 'esperando_documentos' ? 'Esperando documentos del cliente' :
    client.estadoDocumentos === 'documentos_recibidos' ? 'Documentos recibidos' :
    client.estadoDocumentos === 'en_revision' ? 'En revisión legal' :
    'Expediente completo y listo'
  }`);
  lineas.push(`• Examen Médico Civil (I-693): ${
    client.examenMedicoStatus === 'completado' ? '✅ Completado (Sobre sellado)' :
    client.examenMedicoStatus === 'agendado' ? '📅 Cita agendada con médico civil' :
    '⏳ Pendiente por agendar por el cliente'
  }`);
  lineas.push(`• Biométricos (ASC Huellas): ${
    client.biometricosStatus === 'completado' ? '✅ Huellas tomadas en ASC' :
    client.biometricosStatus === 'agendado' ? '📅 Cita de biométricos programada' :
    '⏳ Esperando Notificación oficial I-797C'
  }`);

  lineas.push(``);
  lineas.push(`📝 *NOTAS Y RESUMEN DE LO QUE PASÓ CON ESTE CLIENTE:*`);
  lineas.push(`${client.observacionesIniciales || client.notasCaso || 'Cliente ingresado al sistema, pendiente de actualización de notas.'}`);

  lineas.push(`══════════════════════════════════════`);
  lineas.push(`👤 *Responsable del Caso:* ${client.responsable || 'Licenciado David Antony Carrillo'}`);
  lineas.push(`⏰ *Reporte generado:* ${new Date().toLocaleDateString()} a las ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);

  return lineas.join('\n');
};
