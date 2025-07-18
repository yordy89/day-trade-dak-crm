export const paths = {
  home: '/',
  about: '/about',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  terms: {
    terms: '/terms/terms-conditions',
  },
  academy: {
    overview: '/academy/overview',
    market: '/academy/market',
    earnings: '/academy/earnings',
    mentorship: '/academy/masterclass',
    class: '/academy/live-sessions',
    courses: '/academy/classes',
    stocks: '/academy/stock',
    psicotrading: '/academy/psicotrading',
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
    superation: {
      proposit: '/academy/personal-growth/peace-with-money',
      mind: '/academy/personal-growth/mind'
    }
  },
  errors: { notFound: '/errors/not-found' },
} as const;
