'use client'

import React, { useEffect, useRef, useState } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import { Box, CircularProgress } from '@mui/material'
import type Player from 'video.js/dist/types/player'
import { addQualitySelector } from './videojs-quality-selector'
import { videoUrlService } from '@/services/api/video-url.service'
import { VideoErrorHandler } from './video-error-handler'

interface HLSVideoPlayerProps {
  src: string
  poster?: string
  onReady?: (player: Player) => void
  onProgress?: (percent: number) => void
  onError?: (error: any) => void
  width?: string | number
  height?: string | number
  autoplay?: boolean
  controls?: boolean
  muted?: boolean
  fluid?: boolean
  responsive?: boolean
  playbackRates?: number[]
  qualityLevels?: boolean
}

export function HLSVideoPlayer({
  src,
  poster,
  onReady,
  onProgress,
  onError,
  width = '100%',
  height = 'auto',
  autoplay = false,
  controls = true,
  muted = false,
  fluid = true,
  responsive = true,
  playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2],
  qualityLevels = true,
}: HLSVideoPlayerProps) {
  const videoRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<Player | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current && videoRef.current) {
      // The Video.js player needs to be inside the component el for React 18 Strict Mode
      const videoElement = document.createElement('video-js')
      videoElement.classList.add('vjs-big-play-centered')
      videoRef.current.appendChild(videoElement)

      // Process the video URL for proper CORS handling
      const videoSrc = videoUrlService.processVideoUrl(src)
      
      console.log('HLS Video player initializing:', { 
        original: src, 
        processed: videoSrc,
        needsProxy: videoUrlService.needsProxy(src),
        environment: process.env.NODE_ENV 
      })
      
      const options = {
        autoplay,
        controls,
        responsive,
        fluid,
        muted,
        playbackRates,
        sources: [{
          src: videoSrc,
          type: src.endsWith('.m3u8') ? 'application/x-mpegURL' : 'video/mp4'
        }],
        poster,
        html5: {
          vhs: {
            enableLowInitialPlaylist: true,
            smoothQualityChange: true,
            overrideNative: true,
            fastQualityChange: true,
            bandwidth: 0,
            // Use bandwidth estimation to pick quality
            useBandwidthFromLocalStorage: true,
            // Better HLS handling
            handleManifestRedirects: true,
            experimentalLLHLS: false,
            // Custom manifest parsing to handle relative URLs
            experimentalBufferBasedABR: false
          },
          nativeVideoTracks: false,
          nativeAudioTracks: false,
          nativeTextTracks: false
        }
      }

      playerRef.current = videojs(videoElement, options, function onPlayerReady() {
        console.log('HLS Player is ready')
        setLoading(false)
        
        if (onReady) {
          onReady(playerRef.current!)
        }
      })
      
      const player = playerRef.current

      // Add request interceptor for development
      if (process.env.NODE_ENV === 'development' && player.tech_ && src.includes('.m3u8')) {
        const tech = player.tech_;
        
        // Override the xhr before requests for HLS
        if (tech.vhs) {
          const originalXhr = videojs.xhr;
          
          // Extract the original CloudFront URL from the proxied URL if needed
          let baseUrl = '';
          if (videoSrc.includes('/api/video-proxy')) {
            // Extract the original URL from proxy
            const urlParams = new URLSearchParams(videoSrc.split('?')[1]);
            const originalUrl = urlParams.get('url');
            if (originalUrl) {
              const decodedUrl = decodeURIComponent(originalUrl);
              baseUrl = decodedUrl.substring(0, decodedUrl.lastIndexOf('/'));
            }
          } else {
            baseUrl = videoSrc.substring(0, videoSrc.lastIndexOf('/'));
          }
          console.log('Base URL for HLS requests:', baseUrl);
          
          // Override xhr to intercept requests
          (videojs as any).xhr = function xhrInterceptor(xhrOptions: any, callback?: any) {
            if (xhrOptions.uri) {
              // Check if this is a relative URL that needs to be proxied
              if (!xhrOptions.uri.startsWith('http') && !xhrOptions.uri.startsWith('/api/')) {
                // This is a relative URL like "480p/playlist.m3u8"
                const fullUrl = `${baseUrl}/${xhrOptions.uri}`;
                const proxiedUrl = `/api/video-proxy?url=${encodeURIComponent(fullUrl)}`;
                console.log('Intercepting relative URL:', xhrOptions.uri, '->', proxiedUrl);
                xhrOptions.uri = proxiedUrl;
              }
            }
            return originalXhr(xhrOptions, callback);
          };
        }
      }

      // Add quality level selector if HLS
      if (qualityLevels && src.endsWith('.m3u8')) {
        player.ready(() => {
          const qualityLevelsObj = (player as any).qualityLevels()
          
          // Enable quality level selector
          qualityLevelsObj.on('addqualitylevel', (event: any) => {
            console.log('Quality level added:', event.qualityLevel)
          })

          // Auto quality by default
          for (const level of qualityLevelsObj) {
            level.enabled = true
          }

          // Add quality selector button to control bar
          addQualitySelector(player)
        })
      }

      // Track progress
      player.on('timeupdate', () => {
        const currentPlayer = playerRef.current
        if (onProgress && currentPlayer) {
          const duration = currentPlayer.duration()
          const currentTime = currentPlayer.currentTime()
          if (duration && duration > 0 && currentTime !== undefined) {
            const percent = (currentTime / duration) * 100
            onProgress(percent)
          }
        }
      })

      // Handle errors
      player.on('error', (_e: any) => {
        const playerError = player.error()
        console.error('Video playback error:', playerError)
        console.error('Error details:', {
          code: playerError?.code,
          message: playerError?.message,
          videoSrc,
          originalSrc: src
        })
        
        setError({
          message: playerError?.message || 'Video playback error',
          code: playerError?.code,
          videoSrc
        })
        
        if (onError) {
          onError(playerError)
        }
      })

      // Clean up loading state when video starts playing
      player.on('playing', () => {
        setLoading(false)
      })

      // Handle waiting/buffering
      player.on('waiting', () => {
        console.log('Video is buffering...')
      })

      // Log bandwidth changes
      if (src.endsWith('.m3u8')) {
        player.on('bandwidthupdate', () => {
          const tech = player.tech(true) as any
          if (tech?.vhs) {
            console.log('Bandwidth:', tech.vhs.bandwidth, 'bps')
            console.log('Current playlist:', tech.vhs.playlists?.media()?.attributes?.RESOLUTION)
          }
        })
      }
    } else if (playerRef.current) {
      // Update source if it changes
      const player = playerRef.current
      const videoSrc = videoUrlService.processVideoUrl(src)
      
      console.log('Updating video source:', { original: src, processed: videoSrc })
      
      player.src({
        src: videoSrc,
        type: src.endsWith('.m3u8') ? 'application/x-mpegURL' : 'video/mp4'
      })
      player.poster(poster || '')
    }
  }, [src, poster, autoplay, controls, muted, fluid, responsive, playbackRates, qualityLevels, onReady, onProgress, onError])

  // Dispose the Video.js player when the component unmounts
  useEffect(() => {
    const player = playerRef.current

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose()
        playerRef.current = null
      }
    }
  }, [])

  // Handle player size
  useEffect(() => {
    const player = playerRef.current
    if (player && !fluid && !responsive) {
      if (typeof width === 'number') {
        player.width(width)
      }
      if (typeof height === 'number') {
        player.height(height)
      }
    }
  }, [width, height, fluid, responsive])

  const handleRetry = () => {
    setError(null)
    setLoading(true)
    setRetryCount(retryCount + 1)
    
    // Dispose current player
    if (playerRef.current && !playerRef.current.isDisposed()) {
      playerRef.current.dispose()
      playerRef.current = null
    }
    
    // Clear the video element
    if (videoRef.current) {
      videoRef.current.innerHTML = ''
    }
    
    // Force re-initialization by updating a dependency
    // This will trigger the useEffect to recreate the player
    window.location.reload()
  }

  // If there's an error, show the error handler
  if (error && retryCount < 3) {
    return (
      <Box sx={{ position: 'relative', width, height }}>
        <VideoErrorHandler
          error={error}
          videoUrl={src}
          onRetry={handleRetry}
        />
      </Box>
    )
  }

  return (
    <Box sx={{ position: 'relative', width, height }}>
      {loading ? (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'black',
            zIndex: 1,
          }}
        >
          <CircularProgress />
        </Box>
      ) : null}

      <div data-vjs-player>
        <div ref={videoRef} />
      </div>
    </Box>
  )
}
