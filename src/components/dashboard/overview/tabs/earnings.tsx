// components/EarningsSection.tsx
'use client';

import React from 'react';
import { useCompanyStore } from '@/store/company-store';
import { Box, Card, Divider, Grid, Typography } from '@mui/material';

import { earningsCalendar } from '@/data/earnings';

import ImageWithFallback from '../image-with-fallback';

const DEFAULT_LOGO = '/assets/logo.png'; // Ensure this path is correct

export function EarningsSection(): React.JSX.Element {
  const { companies } = useCompanyStore();
  const favoriteSymbols = companies.map((company) => company.symbol);

  return (
    <Box sx={{ px: 1, textAlign: 'center' }}>
      {/* HEADER */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Most Anticipated Earnings Releases
      </Typography>
      <Typography variant="h6" color="text.secondary" mb={4}>
        For the week beginning February 17, 2025
      </Typography>

      {/* DAYS GRID */}
      <Grid container justifyContent="space-evenly">
        {earningsCalendar.map((day, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} lg={2}>
            <Card
              sx={{
                py: 2,
                background: 'var(--mui-palette-background-level1)',
                borderRadius: '8px',
                boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                minHeight: '100%',
                width: '250px',
              }}
            >
              {/* DAY HEADER */}
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                {day.day}
              </Typography>

              {/* FLEX CONTAINER FOR ALIGNMENT */}
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 3, px: 2, mt: 3 }}>
                {/* BEFORE OPEN LIST */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold" color="primary">
                    Before Open
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Grid container spacing={1}>
                    {day.beforeOpen?.map((company, idx) => {
                      const isFavorite = favoriteSymbols.includes(company.symbol);

                      return (
                        <Grid item key={idx} xs={12}>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              textAlign: 'center',
                              height: 80,
                              backgroundColor: isFavorite ? 'red' : 'transparent', // Highlight if favorite
                              borderRadius: isFavorite ? '8px' : 'none',
                              px: isFavorite ? 1 : 0,
                            }}
                          >
                            <Typography variant="caption" fontWeight="bold">
                              {company.symbol}
                            </Typography>
                            <ImageWithFallback
                              src={`https://financialmodelingprep.com/image-stock/${company.symbol}.png`}
                              alt={company.name}
                              width={80}
                              height={40}
                              fallbackSrc={DEFAULT_LOGO}
                            />
                            <Typography variant="body2">{company.name}</Typography>
                          </Box>
                          <Divider sx={{ my: 1 }} />
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>

                {/* AFTER CLOSE LIST */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold" color="secondary">
                    After Close
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Grid container spacing={1}>
                    {day.afterClose && day.afterClose.length > 0 ? (
                      day.afterClose.map((company, idx) => {
                        const isFavorite = favoriteSymbols.includes(company.symbol);

                        return (
                          <Grid
                            item
                            key={idx}
                            xs={12}
                            style={{
                              backgroundColor: isFavorite ? 'rgba(0, 0, 0, 0.3)' : 'transparent',
                              borderRadius: isFavorite ? '5px' : 'none',
                              color: isFavorite ? 'red' : 'inherit',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                height: 80,
                              }}
                            >
                              <Typography variant="caption" fontWeight="bold">
                                {company.symbol}
                              </Typography>
                              <ImageWithFallback
                                src={`https://financialmodelingprep.com/image-stock/${company.symbol}.png`}
                                alt={company.name}
                                width={80}
                                height={40}
                                fallbackSrc={DEFAULT_LOGO}
                              />
                              <Typography variant="body2">{company.name}</Typography>
                            </Box>
                            <Divider sx={{ my: 1 }} />
                          </Grid>
                        );
                      })
                    ) : (
                      <Box sx={{ height: 80 }} /> // Placeholder to keep alignment
                    )}
                  </Grid>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
