'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Typography } from '@mui/material';

import GoogleMap from '../../../components/admin/common/GoogleMap';

const ThankYouPage = () => {
  const router = useRouter();

  const eventLocation = 'JW Marriott Tampa Water Street, 510 Water St, Tampa, FL 33602, USA';
  const eventDate = new Date('2024-12-20T18:00:00');

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
        <Typography variant="h6">
          🕒 {eventDate.toLocaleDateString()} –{' '}
          {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Typography>

        {/* ✅ Google Map */}
        <Box mt={3}>
          <GoogleMap address={eventLocation} height="250px" />
        </Box>
      </Box>

      <Button variant="contained" color="primary" sx={{ mt: 5 }} onClick={() => router.push('/')}>
        Volver a Inicio
      </Button>
    </Box>
  );
};

export default ThankYouPage;
