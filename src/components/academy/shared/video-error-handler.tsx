'use client'

import React from 'react'
import { Box, Typography, Button, Stack, Alert, Paper } from '@mui/material'
import { Refresh, OpenInNew, Info } from '@mui/icons-material'

interface VideoErrorHandlerProps {
  error: any
  videoUrl: string
  onRetry: () => void
}

export function VideoErrorHandler({ error, videoUrl, onRetry }: VideoErrorHandlerProps) {
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  // Extract video name from URL
  const getVideoName = (url: string) => {
    try {
      const urlObj = new URL(url)
      const path = urlObj.pathname
      const parts = path.split('/')
      return parts[parts.length - 2] || 'video' // Get folder name before master.m3u8
    } catch {
      return 'video'
    }
  }

  const videoName = getVideoName(videoUrl)
  
  return (
    <Box sx={{ p: 4 }}>
      <Paper sx={{ p: 4, backgroundColor: 'background.paper' }}>
        <Stack spacing={3}>
          <Typography variant="h5" color="error">
            Error Loading Video
          </Typography>
          
          <Alert severity="error">
            {error?.message || 'Failed to load video. This might be due to CORS restrictions.'}
          </Alert>
          
          {isDevelopment && (
            <Alert severity="info" icon={<Info />}>
              <Typography variant="subtitle2" gutterBottom>
                Development Mode Detected
              </Typography>
              <Typography variant="body2">
                The video proxy is attempting to bypass CORS restrictions. If this fails:
              </Typography>
              <ol style={{ margin: '8px 0', paddingLeft: '20px' }}>
                <li>Check that the video exists in S3</li>
                <li>Verify CloudFront distribution is active</li>
                <li>Ensure the video URL is correctly formatted</li>
              </ol>
            </Alert>
          )}
          
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Video Details:
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
              {videoUrl}
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={onRetry}
            >
              Retry
            </Button>
            
            {isDevelopment && (
              <Button
                variant="outlined"
                startIcon={<OpenInNew />}
                onClick={() => window.open(`/api/test-cloudfront?path=hsl-daytradedak-videos/class-videos/${videoName}/master.m3u8`, '_blank')}
              >
                Test CloudFront Access
              </Button>
            )}
          </Stack>
          
          {!isDevelopment && (
            <Alert severity="warning">
              Please contact support if this issue persists.
            </Alert>
          )}
        </Stack>
      </Paper>
    </Box>
  )
}