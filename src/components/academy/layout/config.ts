import { type NavItemConfig } from '@/types/nav';
import { SubscriptionPlan } from '@/types/user';
import { paths } from '@/paths';
import type { TFunction } from 'i18next';

export const getNavItems = (t: TFunction): NavItemConfig[] => [
  { id: 'home', title: t('academy:navigation.home'), href: paths.home, icon: 'house' },
  { id: 'overview', title: t('academy:navigation.dashboard'), href: paths.academy.overview, icon: 'chart-pie' },
  { 
    id: 'courses', 
    title: t('academy:navigation.classes'), 
    href: paths.academy.class, 
    icon: 'graduation',
    requiredSubscription: SubscriptionPlan.CLASSES,
  },
  {
    id: 'mentorship',
    title: t('academy:navigation.masterClasses'),
    href: paths.academy.mentorship,
    icon: 'mentorship',
    requiredSubscription: SubscriptionPlan.MasterClases,
  },
  {
    id: 'live-sessions',
    title: t('academy:navigation.recordedLiveSessions'),
    href: paths.academy.liveSessions,
    icon: 'class',
    requiredSubscription: SubscriptionPlan.LiveRecorded,
  },
  {
    id: 'psicotrading',
    title: t('academy:navigation.psicoTrading'),
    href: paths.academy.psicotrading,
    icon: 'psicotrading',
    requiredSubscription: SubscriptionPlan.PSICOTRADING,
  },
  // Hidden for now - will be enabled in the future
  // {
  //   id: 'stocks',
  //   title: t('academy:navigation.stocks'),
  //   href: paths.academy.stocks,
  //   icon: 'trending-up',
  //   requiredSubscription: SubscriptionPlan.Stocks,
  // },
  // Trading Journal - Hidden until feature is complete
  // {
  //   id: 'trading-journal',
  //   title: t('academy:navigation.tradingJournal'),
  //   href: paths.academy.tradingJournal.trades,
  //   icon: 'notebook',
  // },
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
