'use client';

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { CircularProgress, IconButton, Paper, Typography } from '@mui/material';

import { Role } from '@/types/user';
import { paths } from '@/paths';
import ParticipantList from '@/components/admin/event/participants-list';
import { ArrowLeft } from '@phosphor-icons/react';
import Link from 'next/link';

export default function EventParticipantsPage(): React.JSX.Element {
  const router = useRouter();
  const { eventId } = useParams<{ eventId: string }>();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user && user.role !== Role.ADMIN) {
      router.replace(paths.dashboard.overview);
    }
  }, [user, router]);

  if (!user) {
    return <CircularProgress sx={{ mt: 10, mx: 'auto', display: 'block' }} />;
  }

  if (user.role !== Role.ADMIN) {
    return <p />;
  }

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      {/* Volver Icon */}
      <IconButton
        component={Link}
        href="/admin?tab=events"
        size="small"
        sx={{
          mb: 1,
          backgroundColor: '#f2f2f2',
          '&:hover': { backgroundColor: '#e0e0e0' },
          borderRadius: 1,
        }}
      >
        <ArrowLeft size={20} />
      </IconButton>

      {/* Title */}
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Participantes del Evento
      </Typography>

      {/* Participant Table */}
      <ParticipantList eventId={eventId} />
    </Paper>
  );
}
