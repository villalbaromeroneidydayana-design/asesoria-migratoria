export type ServiceCategory = 
  | 'Protección Humanitaria y Cortes'
  | 'Empleo e Identificación Oficial'
  | 'Familia y Residencia Permanente'
  | 'Ciudadanía y Mantenimiento';

export interface ImmigrationService {
  id: string;
  code: string;
  name: string;
  category: ServiceCategory;
  description: string;
  uscisFee: number; // 0 for free, numeric for cost
  requiredDocs: string[];
  tasks: {
     needsPhotos: boolean;
     needsBiometrics: boolean;
     needsMedical: boolean;
     needsMoneyOrder: boolean;
  };
}

export const servicesCatalog: ImmigrationService[] = [
  // CATEGORÍA 1: Protección Humanitaria y Cortes
  {
    id: "asylum",
    code: "I-589",
    name: "Solicitud de Asilo y Suspensión de Remoción",
    category: "Protección Humanitaria y Cortes",
    description: "Defensa contra deportación y solicitud de asilo para personas con temor de persecución.",
    uscisFee: 0,
    requiredDocs: ["Pasaporte Biográfico", "Declaración Jurada (Affidavit)", "Evidencias del país de origen", "Certificados de Identidad"],
    tasks: { needsPhotos: true, needsBiometrics: true, needsMedical: false, needsMoneyOrder: false }
  },
  {
    id: "tps",
    code: "I-821",
    name: "Estatus de Protección Temporal (TPS)",
    category: "Protección Humanitaria y Cortes",
    description: "Beneficio migratorio temporal para nacionales de países designados.",
    uscisFee: 50, // Base fee for I-821
    requiredDocs: ["Pasaporte", "Prueba de Nacionalidad", "Pruebas de Residencia Continua", "Antecedentes Penales (Disposición)"],
    tasks: { needsPhotos: true, needsBiometrics: true, needsMedical: false, needsMoneyOrder: true }
  },
  {
    id: "eoir",
    code: "EOIR",
    name: "Defensa en Corte de Inmigración (Master/Individual)",
    category: "Protección Humanitaria y Cortes",
    description: "Representación legal total ante el Juez de Inmigración para prevenir la deportación.",
    uscisFee: 0,
    requiredDocs: ["Notice to Appear (NTA)", "Todos los citatorios de la corte", "I-94 o Registro de Entrada", "Historial Criminal (Si aplica)"],
    tasks: { needsPhotos: false, needsBiometrics: true, needsMedical: false, needsMoneyOrder: false }
  },

  // CATEGORÍA 2: Empleo e Identificación Oficial
  {
    id: "ead",
    code: "I-765",
    name: "Permiso de Trabajo (EAD)",
    category: "Empleo e Identificación Oficial",
    description: "Autorización de Empleo bajo categorías (c)(8) Asilo, (c)(9) Ajuste, o (c)(11) Parole.",
    uscisFee: 410, // General fee, though c8 is free for first time. We'll use 410 as base standard
    requiredDocs: ["Pasaporte Biográfico", "I-94 o Sello de Entrada", "Prueba de trámite pendiente (I-589 / I-485)", "EAD Anterior (Si es renovación)"],
    tasks: { needsPhotos: true, needsBiometrics: true, needsMedical: false, needsMoneyOrder: true }
  },
  {
    id: "ssn",
    code: "SS-5",
    name: "Trámite de Seguro Social (SSN)",
    category: "Empleo e Identificación Oficial",
    description: "Gestión para la obtención del Número de Seguro Social asociado a un permiso de trabajo.",
    uscisFee: 0,
    requiredDocs: ["Tarjeta EAD (I-766)", "Pasaporte Vigente", "Acta de Nacimiento (con traducción)"],
    tasks: { needsPhotos: false, needsBiometrics: false, needsMedical: false, needsMoneyOrder: false }
  },
  
  // CATEGORÍA 3: Familia y Residencia Permanente
  {
    id: "petition",
    code: "I-130",
    name: "Petición de Familiar Extranjero",
    category: "Familia y Residencia Permanente",
    description: "Petición inicial para cónyuges, hijos, padres o hermanos de un Ciudadano o Residente.",
    uscisFee: 535,
    requiredDocs: ["Prueba de Ciudadanía/Residencia del Peticionario", "Certificado de Matrimonio", "Actas de Nacimiento", "Pruebas de Relación de Buena Fe"],
    tasks: { needsPhotos: true, needsBiometrics: false, needsMedical: false, needsMoneyOrder: true }
  },
  {
    id: "aos",
    code: "I-485",
    name: "Ajuste de Estatus (Residencia Permanente)",
    category: "Familia y Residencia Permanente",
    description: "Solicitud para obtener la Green Card (Residencia) dentro de los Estados Unidos.",
    uscisFee: 1225, // Including biometrics
    requiredDocs: ["Pasaporte", "Acta de Nacimiento", "I-94", "I-797 de Petición Aprobada o Pendiente", "Declaración de Apoyo I-864"],
    tasks: { needsPhotos: true, needsBiometrics: true, needsMedical: true, needsMoneyOrder: true }
  },
  {
    id: "waiver",
    code: "I-601A",
    name: "Perdón Provisional por Presencia Ilegal",
    category: "Familia y Residencia Permanente",
    description: "Perdón por presencia ilegal antes de salir del país para entrevista consular.",
    uscisFee: 715,
    requiredDocs: ["Prueba de Sufrimiento Extremo (Extreme Hardship)", "I-130 Aprobada", "Pasaporte", "Evidencias Financieras y Médicas del Peticionario"],
    tasks: { needsPhotos: false, needsBiometrics: true, needsMedical: false, needsMoneyOrder: true }
  },

  // CATEGORÍA 4: Ciudadanía y Mantenimiento
  {
    id: "green_card_renewal",
    code: "I-90",
    name: "Renovación/Reemplazo de Green Card",
    category: "Ciudadanía y Mantenimiento",
    description: "Renovar una residencia de 10 años o reemplazar una tarjeta perdida/robada.",
    uscisFee: 455,
    requiredDocs: ["Copia de Tarjeta Residente (Frente y Vuelta)", "Identificación Oficial", "Denuncia policial (Si fue robada)"],
    tasks: { needsPhotos: false, needsBiometrics: true, needsMedical: false, needsMoneyOrder: true }
  },
  {
    id: "conditions",
    code: "I-751",
    name: "Remoción de Condiciones de Residencia",
    category: "Ciudadanía y Mantenimiento",
    description: "Convertir la residencia condicional por matrimonio (2 años) a permanente (10 años).",
    uscisFee: 595,
    requiredDocs: ["Green Card de 2 años", "Pruebas de Vida en Común (Bancos, Impuestos, Arriendos)", "Declaraciones Juradas de 2 testigos"],
    tasks: { needsPhotos: false, needsBiometrics: true, needsMedical: false, needsMoneyOrder: true }
  },
  {
    id: "citizenship",
    code: "N-400",
    name: "Solicitud de Naturalización (Ciudadanía)",
    category: "Ciudadanía y Mantenimiento",
    description: "Convertirse en Ciudadano Estadounidense tras 3 o 5 años de Residencia.",
    uscisFee: 725,
    requiredDocs: ["Green Card", "Pasaporte vigente y expirados", "Historial de viajes (últimos 5 años)", "Taxes de los últimos 5 años", "Acta de Matrimonio/Divorcio"],
    tasks: { needsPhotos: true, needsBiometrics: true, needsMedical: false, needsMoneyOrder: true }
  }
];

export const getServicesByCategory = () => {
   const categorized: Record<string, ImmigrationService[]> = {};
   servicesCatalog.forEach(service => {
      if (!categorized[service.category]) {
         categorized[service.category] = [];
      }
      categorized[service.category].push(service);
   });
   return categorized;
};
