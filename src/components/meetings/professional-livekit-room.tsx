'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import API from '@/lib/axios';
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
  ConnectionStateToast,
  useLocalParticipant,
  useParticipants,
  TrackToggle,
  useTracks,
  Chat,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { Track } from 'livekit-client';
import {
  Box,
  CircularProgress,
  Typography,
  Alert,
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Button,
} from '@mui/material';
import {
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  ScreenShare,
  StopScreenShare,
  Chat as ChatIcon,
  People,
  FiberManualRecord,
  Stop,
  Fullscreen,
  FullscreenExit,
  CallEnd,
  Settings,
  ExpandLess,
  ExpandMore,
  ChevronLeft,
  ChevronRight,
  Close as CloseIcon,
  TrendingUp,
  TrendingDown,
  ShowChart,
  CandlestickChart,
} from '@mui/icons-material';
import Image from 'next/image';
import axios from 'axios';

interface ProfessionalLiveKitRoomProps {
  meetingId: string;
  roomName: string;
  userName: string;
  token?: string;
  serverUrl?: string;
  onDisconnect?: () => void;
}

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
}

// Compact Control Bar Component for screen sharing
function CompactControlBar({
  meetingId,
  isHost,
  onLeave,
  isRecording,
  setIsRecording,
  isCompact = false,
  onToggleCompact,
  showChat,
  setShowChat,
  unreadMessages,
  setUnreadMessages
}: {
  meetingId: string;
  isHost: boolean;
  onLeave: () => void;
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
  isCompact?: boolean;
  onToggleCompact?: () => void;
  showChat?: boolean;
  setShowChat?: (show: boolean) => void;
  unreadMessages?: number;
  setUnreadMessages?: (count: number) => void;
}) {
  const participants = useParticipants();
  const { localParticipant } = useLocalParticipant();

  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [screenShareEnabled, setScreenShareEnabled] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [localUnreadMessages, setLocalUnreadMessages] = useState(0);

  // Fetch real market data with error handling
  const { data: marketData } = useQuery<StockData[]>({
    queryKey: ['meeting-market-data'],
    queryFn: async () => {
      try {
        const response = await API.get('/market/featured');
        return response.data.slice(0, 5);
      } catch (error) {
        console.log('Market data not available, using fallback');
        // Fallback data if API is not available
        return [
          { symbol: 'SPY', name: 'S&P 500', price: 563.70, change: 1.44, changePercent: 0.22 },
          { symbol: 'QQQ', name: 'NASDAQ', price: 499.35, change: 4.03, changePercent: 0.68 },
          { symbol: 'AAPL', name: 'Apple Inc', price: 245.50, change: 7.62, changePercent: 3.20 },
          { symbol: 'MSFT', name: 'Microsoft', price: 417.93, change: -0.48, changePercent: -0.80 },
          { symbol: 'NVDA', name: 'NVIDIA', price: 176.67, change: 0.43, changePercent: 0.24 },
        ];
      }
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    retry: false, // Don't retry on failure
  });

  // Handle recording
  const handleRecording = async () => {
    if (!isHost) return;

    let authToken = localStorage.getItem('custom-auth-token');
    if (!authToken) {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        try {
          const authData = JSON.parse(authStorage);
          authToken = authData.state?.authToken;
        } catch (e) {
          console.error('Failed to parse auth storage:', e);
        }
      }
    }

    if (!authToken) {
      alert('Authentication required to control recording');
      return;
    }

    try {
      const url = isRecording
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/livekit/rooms/${meetingId}/recording/stop`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/v1/livekit/rooms/${meetingId}/recording/start`;

      const response = await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setIsRecording(!isRecording);
    } catch (error: any) {
      console.error('Failed to toggle recording:', error);
      alert(`Failed to ${isRecording ? 'stop' : 'start'} recording. Please try again.`);
    }
  };

  const buttonSize = isCompact ? 40 : 56;
  const iconSize = isCompact ? 'small' : 'medium';

  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(17, 17, 17, 0.95)',
          backdropFilter: 'blur(10px)',
          borderTop: isCompact ? 'none' : '1px solid rgba(22, 163, 74, 0.3)',
          borderRadius: isCompact ? '20px 20px 0 0' : '0',
          padding: isCompact ? 1 : 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: isCompact ? 1 : 2,
          zIndex: 1000,
          minWidth: isCompact ? 'auto' : '100%',
        }}
      >
        {/* Compact/Expand toggle */}
        {onToggleCompact && (
          <IconButton
            onClick={onToggleCompact}
            sx={{
              width: buttonSize - 10,
              height: buttonSize - 10,
              color: 'white',
            }}
          >
            {isCompact ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        )}

        {/* Mic Button */}
        <TrackToggle
          source={Track.Source.Microphone}
          showIcon={false}
          onClick={() => setMicEnabled(!micEnabled)}
        >
          <IconButton
            sx={{
              width: buttonSize,
              height: buttonSize,
              backgroundColor: micEnabled ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              color: 'white',
              border: isCompact ? '1px solid' : '2px solid',
              borderColor: micEnabled ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)',
              '&:hover': {
                backgroundColor: micEnabled ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                transform: isCompact ? 'none' : 'scale(1.05)',
              },
              transition: 'all 0.2s',
            }}
          >
            {micEnabled ? <Mic fontSize={iconSize} /> : <MicOff fontSize={iconSize} />}
          </IconButton>
        </TrackToggle>

        {/* Camera Button */}
        <TrackToggle
          source={Track.Source.Camera}
          showIcon={false}
          onClick={() => setCameraEnabled(!cameraEnabled)}
        >
          <IconButton
            sx={{
              width: buttonSize,
              height: buttonSize,
              backgroundColor: cameraEnabled ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              color: 'white',
              border: isCompact ? '1px solid' : '2px solid',
              borderColor: cameraEnabled ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)',
              '&:hover': {
                backgroundColor: cameraEnabled ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                transform: isCompact ? 'none' : 'scale(1.05)',
              },
              transition: 'all 0.2s',
            }}
          >
            {cameraEnabled ? <Videocam fontSize={iconSize} /> : <VideocamOff fontSize={iconSize} />}
          </IconButton>
        </TrackToggle>

        {/* Screen Share Button */}
        <TrackToggle
          source={Track.Source.ScreenShare}
          showIcon={false}
          onClick={() => setScreenShareEnabled(!screenShareEnabled)}
        >
          <IconButton
            sx={{
              width: buttonSize,
              height: buttonSize,
              backgroundColor: screenShareEnabled ? 'rgba(59, 130, 246, 0.2)' : 'rgba(156, 163, 175, 0.2)',
              color: 'white',
              border: isCompact ? '1px solid' : '2px solid',
              borderColor: screenShareEnabled ? 'rgba(59, 130, 246, 0.3)' : 'rgba(156, 163, 175, 0.3)',
              '&:hover': {
                backgroundColor: screenShareEnabled ? 'rgba(59, 130, 246, 0.3)' : 'rgba(156, 163, 175, 0.3)',
                transform: isCompact ? 'none' : 'scale(1.05)',
              },
              transition: 'all 0.2s',
            }}
          >
            {screenShareEnabled ? <StopScreenShare fontSize={iconSize} /> : <ScreenShare fontSize={iconSize} />}
          </IconButton>
        </TrackToggle>

        {/* Only show essential buttons in compact mode */}
        {!isCompact && (
          <>
            {/* Chat Button */}
            <IconButton
              onClick={() => {
                if (setShowChat) {
                  setShowChat(!showChat);
                  if (!showChat) {
                    if (setUnreadMessages) {
                      setUnreadMessages(0);
                    } else {
                      setLocalUnreadMessages(0);
                    }
                  }
                }
              }}
              sx={{
                width: buttonSize,
                height: buttonSize,
                backgroundColor: showChat ? 'rgba(139, 92, 246, 0.3)' : 'rgba(156, 163, 175, 0.2)',
                color: 'white',
                border: '2px solid',
                borderColor: showChat ? 'rgba(139, 92, 246, 0.4)' : 'rgba(156, 163, 175, 0.3)',
                '&:hover': {
                  backgroundColor: showChat ? 'rgba(139, 92, 246, 0.4)' : 'rgba(156, 163, 175, 0.3)',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s',
                position: 'relative',
              }}
            >
              <Badge
                badgeContent={(unreadMessages !== undefined ? unreadMessages : localUnreadMessages) || 0}
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: '#ef4444',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    animation: ((unreadMessages !== undefined ? unreadMessages : localUnreadMessages) || 0) > 0 ? 'pulse 1s infinite' : 'none',
                  }
                }}
              >
                <ChatIcon fontSize={iconSize} />
              </Badge>
            </IconButton>

            {/* Participants Button */}
            <IconButton
              onClick={() => setShowParticipants(!showParticipants)}
              sx={{
                width: buttonSize,
                height: buttonSize,
                backgroundColor: showParticipants ? 'rgba(236, 72, 153, 0.3)' : 'rgba(156, 163, 175, 0.2)',
                color: 'white',
                border: '2px solid',
                borderColor: showParticipants ? 'rgba(236, 72, 153, 0.4)' : 'rgba(156, 163, 175, 0.3)',
                '&:hover': {
                  backgroundColor: showParticipants ? 'rgba(236, 72, 153, 0.4)' : 'rgba(156, 163, 175, 0.3)',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s',
              }}
            >
              <Badge badgeContent={participants.length} color="primary">
                <People fontSize={iconSize} />
              </Badge>
            </IconButton>
          </>
        )}

        {/* Recording Button (Host Only) */}
        {isHost && (
          <IconButton
            onClick={handleRecording}
            sx={{
              width: buttonSize,
              height: buttonSize,
              backgroundColor: isRecording ? '#ef4444' : 'rgba(239, 68, 68, 0.2)',
              color: 'white',
              border: isCompact ? '1px solid' : '2px solid',
              borderColor: isRecording ? '#ef4444' : 'rgba(239, 68, 68, 0.3)',
              '&:hover': {
                backgroundColor: isRecording ? '#dc2626' : 'rgba(239, 68, 68, 0.3)',
                transform: isCompact ? 'none' : 'scale(1.05)',
              },
              transition: 'all 0.2s',
              boxShadow: isRecording ? '0 4px 14px rgba(239, 68, 68, 0.4)' : 'none',
              animation: isRecording ? 'pulse 2s infinite' : 'none',
            }}
          >
            {isRecording ? <Stop fontSize={iconSize} /> : <FiberManualRecord fontSize={iconSize} />}
          </IconButton>
        )}

        {/* Settings Button - hide in compact */}
        {!isCompact && (
          <IconButton
            sx={{
              width: buttonSize,
              height: buttonSize,
              backgroundColor: 'rgba(156, 163, 175, 0.2)',
              color: 'white',
              border: '2px solid rgba(156, 163, 175, 0.3)',
              '&:hover': {
                backgroundColor: 'rgba(156, 163, 175, 0.3)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s',
            }}
          >
            <Settings fontSize={iconSize} />
          </IconButton>
        )}

        {/* Leave Button */}
        <Button
          onClick={onLeave}
          variant="contained"
          startIcon={!isCompact && <CallEnd />}
          sx={{
            ml: isCompact ? 0 : 2,
            px: isCompact ? 2 : 3,
            py: isCompact ? 0.75 : 1.5,
            backgroundColor: '#dc2626',
            '&:hover': {
              backgroundColor: '#b91c1c',
              transform: isCompact ? 'none' : 'scale(1.05)',
            },
            borderRadius: '28px',
            fontWeight: 600,
            fontSize: isCompact ? '0.875rem' : '1rem',
            transition: 'all 0.2s',
            boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)',
            minWidth: isCompact ? 'auto' : 'initial',
          }}
        >
          {isCompact ? 'Leave' : (isHost ? 'Leave Meeting' : 'Leave')}
        </Button>

        {/* End Meeting Button (Host Only) - hide in compact */}
        {isHost && !isCompact && (
          <Button
            onClick={async () => {
              let authToken = localStorage.getItem('custom-auth-token');
              if (!authToken) {
                const authStorage = localStorage.getItem('auth-storage');
                if (authStorage) {
                  try {
                    const authData = JSON.parse(authStorage);
                    authToken = authData.state?.authToken;
                  } catch (e) {
                    console.error('Failed to parse auth storage:', e);
                  }
                }
              }

              if (authToken && meetingId) {
                const confirmed = window.confirm('Are you sure you want to end this meeting for all participants?');
                if (confirmed) {
                  try {
                    await axios.post(
                      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/livekit/rooms/${meetingId}/end`,
                      {},
                      {
                        headers: {
                          Authorization: `Bearer ${authToken}`,
                        },
                      }
                    );
                    onLeave();
                  } catch (err) {
                    console.error('Failed to end meeting:', err);
                    alert('Failed to end meeting. Please try again.');
                  }
                }
              }
            }}
            variant="contained"
            sx={{
              ml: 1,
              px: 3,
              py: 1.5,
              backgroundColor: '#dc2626',
              '&:hover': {
                backgroundColor: '#b91c1c',
                transform: 'scale(1.05)',
              },
              borderRadius: '28px',
              fontWeight: 600,
              transition: 'all 0.2s',
              boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)',
            }}
          >
            End Meeting
          </Button>
        )}
      </Box>

      {/* Enhanced Trading-Themed Participants Drawer */}
      <Drawer
        anchor="left"
        open={showParticipants}
        onClose={() => setShowParticipants(false)}
        PaperProps={{
          sx: {
            width: 380,
            background: 'linear-gradient(180deg, rgba(15,15,15,0.98) 0%, rgba(10,10,10,0.98) 100%)',
            backdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(22, 163, 74, 0.3)',
            boxShadow: '4px 0 20px rgba(22, 163, 74, 0.1)',
          }
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header with Trading Theme */}
          <Box sx={{
            p: 2.5,
            background: 'linear-gradient(90deg, rgba(22, 163, 74, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)',
            borderBottom: '1px solid rgba(22, 163, 74, 0.2)',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{
                color: '#fff',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}>
                <People sx={{ color: '#16a34a' }} />
                Trading Room ({participants.length})
              </Typography>
              <IconButton
                onClick={() => setShowParticipants(false)}
                sx={{
                  color: 'rgba(255,255,255,0.6)',
                  '&:hover': {
                    color: '#16a34a',
                    backgroundColor: 'rgba(22, 163, 74, 0.1)',
                  }
                }}
              >
                <CloseIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>

            {/* Real Stock Market Ticker Animation */}
            <Box sx={{
              overflow: 'hidden',
              position: 'relative',
              height: 30,
              borderRadius: '6px',
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(22, 163, 74, 0.1)',
              display: 'flex',
              alignItems: 'center',
            }}>
              <Box sx={{
                display: 'flex',
                gap: 3,
                animation: 'ticker 60s linear infinite',
                whiteSpace: 'nowrap',
                px: 2,
              }}>
                {marketData ? (
                  <>
                    {marketData.map((stock) => {
                      const isPositive = stock.changePercent >= 0;
                      return (
                        <Typography
                          key={stock.symbol}
                          sx={{
                            color: isPositive ? '#16a34a' : '#ef4444',
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            fontWeight: 500,
                          }}
                        >
                          {isPositive ? <TrendingUp sx={{ fontSize: 14 }} /> : <TrendingDown sx={{ fontSize: 14 }} />}
                          {stock.symbol} ${stock.price.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                        </Typography>
                      );
                    })}
                    {/* Repeat for seamless loop */}
                    {marketData.map((stock) => {
                      const isPositive = stock.changePercent >= 0;
                      return (
                        <Typography
                          key={`${stock.symbol}-2`}
                          sx={{
                            color: isPositive ? '#16a34a' : '#ef4444',
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            fontWeight: 500,
                          }}
                        >
                          {isPositive ? <TrendingUp sx={{ fontSize: 14 }} /> : <TrendingDown sx={{ fontSize: 14 }} />}
                          {stock.symbol} ${stock.price.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                        </Typography>
                      );
                    })}
                  </>
                ) : (
                  // Loading state
                  <>
                    <Typography sx={{ color: '#6b7280', fontSize: '0.8rem' }}>
                      Loading market data...
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
          </Box>

          {/* Candlestick Chart Background Effect */}
          <Box sx={{
            position: 'absolute',
            top: 120,
            right: 20,
            opacity: 0.1,
            zIndex: 0,
            pointerEvents: 'none',
          }}>
            <svg width="150" height="100" viewBox="0 0 150 100">
              {/* Animated Candlestick Chart */}
              <g className="candlestick-animation">
                <rect x="10" y="30" width="8" height="40" fill="#16a34a" />
                <line x1="14" y1="20" x2="14" y2="30" stroke="#16a34a" strokeWidth="2" />
                <line x1="14" y1="70" x2="14" y2="80" stroke="#16a34a" strokeWidth="2" />

                <rect x="30" y="25" width="8" height="30" fill="#ef4444" />
                <line x1="34" y1="15" x2="34" y2="25" stroke="#ef4444" strokeWidth="2" />
                <line x1="34" y1="55" x2="34" y2="65" stroke="#ef4444" strokeWidth="2" />

                <rect x="50" y="35" width="8" height="25" fill="#16a34a" />
                <line x1="54" y1="25" x2="54" y2="35" stroke="#16a34a" strokeWidth="2" />
                <line x1="54" y1="60" x2="54" y2="70" stroke="#16a34a" strokeWidth="2" />

                <rect x="70" y="20" width="8" height="45" fill="#16a34a" />
                <line x1="74" y1="10" x2="74" y2="20" stroke="#16a34a" strokeWidth="2" />
                <line x1="74" y1="65" x2="74" y2="75" stroke="#16a34a" strokeWidth="2" />

                <rect x="90" y="40" width="8" height="20" fill="#ef4444" />
                <line x1="94" y1="30" x2="94" y2="40" stroke="#ef4444" strokeWidth="2" />
                <line x1="94" y1="60" x2="94" y2="70" stroke="#ef4444" strokeWidth="2" />

                <rect x="110" y="25" width="8" height="35" fill="#16a34a" />
                <line x1="114" y1="15" x2="114" y2="25" stroke="#16a34a" strokeWidth="2" />
                <line x1="114" y1="60" x2="114" y2="70" stroke="#16a34a" strokeWidth="2" />

                <rect x="130" y="30" width="8" height="30" fill="#16a34a" />
                <line x1="134" y1="20" x2="134" y2="30" stroke="#16a34a" strokeWidth="2" />
                <line x1="134" y1="60" x2="134" y2="70" stroke="#16a34a" strokeWidth="2" />
              </g>
            </svg>
          </Box>

          {/* Participants List */}
          <List sx={{ flex: 1, overflow: 'auto', position: 'relative', zIndex: 1, px: 1 }}>
            {participants.map((participant, index) => {
              const isYou = participant.identity === localParticipant?.identity;
              const randomChange = index % 3 === 0 ? '+' : '-';
              const randomPercent = (Math.random() * 5).toFixed(1);
              const isPositive = randomChange === '+';

              return (
                <ListItem
                  key={participant.identity}
                  sx={{
                    mb: 1,
                    borderRadius: '12px',
                    background: isPositive
                      ? 'linear-gradient(135deg, rgba(22, 163, 74, 0.15) 0%, rgba(22, 163, 74, 0.05) 100%)'
                      : 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)',
                    border: isPositive
                      ? '1px solid rgba(22, 163, 74, 0.3)'
                      : '1px solid rgba(239, 68, 68, 0.3)',
                    transition: 'all 0.3s',
                    '&:hover': {
                      background: isPositive
                        ? 'linear-gradient(135deg, rgba(22, 163, 74, 0.2) 0%, rgba(22, 163, 74, 0.1) 100%)'
                        : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.1) 100%)',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: isYou ? '#16a34a' : '#1a1a1a',
                        border: isYou ? '2px solid #16a34a' : '2px solid rgba(255,255,255,0.1)',
                        fontWeight: 600,
                      }}
                    >
                      {participant.name?.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography sx={{
                          color: '#fff',
                          fontWeight: isYou ? 600 : 400,
                          fontSize: '0.95rem',
                        }}>
                          {participant.name}
                          {isYou && (
                            <Chip
                              label="YOU"
                              size="small"
                              sx={{
                                ml: 1,
                                height: 18,
                                fontSize: '0.65rem',
                                backgroundColor: '#16a34a',
                                color: '#fff',
                                fontWeight: 700,
                              }}
                            />
                          )}
                        </Typography>
                        {/* Mock Trading Performance */}
                        <Typography sx={{
                          color: isPositive ? '#16a34a' : '#ef4444',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.3,
                        }}>
                          {isPositive ? <TrendingUp sx={{ fontSize: 12 }} /> : <TrendingDown sx={{ fontSize: 12 }} />}
                          {randomChange}{randomPercent}%
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5 }}>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {participant.isMicrophoneEnabled ?
                            <Box sx={{
                              width: 20,
                              height: 20,
                              borderRadius: '4px',
                              backgroundColor: 'rgba(22, 163, 74, 0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                              <Mic sx={{ fontSize: 12, color: '#16a34a' }} />
                            </Box> :
                            <Box sx={{
                              width: 20,
                              height: 20,
                              borderRadius: '4px',
                              backgroundColor: 'rgba(239, 68, 68, 0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                              <MicOff sx={{ fontSize: 12, color: '#ef4444' }} />
                            </Box>
                          }
                          {participant.isCameraEnabled ?
                            <Box sx={{
                              width: 20,
                              height: 20,
                              borderRadius: '4px',
                              backgroundColor: 'rgba(22, 163, 74, 0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                              <Videocam sx={{ fontSize: 12, color: '#16a34a' }} />
                            </Box> :
                            <Box sx={{
                              width: 20,
                              height: 20,
                              borderRadius: '4px',
                              backgroundColor: 'rgba(239, 68, 68, 0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                              <VideocamOff sx={{ fontSize: 12, color: '#ef4444' }} />
                            </Box>
                          }
                        </Box>
                        <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>
                          Trading Level: Pro
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              );
            })}
          </List>

          {/* Footer with Session Stats */}
          <Box sx={{
            p: 2,
            borderTop: '1px solid rgba(22, 163, 74, 0.2)',
            background: 'rgba(0,0,0,0.3)',
          }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', textAlign: 'center' }}>
              Session Duration: {new Date().toLocaleTimeString()}
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

// Main Room Content - Optimized for screen sharing
// Keep chat mounted but hidden to preserve messages
// Updated chat design with side-by-side input and send button

const RoomContent = React.memo(function RoomContent({
  meetingId,
  isHost,
  onDisconnect,
  isRecording,
  setIsRecording
}: {
  meetingId: string;
  isHost: boolean;
  onDisconnect: () => void;
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
}) {
  const [showControls, setShowControls] = useState(true);
  const [isCompact, setIsCompact] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const hideControlsTimer = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect screen sharing
  const tracks = useTracks([Track.Source.ScreenShare], { onlySubscribed: false });
  const hasScreenShare = tracks && tracks.length > 0;

  // Auto-hide controls during screen share
  useEffect(() => {
    if (hasScreenShare) {
      // Set compact mode and start auto-hide timer
      setIsCompact(true);

      if (hideControlsTimer.current) {
        clearTimeout(hideControlsTimer.current);
      }

      hideControlsTimer.current = setTimeout(() => {
        setShowControls(false);
      }, 5000);
    } else {
      // No screen share - show full controls
      setIsCompact(false);
      setShowControls(true);

      if (hideControlsTimer.current) {
        clearTimeout(hideControlsTimer.current);
        hideControlsTimer.current = null;
      }
    }

    return () => {
      if (hideControlsTimer.current) {
        clearTimeout(hideControlsTimer.current);
      }
    };
  }, [hasScreenShare]);

  // Show controls on mouse movement
  const handleMouseMove = useCallback(() => {
    if (hasScreenShare) {
      setShowControls(true);

      if (hideControlsTimer.current) {
        clearTimeout(hideControlsTimer.current);
      }

      hideControlsTimer.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [hasScreenShare]);

  // Show controls when mouse enters bottom area
  const handleMouseEnterBottom = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect && e.clientY > rect.bottom - 100) {
      setShowControls(true);
    }
  }, []);

  return (
    <Box
      ref={containerRef}
      sx={{
        height: '100%',
        position: 'relative',
        backgroundColor: '#0a0a0a',
        overflow: 'hidden',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnterBottom}
    >
      {/* VideoConference takes full height when controls are hidden */}
      <Box
        sx={{
          height: '100%',
          width: '100%',
          position: 'relative',
        }}
        className={hasScreenShare ? 'screen-sharing-active' : ''}
      >
        <VideoConference
          chatMessageFormatter={(message) => message}
          SettingsComponent={() => null}
        />
      </Box>

      {/* Control bar overlay - slides up/down */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          transform: showControls ? 'translateY(0)' : 'translateY(120%)',
          transition: 'transform 0.3s ease',
          pointerEvents: showControls ? 'auto' : 'none',
        }}
      >
        <CompactControlBar
          meetingId={meetingId}
          isHost={isHost}
          onLeave={onDisconnect}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          isCompact={isCompact}
          onToggleCompact={() => setIsCompact(!isCompact)}
          showChat={showChat}
          setShowChat={setShowChat}
          unreadMessages={unreadMessages}
          setUnreadMessages={setUnreadMessages}
        />
      </Box>

      {/* Show hint when controls are hidden */}
      {hasScreenShare && !showControls && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '0.75rem',
            pointerEvents: 'none',
            opacity: 0.6,
          }}
        >
          Move mouse to show controls
        </Box>
      )}

      {/* Enhanced Trading-Themed Chat Drawer */}
      <Drawer
        anchor="right"
        open={showChat}
        onClose={() => {
          setShowChat(false);
          setUnreadMessages(0);
        }}
        keepMounted
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 450 },
            height: '100%',
            background: 'linear-gradient(180deg, rgba(15,15,15,0.98) 0%, rgba(10,10,10,0.98) 100%)',
            backdropFilter: 'blur(20px)',
            borderLeft: '1px solid rgba(22, 163, 74, 0.3)',
            boxShadow: '-4px 0 20px rgba(22, 163, 74, 0.1)',
            zIndex: 2000,
            overflow: 'hidden',
          }
        }}
      >
        <Box sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
        }}>
          {/* Chat Header with Trading Theme */}
          <Box sx={{
            flexShrink: 0,
            p: 2.5,
            background: 'linear-gradient(90deg, rgba(22, 163, 74, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)',
            borderBottom: '1px solid rgba(22, 163, 74, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#16a34a',
                animation: 'pulse 2s infinite',
              }} />
              <Typography variant="h6" sx={{
                color: '#fff',
                fontWeight: 600,
                fontSize: '1.1rem',
                letterSpacing: '0.5px',
              }}>
                Trading Room Chat
              </Typography>
            </Box>
            <IconButton
              onClick={() => setShowChat(false)}
              sx={{
                color: 'rgba(255,255,255,0.6)',
                '&:hover': {
                  color: '#16a34a',
                  backgroundColor: 'rgba(22, 163, 74, 0.1)',
                }
              }}
            >
              <CloseIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>

          {/* Market Status Bar */}
          <Box sx={{
            flexShrink: 0,
            px: 2,
            py: 1,
            borderBottom: '1px solid rgba(22, 163, 74, 0.1)',
            background: 'rgba(0,0,0,0.3)',
          }}>
            <Typography sx={{
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.5)',
              textAlign: 'center',
            }}>
              Messages are visible to all participants
            </Typography>
          </Box>

          {/* Chat Component Container - Fixed Height */}
          <Box sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            minHeight: 0, // Important for flex child
            maxHeight: 'calc(100vh - 140px)', // Account for header and status bar
            '& .lk-chat': {
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              background: 'transparent',
              color: '#fff',
              position: 'relative',
            },
            '& .lk-chat-messages': {
              flex: 1,
              overflowY: 'auto',
              padding: '12px',
              paddingBottom: '80px', // Add space for input
              minHeight: 0,
              maxHeight: 'calc(100vh - 280px)', // Leave space for input
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(22, 163, 74, 0.2)',
                borderRadius: '2px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'rgba(255,255,255,0.02)',
              },
            },
            '& .lk-message-container': {
              marginBottom: '4px',
            },
            '& .lk-chat-entry': {
              padding: '10px 12px',
              background: `
                linear-gradient(90deg,
                  rgba(0, 0, 0, 0.5) 0%,
                  rgba(0, 0, 0, 0.3) 100%
                ),
                repeating-linear-gradient(
                  90deg,
                  transparent 0px,
                  transparent 8px,
                  rgba(255, 255, 255, 0.01) 8px,
                  rgba(255, 255, 255, 0.01) 9px,
                  transparent 9px,
                  transparent 20px,
                  rgba(255, 255, 255, 0.01) 20px,
                  rgba(255, 255, 255, 0.01) 21px
                )
              `,
              backgroundSize: '100% 100%, 100% 100%',
              borderRadius: '4px',
              border: 'none',
              borderLeft: '2px solid transparent',
              marginBottom: '6px',
              marginRight: '8px',
              marginLeft: '8px',
              wordBreak: 'break-word',
              position: 'relative',
              transition: 'all 0.1s ease',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: '0',
                top: '0',
                right: '0',
                bottom: '0',
                background: `
                  repeating-linear-gradient(
                    0deg,
                    transparent 0%,
                    transparent 35%,
                    rgba(239, 68, 68, 0.03) 35%,
                    rgba(239, 68, 68, 0.03) 45%,
                    transparent 45%,
                    transparent 55%,
                    rgba(34, 197, 94, 0.03) 55%,
                    rgba(34, 197, 94, 0.03) 65%,
                    transparent 65%,
                    transparent 100%
                  )
                `,
                backgroundSize: '12px 20px',
                backgroundPosition: 'right center',
                opacity: 0.6,
                pointerEvents: 'none',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                left: '-6px',
                top: '12px',
                width: '3px',
                height: '3px',
                borderRadius: '50%',
                backgroundColor: '#16a34a',
                opacity: 0.6,
                boxShadow: '0 0 4px rgba(22, 163, 74, 0.4)',
              },
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                borderLeftColor: '#16a34a',
                '&::before': {
                  opacity: 0.8,
                },
              }
            },
            '& .lk-message-sender': {
              color: '#16a34a',
              fontWeight: 500,
              fontSize: '0.75rem',
              marginBottom: '3px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              opacity: 0.9,
            },
            '& .lk-message-body': {
              color: 'rgba(255,255,255,0.85)',
              fontSize: '0.875rem',
              lineHeight: '1.4',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            },
            '& .lk-message-timestamp': {
              color: 'rgba(255,255,255,0.25)',
              fontSize: '0.68rem',
              marginTop: '2px',
              fontFamily: 'monospace',
            },
            '& .lk-chat-form': {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '12px',
              borderTop: '1px solid rgba(22, 163, 74, 0.2)',
              background: 'linear-gradient(180deg, rgba(0,0,0,0.98) 0%, rgba(10,10,10,1) 100%)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '8px',
              zIndex: 10,
              boxSizing: 'border-box',
              width: '100%',
            },
            '& .lk-chat-form input': {
              flex: '1 1 auto',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(22, 163, 74, 0.15)',
              borderRadius: '6px',
              color: 'rgba(255,255,255,0.9)',
              padding: '10px 14px !important',
              fontSize: '14px',
              height: '40px',
              boxSizing: 'border-box',
              transition: 'all 0.15s',
              margin: '0',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              '&:focus': {
                outline: 'none',
                borderColor: 'rgba(22, 163, 74, 0.5)',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)',
              },
              '&::placeholder': {
                color: 'rgba(255,255,255,0.35)',
                fontSize: '13px',
              }
            },
            '& .lk-chat-form button': {
              flex: '0 0 auto',
              width: '40px',
              height: '40px',
              backgroundColor: '#16a34a',
              borderRadius: '6px',
              padding: '0',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              transition: 'all 0.15s',
              margin: '0',
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              '&::before': {
                content: '"➤"',
                fontSize: '18px',
                fontWeight: 'bold',
                display: 'block',
              },
              '& > *': {
                display: 'none',
              },
              '&:hover': {
                backgroundColor: '#1fbd54',
                transform: 'scale(1.05)',
                boxShadow: '0 3px 10px rgba(22, 163, 74, 0.3)',
              },
              '&:active': {
                backgroundColor: '#148a3c',
                transform: 'scale(0.98)',
              }
            },
          }}>
            <Chat />
          </Box>
        </Box>
      </Drawer>

      <RoomAudioRenderer />
      <ConnectionStateToast />
    </Box>
  );
});

// Main Room Component
export function ProfessionalLiveKitRoom({
  meetingId,
  roomName,
  userName,
  token: providedToken,
  serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || 'wss://live.daytradedak.com',
  onDisconnect,
}: ProfessionalLiveKitRoomProps) {
  const [token, setToken] = useState<string | null>(providedToken || null);
  const [loading, setLoading] = useState(!providedToken);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [meetingData, setMeetingData] = useState<any>(null);

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
    if (!token) return;

    const checkMeetingStatus = async () => {
      try {
        let authToken = localStorage.getItem('custom-auth-token');
        if (!authToken) {
          const authStorage = localStorage.getItem('auth-storage');
          if (authStorage) {
            const parsed = JSON.parse(authStorage);
            authToken = parsed.state?.authToken;
          }
        }

        if (authToken && meetingId) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/meetings/${meetingId}`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );

          if (response.ok) {
            const meeting = await response.json();
            setMeetingData(meeting);
            if (meeting.isRecording !== undefined) {
              setIsRecording(meeting.isRecording);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch meeting status:', error);
      }
    };

    checkMeetingStatus();
    const interval = setInterval(checkMeetingStatus, 10000);

    return () => clearInterval(interval);
  }, [meetingId, token]);

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

          try {
            const payload = JSON.parse(atob(data.token.split('.')[1]));
            const metadata = payload.metadata ? JSON.parse(payload.metadata) : {};
            setIsHost(metadata.isHost === true);
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
    } else {
      try {
        const payload = JSON.parse(atob(providedToken.split('.')[1]));
        const metadata = payload.metadata ? JSON.parse(payload.metadata) : {};
        setIsHost(metadata.isHost === true);
      } catch (e) {
        console.error('Failed to parse token:', e);
      }
    }
  }, [meetingId, userName, providedToken]);

  const handleDisconnect = async () => {
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
        }}
      >
        <Alert severity="error">{error || 'Failed to join meeting'}</Alert>
      </Box>
    );
  }

  return (
    <>
      <style jsx global>{`
        /* Trading Academy Theme - Basic LiveKit styles */
        .lk-room {
          height: 100%;
          background: linear-gradient(135deg, #0a0a0a 0%, #0f0f0f 100%);
          position: relative;
        }

        /* Add subtle trading grid pattern overlay */
        .lk-room::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image:
            linear-gradient(rgba(22, 163, 74, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(22, 163, 74, 0.02) 1px, transparent 1px);
          background-size: 50px 50px;
          pointer-events: none;
          z-index: 1;
        }

        .lk-video-conference {
          height: 100%;
        }

        /* Hide default LiveKit control bar */
        .lk-control-bar {
          display: none !important;
        }

        /* Enhanced participant tiles with trading theme */
        .lk-participant-tile {
          background: linear-gradient(135deg, #1a1a1a 0%, #151515 100%);
          border: 1px solid rgba(22, 163, 74, 0.2);
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          transition: all 0.3s ease;
        }

        .lk-participant-tile::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #16a34a, transparent);
          animation: slideGlow 3s linear infinite;
          opacity: 0.6;
        }

        @keyframes slideGlow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .lk-participant-tile:hover {
          border-color: #16a34a;
          transform: scale(1.02);
          box-shadow: 0 4px 20px rgba(22, 163, 74, 0.2);
        }

        /* Participant metadata styling */
        .lk-participant-metadata {
          background: linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%);
          backdrop-filter: blur(10px);
          padding: 8px 12px;
          border-radius: 8px;
          margin: 8px;
        }

        .lk-participant-metadata__name {
          color: #fff;
          font-weight: 600;
          font-size: 14px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }

        /* Speaking indicator */
        .lk-participant-tile.lk-speaking {
          border-color: #16a34a;
          box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.3), 0 0 20px rgba(22, 163, 74, 0.4);
        }

        /* Video display */
        .lk-participant-tile video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Enhanced grid layout with trading floor feel */
        .lk-grid-layout {
          height: 100%;
          padding: 1.5rem;
          gap: 1rem;
          position: relative;
          background: radial-gradient(ellipse at center, rgba(22, 163, 74, 0.02) 0%, transparent 70%);
        }

        /* Add corner indicators like trading screens */
        .lk-grid-layout::before,
        .lk-grid-layout::after {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid #16a34a;
          opacity: 0.3;
        }

        .lk-grid-layout::before {
          top: 10px;
          left: 10px;
          border-right: none;
          border-bottom: none;
        }

        .lk-grid-layout::after {
          bottom: 10px;
          right: 10px;
          border-left: none;
          border-top: none;
        }

        /* Focus layout for screen sharing */
        .lk-focus-layout {
          height: 100%;
          background-color: #0a0a0a;
        }

        /* Auto-hide sidebar during screen share with animation */
        .screen-sharing-active .lk-focus-layout__sidebar {
          max-width: 120px !important;
          min-width: 120px !important;
          width: 120px !important;
          transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out !important;
          animation: hideAfterDelay 0.5s ease-in-out 3s forwards;
        }

        @keyframes hideAfterDelay {
          to {
            transform: translateX(130px);
            opacity: 0;
          }
        }

        /* Show sidebar on hover */
        .screen-sharing-active:hover .lk-focus-layout__sidebar {
          animation: none !important;
          transform: translateX(0) !important;
          opacity: 1 !important;
        }

        /* Smaller participant tiles in sidebar */
        .screen-sharing-active .lk-focus-layout__sidebar .lk-participant-tile {
          width: 110px !important;
          height: 82px !important;
        }

        /* Hide names to save space */
        .screen-sharing-active .lk-participant-metadata {
          display: none !important;
        }

        /* Compact participant list in sidebar */
        .screen-sharing-active .lk-focus-layout__sidebar .lk-participant-list {
          gap: 0.25rem !important;
          padding: 0.25rem !important;
        }

        /* Bottom carousel for additional participants */
        .screen-sharing-active .lk-focus-layout__carousel {
          max-height: 90px;
        }

        /* Smaller tiles in carousel */
        .screen-sharing-active .lk-focus-layout__carousel .lk-participant-tile {
          max-width: 80px !important;
          max-height: 70px !important;
        }

        /* Optimize screen share video */
        .lk-screen-share video {
          object-fit: contain !important;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(239, 68, 68, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(239, 68, 68, 0.8);
          }
        }

        /* Professional Trading Terminal Feel */
        .lk-participant-tile__info {
          background: linear-gradient(90deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 100%);
          backdrop-filter: blur(10px);
          padding: 6px 10px;
          border-radius: 6px;
          border: 1px solid rgba(22, 163, 74, 0.2);
        }

        /* Enhanced focus layout for presentations */
        .lk-focus-layout {
          background: radial-gradient(ellipse at center, rgba(22, 163, 74, 0.02) 0%, transparent 60%);
        }

        /* Trading terminal style scrollbars */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(22, 163, 74, 0.05);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(22, 163, 74, 0.3);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(22, 163, 74, 0.5);
        }

        /* Market ticker animation for header */
        @keyframes ticker {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }

        /* Trading chart grid effect */
        .trading-grid::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image:
            repeating-linear-gradient(0deg,
              transparent,
              transparent 49px,
              rgba(22, 163, 74, 0.03) 49px,
              rgba(22, 163, 74, 0.03) 50px),
            repeating-linear-gradient(90deg,
              transparent,
              transparent 49px,
              rgba(22, 163, 74, 0.03) 49px,
              rgba(22, 163, 74, 0.03) 50px);
          pointer-events: none;
        }

        /* Candlestick chart animation */
        .candlestick-animation {
          animation: candlestickGrow 3s ease-in-out infinite;
        }

        @keyframes candlestickGrow {
          0%, 100% {
            transform: scaleY(1);
            opacity: 0.3;
          }
          50% {
            transform: scaleY(1.1);
            opacity: 0.5;
          }
        }

        /* Stock ticker animation */
        @keyframes ticker {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-200%);
          }
        }

        /* Trading pulse effect */
        @keyframes tradingPulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.4);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(22, 163, 74, 0);
          }
        }

        /* Market data animation */
        .market-indicator {
          animation: marketFlash 2s ease-in-out infinite;
        }

        @keyframes marketFlash {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }

        /* Chat bounce animation for typing indicator */
        @keyframes bounce {
          0%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
        }
      `}</style>

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
        {/* Enhanced Trading Academy Header */}
        <AppBar position="static" sx={{
          background: 'linear-gradient(90deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)',
          borderBottom: '2px solid rgba(22, 163, 74, 0.4)',
          minHeight: '70px',
          zIndex: 1000,
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #16a34a, transparent)',
            animation: 'slideGlow 3s linear infinite',
          }
        }}>
          <Toolbar sx={{ minHeight: '70px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
              <Box sx={{
                p: 1,
                borderRadius: '8px',
                background: 'rgba(22, 163, 74, 0.1)',
                border: '1px solid rgba(22, 163, 74, 0.2)',
                display: 'flex',
                alignItems: 'center',
              }}>
                <Image
                  src="/assets/logos/day_trade_dak_white_logo.png"
                  alt="DayTradeDak Academy"
                  width={120}
                  height={40}
                  style={{ objectFit: 'contain' }}
                />
              </Box>
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{
                color: '#fff',
                fontWeight: 700,
                fontSize: '1.2rem',
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}>
                <Box component="span" sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#16a34a',
                  display: 'inline-block',
                  animation: 'pulse 2s infinite',
                }} />
                {roomName}
              </Typography>
              <Typography variant="caption" sx={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.75rem',
              }}>
                Professional Trading Session
              </Typography>
            </Box>
            {/* Status Indicators */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 3 }}>
              {isRecording && (
                <Chip
                  icon={<FiberManualRecord sx={{ animation: 'pulse 1.5s infinite' }} />}
                  label="REC"
                  size="medium"
                  sx={{
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid #ef4444',
                    color: '#ef4444',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    animation: 'glow 1.5s ease-in-out infinite',
                    '&:hover': {
                      backgroundColor: 'rgba(239, 68, 68, 0.3)',
                    }
                  }}
                />
              )}
              {isHost && (
                <Chip
                  label="HOST"
                  size="medium"
                  sx={{
                    background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    border: '1px solid rgba(220, 38, 38, 0.3)',
                    boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)',
                  }}
                />
              )}
              <Box sx={{
                px: 2,
                py: 0.5,
                borderRadius: '20px',
                background: 'rgba(22, 163, 74, 0.1)',
                border: '1px solid rgba(22, 163, 74, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}>
                <People sx={{ color: '#16a34a', fontSize: 18 }} />
                <Typography sx={{ color: '#16a34a', fontWeight: 600, fontSize: '0.9rem' }}>
                  Live
                </Typography>
              </Box>
            </Box>
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
          backgroundColor: '#0a0a0a',
        }}>
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
            style={{
              height: '100%',
              width: '100%',
            }}
          >
            <RoomContent
              meetingId={meetingId}
              isHost={isHost}
              onDisconnect={handleDisconnect}
              isRecording={isRecording}
              setIsRecording={setIsRecording}
            />
          </LiveKitRoom>
        </Box>
      </Box>
    </>
  );
}