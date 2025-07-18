'use client';

import React, { useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Stack,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Microphone,
  MicrophoneSlash,
  VideoCamera,
  VideoCameraSlash,
  Desktop,
  Crown,
} from '@phosphor-icons/react';
import { useParticipant } from '@videosdk.live/react-sdk';

interface ParticipantViewProps {
  participantId: string;
  isPresenter?: boolean;
  isMainStage?: boolean;
}

export function ParticipantView({ participantId, isPresenter = false }: ParticipantViewProps) {
  const theme = useTheme();
  const {
    webcamStream,
    screenShareStream,
    webcamOn,
    micOn,
    screenShareOn,
    displayName,
    isLocal,
  } = useParticipant(participantId);

  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);

  // Handle webcam stream
  useEffect(() => {
    if (webcamStream && videoRef.current) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play().catch((error: unknown) => console.error(error));
    }
  }, [webcamStream]);

  // Handle screen share stream
  useEffect(() => {
    if (screenShareStream && screenRef.current) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(screenShareStream.track);
      screenRef.current.srcObject = mediaStream;
      screenRef.current.play().catch((error: unknown) => console.error(error));
    }
  }, [screenShareStream]);

  const isHost = false; // TODO: Determine host status differently
  const showVideo = webcamOn && webcamStream;
  const showScreen = screenShareOn && screenShareStream;

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        bgcolor: 'background.paper',
        overflow: 'hidden',
        borderRadius: isPresenter ? 0 : 1,
      }}
    >
      {/* Video/Screen Content */}
      {showScreen && isPresenter ? (
        <video
          ref={screenRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        >
          <track kind="captions" />
        </video>
      ) : showVideo ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: isLocal ? 'scaleX(-1)' : 'none',
          }}
        >
          <track kind="captions" />
        </video>
      ) : (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha(theme.palette.primary.main, 0.05),
          }}
        >
          <Stack alignItems="center" spacing={2}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h3" color="primary">
                {displayName?.charAt(0).toUpperCase()}
              </Typography>
            </Box>
            {!isPresenter && (
              <Typography variant="body2" color="text.secondary">
                Camera Off
              </Typography>
            )}
          </Stack>
        </Box>
      )}

      {/* Overlay Info */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: 1,
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography
              variant="caption"
              sx={{
                color: 'white',
                fontWeight: 500,
                maxWidth: 120,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {displayName}
              {isLocal ? ' (You)' : ''}
            </Typography>
            {isHost && (
              <Crown size={14} color={theme.palette.warning.main} weight="fill" />
            )}
          </Stack>
          
          <Stack direction="row" spacing={0.5}>
            {screenShareOn ? (
              <Desktop size={16} color="white" />
            ) : null}
            {micOn ? (
              <Microphone size={16} color="white" />
            ) : (
              <MicrophoneSlash size={16} color={theme.palette.error.main} />
            )}
            {webcamOn ? (
              <VideoCamera size={16} color="white" />
            ) : (
              <VideoCameraSlash size={16} color={theme.palette.error.main} />
            )}
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}