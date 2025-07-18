'use client';

import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button, Chip } from '@mui/material';
import { 
  School, 
  Psychology, 
  ShowChart, 
  AutoGraph, 
  MenuBook, 
  Group,
  Check,
  Star,
} from '@mui/icons-material';
import Link from 'next/link';

const products = [
  {
    id: 'mentorship',
    title: 'Elite Mentorship',
    subtitle: 'Personal 1-on-1 Coaching',
    icon: Group,
    price: 199,
    period: 'month',
    color: '#3b82f6',
    features: [
      'Weekly 1-on-1 sessions',
      'Custom trading strategies',
      'Direct chat support 24/7',
      'Portfolio optimization',
      'Risk management planning',
    ],
    highlighted: false,
    discount: null,
  },
  {
    id: 'class',
    title: 'Trading Academy',
    subtitle: 'Complete Education Program',
    icon: School,
    price: 99,
    period: 'month',
    color: '#10b981',
    features: [
      '100+ HD video lessons',
      'Live daily webinars',
      'Trading simulator access',
      'Certification program',
      'Community access',
    ],
    highlighted: true,
    discount: '20% OFF',
  },
  {
    id: 'analysis',
    title: 'Pro Analysis',
    subtitle: 'Real-time Market Signals',
    icon: ShowChart,
    price: 149,
    period: 'month',
    color: '#8b5cf6',
    features: [
      'Live trading signals',
      'Technical analysis',
      'Market reports daily',
      'SMS & email alerts',
      'AI-powered predictions',
    ],
    highlighted: false,
    discount: null,
  },
];

export function TradingProducts() {
  return (
    <Box className="bg-[#0d1117] py-20">
      <Container maxWidth="lg">
        <Box textAlign="center" mb={8}>
          <Typography variant="h3" className="text-white font-bold mb-4">
            Choose Your Trading Path
          </Typography>
          <Typography variant="h6" className="text-gray-400 max-w-2xl mx-auto">
            Professional tools and education designed for serious traders. 
            Start with any plan and upgrade anytime.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {products.map((product) => {
            const Icon = product.icon;
            return (
              <Grid item xs={12} md={4} key={product.id}>
                <Card 
                  className={`
                    bg-[#1a1f2e] border h-full relative overflow-hidden
                    ${product.highlighted 
                      ? 'border-green-500 shadow-lg shadow-green-500/20' 
                      : 'border-gray-800'
                    }
                    hover:border-gray-600 transition-all duration-300
                  `}
                  elevation={0}
                >
                  {product.highlighted ? <Box className="absolute top-0 right-0 bg-green-500 text-black px-3 py-1 text-xs font-bold">
                      MOST POPULAR
                    </Box> : null}
                  
                  {product.discount ? <Chip
                      label={product.discount}
                      size="small"
                      className="absolute top-4 left-4 bg-red-600 text-white font-bold"
                    /> : null}

                  <CardContent className="p-6">
                    <Box 
                      className="w-16 h-16 rounded-lg flex items-center justify-center mb-4"
                      sx={{ backgroundColor: `${product.color}20` }}
                    >
                      <Icon sx={{ color: product.color, fontSize: 32 }} />
                    </Box>

                    <Typography variant="h5" className="text-white font-bold mb-1">
                      {product.title}
                    </Typography>
                    <Typography variant="body2" className="text-gray-400 mb-4">
                      {product.subtitle}
                    </Typography>

                    <Box className="mb-6">
                      <Typography variant="h3" className="text-white font-bold">
                        ${product.price}
                        <Typography component="span" variant="body1" className="text-gray-400">
                          /{product.period}
                        </Typography>
                      </Typography>
                    </Box>

                    <Box className="space-y-3 mb-6">
                      {product.features.map((feature, _index) => (
                        <Box key={feature} className="flex items-start gap-2">
                          <Check className="text-green-400 text-sm mt-0.5" />
                          <Typography variant="body2" className="text-gray-300">
                            {feature}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    <Link href="/auth/sign-up" passHref>
                      <Button
                        fullWidth
                        variant={product.highlighted ? 'contained' : 'outlined'}
                        size="large"
                        sx={{
                          backgroundColor: product.highlighted ? product.color : 'transparent',
                          borderColor: product.color,
                          color: product.highlighted ? 'white' : product.color,
                          '&:hover': {
                            backgroundColor: product.highlighted 
                              ? product.color 
                              : `${product.color}20`,
                            borderColor: product.color,
                          },
                        }}
                      >
                        Get Started
                      </Button>
                    </Link>

                    <Typography 
                      variant="caption" 
                      className="text-gray-500 text-center block mt-3"
                    >
                      30-day money-back guarantee
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Additional products */}
        <Box className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-[#1a1f2e] border border-gray-800 hover:border-gray-700 transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <Box className="flex items-center gap-3">
                <Psychology className="text-orange-500" />
                <Box>
                  <Typography variant="subtitle2" className="text-white font-semibold">
                    Trading Psychology
                  </Typography>
                  <Typography variant="caption" className="text-gray-400">
                    Master your emotions
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h6" className="text-white font-bold">
                $79/mo
              </Typography>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1f2e] border border-gray-800 hover:border-gray-700 transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <Box className="flex items-center gap-3">
                <AutoGraph className="text-cyan-500" />
                <Box>
                  <Typography variant="subtitle2" className="text-white font-semibold">
                    Algo Trading
                  </Typography>
                  <Typography variant="caption" className="text-gray-400">
                    Automated strategies
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h6" className="text-white font-bold">
                $249/mo
              </Typography>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1f2e] border border-gray-800 hover:border-gray-700 transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <Box className="flex items-center gap-3">
                <MenuBook className="text-purple-500" />
                <Box>
                  <Typography variant="subtitle2" className="text-white font-semibold">
                    Trading Library
                  </Typography>
                  <Typography variant="caption" className="text-gray-400">
                    100+ eBooks & courses
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h6" className="text-white font-bold">
                $49/mo
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Trust badges */}
        <Box className="mt-12 flex flex-wrap justify-center gap-8 items-center">
          <Box className="flex items-center gap-2">
            <Star className="text-yellow-500" />
            <Typography variant="body2" className="text-gray-400">
              4.9/5 Rating (2,834 reviews)
            </Typography>
          </Box>
          <Typography variant="body2" className="text-gray-400">
            • 256-bit SSL Encryption
          </Typography>
          <Typography variant="body2" className="text-gray-400">
            • FINRA Registered
          </Typography>
          <Typography variant="body2" className="text-gray-400">
            • 24/7 Support
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}