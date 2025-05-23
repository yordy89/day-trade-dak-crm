'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import API from '@/lib/axios';

interface Event {
  _id: string;
  name: string;
  description?: string;
  date: string;
  vipPrice?: number;
  location?: string;
  bannerImage?: string;
}

const EventList = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({});

  const { data: events } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      const res = await API.get('/events');
      return res.data;
    },
  });

  const createEvent = useMutation({
    mutationFn: async (eventData: Partial<Event>) => {
      await API.post('/events/create', eventData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      setIsDialogOpen(false);
      setNewEvent({});
    },
  });

  const handleCreateEvent = () => {
    if (!newEvent.name || !newEvent.date) return;
    createEvent.mutate(newEvent);
  };

  return (
    <Box>
      <Button variant="contained" onClick={() => setIsDialogOpen(true)} sx={{ mb: 3 }}>
        ➕ Crear Nuevo Evento
      </Button>

      <Stack spacing={3}>
        {events?.map((event: Event) => {
          const isUpcoming = new Date(event.date) > new Date();

          return (
            <Card key={event._id} variant="outlined" sx={{ position: 'relative' }}>
              <CardContent>
                {/* Status at top-right */}
                <Typography
                  variant="body2"
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 16,
                    color: isUpcoming ? 'green' : 'red',
                    fontWeight: 'bold',
                  }}
                >
                  {isUpcoming ? '🟢 Activo' : '🔴 Finalizado'}
                </Typography>

                {/* Event Details */}
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  {event.name}
                </Typography>

                <Typography variant="body2" color="text.secondary" mb={1}>
                  {event.description}
                </Typography>

                <Typography variant="body2">📅 {new Date(event.date).toLocaleString()}</Typography>
                {event.vipPrice ? <Typography variant="body2">💵 VIP: ${event.vipPrice}</Typography> : null}
                {event.location ? <Typography variant="body2">📍 {event.location}</Typography> : null}

                {/* Actions bottom-right */}
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-start', gap: 1 }}>
                  <Button component={Link} href={`/events/${event._id}/participants`} variant="outlined" size="small">
                    👥 Ver Participantes
                  </Button>
                  {/* Future buttons can be added here */}
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Stack>

      {/* Dialog to Create Event */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Crear Nuevo Evento</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Nombre del Evento"
            fullWidth
            value={newEvent.name || ''}
            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
          />
          <TextField
            label="Descripción"
            fullWidth
            multiline
            value={newEvent.description || ''}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
          />
          <TextField
            label="Fecha y Hora"
            type="datetime-local"
            fullWidth
            value={newEvent.date || ''}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Precio VIP (opcional)"
            type="number"
            fullWidth
            value={newEvent.vipPrice || ''}
            onChange={(e) => setNewEvent({ ...newEvent, vipPrice: parseFloat(e.target.value) })}
          />
          <TextField
            label="Ubicación (opcional)"
            fullWidth
            value={newEvent.location || ''}
            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreateEvent} disabled={createEvent.isPending}>
            {createEvent.isPending ? 'Creando...' : 'Crear Evento'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EventList;
