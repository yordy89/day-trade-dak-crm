import { NextRequest, NextResponse } from 'next/server';
import { processHLSManifest } from '@/utils/video-url-handler';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  let url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    // Decode URL in case it's double-encoded
    url = decodeURIComponent(url);
    
    // Validate that the URL is from your CloudFront domain
    const allowedDomain = 'd3m2tao2a2xtek.cloudfront.net';
    const urlObj = new URL(url);
    
    if (!urlObj.hostname.includes(allowedDomain)) {
      console.error('Invalid domain:', urlObj.hostname, 'Expected:', allowedDomain);
      return NextResponse.json({ error: 'Invalid domain' }, { status: 403 });
    }

    console.log('Proxying video URL:', url);

    // Fetch the content from CloudFront
    const response = await fetch(url, {
      headers: {
        'User-Agent': request.headers.get('user-agent') || 'NextJS-Video-Proxy/1.0',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch from CloudFront: ${response.status} ${response.statusText}`);
      console.error(`URL: ${url}`);
      const errorText = await response.text();
      console.error(`Response body: ${errorText.substring(0, 500)}`);
      
      return NextResponse.json(
        { 
          error: 'Failed to fetch video content',
          status: response.status,
          statusText: response.statusText,
          url: url
        },
        { status: response.status }
      );
    }

    // Get the content type
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    
    // Check if this is an HLS manifest file
    if (url.includes('.m3u8') || contentType.includes('mpegurl') || contentType.includes('m3u8')) {
      // For m3u8 files, we need to transform the content
      const textContent = await response.text();
      const baseUrl = url.substring(0, url.lastIndexOf('/'));
      
      console.log('Processing HLS manifest from:', baseUrl);
      
      // Process the manifest to update all URLs
      const processedContent = processHLSManifest(textContent, url, { useProxy: true });
      
      return new NextResponse(processedContent, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.apple.mpegurl',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': '*',
          'Cache-Control': 'public, max-age=300', // 5 minutes for manifests
        },
      });
    } else {
      // For other content (video segments, etc.), return as-is
      const content = await response.arrayBuffer();
      
      return new NextResponse(content, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': '*',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }
  } catch (error) {
    console.error('Video proxy error:', error);
    console.error('Requested URL:', url);
    
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorDetails = {
      error: 'Failed to fetch video content',
      message: errorMessage,
      url: url,
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json(errorDetails, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  });
}