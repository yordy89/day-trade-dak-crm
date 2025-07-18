import { SubscriptionPlan } from '@/types/user';

export const mapMembershipName = (plan: SubscriptionPlan): string => {
  switch (plan) {
    case SubscriptionPlan.LiveWeeklyManual:
      return 'Live Weekly Manual';
    case SubscriptionPlan.LiveWeeklyRecurring:
      return 'Live Weekly Recurring';
    case SubscriptionPlan.MasterClases:
      return 'Master Clases';
    case SubscriptionPlan.LiveRecorded:
      return 'Mentorías';
    case SubscriptionPlan.CLASSES:
      return 'Clases';
    case SubscriptionPlan.PSICOTRADING:
      return 'PsicoTrading';
    case SubscriptionPlan.PeaceWithMoney:
      return 'Paz Con El Dinero';
    case SubscriptionPlan.MasterCourse:
      return 'Master Course';
    case SubscriptionPlan.CommunityEvent:
      return 'Community Event';
    case SubscriptionPlan.VipEvent:
      return 'VIP Event';
    default:
      return plan;
  }
};
