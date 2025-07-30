/**
 * Video.js interceptor to handle HLS URLs through proxy
 */

import videojs from 'video.js';

const CLOUDFRONT_DOMAIN = process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN || 'd3m2tao2a2xtek.cloudfront.net';

export function setupVideoJsInterceptor() {
  // Only intercept in development
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  // Get the XHR class used by Video.js
  const VjsXHR = videojs.xhr;
  
  // Override the xhr function
  ;(videojs as any).xhr = function xhrInterceptor(options: any, callback?: any) {
    // Check if this is a request to CloudFront
    if (options.uri && (options.uri.includes(CLOUDFRONT_DOMAIN) || options.uri.includes('.m3u8') || options.uri.includes('.ts'))) {
      // Transform relative URLs to absolute CloudFront URLs
      let url = options.uri;
      
      // If it's a relative URL (doesn't start with http), we need to construct the full URL
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        // This is a relative URL from a manifest
        // We need to figure out the base URL from the previous request
        // For now, we'll try to construct it based on common patterns
        if (url.startsWith('/')) {
          url = `https://${CLOUDFRONT_DOMAIN}${url}`;
        } else {
          // It's a relative path like "480p/playlist.m3u8"
          // We need to get the base path from the referrer or previous request
          console.warn('Relative URL detected without base path:', url);
        }
      }
      
      // Now proxy the URL
      if (url.includes(CLOUDFRONT_DOMAIN)) {
        const proxiedUrl = `/api/video-proxy?url=${encodeURIComponent(url)}`;
        console.log('Intercepting video request:', url, '->', proxiedUrl);
        options.uri = proxiedUrl;
      }
    }
    
    // Call the original xhr function
    return VjsXHR(options, callback);
  };
}