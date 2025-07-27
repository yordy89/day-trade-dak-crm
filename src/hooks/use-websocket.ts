import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/hooks/use-auth';

interface UseWebSocketOptions {
  namespace?: string;
  autoConnect?: boolean;
  reconnection?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
}

interface UseWebSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  emit: (event: string, data?: any) => void;
  on: (event: string, callback: (data: any) => void) => void;
  off: (event: string, callback?: (data: any) => void) => void;
}

export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketReturn {
  const {
    namespace = '',
    autoConnect = true,
    reconnection = true,
    reconnectionAttempts = 5,
    reconnectionDelay = 1000,
  } = options;

  const { authToken } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const socketUrl = namespace ? `${apiUrl}/${namespace}` : apiUrl;

    socketRef.current = io(socketUrl, {
      auth: authToken ? { token: authToken } : undefined,
      reconnection,
      reconnectionAttempts,
      reconnectionDelay,
      transports: ['websocket', 'polling'],
    });

    socketRef.current.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setIsConnected(false);
    });
  }, [authToken, namespace, reconnection, reconnectionAttempts, reconnectionDelay]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const emit = useCallback((event: string, data?: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn('Socket not connected. Cannot emit event:', event);
    }
  }, []);

  const on = useCallback((event: string, callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  }, []);

  const off = useCallback((event: string, callback?: (data: any) => void) => {
    if (socketRef.current) {
      if (callback) {
        socketRef.current.off(event, callback);
      } else {
        socketRef.current.off(event);
      }
    }
  }, []);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  // Reconnect when token changes (user logs in/out)
  useEffect(() => {
    if (socketRef.current && autoConnect) {
      disconnect();
      connect();
    }
  }, [authToken, autoConnect, connect, disconnect]);

  return {
    socket: socketRef.current,
    isConnected,
    connect,
    disconnect,
    emit,
    on,
    off,
  };
}

// Typed event emitters for meetings
export interface MeetingEvents {
  'live-meeting-update': (data: {
    meetingId: string;
    zoomMeetingId: string;
    status: string;
    startedAt: Date;
    title: string;
    host: any;
  }) => void;
  'meeting-status-update': (data: {
    meetingId: string;
    status: string;
    timestamp: Date;
  }) => void;
  'meeting-ended': (data: {
    meetingId: string;
    timestamp: Date;
  }) => void;
  'meeting-started': (data: {
    meetingId: string;
    zoomMeetingId: string;
    status: string;
    startedAt: Date;
    title: string;
    host: any;
  }) => void;
}

// Typed WebSocket hook for meetings
export function useMeetingWebSocket() {
  const ws = useWebSocket({ namespace: 'meetings' });

  const onMeetingUpdate = useCallback(
    (event: keyof MeetingEvents, callback: MeetingEvents[typeof event]) => {
      ws.on(event, callback as any);
    },
    [ws]
  );

  const offMeetingUpdate = useCallback(
    (event: keyof MeetingEvents, callback?: MeetingEvents[typeof event]) => {
      ws.off(event, callback as any);
    },
    [ws]
  );

  return {
    ...ws,
    onMeetingUpdate,
    offMeetingUpdate,
  };
}