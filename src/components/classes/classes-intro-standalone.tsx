import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  Stack,
  Chip,
  alpha,
  CircularProgress,
} from '@mui/material';
import { PlayCircle } from '@phosphor-icons/react/dist/ssr/PlayCircle';
import { Calendar } from '@phosphor-icons/react/dist/ssr/Calendar';
import { ChartLineUp } from '@phosphor-icons/react/dist/ssr/ChartLineUp';
import { Trophy } from '@phosphor-icons/react/dist/ssr/Trophy';
import { BookOpen } from '@phosphor-icons/react/dist/ssr/BookOpen';
import { AttachMoney, CreditCard, TrendingUp, Logout } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface ClasesIntroStandaloneProps {
  onStart: (paymentMethod?: 'card' | 'klarna') => void;
  ctaText: string;
  hasAccess?: boolean;
  isAuthenticated?: boolean;
  loading?: boolean;
}

const MotionBox = motion(Box);
const MotionCard = motion(Card);

export default function ClasesIntroStandalone({ 
  onStart, 
  ctaText: _ctaText, 
  hasAccess, 
  isAuthenticated,
  loading 
}: ClasesIntroStandaloneProps) {
  const router = useRouter();
  const KLARNA_FEE_PERCENTAGE = 0.0644; // 6.44%
  const BASE_PRICE = 500;

  const handleLogout = () => {
    // Clear auth storage
    localStorage.removeItem('auth-storage');
    // Redirect to classes sign-in page
    router.push('/classes/sign-in');
  };

  const features = [
    {
      icon: <Calendar size={32} weight="fill" />,
      title: 'Acceso por 15 días',
      description: 'Acceso completo durante 15 días a todo el contenido del curso',
    },
    {
      icon: <BookOpen size={32} weight="fill" />,
      title: '8 Clases Intensivas',
      description: 'Contenido organizado de forma progresiva para un aprendizaje óptimo',
    },
    {
      icon: <ChartLineUp size={32} weight="fill" />,
      title: 'Análisis de Mercado',
      description: 'Aprende a analizar gráficos y tomar decisiones informadas',
    },
    {
      icon: <AttachMoney sx={{ fontSize: 32 }} />,
      title: 'Trading Real',
      description: 'Ejemplos prácticos con operaciones reales del mercado',
    },
  ];


  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        backgroundColor: '#0a0a0a',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Logout button - only show when authenticated */}
      {isAuthenticated ? <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 2,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<Logout />}
            onClick={handleLogout}
            sx={{
              borderColor: alpha('#ffffff', 0.3),
              color: 'white',
              '&:hover': {
                borderColor: alpha('#ffffff', 0.5),
                backgroundColor: alpha('#ffffff', 0.1),
              },
            }}
          >
            Cerrar Sesión
          </Button>
        </Box> : null}

      {/* Background gradient effect */}
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

      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <MotionBox
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                {hasAccess ? <Chip
                    label="Acceso Activo"
                    color="success"
                    sx={{ mb: 2 }}
                  /> : null}
                
                <Typography
                  variant="h2"
                  fontWeight={800}
                  gutterBottom
                  sx={{
                    color: 'white',
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    lineHeight: 1.2,
                  }}
                >
                  Clases de Trading Intensivas
                </Typography>
                
                <Typography
                  variant="h5"
                  sx={{
                    color: alpha('#ffffff', 0.8),
                    mb: 3,
                    fontWeight: 300,
                  }}
                >
                  Domina los mercados en 15 días
                </Typography>
                
                <Typography
                  variant="body1"
                  sx={{
                    color: alpha('#ffffff', 0.7),
                    mb: 4,
                    fontSize: '1.1rem',
                    lineHeight: 1.8,
                  }}
                >
                  Aprende a analizar los mercados y tomar decisiones informadas. Este curso intensivo de 8 clases te enseñará cómo leer gráficos, identificar oportunidades y gestionar el riesgo en solo 15 días.
                </Typography>

                {!isAuthenticated ? (
                  // Not logged in - show login button
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => onStart()}
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <AttachMoney />}
                      sx={{
                        py: 2,
                        px: 4,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        backgroundColor: '#22c55e',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: '#16a34a',
                        },
                      }}
                    >
                      Comenzar Ahora
                    </Button>
                    <Typography variant="h6" sx={{ color: '#22c55e', fontWeight: 700 }}>
                      $500 USD
                    </Typography>
                  </Stack>
                ) : !hasAccess ? (
                  // Logged in but no access - show payment options
                  <Stack spacing={2} sx={{ mb: 3 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => onStart('card')}
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <CreditCard />}
                      sx={{
                        py: 2,
                        px: 4,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        backgroundColor: '#22c55e',
                        color: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                        '&:hover': {
                          backgroundColor: '#16a34a',
                        },
                      }}
                    >
                      <span>Pagar con Tarjeta</span>
                      <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                        ${BASE_PRICE} USD
                      </span>
                    </Button>
                    
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => onStart('klarna')}
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <TrendingUp />}
                      sx={{
                        py: 2,
                        px: 4,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                        color: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #db2777 0%, #be185d 100%)',
                        },
                      }}
                    >
                      <span>Financiar con Klarna</span>
                      <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                        ${(BASE_PRICE * (1 + KLARNA_FEE_PERCENTAGE)).toFixed(2)} USD
                      </span>
                      <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                        (incluye {(KLARNA_FEE_PERCENTAGE * 100).toFixed(2)}% por financiamiento)
                      </span>
                    </Button>
                  </Stack>
                ) : (
                  // Has access - show view classes button
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => onStart()}
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <PlayCircle />}
                      sx={{
                        py: 2,
                        px: 4,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        backgroundColor: '#22c55e',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: '#16a34a',
                        },
                      }}
                    >
                      Ver Clases
                    </Button>
                  </Stack>
                )}

                <Stack direction="row" spacing={4} sx={{ mt: 4 }}>
                  <Box>
                    <Typography variant="h4" fontWeight={800} sx={{ color: '#22c55e' }}>
                      8
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.6) }}>
                      Clases intensivas
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight={800} sx={{ color: '#22c55e' }}>
                      15
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.6) }}>
                      Días de acceso
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight={800} sx={{ color: '#22c55e' }}>
                      24/7
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.6) }}>
                      Soporte
                    </Typography>
                  </Box>
                </Stack>
              </MotionBox>
            </Grid>

            <Grid item xs={12} md={6}>
              <MotionBox
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Stack spacing={3}>
                  {/* Course Highlights */}
                  <Card
                    sx={{
                      p: 4,
                      backgroundColor: alpha('#22c55e', 0.1),
                      backdropFilter: 'blur(10px)',
                      border: `2px solid ${alpha('#22c55e', 0.3)}`,
                      borderRadius: 3,
                    }}
                  >
                    <Typography variant="h5" fontWeight={700} gutterBottom sx={{ color: 'white' }}>
                      Lo que aprenderás
                    </Typography>
                    <Stack spacing={2}>
                      {[
                        'Análisis técnico de gráficos',
                        'Identificación de patrones de mercado',
                        'Gestión profesional del riesgo',
                        'Psicología del trading exitoso',
                        'Creación de un plan de trading',
                      ].map((item, index) => (
                        <Stack key={index} direction="row" spacing={2} alignItems="center">
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: '#22c55e',
                            }}
                          />
                          <Typography variant="body1" sx={{ color: alpha('#ffffff', 0.9) }}>
                            {item}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Card>

                  {/* Why Choose Us */}
                  <Card
                    sx={{
                      p: 4,
                      backgroundColor: alpha('#ffffff', 0.05),
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${alpha('#22c55e', 0.2)}`,
                      borderRadius: 3,
                    }}
                  >
                    <Stack spacing={3}>
                      <Box>
                        <Typography variant="h6" fontWeight={700} sx={{ color: '#22c55e', mb: 1 }}>
                          ¿Por qué elegir nuestro curso?
                        </Typography>
                        <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.8), lineHeight: 1.6 }}>
                          Con años de experiencia en los mercados financieros, hemos diseñado un programa 
                          intensivo que te llevará desde los conceptos básicos hasta técnicas avanzadas 
                          en solo 15 días.
                        </Typography>
                      </Box>
                      
                      <Stack spacing={2}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box sx={{ 
                            width: 40, 
                            height: 40, 
                            borderRadius: '50%', 
                            backgroundColor: alpha('#22c55e', 0.2),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Trophy size={20} color="#22c55e" />
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600} sx={{ color: 'white' }}>
                              Resultados Comprobados
                            </Typography>
                            <Typography variant="caption" sx={{ color: alpha('#ffffff', 0.6) }}>
                              Técnicas probadas en mercados reales
                            </Typography>
                          </Box>
                        </Stack>
                        
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box sx={{ 
                            width: 40, 
                            height: 40, 
                            borderRadius: '50%', 
                            backgroundColor: alpha('#22c55e', 0.2),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Calendar size={20} color="#22c55e" />
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600} sx={{ color: 'white' }}>
                              Acceso Inmediato
                            </Typography>
                            <Typography variant="caption" sx={{ color: alpha('#ffffff', 0.6) }}>
                              Comienza a aprender hoy mismo
                            </Typography>
                          </Box>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Card>
                </Stack>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            textAlign="center"
            fontWeight={700}
            gutterBottom
            sx={{ color: 'white', mb: 6 }}
          >
            ¿Qué obtienes con el curso?
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <MotionCard
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  sx={{
                    height: '100%',
                    p: 3,
                    backgroundColor: alpha('#ffffff', 0.05),
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha('#22c55e', 0.2)}`,
                    borderRadius: 3,
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      backgroundColor: alpha('#22c55e', 0.1),
                      borderColor: '#22c55e',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 2,
                      backgroundColor: alpha('#22c55e', 0.2),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      color: '#22c55e',
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: 'white' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7) }}>
                    {feature.description}
                  </Typography>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>


      {/* CTA Section */}
      <Box sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="sm">
          <Card
            sx={{
              p: 6,
              textAlign: 'center',
              backgroundColor: alpha('#22c55e', 0.1),
              backdropFilter: 'blur(10px)',
              border: `2px solid ${alpha('#22c55e', 0.3)}`,
              borderRadius: 4,
            }}
          >
            <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: 'white' }}>
              ¿Listo para empezar?
            </Typography>
            <Typography variant="body1" sx={{ color: alpha('#ffffff', 0.8), mb: 4 }}>
              Únete a miles de traders que ya están mejorando sus resultados
            </Typography>
            {!isAuthenticated ? (
              // Not logged in - show login button
              <Button
                variant="contained"
                size="large"
                onClick={() => onStart()}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <AttachMoney />}
                sx={{
                  py: 2,
                  px: 6,
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  backgroundColor: '#22c55e',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#16a34a',
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.3s',
                }}
              >
                Comenzar Ahora
              </Button>
            ) : !hasAccess ? (
              // Logged in but no access - show payment options
              <Stack spacing={2} sx={{ width: '100%', maxWidth: 400 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => onStart('card')}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <CreditCard />}
                  fullWidth
                  sx={{
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    backgroundColor: '#22c55e',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                    '&:hover': {
                      backgroundColor: '#16a34a',
                      transform: 'scale(1.02)',
                    },
                    transition: 'all 0.3s',
                  }}
                >
                  <span>Pagar con Tarjeta</span>
                  <span style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                    ${BASE_PRICE} USD
                  </span>
                </Button>
                
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => onStart('klarna')}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <TrendingUp />}
                  fullWidth
                  sx={{
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #db2777 0%, #be185d 100%)',
                      transform: 'scale(1.02)',
                    },
                    transition: 'all 0.3s',
                  }}
                >
                  <span>Financiar con Klarna</span>
                  <span style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                    ${(BASE_PRICE * (1 + KLARNA_FEE_PERCENTAGE)).toFixed(2)} USD
                  </span>
                  <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                    (incluye {(KLARNA_FEE_PERCENTAGE * 100).toFixed(2)}% por financiamiento)
                  </span>
                </Button>
              </Stack>
            ) : (
              // Has access - show view classes button
              <Button
                variant="contained"
                size="large"
                onClick={() => onStart()}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <PlayCircle />}
                sx={{
                  py: 2,
                  px: 6,
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  backgroundColor: '#22c55e',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#16a34a',
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.3s',
                }}
              >
                Ver Clases
              </Button>
            )}
          </Card>
        </Container>
      </Box>
    </Box>
  );
}