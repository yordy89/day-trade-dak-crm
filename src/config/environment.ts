/**
 * Environment configuration
 * Determines which environment the application is running in
 * and provides appropriate configuration values
 */

export type Environment = 'development' | 'staging' | 'production';

/**
 * Get the current environment based on various factors
 */
export function getEnvironment(): Environment {
  // Check NEXT_PUBLIC_ENVIRONMENT first (explicit override)
  if (process.env.NEXT_PUBLIC_ENVIRONMENT) {
    return process.env.NEXT_PUBLIC_ENVIRONMENT as Environment;
  }

  // Check NODE_ENV
  if (process.env.NODE_ENV === 'production') {
    // In production build, check the domain to determine if it's staging or production
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      
      // Add your production domain(s) here
      const productionDomains = [
        'daytradedak.com',
        'www.daytradedak.com',
        // Add any other production domains
      ];
      
      // Add your staging domain(s) here
      const stagingDomains = [
        'staging.daytradedak.com',
        'daytradedak.vercel.app',
        // Add any other staging domains
      ];
      
      if (productionDomains.includes(hostname)) {
        return 'production';
      }
      
      if (stagingDomains.includes(hostname)) {
        return 'staging';
      }
    }
    
    // Default to production if we can't determine from hostname
    return 'production';
  }
  
  // Default to development
  return 'development';
}

/**
 * Get the appropriate Stripe publishable key based on environment
 */
export function getStripePublishableKey(): string {
  const env = getEnvironment();
  
  // For now, use test key for both development and staging
  // Only use live key in production
  if (env === 'production') {
    // Check if production key is available
    const prodKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_PRODUCTION;
    if (prodKey) {
      return prodKey;
    }
  }
  
  // Default to test key (current NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is test key)
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
}

/**
 * Get the API URL based on environment
 */
export function getApiUrl(): string {
  const env = getEnvironment();
  
  // Check for explicit API URL override
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Default URLs based on environment
  switch (env) {
    case 'production':
      return process.env.NEXT_PUBLIC_API_URL_PRODUCTION || 'https://api.daytradedak.com';
    case 'staging':
      return process.env.NEXT_PUBLIC_API_URL_STAGING || 'https://staging-api.daytradedak.com';
    default:
      return 'http://localhost:4000';
  }
}

/**
 * Check if we're in a production environment
 */
export function isProduction(): boolean {
  return getEnvironment() === 'production';
}

/**
 * Check if we're in a development environment
 */
export function isDevelopment(): boolean {
  return getEnvironment() === 'development';
}

/**
 * Check if we're in a staging environment
 */
export function isStaging(): boolean {
  return getEnvironment() === 'staging';
}

/**
 * Log the current environment (only in development)
 */
export function logEnvironment(): void {
  if (isDevelopment() && typeof window !== 'undefined') {
    console.log('[Environment Config]', {
      environment: getEnvironment(),
      stripeKey: getStripePublishableKey().substring(0, 10) + '...',
      apiUrl: getApiUrl(),
      hostname: window.location.hostname,
    });
  }
}