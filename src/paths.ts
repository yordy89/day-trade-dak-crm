export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  terms: {
    terms: '/terms/terms-conditions',
  },
  admin: {
    users: '/admin'
  },
  dashboard: {
    overview: '/dashboard/overview',
    mentorship: '/dashboard/mentorship',
    class: '/dashboard/class',
    stocks: '/dashboard/stock',
    psicotrading: '/dashboard/psicotrading',
    books: '/dashboard/books',
    companies: '/dashboard/companies',
    calendar: '/dashboard/calendar',
    phases: '/dashboard/phases',
    account: '/dashboard/account',
    customers: '/dashboard/customers',
    integrations: '/dashboard/integrations',
    settings: '/dashboard/settings',
    subscriptions: {
      plans: '/dashboard/subscription/plans',
      success: '/dashboard/subscription/success',
    },
    superation: {
      proposit: '/dashboard/superation/proposit',
      mind: '/dashboard/superation/mind'
    }
  },
  errors: { notFound: '/errors/not-found' },
} as const;
