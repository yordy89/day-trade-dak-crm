// components/EarningsSection.tsx
'use client';

import React, { useEffect } from 'react';
import { useCompanyStore } from '@/store/company-store';
import { CircularProgress, Grid, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

import API from '@/lib/axios';

import { Budget } from '../budget';
import { LatestOrders } from '../latest-orders';
import { LatestProducts } from '../latest-products';
import { Sales } from '../sales';
import { TasksProgress } from '../tasks-progress';
import { TotalCustomers } from '../total-customers';
import { TotalProfit } from '../total-profit';
import { Traffic } from '../traffic';

export function AcademySection(): React.JSX.Element {
  const { setCompanies } = useCompanyStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const response = await API.get('/company');
      return response.data;
    },
  });

  useEffect(() => {
    if (data) {
      setCompanies(data);
    }
  }, [data, setCompanies]);

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">Error fetching companies.</Typography>;

  return (
    <Grid container spacing={3}>
      <Grid lg={3} sm={6} xs={12}>
        <Budget diff={12} trend="up" sx={{ height: '100%' }} value="$24k" />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalCustomers diff={16} trend="down" sx={{ height: '100%' }} value="1.6k" />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TasksProgress sx={{ height: '100%' }} value={75.5} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalProfit sx={{ height: '100%' }} value="$15k" />
      </Grid>
      <Grid lg={8} xs={12}>
        <Sales
          chartSeries={[
            { name: 'This year', data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20] },
            { name: 'Last year', data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13] },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={4} md={6} xs={12}>
        <Traffic chartSeries={[63, 15, 22]} labels={['Desktop', 'Tablet', 'Phone']} sx={{ height: '100%' }} />
      </Grid>
      <Grid lg={4} md={6} xs={12}>
        <LatestProducts
          products={[
            {
              id: 'PRD-005',
              name: 'Soja & Co. Eucalyptus',
              image: '/assets/product-5.png',
              updatedAt: dayjs().subtract(18, 'minutes').subtract(5, 'hour').toDate(),
            },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={8} md={12} xs={12}>
        <LatestOrders
          orders={[
            {
              id: 'ORD-007',
              customer: { name: 'Ekaterina Tankova' },
              amount: 30.5,
              status: 'pending',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
    </Grid>
  );
}
