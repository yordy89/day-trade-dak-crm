export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard/overview',
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
