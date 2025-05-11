import { type NavItemConfig } from '@/types/nav';
import { Role, SubscriptionPlan } from '@/types/user';
import { paths } from '@/paths';

export const navItems = [
  { id: 'overview', title: 'Resumen', href: paths.dashboard.overview, icon: 'chart-pie' },
  {
    id: 'mentorship',
    title: 'Mentorías',
    href: paths.dashboard.mentorship,
    icon: 'mentorship',
    requiredSubscription: SubscriptionPlan.MENTORSHIP,
  },
  {
    id: 'class',
    title: 'Clases',
    href: paths.dashboard.class,
    icon: 'class',
    requiredSubscription: SubscriptionPlan.CLASS,
  },
  {
    id: 'psicotrading',
    title: 'PsicoTrading',
    href: paths.dashboard.psicotrading,
    icon: 'psicotrading',
    requiredSubscription: SubscriptionPlan.PSICOTRADING,
  },
  // { id: 'class', title: 'Stocks Videos', href: paths.dashboard.stocks, icon: 'stocks', requiredSubscription: SubscriptionPlan.STOCK},
  { id: 'books', title: 'Libros', href: paths.dashboard.books, icon: 'book' },
  // { id: 'companies', title: 'Companies', href: paths.dashboard.companies, icon: 'companies', requiredSubscription: SubscriptionPlan.PRO  },
  // { id: 'calendar', title: 'Calendar', href: paths.dashboard.calendar, icon: 'calendar', requiredSubscription: SubscriptionPlan.PRO },
  // { id: 'phases', title: 'Phases', href: paths.dashboard.phases, icon: 'chart-pie' },
  // { key: 'customers', title: 'Customers', href: paths.dashboard.customers, icon: 'users' },
  // { key: 'integrations', title: 'Integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' },
  // { id: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  { id: 'account', title: 'Perfil', href: paths.dashboard.account, icon: 'user' },
  { id: 'admin', title: 'Admin', href: paths.admin.users, icon: 'user', requiredRole: Role.ADMIN },
  // { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
