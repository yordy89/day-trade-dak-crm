import { CDN_PROVIDER } from '@/config/cdn.config';
import { CloudFrontCDN } from './providers/cloudfront.provider';
import { BunnyCDN } from './providers/bunnycdn.provider';
import { CloudflareCDN } from './providers/cloudflare.provider';
import type { ICDNProvider } from './cdn.interface';

/**
 * CDN Service - Abstraction layer for multiple CDN providers
 * Makes it easy to switch between CloudFront, BunnyCDN, etc.
 */
class CDNService {
  private provider: ICDNProvider;

  constructor() {
    this.provider = this.initializeProvider();
  }

  private initializeProvider(): ICDNProvider {
    switch (CDN_PROVIDER) {
      case 'cloudfront':
        return new CloudFrontCDN();
      case 'bunnycdn':
        return new BunnyCDN();
      case 'cloudflare':
        return new CloudflareCDN();
      default:
        // Default to CloudFront
        return new CloudFrontCDN();
    }
  }

  /**
   * Get video URL - automatically uses the configured CDN
   */
  getVideoUrl(videoPath: string): string {
    return this.provider.getVideoUrl(videoPath);
  }

  /**
   * Get signed URL if CDN supports it
   */
  async getSignedUrl(videoPath: string, expiresIn?: number): Promise<string> {
    if (this.provider.supportsSignedUrls()) {
      return this.provider.getSignedUrl(videoPath, expiresIn);
    }
    return this.getVideoUrl(videoPath);
  }

  /**
   * Get thumbnail URL
   */
  getThumbnailUrl(thumbnailPath: string): string {
    return this.provider.getThumbnailUrl(thumbnailPath);
  }

  /**
   * Get current CDN provider name
   */
  getCurrentProvider(): string {
    return CDN_PROVIDER;
  }

  /**
   * Check if current CDN supports feature
   */
  supportsFeature(feature: 'signing' | 'headers' | 'analytics'): boolean {
    switch (feature) {
      case 'signing':
        return this.provider.supportsSignedUrls();
      default:
        return false;
    }
  }

  /**
   * Get CDN-specific headers if needed
   */
  getHeaders(): Record<string, string> {
    return this.provider.getHeaders();
  }

  /**
   * Get the CDN domain
   */
  getDomain(): string {
    return this.provider.getDomain();
  }
}

// Export singleton instance
export const cdnService = new CDNService();