'use client'

import React, { useEffect, useRef, useState } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import '@/styles/video-player.css'
import { Box, CircularProgress, Alert, Typography } from '@mui/material'
import type Player from 'video.js/dist/types/player'
import { addQualityButton } from './quality-button'

interface SimpleHLSPlayerProps {
  src: string
  poster?: string
  onReady?: (player: Player) => void
  onProgress?: (percent: number) => void
  onError?: (error: any) => void
}

function addQualityIndicator(player: Player) {
  const qualityLevels = (player as any).qualityLevels()
  
  // Create quality indicator element
  const indicator = document.createElement('div')
  indicator.id = 'quality-indicator'
  indicator.style.cssText = `
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: bold;
    z-index: 100;
    pointer-events: none;
  `
  
  // Update indicator on quality change
  qualityLevels.on('change', () => {
    const selectedLevel = qualityLevels[qualityLevels.selectedIndex]
    if (selectedLevel) {
      indicator.textContent = `${selectedLevel.height}p`
      const tech = player.tech(true) as any
      if (tech?.vhs) {
        const bandwidth = tech.vhs.bandwidth
        indicator.innerHTML = `
          <div>${selectedLevel.height}p</div>
          <div style="font-size: 11px; opacity: 0.8">${(bandwidth / 1000000).toFixed(1)} Mbps</div>
        `
      }
    }
  })
  
  // Add to player container
  const playerEl = player.el()
  if (playerEl) {
    playerEl.appendChild(indicator)
  }
}

export function SimpleHLSPlayer({
  src,
  poster,
  onReady,
  onProgress,
  onError,
}: SimpleHLSPlayerProps) {
  const videoRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<Player | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentQuality, setCurrentQuality] = useState<string>('Auto')
  const [bandwidth, setBandwidth] = useState<number>(0)

  useEffect(() => {
    let bandwidthInterval: ReturnType<typeof setInterval> | undefined
    
    if (!playerRef.current && videoRef.current && src) {
      const videoElement = document.createElement('video-js')
      videoElement.classList.add('vjs-big-play-centered', 'vjs-fluid')
      videoRef.current.appendChild(videoElement)

      console.log('Initializing player with CloudFront URL:', src)

      // Configure Video.js to handle HLS properly
      const player = videojs(videoElement, {
        controls: true,
        fluid: true,
        responsive: true,
        playbackRates: [0.5, 1, 1.5, 2],
        html5: {
          vhs: {
            // This is the key setting - it tells VHS to resolve URLs relative to the manifest URL
            resolveUrl: (base: string, relative: string) => {
              // If it's already an absolute URL, return it
              if (relative.startsWith('http://') || relative.startsWith('https://')) {
                return relative;
              }
              
              // Resolve relative to the base URL
              const baseUrl = base.substring(0, base.lastIndexOf('/'));
              const resolved = `${baseUrl}/${relative}`;
              console.log(`Resolving: ${relative} relative to ${baseUrl} = ${resolved}`);
              return resolved;
            },
            overrideNative: true,
            smoothQualityChange: true,
            fastQualityChange: true
          },
          nativeVideoTracks: false,
          nativeAudioTracks: false,
          nativeTextTracks: false
        }
      })

      playerRef.current = player

      // Set the source
      player.src({
        src,
        type: 'application/x-mpegURL'
      })

      if (poster) {
        player.poster(poster)
      }

      // Event handlers
      player.ready(() => {
        console.log('Player ready')
        setLoading(false)
        if (onReady) {
          onReady(player)
        }
      })

      player.on('error', (_e: any) => {
        const playerError = player.error()
        console.error('Playback error:', playerError)
        setError(playerError?.message || 'Playback error')
        setLoading(false)
        if (onError) {
          onError(playerError)
        }
      })

      player.on('loadedmetadata', () => {
        console.log('Metadata loaded')
        setLoading(false)
      })

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

      // Enhanced quality level monitoring
      player.on('loadedmetadata', () => {
        const qualityLevels = (player as any).qualityLevels()
        console.log('Initial quality levels available:', qualityLevels.length)
        
        // List all initial quality levels
        for (let i = 0; i < qualityLevels.length; i++) {
          const level = qualityLevels[i]
          console.log(`Quality ${i}:`, {
            height: level.height,
            width: level.width,
            bitrate: level.bitrate,
            enabled: level.enabled
          })
          // Enable all quality levels
          qualityLevels[i].enabled = true
        }
        
        // Track when new quality levels are added
        let addedLevels = 0
        qualityLevels.on('addqualitylevel', (event: any) => {
          addedLevels++
          const level = event.qualityLevel
          console.log(`Quality level added (${addedLevels}):`, {
            id: level.id,
            height: level.height,
            width: level.width,
            bitrate: level.bitrate,
            bandwidth: level.bandwidth,
            resolution: `${level.width}x${level.height}`,
            enabled: level.enabled
          })
          
          // Enable the new level
          level.enabled = true
          
          // Re-add quality selector after all levels are loaded
          // HLS typically has 4 levels (360p, 480p, 720p, 1080p)
          if (addedLevels >= 3) {
            setTimeout(() => {
              console.log('All quality levels loaded, adding selector')
              addQualityButton(player)
            }, 500)
          }
        })
        
        // Monitor quality changes
        qualityLevels.on('change', () => {
          const selectedLevel = qualityLevels[qualityLevels.selectedIndex]
          if (selectedLevel) {
            console.log('Quality changed to:', {
              resolution: `${selectedLevel.width}x${selectedLevel.height}`,
              bitrate: selectedLevel.bitrate,
              index: qualityLevels.selectedIndex,
              totalLevels: qualityLevels.length
            })
            
            // Update state
            setCurrentQuality(`${selectedLevel.height}p`)
          }
        })
        
        // Try adding selector immediately if levels already exist
        if (qualityLevels.length > 0) {
          console.log('Quality levels already available, adding selector')
          addQualityButton(player)
        }
      })
      
      // Monitor bandwidth and buffering
      player.on('progress', () => {
        const tech = player.tech(true) as any
        if (tech?.vhs) {
          const currentBandwidth = tech.vhs.bandwidth
          const bufferLength = player.bufferedPercent() * 100
          setBandwidth(currentBandwidth)
          console.log('Playback stats:', {
            bandwidth: `${(currentBandwidth / 1000000).toFixed(2)} Mbps`,
            buffered: `${bufferLength.toFixed(1)}%`,
            currentTime: player.currentTime(),
            duration: player.duration()
          })
        }
      })
      
      // Add bandwidth monitoring interval
      bandwidthInterval = setInterval(() => {
        const tech = player.tech(true) as any
        if (tech?.vhs?.playlists) {
          const master = tech.vhs.playlists.master
          const media = tech.vhs.playlists.media()
          
          if (master && media) {
            console.log('Quality selection info:', {
              availableBandwidths: master.playlists.map((p: any) => ({
                bandwidth: p.attributes.BANDWIDTH,
                resolution: p.attributes.RESOLUTION,
                codecs: p.attributes.CODECS
              })),
              selectedBandwidth: media.attributes.BANDWIDTH,
              selectedResolution: media.attributes.RESOLUTION,
              currentBandwidth: tech.vhs.bandwidth,
              systemBandwidth: tech.vhs.systemBandwidth
            })
          }
        }
      }, 5000)
      
      // Add quality indicator overlay
      addQualityIndicator(player)
    }

    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose()
        playerRef.current = null
      }
      if (bandwidthInterval) {
        clearInterval(bandwidthInterval)
      }
    }
  }, [src, poster, onReady, onProgress, onError]) // currentQuality intentionally omitted to prevent re-renders

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error}
          <br />
          <small>URL: {src}</small>
        </Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <div data-vjs-player>
        <div ref={videoRef} />
      </div>
      {/* Quality info display */}
      <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Current Quality: <strong>{currentQuality}</strong>
        </Typography>
        {bandwidth > 0 && (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Bandwidth: <strong>{(bandwidth / 1000000).toFixed(1)} Mbps</strong>
          </Typography>
        )}
      </Box>
    </Box>
  )
}