'use client';

import React from 'react';
import { Container, Typography, Box, Card, CardContent, Avatar, Rating, Grid } from '@mui/material';
import { FormatQuote } from '@mui/icons-material';

const testimonials = [
  {
    name: 'Michael Rodriguez',
    role: 'Professional Day Trader',
    avatar: '/avatars/avatar1.jpg',
    rating: 5,
    text: 'DayTradeDak transformed my trading career. The mentorship program gave me the confidence and skills to become consistently profitable.',
  },
  {
    name: 'Sarah Chen',
    role: 'Swing Trader',
    avatar: '/avatars/avatar2.jpg',
    rating: 5,
    text: 'The technical analysis tools and real-time alerts have helped me catch moves I would have missed before. Best investment I\'ve made.',
  },
  {
    name: 'David Thompson',
    role: 'Options Trader',
    avatar: '/avatars/avatar3.jpg',
    rating: 5,
    text: 'The psychology training was a game-changer. Learning to control emotions and stick to my plan increased my win rate dramatically.',
  },
  {
    name: 'Maria Garcia',
    role: 'Forex Trader',
    avatar: '/avatars/avatar4.jpg',
    rating: 5,
    text: 'From beginner to profitable trader in 6 months. The structured courses and community support made all the difference.',
  },
  {
    name: 'James Wilson',
    role: 'Crypto Trader',
    avatar: '/avatars/avatar5.jpg',
    rating: 5,
    text: 'The risk management strategies I learned here saved my account multiple times. Can\'t imagine trading without these tools now.',
  },
  {
    name: 'Emma Davis',
    role: 'Part-time Trader',
    avatar: '/avatars/avatar6.jpg',
    rating: 5,
    text: 'Perfect for someone with a full-time job. The mobile app lets me trade during lunch breaks and the alerts keep me informed.',
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 bg-gray-50 dark:bg-gray-900">
      <Container maxWidth="lg">
        <Box textAlign="center" mb={8}>
          <Typography variant="h3" component="h2" fontWeight="bold" gutterBottom>
            Success Stories from Real Traders
          </Typography>
          <Typography variant="h6" color="text.secondary" maxWidth="600px" mx="auto">
            Join thousands of traders who have transformed their financial future with DayTradeDak
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card
                elevation={0}
                className="h-full hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
              >
                <CardContent className="p-6">
                  <Box display="flex" alignItems="center" mb={3}>
                    <FormatQuote className="text-blue-500 text-4xl transform rotate-180" />
                  </Box>
                  
                  <Typography variant="body1" paragraph className="text-gray-700 dark:text-gray-300">
                    {testimonial.text}
                  </Typography>
                  
                  <Box display="flex" alignItems="center" mt={4}>
                    <Avatar
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      sx={{ width: 48, height: 48, mr: 2 }}
                    >
                      {testimonial.name[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="600">
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box mt={2}>
                    <Rating value={testimonial.rating} readOnly size="small" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box textAlign="center" mt={6}>
          <Typography variant="h5" fontWeight="600" gutterBottom>
            Join 10,000+ Successful Traders
          </Typography>
          <Box display="flex" justifyContent="center" gap={4} mt={2}>
            <Box>
              <Typography variant="h4" fontWeight="bold" color="primary">
                95%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Customer Satisfaction
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="bold" color="primary">
                $2.5M+
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average Daily Volume
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="bold" color="primary">
                24/7
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Support Available
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </section>
  );
}