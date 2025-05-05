'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { Button, Card, IconButton, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CheckCircle, FacebookLogo, InstagramLogo, TwitterLogo } from '@phosphor-icons/react';

import { paths } from '@/paths';
import { DynamicLogo } from '@/components/core/logo';

export interface LayoutProps {
  children: React.ReactNode;
}

const features = [
  'Mentorías Exclusivas 🔥',
  'Clases Diarias Grabadas 🔥',
  'Libros Recomendados',
  'Earnings Semanales',
  // 'Live Market Scanning',
  // 'Educational Trading Resources',
];

export function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh', // Ensure full-screen height
        backgroundImage: 'url(/assets/login-background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        alignItems: 'center',
        textAlign: 'center',
        px: 3,
        py: 5,
      }}
    >
      {/* Top Section */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: { xs: 'column', md: 'row' },
          px: 4,
          mb: 4,
        }}
      >
        {/* Logo - Left */}
        <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-block' }}>
          <DynamicLogo colorDark="light" colorLight="dark" height={82} width={122} />
        </Box>

        {/* Welcome Message - Center */}
        <Box sx={{ flex: 1, textAlign: 'center' }}>
          <Typography variant="h4" color="white" sx={{ fontWeight: 'bold' }}>
            Bienvenido a{' '}
            <Box component="span" sx={{ color: 'primary.light' }}>
              Day Trade Dak
            </Box>
          </Typography>
          <Typography variant="subtitle1" color="white">
            Tu plataforma de confianza para análisis de mercado y conocimientos expertos en trading.
          </Typography>
        </Box>
      </Box>

      {/* Main Content (Scrollable if needed) */}
      <Box
        sx={{
          flex: 1, // Takes available space and makes this area scrollable
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'flex-start',
          justifyContent: 'space-evenly',
          width: '100%',
          maxWidth: '1800px',
          gap: 10,
          overflowY: 'auto', // Allow scrolling if content overflows
          pb: 15, // Prevent content from overlapping the fixed footer
          pt: 5,
        }}
      >
        {/* Form Section */}
        <Card
          sx={{
            p: 4,
            width: { xs: '100%', md: '500px' },
            display: 'flex',
            justifyContent: 'center',
            boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0px 15px 40px rgba(0, 0, 0, 0.15)',
            },
          }}
        >
          <Box sx={{ width: '100%' }}>{children}</Box>
        </Card>

        {/* Features List Section */}
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="h5" color="white" sx={{ fontWeight: 'bold', mb: 2 }}>
            Todo lo que necesitas para tu trading
          </Typography>
          <Box sx={{ display: 'flex', gap: '30px' }}>
            <List sx={{ color: 'white', textAlign: 'left' }}>
              {features.map((feature) => (
                <ListItem key={feature} sx={{ pl: 0 }}>
                  <ListItemIcon sx={{ minWidth: '32px' }}>
                    <CheckCircle size={20} weight="bold" color="lightgreen" />
                  </ListItemIcon>
                  <ListItemText primary={feature} />
                </ListItem>
              ))}
            </List>
          </Box>
          <Box sx={{ textAlign: 'left', color: 'white', mt: 6 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
              Próximo Evento: Invertir con Confianza
            </Typography>
            <Typography variant="body1" color="white" style={{marginTop: '10px'}}>
                📍 4200 George J.Bean Parkway,Tampa, FL 33607, USA
              </Typography>
            <Typography variant="body1" color="white" style={{marginTop: '10px'}}>
                📅 Sábado, 23 de agosto de 2025
              </Typography>
              <Typography variant="body1" color="white" style={{marginBottom: '10px'}}>
                ⏰ <span style={{fontWeight: 'bold'}}>VIP:</span> 8:30 AM – 10:00 AM | <span style={{fontWeight: 'bold'}}>Evento General:</span> 10:00 AM – 2:00 PM
              </Typography>
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              href="/events/680fe27154c9b64e54e2424f"
              sx={{ mt: 1 }}
            >
              Registrarse
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Footer (Fixed at Bottom) */}
      <Box
        sx={{
          width: '100%',
          position: 'fixed',
          bottom: 0,
          left: 0,
          py: 3,
          px: 4,
          textAlign: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
        }}
      >
        {/* Social Media Icons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
          <IconButton component="a" href="https://twitter.com" target="_blank">
            <TwitterLogo size={24} color="white" />
          </IconButton>
          <IconButton component="a" href="https://facebook.com" target="_blank">
            <FacebookLogo size={24} color="white" />
          </IconButton>
          <IconButton component="a" href="https://instagram.com" target="_blank">
            <InstagramLogo size={24} color="white" />
          </IconButton>
        </Box>

        {/* Disclaimer */}
        <Typography variant="body2" sx={{ fontSize: '12px', opacity: 0.8, mb: 1 }}>
          © {new Date().getFullYear()} Day Trade Dak. Todos los derechos reservados.
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '12px', opacity: 0.8 }}>
          **Descargo de responsabilidad**: Day Trade Dak no es un asesor de inversiones, legal o fiscal registrado. Todo
          el contenido es solo para fines informativos y no debe considerarse asesoramiento financiero. El trading
          implica riesgos, y el rendimiento pasado no garantiza resultados futuros.
        </Typography>
      </Box>
    </Box>
  );
}
