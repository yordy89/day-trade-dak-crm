export const paths = {
  home: '/',
  about: '/about',
  auth: { 
    signIn: '/auth/sign-in', 
    signUp: '/auth/sign-up', 
    resetPassword: '/auth/reset-password',
    resetPasswordConfirm: '/auth/reset-password/confirm'
  },
  terms: {
    terms: '/terms/terms-conditions',
  },
  academy: {
    overview: '/academy/overview',
    market: '/academy/market',
    earnings: '/academy/earnings',
    mentorship: '/academy/masterclass',
    class: '/academy/classes',
    liveSessions: '/academy/live-sessions',
    courses: '/academy/classes',
    stock: '/academy/stock',
    stocks: '/academy/stock',
    psicotrading: '/academy/psicotrading',
    supportVideos: '/academy/support-videos',
    books: '/academy/books',
    companies: '/academy/companies',
    calendar: '/academy/calendar',
    phases: '/academy/phases',
    account: '/academy/account',
    customers: '/academy/customers',
    integrations: '/academy/integrations',
    settings: '/academy/settings',
    subscriptions: {
      plans: '/academy/subscription/plans',
      success: '/academy/subscription/success',
    },
    personalGrowth: {
      peaceWithMoney: '/academy/personal-growth/peace-with-money',
      mind: '/academy/personal-growth/mind'
    },
    superation: {
      proposit: '/academy/personal-growth/peace-with-money',
      mind: '/academy/personal-growth/mind'
    },
    tradingJournal: {
      trades: '/academy/trading-journal',
      add: '/academy/trading-journal/add',
      edit: '/academy/trading-journal/edit',
      analytics: '/academy/trading-journal/analytics'
    }
  },
  errors: { notFound: '/errors/not-found' },
} as const;
