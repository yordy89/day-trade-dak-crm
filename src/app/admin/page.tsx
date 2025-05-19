'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { Box, CircularProgress, Divider, Paper, Tab, Tabs } from '@mui/material';

import { Role } from '@/types/user';
import { paths } from '@/paths';

import EventList from '../../components/admin/event/event-list';
import UserList from '../../components/admin/user/user-list';

const adminTabs = [
  { label: 'Usuarios', component: <UserList /> },
  { label: 'Eventos', component: <EventList /> },
];

export default function AdminPanel(): React.JSX.Element {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'events' ? 1 : 0;
  const [selectedTab, setSelectedTab] = useState(initialTab);
  const currentTab = adminTabs[selectedTab]; // ✅ fix

  const user = useAuthStore((state) => state.user);
  const router = useRouter();

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
      <Tabs value={selectedTab} onChange={(_, newVal) => setSelectedTab(newVal)} centered>
        {adminTabs.map((tab, idx) => (
          <Tab key={tab.label} label={tab.label} value={idx} />
        ))}
      </Tabs>

      <Divider sx={{ my: 2 }} />
      <Box>{currentTab.component}</Box>
    </Paper>
  );
}
