'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Typography } from '@mui/material';

import GoogleMap from '@/components/common/GoogleMap';

const ThankYouPage = () => {
  const router = useRouter();

  const eventLocation = '4200 George J.Bean Parkway,Tampa, FL 33607, USA';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#000',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        textAlign: 'center',
      }}
    >
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        🎉 ¡Gracias por registrarte!
      </Typography>
      <Typography variant="body1" gutterBottom>
        Hemos recibido tu registro. ¡Nos vemos en el evento!
      </Typography>

      {/* Event Info */}
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          📍 {eventLocation}
        </Typography>
        <Typography variant="body1" color="white" style={{ marginTop: '25px' }}>
          📅 Sábado, 23 de agosto de 2025
        </Typography>
        <Typography variant="body1" color="white">
          ⏰ <span style={{ fontWeight: 'bold' }}>VIP:</span> 8:30 AM – 10:00 AM |{' '}
          <span style={{ fontWeight: 'bold' }}>Evento General:</span> 10:00 AM – 2:00 PM
        </Typography>

        {/* ✅ Google Map */}
        <Box mt={3}>
          <GoogleMap height="250px" />
        </Box>
      </Box>

      <Button variant="contained" color="primary" sx={{ mt: 5 }} onClick={() => router.push('/')}>
        Volver a Inicio
      </Button>
    </Box>
  );
};

export default ThankYouPage;
