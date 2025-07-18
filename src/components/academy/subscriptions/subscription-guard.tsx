'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useClientAuth } from '@/hooks/use-client-auth';

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
  const { user, userSubscriptions, userRole } = useClientAuth();

  const [isChecking, setIsChecking] = React.useState<boolean>(true);

  React.useEffect(() => {
    // Check for subscription with expiration
    const hasSubscriptionAccess = userSubscriptions.some(sub => {
      if (typeof sub === 'string') {
        return sub === requiredSubscription;
      } else if (sub && typeof sub === 'object' && 'plan' in sub) {
        // Check if it's the required plan
        if (sub.plan === requiredSubscription) {
          // If no expiresAt field, it's a permanent subscription
          if (!('expiresAt' in sub) || !sub.expiresAt) {
            return true;
          }
          // If has expiresAt, check if not expired
          return new Date(sub.expiresAt) > new Date();
        }
      }
      return false;
    });

    // ✅ Allow admins to access all pages
    if (userRole === Role.ADMIN || hasSubscriptionAccess) {
      setIsChecking(false); // Admins & users with a valid subscription can proceed
    } else {
      router.replace(paths.academy.subscriptions.plans); // Redirect unauthorized users
    }
  }, [userRole, userSubscriptions, requiredSubscription, router]);

  if (isChecking) {
    return null; // Render nothing while checking
  }

  return <>{children}</>;
}
