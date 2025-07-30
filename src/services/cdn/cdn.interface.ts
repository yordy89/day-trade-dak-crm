/**
 * CDN Provider Interface
 * All CDN providers must implement this interface
 */
export interface ICDNProvider {
  /**
   * Get the full URL for a video
   */
  getVideoUrl: (videoPath: string) => string;

  /**
   * Get a signed/authenticated URL
   */
  getSignedUrl: (videoPath: string, expiresIn?: number) => Promise<string>;

  /**
   * Get URL for thumbnails/images
   */
  getThumbnailUrl: (thumbnailPath: string) => string;

  /**
   * Check if provider supports signed URLs
   */
  supportsSignedUrls: () => boolean;

  /**
   * Get any required headers for requests
   */
  getHeaders: () => Record<string, string>;

  /**
   * Get the base domain
   */
  getDomain: () => string;
}

/**
 * CDN Configuration Interface
 */
export interface ICDNConfig {
  domain: string;
  protocol: 'http' | 'https';
  videoPath: string;
  supportsSigning: boolean;
  headers: Record<string, string>;
}