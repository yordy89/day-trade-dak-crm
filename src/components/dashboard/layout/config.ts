import { type NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';
import { SubscriptionPlan } from '@/types/user';

export const navItems = [
  { id: 'overview', title: 'Resumen', href: paths.dashboard.overview, icon: 'chart-pie' },
  { id: 'mentorship', title: 'Mentorías', href: paths.dashboard.mentorship, icon: 'users', requiredSubscription: SubscriptionPlan.MENTORSHIP },
  // { id: 'companies', title: 'Companies', href: paths.dashboard.companies, icon: 'companies', requiredSubscription: SubscriptionPlan.PRO  },
  // { id: 'calendar', title: 'Calendar', href: paths.dashboard.calendar, icon: 'calendar', requiredSubscription: SubscriptionPlan.PRO },
  // { id: 'phases', title: 'Phases', href: paths.dashboard.phases, icon: 'chart-pie' },
  // { key: 'customers', title: 'Customers', href: paths.dashboard.customers, icon: 'users' },
  // { key: 'integrations', title: 'Integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' },
  // { id: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  { id: 'account', title: 'Perfil', href: paths.dashboard.account, icon: 'user' },
  // { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
