/**
 * Transforms CloudFront video URLs to use a proxy in development to avoid CORS issues
 */
export function transformVideoUrl(originalUrl: string): string {
  // Only use proxy in development
  if (process.env.NODE_ENV !== 'development') {
    return originalUrl;
  }

  // Check if the URL is from CloudFront
  if (!originalUrl.includes('cloudfront.net')) {
    return originalUrl;
  }

  // For HLS content (.m3u8 files), we need to proxy the URL
  if (originalUrl.includes('.m3u8') || originalUrl.includes('.ts')) {
    // Encode the URL to pass it as a query parameter
    const encodedUrl = encodeURIComponent(originalUrl);
    return `/api/video-proxy?url=${encodedUrl}`;
  }

  return originalUrl;
}

/**
 * Transforms HLS manifest content to use proxied URLs
 * This is needed because HLS manifests contain URLs to .ts segments
 */
export function transformHLSManifest(manifestContent: string, baseUrl: string): string {
  // Only transform in development
  if (process.env.NODE_ENV !== 'development') {
    return manifestContent;
  }

  console.log('Transforming HLS manifest with base URL:', baseUrl);
  
  // Replace relative URLs with proxied absolute URLs
  const lines = manifestContent.split('\n');
  const transformedLines = lines.map((line, _index) => {
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (trimmedLine === '') {
      return line;
    }
    
    // Skip comments but check for URI attributes in EXT-X-STREAM-INF
    if (line.startsWith('#')) {
      // Handle EXT-X-STREAM-INF or similar tags that might have URI
      if (line.includes('URI=')) {
        return line.replace(/URI="(?<uri>[^"]+)"/g, (match, uri) => {
          if (!uri.startsWith('http')) {
            const absoluteUrl = new URL(uri, baseUrl + '/').toString();
            const proxiedUrl = transformVideoUrl(absoluteUrl);
            return `URI="${proxiedUrl}"`;
          }
          return `URI="${transformVideoUrl(uri)}"`;
        });
      }
      return line;
    }

    // Transform URLs for segments and playlists
    if (trimmedLine.endsWith('.ts') || 
        trimmedLine.endsWith('.m3u8') || 
        trimmedLine.includes('.ts?') ||
        trimmedLine.includes('.m3u8?')) {
      
      let urlToTransform = trimmedLine;
      
      // Handle relative URLs
      if (!urlToTransform.startsWith('http://') && !urlToTransform.startsWith('https://')) {
        // For relative URLs, we need to construct the absolute URL
        try {
          // If it starts with /, it's absolute path from domain root
          if (urlToTransform.startsWith('/')) {
            const urlParts = new URL(baseUrl);
            urlToTransform = `${urlParts.protocol}//${urlParts.host}${urlToTransform}`;
          } else {
            // It's relative to current directory
            const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
            urlToTransform = new URL(urlToTransform, cleanBaseUrl).toString();
          }
        } catch (e) {
          console.error('Error constructing URL:', e, 'for line:', trimmedLine, 'with base:', baseUrl);
          return line;
        }
      }
      
      const proxiedUrl = transformVideoUrl(urlToTransform);
      console.log(`Transformed: ${trimmedLine} -> ${proxiedUrl}`);
      return proxiedUrl;
    }

    return line;
  });

  const transformedManifest = transformedLines.join('\n');
  console.log('Transformed manifest preview:', transformedManifest.substring(0, 500));
  
  return transformedManifest;
}