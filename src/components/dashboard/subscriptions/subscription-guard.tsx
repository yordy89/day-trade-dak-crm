'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

import { paths } from '@/paths';
import { Role } from '@/types/user';

export interface SubscriptionGuardProps {
  children: React.ReactNode;
  requiredSubscription: string; // Subscription required for access
}

export function SubscriptionGuard({
  children,
  requiredSubscription,
}: SubscriptionGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const userSubscriptions = user?.subscriptions || [];
  const userRole = user?.role || 'user'; // Default to 'user' if role is missing

  const [isChecking, setIsChecking] = React.useState<boolean>(true);

  React.useEffect(() => {
    // ✅ Allow admins to access all pages
    if (userRole === Role.ADMIN || userSubscriptions.includes(requiredSubscription)) {
      setIsChecking(false); // Admins & users with a valid subscription can proceed
    } else {
      router.replace(paths.dashboard.subscriptions.plans); // Redirect unauthorized users
    }
  }, [userRole, userSubscriptions, requiredSubscription, router]);

  if (isChecking) {
    return null; // Render nothing while checking
  }

  return <>{children}</>;
}
