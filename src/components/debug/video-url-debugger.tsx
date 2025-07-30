'use client'

import React, { useState, useEffect } from 'react'
import { Box, Typography, Paper, Chip, Stack, IconButton, Tooltip } from '@mui/material'
import { ContentCopy, CheckCircle, Warning } from '@mui/icons-material'
import { getVideoUrl } from '@/utils/video-url-handler'

interface VideoUrlDebuggerProps {
  originalUrl: string
  show?: boolean
}

export function VideoUrlDebugger({ originalUrl, show = true }: VideoUrlDebuggerProps) {
  const [copied, setCopied] = useState(false)
  const [urlInfo, setUrlInfo] = useState<any>({})

  useEffect(() => {
    if (!originalUrl) return

    const processedUrl = getVideoUrl(originalUrl)
    const isHLS = originalUrl.includes('.m3u8')
    const isCloudFront = originalUrl.includes('cloudfront.net')
    const isProxied = processedUrl.includes('/api/video-proxy')
    const isDevelopment = process.env.NODE_ENV === 'development'

    setUrlInfo({
      original: originalUrl,
      processed: processedUrl,
      isHLS,
      isCloudFront,
      isProxied,
      isDevelopment,
      protocol: new URL(originalUrl).protocol,
      hostname: new URL(originalUrl).hostname,
      pathname: new URL(originalUrl).pathname,
    })
  }, [originalUrl])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!show || !originalUrl) return null

  return (
    <Paper
      sx={{
        p: 2,
        backgroundColor: 'rgba(0,0,0,0.8)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 2,
      }}
    >
      <Stack spacing={2}>
        <Typography variant="subtitle2" color="primary">
          Video URL Debug Info
        </Typography>

        <Box>
          <Typography variant="caption" color="text.secondary">
            Original URL:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                wordBreak: 'break-all',
                color: 'grey.300',
              }}
            >
              {urlInfo.original}
            </Typography>
            <Tooltip title={copied ? 'Copied!' : 'Copy URL'}>
              <IconButton
                size="small"
                onClick={() => copyToClipboard(urlInfo.original)}
              >
                {copied ? (
                  <CheckCircle fontSize="small" color="success" />
                ) : (
                  <ContentCopy fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary">
            Processed URL:
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              wordBreak: 'break-all',
              color: urlInfo.isProxied ? 'warning.main' : 'success.main',
            }}
          >
            {urlInfo.processed}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip
            label={`ENV: ${urlInfo.isDevelopment ? 'DEV' : 'PROD'}`}
            size="small"
            color={urlInfo.isDevelopment ? 'warning' : 'success'}
            variant="outlined"
          />
          <Chip
            label={urlInfo.isHLS ? 'HLS' : 'MP4'}
            size="small"
            color="primary"
            variant="outlined"
          />
          {urlInfo.isCloudFront && (
            <Chip
              label="CloudFront"
              size="small"
              color="info"
              variant="outlined"
              icon={<CheckCircle fontSize="small" />}
            />
          )}
          {urlInfo.isProxied && (
            <Chip
              label="Proxied"
              size="small"
              color="warning"
              variant="outlined"
              icon={<Warning fontSize="small" />}
            />
          )}
        </Stack>

        <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', pt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            URL Parts:
          </Typography>
          <Stack spacing={0.5} sx={{ mt: 0.5 }}>
            <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
              Protocol: {urlInfo.protocol}
            </Typography>
            <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
              Host: {urlInfo.hostname}
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}
            >
              Path: {urlInfo.pathname}
            </Typography>
          </Stack>
        </Box>

        {urlInfo.isProxied && urlInfo.isDevelopment && (
          <Box
            sx={{
              borderTop: '1px solid rgba(255,255,255,0.1)',
              pt: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Warning fontSize="small" color="warning" />
            <Typography variant="caption" color="warning.main">
              Using proxy in development. Configure CloudFront CORS for
              production.
            </Typography>
          </Box>
        )}
      </Stack>
    </Paper>
  )
}