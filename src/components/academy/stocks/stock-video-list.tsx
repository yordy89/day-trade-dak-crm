'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  Stack,
  Skeleton,
  Alert,
  useTheme,
  alpha,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
} from '@mui/material';
import { PlayCircle } from '@phosphor-icons/react/dist/ssr/PlayCircle';
import { Clock } from '@phosphor-icons/react/dist/ssr/Clock';
import { VideoCamera } from '@phosphor-icons/react/dist/ssr/VideoCamera';
import { TrendUp } from '@phosphor-icons/react/dist/ssr/TrendUp';
import { BookOpen } from '@phosphor-icons/react/dist/ssr/BookOpen';
import { Certificate } from '@phosphor-icons/react/dist/ssr/Certificate';
import { MagnifyingGlass as Search } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { Funnel as Filter } from '@phosphor-icons/react/dist/ssr/Funnel';
import { X } from '@phosphor-icons/react/dist/ssr/X';
import { useQuery } from '@tanstack/react-query';
import { videoService, type VideoMetadata } from '@/services/api/video.service';
import { useRouter } from 'next/navigation';
import { extractUniqueVideoFromHLS } from '@/data/video-mappings';
import { useTranslation } from 'react-i18next';

interface StockVideoWithMetadata extends VideoMetadata {
  title?: string;
  topic?: string;
  level?: string;
  duration?: string;
  order?: number;
}

export default function StockVideoList() {
  const theme = useTheme();
  const router = useRouter();
  const { t, i18n } = useTranslation('academy');
  const isDarkMode = theme.palette.mode === 'dark';
  const isSpanish = i18n.language === 'es';
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // Fetch videos from API
  const { data: videos = [], isLoading, error } = useQuery({
    queryKey: ['stock-videos'],
    queryFn: async () => {
      const data = await videoService.getStocksVideos();
      
      // Extract unique videos from HLS variants
      const uniqueVideos = extractUniqueVideoFromHLS(data);
      
      return uniqueVideos.map((video: any, index: number) => {
        // Extract the folder name from the path
        const pathParts = video.key.split('/');
        const stockFolder = pathParts[1] || '';
        
        // Format title based on folder name patterns
        let formattedTitle = '';
        let topic = '';
        let level = isSpanish ? 'Intermedio' : 'Intermediate';
        let duration = '';
        
        // Parse stock video folder names
        if (stockFolder.includes('fundamental')) {
          formattedTitle = isSpanish ? 'Análisis Fundamental' : 'Fundamental Analysis';
          topic = isSpanish ? 'Fundamentos' : 'Fundamentals';
          level = isSpanish ? 'Principiante' : 'Beginner';
        } else if (stockFolder.includes('technical')) {
          formattedTitle = isSpanish ? 'Análisis Técnico' : 'Technical Analysis';
          topic = isSpanish ? 'Trading Técnico' : 'Technical Trading';
        } else if (stockFolder.includes('options')) {
          formattedTitle = isSpanish ? 'Trading con Opciones' : 'Options Trading';
          topic = isSpanish ? 'Opciones' : 'Options';
          level = isSpanish ? 'Avanzado' : 'Advanced';
        } else if (stockFolder.includes('portfolio')) {
          formattedTitle = isSpanish ? 'Gestión de Portafolio' : 'Portfolio Management';
          topic = isSpanish ? 'Gestión' : 'Management';
        } else if (stockFolder.includes('valuation')) {
          formattedTitle = isSpanish ? 'Valoración de Empresas' : 'Company Valuation';
          topic = isSpanish ? 'Valoración' : 'Valuation';
        } else if (stockFolder.includes('strategies')) {
          formattedTitle = isSpanish ? 'Estrategias de Inversión' : 'Investment Strategies';
          topic = isSpanish ? 'Estrategias' : 'Strategies';
          level = isSpanish ? 'Avanzado' : 'Advanced';
        } else {
          // Default naming based on folder
          const cleanName = stockFolder
            .replace(/_/g, ' ')
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (l: string) => l.toUpperCase());
          formattedTitle = cleanName || `${isSpanish ? 'Lección' : 'Lesson'} ${index + 1}`;
          topic = isSpanish ? 'General' : 'General';
        }

        // Extract part number if exists
        const partMatch = /parte?[-_]?(\d+)/i.exec(stockFolder);
        if (partMatch) {
          formattedTitle += ` - ${isSpanish ? 'Parte' : 'Part'} ${partMatch[1]}`;
        }

        // Estimate duration (you can adjust based on actual video metadata)
        duration = `${15 + (index * 5)} min`;

        return {
          ...video,
          title: formattedTitle,
          topic,
          level,
          duration,
          order: index + 1
        };
      }).sort((a: any, b: any) => a.order - b.order);
    },
  });

  // Filter videos based on search and topic
  const filteredVideos = videos.filter((video: StockVideoWithMetadata) => {
    const matchesSearch = !searchQuery || 
      video.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.topic?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTopic = !selectedTopic || video.topic === selectedTopic;
    
    return matchesSearch && matchesTopic;
  });

  // Get unique topics for filtering
  const topics = Array.from(new Set(videos.map((v: StockVideoWithMetadata) => v.topic).filter(Boolean))) as string[];

  const handleVideoClick = (video: StockVideoWithMetadata) => {
    const videoKey = encodeURIComponent(video.key);
    router.push(`/academy/stock/video/${videoKey}`);
  };

  const getLevelColor = (level?: string) => {
    switch (level) {
      case 'Beginner':
      case 'Principiante':
        return 'success';
      case 'Intermediate':
      case 'Intermedio':
        return 'warning';
      case 'Advanced':
      case 'Avanzado':
        return 'error';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <Box>
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid item xs={12} md={6} lg={4} key={i}>
              <Card>
                <CardContent>
                  <Skeleton variant="rectangular" height={120} sx={{ mb: 2 }} />
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="60%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {isSpanish 
          ? 'Error al cargar los videos. Por favor, intenta de nuevo más tarde.'
          : 'Error loading videos. Please try again later.'}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Search and Filter Bar */}
      <Box sx={{ mb: 4 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            fullWidth
            placeholder={isSpanish ? 'Buscar videos...' : 'Search videos...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchQuery('')}>
                    <X size={16} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: { sm: 400 } }}
          />
          
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip
              label={isSpanish ? 'Todos' : 'All'}
              onClick={() => setSelectedTopic(null)}
              color={!selectedTopic ? 'primary' : 'default'}
              variant={!selectedTopic ? 'filled' : 'outlined'}
            />
            {topics.map((topic) => (
              <Chip
                key={topic}
                label={topic}
                onClick={() => setSelectedTopic(topic)}
                color={selectedTopic === topic ? 'primary' : 'default'}
                variant={selectedTopic === topic ? 'filled' : 'outlined'}
              />
            ))}
          </Stack>
        </Stack>
      </Box>

      {/* Video Grid */}
      {filteredVideos.length === 0 ? (
        <Alert severity="info">
          {isSpanish 
            ? 'No se encontraron videos con los criterios de búsqueda.'
            : 'No videos found matching your search criteria.'}
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredVideos.map((video: StockVideoWithMetadata, index: number) => (
            <Grid item xs={12} md={6} lg={4} key={video.key}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: selectedVideo === video.key 
                    ? `2px solid ${theme.palette.primary.main}` 
                    : '1px solid transparent',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                    borderColor: theme.palette.primary.light,
                  },
                }}
                onClick={() => handleVideoClick(video)}
              >
                <Box
                  sx={{
                    height: 180,
                    background: isDarkMode 
                      ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.3)} 0%, ${alpha(theme.palette.primary.main, 0.2)} 100%)`
                      : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.4)} 0%, ${alpha(theme.palette.primary.main, 0.3)} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <TrendUp size={64} color={theme.palette.primary.contrastText} weight="duotone" />
                  <PlayCircle
                    size={48}
                    weight="fill"
                    style={{
                      position: 'absolute',
                      color: theme.palette.primary.contrastText,
                      opacity: 0.9,
                    }}
                  />
                  
                  {/* Video Number Badge */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      bgcolor: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.6)',
                      color: 'white',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: '0.875rem',
                      fontWeight: 600,
                    }}
                  >
                    #{video.order}
                  </Box>
                  
                  {/* Duration Badge */}
                  {video.duration && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 12,
                        right: 12,
                        bgcolor: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.6)',
                        color: 'white',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      <Clock size={14} />
                      {video.duration}
                    </Box>
                  )}
                </Box>

                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    {video.title}
                  </Typography>
                  
                  <Stack direction="row" spacing={1} mb={2}>
                    {video.topic && (
                      <Chip
                        label={video.topic}
                        size="small"
                        icon={<BookOpen size={14} />}
                        sx={{ fontSize: '0.75rem' }}
                      />
                    )}
                    {video.level && (
                      <Chip
                        label={video.level}
                        size="small"
                        color={getLevelColor(video.level)}
                        sx={{ fontSize: '0.75rem' }}
                      />
                    )}
                  </Stack>

                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {isSpanish 
                      ? 'Aprende las mejores estrategias para invertir en el mercado de valores.'
                      : 'Learn the best strategies for stock market investing.'}
                  </Typography>

                  <Stack direction="row" alignItems="center" spacing={1}>
                    <VideoCamera size={16} color={theme.palette.text.secondary} />
                    <Typography variant="caption" color="text.secondary">
                      {isSpanish ? 'Video HD' : 'HD Video'}
                    </Typography>
                    <Box sx={{ flex: 1 }} />
                    <Certificate size={16} color={theme.palette.success.main} />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}