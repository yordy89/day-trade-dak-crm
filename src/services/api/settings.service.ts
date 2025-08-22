import API from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

export interface Settings {
  general?: Record<string, any>;
  social_media?: Record<string, any>;
  contact?: Record<string, any>;
  footer?: Record<string, any>;
  footer_es?: Record<string, any>;
  footer_en?: Record<string, any>;
  branding?: Record<string, any>;
  features?: Record<string, any>;
  [key: string]: Record<string, any> | undefined;
}

class SettingsService {
  private settings: Settings | null = null;
  private lastFetch = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async getSettings(): Promise<Settings> {
    const now = Date.now();
    
    // Return cached settings if still fresh
    if (this.settings && (now - this.lastFetch) < this.CACHE_DURATION) {
      return this.settings;
    }

    try {
      const response = await API.get('/settings/public');
      this.settings = response.data;
      this.lastFetch = now;
      return this.settings!;
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      // Return default settings on error
      return this.getDefaultSettings();
    }
  }

  getSetting(category: string, key: string, defaultValue?: any): any {
    return this.settings?.[category]?.[key] ?? defaultValue;
  }

  getLocalizedFooterSetting(key: string, lang: string = 'en'): string | null {
    const footerKey = `footer_${lang}`;
    
    // First try language-specific footer settings
    if (this.settings?.[footerKey]?.[key]) {
      return this.settings[footerKey][key];
    }
    
    // Fallback to general footer settings
    if (this.settings?.footer?.[key]) {
      return this.settings.footer[key];
    }
    
    return null;
  }

  private getDefaultSettings(): Settings {
    return {
      social_media: {
        facebook_url: 'https://www.facebook.com/daytradedak/',
        instagram_url: 'https://www.instagram.com/daytradedak/',
        youtube_url: 'https://www.youtube.com/channel/UCYp6JiX1ModSSZnnVLQATiA',
        twitter_url: 'https://twitter.com/daytradedak',
        linkedin_url: 'https://linkedin.com/company/daytradedak',
        telegram_url: 'https://t.me/daytradedak',
        tiktok_url: 'https://www.tiktok.com/@daytradedak',
      },
      contact: {
        contact_email: 'support@daytradedak.com',
        contact_phone: '+1 (786) 355-1346',
        contact_address: 'Miami, Florida, USA',
      },
      footer: {
        footer_copyright_text: '© {{year}} DayTradeDak. All rights reserved.',
        footer_company_description: 'Your trusted platform for professional trading. Training, mentorship and community for serious traders.',
      },
      footer_es: {
        footer_copyright_text: '© {{year}} DayTradeDak. Todos los derechos reservados.',
        footer_company_description: 'Tu plataforma de confianza para el trading profesional. Formación, mentoría y comunidad para traders serios.',
      },
      footer_en: {
        footer_copyright_text: '© {{year}} DayTradeDak. All rights reserved.',
        footer_company_description: 'Your trusted platform for professional trading. Training, mentorship and community for serious traders.',
      },
      branding: {
        company_name: 'DayTradeDak',
        logo_light_url: '/assets/logos/day_trade_dak_black_logo.png',
        logo_dark_url: '/assets/logos/day_trade_dak_white_logo.png',
      },
    };
  }

  clearCache(): void {
    this.settings = null;
    this.lastFetch = 0;
  }
}

export const settingsService = new SettingsService();

// React Query hook for using settings
export function useSettings(options?: UseQueryOptions<Settings>) {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsService.getSettings(),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    ...options,
  });
}

// Hook to get localized footer settings
export function useLocalizedFooterSettings() {
  const { data: settings } = useSettings();
  const { i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const footerKey = `footer_${lang}`;
  
  return {
    description: settings?.[footerKey]?.footer_company_description || 
                 settings?.footer?.footer_company_description || 
                 null,
    copyright: settings?.[footerKey]?.footer_copyright_text || 
               settings?.footer?.footer_copyright_text || 
               null,
  };
}

// Utility function to process copyright text
export function processCopyrightText(text: string): string {
  return text.replace('{{year}}', new Date().getFullYear().toString());
}