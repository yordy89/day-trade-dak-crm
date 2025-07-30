'use client'

import React, { useState } from 'react'
import { Box, TextField, Button, Typography, Paper, Stack, Alert } from '@mui/material'
import { SimpleHLSPlayer } from '@/components/academy/shared/simple-hls-player'
import { QualityDebug } from '@/components/academy/shared/quality-debug'
import type Player from 'video.js/dist/types/player'

export default function TestCloudFrontVideoPage() {
  const [videoUrl, setVideoUrl] = useState('https://d3m2tao2a2xtek.cloudfront.net/hsl-daytradedak-videos/class-videos/clase_1/playlist.m3u8')
  const [testUrl, setTestUrl] = useState('')
  const [player, setPlayer] = useState<Player | null>(null)

  const handleTest = () => {
    // Add timestamp to bypass cache during testing
    const urlWithCacheBuster = `${videoUrl}?t=${Date.now()}`
    setTestUrl(urlWithCacheBuster)
  }

  return (
    <Box sx={{ p: 4, maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        CloudFront Video Direct Test
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Stack spacing={3}>
          <Alert severity="info">
            This page tests direct CloudFront video playback without any proxy.
          </Alert>
          
          <TextField
            fullWidth
            label="CloudFront Video URL"
            placeholder="https://d3m2tao2a2xtek.cloudfront.net/..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            helperText="Enter the direct CloudFront HLS URL"
          />
          
          <Button
            variant="contained"
            onClick={handleTest}
            disabled={!videoUrl}
            sx={{ alignSelf: 'flex-start' }}
          >
            Test Direct Playback
          </Button>
        </Stack>
      </Paper>
      
      {testUrl && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Playing: {testUrl}
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <SimpleHLSPlayer
              src={testUrl}
              onReady={(p) => {
                console.log('Player ready for:', testUrl)
                setPlayer(p)
              }}
              onError={(error) => {
                console.error('Playback error:', error)
              }}
              onProgress={(_percent) => {
                // Reduce console spam
                // console.log('Progress:', percent.toFixed(2) + '%')
              }}
            />
          </Box>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Open browser console to see debug information.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              If you see CORS errors, CloudFront needs proper headers configured.
            </Typography>
          </Box>
          
          {/* Quality Debug Panel */}
          <QualityDebug player={player} />
        </Paper>
      )}
    </Box>
  )
}