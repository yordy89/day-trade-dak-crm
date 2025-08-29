'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  LiveKitRoom,
  VideoConference,
  formatChatMessageLinks,
  LocalUserChoices,
  ControlBar,
  GridLayout,
  ParticipantTile,
  useTracks,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { 
  Box, 
  CircularProgress, 
  Typography, 
  Alert,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import {
  Fullscreen,
  FullscreenExit,
} from '@mui/icons-material';
import Image from 'next/image';
import axios from 'axios';
import { Track } from 'livekit-client';

interface SimpleLiveKitRoomProps {
  meetingId: string;
  roomName: string;
  userName: string;
  token?: string;
  serverUrl?: string;
  onDisconnect?: () => void;
}

export function SimpleLiveKitRoom({
  meetingId,
  roomName,
  userName,
  token: providedToken,
  serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || 'wss://live.daytradedak.com',
  onDisconnect,
}: SimpleLiveKitRoomProps) {
  const [token, setToken] = useState<string | null>(providedToken || null);
  const [loading, setLoading] = useState(!providedToken);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [userChoices, setUserChoices] = useState<LocalUserChoices>({
    username: userName,
    videoEnabled: true,
    audioEnabled: true,
    videoDeviceId: '',
    audioDeviceId: '',
  });

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(err => {
        console.error('Error attempting to exit fullscreen:', err);
      });
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (!providedToken) {
      const fetchToken = async () => {
        try {
          const authStorage = localStorage.getItem('auth-storage');
          let authToken = null;
          let userId = null;

          if (authStorage) {
            const parsed = JSON.parse(authStorage);
            authToken = parsed.state?.authToken;
            userId = parsed.state?.user?._id;
          }

          if (!authToken) {
            authToken = localStorage.getItem('custom-auth-token');
            const userStr = localStorage.getItem('custom-auth-user');
            if (userStr) {
              userId = JSON.parse(userStr)._id;
            }
          }

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/livekit/rooms/${meetingId}/token`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
              },
              body: JSON.stringify({
                name: userName,
                identity: userId || userName,
              }),
            }
          );

          if (!response.ok) {
            throw new Error('Failed to get meeting token');
          }

          const data = await response.json();
          setToken(data.token);
          
          // Parse token to check permissions
          try {
            const payload = JSON.parse(atob(data.token.split('.')[1]));
            const videoGrants = payload.video || {};
            
            // Set initial states based on permissions
            setUserChoices(prev => ({
              ...prev,
              videoEnabled: videoGrants.canPublish !== false,
              audioEnabled: videoGrants.canPublish !== false,
            }));
          } catch (e) {
            console.error('Failed to parse token:', e);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to join meeting');
        } finally {
          setLoading(false);
        }
      };

      fetchToken();
    }
  }, [meetingId, userName, providedToken]);

  const handleDisconnect = async () => {
    // Check if user is host and update meeting status
    try {
      const authStorage = localStorage.getItem('auth-storage');
      let authToken = null;
      let userId = null;

      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        authToken = parsed.state?.authToken;
        userId = parsed.state?.user?._id;
      }

      if (!authToken) {
        authToken = localStorage.getItem('custom-auth-token');
      }

      // Parse token to check if host
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const metadata = payload.metadata ? JSON.parse(payload.metadata) : {};
          
          if (metadata.isHost) {
            // Host is leaving, end the meeting
            await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/api/v1/livekit/rooms/${meetingId}/end`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              }
            );
            console.log('Meeting ended by host');
          }
        } catch (e) {
          console.error('Failed to parse token or end meeting:', e);
        }
      }
    } catch (error) {
      console.error('Error handling disconnect:', error);
    }

    if (onDisconnect) {
      onDisconnect();
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#0a0a0a',
        }}
      >
        <CircularProgress sx={{ color: '#16a34a' }} />
      </Box>
    );
  }

  if (error || !token) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#0a0a0a',
          p: 3,
        }}
      >
        <Alert severity="error">
          <Typography>{error || 'Unable to join meeting'}</Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      height: '100vh', 
      width: '100vw',
      display: 'flex', 
      flexDirection: 'column', 
      bgcolor: '#0a0a0a',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0,
    }}>
      {/* Custom Header */}
      <AppBar position="static" sx={{ 
        bgcolor: '#111', 
        borderBottom: '1px solid rgba(22, 163, 74, 0.3)',
        minHeight: '64px',
        zIndex: 1000,
      }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
            <Image 
              src="/assets/logos/day_trade_dak_white_logo.png" 
              alt="DayTradeDak" 
              width={120} 
              height={40}
              style={{ objectFit: 'contain' }}
            />
          </Box>
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#16a34a' }}>
            {roomName}
          </Typography>
          <IconButton
            onClick={toggleFullscreen}
            sx={{
              color: '#16a34a',
              bgcolor: 'rgba(22, 163, 74, 0.1)',
              border: '1px solid rgba(22, 163, 74, 0.3)',
              '&:hover': {
                bgcolor: 'rgba(22, 163, 74, 0.2)',
                border: '1px solid rgba(22, 163, 74, 0.5)',
              },
            }}
          >
            {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* LiveKit Room */}
      <Box sx={{ 
        flex: 1, 
        position: 'relative',
        overflow: 'hidden',
        height: 'calc(100vh - 64px)',
      }}>
        {/* Custom styles for LiveKit */}
        <style jsx global>{`
          /* Custom LiveKit Theme for DayTradeDak */
          .lk-room {
            --lk-brand-color: #16a34a !important;
            --lk-brand-color-hover: #15803d !important;
            --lk-background: #0a0a0a !important;
            --lk-background-2: #111111 !important;
            --lk-foreground: #ffffff !important;
            --lk-border-color: rgba(22, 163, 74, 0.2) !important;
            height: 100% !important;
          }
          
          /* Grid layout to properly show video */
          .lk-grid-layout {
            height: calc(100% - 90px) !important;
            padding: 16px !important;
          }
          
          /* Control bar styling - Modern design */
          .lk-control-bar {
            position: absolute !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            background: linear-gradient(to top, rgba(10, 10, 10, 0.98), rgba(10, 10, 10, 0.85)) !important;
            backdrop-filter: blur(24px) saturate(180%) !important;
            -webkit-backdrop-filter: blur(24px) saturate(180%) !important;
            border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
            padding: 20px 32px !important;
            height: auto !important;
            min-height: 88px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            z-index: 100 !important;
          }
          
          /* Control bar inner container */
          .lk-control-bar__inner {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 12px !important;
            width: 100% !important;
            max-width: 900px !important;
          }
          
          /* Button groups */
          .lk-controls-center {
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
            flex: 0 0 auto !important;
          }
          
          /* Base button styling - Circular modern design */
          .lk-button {
            position: relative !important;
            width: 48px !important;
            height: 48px !important;
            border-radius: 50% !important;
            border: none !important;
            background: rgba(255, 255, 255, 0.1) !important;
            backdrop-filter: blur(10px) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
            color: rgba(255, 255, 255, 0.9) !important;
            overflow: hidden !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
          }
          
          .lk-button:before {
            content: '' !important;
            position: absolute !important;
            inset: 0 !important;
            border-radius: 50% !important;
            padding: 1.5px !important;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0)) !important;
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0) !important;
            -webkit-mask-composite: xor !important;
            mask-composite: exclude !important;
          }
          
          .lk-button:hover:not(:disabled) {
            transform: translateY(-2px) scale(1.08) !important;
            background: rgba(255, 255, 255, 0.15) !important;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3) !important;
          }
          
          /* Microphone button */
          .lk-button[data-lk-source="microphone"][aria-pressed="false"] {
            background: linear-gradient(135deg, #16a34a, #15803d) !important;
            color: white !important;
            box-shadow: 0 4px 14px rgba(22, 163, 74, 0.4) !important;
          }
          
          .lk-button[data-lk-source="microphone"][aria-pressed="false"]:hover {
            background: linear-gradient(135deg, #15803d, #14532d) !important;
            box-shadow: 0 6px 20px rgba(22, 163, 74, 0.5) !important;
          }
          
          .lk-button[data-lk-source="microphone"][aria-pressed="true"] {
            background: rgba(239, 68, 68, 0.9) !important;
            color: white !important;
            position: relative !important;
          }
          
          .lk-button[data-lk-source="microphone"][aria-pressed="true"]:after {
            content: '' !important;
            position: absolute !important;
            width: 2px !important;
            height: 28px !important;
            background: white !important;
            transform: rotate(-45deg) !important;
            border-radius: 1px !important;
          }
          
          /* Camera button */
          .lk-button[data-lk-source="camera"][aria-pressed="false"] {
            background: linear-gradient(135deg, #16a34a, #15803d) !important;
            color: white !important;
            box-shadow: 0 4px 14px rgba(22, 163, 74, 0.4) !important;
          }
          
          .lk-button[data-lk-source="camera"][aria-pressed="false"]:hover {
            background: linear-gradient(135deg, #15803d, #14532d) !important;
            box-shadow: 0 6px 20px rgba(22, 163, 74, 0.5) !important;
          }
          
          .lk-button[data-lk-source="camera"][aria-pressed="true"] {
            background: rgba(239, 68, 68, 0.9) !important;
            color: white !important;
            position: relative !important;
          }
          
          .lk-button[data-lk-source="camera"][aria-pressed="true"]:after {
            content: '' !important;
            position: absolute !important;
            width: 2px !important;
            height: 28px !important;
            background: white !important;
            transform: rotate(-45deg) !important;
            border-radius: 1px !important;
          }
          
          /* Screen share button */
          .lk-button[data-lk-source="screen_share"] {
            background: rgba(59, 130, 246, 0.15) !important;
            color: #60a5fa !important;
          }
          
          .lk-button[data-lk-source="screen_share"][aria-pressed="false"] {
            background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
            color: white !important;
            box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4) !important;
          }
          
          .lk-button[data-lk-source="screen_share"]:hover {
            background: rgba(59, 130, 246, 0.25) !important;
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3) !important;
          }
          
          /* Chat button */
          .lk-button.lk-chat-toggle {
            background: rgba(147, 51, 234, 0.15) !important;
            color: #a78bfa !important;
          }
          
          .lk-button.lk-chat-toggle[aria-pressed="false"] {
            background: linear-gradient(135deg, #8b5cf6, #7c3aed) !important;
            color: white !important;
            box-shadow: 0 4px 14px rgba(139, 92, 246, 0.4) !important;
          }
          
          /* Participants button */
          .lk-button.lk-participants-toggle {
            background: rgba(251, 146, 60, 0.15) !important;
            color: #fdba74 !important;
          }
          
          .lk-button.lk-participants-toggle[aria-pressed="false"] {
            background: linear-gradient(135deg, #fb923c, #f97316) !important;
            color: white !important;
            box-shadow: 0 4px 14px rgba(251, 146, 60, 0.4) !important;
          }
          
          /* Settings/More button */
          .lk-button.lk-settings-button,
          .lk-button[aria-label="More options"] {
            background: rgba(148, 163, 184, 0.15) !important;
            color: #cbd5e1 !important;
          }
          
          .lk-button.lk-settings-button:hover,
          .lk-button[aria-label="More options"]:hover {
            background: rgba(148, 163, 184, 0.25) !important;
          }
          
          /* Leave/Disconnect button - Special styling */
          .lk-button.lk-disconnect-button {
            background: linear-gradient(135deg, #dc2626, #b91c1c) !important;
            width: auto !important;
            padding: 0 24px !important;
            border-radius: 24px !important;
            color: white !important;
            font-weight: 600 !important;
            font-size: 14px !important;
            box-shadow: 0 4px 14px rgba(220, 38, 38, 0.4) !important;
            margin-left: 12px !important;
          }
          
          .lk-button.lk-disconnect-button:hover {
            background: linear-gradient(135deg, #b91c1c, #991b1b) !important;
            transform: translateY(-2px) scale(1.05) !important;
            box-shadow: 0 6px 20px rgba(220, 38, 38, 0.5) !important;
          }
          
          /* Fullscreen button - Add custom styling */
          .lk-button[aria-label*="fullscreen"],
          .lk-button[aria-label*="Fullscreen"] {
            background: rgba(34, 197, 94, 0.15) !important;
            color: #86efac !important;
          }
          
          .lk-button[aria-label*="fullscreen"]:hover,
          .lk-button[aria-label*="Fullscreen"]:hover {
            background: rgba(34, 197, 94, 0.25) !important;
          }
          
          /* Recording button */
          .lk-button[aria-label*="recording"],
          .lk-button[aria-label*="Recording"] {
            background: rgba(239, 68, 68, 0.15) !important;
            color: #fca5a5 !important;
            position: relative !important;
          }
          
          .lk-button[aria-label*="recording"][aria-pressed="false"],
          .lk-button[aria-label*="Recording"][aria-pressed="false"] {
            background: linear-gradient(135deg, #ef4444, #dc2626) !important;
            color: white !important;
            box-shadow: 0 4px 14px rgba(239, 68, 68, 0.4) !important;
          }
          
          .lk-button[aria-label*="recording"][aria-pressed="false"]:before,
          .lk-button[aria-label*="Recording"][aria-pressed="false"]:before {
            content: '' !important;
            position: absolute !important;
            width: 8px !important;
            height: 8px !important;
            background: white !important;
            border-radius: 50% !important;
            top: 8px !important;
            right: 8px !important;
            animation: pulse-recording 1.5s infinite !important;
          }
          
          @keyframes pulse-recording {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
          
          /* Icon styling */
          .lk-button svg {
            width: 20px !important;
            height: 20px !important;
            stroke-width: 2 !important;
            z-index: 1 !important;
          }
          
          /* Hide button labels except for Leave button */
          .lk-button span:not(.lk-disconnect-button span) {
            display: none !important;
          }
          
          /* Tooltip styling */
          .lk-tooltip {
            background: rgba(17, 17, 17, 0.95) !important;
            backdrop-filter: blur(10px) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            border-radius: 8px !important;
            padding: 6px 12px !important;
            font-size: 12px !important;
            color: white !important;
          }
          
          /* Participant tiles */
          .lk-participant-tile {
            background: linear-gradient(135deg, rgba(17, 17, 17, 0.9) 0%, rgba(10, 10, 10, 0.9) 100%) !important;
            border: 2px solid rgba(22, 163, 74, 0.2) !important;
            border-radius: 12px !important;
            overflow: hidden !important;
            transition: all 0.3s ease !important;
          }
          
          .lk-participant-tile:hover {
            border-color: rgba(22, 163, 74, 0.5) !important;
            transform: scale(1.02) !important;
          }
          
          /* Participant name */
          .lk-participant-name {
            background: linear-gradient(90deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 100%) !important;
            backdrop-filter: blur(10px) !important;
            padding: 6px 12px !important;
            border-radius: 8px !important;
            margin: 8px !important;
            font-weight: 600 !important;
          }
          
          /* Chat styling */
          .lk-chat {
            background: linear-gradient(180deg, rgba(17, 17, 17, 0.95) 0%, rgba(10, 10, 10, 0.95) 100%) !important;
            border-left: 2px solid rgba(22, 163, 74, 0.3) !important;
            backdrop-filter: blur(10px) !important;
          }
          
          .lk-chat-form input {
            background: rgba(255, 255, 255, 0.05) !important;
            border: 1px solid rgba(22, 163, 74, 0.3) !important;
            color: white !important;
            border-radius: 8px !important;
            padding: 10px 14px !important;
            transition: all 0.2s ease !important;
          }
          
          .lk-chat-form input:focus {
            background: rgba(255, 255, 255, 0.08) !important;
            border-color: #16a34a !important;
            outline: none !important;
          }
          
          /* Chat messages */
          .lk-chat-entry {
            background: rgba(22, 163, 74, 0.05) !important;
            border-radius: 8px !important;
            padding: 8px 12px !important;
            margin: 4px 8px !important;
          }
          
          /* Settings menu */
          .lk-settings-menu {
            background: linear-gradient(180deg, rgba(17, 17, 17, 0.98) 0%, rgba(10, 10, 10, 0.98) 100%) !important;
            border: 1px solid rgba(22, 163, 74, 0.3) !important;
            border-radius: 12px !important;
            backdrop-filter: blur(20px) !important;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8) !important;
          }
          
          /* Tooltip styling */
          .lk-tooltip {
            background: rgba(17, 17, 17, 0.95) !important;
            border: 1px solid rgba(22, 163, 74, 0.3) !important;
            border-radius: 8px !important;
            padding: 8px 12px !important;
            font-weight: 500 !important;
          }
          
          /* Connection quality indicator */
          .lk-connection-quality {
            background: rgba(0, 0, 0, 0.6) !important;
            border-radius: 6px !important;
            padding: 4px 8px !important;
          }
          
          /* Focus indicator */
          .lk-focus-toggle {
            background: rgba(22, 163, 74, 0.1) !important;
            border: 1px solid rgba(22, 163, 74, 0.3) !important;
            border-radius: 8px !important;
          }
          
          /* Screen share button when active */
          .lk-button[data-lk-source="screen_share"][data-lk-enabled="true"] {
            background: linear-gradient(135deg, #16a34a 0%, #15803d 100%) !important;
            border-color: #16a34a !important;
            animation: pulse 2s infinite !important;
          }
          
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.4);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(22, 163, 74, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(22, 163, 74, 0);
            }
          }
        `}</style>
        
        <LiveKitRoom
          video={true}
          audio={true}
          token={token}
          serverUrl={serverUrl}
          onDisconnected={handleDisconnect}
          connect={true}
          connectOptions={{
            autoSubscribe: true,
          }}
          data-e2e="livekit-room"
          style={{ height: '100%' }}
        >
          <VideoConference />
        </LiveKitRoom>
      </Box>
    </Box>
  );
}