import { features } from './features';

export interface NavigationItem {
  key: string;
  href?: string;
  external?: boolean;
  requiresAuth?: boolean;
  icon?: string;
  badge?: string;
  featureFlag?: keyof typeof features;
}

const allNavigationItems: NavigationItem[] = [
  {
    key: 'home',
    href: '/',
    requiresAuth: false,
  },
  {
    key: 'academy',
    href: '/academy/overview',
    requiresAuth: true,
  },
  // {
  //   key: 'stocks',
  //   href: '/stocks',
  //   requiresAuth: false,
  //   badge: 'LIVE',
  // },
  // {
  //   key: 'tools',
  //   href: '/tools',
  //   requiresAuth: true,
  // },
  // {
  //   key: 'masterCourse',
  //   href: '/master-course',
  //   requiresAuth: false,
  //   badge: 'NEW',
  // },
  {
    key: 'communityEvent',
    href: '/community-event',
    requiresAuth: false,
    badge: 'EXCLUSIVE',
  },
  {
    key: 'live',
    href: '/live',
    requiresAuth: true,
    featureFlag: 'meetings',
  },
  // {
  //   key: 'event',
  //   href: '/events/680fe27154c9b64e54e2424f',
  //   requiresAuth: false,
  // },
  {
    key: 'shop',
    href: 'https://www.etsy.com/shop/DayTradeDak', // TODO: Replace with actual Etsy shop URL
    external: true,
    requiresAuth: false,
  },
  {
    key: 'about',
    href: '/about',
    requiresAuth: false,
  },
  {
    key: 'books',
    href: '/books',
    requiresAuth: false,
  },
  // {
  //   key: 'community',
  //   href: '/community',
  //   requiresAuth: false,
  // },
  {
    key: 'contact',
    href: '/contact',
    requiresAuth: false,
  },
];

// Filter navigation items based on feature flags
export const mainNavigation: NavigationItem[] = allNavigationItems.filter(item => {
  if (item.featureFlag) {
    const feature = features[item.featureFlag];
    return feature?.enabled;
  }
  return true;
});

// Helper function to get navigation item by key
export const getNavigationItem = (key: string): NavigationItem | undefined => {
  return mainNavigation.find(item => item.key === key);
};

// Helper function to filter navigation items based on authentication
export const getVisibleNavigation = (_isAuthenticated: boolean): NavigationItem[] => {
  // All items are visible, but protected routes will redirect if not authenticated
  return mainNavigation;
};