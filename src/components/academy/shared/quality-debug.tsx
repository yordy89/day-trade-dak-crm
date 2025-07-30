import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import type Player from 'video.js/dist/types/player';

interface QualityDebugProps {
  player: Player | null;
}

export function QualityDebug({ player }: QualityDebugProps) {
  const [qualityInfo, setQualityInfo] = useState<any[]>([]);
  const [currentQuality, setCurrentQuality] = useState<string>('');

  const refreshQualityInfo = () => {
    if (!player) return;
    
    const qualityLevels = (player as any).qualityLevels();
    const tech = player.tech(true) as any;
    const levels: any[] = [];
    
    for (let i = 0; i < qualityLevels.length; i++) {
      const level = qualityLevels[i];
      levels.push({
        index: i,
        height: level.height,
        width: level.width,
        bitrate: level.bitrate,
        bandwidth: level.bandwidth,
        enabled: level.enabled,
        id: level.id
      });
    }
    
    setQualityInfo(levels);
    
    // Get current quality
    const selectedLevel = qualityLevels[qualityLevels.selectedIndex];
    if (selectedLevel) {
      setCurrentQuality(`${selectedLevel.height}p (index: ${qualityLevels.selectedIndex})`);
    }
    
    // Also log master playlist info
    if (tech?.vhs?.playlists) {
      const master = tech.vhs.playlists.master;
      if (master?.playlists) {
        console.log('Master playlist info:', master.playlists.map((p: any) => ({
          uri: p.uri,
          bandwidth: p.attributes.BANDWIDTH,
          resolution: p.attributes.RESOLUTION,
          codecs: p.attributes.CODECS
        })));
      }
    }
  };

  const forceQuality = (index: number) => {
    if (!player) return;
    
    const qualityLevels = (player as any).qualityLevels();
    
    // Disable all qualities
    for (const level of qualityLevels) {
      level.enabled = false;
    }
    
    // Enable only selected quality
    if (qualityLevels[index]) {
      qualityLevels[index].enabled = true;
      console.log(`Forced quality to index ${index}: ${qualityLevels[index].height}p`);
    }
    
    refreshQualityInfo();
  };

  const enableAllQualities = () => {
    if (!player) return;
    
    const qualityLevels = (player as any).qualityLevels();
    
    for (const level of qualityLevels) {
      level.enabled = true;
    }
    
    console.log('Enabled all qualities for auto-switching');
    refreshQualityInfo();
  };

  useEffect(() => {
    if (player) {
      refreshQualityInfo();
      
      // Listen for quality changes
      const qualityLevels = (player as any).qualityLevels();
      qualityLevels.on('change', refreshQualityInfo);
      
      return () => {
        qualityLevels.off('change', refreshQualityInfo);
      };
    }
  }, [player]);

  if (!player) {
    return null;
  }

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Quality Debug Panel
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Current Quality: <strong>{currentQuality || 'None'}</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total Levels: <strong>{qualityInfo.length}</strong>
        </Typography>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Button onClick={refreshQualityInfo} variant="outlined" size="small" sx={{ mr: 1 }}>
          Refresh Info
        </Button>
        <Button onClick={enableAllQualities} variant="outlined" size="small">
          Enable All (Auto)
        </Button>
      </Box>
      
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Available Qualities:
        </Typography>
        {qualityInfo.map((level, idx) => (
          <Box key={idx} sx={{ mb: 1, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="body2">
              {level.height}p ({level.width}x{level.height}) - {(level.bitrate / 1000).toFixed(0)} kbps
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Enabled: {level.enabled ? 'Yes' : 'No'} | ID: {level.id}
            </Typography>
            <Button 
              onClick={() => forceQuality(idx)} 
              size="small" 
              variant="contained"
              sx={{ mt: 0.5 }}
            >
              Force This Quality
            </Button>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}