export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
  tradingPhase?: number;
  subscriptions: string[];
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
  FREE = 'Free',
  BASIC = 'Basic',
  PRO = 'Pro',
  ENTERPRISE = 'Enterprise',
  MENTORSHIP = 'Mentorship',
  CLASS = 'Class',
  STOCK = 'Stock',
  PSICOTRADING = 'Psicotrading',
  MONEYPEACE = 'MoneyPeace'
}

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}
