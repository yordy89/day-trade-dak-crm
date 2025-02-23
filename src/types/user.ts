export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
  tradingPhase?: number;
  subscriptions: string[];
  roles?: string[];
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
}
