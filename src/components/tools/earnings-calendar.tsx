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
  ToggleButton,
  ToggleButtonGroup,
  Alert,
  Button,
  Grid,
  useTheme,
} from '@mui/material';
import {
  CalendarMonth,
  TrendingUp,
  TrendingDown,
  Assessment,
  Today,
  DateRange,
  Refresh,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import API from '@/lib/axios';

interface EarningsItem {
  date: string;
  epsActual: number | null;
  epsEstimate: number | null;
  hour: string;
  quarter: number;
  revenueActual: number | null;
  revenueEstimate: number | null;
  symbol: string;
  year: number;
}

export function EarningsCalendar() {
  const theme = useTheme();
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'custom'>('week');
  const [startDate, setStartDate] = useState<Date>(startOfWeek(new Date()));
  const [endDate, setEndDate] = useState<Date>(endOfWeek(new Date()));

  const getDateRange = () => {
    switch (dateRange) {
      case 'today': {
        const today = new Date();
        return {
          from: format(today, 'yyyy-MM-dd'),
          to: format(today, 'yyyy-MM-dd'),
        };
      }
      case 'week':
        return {
          from: format(startOfWeek(new Date()), 'yyyy-MM-dd'),
          to: format(endOfWeek(new Date()), 'yyyy-MM-dd'),
        };
      case 'custom':
        return {
          from: format(startDate, 'yyyy-MM-dd'),
          to: format(endDate, 'yyyy-MM-dd'),
        };
    }
  };

  const { data: earnings, isLoading, error, refetch } = useQuery({
    queryKey: ['earnings', dateRange, startDate, endDate],
    queryFn: async () => {
      const { from, to } = getDateRange();
      const response = await API.get(`/market/earnings?from=${from}&to=${to}`);
      return response.data as EarningsItem[];
    },
    retry: 2,
  });

  const formatRevenue = (revenue: number) => {
    if (revenue >= 1000000000) {
      return `$${(revenue / 1000000000).toFixed(2)}B`;
    } else if (revenue >= 1000000) {
      return `$${(revenue / 1000000).toFixed(2)}M`;
    }
    return `$${revenue.toFixed(2)}`;
  };

  const getEpsDifference = (actual: number, estimate: number) => {
    const diff = actual - estimate;
    const percent = (diff / Math.abs(estimate)) * 100;
    return { diff, percent };
  };

  const groupByDate = (items: EarningsItem[]) => {
    const grouped = items.reduce<Record<string, EarningsItem[]>>((acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = [];
      }
      acc[item.date].push(item);
      return acc;
    }, {});
    return grouped;
  };

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">
          Failed to load earnings calendar. Please check your connection and try again.
        </Alert>
      </Box>
    );
  }

  const groupedEarnings = earnings ? groupByDate(earnings) : {};

  return (
    <Box p={3}>
      {/* Controls */}
      <Box mb={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <ToggleButtonGroup
              value={dateRange}
              exclusive
              onChange={(e, newValue) => newValue && setDateRange(newValue)}
              fullWidth
            >
              <ToggleButton value="today">
                <Today sx={{ mr: 1 }} />
                Today
              </ToggleButton>
              <ToggleButton value="week">
                <DateRange sx={{ mr: 1 }} />
                This Week
              </ToggleButton>
              <ToggleButton value="custom">
                <CalendarMonth sx={{ mr: 1 }} />
                Custom
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>

          {dateRange === 'custom' && (
            <>
              <Grid item xs={12} md={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(newValue) => newValue && setStartDate(newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(newValue) => newValue && setEndDate(newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Grid>
            </>
          )}

          <Grid item xs={12} md={dateRange === 'custom' ? 2 : 8}>
            <Button
              fullWidth
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

      {/* Earnings Data */}
      {isLoading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : Object.keys(groupedEarnings).length === 0 ? (
        <Alert severity="info">
          No earnings announcements found for the selected period.
        </Alert>
      ) : (
        Object.entries(groupedEarnings)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([date, items]) => (
            <Box key={date} mb={4}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                {format(new Date(date), 'EEEE, MMMM d, yyyy')}
              </Typography>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: theme.palette.action.hover }}>
                      <TableCell>Symbol</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell align="right">EPS Estimate</TableCell>
                      <TableCell align="right">EPS Actual</TableCell>
                      <TableCell align="center">Result</TableCell>
                      <TableCell align="right">Revenue Est.</TableCell>
                      <TableCell align="right">Revenue Act.</TableCell>
                      <TableCell>Quarter</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((item, index) => {
                      const hasResults = item.epsActual !== null;
                      let epsBeat = false;
                      let epsResult = null;

                      if (hasResults && item.epsEstimate !== null && item.epsActual !== null) {
                        epsBeat = item.epsActual > item.epsEstimate;
                        epsResult = getEpsDifference(item.epsActual, item.epsEstimate);
                      }

                      return (
                        <TableRow
                          key={`${item.symbol}-${index}`}
                          sx={{
                            '&:hover': {
                              bgcolor: theme.palette.action.hover,
                            },
                          }}
                        >
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">
                              {item.symbol}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={item.hour || 'TBD'}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="right">
                            {item.epsEstimate !== null ? `$${item.epsEstimate.toFixed(2)}` : '-'}
                          </TableCell>
                          <TableCell align="right">
                            {hasResults ? (
                              <Typography
                                variant="body2"
                                fontWeight="bold"
                                color={epsBeat ? 'success.main' : 'error.main'}
                              >
                                ${item.epsActual?.toFixed(2)}
                              </Typography>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell align="center">
                            {hasResults && epsResult ? (
                              <Chip
                                label={epsBeat ? 'Beat' : 'Miss'}
                                color={epsBeat ? 'success' : 'error'}
                                size="small"
                                icon={epsBeat ? <TrendingUp /> : <TrendingDown />}
                              />
                            ) : (
                              <Chip
                                label="Pending"
                                variant="outlined"
                                size="small"
                              />
                            )}
                          </TableCell>
                          <TableCell align="right">
                            {item.revenueEstimate !== null
                              ? formatRevenue(item.revenueEstimate)
                              : '-'}
                          </TableCell>
                          <TableCell align="right">
                            {item.revenueActual !== null
                              ? formatRevenue(item.revenueActual)
                              : '-'}
                          </TableCell>
                          <TableCell>
                            Q{item.quarter} {item.year}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ))
      )}

      {/* Summary Stats */}
      {earnings && earnings.length > 0 && (
        <Box mt={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Total Earnings
                  </Typography>
                  <Typography variant="h4">
                    {earnings.length}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Reported
                  </Typography>
                  <Typography variant="h4">
                    {earnings.filter((e) => e.epsActual !== null).length}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Beats
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {
                      earnings.filter(
                        (e) =>
                          e.epsActual !== null &&
                          e.epsEstimate !== null &&
                          e.epsActual > e.epsEstimate
                      ).length
                    }
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Misses
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {
                      earnings.filter(
                        (e) =>
                          e.epsActual !== null &&
                          e.epsEstimate !== null &&
                          e.epsActual < e.epsEstimate
                      ).length
                    }
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
}