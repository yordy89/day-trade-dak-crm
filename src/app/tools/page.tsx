'use client';

import React from 'react';
import { Box, Container, Typography, Tab, Tabs, Paper, useTheme, alpha } from '@mui/material';
import { ShowChart, CalendarMonth, TrendingUp, Assessment, AccountBalance } from '@mui/icons-material';
import { MainNavbar } from '@/components/landing/main-navbar';
import { MarketOverview } from '@/components/tools/market-overview';
import { EarningsCalendar } from '@/components/tools/earnings-calendar';
import { EconomicCalendar } from '@/components/tools/economic-calendar';
import { StockWatchlist } from '@/components/tools/stock-watchlist';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tools-tabpanel-${index}`}
      aria-labelledby={`tools-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `tools-tab-${index}`,
    'aria-controls': `tools-tabpanel-${index}`,
  };
}

export default function ToolsPage() {
  const [value, setValue] = React.useState(0);
  const theme = useTheme();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <MainNavbar />
      <Box sx={{ 
        minHeight: '100vh', 
        bgcolor: 'background.default', 
        pt: 12,
        pb: 6,
      }}>
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom 
              fontWeight="bold"
              sx={{ 
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Professional Trading Tools
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Real-time market data, earnings calendar, and economic insights
            </Typography>
          </Box>

          <Paper 
            sx={{ 
              width: '100%', 
              mb: 3,
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: theme.shadows[2],
            }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              aria-label="trading tools tabs"
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.02),
                '& .MuiTab-root': {
                  minHeight: 72,
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  '&.Mui-selected': {
                    bgcolor: 'background.paper',
                  },
                },
              }}
            >
              <Tab 
                label="Market Overview" 
                icon={<ShowChart />} 
                iconPosition="start"
                {...a11yProps(0)}
              />
              <Tab 
                label="Earnings Calendar" 
                icon={<CalendarMonth />} 
                iconPosition="start"
                {...a11yProps(1)}
              />
              <Tab 
                label="Economic Calendar" 
                icon={<AccountBalance />} 
                iconPosition="start"
                {...a11yProps(2)}
              />
              <Tab 
                label="My Watchlist" 
                icon={<TrendingUp />} 
                iconPosition="start"
                {...a11yProps(3)}
              />
            </Tabs>
          </Paper>

          <Paper 
            sx={{ 
              borderRadius: 2,
              overflow: 'hidden',
              minHeight: '600px',
            }}
          >
            <TabPanel value={value} index={0}>
              <MarketOverview />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <EarningsCalendar />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <EconomicCalendar />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <StockWatchlist />
            </TabPanel>
          </Paper>
        </Container>
      </Box>
    </>
  );
}