'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Card, 
  CardContent,
  Grid,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Skeleton,
  Paper,
  useTheme,
  alpha
} from '@mui/material';
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { PlayCircle } from '@phosphor-icons/react/dist/ssr/PlayCircle';
import { BookOpen } from '@phosphor-icons/react/dist/ssr/BookOpen';
import { TrendUp } from '@phosphor-icons/react/dist/ssr/TrendUp';
import { Download } from '@phosphor-icons/react/dist/ssr/Download';
import { Share } from '@phosphor-icons/react/dist/ssr/Share';
import { BookmarkSimple } from '@phosphor-icons/react/dist/ssr/BookmarkSimple';
import { Clock } from '@phosphor-icons/react/dist/ssr/Clock';
import { Certificate } from '@phosphor-icons/react/dist/ssr/Certificate';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { videoService } from '@/services/api/video.service';
import { SimpleHLSPlayer } from '@/components/academy/shared/simple-hls-player';
import { useModuleAccess } from '@/hooks/use-module-access';
import { ModuleType } from '@/types/module-permission';
import { useTranslation } from 'react-i18next';
import StockVideoList from '@/components/academy/stocks/stock-video-list';

export default function StockVideoPage() {
  const router = useRouter();
  const params = useParams();
  const theme = useTheme();
  const { t, i18n } = useTranslation('academy');
  const isSpanish = i18n.language === 'es';
  const videoKey = params?.videoKey as string;
  const decodedVideoKey = decodeURIComponent(videoKey || '');
  
  const { hasAccess, loading: accessLoading } = useModuleAccess(ModuleType.Stocks);
  const [showVideoList, setShowVideoList] = useState(false);

  // Fetch all stock videos to find the current one
  const { data: videos = [], isLoading } = useQuery({
    queryKey: ['stock-videos'],
    queryFn: async () => {
      const data = await videoService.getStocksVideos();
      return data;
    },
    enabled: hasAccess && !!videoKey,
  });

  // Find current video
  const currentVideo = videos.find(v => v.key === decodedVideoKey);
  const currentIndex = videos.findIndex(v => v.key === decodedVideoKey);
  const prevVideo = currentIndex > 0 ? videos[currentIndex - 1] : null;
  const nextVideo = currentIndex < videos.length - 1 ? videos[currentIndex + 1] : null;

  // Extract video metadata
  const getVideoTitle = () => {
    if (!currentVideo) return isSpanish ? 'Video de Acciones' : 'Stock Video';
    
    const pathParts = currentVideo.key.split('/');
    const stockFolder = pathParts[1] || '';
    
    if (stockFolder.includes('fundamental')) {
      return isSpanish ? 'Análisis Fundamental' : 'Fundamental Analysis';
    } else if (stockFolder.includes('technical')) {
      return isSpanish ? 'Análisis Técnico' : 'Technical Analysis';
    } else if (stockFolder.includes('options')) {
      return isSpanish ? 'Trading con Opciones' : 'Options Trading';
    } else if (stockFolder.includes('portfolio')) {
      return isSpanish ? 'Gestión de Portafolio' : 'Portfolio Management';
    } else if (stockFolder.includes('valuation')) {
      return isSpanish ? 'Valoración de Empresas' : 'Company Valuation';
    } else if (stockFolder.includes('strategies')) {
      return isSpanish ? 'Estrategias de Inversión' : 'Investment Strategies';
    }
    
    const cleanName = stockFolder
      .replace(/_/g, ' ')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (l: string) => l.toUpperCase());
    
    return cleanName || `${isSpanish ? 'Lección' : 'Lesson'} ${currentIndex + 1}`;
  };

  const navigateToVideo = (video: any) => {
    if (video) {
      const encodedKey = encodeURIComponent(video.key);
      router.push(`/academy/stock/video/${encodedKey}`);
    }
  };

  if (accessLoading || isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={60} sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Skeleton variant="rectangular" height={500} />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (!hasAccess) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box textAlign="center">
          <TrendUp size={80} color={theme.palette.text.secondary} />
          <Typography variant="h4" gutterBottom sx={{ mt: 3 }}>
            {t('stocks.accessRequired')}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {t('stocks.needSubscriptionOrPermission')}
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push('/academy/subscription/plans?highlight=Stocks')}
            sx={{ mt: 3 }}
          >
            {t('stocks.viewPlans')}
          </Button>
        </Box>
      </Container>
    );
  }

  if (!currentVideo) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error">
          {isSpanish ? 'Video no encontrado' : 'Video not found'}
        </Alert>
        <Button
          startIcon={<ArrowLeft />}
          onClick={() => router.push('/academy/stock')}
          sx={{ mt: 2 }}
        >
          {isSpanish ? 'Volver a Acciones' : 'Back to Stocks'}
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <Button
              startIcon={<ArrowLeft />}
              onClick={() => router.push('/academy/stock#videos')}
              variant="outlined"
            >
              {isSpanish ? 'Volver a la lista' : 'Back to list'}
            </Button>
            
            <Box flex={1} />
            
            {prevVideo && (
              <Tooltip title={isSpanish ? 'Video anterior' : 'Previous video'}>
                <IconButton onClick={() => navigateToVideo(prevVideo)}>
                  <ArrowLeft />
                </IconButton>
              </Tooltip>
            )}
            
            {nextVideo && (
              <Tooltip title={isSpanish ? 'Siguiente video' : 'Next video'}>
                <IconButton onClick={() => navigateToVideo(nextVideo)}>
                  <ArrowRight />
                </IconButton>
              </Tooltip>
            )}
            
            <Button
              variant="contained"
              onClick={() => setShowVideoList(!showVideoList)}
            >
              {showVideoList 
                ? (isSpanish ? 'Ocultar lista' : 'Hide list')
                : (isSpanish ? 'Ver lista completa' : 'View full list')}
            </Button>
          </Stack>

          <Typography variant="h4" fontWeight={700} gutterBottom>
            {getVideoTitle()}
          </Typography>
          
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              icon={<BookOpen size={16} />}
              label={isSpanish ? 'Acciones' : 'Stocks'}
              color="primary"
              size="small"
            />
            <Chip
              icon={<Clock size={16} />}
              label={`${isSpanish ? 'Video' : 'Video'} ${currentIndex + 1} / ${videos.length}`}
              size="small"
            />
            <Chip
              icon={<Certificate size={16} />}
              label={isSpanish ? 'Certificado disponible' : 'Certificate available'}
              color="success"
              size="small"
            />
          </Stack>
        </Box>

        {/* Main Content */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={showVideoList ? 8 : 12}>
            {/* Video Player */}
            <Paper 
              elevation={3} 
              sx={{ 
                borderRadius: 2, 
                overflow: 'hidden',
                bgcolor: 'black'
              }}
            >
              {currentVideo?.signedUrl && (
                <SimpleHLSPlayer src={currentVideo.signedUrl} />
              )}
            </Paper>

            {/* Video Info */}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Stack direction="row" spacing={2} mb={3}>
                  <Button startIcon={<Download />} variant="outlined">
                    {isSpanish ? 'Descargar recursos' : 'Download resources'}
                  </Button>
                  <Button startIcon={<BookmarkSimple />} variant="outlined">
                    {isSpanish ? 'Guardar' : 'Save'}
                  </Button>
                  <Button startIcon={<Share />} variant="outlined">
                    {isSpanish ? 'Compartir' : 'Share'}
                  </Button>
                </Stack>

                <Typography variant="h6" gutterBottom>
                  {isSpanish ? 'Sobre esta lección' : 'About this lesson'}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {isSpanish 
                    ? 'En esta lección aprenderás estrategias avanzadas para invertir en el mercado de acciones. Cubriremos análisis técnico y fundamental, gestión de riesgo, y cómo identificar oportunidades de inversión rentables.'
                    : 'In this lesson you will learn advanced strategies for stock market investing. We will cover technical and fundamental analysis, risk management, and how to identify profitable investment opportunities.'}
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  {isSpanish ? 'Temas cubiertos' : 'Topics covered'}
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2">• {isSpanish ? 'Análisis de estados financieros' : 'Financial statement analysis'}</Typography>
                  <Typography variant="body2">• {isSpanish ? 'Indicadores técnicos avanzados' : 'Advanced technical indicators'}</Typography>
                  <Typography variant="body2">• {isSpanish ? 'Estrategias de entrada y salida' : 'Entry and exit strategies'}</Typography>
                  <Typography variant="body2">• {isSpanish ? 'Gestión de riesgo y portafolio' : 'Risk and portfolio management'}</Typography>
                </Stack>
              </CardContent>
            </Card>

            {/* Navigation */}
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                {prevVideo && (
                  <Grid item xs={12} sm={6}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) }
                      }}
                      onClick={() => navigateToVideo(prevVideo)}
                    >
                      <CardContent>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <ArrowLeft size={24} />
                          <Box flex={1}>
                            <Typography variant="caption" color="text.secondary">
                              {isSpanish ? 'Anterior' : 'Previous'}
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {isSpanish ? 'Lección anterior' : 'Previous lesson'}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
                
                {nextVideo && (
                  <Grid item xs={12} sm={prevVideo ? 6 : 12}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) }
                      }}
                      onClick={() => navigateToVideo(nextVideo)}
                    >
                      <CardContent>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box flex={1} textAlign={prevVideo ? 'right' : 'left'}>
                            <Typography variant="caption" color="text.secondary">
                              {isSpanish ? 'Siguiente' : 'Next'}
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {isSpanish ? 'Siguiente lección' : 'Next lesson'}
                            </Typography>
                          </Box>
                          <ArrowRight size={24} />
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Grid>

          {/* Video List Sidebar */}
          {showVideoList && (
            <Grid item xs={12} lg={4}>
              <Box sx={{ 
                position: 'sticky', 
                top: 20,
                maxHeight: 'calc(100vh - 100px)',
                overflowY: 'auto'
              }}>
                <Typography variant="h6" gutterBottom sx={{ px: 2, pt: 2 }}>
                  {isSpanish ? 'Lista de videos' : 'Video list'}
                </Typography>
                <StockVideoList />
              </Box>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}