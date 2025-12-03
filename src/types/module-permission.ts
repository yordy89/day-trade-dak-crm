export enum ModuleType {
  CLASSES = 'classes',
  MASTER_CLASSES = 'masterClasses',
  LIVE_RECORDED = 'liveRecorded',
  PSICOTRADING = 'psicotrading',
  PEACE_WITH_MONEY = 'peaceWithMoney',
  LIVE_WEEKLY = 'liveWeekly',
  COMMUNITY_EVENTS = 'communityEvents',
  VIP_EVENTS = 'vipEvents',
  MASTER_COURSE = 'masterCourse',
  STOCKS = 'stocks',
  SUPPORT_VIDEOS = 'supportVideos',
  TRADING_JOURNAL = 'tradingJournal',
}

export interface ModuleAccessResponse {
  hasAccess: boolean;
  userId: string;
  moduleType: ModuleType;
}

export const MODULE_DISPLAY_NAMES: Record<ModuleType, { es: string; en: string }> = {
  [ModuleType.CLASSES]: { es: 'Clases', en: 'Classes' },
  [ModuleType.MASTER_CLASSES]: { es: 'Masterclass', en: 'Master Classes' },
  [ModuleType.LIVE_RECORDED]: { es: 'Live Grabados', en: 'Live Recorded' },
  [ModuleType.PSICOTRADING]: { es: 'Psicotrading', en: 'Psicotrading' },
  [ModuleType.PEACE_WITH_MONEY]: { es: 'Paz con el Dinero', en: 'Peace with Money' },
  [ModuleType.LIVE_WEEKLY]: { es: 'Live Semanal', en: 'Live Weekly' },
  [ModuleType.COMMUNITY_EVENTS]: { es: 'Eventos Comunitarios', en: 'Community Events' },
  [ModuleType.VIP_EVENTS]: { es: 'Eventos VIP', en: 'VIP Events' },
  [ModuleType.MASTER_COURSE]: { es: 'Master Course', en: 'Master Course' },
  [ModuleType.STOCKS]: { es: 'Acciones', en: 'Stocks' },
  [ModuleType.SUPPORT_VIDEOS]: { es: 'Videos de Soporte', en: 'Support Videos' },
  [ModuleType.TRADING_JOURNAL]: { es: 'Diario de Trading', en: 'Trading Journal' },
}