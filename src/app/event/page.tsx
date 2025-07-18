'use client';

import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button, Chip } from '@mui/material';
import { CalendarMonth, LocationOn, Group, AccessTime } from '@mui/icons-material';
import Link from 'next/link';
import { MainNavbar } from '@/components/landing/main-navbar';
import { useTranslation } from 'react-i18next';

const events = [
  {
    id: '1',
    title: 'Trading Masterclass 2025',
    date: 'March 15, 2025',
    time: '10:00 AM - 6:00 PM EST',
    location: 'Miami, FL',
    type: 'In-Person',
    price: '$497',
    spotsLeft: 12,
    description: 'Learn advanced trading strategies from professional traders',
    featured: true,
  },
  {
    id: '2',
    title: 'Options Trading Workshop',
    date: 'March 22, 2025',
    time: '2:00 PM - 4:00 PM EST',
    location: 'Online',
    type: 'Virtual',
    price: 'Free',
    spotsLeft: 'Unlimited',
    description: 'Introduction to options trading for beginners',
    featured: false,
  },
  {
    id: '3',
    title: 'Crypto Trading Summit',
    date: 'April 5, 2025',
    time: '9:00 AM - 5:00 PM EST',
    location: 'New York, NY',
    type: 'In-Person',
    price: '$297',
    spotsLeft: 25,
    description: 'Discover cryptocurrency trading opportunities and strategies',
    featured: false,
  },
];

export default function EventPage() {
  const { t: _t } = useTranslation();

  return (
    <>
      <MainNavbar />
      <Box sx={{ pt: 18, pb: 10, minHeight: '100vh' }}>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ mb: 2 }}>
            Upcoming Events
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" sx={{ mb: 6 }}>
            Join our exclusive trading events and workshops
          </Typography>

          <Grid container spacing={4}>
            {events.map((event) => (
              <Grid item xs={12} md={event.featured ? 12 : 6} key={event.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    ...(event.featured && {
                      background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.1) 0%, rgba(21, 128, 61, 0.05) 100%)',
                      border: '2px solid',
                      borderColor: 'primary.main',
                    })
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                      <Box>
                        {event.featured ? <Chip label="FEATURED" color="primary" size="small" sx={{ mb: 1 }} /> : null}
                        <Typography variant="h5" component="h2" gutterBottom>
                          {event.title}
                        </Typography>
                      </Box>
                      <Chip 
                        label={event.type} 
                        color={event.type === 'Virtual' ? 'info' : 'success'}
                        size="small"
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary" paragraph>
                      {event.description}
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarMonth sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">{event.date}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AccessTime sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">{event.time}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationOn sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">{event.location}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Group sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {typeof event.spotsLeft === 'number' 
                              ? `${event.spotsLeft} spots left` 
                              : event.spotsLeft}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" color="primary">
                        {event.price}
                      </Typography>
                      <Button
                        component={Link}
                        href={`/events/${event.id}`}
                        variant={event.featured ? 'contained' : 'outlined'}
                        color="primary"
                      >
                        Register Now
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Past Events Section */}
          <Box sx={{ mt: 8 }}>
            <Typography variant="h4" gutterBottom align="center">
              Past Events
            </Typography>
            <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
              Check out recordings and materials from our previous events
            </Typography>
            <Box sx={{ textAlign: 'center' }}>
              <Button variant="outlined" size="large">
                View Past Events
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}