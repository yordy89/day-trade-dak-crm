import React from 'react';
import { WifiHigh, WifiSlash } from '@phosphor-icons/react';
import { Box, Typography } from '@mui/material';

interface ConnectionStatusProps {
  isConnected: boolean;
  className?: string;
}

export function ConnectionStatus({ isConnected, className }: ConnectionStatusProps) {
  return (
    <Box
      className={className}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        px: 1.5,
        py: 0.75,
        borderRadius: 999,
        fontSize: '0.75rem',
        fontWeight: 500,
        transition: 'colors 0.2s',
        backgroundColor: isConnected ? 'success.light' : 'grey.100',
        color: isConnected ? 'success.dark' : 'grey.600',
      }}
    >
      {isConnected ? (
        <>
          <WifiHigh size={12} />
          <Typography variant="caption" component="span">
            Real-time Updates
          </Typography>
        </>
      ) : (
        <>
          <WifiSlash size={12} />
          <Typography variant="caption" component="span">
            Connecting...
          </Typography>
        </>
      )}
    </Box>
  );
}