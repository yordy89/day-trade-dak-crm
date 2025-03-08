export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  terms: {
    terms: '/terms/terms-conditions',
  },
  dashboard: {
    overview: '/dashboard/overview',
    mentorship: '/dashboard/mentorship',
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
  },
  errors: { notFound: '/errors/not-found' },
} as const;
