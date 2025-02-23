'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import axios from 'axios';

const categories = ['Today', 'Tomorrow', 'This Week'];

export function EconomicCalendar() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<any>([]);

  useEffect(() => {
    void fetchEvents(categories[selectedTab]);
  }, [selectedTab]);

  const fetchEvents = async (category: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/economic-calendar?category=${category.toLowerCase()}`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching economic calendar:', error);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ width: '100%', textAlign: 'center', mt: 3 }}>
      {/* Tabs for selecting category */}
      <Tabs value={selectedTab} onChange={(_, newValue) => setSelectedTab(newValue)} centered>
        {categories.map((category, index) => (
          <Tab key={index} label={category} />
        ))}
      </Tabs>

      {/* Table for economic events */}
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell>Importance</TableCell>
              <TableCell>Event</TableCell>
              <TableCell>Actual</TableCell>
              <TableCell>Forecast</TableCell>
              <TableCell>Previous</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              events.map((event: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{event.time}</TableCell>
                  <TableCell>{event.currency}</TableCell>
                  <TableCell>{'⭐'.repeat(event.importance)}</TableCell>
                  <TableCell>{event.event}</TableCell>
                  <TableCell>{event.actual || '-'}</TableCell>
                  <TableCell>{event.forecast || '-'}</TableCell>
                  <TableCell>{event.previous || '-'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
