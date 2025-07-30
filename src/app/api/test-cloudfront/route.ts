import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const videoPath = searchParams.get('path') || 'hsl-daytradedak-videos/class-videos/clase_1/master.m3u8';
  
  const testUrl = `https://d3m2tao2a2xtek.cloudfront.net/${videoPath}`;
  
  try {
    console.log('Testing CloudFront URL:', testUrl);
    
    // Test direct access to CloudFront
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; VideoTest/1.0)',
        'Accept': '*/*',
      },
    });
    
    const headers: any = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    
    let content = '';
    let contentPreview = '';
    
    if (response.ok) {
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('mpegurl') || testUrl.endsWith('.m3u8')) {
        content = await response.text();
        contentPreview = content.substring(0, 500);
      } else {
        contentPreview = `Binary content (${contentType})`;
      }
    }
    
    const result = {
      url: testUrl,
      status: response.status,
      statusText: response.statusText,
      headers: headers,
      contentPreview: contentPreview,
      recommendations: [] as string[]
    };
    
    // Add recommendations based on the response
    if (response.status === 403) {
      result.recommendations.push('Check S3 bucket permissions and CloudFront distribution settings');
      result.recommendations.push('Verify the object exists in S3');
      result.recommendations.push('Check if CloudFront origin access identity is configured');
    } else if (response.status === 404) {
      result.recommendations.push('Verify the video path is correct');
      result.recommendations.push('Check if the file exists in S3 bucket');
      result.recommendations.push('Example path: hsl-daytradedak-videos/class-videos/[video-name]/master.m3u8');
    } else if (!response.ok) {
      result.recommendations.push('Check CloudFront logs for more details');
    }
    
    // Test CORS by checking headers
    const corsHeaders = {
      'access-control-allow-origin': headers['access-control-allow-origin'] || 'NOT SET',
      'access-control-allow-methods': headers['access-control-allow-methods'] || 'NOT SET',
      'access-control-allow-headers': headers['access-control-allow-headers'] || 'NOT SET',
    };
    
    if (corsHeaders['access-control-allow-origin'] === 'NOT SET') {
      result.recommendations.push('CORS headers are not configured on CloudFront');
      result.recommendations.push('In development, use the proxy: /api/video-proxy?url=' + encodeURIComponent(testUrl));
    }
    
    return NextResponse.json({
      ...result,
      corsHeaders,
      proxyUrl: `/api/video-proxy?url=${encodeURIComponent(testUrl)}`,
    }, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to test CloudFront URL',
      message: error instanceof Error ? error.message : 'Unknown error',
      url: testUrl,
    }, { status: 500 });
  }
}