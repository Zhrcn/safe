"use client";
import { useEffect, useState } from 'react';
import { getSocket, isSocketConnected } from '@/utils/socket';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';

export default function SocketStatusIndicator() {
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [lastMessage, setLastMessage] = useState('');

  useEffect(() => {
    const socket = getSocket();
    if (!socket) {
      setConnectionStatus('disconnected');
      return;
    }

    const updateStatus = () => {
      if (socket.connected) {
        setConnectionStatus('connected');
        setLastMessage('Socket connected');
      } else {
        setConnectionStatus('disconnected');
        setLastMessage('Socket disconnected');
      }
    };

    const handleConnect = () => {
      setConnectionStatus('connected');
      setLastMessage('Socket connected successfully');
    };

    const handleDisconnect = (reason) => {
      setConnectionStatus('disconnected');
      setLastMessage(`Socket disconnected: ${reason}`);
    };

    const handleConnectError = (error) => {
      setConnectionStatus('error');
      setLastMessage(`Connection error: ${error.message}`);
    };

    const handleReconnect = (attemptNumber) => {
      setConnectionStatus('connected');
      setLastMessage(`Reconnected after ${attemptNumber} attempts`);
    };

    const handleReconnectError = (error) => {
      setConnectionStatus('error');
      setLastMessage(`Reconnection error: ${error.message}`);
    };

    // Set initial status
    updateStatus();

    // Listen for connection events
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('reconnect', handleReconnect);
    socket.on('reconnect_error', handleReconnectError);

    // Update status periodically
    const interval = setInterval(updateStatus, 5000);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('reconnect', handleReconnect);
      socket.off('reconnect_error', handleReconnectError);
      clearInterval(interval);
    };
  }, []);

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="w-4 h-4 text-green-500" />;
      case 'disconnected':
        return <WifiOff className="w-4 h-4 text-red-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'connecting':
        return <Wifi className="w-4 h-4 text-yellow-500 animate-pulse" />;
      default:
        return <Wifi className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'disconnected':
        return 'Disconnected';
      case 'error':
        return 'Error';
      case 'connecting':
        return 'Connecting...';
      default:
        return 'Unknown';
    }
  };

  // Only show in development or when there are connection issues
  if (process.env.NODE_ENV === 'production' && connectionStatus === 'connected') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {getStatusText()}
          </span>
        </div>
        {lastMessage && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs truncate">
            {lastMessage}
          </div>
        )}
      </div>
    </div>
  );
} 