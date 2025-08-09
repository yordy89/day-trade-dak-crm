'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Search,
  ExpandMore,
  HelpOutline,
  School,
  Payment,
  Security,
  Settings,
  TrendingUp,
  Email,
  Phone,
  Chat,
  ArrowForward,
  CheckCircle,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { MainNavbar } from '@/components/landing/main-navbar';
import { ProfessionalFooter } from '@/components/landing/professional-footer';

const helpCategories = [
  {
    id: 'getting-started',
    title: 'Comenzando',
    icon: School,
    description: 'Aprende los conceptos básicos de nuestra plataforma educativa',
    articles: [
      'Cómo crear una cuenta',
      'Navegando la plataforma',
      'Configuración inicial',
      'Accediendo a tu primer curso',
    ],
  },
  {
    id: 'trading',
    title: 'Educación en Trading',
    icon: TrendingUp,
    description: 'Aprende sobre trading y análisis de mercado',
    articles: [
      'Entendiendo las señales educativas',
      'Cómo unirse a la sala en vivo',
      'Interpretando análisis de mercado',
      'Recursos de aprendizaje disponibles',
    ],
  },
  {
    id: 'payments',
    title: 'Pagos y Suscripciones',
    icon: Payment,
    description: 'Información sobre pagos, planes y facturación',
    articles: [
      'Métodos de pago aceptados',
      'Cambiar plan de suscripción',
      'Cancelar suscripción',
      'Historial de facturación',
    ],
  },
  {
    id: 'security',
    title: 'Seguridad',
    icon: Security,
    description: 'Mantén tu cuenta segura',
    articles: [
      'Autenticación de dos factores',
      'Cambiar contraseña',
      'Reconocer phishing',
      'Mejores prácticas de seguridad',
    ],
  },
  {
    id: 'settings',
    title: 'Configuración',
    icon: Settings,
    description: 'Personaliza tu experiencia',
    articles: [
      'Preferencias de notificación',
      'Configuración de idioma',
      'Zona horaria',
      'Configuración de privacidad',
    ],
  },
  {
    id: 'common-issues',
    title: 'Problemas Comunes',
    icon: HelpOutline,
    description: 'Soluciones a problemas frecuentes',
    articles: [
      'No puedo iniciar sesión',
      'Problemas de conexión',
      'Error al procesar pago',
      'Gráficos no cargan',
    ],
  },
];

const popularArticles = [
  {
    title: 'Cómo unirse a la sala en vivo',
    category: 'Educación',
    views: '2.3k',
  },
  {
    title: 'Cambiar método de pago',
    category: 'Pagos',
    views: '1.8k',
  },
  {
    title: 'Acceder al Master Course',
    category: 'Educación',
    views: '1.5k',
  },
  {
    title: 'Descargar materiales del curso',
    category: 'Configuración',
    views: '1.2k',
  },
  {
    title: 'Activar autenticación de dos factores',
    category: 'Seguridad',
    views: '980',
  },
];

export default function HelpPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [expandedCategory, setExpandedCategory] = React.useState<string | false>(false);

  const handleCategoryClick = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? false : categoryId);
  };

  const handleContactSupport = () => {
    router.push('/contact');
  };

  return (
    <>
      <MainNavbar />
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pt: 16, pb: 8 }}>
        {/* Hero Section */}
        <Box
        sx={{
          background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
          color: 'white',
          py: 10,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Centro de Ayuda
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            ¿En qué podemos ayudarte hoy?
          </Typography>
          
          {/* Search Bar */}
          <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <TextField
              fullWidth
              placeholder="Buscar artículos de ayuda..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                  borderRadius: 2,
                  '& fieldset': { border: 'none' },
                  '& input': {
                    color: '#000000 !important',
                    caretColor: '#000000 !important',
                    WebkitTextFillColor: '#000000 !important',
                    '&::placeholder': {
                      color: 'rgba(0, 0, 0, 0.6) !important',
                      WebkitTextFillColor: 'rgba(0, 0, 0, 0.6) !important',
                      opacity: '1 !important',
                    },
                  },
                },
                '& .MuiInputBase-input': {
                  color: '#000000 !important',
                  WebkitTextFillColor: '#000000 !important',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'rgba(0, 0, 0, 0.5)' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Popular Articles */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
            Artículos Populares
          </Typography>
          <Grid container spacing={2}>
            {popularArticles.map((article, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3,
                    },
                  }}
                >
                  <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 500 }}>
                        {article.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {article.category} • {article.views} vistas
                      </Typography>
                    </Box>
                    <ArrowForward color="action" />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Help Categories */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
            Categorías de Ayuda
          </Typography>
          <Grid container spacing={3}>
            {helpCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Grid item xs={12} md={6} lg={4} key={category.id}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Icon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {category.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {category.description}
                      </Typography>
                      <Accordion
                        expanded={expandedCategory === category.id}
                        onChange={() => handleCategoryClick(category.id)}
                        elevation={0}
                        sx={{
                          '&:before': { display: 'none' },
                          bgcolor: 'transparent',
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMore />}
                          sx={{ p: 0, minHeight: 'auto' }}
                        >
                          <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
                            Ver artículos ({category.articles.length})
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 0, pt: 1 }}>
                          <List dense>
                            {category.articles.map((article, index) => (
                              <ListItem key={index} sx={{ pl: 0 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                  <CheckCircle fontSize="small" color="success" />
                                </ListItemIcon>
                                <ListItemText primary={article} />
                              </ListItem>
                            ))}
                          </List>
                        </AccordionDetails>
                      </Accordion>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* Contact Support */}
        <Card
          sx={{
            background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.08) 0%, rgba(22, 163, 74, 0.12) 100%)',
            backdropFilter: 'blur(10px)',
            p: 4,
            textAlign: 'center',
            border: '2px solid',
            borderColor: 'rgba(22, 163, 74, 0.3)',
            boxShadow: '0 8px 32px rgba(22, 163, 74, 0.15)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 40px rgba(22, 163, 74, 0.2)',
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #16a34a, #15803d)',
              animation: 'shimmer 2s infinite',
            },
            '@keyframes shimmer': {
              '0%': { transform: 'translateX(-100%)' },
              '100%': { transform: 'translateX(100%)' },
            },
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
            ¿No encuentras lo que buscas?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: 'text.primary', fontWeight: 500 }}>
            Nuestro equipo de soporte está aquí para ayudarte
          </Typography>
          <Grid container spacing={3} sx={{ maxWidth: 600, mx: 'auto' }}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Chat sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Chat en Vivo
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lun-Vie 9AM-6PM
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Email sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Email
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  support@daytradedak.com
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Phone sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Teléfono
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  +1 (555) 123-4567
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Button
            variant="contained"
            size="large"
            startIcon={<Email />}
            onClick={handleContactSupport}
            sx={{
              mt: 4,
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)',
              },
            }}
          >
            Contactar Soporte
          </Button>
        </Card>
      </Container>
    </Box>
    <ProfessionalFooter />
    </>
  );
}