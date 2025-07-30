'use client'

import React, { useState } from 'react'
import { Box, TextField, Button, Typography, Paper, Stack, Alert } from '@mui/material'
import { HLSVideoPlayer } from '@/components/academy/shared/hls-video-player'

export default function TestVideoPage() {
  const [videoUrl, setVideoUrl] = useState('')
  const [testUrl, setTestUrl] = useState('')

  // Example HLS video URLs for testing
  const exampleUrls = [
    {
      label: 'HLS Test Stream (Big Buck Bunny)',
      url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
    },
    {
      label: 'CloudFront HLS Video',
      url: 'https://d3m2tao2a2xtek.cloudfront.net/hsl-daytradedak-videos/class-videos/master.m3u8'
    }
  ]

  const handleTest = () => {
    setTestUrl(videoUrl)
  }

  return (
    <Box sx={{ p: 4, maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Video Player Test Page
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Stack spacing={3}>
          <Alert severity="info">
            Use this page to test HLS video playback. Enter a video URL or select an example.
          </Alert>
          
          <TextField
            fullWidth
            label="Video URL"
            placeholder="https://example.com/video.m3u8"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            helperText="Enter an HLS (.m3u8) or MP4 video URL"
          />
          
          <Stack direction="row" spacing={2} flexWrap="wrap">
            {exampleUrls.map((example) => (
              <Button
                key={example.url}
                variant="outlined"
                size="small"
                onClick={() => setVideoUrl(example.url)}
              >
                {example.label}
              </Button>
            ))}
          </Stack>
          
          <Button
            variant="contained"
            onClick={handleTest}
            disabled={!videoUrl}
            sx={{ alignSelf: 'flex-start' }}
          >
            Test Video
          </Button>
        </Stack>
      </Paper>
      
      {testUrl && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Testing: {testUrl}
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <HLSVideoPlayer
              src={testUrl}
              autoplay={false}
              controls={true}
              onReady={(player) => {
                console.log('Player ready:', player)
              }}
              onError={(error) => {
                console.error('Player error:', error)
              }}
              onProgress={(percent) => {
                console.log('Progress:', `${percent}%`)
              }}
            />
          </Box>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Check the browser console for debug information.
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  )
}