'use client';

import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import {
  Speed,
  Security,
  Notifications,
  CloudDone,
  Timeline,
  Groups,
  CandlestickChart,
  AccountBalance,
  TrendingUp,
  Psychology,
} from '@mui/icons-material';

const features = [
  {
    icon: Speed,
    title: '0.01s Execution',
    description: 'Lightning-fast order execution with minimal slippage',
    stat: '99.9%',
    statLabel: 'Uptime',
  },
  {
    icon: CandlestickChart,
    title: 'Advanced Charts',
    description: '100+ technical indicators and professional tools',
    stat: '50+',
    statLabel: 'Chart Types',
  },
  {
    icon: Security,
    title: 'Bank-Level Security',
    description: '256-bit encryption and cold storage for assets',
    stat: '$2B+',
    statLabel: 'Secured',
  },
  {
    icon: Notifications,
    title: 'Smart Alerts',
    description: 'AI-powered notifications for market opportunities',
    stat: '24/7',
    statLabel: 'Monitoring',
  },
];

const additionalFeatures = [
  { icon: AccountBalance, label: 'Direct Market Access' },
  { icon: TrendingUp, label: 'Algorithmic Trading' },
  { icon: Psychology, label: 'Sentiment Analysis' },
  { icon: Timeline, label: 'Historical Data' },
  { icon: CloudDone, label: 'Cloud Sync' },
  { icon: Groups, label: 'Social Trading' },
];

export function PlatformFeatures() {
  return (
    <Box className="bg-[#0a0e17] py-20">
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          {/* Left side - Content */}
          <Grid item xs={12} md={6}>
            <Typography 
              variant="overline" 
              className="text-green-400 font-semibold tracking-wider"
            >
              PLATFORM FEATURES
            </Typography>
            <Typography variant="h3" className="text-white font-bold mb-4">
              Professional Trading
              <br />
              Infrastructure
            </Typography>
            <Typography variant="body1" className="text-gray-400 mb-6">
              Built by traders, for traders. Our platform combines institutional-grade 
              technology with an intuitive interface, giving you the edge in today&apos;s markets.
            </Typography>

            {/* Feature grid */}
            <Grid container spacing={3}>
              {features.map((feature, _index) => {
                const Icon = feature.icon;
                return (
                  <Grid item xs={12} sm={6} key={_index}>
                    <Box className="flex gap-3">
                      <Box 
                        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                        sx={{ backgroundColor: '#10b98120' }}
                      >
                        <Icon className="text-green-400" />
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" className="text-white font-semibold">
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" className="text-gray-400 mb-2">
                          {feature.description}
                        </Typography>
                        <Box className="flex items-baseline gap-1">
                          <Typography variant="h6" className="text-green-400 font-bold">
                            {feature.stat}
                          </Typography>
                          <Typography variant="caption" className="text-gray-500">
                            {feature.statLabel}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>

            {/* Additional features */}
            <Box className="mt-8 pt-8 border-t border-gray-800">
              <Typography variant="subtitle2" className="text-gray-400 mb-4">
                ALSO INCLUDES:
              </Typography>
              <Box className="grid grid-cols-2 gap-3">
                {additionalFeatures.map((feature, _index) => {
                  const Icon = feature.icon;
                  return (
                    <Box key={_index} className="flex items-center gap-2">
                      <Icon className="text-gray-500 text-sm" />
                      <Typography variant="body2" className="text-gray-300">
                        {feature.label}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Grid>

          {/* Right side - Visual */}
          <Grid item xs={12} md={6}>
            <Box className="relative">
              {/* Main trading interface mockup */}
              <Card className="bg-[#1a1f2e] border border-gray-800 overflow-hidden">
                <Box className="bg-[#0d1117] p-3 border-b border-gray-800">
                  <Box className="flex items-center gap-2">
                    <Box className="w-3 h-3 rounded-full bg-red-500" />
                    <Box className="w-3 h-3 rounded-full bg-yellow-500" />
                    <Box className="w-3 h-3 rounded-full bg-green-500" />
                    <Typography variant="caption" className="text-gray-500 ml-3">
                      DayTradeDak Pro v4.2.1
                    </Typography>
                  </Box>
                </Box>
                <CardContent className="p-0">
                  <img 
                    src="/trading-platform-mockup.png" 
                    alt="Trading Platform"
                    className="w-full"
                    onError={(e) => {
                      // Fallback to placeholder
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzBkMTExNyIvPgogIDxwYXRoIGQ9Ik0wIDIwMCBRIDE1MCAxNTAgMzAwIDIwMCBUIDYwMCAyMDAiIHN0cm9rZT0iIzEwYjk4MSIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+CiAgPHRleHQgeD0iMzAwIiB5PSIyMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM0YjVhNmMiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiI+VHJhZGluZyBQbGF0Zm9ybSBJbnRlcmZhY2U8L3RleHQ+Cjwvc3ZnPg==';
                    }}
                  />
                </CardContent>
              </Card>

              {/* Floating cards */}
              <Card className="absolute -top-4 -right-4 bg-[#1a1f2e] border border-gray-800 p-3 shadow-xl">
                <Box className="flex items-center gap-2 mb-2">
                  <Speed className="text-green-400 text-sm" />
                  <Typography variant="caption" className="text-gray-400">
                    Execution Speed
                  </Typography>
                </Box>
                <Typography variant="h6" className="text-white font-mono">
                  12.3ms
                </Typography>
              </Card>

              <Card className="absolute -bottom-4 -left-4 bg-[#1a1f2e] border border-gray-800 p-3 shadow-xl">
                <Box className="flex items-center gap-2 mb-2">
                  <TrendingUp className="text-green-400 text-sm" />
                  <Typography variant="caption" className="text-gray-400">
                    Win Rate
                  </Typography>
                </Box>
                <Typography variant="h6" className="text-white font-mono">
                  87.4%
                </Typography>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}