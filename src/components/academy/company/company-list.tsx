'use client';

import React, { useEffect } from 'react';
import { Grid, CircularProgress, Typography } from '@mui/material';
import { useCompanyStore } from '@/store/company-store';
import CompanyCard from './company-card';
import { useQuery } from '@tanstack/react-query';
import { companyService } from '@/services/api/company.service';

const CompanyList: React.FC = () => {
  const { companies, setCompanies } = useCompanyStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const response = await companyService.searchCompanies();
      return response.companies;
    },
  });

  useEffect(() => {
    if (data) {
      const mappedCompanies = data.map((company) => ({
        symbol: company.symbol,
        name: company.name,
        currentPrice: company.currentPrice || 0,
      }));
      setCompanies(mappedCompanies);
    }
  }, [data, setCompanies]);

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">Error fetching companies.</Typography>;

  return (
    <Grid container spacing={2} sx={{ mt: 4 }}>
      {companies.map((company) => (
        <Grid item xs={12} sm={6} md={3} key={company.symbol}>
          <CompanyCard company={company} />
        </Grid>
      ))}
    </Grid>
  );
};

export default CompanyList;
