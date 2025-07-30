import type { ICDNProvider } from '../cdn.interface';
import { CDN_CONFIGS } from '@/config/cdn.config';

export class CloudflareCDN implements ICDNProvider {
  private config = CDN_CONFIGS.cloudflare;

  getVideoUrl(videoPath: string): string {
    const cleanPath = videoPath.startsWith('/') ? videoPath.slice(1) : videoPath;
    
    if (videoPath.startsWith('http://') || videoPath.startsWith('https://')) {
      return videoPath;
    }

    // Cloudflare Stream URL structure
    return `${this.config.protocol}://${this.config.domain}/${cleanPath}`;
  }

  async getSignedUrl(videoPath: string, _expiresIn = 3600): Promise<string> {
    // TODO: Implement Cloudflare signed URLs
    // Cloudflare uses a different approach with signed tokens
    return this.getVideoUrl(videoPath);
  }

  getThumbnailUrl(thumbnailPath: string): string {
    const cleanPath = thumbnailPath.startsWith('/') ? thumbnailPath.slice(1) : thumbnailPath;
    // Cloudflare Stream provides automatic thumbnails
    return `${this.config.protocol}://${this.config.domain}/${cleanPath}/thumbnails/thumbnail.jpg`;
  }

  supportsSignedUrls(): boolean {
    return this.config.supportsSigning;
  }

  getHeaders(): Record<string, string> {
    return this.config.headers;
  }

  getDomain(): string {
    return this.config.domain;
  }
}