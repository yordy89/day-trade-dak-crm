'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Rating,
  useTheme as useMuiTheme,
} from '@mui/material';
import {
  TrendingUp,
  Verified,
  DateRange,
  ShowChart,
  AccountBalance,
  EmojiEvents,
} from '@mui/icons-material';
import { useTheme } from '@/components/theme/theme-provider';
import CountUp from 'react-countup';
import { useTranslation } from 'react-i18next';

interface SuccessStory {
  id: string;
  name: string;
  avatar: string;
  role: string;
  verified: boolean;
  rating: number;
  testimonial: string;
  achievement: string;
  profit: number;
  tradingPeriod: string;
  country: string;
  featured?: boolean;
}

const getSuccessStories = (t: any): SuccessStory[] => [
  {
    id: '1',
    name: 'Carlos Martinez',
    avatar: '/assets/avatar-4.png',
    role: t('landing:success.stories.dayTrader.role'),
    verified: true,
    rating: 5,
    testimonial: t('landing:success.stories.dayTrader.quote'),
    achievement: t('landing:success.stories.dayTrader.achievement'),
    profit: 285000,
    tradingPeriod: t('common:years', { count: 2 }),
    country: 'Spain',
    featured: true,
  },
  {
    id: '2',
    name: 'Jennifer Chen',
    avatar: '/assets/avatar-5.png',
    role: t('landing:success.stories.optionsTrader.role'),
    verified: true,
    rating: 5,
    testimonial: t('landing:success.stories.optionsTrader.quote'),
    achievement: t('landing:success.stories.optionsTrader.achievement'),
    profit: 145000,
    tradingPeriod: t('common:months', { count: 18 }),
    country: 'USA',
  },
  {
    id: '3',
    name: 'Ahmed Hassan',
    avatar: '/assets/avatar-6.png',
    role: t('landing:success.stories.swingTrader.role'),
    verified: true,
    rating: 4.5,
    testimonial: t('landing:success.stories.swingTrader.quote'),
    achievement: t('landing:success.stories.swingTrader.achievement'),
    profit: 67000,
    tradingPeriod: t('common:years', { count: 1 }),
    country: 'UAE',
  },
  {
    id: '4',
    name: 'Maria Rodriguez',
    avatar: '/assets/avatar-7.png',
    role: t('landing:success.stories.cryptoTrader.role'),
    verified: true,
    rating: 5,
    testimonial: t('landing:success.stories.cryptoTrader.quote'),
    achievement: t('landing:success.stories.cryptoTrader.achievement'),
    profit: 89000,
    tradingPeriod: t('common:months', { count: 6 }),
    country: 'Mexico',
  },
];

const getStats = (t: any) => [
  { label: t('landing:success.stats.successRate'), value: 92, suffix: '%', icon: TrendingUp },
  { label: t('landing:success.stats.totalStudents'), value: 50000, suffix: '+', icon: EmojiEvents },
  { label: t('landing:success.stats.avgReturn'), value: 18, suffix: '%', icon: ShowChart },
  { label: t('landing:success.stats.totalProfits'), value: 450, suffix: 'M+', prefix: '$', icon: AccountBalance },
];

export function SuccessStories() {
  const muiTheme = useMuiTheme();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation(['landing', 'common']);

  const successStories = getSuccessStories(t);
  const stats = getStats(t);
  
  const featuredStory = successStories.find(story => story.featured);
  const regularStories = successStories.filter(story => !story.featured);

  return (
    <Box
      sx={{
        py: 10,
        backgroundColor: muiTheme.palette.background.default,
        position: 'relative',
      }}
    >
      <Container maxWidth="lg">
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
            {t('landing:success.label')}
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 3,
              color: muiTheme.palette.text.primary,
            }}
          >
            {t('landing:success.title')}{' '}
            <span style={{ 
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {t('landing:success.titleHighlight')}
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
            {t('landing:success.subtitle')}
          </Typography>
        </Box>

        {/* Stats */}
        <Grid container spacing={3} sx={{ mb: 8 }}>
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Grid item xs={6} md={3} key={stat.label}>
                <Card
                  elevation={0}
                  sx={{
                    backgroundColor: muiTheme.palette.background.paper,
                    border: '1px solid',
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                    borderRadius: 2,
                    textAlign: 'center',
                    p: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#16a34a',
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <Icon sx={{ fontSize: 40, color: '#16a34a', mb: 2 }} />
                  <Typography
                    variant="h4"
                    fontWeight="800"
                    sx={{ color: muiTheme.palette.text.primary, mb: 1 }}
                  >
                    {stat.prefix}
                    <CountUp end={stat.value} duration={2} />
                    {stat.suffix}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Featured Story */}
        {featuredStory ? <Card
            elevation={0}
            sx={{
              mb: 6,
              backgroundColor: muiTheme.palette.background.paper,
              border: '2px solid',
              borderColor: '#16a34a',
              borderRadius: 3,
              p: 4,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Chip
              label={t('landing:success.badge')}
              sx={{
                position: 'absolute',
                top: 20,
                right: 20,
                backgroundColor: '#16a34a',
                color: 'white',
                fontWeight: 600,
              }}
            />
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar
                    src={featuredStory.avatar}
                    sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                  />
                  <Typography variant="h5" fontWeight="700" sx={{ mb: 1 }}>
                    {featuredStory.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {featuredStory.role}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <Rating value={featuredStory.rating} readOnly size="small" />
                    {featuredStory.verified ? <Verified sx={{ fontSize: 18, color: '#16a34a' }} /> : null}
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 3,
                    fontStyle: 'italic',
                    lineHeight: 1.8,
                    color: muiTheme.palette.text.primary,
                  }}
                >
                  &quot;{featuredStory.testimonial}&quot;
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={6} sm={3}>
                    <Box>
                      <TrendingUp sx={{ color: '#16a34a', mb: 1 }} />
                      <Typography variant="h6" fontWeight="700">
                        ${featuredStory.profit.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t('landing:success.details.profit')}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box>
                      <DateRange sx={{ color: '#16a34a', mb: 1 }} />
                      <Typography variant="h6" fontWeight="700">
                        {featuredStory.tradingPeriod}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t('landing:success.details.period')}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box>
                      <EmojiEvents sx={{ color: '#16a34a', mb: 1 }} />
                      <Typography variant="h6" fontWeight="700">
                        {featuredStory.achievement}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t('landing:success.details.achievement')}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box>
                      <Typography variant="h6" fontWeight="700">
                        {featuredStory.country}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t('landing:success.details.location')}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Card> : null}

        {/* Regular Stories */}
        <Grid container spacing={3}>
          {regularStories.map((story) => (
            <Grid item xs={12} md={4} key={story.id}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  backgroundColor: muiTheme.palette.background.paper,
                  border: '1px solid',
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#16a34a',
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Avatar src={story.avatar} sx={{ width: 56, height: 56 }} />
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" fontWeight="600">
                          {story.name}
                        </Typography>
                        {story.verified ? <Verified sx={{ fontSize: 16, color: '#16a34a' }} /> : null}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {story.role}
                      </Typography>
                      <Rating value={story.rating} readOnly size="small" />
                    </Box>
                  </Box>

                  {/* Testimonial */}
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 3,
                      fontStyle: 'italic',
                      lineHeight: 1.8,
                      color: muiTheme.palette.text.secondary,
                    }}
                  >
                    &quot;{story.testimonial}&quot;
                  </Typography>

                  {/* Stats */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      p: 2,
                      backgroundColor: isDarkMode ? 'rgba(22, 163, 74, 0.1)' : 'rgba(22, 163, 74, 0.05)',
                      borderRadius: 1,
                    }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" fontWeight="700" sx={{ color: '#16a34a' }}>
                        ${(story.profit / 1000).toFixed(0)}k
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t('common:profit')}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" fontWeight="700">
                        {story.tradingPeriod}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t('common:period')}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" fontWeight="700">
                        {story.country}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t('common:location')}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}