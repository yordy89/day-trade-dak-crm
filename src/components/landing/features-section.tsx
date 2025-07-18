'use client';

import React from 'react';
import { Grid, Typography, Box, Container } from '@mui/material';
import {
  BarChart,
  Notifications,
  PhoneIphone,
  CloudDone,
  Security,
  Speed,
  Groups,
  Timeline,
} from '@mui/icons-material';

const features = [
  {
    icon: BarChart,
    title: 'Advanced Charting',
    description: 'Professional-grade charts with 100+ technical indicators and drawing tools',
  },
  {
    icon: Notifications,
    title: 'Real-time Alerts',
    description: 'Get instant notifications for price movements, news, and trading opportunities',
  },
  {
    icon: PhoneIphone,
    title: 'Mobile Trading',
    description: 'Trade on the go with our powerful iOS and Android mobile applications',
  },
  {
    icon: CloudDone,
    title: 'Cloud Sync',
    description: 'Your strategies and watchlists sync seamlessly across all devices',
  },
  {
    icon: Security,
    title: 'Bank-level Security',
    description: '256-bit encryption and two-factor authentication to protect your data',
  },
  {
    icon: Speed,
    title: 'Lightning Fast',
    description: 'Execute trades in milliseconds with our optimized trading infrastructure',
  },
  {
    icon: Groups,
    title: 'Community',
    description: 'Connect with thousands of traders, share ideas, and learn together',
  },
  {
    icon: Timeline,
    title: 'Performance Analytics',
    description: 'Track your trading performance with detailed analytics and reports',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white dark:bg-gray-800">
      <Container maxWidth="lg">
        <Box textAlign="center" mb={8}>
          <Typography variant="h3" component="h2" fontWeight="bold" gutterBottom>
            Everything You Need to Succeed
          </Typography>
          <Typography variant="h6" color="text.secondary" maxWidth="600px" mx="auto">
            Our platform provides all the tools and resources professional traders need
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box
                  textAlign="center"
                  p={3}
                  height="100%"
                  className="group hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-300"
                >
                  <Box
                    display="inline-flex"
                    p={2}
                    borderRadius={2}
                    className="bg-blue-100 dark:bg-blue-900 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors"
                    mb={2}
                  >
                    <Icon className="text-blue-600 dark:text-blue-400" fontSize="large" />
                  </Box>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </section>
  );
}