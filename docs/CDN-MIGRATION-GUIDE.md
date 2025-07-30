# CDN Migration Guide

This guide explains how to quickly switch between CDN providers (CloudFront, BunnyCDN, etc.) with minimal effort.

## Current Setup (CloudFront)

Your application is currently configured to use AWS CloudFront. All CDN logic is abstracted through a service layer, making switches easy.

## How to Switch CDN Providers

### 1. Quick Switch (< 5 minutes)

To switch from CloudFront to BunnyCDN:

```bash
# 1. Update your .env.local file
NEXT_PUBLIC_CDN_PROVIDER=bunnycdn
BUNNYCDN_DOMAIN=youraccount.b-cdn.net
BUNNYCDN_AUTH_KEY=your-auth-key

# 2. Restart your application
npm run dev
```

That's it! The application will now use BunnyCDN for all video URLs.

### 2. CDN Provider Options

#### CloudFront (Current)
```env
NEXT_PUBLIC_CDN_PROVIDER=cloudfront
```

#### BunnyCDN
```env
NEXT_PUBLIC_CDN_PROVIDER=bunnycdn
BUNNYCDN_DOMAIN=youraccount.b-cdn.net
```

#### Cloudflare
```env
NEXT_PUBLIC_CDN_PROVIDER=cloudflare
CLOUDFLARE_DOMAIN=yoursubdomain.cloudflarestream.com
```

#### Custom CDN
```env
NEXT_PUBLIC_CDN_PROVIDER=custom
NEXT_PUBLIC_CDN_DOMAIN=your-cdn.com
NEXT_PUBLIC_CDN_VIDEO_PATH=videos
```

## Migration Steps for BunnyCDN

### Step 1: Create BunnyCDN Account
1. Sign up at https://bunnycdn.com
2. Create a Pull Zone
3. Set your S3 bucket as the origin

### Step 2: Configure Pull Zone
```
Origin URL: https://s3.amazonaws.com/your-bucket-name
Host Header: s3.amazonaws.com
```

### Step 3: Enable Video Optimization
1. Go to Pull Zone > General
2. Enable "Optimize for Video Delivery"
3. Enable "Cache HLS Playlist Files"

### Step 4: Update Your Application
1. Copy `.env.cdn.example` to `.env.local`
2. Update these values:
   ```env
   NEXT_PUBLIC_CDN_PROVIDER=bunnycdn
   BUNNYCDN_DOMAIN=youraccount.b-cdn.net
   BUNNYCDN_AUTH_KEY=your-auth-key-from-bunnycdn
   ```

### Step 5: Test
1. Restart your application
2. Check browser console for "Using CDN provider: bunnycdn"
3. Verify videos play correctly

## Testing CDN Switch

### Quick Test
```javascript
// In browser console
console.log(window.location.origin + '/test-cloudfront-video')
```

### Verify CDN Switch
1. Open Network tab in browser
2. Play a video
3. Check that video URLs now point to your new CDN domain

## Rollback

If you need to switch back to CloudFront:

```bash
# Update .env.local
NEXT_PUBLIC_CDN_PROVIDER=cloudfront

# Restart application
npm run dev
```

## Cost Monitoring

### Month 1: CloudFront
- Monitor AWS Cost Explorer
- Track data transfer costs
- Note request counts

### Month 2+: Alternative CDN
- Compare costs
- Monitor performance
- Check global coverage

## Architecture Benefits

The CDN abstraction provides:
- **Zero code changes** when switching CDNs
- **Configuration-based** switching
- **Provider-specific features** (signing, headers)
- **Easy rollback** if needed

## CDN Feature Comparison

| Feature | CloudFront | BunnyCDN | Cloudflare |
|---------|------------|----------|------------|
| Setup Time | 30 min | 10 min | 20 min |
| Pricing | $0.085/GB | $0.01-0.045/GB | $0.00/GB |
| Edge Locations | 450+ | 93 | 200+ |
| HLS Support | ✅ | ✅ | ✅ |
| URL Signing | ✅ | ✅ | ✅ |
| Analytics | Advanced | Good | Excellent |

## Common Issues

### CORS Errors
- BunnyCDN: Enable CORS in Pull Zone settings
- Cloudflare: Configure CORS headers in Transform Rules

### Cache Issues
- Clear CDN cache after switching
- Update cache headers if needed

### URL Structure
- Each CDN has different URL patterns
- Our abstraction handles this automatically

## Support

If you need help:
1. Check CDN provider's documentation
2. Test with a single video first
3. Monitor browser console for errors
4. Check Network tab for failed requests