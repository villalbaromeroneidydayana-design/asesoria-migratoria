export interface NewsArticle {
  id: string;
  title: string;
  date: string;
  category: 'Alerta Federal' | 'USCIS' | 'Defensa en Corte' | 'Alivio Humanitario';
  summary: string;
  verifiedBy: string;
  content?: string;
}

export const newsArticles: NewsArticle[] = [
  {
    id: "news-01",
    title: "Análisis Legal: Cambios en Políticas de Frontera, Órdenes Ejecutivas y Cortes EOIR",
    date: "Actualizado Recientemente",
    category: "Alerta Federal",
    summary: "Evaluamos las últimas directrices sobre procesamientos en la frontera y cómo las nuevas órdenes ejecutivas afectan directamente a los casos de asilo pendientes.",
    verifiedBy: "✓ Revisado y verificado por Francisco Hernandez Jr., Esq. | State Bar #09515950"
  },
  {
    id: "news-02",
    title: "Tiempos Actualizados de Procesamiento USCIS para Permisos de Trabajo I-765",
    date: "Hace 2 días",
    category: "USCIS",
    summary: "Nuevas estimaciones de USCIS para la emisión de Tarjetas de Autorización de Empleo (EAD) bajo categorías C08 (Asilo) y C09 (Ajuste de Estatus). Conoce qué hacer si tu caso sufre retrasos.",
    verifiedBy: "✓ Revisado y verificado por Francisco Hernandez Jr., Esq. | State Bar #09515950"
  },
  {
    id: "news-03",
    title: "Qué Hacer ante una Notificación de Comparecencia (NTA) en Corte de Inmigración",
    date: "Hace 1 semana",
    category: "Defensa en Corte",
    summary: "Recibir una NTA marca el inicio formal de un proceso de deportación. Explicamos tus derechos, por qué no debes faltar a tu audiencia Master Calendar y cómo asegurar representación legal inmediata.",
    verifiedBy: "✓ Revisado y verificado por Francisco Hernandez Jr., Esq. | State Bar #09515950"
  },
  {
    id: "news-04",
    title: "Estatus de Protección Temporal (TPS) y Permisos de Viaje (Advance Parole)",
    date: "Hace 2 semanas",
    category: "Alivio Humanitario",
    summary: "Detalles críticos sobre los últimos anuncios de designación y extensión de TPS, además de los requisitos obligatorios para tramitar un I-131 Advance Parole antes de salir de los EE. UU.",
    verifiedBy: "✓ Revisado y verificado por Francisco Hernandez Jr., Esq. | State Bar #09515950"
  }
];
