export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
  tradingPhase?: number;
  subscriptions: any[]; // Can be string[] or detailed subscription objects
  activeSubscriptions?: string[];
  expiredSubscriptions?: string[];
  role: Role;
  phone?: string;
  state?: string;
  city?: string;
  createdAt?: string;
  updatedAt?: string;
}

export enum SubscriptionPlan {
  // Community Subscriptions (Weekly)
  LIVE_WEEKLY_MANUAL = 'LiveWeeklyManual',
  LIVE_WEEKLY_RECURRING = 'LiveWeeklyRecurring',
  
  // Recurring Monthly Subscriptions
  MASTER_CLASES = 'MasterClases',
  LIVE_RECORDED = 'LiveRecorded',
  PSICOTRADING = 'Psicotrading',
  
  // One-Time Purchases
  CLASSES = 'Classes',
  PEACE_WITH_MONEY = 'PeaceWithMoney',
  MASTER_COURSE = 'MasterCourse',
  COMMUNITY_EVENT = 'CommunityEvent',
  VIP_EVENT = 'VipEvent',
}

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}
