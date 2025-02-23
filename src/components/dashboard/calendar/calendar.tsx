'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useCompanyStore } from '@/store/company-store';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
  TextField,
} from '@mui/material';

import { earningsCalendar } from '@/data/earnings';
import API from '@/lib/axios';

interface CalendarEvent {
  id?: string;
  title: string;
  start: string;
  end: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  allDay?: boolean;
  type: 'global' | 'personal' | 'earnings';
}

export function Calendar(): React.JSX.Element {
  const { companies } = useCompanyStore();
  const { user } = useAuthStore();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({});
  const [dialogOpen, setDialogOpen] = useState(false);

  // **Fetch events from API**
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await API.get('/calendar');
        const personalEvents = response.data.map((e: any) => ({
          id: e._id, // ✅ Ensure events have an ID from MongoDB
          ...e,
        }));

        // **Fetch earnings events for favorite companies**
        const favoriteSymbols = companies.map((c) => c.symbol);
        const earningsEvents = earningsCalendar.flatMap((day) =>
          [...day.beforeOpen, ...day.afterClose]
            .filter((company) => favoriteSymbols.includes(company.symbol))
            .map((company) => ({
              id: `earnings-${company.symbol}`,
              title: `Earnings: ${company.name}`,
              start: `2025-02-${day.day === 'Monday' ? '17' : day.day === 'Tuesday' ? '18' : day.day === 'Wednesday' ? '19' : day.day === 'Thursday' ? '20' : '21'}`,
              end: `2025-02-${day.day === 'Monday' ? '17' : day.day === 'Tuesday' ? '18' : day.day === 'Wednesday' ? '19' : day.day === 'Thursday' ? '20' : '21'}`,
              allDay: true,
              type: 'earnings',
              startDate: `2025-02-${day.day === 'Monday' ? '17' : day.day === 'Tuesday' ? '18' : day.day === 'Wednesday' ? '19' : day.day === 'Thursday' ? '20' : '21'}`,
              endDate: `2025-02-${day.day === 'Monday' ? '17' : day.day === 'Tuesday' ? '18' : day.day === 'Wednesday' ? '19' : day.day === 'Thursday' ? '20' : '21'}`,
            }))
        );

        setEvents([...personalEvents, ...earningsEvents]);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    void fetchEvents();
  }, [companies]);

  // ✅ Tooltip for event details
  const handleEventDidMount = (info: any) => {
    info.el.setAttribute('title', `${info.event.title} (${info.event.start})`);
  };

  // ✅ Click on a date to create an event
  const handleDateClick = (info: any) => {
    setNewEvent({
      title: '',
      start: info.dateStr,
      end: info.dateStr,
      allDay: true,
      type: 'personal',
    });
    setDialogOpen(true);
  };

  // ✅ Click on an event to **edit**
  const handleEventClick = (info: any) => {
    const clickedEvent = events.find((e) => e.id === info.event.id);
    if (clickedEvent?.type === 'personal') {
      setSelectedEvent(clickedEvent);
      setNewEvent(clickedEvent);
      setDialogOpen(true);
    }
  };

  // ✅ Handle dragging an event
  const handleEventDrop = async (info: any) => {
    const updatedEvent = {
      start: info.event.start.toISOString(),
      end: info.event.end ? info.event.end.toISOString() : info.event.start.toISOString(),
      allDay: info.event.allDay,
    };

    try {
      await API.put(`/calendar/${info.event.id}`, updatedEvent);
      setEvents(events.map((e) => (e.id === info.event.id ? { ...e, ...updatedEvent } : e)));
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  // ✅ Handle resizing an event
  const handleEventResize = async (info: any) => {
    const updatedEvent = {
      start: info.event.start.toISOString(),
      end: info.event.end ? info.event.end.toISOString() : info.event.start.toISOString(),
    };

    try {
      await API.put(`/calendar/${info.event.id}`, updatedEvent);
      setEvents(events.map((e) => (e.id === info.event.id ? { ...e, ...updatedEvent } : e)));
    } catch (error) {
      console.error('Error resizing event:', error);
    }
  };

  // ✅ **Save or Update Event**
  const handleSaveEvent = async () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end) return;

    try {
      if (selectedEvent) {
        await API.put(`/calendar/${selectedEvent.id}`, newEvent);
        setEvents(events.map((e) => (e.id === selectedEvent.id ? { ...e, ...newEvent } : e)));
      } else {
        const response = await API.post('/calendar', {
          ...newEvent,
          userId: user?._id,
        });
        setEvents([...events, response.data]);
      }

      setDialogOpen(false);
      setNewEvent({});
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  return (
    <Box sx={{ height: '85vh' }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        editable
        selectable
        droppable
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        height="100%"
        eventDidMount={handleEventDidMount}
      />

      {/* Event Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{selectedEvent ? 'Edit Event' : 'New Event'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Event Title" value={newEvent.title || ''} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
          <TextField fullWidth type="datetime-local" label="Start Date & Time" value={newEvent.start || ''} onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })} />
          <TextField fullWidth type="datetime-local" label="End Date & Time" value={newEvent.end || ''} onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })} />
          <FormControlLabel control={<Switch checked={newEvent.allDay || false} onChange={(e) => setNewEvent({ ...newEvent, allDay: e.target.checked })} />} label="All Day Event" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEvent} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
