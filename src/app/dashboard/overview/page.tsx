'use client';

import * as React from 'react';
import { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { Box, Button, Divider, Paper, Tab, Tabs, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

import { overviewTabs } from '@/components/dashboard/overview/tabs/tabs-config';
import { paths } from '@/paths'; // ✅ Update this with the correct subscription page path

export default function OverviewClient(): React.JSX.Element {
  const [selectedTab, setSelectedTab] = useState(0);
  const userSubscriptions = useAuthStore((state) => state.user?.subscriptions ?? []); // ✅ Prevents undefined issue
  const router = useRouter(); // ✅ Allows navigation to subscription page

  // Ensure selectedTab doesn't go out of range (after logout)
  const validSelectedTab = selectedTab < overviewTabs.length ? selectedTab : 0;
  const selectedTabConfig = overviewTabs[validSelectedTab];

  const isSelectedTabRestricted =
    selectedTabConfig.requiredSubscription &&
    !userSubscriptions.includes(selectedTabConfig.requiredSubscription);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue); // ✅ Allow clicking on any tab
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Tabs */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderRadius: '8px',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Tabs
          value={validSelectedTab}
          onChange={handleTabChange} // ✅ Now allows clicking on restricted tabs
          centered
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: 'primary.main',
              height: '4px',
              borderRadius: '4px',
            },
          }}
        >
          {overviewTabs.map((tab, index) => {

            return (
              <Tab
                key={index}
                label={tab.label}
                value={index} // ✅ Ensures correct tab switching
                sx={{
                  fontWeight: validSelectedTab === index ? 'bold' : 'normal',
                  color:
                    validSelectedTab === index
                      ? 'primary.main' // ✅ Apply primary color even for restricted selected tab
                      : 'text.secondary',
                  bgcolor:
                    validSelectedTab === index
                      ? 'rgba(0, 123, 255, 0.1)' // ✅ Apply background even for restricted selected tab
                      : 'transparent',
                  borderRadius: '8px 8px 0 0',
                  px: 3,
                  py: 1.5,
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  '&:hover': {
                    color: 'primary.dark',
                  },
                }}
              />
            );
          })}
        </Tabs>
      </Box>

      {/* Divider for better separation */}
      <Divider sx={{ my: 2 }} />

      {/* Show Upgrade Message if Restricted */}
      {isSelectedTabRestricted ? (
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" color="error">
            This feature requires a {selectedTabConfig.requiredSubscription} subscription.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push(paths.dashboard.subscriptions.plans)} // ✅ Update with correct subscription path
            sx={{ ml: 2 }}
          >
            Subscribe Now
          </Button>
        </Box>
      ) : (
        // Render the selected tab content
        <Box sx={{ p: 3 }}>{selectedTabConfig.component}</Box>
      )}
    </Paper>
  );
}
