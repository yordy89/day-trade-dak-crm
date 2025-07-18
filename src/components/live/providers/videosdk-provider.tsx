'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { MeetingProvider } from '@videosdk.live/react-sdk';

interface VideoSDKContextValue {
  meetingId: string | null;
  participantId: string | null;
  isHost: boolean;
  userName: string;
  token: string;
}

const VideoSDKContext = createContext<VideoSDKContextValue | null>(null);

export const useVideoSDK = () => {
  const context = useContext(VideoSDKContext);
  if (!context) {
    throw new Error('useVideoSDK must be used within VideoSDKProvider');
  }
  return context;
};

interface VideoSDKProviderProps {
  children: ReactNode;
  meetingId: string;
  authToken: string;
  participantId: string;
  participantName: string;
  micEnabled?: boolean;
  webcamEnabled?: boolean;
  isHost?: boolean;
}

export function VideoSDKProvider({
  children,
  meetingId,
  authToken,
  participantId,
  participantName,
  micEnabled = false,
  webcamEnabled = false,
  isHost = false,
}: VideoSDKProviderProps) {
  const contextValue: VideoSDKContextValue = {
    meetingId,
    participantId,
    isHost,
    userName: participantName,
    token: authToken,
  };

  return (
    <VideoSDKContext.Provider value={contextValue}>
      <MeetingProvider
        config={{
          meetingId,
          micEnabled,
          webcamEnabled,
          name: participantName,
          debugMode: false,
          participantId,
          mode: 'CONFERENCE',
          multiStream: true,
        }}
        token={authToken}
        joinWithoutUserInteraction={false}
      >
        {children}
      </MeetingProvider>
    </VideoSDKContext.Provider>
  );
}