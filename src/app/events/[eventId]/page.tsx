'use client';

import React, { useState } from 'react';
import RouterLink from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { Box, Button, Container, Fade, Grid, Paper, Stack, Typography } from '@mui/material';
import { CheckCircle, XCircle } from '@phosphor-icons/react';
import { useQuery } from '@tanstack/react-query';

import { paths } from '@/paths';
import API from '@/lib/axios';
import GoogleMap from '@/components/admin/common/googleMap';
import { DynamicLogo } from '@/components/core/logo';

import EventRegistrationForm from '../components/event-registration-form';
import VipRegistrationForm from '../components/vip-registration-form';

interface Event {
  _id: string;
  name: string;
  description?: string;
  date: string;
  vipPrice?: number;
  location?: string;
  bannerImage?: string;
}

export default function EventPage() {
  const params = useParams<{ eventId: string }>();
  const searchParams = useSearchParams();
  const promoCode = searchParams.get('promo') || undefined;
  const [registrationType, setRegistrationType] = useState<'free' | 'vip' | null>(promoCode ? 'vip' : null);

  const { data: event, isLoading } = useQuery({
    queryKey: ['event-details', params.eventId],
    queryFn: async () => {
      const res = await API.get(`/events/${params.eventId}`);
      return res.data;
    },
    enabled: Boolean(params.eventId),
  });

  if (isLoading) return <Typography>Loading...</Typography>;
  if (!event) return <Typography>Event not found</Typography>;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#000',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-block', px: 4, pt: 4 }}>
        <DynamicLogo colorDark="light" colorLight="dark" height={70} width={100} />
      </Box>

      {/* Background animation */}
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(0,0,0,1) 100%)',
          zIndex: 0,
          animation: 'pulse 10s infinite',
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.02)' },
            '100%': { transform: 'scale(1)' },
          },
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={20} alignItems="flex-start">
          {/* Left section: Name, Date, Address, Map */}
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Typography variant="h3" fontWeight="bold" color="white">
                {event.name}
                <Typography variant="h6" fontWeight="bold" style={{ color: 'rgba(255,255,255, 0.7)' }}>
                  {event.description}
                </Typography>
              </Typography>
              <Typography variant="body1" color="white" style={{marginTop: '25px'}}>
                📅 Sábado, 23 de agosto de 2025
              </Typography>
              <Typography variant="body1" color="white">
                ⏰ <span style={{fontWeight: 'bold'}}>VIP:</span> 8:30 AM – 10:00 AM | <span style={{fontWeight: 'bold'}}>Evento General:</span> 10:00 AM – 2:00 PM
              </Typography>

              <Typography variant="body1" color="white" style={{marginTop: '25px'}}>
                📍 {event.location || '4200 George J.Bean Parkway,Tampa, FL 33607, USA'}
              </Typography>

              <GoogleMap address={event.location || ''} height="250px" />
            </Stack>
          </Grid>

          {/* Right section: Form and Benefits */}
          <Grid item xs={12} md={6}>
            <Fade in>
              <Paper
                elevation={6}
                sx={{
                  p: 4,
                  backgroundColor: 'white',
                  color: 'black',
                  borderRadius: 3,
                  position: 'relative',
                }}
              >
                {registrationType !== null && (
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => setRegistrationType(null)}
                    sx={{ position: 'absolute', top: 8, left: 8 }}
                  >
                    ⬅️ Volver
                  </Button>
                )}

                <Stack spacing={3}>
                  {registrationType === null ? (
                    <Stack spacing={2}>
                      <Typography variant="h5" fontWeight="bold" textAlign="center">
                        ¿Cómo quieres registrarte?
                      </Typography>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={() => setRegistrationType('free')}
                      >
                        🎟️ Registrarme Gratis
                      </Button>
                      {event.vipPrice && event.vipPrice > 0 && (
                        <Button
                          fullWidth
                          variant="outlined"
                          color="secondary"
                          size="large"
                          onClick={() => setRegistrationType('vip')}
                        >
                          ⭐ Acceso VIP (${event.vipPrice})
                        </Button>
                      )}
                    </Stack>
                  ) : (
                    <>
                      {registrationType === 'free' && (
                        <EventRegistrationForm
                          eventId={event._id}
                          onRegistered={() => {
                            window.location.href = '/events/thank-you';
                          }}
                        />
                      )}
                      {registrationType === 'vip' && (
                        <VipRegistrationForm
                          eventId={event._id}
                          //   priceId={'price_1RJKtNJ1acFkbhNIBNsLFT4p'} // This is dev
                          priceId="price_1RLV02E0taYR7njRQ0uGNiMa"
                          promoCode={promoCode}
                        />
                      )}
                    </>
                  )}
                </Stack>
              </Paper>
            </Fade>

            {/* Benefits below the form */}
            <Box sx={{ mt: 5 }}>
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
                Beneficios de Registro
              </Typography>

              <Grid container spacing={2} alignItems="center" sx={{ textAlign: 'center' }}>
                <Grid item xs={6}></Grid>
                <Grid item xs={3}>
                  <Typography variant="h6" fontWeight="bold">
                    Gratis
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="h6" fontWeight="bold">
                    VIP
                  </Typography>
                </Grid>

                {[
                  { feature: 'Acceso al evento completo (09 AM - 2 PM)', free: true, vip: true },
                  { feature: 'Sesión VIP “Inversor con Propósito” (9 AM - 10 AM)', free: false, vip: true },
                  { feature: 'Libro físico firmado por el Mentor', free: false, vip: true },
                  { feature: 'Charla privada: Cómo piensa un mentor real', free: false, vip: true },
                  { feature: 'Foto privada con fondo VIP del evento', free: false, vip: true },
                  { feature: 'Charla “De Principiante a Rentable”', free: true, vip: true },
                  { feature: 'Taller interactivo: ¿Invertirías o No?', free: true, vip: true },
                  { feature: 'Testimonios en vivo y transformaciones reales', free: true, vip: true },
                  { feature: 'Presentación del Plan de Acción final', free: true, vip: true },
                  { feature: 'Oferta exclusiva al final del evento', free: true, vip: true },
                ].map((item, idx) => (
                  <React.Fragment key={idx}>
                    <Grid item xs={6} sx={{ textAlign: 'left' }}>
                      <Typography>{item.feature}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      {item.free ? (
                        <CheckCircle size={24} color="#00FF00" weight="bold" />
                      ) : (
                        <XCircle size={24} color="#FF0000" weight="bold" />
                      )}
                    </Grid>
                    <Grid item xs={3}>
                      {item.vip ? (
                        <CheckCircle size={24} color="#00FF00" weight="bold" />
                      ) : (
                        <XCircle size={24} color="#FF0000" weight="bold" />
                      )}
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
