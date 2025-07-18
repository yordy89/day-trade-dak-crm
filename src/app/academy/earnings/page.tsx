'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
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
  useTheme,
  alpha,
  TextField,
} from '@mui/material';
import {
  CalendarMonth,
  TrendingUp,
  TrendingDown,
  Assessment,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, startOfWeek, endOfWeek, addDays, subDays } from 'date-fns';
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

export default function EarningsCalendar() {
  const theme = useTheme();
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'custom'>('week');
  const [startDate, setStartDate] = useState<Date>(startOfWeek(new Date()));
  const [endDate, setEndDate] = useState<Date>(endOfWeek(new Date()));

  const getDateRange = () => {
    switch (dateRange) {
      case 'today':
        const today = new Date();
        return {
          from: format(today, 'yyyy-MM-dd'),
          to: format(today, 'yyyy-MM-dd'),
        };
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

  const { data: earnings, isLoading } = useQuery({
    queryKey: ['earnings', dateRange, startDate, endDate],
    queryFn: async () => {
      const { from, to } = getDateRange();
      const response = await API.get(`/market/earnings?from=${from}&to=${to}`);
      return response.data as EarningsItem[];
    },
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
    const grouped = items.reduce((acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = [];
      }
      acc[item.date].push(item);
      return acc;
    }, {} as Record<string, EarningsItem[]>);

    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
          Earnings Calendar
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Track upcoming and recent earnings reports
        </Typography>

        {/* Date Range Selector */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
          <ToggleButtonGroup
            value={dateRange}
            exclusive
            onChange={(_, value) => value && setDateRange(value)}
            size="small"
          >
            <ToggleButton value="today">Today</ToggleButton>
            <ToggleButton value="week">This Week</ToggleButton>
            <ToggleButton value="custom">Custom Range</ToggleButton>
          </ToggleButtonGroup>

          {dateRange === 'custom' && (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(date) => date && setStartDate(date)}
                  slotProps={{
                    textField: { size: 'small' },
                  }}
                />
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(date) => date && setEndDate(date)}
                  slotProps={{
                    textField: { size: 'small' },
                  }}
                />
              </Box>
            </LocalizationProvider>
          )}
        </Box>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : earnings && earnings.length > 0 ? (
        groupByDate(earnings).map(([date, items]) => (
          <Card key={date} sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <CalendarMonth color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                </Typography>
                <Chip label={`${items.length} Reports`} size="small" />
              </Box>

              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Symbol</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell align="right">EPS Estimate</TableCell>
                      <TableCell align="right">EPS Actual</TableCell>
                      <TableCell align="right">Difference</TableCell>
                      <TableCell align="right">Revenue Est.</TableCell>
                      <TableCell align="right">Revenue Act.</TableCell>
                      <TableCell>Quarter</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((item, index) => {
                      const hasReported = item.epsActual !== null;
                      const epsBeat = hasReported && item.epsActual! > (item.epsEstimate || 0);
                      const epsDiff = hasReported && item.epsEstimate
                        ? getEpsDifference(item.epsActual!, item.epsEstimate)
                        : null;

                      return (
                        <TableRow key={`${item.symbol}-${index}`}>
                          <TableCell>
                            <Typography fontWeight={600}>{item.symbol}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={item.hour || 'TBD'}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="right">
                            {item.epsEstimate ? `$${item.epsEstimate.toFixed(2)}` : '-'}
                          </TableCell>
                          <TableCell align="right">
                            {hasReported ? (
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                <Typography fontWeight={600}>
                                  ${item.epsActual!.toFixed(2)}
                                </Typography>
                                {epsBeat ? (
                                  <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
                                ) : (
                                  <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />
                                )}
                              </Box>
                            ) : (
                              <Typography color="text.secondary">Pending</Typography>
                            )}
                          </TableCell>
                          <TableCell align="right">
                            {epsDiff ? (
                              <Typography
                                color={epsDiff.diff >= 0 ? 'success.main' : 'error.main'}
                                fontWeight={600}
                              >
                                {epsDiff.diff >= 0 ? '+' : ''}{epsDiff.diff.toFixed(2)}
                                ({epsDiff.percent >= 0 ? '+' : ''}{epsDiff.percent.toFixed(1)}%)
                              </Typography>
                            ) : '-'}
                          </TableCell>
                          <TableCell align="right">
                            {item.revenueEstimate ? formatRevenue(item.revenueEstimate) : '-'}
                          </TableCell>
                          <TableCell align="right">
                            {item.revenueActual ? (
                              <Typography fontWeight={600}>
                                {formatRevenue(item.revenueActual)}
                              </Typography>
                            ) : '-'}
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
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Assessment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No earnings reports found for the selected period
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}