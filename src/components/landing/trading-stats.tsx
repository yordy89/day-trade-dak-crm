'use client';

import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import CountUp from 'react-countup';

const stats = [
  {
    value: 125467,
    suffix: '+',
    label: 'Active Traders',
    description: 'Join our global community',
  },
  {
    value: 2.5,
    prefix: '$',
    suffix: 'B+',
    label: 'Daily Volume',
    description: 'Average trading volume',
  },
  {
    value: 0.012,
    suffix: 's',
    decimals: 3,
    label: 'Avg Execution',
    description: 'Lightning-fast trades',
  },
  {
    value: 99.9,
    suffix: '%',
    decimals: 1,
    label: 'Uptime',
    description: 'Platform reliability',
  },
];

export function TradingStats() {
  return (
    <Box className="bg-gradient-to-b from-[#0d1117] to-[#0a0e17] py-20">
      <Container maxWidth="lg">
        <Box textAlign="center" mb={10}>
          <Typography variant="h3" className="text-white font-bold mb-4">
            Trusted by Traders Worldwide
          </Typography>
          <Typography variant="h6" className="text-gray-400 max-w-2xl mx-auto">
            Our numbers speak for themselves. Join thousands of successful traders 
            on the most reliable platform.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Box 
                className="text-center p-6 rounded-lg bg-[#1a1f2e] border border-gray-800 hover:border-gray-700 transition-all"
              >
                <Typography 
                  variant="h2" 
                  className="text-white font-bold mb-2"
                  component="div"
                >
                  <CountUp
                    start={0}
                    end={stat.value}
                    duration={2.5}
                    decimals={stat.decimals || 0}
                    prefix={stat.prefix || ''}
                    suffix={stat.suffix || ''}
                    enableScrollSpy
                    scrollSpyOnce
                  />
                </Typography>
                <Typography variant="h6" className="text-green-400 font-semibold mb-1">
                  {stat.label}
                </Typography>
                <Typography variant="body2" className="text-gray-500">
                  {stat.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Partners/Integrations */}
        <Box className="mt-16">
          <Typography variant="body1" className="text-center text-gray-500 mb-8">
            INTEGRATED WITH LEADING EXCHANGES & BROKERS
          </Typography>
          <Box className="flex flex-wrap justify-center items-center gap-8 opacity-50">
            {/* Placeholder for partner logos */}
            {['NYSE', 'NASDAQ', 'CME', 'ICE', 'EUREX'].map((exchange) => (
              <Box
                key={exchange}
                className="text-gray-400 font-semibold text-xl tracking-wider"
              >
                {exchange}
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}