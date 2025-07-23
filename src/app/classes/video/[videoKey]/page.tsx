'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Stack,
  alpha,
} from '@mui/material';
import { ArrowLeft, Lock } from '@mui/icons-material';
import { useClassesAuth } from '@/hooks/use-classes-auth';
import { videoService } from '@/services/api/video.service';
import { ProfessionalVideoPlayer } from '@/components/academy/video/professional-video-player';

// Helper function to extract title from video key
function extractVideoTitle(key: string): string {
  // Extract filename from path
  const filename = key.split('/').pop() || key;
  // Remove extension and format
  const nameWithoutExt = filename.replace(/\.(?:mp4|webm|ogg)$/i, '');
  // Replace underscores with spaces and capitalize
  return nameWithoutExt
    .replace(/_/g, ' ')
    .replace(/clase/gi, 'Clase')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function ClassesVideoPage() {
  const params = useParams();
  const router = useRouter();
  const encodedVideoKey = params.videoKey as string;
  // Decode the video key to handle slashes and special characters
  const videoKey = decodeURIComponent(encodedVideoKey);
  const { isAuthenticated, hasAccess, loading: authLoading } = useClassesAuth();
  const [videoData, setVideoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (videoKey) {
      fetchVideoData();
    }
  }, [videoKey]);

  const fetchVideoData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await videoService.getVideoByKey(videoKey);
      setVideoData(data);
    } catch (err: any) {
      console.error('Error fetching video:', err);
      setError(err.message || 'Error al cargar el video');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/classes#videos');
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      router.push('/classes/sign-in');
      return;
    }

    try {
      // Import payment service dynamically to avoid build issues
      const { paymentService } = await import('@/services/api/payment.service');
      
      const checkoutData = await paymentService.createClassesCheckout({});
      
      // Redirect to Stripe Checkout
      window.location.href = checkoutData.url;
    } catch (err: any) {
      console.error('Checkout error:', err);
      // TODO: Replace with proper error handling UI
      console.error(err.message || 'Error al procesar el pago. Por favor intenta nuevamente.');
    }
  };

  if (authLoading || loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#0a0a0a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress sx={{ color: '#22c55e' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#0a0a0a', p: 4 }}>
        <Container maxWidth="lg">
          <Button
            startIcon={<ArrowLeft />}
            onClick={handleBack}
            sx={{ mb: 4, color: 'white' }}
          >
            Volver a las clases
          </Button>
          <Alert 
            severity="error" 
            sx={{ 
              backgroundColor: alpha('#f44336', 0.1), 
              color: 'white',
              '& .MuiAlert-icon': {
                color: '#f44336',
              },
            }}
          >
            {error}
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        position: 'relative',
      }}
    >
      {/* Background gradient */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${alpha('#0a0a0a', 0.92)} 0%, ${alpha('#16a34a', 0.85)} 30%, ${alpha('#991b1b', 0.85)} 70%, ${alpha('#0a0a0a', 0.92)} 100%)`,
          opacity: 0.3,
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
        {/* Header */}
        <Button
          startIcon={<ArrowLeft />}
          onClick={handleBack}
          sx={{ 
            mb: 4,
            color: 'white',
            '&:hover': {
              backgroundColor: alpha('#ffffff', 0.1),
            },
          }}
        >
          Volver a las clases
        </Button>

        {/* Video Player */}
        {!isAuthenticated || !hasAccess ? (
          <Box>
            {/* Protected Video Preview */}
            <Box
              sx={{
                position: 'relative',
                backgroundColor: '#000',
                borderRadius: 2,
                overflow: 'hidden',
                aspectRatio: '16/9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Blurred Background */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'url(https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'blur(20px)',
                  opacity: 0.3,
                }}
              />
              
              {/* Lock Overlay */}
              <Stack spacing={3} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    backgroundColor: alpha('#000', 0.5),
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `2px solid ${alpha('#22c55e', 0.5)}`,
                  }}
                >
                  <Lock sx={{ fontSize: 50, color: '#22c55e' }} />
                </Box>
                
                <Typography variant="h5" fontWeight={600} sx={{ color: 'white' }}>
                  Contenido Bloqueado
                </Typography>
                
                <Typography variant="body1" sx={{ color: alpha('#ffffff', 0.8) }}>
                  Obtén acceso completo a las clases
                </Typography>
              </Stack>
            </Box>
            
            {/* Access Required Message */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Stack spacing={3} alignItems="center">
                <Typography variant="h4" fontWeight={700} sx={{ color: 'white' }}>
                  {extractVideoTitle(videoKey) || 'Clase de Trading'}
                </Typography>
                
                <Typography variant="body1" sx={{ color: alpha('#ffffff', 0.7), maxWidth: 600 }}>
                  Para ver este video necesitas tener acceso al curso de clases. 
                  {!isAuthenticated && ' Inicia sesión o crea una cuenta para continuar.'}
                </Typography>
                
                <Stack direction="row" spacing={2}>
                  {!isAuthenticated ? (
                    <>
                      <Button
                        variant="contained"
                        onClick={() => router.push('/classes/sign-in')}
                        sx={{
                          backgroundColor: '#22c55e',
                          color: 'white',
                          px: 4,
                          py: 1.5,
                          '&:hover': {
                            backgroundColor: '#16a34a',
                          },
                        }}
                      >
                        Iniciar Sesión
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => router.push('/classes/sign-up')}
                        sx={{
                          borderColor: '#22c55e',
                          color: '#22c55e',
                          px: 4,
                          py: 1.5,
                          '&:hover': {
                            borderColor: '#16a34a',
                            backgroundColor: alpha('#22c55e', 0.1),
                          },
                        }}
                      >
                        Crear Cuenta
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleCheckout}
                      sx={{
                        backgroundColor: '#22c55e',
                        color: 'white',
                        px: 6,
                        py: 2,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        '&:hover': {
                          backgroundColor: '#16a34a',
                        },
                      }}
                    >
                      Obtener Acceso - $500 USD
                    </Button>
                  )}
                </Stack>
              </Stack>
            </Box>
          </Box>
        ) : (
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: 'white', mb: 4 }}>
              {extractVideoTitle(videoKey)}
            </Typography>
            
            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={4} alignItems="stretch">
              {/* Video Player - Left Side */}
              <Box sx={{ flex: '1 1 65%' }}>
                {videoData?.signedUrl ? (
                  <ProfessionalVideoPlayer
                    video={{
                      id: videoKey,
                      title: extractVideoTitle(videoKey),
                      description: 'Clase de trading profesional',
                      category: 'Classes',
                    }}
                    src={videoData.signedUrl}
                    onComplete={() => {
                      // Handle video completion
                      console.log('Video completed');
                    }}
                    onProgress={(progress) => {
                      // Handle video progress
                      console.log('Progress:', progress);
                    }}
                  />
                ) : (
                  <Alert severity="error" sx={{ backgroundColor: alpha('#f44336', 0.1), color: 'white' }}>
                    No se pudo cargar el video. Por favor, intenta de nuevo más tarde.
                    {!videoData && ' (No video data received)'}
                  </Alert>
                )}
              </Box>
              
              {/* Video Description - Right Side */}
              <Box sx={{ flex: '1 1 35%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body1" sx={{ color: alpha('#ffffff', 0.8), mb: 3, fontSize: '1.1rem', lineHeight: 1.8 }}>
                  En esta clase aprenderás conceptos fundamentales del trading profesional. 
                  Presta atención a cada detalle ya que todo el contenido está diseñado para 
                  llevarte paso a paso hacia el dominio del análisis de mercados.
                </Typography>
                
                <Stack spacing={3} sx={{ flex: 1, justifyContent: 'space-between' }}>
                  <Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ color: '#22c55e', fontWeight: 600 }}>
                        Objetivo de la clase
                      </Typography>
                      <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7), mt: 1 }}>
                        Dominar técnicas profesionales de análisis y toma de decisiones en el mercado
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="h6" sx={{ color: '#22c55e', fontWeight: 600 }}>
                        Aplicación práctica
                      </Typography>
                      <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7), mt: 1 }}>
                        Ejemplos reales y ejercicios para aplicar inmediatamente lo aprendido
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Alert 
                    severity="info" 
                    sx={{ 
                      backgroundColor: alpha('#22c55e', 0.1), 
                      color: 'white',
                      border: `1px solid ${alpha('#22c55e', 0.3)}`,
                      '& .MuiAlert-icon': {
                        color: '#22c55e',
                      },
                      mt: 'auto',
                    }}
                  >
                    <Typography variant="body2">
                      <strong>Recomendación:</strong> Toma notas durante la clase y practica con una cuenta demo 
                      antes de aplicar los conceptos en operaciones reales.
                    </Typography>
                  </Alert>
                </Stack>
              </Box>
            </Stack>
          </Box>
        )}
      </Container>
    </Box>
  );
}