import React from 'react';
import { CircularProgress, Container, Typography } from '@mui/material';

export default async function CompanyDetail({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  const company: any = {
    name: 'Company Name',
    symbol: symbol,
    marketCap: '1B',
    description: 'Company description',
  };
  if (!company) return <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />;

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        {company.name} ({company.symbol})
      </Typography>
      <Typography variant="h6">Market Cap: ${company.marketCap}</Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        {company.description}
      </Typography>
    </Container>
  );
}
