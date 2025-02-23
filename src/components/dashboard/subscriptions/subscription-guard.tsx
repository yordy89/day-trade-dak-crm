'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { paths } from '@/paths';

export interface SubscriptionGuardProps {
  children: React.ReactNode;
  requiredSubscription: string; // Subscription required for access
}

export function SubscriptionGuard({ children, requiredSubscription }: SubscriptionGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const userSubscriptions = useAuthStore((state) => state.user?.subscriptions || []);
  const [isChecking, setIsChecking] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (!userSubscriptions.includes(requiredSubscription)) {
      router.replace(paths.dashboard.subscriptions.plans); // Redirect if the user lacks access
    } else {
      setIsChecking(false);
    }
  }, [userSubscriptions, requiredSubscription, router]);

  if (isChecking) {
    return null; // Render nothing while checking
  }

  return <>{children}</>;
}
