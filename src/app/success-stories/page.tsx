'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  School,
  Timer,
  EmojiEvents,
  Psychology,
  ArrowForward,
  CalendarToday,
  AttachMoney,
  ShowChart,
  AccountBalance,
  Star,
  FormatQuote,
  PlayCircleOutline,
} from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';
import { MainNavbar } from '@/components/landing/main-navbar';
import { ProfessionalFooter } from '@/components/landing/professional-footer';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/components/theme/theme-provider';

interface SuccessStory {
  id: string;
  name: string;
  title: string;
  image: string;
  category: 'founder' | 'student' | 'professional';
  yearStarted: number;
  timeToProfit: string;
  beforeTrading: string;
  currentStatus: string;
  keyMetrics: {
    label: string;
    value: string;
    icon: React.ReactNode;
  }[];
  quote: string;
  fullStory: {
    challenge: string;
    journey: string;
    breakthrough: string;
    results: string;
    advice: string;
  };
  tags: string[];
  featured: boolean;
  videoTestimonial?: string;
}

const getSuccessStories = (t: any): SuccessStory[] => [
  {
    id: 'mijail-medina',
    name: t('stories.mijail.name'),
    title: t('stories.mijail.title'),
    image: '/assets/images/mijail-profile.jpg',
    category: 'founder',
    yearStarted: 2018,
    timeToProfit: `4 ${t('values.years')}`,
    beforeTrading: t('stories.mijail.beforeTrading'),
    currentStatus: t('stories.mijail.currentStatus'),
    keyMetrics: [
      {
        label: t('metrics.timeToProfitability'),
        value: `4 ${t('values.years')}`,
        icon: <Timer sx={{ color: '#16a34a' }} />,
      },
      {
        label: t('metrics.firstMillion'),
        value: '2022',
        icon: <AttachMoney sx={{ color: '#16a34a' }} />,
      },
      {
        label: t('metrics.yearsTeaching'),
        value: '3+',
        icon: <School sx={{ color: '#16a34a' }} />,
      },
      {
        label: t('metrics.tradingStyle'),
        value: t('values.dayTrading'),
        icon: <ShowChart sx={{ color: '#16a34a' }} />,
      },
    ],
    quote: t('stories.mijail.quote'),
    fullStory: {
      challenge: t('stories.mijail.challenge'),
      journey: t('stories.mijail.journey'),
      breakthrough: t('stories.mijail.breakthrough'),
      results: t('stories.mijail.results'),
      advice: t('stories.mijail.advice'),
    },
    tags: t('stories.mijail.tags', { returnObjects: true }),
    featured: true,
  },
  {
    id: 'carlos-rodriguez',
    name: t('stories.carlos.name'),
    title: t('stories.carlos.title'),
    image: '/assets/images/testimonials/carlos.jpg',
    category: 'student',
    yearStarted: 2021,
    timeToProfit: t('values.months'),
    beforeTrading: t('stories.carlos.beforeTrading'),
    currentStatus: t('stories.carlos.currentStatus'),
    keyMetrics: [
      {
        label: t('metrics.startingCapital'),
        value: '$2,000',
        icon: <AccountBalance sx={{ color: '#16a34a' }} />,
      },
      {
        label: t('metrics.currentAccount'),
        value: '$45,000',
        icon: <TrendingUp sx={{ color: '#16a34a' }} />,
      },
      {
        label: t('metrics.monthlyAverage'),
        value: '$8,000',
        icon: <AttachMoney sx={{ color: '#16a34a' }} />,
      },
      {
        label: t('metrics.winRate'),
        value: '68%',
        icon: <EmojiEvents sx={{ color: '#16a34a' }} />,
      },
    ],
    quote: t('stories.carlos.quote'),
    fullStory: {
      challenge: t('stories.carlos.challenge'),
      journey: t('stories.carlos.journey'),
      breakthrough: t('stories.carlos.breakthrough'),
      results: t('stories.carlos.results'),
      advice: t('stories.carlos.advice'),
    },
    tags: t('stories.carlos.tags', { returnObjects: true }),
    featured: false,
  },
  {
    id: 'maria-santos',
    name: t('stories.maria.name'),
    title: t('stories.maria.title'),
    image: '/assets/images/testimonials/maria.jpg',
    category: 'student',
    yearStarted: 2020,
    timeToProfit: t('values.twoYears'),
    beforeTrading: t('stories.maria.beforeTrading'),
    currentStatus: t('stories.maria.currentStatus'),
    keyMetrics: [
      {
        label: t('metrics.startingCapital'),
        value: '$500',
        icon: <AccountBalance sx={{ color: '#16a34a' }} />,
      },
      {
        label: t('metrics.currentAccount'),
        value: '$15,000',
        icon: <TrendingUp sx={{ color: '#16a34a' }} />,
      },
      {
        label: t('metrics.weeklyProfit'),
        value: '$1,500',
        icon: <AttachMoney sx={{ color: '#16a34a' }} />,
      },
      {
        label: t('metrics.tradingHours'),
        value: `2-3 hrs${t('values.perDay')}`,
        icon: <Timer sx={{ color: '#16a34a' }} />,
      },
    ],
    quote: t('stories.maria.quote'),
    fullStory: {
      challenge: t('stories.maria.challenge'),
      journey: t('stories.maria.journey'),
      breakthrough: t('stories.maria.breakthrough'),
      results: t('stories.maria.results'),
      advice: t('stories.maria.advice'),
    },
    tags: t('stories.maria.tags', { returnObjects: true }),
    featured: false,
  },
];

const getCategories = (t: any) => [
  { id: 'all', label: t('categories.all') },
  { id: 'founder', label: t('categories.founder') },
  { id: 'student', label: t('categories.student') },
  { id: 'professional', label: t('categories.professional') },
];

export default function SuccessStoriesPage() {
  const { t } = useTranslation('success-stories');
  const { isDarkMode } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedStory, setExpandedStory] = useState<string | null>(null);

  const successStories = getSuccessStories(t);
  const categories = getCategories(t);

  const filteredStories = successStories.filter(
    story => selectedCategory === 'all' || story.category === selectedCategory
  );

  const featuredStory = successStories.find(story => story.featured);

  return (
    <>
      <MainNavbar />
      <Box sx={{ pt: { xs: 10, md: 12 }, pb: 10, minHeight: '100vh' }}>
        {/* Hero Section */}
        <Box
          sx={{
            background: isDarkMode
              ? 'linear-gradient(180deg, rgba(16,163,74,0.1) 0%, rgba(0,0,0,0) 100%)'
              : 'linear-gradient(180deg, rgba(16,163,74,0.05) 0%, rgba(255,255,255,0) 100%)',
            py: 8,
            mb: 6,
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h2"
              component="h1"
              align="center"
              gutterBottom
              sx={{ fontWeight: 700 }}
            >
              {t('hero.title')}
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="text.secondary"
              sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}
            >
              {t('hero.subtitle')}
            </Typography>
            
            {/* Stats Section */}
            <Grid container spacing={3} sx={{ mt: 4 }}>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    24/7
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {t('stats.liveSupport')}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    5
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {t('stats.dailyLiveSessions')}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    15+
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {t('stats.countries')}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    4.9★
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {t('stats.rating')}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Featured Story - Mijail's Journey */}
        {featuredStory && (
          <Container maxWidth="lg" sx={{ mb: 8 }}>
            <Box sx={{ mb: 4 }}>
              <Chip
                label={t('featured.label')}
                color="primary"
                sx={{ mb: 2 }}
              />
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
                {t('featured.title')}
              </Typography>
            </Box>
            
            <Card
              sx={{
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'background.paper',
                backdropFilter: 'blur(10px)',
                overflow: 'hidden',
              }}
            >
              <Grid container>
                <Grid item xs={12} md={5}>
                  <Box
                    sx={{
                      height: '100%',
                      minHeight: 500,
                      position: 'relative',
                      background: `url(${featuredStory.image}) center/cover`,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={7}>
                  <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                      {featuredStory.name}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      {featuredStory.title}
                    </Typography>
                    
                    {/* Key Metrics */}
                    <Grid container spacing={2} sx={{ my: 3 }}>
                      {featuredStory.keyMetrics.map((metric) => (
                        <Grid item xs={6} md={3} key={metric.label}>
                          <Box sx={{ textAlign: 'center' }}>
                            {metric.icon}
                            <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
                              {metric.value}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {metric.label}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>

                    {/* Quote */}
                    <Box sx={{ position: 'relative', my: 3 }}>
                      <FormatQuote sx={{ fontSize: 40, color: 'primary.main', opacity: 0.3 }} />
                      <Typography
                        variant="h6"
                        sx={{
                          fontStyle: 'italic',
                          lineHeight: 1.6,
                          pl: 4,
                          color: 'text.secondary',
                        }}
                      >
                        {featuredStory.quote}
                      </Typography>
                    </Box>

                    {/* Story Sections */}
                    {expandedStory === featuredStory.id ? (
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                          {t('storySection.challenge')}
                        </Typography>
                        <Typography paragraph sx={{ lineHeight: 1.8 }}>
                          {featuredStory.fullStory.challenge}
                        </Typography>

                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                          {t('storySection.journey')}
                        </Typography>
                        <Typography paragraph sx={{ lineHeight: 1.8 }}>
                          {featuredStory.fullStory.journey}
                        </Typography>

                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                          {t('storySection.breakthrough')}
                        </Typography>
                        <Typography paragraph sx={{ lineHeight: 1.8 }}>
                          {featuredStory.fullStory.breakthrough}
                        </Typography>

                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                          {t('storySection.results')}
                        </Typography>
                        <Typography paragraph sx={{ lineHeight: 1.8 }}>
                          {featuredStory.fullStory.results}
                        </Typography>

                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                          {t('storySection.advice')}
                        </Typography>
                        <Typography paragraph sx={{ lineHeight: 1.8 }}>
                          {featuredStory.fullStory.advice}
                        </Typography>

                        <Button
                          onClick={() => setExpandedStory(null)}
                          sx={{ mt: 2 }}
                        >
                          {t('featured.showLess')}
                        </Button>
                      </Box>
                    ) : (
                      <Button
                        variant="contained"
                        endIcon={<ArrowForward />}
                        onClick={() => setExpandedStory(featuredStory.id)}
                        sx={{
                          mt: 3,
                          background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)',
                          },
                        }}
                      >
                        {t('featured.readFullStory')}
                      </Button>
                    )}

                    {/* Tags */}
                    <Box sx={{ mt: 3 }}>
                      {featuredStory.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Grid>
              </Grid>
            </Card>
          </Container>
        )}

        {/* Category Tabs */}
        <Container maxWidth="lg" sx={{ mb: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', pb: 2 }}>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  variant={selectedCategory === category.id ? 'contained' : 'outlined'}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 2,
                    ...(selectedCategory === category.id && {
                      background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)',
                      },
                    }),
                  }}
                >
                  {category.label}
                </Button>
              ))}
            </Box>
          </Box>
        </Container>

        {/* Other Success Stories */}
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {filteredStories
              .filter(story => !story.featured)
              .map((story) => (
                <Grid item xs={12} md={6} key={story.id}>
                  <Card
                    sx={{
                      height: '100%',
                      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'background.paper',
                      backdropFilter: 'blur(10px)',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          sx={{
                            width: 60,
                            height: 60,
                            mr: 2,
                            bgcolor: 'primary.main',
                          }}
                        >
                          {story.name.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {story.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {story.title}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Quick Stats */}
                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            {t('metrics.timeToProfit')}
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {story.timeToProfit}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            {t('metrics.started')}
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {story.yearStarted}
                          </Typography>
                        </Grid>
                      </Grid>

                      {/* Quote */}
                      <Typography
                        variant="body2"
                        sx={{
                          fontStyle: 'italic',
                          color: 'text.secondary',
                          mb: 2,
                          lineHeight: 1.6,
                        }}
                      >
                        "{story.quote}"
                      </Typography>

                      {/* Tags */}
                      <Box sx={{ mb: 2 }}>
                        {story.tags.slice(0, 3).map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </Box>

                      <Button
                        endIcon={<ArrowForward />}
                        onClick={() => setExpandedStory(story.id)}
                        sx={{ mt: 'auto' }}
                      >
                        {t('actions.readStory')}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Container>

        {/* CTA Section */}
        <Box
          sx={{
            mt: 10,
            py: 8,
            background: isDarkMode
              ? 'linear-gradient(135deg, rgba(16,163,74,0.2) 0%, rgba(21,128,61,0.2) 100%)'
              : 'linear-gradient(135deg, rgba(16,163,74,0.1) 0%, rgba(21,128,61,0.1) 100%)',
            borderRadius: 4,
            mx: { xs: 2, md: 4 },
          }}
        >
          <Container maxWidth="md">
            <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 700 }}>
              {t('cta.title')}
            </Typography>
            <Typography
              variant="h6"
              align="center"
              color="text.secondary"
              sx={{ mb: 4 }}
            >
              {t('cta.subtitle')}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                component={Link}
                href="/auth/sign-up"
                variant="contained"
                size="large"
                sx={{
                  background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)',
                  },
                }}
              >
                {t('cta.startJourney')}
              </Button>
              <Button
                component={Link}
                href="/academy/masterclass"
                variant="outlined"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                }}
              >
                {t('cta.viewCourses')}
              </Button>
            </Box>
          </Container>
        </Box>
      </Box>
      <ProfessionalFooter />
    </>
  );
}