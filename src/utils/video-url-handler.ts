/**
 * Enhanced video URL handler for HLS and regular videos
 * Handles both development proxy and production CloudFront URLs
 */

const CLOUDFRONT_DOMAIN = process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN || 'd3m2tao2a2xtek.cloudfront.net';

interface VideoUrlConfig {
  useProxy?: boolean;
  forceDirectUrl?: boolean;
}

/**
 * Determines if we should use proxy based on environment and URL
 */
function shouldUseProxy(url: string, config?: VideoUrlConfig): boolean {
  // Check if we're on a subdomain that needs proxy
  if (typeof window !== 'undefined' && window.location.hostname === 'events.daytradedak.com') {
    // Force proxy for events subdomain until CloudFront CORS is fixed
    return true;
  }
  
  // Never use proxy in production (main domain)
  if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined' && window.location.hostname === 'daytradedak.com') {
    return false;
  }

  // Force direct URL if specified
  if (config?.forceDirectUrl) {
    return false;
  }

  // Check if proxy is explicitly requested
  if (config?.useProxy === false) {
    return false;
  }

  // For development, check if the URL needs proxying
  // Skip proxy for URLs that already have CORS headers configured
  if (url.includes('hsl-daytradedak-videos/')) {
    // These videos should have CORS headers configured on CloudFront
    return false;
  }

  return true;
}

/**
 * Transforms a video URL for use in the player
 */
export function getVideoUrl(originalUrl: string, config?: VideoUrlConfig): string {
  if (!originalUrl) {
    return '';
  }

  // If it's already a proxy URL, return as-is
  if (originalUrl.includes('/api/video-proxy')) {
    return originalUrl;
  }

  // Check if we should use proxy
  if (shouldUseProxy(originalUrl, config)) {
    const encodedUrl = encodeURIComponent(originalUrl);
    return `/api/video-proxy?url=${encodedUrl}`;
  }

  // Return the direct URL
  return originalUrl;
}

/**
 * Transforms HLS manifest content to handle relative URLs
 * This version works for both proxied and direct access
 */
export function processHLSManifest(
  manifestContent: string,
  manifestUrl: string,
  config?: VideoUrlConfig
): string {
  console.log('Processing HLS manifest from URL:', manifestUrl);
  
  const lines = manifestContent.split('\n');
  const baseUrl = manifestUrl.substring(0, manifestUrl.lastIndexOf('/'));
  
  const processedLines = lines.map((line, index) => {
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (trimmedLine === '') {
      return line;
    }
    
    // Skip comments but check for URI attributes
    if (line.startsWith('#')) {
      // Handle URI attributes in tags like EXT-X-STREAM-INF
      if (line.includes('URI=')) {
        return line.replace(/URI="(?<uri>[^"]+)"/g, (match, uri) => {
          const absoluteUrl = makeAbsoluteUrl(uri, baseUrl);
          const finalUrl = getVideoUrl(absoluteUrl, config);
          console.log(`Transformed URI in tag: ${uri} -> ${finalUrl}`);
          return `URI="${finalUrl}"`;
        });
      }
      return line;
    }
    
    // Handle .ts segments and .m3u8 playlists
    if (isVideoSegmentUrl(trimmedLine)) {
      const absoluteUrl = makeAbsoluteUrl(trimmedLine, baseUrl);
      const finalUrl = getVideoUrl(absoluteUrl, config);
      console.log(`Line ${index}: Transformed ${trimmedLine} -> ${finalUrl}`);
      return finalUrl;
    }
    
    return line;
  });
  
  const result = processedLines.join('\n');
  console.log('Processed manifest preview:', result.substring(0, 300));
  return result;
}

/**
 * Makes a URL absolute based on the base URL
 */
function makeAbsoluteUrl(url: string, baseUrl: string): string {
  // Already absolute
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  try {
    // Absolute path from root
    if (url.startsWith('/')) {
      const urlParts = new URL(baseUrl);
      return `${urlParts.protocol}//${urlParts.host}${url}`;
    }
    
    // Relative to current directory
    const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    return new URL(url, cleanBase).toString();
  } catch (e) {
    console.error('Error creating absolute URL:', e, { url, baseUrl });
    return url;
  }
}

/**
 * Checks if a URL is for a video segment or playlist
 */
function isVideoSegmentUrl(url: string): boolean {
  const videoExtensions = ['.ts', '.m3u8', '.m3u', '.mp4', '.webm'];
  return videoExtensions.some(ext => 
    url.endsWith(ext) || url.includes(`${ext}?`) || url.includes(`${ext}#`)
  );
}

/**
 * Gets the direct CloudFront URL for a video key
 */
export function getCloudFrontUrl(videoKey: string): string {
  // Remove any leading slashes
  const cleanKey = videoKey.startsWith('/') ? videoKey.slice(1) : videoKey;
  return `https://${CLOUDFRONT_DOMAIN}/${cleanKey}`;
}

/**
 * Extracts video key from a CloudFront URL
 */
export function extractVideoKey(url: string): string | null {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === CLOUDFRONT_DOMAIN) {
      // Remove leading slash from pathname
      return urlObj.pathname.startsWith('/') ? urlObj.pathname.slice(1) : urlObj.pathname;
    }
  } catch (e) {
    // Not a valid URL
  }
  return null;
}