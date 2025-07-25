import type { SubscriptionPlan, Role } from './user';

export interface NavItemConfig {
  id: string;
  title?: string;
  disabled?: boolean;
  external?: boolean;
  label?: string;
  icon?: string;
  href?: string;
  items?: NavItemConfig[];
  badge?: string;
  // Matcher cannot be a function in order
  // to be able to use it on the server.
  // If you need to match multiple paths,
  // can extend it to accept multiple matchers.
  matcher?: { type: 'startsWith' | 'equals'; href: string };
  requiredSubscription?: SubscriptionPlan;
  requiredRole?: Role;
}