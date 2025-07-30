/**
 * Service to handle video URL processing and ensure proper CORS handling
 * Now uses CDN abstraction for easy switching between providers
 */

import { cdnService } from '../cdn/cdn.service';

const CLOUDFRONT_DOMAIN = process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN || 'd3m2tao2a2xtek.cloudfront.net';

class VideoUrlService {
  /**
   * Process a video URL to ensure it works in the current environment
   */
  processVideoUrl(url: string | null | undefined): string {
    if (!url) {
      console.warn('No video URL provided');
      return '';
    }

    // Log current CDN provider being used
    console.log('Using CDN provider:', cdnService.getCurrentProvider());

    // If it's a path without domain, use CDN service to build full URL
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return cdnService.getVideoUrl(url);
    }

    // ALWAYS use direct URLs for CDN
    // The SimpleHLSPlayer handles relative URL resolution properly
    return url;
  }

  /**
   * Extract video key from various URL formats
   */
  extractVideoKey(url: string): string {
    try {
      const urlObj = new URL(url);
      
      // Remove CDN domain and return the path
      const cdnDomain = cdnService.getDomain();
      if (urlObj.hostname === cdnDomain || urlObj.hostname === CLOUDFRONT_DOMAIN) {
        return urlObj.pathname.startsWith('/') ? urlObj.pathname.slice(1) : urlObj.pathname;
      }
      
      // For S3 URLs, extract the key after the bucket name
      if (urlObj.hostname.includes('s3.amazonaws.com')) {
        const pathParts = urlObj.pathname.split('/');
        // Remove empty string and bucket name
        pathParts.shift(); // Remove empty string from leading /
        pathParts.shift(); // Remove bucket name
        return pathParts.join('/');
      }
      
      // For proxy URLs, extract from the url parameter
      if (url.includes('/api/video-proxy')) {
        const params = new URLSearchParams(urlObj.search);
        const originalUrl = params.get('url');
        if (originalUrl) {
          return this.extractVideoKey(decodeURIComponent(originalUrl));
        }
      }
      
      // Default to the full URL
      return url;
    } catch (e) {
      console.error('Error extracting video key:', e);
      return url;
    }
  }

  /**
   * Check if a URL needs CORS proxy
   */
  needsProxy(url: string): boolean {
    // Never proxy in production
    if (process.env.NODE_ENV === 'production') {
      return false;
    }

    try {
      const urlObj = new URL(url);
      // Proxy CloudFront URLs in development
      return urlObj.hostname.includes('cloudfront.net');
    } catch (e) {
      return false;
    }
  }
}

export const videoUrlService = new VideoUrlService();