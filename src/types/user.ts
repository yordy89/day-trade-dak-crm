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
  customClassAccess?: {
    reason: string;
  };
}

export enum SubscriptionPlan {
  // Community Subscriptions (Weekly)
  LiveWeeklyManual = 'LiveWeeklyManual',
  LiveWeeklyRecurring = 'LiveWeeklyRecurring',
  
  // Recurring Monthly Subscriptions
  MasterClases = 'MasterClases',
  LiveRecorded = 'LiveRecorded',
  PSICOTRADING = 'Psicotrading',
  
  // One-Time Purchases
  CLASSES = 'Classes',
  PeaceWithMoney = 'PeaceWithMoney',
  MasterCourse = 'MasterCourse',
  CommunityEvent = 'CommunityEvent',
  VipEvent = 'VipEvent',
}

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}
