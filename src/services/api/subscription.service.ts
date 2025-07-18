import API from '@/lib/axios';
import type { SubscriptionPlan } from '@/types/user';

export interface PlanPricing {
  baseAmount: number;
  currency: string;
  interval: 'monthly' | 'weekly' | 'yearly' | 'once';
  intervalCount: number;
}

export interface PlanUIMetadata {
  color: string;
  icon: string;
  badge?: string;
  popular: boolean;
  sortOrder: number;
}

export interface SubscriptionPlanData {
  planId: string;
  displayName: string;
  description: string;
  type: 'live' | 'course' | 'event' | 'bundle';
  pricing: PlanPricing;
  features: string[];
  uiMetadata: PlanUIMetadata;
  trialPeriodDays: number;
  hasConditionalPricing: boolean;
}

export interface CalculatedPrice {
  plan: SubscriptionPlan;
  originalPrice: number;
  finalPrice: number;
  discount: number;
  discountReason?: string;
  currency: string;
  isFree: boolean;
}

class SubscriptionService {
  /**
   * Get all available subscription plans (public endpoint)
   */
  async getPublicPlans(lang: 'en' | 'es' = 'en', type?: string): Promise<SubscriptionPlanData[]> {
    try {
      const params = new URLSearchParams({ lang });
      if (type) params.append('type', type);
      
      const response = await API.get(`/public/subscription-plans?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch subscription plans:', error);
      return [];
    }
  }

  /**
   * Get a specific subscription plan (public endpoint)
   */
  async getPublicPlan(planId: string, lang: 'en' | 'es' = 'en'): Promise<SubscriptionPlanData | null> {
    try {
      const response = await API.get(`/public/subscription-plans/${planId}?lang=${lang}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch subscription plan ${planId}:`, error);
      return null;
    }
  }

  /**
   * Get subscription plans with user-specific pricing (requires authentication)
   */
  async getPlansWithPricing(): Promise<{
    plans: SubscriptionPlanData[];
    pricing: CalculatedPrice[];
  }> {
    try {
      const response = await API.get('/subscriptions/plans/with-pricing');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch plans with pricing:', error);
      throw error;
    }
  }

  /**
   * Get user's active subscriptions
   */
  async getUserSubscriptions(userId: string): Promise<any[]> {
    try {
      const response = await API.get(`/subscriptions/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user subscriptions:', error);
      return [];
    }
  }

  /**
   * Map icon names to React components
   */
  getIconComponent(iconName: string): string {
    const iconMap: Record<string, string> = {
      'LiveTv': 'LiveTv',
      'Loop': 'Loop',
      'School': 'School',
      'VideoLibrary': 'VideoLibrary',
      'Star': 'Star',
      'Psychology': 'Psychology',
      'MoneyOff': 'MoneyOff',
      'Groups': 'Groups',
      'MenuBook': 'MenuBook',
    };
    return iconMap[iconName] || 'Star';
  }

  /**
   * Format price for display
   */
  formatPrice(amount: number, currency = 'usd'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount); // Already in dollars
  }

  /**
   * Get billing period text
   */
  getBillingPeriod(interval: string, intervalCount = 1, lang: 'en' | 'es' = 'en'): string {
    const periods: Record<string, Record<string, string>> = {
      en: {
        weekly: intervalCount === 1 ? '/week' : `/${intervalCount} weeks`,
        monthly: intervalCount === 1 ? '/month' : `/${intervalCount} months`,
        yearly: intervalCount === 1 ? '/year' : `/${intervalCount} years`,
        once: '',
      },
      es: {
        weekly: intervalCount === 1 ? '/semana' : `/${intervalCount} semanas`,
        monthly: intervalCount === 1 ? '/mes' : `/${intervalCount} meses`,
        yearly: intervalCount === 1 ? '/año' : `/${intervalCount} años`,
        once: '',
      },
    };
    return periods[lang][interval] || '';
  }
}

export const subscriptionService = new SubscriptionService();