export type ZoneId = 'Z' | 'A' | 'B' | 'C' | 'D';

export interface ZoneInfo {
  id: ZoneId;
  name: string;
  badge: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  items: string[];
  rule: string;
}

export interface Chapter {
  id: string; // e.g. "ch-01"
  number: number;
  title: string;
  category: string;
  scenario: string;
  why: string;
  action: string;
  correct?: string;
  wrong?: string;
}

export interface ScenarioQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ScenarioItem {
  id: string; // e.g. "sc-01"
  number: number;
  title: string;
  environment: string;
  description: string;
  questions: ScenarioQuestion[];
}

export interface DryToWetIncident {
  id: string;
  timestamp: string;
  item: string;
  source: string;
  severity: string;
  actionTaken: string;
}

export interface ContaminationCase {
  id: string;
  item: string;
  contaminatedBy: string;
  quarantineZone: string;
  isManuallyResolved: boolean;
  resolvedAt?: string;
  resolvedNote?: string;
}

export interface DayLedgerData {
  dayNumber: number;
  date: string;
  routeSegment: string;
  weatherSummary: string;
  envRisks: string[];
  zones: {
    Z: { status: 'safe' | 'warning' | 'alert'; moistureLevel: string; notes: string };
    A: { status: 'safe' | 'warning' | 'alert'; moistureLevel: string; notes: string };
    B: { status: 'safe' | 'warning' | 'alert'; moistureLevel: string; notes: string };
    C: { status: 'safe' | 'warning' | 'alert'; moistureLevel: string; notes: string };
    D: { status: 'safe' | 'warning' | 'alert'; moistureLevel: string; notes: string };
  };
  marchingDefense: {
    baseLayerDrying: boolean;
    ventPitsOpen: boolean;
    paceAdjustedForSweat: boolean;
    glovesProtection: boolean;
    notes: string;
  };
  goldenFiveMinutes: {
    completedImmediately: boolean;
    rainJacketRemovedBeforeTent: boolean;
    dryZoneBagSealed: boolean;
    warmLayersDoffedInside: boolean;
    notes: string;
  };
  coreGear: {
    sleepingBagDry: boolean;
    downJacketDry: boolean;
    spareClothesDry: boolean;
    insoleMoisturePercent: number;
  };
  tentManagement: {
    outerCondensation: 'none' | 'light' | 'moderate' | 'heavy';
    innerDripping: boolean;
    dripLocations: string[];
    tarpVented: boolean;
    footboxClearOfFly: boolean;
    alertMessage?: string;
  };
  dryToWetIncidents: DryToWetIncident[];
  contaminations: ContaminationCase[];
  moistureBudget: {
    estimatedSweatLiters: number;
    ambientHumidityPercent: number;
    absorbedMoistureGrams: number;
    remainingDryBuffer: string;
  };
  dayNotes: string;
}

export interface LedgerStore {
  days: DayLedgerData[];
  currentDayIndex: number;
  updatedAt: string;
}
