'use client';

import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Divider, Paper, Tab, Tabs } from '@mui/material';
import UserList from '../../components/admin/user/user-list';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation'; // ✅ App Router
import { Role } from '@/types/user';
import { paths } from '@/paths';

const adminTabs = [
  { label: 'Usuarios', component: <UserList /> },
  // You can add more admin tabs here later
];

export default function AdminPanel():  React.JSX.Element {
  const [selectedTab, setSelectedTab] = useState(0);
  const currentTab = adminTabs[selectedTab];

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
    return <p></p>;
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
