'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Grid,
  useTheme,
  Button,
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  TrendingDown,
  Refresh,
  Flag,
  Schedule,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import API from '@/lib/axios';

interface EconomicEvent {
  actual: number | null;
  country: string;
  estimate: number | null;
  event: string;
  impact: string;
  previous: number | null;
  time: string;
  unit: string;
}

const IMPACT_COLORS = {
  high: 'error',
  medium: 'warning',
  low: 'info',
} as const;

const IMPORTANT_EVENTS = [
  'GDP',
  'CPI',
  'Unemployment',
  'Interest Rate',
  'NFP',
  'Retail Sales',
  'PMI',
  'Consumer Confidence',
  'Inflation',
  'FOMC',
];

export function EconomicCalendar() {
  const theme = useTheme();
  const [selectedCountry, setSelectedCountry] = useState<string>('all');

  const { data: events, isLoading, error, refetch } = useQuery({
    queryKey: ['economicCalendar'],
    queryFn: async () => {
      // Get events for the next 7 days
      const from = format(new Date(), 'yyyy-MM-dd');
      const to = format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
      
      const response = await API.get(`/market/economic-calendar?from=${from}&to=${to}`);
      return response.data as EconomicEvent[];
    },
    retry: 2,
  });

  const formatValue = (value: number | null, unit: string) => {
    if (value === null) return '-';
    
    switch (unit) {
      case '%':
        return `${value}%`;
      case 'K':
        return `${value}K`;
      case 'M':
        return `${value}M`;
      case 'B':
        return `${value}B`;
      default:
        return value.toString();
    }
  };

  const getResultColor = (actual: number | null, estimate: number | null) => {
    if (actual === null || estimate === null) return 'default';
    
    // For most indicators, higher is better
    if (actual > estimate) return 'success.main';
    if (actual < estimate) return 'error.main';
    return 'text.primary';
  };

  const isImportantEvent = (eventName: string) => {
    return IMPORTANT_EVENTS.some(important => 
      eventName.toLowerCase().includes(important.toLowerCase())
    );
  };

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">
          Failed to load economic calendar. Please check your connection and try again.
        </Alert>
      </Box>
    );
  }

  const filteredEvents = events?.filter(event => 
    selectedCountry === 'all' || event.country === selectedCountry
  ) || [];

  const countries = events ? [...new Set(events.map(e => e.country))] : [];

  return (
    <Box p={3}>
      {/* Header */}
      <Box mb={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h5" fontWeight="bold">
              Economic Calendar
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Important economic events and indicators
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} textAlign="right">
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => refetch()}
              disabled={isLoading}
            >
              Refresh
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Country Filter */}
      {countries.length > 0 && (
        <Box mb={3}>
          <Grid container spacing={1}>
            <Grid item>
              <Chip
                label="All Countries"
                onClick={() => setSelectedCountry('all')}
                color={selectedCountry === 'all' ? 'primary' : 'default'}
                variant={selectedCountry === 'all' ? 'filled' : 'outlined'}
              />
            </Grid>
            {countries.map(country => (
              <Grid item key={country}>
                <Chip
                  label={country}
                  onClick={() => setSelectedCountry(country)}
                  color={selectedCountry === country ? 'primary' : 'default'}
                  variant={selectedCountry === country ? 'filled' : 'outlined'}
                  icon={<Flag />}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Events Table */}
      {isLoading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : filteredEvents.length === 0 ? (
        <Alert severity="info">
          No economic events scheduled for the selected period.
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: theme.palette.action.hover }}>
                <TableCell>Time</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Event</TableCell>
                <TableCell align="center">Impact</TableCell>
                <TableCell align="right">Previous</TableCell>
                <TableCell align="right">Estimate</TableCell>
                <TableCell align="right">Actual</TableCell>
                <TableCell align="center">Result</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEvents.map((event, index) => {
                const hasResult = event.actual !== null;
                const isBeat = hasResult && event.estimate !== null && event.actual !== null && event.actual > event.estimate;
                const isMiss = hasResult && event.estimate !== null && event.actual !== null && event.actual < event.estimate;
                const isImportant = isImportantEvent(event.event);

                return (
                  <TableRow
                    key={index}
                    sx={{
                      bgcolor: isImportant ? alpha(theme.palette.warning.main, 0.05) : 'transparent',
                      '&:hover': {
                        bgcolor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Schedule fontSize="small" color="action" />
                        <Typography variant="body2">
                          {event.time || 'TBD'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Flag fontSize="small" color="action" />
                        <Typography variant="body2">
                          {event.country}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        fontWeight={isImportant ? 'bold' : 'normal'}
                      >
                        {event.event}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={event.impact}
                        size="small"
                        color={IMPACT_COLORS[event.impact.toLowerCase() as keyof typeof IMPACT_COLORS] || 'default'}
                        variant="filled"
                      />
                    </TableCell>
                    <TableCell align="right">
                      {formatValue(event.previous, event.unit)}
                    </TableCell>
                    <TableCell align="right">
                      {formatValue(event.estimate, event.unit)}
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        fontWeight={hasResult ? 'bold' : 'normal'}
                        color={getResultColor(event.actual, event.estimate)}
                      >
                        {formatValue(event.actual, event.unit)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {hasResult ? (
                        isBeat ? (
                          <Chip
                            label="Beat"
                            color="success"
                            size="small"
                            icon={<TrendingUp />}
                          />
                        ) : isMiss ? (
                          <Chip
                            label="Miss"
                            color="error"
                            size="small"
                            icon={<TrendingDown />}
                          />
                        ) : (
                          <Chip
                            label="In Line"
                            variant="outlined"
                            size="small"
                          />
                        )
                      ) : (
                        <Chip
                          label="Pending"
                          variant="outlined"
                          size="small"
                        />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Legend */}
      <Box mt={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Impact Legend
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Chip label="High" color="error" size="small" />
                  <Typography variant="body2" color="text.secondary">
                    Major market impact expected
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Chip label="Medium" color="warning" size="small" />
                  <Typography variant="body2" color="text.secondary">
                    Moderate market impact
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Chip label="Low" color="info" size="small" />
                  <Typography variant="body2" color="text.secondary">
                    Minor market impact
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Box mt={3}>
              <Typography variant="subtitle2" gutterBottom>
                Key Economic Indicators:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • GDP (Gross Domestic Product) - Economic growth measure<br />
                • CPI (Consumer Price Index) - Inflation indicator<br />
                • NFP (Non-Farm Payrolls) - Employment data<br />
                • FOMC - Federal Reserve policy decisions<br />
                • PMI (Purchasing Managers Index) - Economic activity
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

function alpha(color: string, opacity: number): string {
  // Simple alpha implementation
  return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
}