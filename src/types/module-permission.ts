export enum ModuleType {
  Classes = 'classes',
  MasterClasses = 'masterClasses',
  LiveRecorded = 'liveRecorded',
  Psicotrading = 'psicotrading',
  PeaceWithMoney = 'peaceWithMoney',
  LiveWeekly = 'liveWeekly',
  CommunityEvents = 'communityEvents',
  VipEvents = 'vipEvents',
  MasterCourse = 'masterCourse',
  Stocks = 'stocks',
}

export interface ModuleAccessResponse {
  hasAccess: boolean;
  userId: string;
  moduleType: ModuleType;
}

export const MODULE_DISPLAY_NAMES: Record<ModuleType, { es: string; en: string }> = {
  [ModuleType.Classes]: { es: 'Clases', en: 'Classes' },
  [ModuleType.MasterClasses]: { es: 'Masterclass', en: 'Master Classes' },
  [ModuleType.LiveRecorded]: { es: 'Live Grabados', en: 'Live Recorded' },
  [ModuleType.Psicotrading]: { es: 'Psicotrading', en: 'Psicotrading' },
  [ModuleType.PeaceWithMoney]: { es: 'Paz con el Dinero', en: 'Peace with Money' },
  [ModuleType.LiveWeekly]: { es: 'Live Semanal', en: 'Live Weekly' },
  [ModuleType.CommunityEvents]: { es: 'Eventos Comunitarios', en: 'Community Events' },
  [ModuleType.VipEvents]: { es: 'Eventos VIP', en: 'VIP Events' },
  [ModuleType.MasterCourse]: { es: 'Master Course', en: 'Master Course' },
  [ModuleType.Stocks]: { es: 'Acciones', en: 'Stocks' },
}