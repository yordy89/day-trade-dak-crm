/**
 * CDN Configuration
 * Easily switch between different CDN providers by changing CDN_PROVIDER
 */

export type CDNProvider = 'cloudfront' | 'bunnycdn' | 'cloudflare' | 'custom';

// Change this to switch CDN providers
export const CDN_PROVIDER: CDNProvider = process.env.NEXT_PUBLIC_CDN_PROVIDER as CDNProvider || 'cloudfront';

// CDN Configurations
export const CDN_CONFIGS = {
  cloudfront: {
    domain: process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN || 'd3m2tao2a2xtek.cloudfront.net',
    protocol: 'https' as const,
    videoPath: 'hsl-daytradedak-videos/class-videos',
    supportsSigning: true,
    headers: {}
  },
  bunnycdn: {
    domain: process.env.NEXT_PUBLIC_BUNNYCDN_DOMAIN || 'youraccount.b-cdn.net',
    protocol: 'https' as const,
    videoPath: process.env.NEXT_PUBLIC_BUNNYCDN_VIDEO_PATH || 'videos',
    supportsSigning: true,
    headers: {
      'AccessKey': process.env.BUNNYCDN_ACCESS_KEY || ''
    }
  },
  cloudflare: {
    domain: process.env.NEXT_PUBLIC_CLOUDFLARE_DOMAIN || 'yoursubdomain.cloudflarestream.com',
    protocol: 'https' as const,
    videoPath: process.env.NEXT_PUBLIC_CLOUDFLARE_VIDEO_PATH || '',
    supportsSigning: true,
    headers: {}
  },
  custom: {
    domain: process.env.NEXT_PUBLIC_CDN_DOMAIN || '',
    protocol: 'https' as const,
    videoPath: process.env.NEXT_PUBLIC_CDN_VIDEO_PATH || '',
    supportsSigning: false,
    headers: {}
  }
};

// Get current CDN configuration
export const getCurrentCDNConfig = () => {
  return CDN_CONFIGS[CDN_PROVIDER];
};

// URL signing configurations (if needed)
export const SIGNING_CONFIGS = {
  cloudfront: {
    keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
    privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
  },
  bunnycdn: {
    authKey: process.env.BUNNYCDN_AUTH_KEY,
  },
  cloudflare: {
    // Cloudflare signing config
  }
};