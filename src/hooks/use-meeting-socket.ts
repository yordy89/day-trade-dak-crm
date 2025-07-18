import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { useClientAuth } from './use-client-auth';

interface MeetingSocketOptions {
  meetingId: string;
  onMeetingEnded?: () => void;
  onMeetingStatusUpdate?: (status: string) => void;
  onUserJoined?: (userId: string) => void;
  onUserLeft?: (userId: string) => void;
}

export function useMeetingSocket({
  meetingId,
  onMeetingEnded,
  onMeetingStatusUpdate,
  onUserJoined,
  onUserLeft,
}: MeetingSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const { user } = useClientAuth();

  const connect = useCallback(() => {
    if (!user || !meetingId) return;

    // Connect to the meetings namespace
    const socket = io(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/meetings`, {
      transports: ['websocket'],
      auth: {
        userId: user._id,
      },
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to meeting socket');
      // Join the meeting room
      socket.emit('join-meeting', { meetingId, userId: user._id });
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from meeting socket');
    });

    socket.on('meeting-ended', (data: { meetingId: string }) => {
      console.log('Meeting ended event received:', data);
      if (data.meetingId === meetingId && onMeetingEnded) {
        onMeetingEnded();
      }
    });

    socket.on('meeting-status-updated', (data: { meetingId: string; status: string }) => {
      console.log('Meeting status updated:', data);
      if (data.meetingId === meetingId && onMeetingStatusUpdate) {
        onMeetingStatusUpdate(data.status);
      }
    });

    socket.on('user-joined', (data: { userId: string }) => {
      if (onUserJoined) {
        onUserJoined(data.userId);
      }
    });

    socket.on('user-left', (data: { userId: string }) => {
      if (onUserLeft) {
        onUserLeft(data.userId);
      }
    });

    return socket;
  }, [meetingId, user, onMeetingEnded, onMeetingStatusUpdate, onUserJoined, onUserLeft]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      // Leave the meeting room
      if (user && meetingId) {
        socketRef.current.emit('leave-meeting', { meetingId, userId: user._id });
      }
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, [meetingId, user]);

  useEffect(() => {
    void connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    socket: socketRef.current,
    disconnect,
  };
}