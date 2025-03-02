import { SubscriptionPlan } from '@/types/user';

export const mapMembershipName = (plan: SubscriptionPlan): string => {
  switch (plan) {
    case SubscriptionPlan.BASIC:
      return 'Basic';
    case SubscriptionPlan.PRO:
      return 'Pro';
    case SubscriptionPlan.ENTERPRISE:
      return 'Enterprise';
    case SubscriptionPlan.MENTORSHIP:
        return 'Mentorías';
    default:
      return plan;
  }
};
