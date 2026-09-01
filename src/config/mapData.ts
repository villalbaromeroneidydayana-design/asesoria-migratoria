export interface StateImmigrationData {
  id: string;
  name: string;
  cooperationLevel: 'High' | 'Moderate' | 'Sanctuary';
  borderZone100Miles: boolean;
  courtSaturated: boolean;
  courtWaitTimeDays: number;
  asylumApprovalRate: string;
  eoirCourtName: string;
  eoirAddress: string;
  localLaws: string;
}

export const mapData: StateImmigrationData[] = [
  {
    id: "TX",
    name: "Texas",
    cooperationLevel: "High",
    borderZone100Miles: true,
    courtSaturated: true,
    courtWaitTimeDays: 850,
    asylumApprovalRate: "25%",
    eoirCourtName: "Houston / Dallas Immigration Court",
    eoirAddress: "1100 Commerce St, Dallas, TX / 1801 Smith St, Houston, TX",
    localLaws: "Alerta Alta: La Ley SB4 permite a la policía estatal y local arrestar y deportar a personas bajo sospecha de cruzar la frontera irregularmente. Máxima precaución en retenes."
  },
  {
    id: "FL",
    name: "Florida",
    cooperationLevel: "High",
    borderZone100Miles: true,
    courtSaturated: true,
    courtWaitTimeDays: 750,
    asylumApprovalRate: "30%",
    eoirCourtName: "Miami / Orlando Immigration Court",
    eoirAddress: "333 South Miami Ave, Miami, FL 33130",
    localLaws: "Alerta Alta: La Ley SB 1718 criminaliza el transporte de indocumentados, invalida licencias de otros estados y exige a ciertos hospitales recopilar estatus migratorio."
  },
  {
    id: "CA",
    name: "California",
    cooperationLevel: "Sanctuary",
    borderZone100Miles: true, // Only coastal/southern parts, but generally flagged
    courtSaturated: true,
    courtWaitTimeDays: 680,
    asylumApprovalRate: "55%",
    eoirCourtName: "Los Angeles / San Francisco Immigration Court",
    eoirAddress: "606 S Olive St, Los Angeles, CA 90014",
    localLaws: "Zona de Protección (Estado Santuario): La Ley SB 54 restringe severamente la cooperación de la policía local con ICE. Existen licencias de conducir para indocumentados (AB 60)."
  },
  {
    id: "NY",
    name: "New York",
    cooperationLevel: "Sanctuary",
    borderZone100Miles: true, // NYC and borders
    courtSaturated: true,
    courtWaitTimeDays: 710,
    asylumApprovalRate: "65%",
    eoirCourtName: "New York - Broadway Immigration Court",
    eoirAddress: "26 Federal Plaza, New York, NY 10278",
    localLaws: "Zona de Protección: Políticas santuario fuertes en NYC y otras ciudades. Acceso a licencias de conducir (Green Light Law) y protección contra discriminación migratoria."
  },
  {
    id: "IL",
    name: "Illinois",
    cooperationLevel: "Sanctuary",
    borderZone100Miles: false,
    courtSaturated: false,
    courtWaitTimeDays: 540,
    asylumApprovalRate: "45%",
    eoirCourtName: "Chicago Immigration Court",
    eoirAddress: "525 West Van Buren Street, Chicago, IL 60607",
    localLaws: "Zona de Protección: El TRUST Act prohíbe a la policía local detener a personas basándose únicamente en su estatus migratorio o en detainer requests de ICE."
  },
  {
    id: "GA",
    name: "Georgia",
    cooperationLevel: "Moderate",
    borderZone100Miles: true, // coastal
    courtSaturated: true,
    courtWaitTimeDays: 920,
    asylumApprovalRate: "15%",
    eoirCourtName: "Atlanta Immigration Court",
    eoirAddress: "2175 Northlake Parkway, Tucker, GA 30084",
    localLaws: "Alerta Moderada/Alta: Varias jurisdicciones colaboran activamente con ICE (287(g)). Alto riesgo de deportación por infracciones de tránsito. Tasas de aprobación de asilo históricamente bajas."
  }
];
