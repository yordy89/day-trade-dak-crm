import type { ICDNProvider } from '../cdn.interface';
import { getCurrentCDNConfig } from '@/config/cdn.config';

export class CloudFrontCDN implements ICDNProvider {
  private config = getCurrentCDNConfig();

  getVideoUrl(videoPath: string): string {
    // Remove leading slash if present
    const cleanPath = videoPath.startsWith('/') ? videoPath.slice(1) : videoPath;
    
    // Handle both full URLs and paths
    if (videoPath.startsWith('http://') || videoPath.startsWith('https://')) {
      return videoPath;
    }

    // Build CloudFront URL
    return `${this.config.protocol}://${this.config.domain}/${this.config.videoPath}/${cleanPath}`;
  }

  async getSignedUrl(videoPath: string, _expiresIn = 3600): Promise<string> {
    // TODO: Implement CloudFront URL signing
    // For now, return unsigned URL
    return this.getVideoUrl(videoPath);
  }

  getThumbnailUrl(thumbnailPath: string): string {
    const cleanPath = thumbnailPath.startsWith('/') ? thumbnailPath.slice(1) : thumbnailPath;
    return `${this.config.protocol}://${this.config.domain}/${cleanPath}`;
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