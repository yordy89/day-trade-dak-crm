import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';

interface StableWebSocketOptions {
  namespace?: string;
  reconnection?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
}

export function useStableWebSocket(options: StableWebSocketOptions = {}) {
  const socketRef = useRef<Socket | null>(null);
  const isConnecting = useRef(false);

  const connect = useCallback(() => {
    // Temporarily disabled to debug LiveKit connection
    console.log('WebSocket temporarily disabled for debugging');
    return null;
    
    if (socketRef.current?.connected || isConnecting.current) {
      return socketRef.current;
    }

    isConnecting.current = true;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    // Socket.io namespaces should be part of the path, not a separate URL
    // If namespace is provided, it should be like '/meetings' or '/chat'
    const socketPath = options.namespace || '/';
    const url = apiUrl; // Base URL remains the same

    const socket = io(url, {
      path: '/socket.io/', // Default socket.io path
      transports: ['websocket', 'polling'],
      reconnection: options.reconnection ?? true,
      reconnectionAttempts: options.reconnectionAttempts ?? 5,
      reconnectionDelay: options.reconnectionDelay ?? 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
    });

    socket.on('connect', () => {
      console.log(`Connected to WebSocket: ${url}`);
      isConnecting.current = false;
      options.onConnect?.();
    });

    socket.on('disconnect', (reason) => {
      console.log(`Disconnected from WebSocket: ${reason}`);
      isConnecting.current = false;
      options.onDisconnect?.();
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      isConnecting.current = false;
      options.onError?.(error);
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log(`Reconnected to WebSocket after ${attemptNumber} attempts`);
    });

    socket.on('reconnect_error', (error) => {
      console.error('WebSocket reconnection error:', error);
    });

    socket.on('reconnect_failed', () => {
      console.error('WebSocket reconnection failed');
      isConnecting.current = false;
    });

    socketRef.current = socket;
    return socket;
  }, [options]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      isConnecting.current = false;
    }
  }, []);

  const emit = useCallback((event: string, data?: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn(`Cannot emit ${event}: WebSocket not connected`);
    }
  }, []);

  const on = useCallback((event: string, handler: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, handler);
    }
  }, []);

  const off = useCallback((event: string, handler?: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.off(event, handler);
    }
  }, []);

  // Initialize connection on mount
  useEffect(() => {
    connect();
    
    return () => {
      // Only disconnect on unmount, not on re-renders
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    socket: socketRef.current,
    connected: socketRef.current?.connected ?? false,
    connect,
    disconnect,
    emit,
    on,
    off,
  };
}