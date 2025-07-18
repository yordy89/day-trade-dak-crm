'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  useTheme as useMuiTheme,
} from '@mui/material';
import {
  BarChart,
  Calculate,
  Scanner,
  Notifications,
  Analytics,
  Speed,
  CheckCircle,
  ArrowForward,
  AutoGraph,
} from '@mui/icons-material';
import Link from 'next/link';
import { useTheme } from '@/components/theme/theme-provider';
import { useTranslation } from 'react-i18next';

interface Tool {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
  badge?: string;
  href: string;
  color: string;
  popular?: boolean;
}

const getTools = (t: any): Tool[] => [
  {
    id: '1',
    icon: BarChart,
    title: t('tools.items.charting.title'),
    description: t('tools.items.charting.description'),
    features: t('tools.items.charting.features', { returnObjects: true }),
    badge: t('tools.items.charting.badge'),
    href: '/tools/charts',
    color: '#16a34a',
    popular: true,
  },
  {
    id: '2',
    icon: Calculate,
    title: t('tools.items.calculator.title'),
    description: t('tools.items.calculator.description'),
    features: t('tools.items.calculator.features', { returnObjects: true }),
    badge: t('tools.items.calculator.badge'),
    href: '/tools/calculator',
    color: '#3b82f6',
  },
  {
    id: '3',
    icon: Scanner,
    title: t('tools.items.scanner.title'),
    description: t('tools.items.scanner.description'),
    features: t('tools.items.scanner.features', { returnObjects: true }),
    badge: t('tools.items.scanner.badge'),
    href: '/tools/scanner',
    color: '#8b5cf6',
  },
  {
    id: '4',
    icon: AutoGraph,
    title: t('tools.items.backtester.title'),
    description: t('tools.items.backtester.description'),
    features: t('tools.items.backtester.features', { returnObjects: true }),
    href: '/tools/backtester',
    color: '#f59e0b',
  },
  {
    id: '5',
    icon: Analytics,
    title: t('tools.items.analytics.title'),
    description: t('tools.items.analytics.description'),
    features: t('tools.items.analytics.features', { returnObjects: true }),
    href: '/tools/analytics',
    color: '#ef4444',
  },
  {
    id: '6',
    icon: Notifications,
    title: t('tools.items.alerts.title'),
    description: t('tools.items.alerts.description'),
    features: t('tools.items.alerts.features', { returnObjects: true }),
    badge: t('tools.items.alerts.badge'),
    href: '/tools/alerts',
    color: '#14b8a6',
  },
];

export function TradingTools() {
  const muiTheme = useMuiTheme();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation('landing');
  const tools = getTools(t);

  return (
    <Box
      sx={{
        py: 10,
        backgroundColor: muiTheme.palette.background.paper,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: isDarkMode ? 0.03 : 0.02,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2316a34a' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="overline"
            sx={{
              color: '#16a34a',
              fontWeight: 600,
              letterSpacing: 1.5,
              mb: 2,
              display: 'block',
            }}
          >
            {t('tools.label')}
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 3,
              color: muiTheme.palette.text.primary,
            }}
          >
            {t('tools.title')}{' '}
            <span style={{ 
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {t('tools.titleHighlight')}
            </span>
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: muiTheme.palette.text.secondary,
              maxWidth: 700,
              mx: 'auto',
              lineHeight: 1.8,
            }}
          >
            {t('tools.subtitle')}
          </Typography>
        </Box>

        {/* Tools Grid */}
        <Grid container spacing={4}>
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Grid item xs={12} md={6} lg={4} key={tool.id}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    backgroundColor: muiTheme.palette.background.paper,
                    border: '2px solid',
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      borderColor: tool.color,
                      boxShadow: isDarkMode
                        ? `0 20px 40px rgba(0, 0, 0, 0.5)`
                        : `0 20px 40px rgba(0, 0, 0, 0.1)`,
                      '& .tool-icon': {
                        transform: 'scale(1.1) rotate(5deg)',
                      },
                      '& .tool-arrow': {
                        transform: 'translateX(4px)',
                      },
                    },
                  }}
                >
                  {tool.popular && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        backgroundColor: '#ef4444',
                        color: 'white',
                        px: 3,
                        py: 0.5,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        borderBottomLeftRadius: 8,
                      }}
                    >
                      {t('common.mostPopular')}
                    </Box>
                  )}

                  <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                      <Box
                        className="tool-icon"
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: `${tool.color}20`,
                          transition: 'all 0.3s ease',
                          mr: 2,
                        }}
                      >
                        <Icon sx={{ fontSize: 28, color: tool.color }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="h5" fontWeight="700">
                            {tool.title}
                          </Typography>
                          {tool.badge && (
                            <Chip
                              label={tool.badge}
                              size="small"
                              sx={{
                                backgroundColor: tool.badge === t('common.free') ? '#16a34a' : tool.color,
                                color: 'white',
                                fontWeight: 600,
                                height: 20,
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    </Box>

                    {/* Description */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: muiTheme.palette.text.secondary,
                        mb: 3,
                        lineHeight: 1.8,
                      }}
                    >
                      {tool.description}
                    </Typography>

                    {/* Features */}
                    <List sx={{ py: 0, mb: 3, flex: 1 }}>
                      {tool.features.map((feature, index) => (
                        <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 28 }}>
                            <CheckCircle sx={{ fontSize: 16, color: '#16a34a' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={feature}
                            primaryTypographyProps={{
                              variant: 'body2',
                              color: muiTheme.palette.text.secondary,
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>

                    {/* CTA */}
                    <Button
                      component={Link}
                      href={tool.href}
                      fullWidth
                      variant="outlined"
                      endIcon={<ArrowForward className="tool-arrow" sx={{ transition: 'all 0.3s ease' }} />}
                      sx={{
                        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                        color: muiTheme.palette.text.primary,
                        textTransform: 'none',
                        fontWeight: 600,
                        py: 1.5,
                        '&:hover': {
                          borderColor: tool.color,
                          backgroundColor: `${tool.color}10`,
                          color: tool.color,
                        },
                      }}
                    >
                      {t('tools.cta.launchTool')}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Bottom CTA */}
        <Box
          sx={{
            mt: 8,
            p: 4,
            backgroundColor: isDarkMode ? 'rgba(22, 163, 74, 0.1)' : 'rgba(22, 163, 74, 0.05)',
            borderRadius: 3,
            border: '1px solid',
            borderColor: isDarkMode ? 'rgba(22, 163, 74, 0.3)' : 'rgba(22, 163, 74, 0.2)',
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" fontWeight="700" sx={{ mb: 2 }}>
            {t('tools.cta.premium.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {t('tools.cta.premium.description')}
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<Speed />}
            sx={{
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              color: 'white',
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)',
              },
            }}
          >
            {t('tools.cta.premium.button')}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}