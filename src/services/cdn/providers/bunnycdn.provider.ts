import type { ICDNProvider } from '../cdn.interface';
import { CDN_CONFIGS } from '@/config/cdn.config';
import crypto from 'crypto';

export class BunnyCDN implements ICDNProvider {
  private config = CDN_CONFIGS.bunnycdn;

  getVideoUrl(videoPath: string): string {
    const cleanPath = videoPath.startsWith('/') ? videoPath.slice(1) : videoPath;
    
    if (videoPath.startsWith('http://') || videoPath.startsWith('https://')) {
      return videoPath;
    }

    // BunnyCDN URL structure
    return `${this.config.protocol}://${this.config.domain}/${this.config.videoPath}/${cleanPath}`;
  }

  async getSignedUrl(videoPath: string, expiresIn = 3600): Promise<string> {
    // BunnyCDN token authentication
    const authKey = process.env.BUNNYCDN_AUTH_KEY || '';
    if (!authKey) {
      return this.getVideoUrl(videoPath);
    }

    const url = this.getVideoUrl(videoPath);
    const expires = Math.floor(Date.now() / 1000) + expiresIn;
    const hashableBase = `${authKey}${url}${expires}`;
    
    // Generate token
    const token = Buffer.from(
      crypto.createHash('sha256').update(hashableBase).digest()
    ).toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    // Add token to URL
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}token=${token}&expires=${expires}`;
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