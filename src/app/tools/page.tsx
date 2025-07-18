'use client';

import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { BarChart, Calculate, TrendingUp, Analytics } from '@mui/icons-material';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { MainNavbar } from '@/components/landing/main-navbar';

const tools = [
  {
    icon: <BarChart sx={{ fontSize: 48 }} />,
    title: 'Stock Screener',
    description: 'Find trading opportunities with our advanced screening tools',
    href: '/tools/screener',
    available: false,
  },
  {
    icon: <Calculate sx={{ fontSize: 48 }} />,
    title: 'Position Calculator',
    description: 'Calculate risk and position sizing for your trades',
    href: '/tools/calculator',
    available: false,
  },
  {
    icon: <TrendingUp sx={{ fontSize: 48 }} />,
    title: 'Market Scanner',
    description: 'Real-time scanning for market movers and opportunities',
    href: '/academy/market',
    available: true,
  },
  {
    icon: <Analytics sx={{ fontSize: 48 }} />,
    title: 'Technical Analysis',
    description: 'Advanced charting and technical analysis tools',
    href: '/tools/analysis',
    available: false,
  },
];

export default function ToolsPage() {
  const { t } = useTranslation();

  return (
    <>
      <MainNavbar />
      <Box sx={{ pt: 18, pb: 10, minHeight: '100vh' }}>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ mb: 2 }}>
            Trading Tools
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" sx={{ mb: 6 }}>
            Professional tools to enhance your trading decisions
          </Typography>

          <Grid container spacing={4}>
            {tools.map((tool) => (
              <Grid item xs={12} sm={6} md={3} key={tool.title}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    position: 'relative',
                    opacity: tool.available ? 1 : 0.7,
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <Box sx={{ color: 'primary.main', mb: 2 }}>
                      {tool.icon}
                    </Box>
                    <Typography gutterBottom variant="h6" component="h2">
                      {tool.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      {tool.description}
                    </Typography>
                    {tool.available ? (
                      <Button
                        component={Link}
                        href={tool.href}
                        variant="contained"
                        fullWidth
                      >
                        Access Tool
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        fullWidth
                        disabled
                      >
                        Coming Soon
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
}