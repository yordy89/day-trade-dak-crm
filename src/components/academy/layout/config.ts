import { type NavItemConfig } from '@/types/nav';
import { Role, SubscriptionPlan } from '@/types/user';
import { paths } from '@/paths';
import type { TFunction } from 'i18next';

export const getNavItems = (t: TFunction): NavItemConfig[] => [
  { id: 'overview', title: t('academy:navigation.dashboard'), href: paths.academy.overview, icon: 'chart-pie' },
  { 
    id: 'courses', 
    title: t('academy:navigation.classes'), 
    href: paths.academy.courses, 
    icon: 'graduation',
    requiredSubscription: SubscriptionPlan.CLASSES,
  },
  {
    id: 'mentorship',
    title: t('academy:navigation.masterClasses'),
    href: paths.academy.mentorship,
    icon: 'mentorship',
    requiredSubscription: SubscriptionPlan.MASTER_CLASES,
  },
  {
    id: 'class',
    title: t('academy:navigation.recordedLiveSessions'),
    href: paths.academy.class,
    icon: 'class',
    requiredSubscription: SubscriptionPlan.LIVE_RECORDED,
  },
  {
    id: 'psicotrading',
    title: t('academy:navigation.psicoTrading'),
    href: paths.academy.psicotrading,
    icon: 'psicotrading',
    requiredSubscription: SubscriptionPlan.PSICOTRADING,
  },
  {
    id: 'personal-growth',
    title: t('academy:navigation.personalGrowth'),
    icon: 'personal-growth',
    items: [
      {
        id: 'peace-with-money',
        title: t('academy:navigation.peaceWithMoney'),
        href: paths.academy.superation.proposit,
        icon: 'leaf',
      }
    ],
  },
  { id: 'subscriptions', title: t('academy:navigation.subscriptions'), href: paths.academy.subscriptions.plans, icon: 'credit-card' },
  { id: 'account', title: t('academy:navigation.myAccount'), href: paths.academy.account, icon: 'user' },
];
