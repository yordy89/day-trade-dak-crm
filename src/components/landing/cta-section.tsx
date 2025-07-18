'use client';

import React from 'react';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { ArrowForward, CheckCircle } from '@mui/icons-material';
import Link from 'next/link';

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" component="h2" fontWeight="bold" gutterBottom>
              Ready to Start Your Trading Journey?
            </Typography>
            <Typography variant="h6" paragraph className="opacity-90">
              Join thousands of successful traders and get instant access to all our tools and resources.
            </Typography>
            
            <Box mt={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CheckCircle />
                    <Typography>30-day money-back guarantee</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CheckCircle />
                    <Typography>No credit card required</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CheckCircle />
                    <Typography>Cancel anytime</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CheckCircle />
                    <Typography>24/7 customer support</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center"
              sx={{ border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Start Your Free Trial
              </Typography>
              <Typography variant="body1" paragraph className="opacity-90">
                Get full access to all features for 7 days. No commitment.
              </Typography>
              
              <Box mt={4}>
                <Link href="/auth/sign-up" passHref>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    fullWidth
                    sx={{
                      backgroundColor: 'white',
                      color: 'primary.main',
                      py: 2,
                      fontSize: '1.1rem',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.9)',
                      },
                    }}
                  >
                    Start Free Trial
                  </Button>
                </Link>
                
                <Typography variant="body2" className="mt-3 opacity-70">
                  Already have an account?{' '}
                  <Link href="/auth/sign-in" className="text-white underline">
                    Sign in
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </section>
  );
}