'use client';

import React, { useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  Warning,
  TrendingDown,
  AccountBalance,
  Psychology,
  BarChart,
  ShowChart,
  MoneyOff,
  Info,
  CheckCircle,
  ErrorOutline,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { MainNavbar } from '@/components/landing/main-navbar';
import { ProfessionalFooter } from '@/components/landing/professional-footer';

const riskFactorIcons: Record<string, React.ElementType> = {
  volatility: TrendingDown,
  leverage: AccountBalance,
  psychological: Psychology,
  complexity: BarChart,
  pastPerformance: ShowChart,
  totalLoss: MoneyOff,
};

export default function RiskDisclosurePage() {
  const { t } = useTranslation('risk');

  // Generate risk factors from translations
  const riskFactors = useMemo(() => {
    const items = t('riskFactors.items', { returnObjects: true }) as any;
    return Object.keys(items).map(key => ({
      key,
      icon: riskFactorIcons[key] || Warning,
      title: items[key].title,
      description: items[key].description,
    }));
  }, [t]);

  // Get important points from translations
  const importantPoints = useMemo(() => {
    const points = t('importantPoints.items', { returnObjects: true }) as any;
    return Array.isArray(points) ? points : [];
  }, [t]);

  // Get recommendations from translations
  const recommendations = useMemo(() => {
    const items = t('recommendations.items', { returnObjects: true }) as any;
    return Object.keys(items).map(key => ({
      key,
      primary: items[key].primary,
      secondary: items[key].secondary,
    }));
  }, [t]);

  // Format the current date for the final notice
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <>
      <MainNavbar />
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pt: 16, pb: 8 }}>
        {/* Hero Section */}
        <Box
        sx={{
          background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
          color: 'white',
          py: 10,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Warning sx={{ fontSize: 48 }} />
            <Typography variant="h2" component="h1" sx={{ fontWeight: 700 }}>
              {t('hero.title')}
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ opacity: 0.9 }}>
            {t('hero.subtitle')}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Main Warning */}
        <Alert
          severity="error"
          icon={<ErrorOutline fontSize="large" />}
          sx={{ mb: 6, boxShadow: 2 }}
        >
          <AlertTitle sx={{ fontSize: '1.25rem', fontWeight: 600 }}>
            {t('mainWarning.title')}
          </AlertTitle>
          <Typography 
            variant="body1" 
            dangerouslySetInnerHTML={{ __html: t('mainWarning.content') }}
          />
        </Alert>

        {/* Introduction */}
        <Paper sx={{ p: 4, mb: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            {t('introduction.title')}
          </Typography>
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
            {t('introduction.paragraph1')}
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            {t('introduction.paragraph2')}
          </Typography>
        </Paper>

        {/* Risk Factors */}
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
          {t('riskFactors.title')}
        </Typography>
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {riskFactors.map((factor) => {
            const Icon = factor.icon;
            return (
              <Grid item xs={12} md={6} key={factor.key}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Icon sx={{ fontSize: 40, color: 'error.main', flexShrink: 0 }} />
                      <Box>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                          {factor.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {factor.description}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Important Points */}
        <Paper sx={{ p: 4, mb: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            {t('importantPoints.title')}
          </Typography>
          <List>
            {importantPoints.map((point: string, index: number) => (
              <ListItem key={index} sx={{ alignItems: 'flex-start' }}>
                <ListItemIcon>
                  <CheckCircle color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={point}
                  primaryTypographyProps={{
                    variant: 'body1',
                    sx: { lineHeight: 1.8 },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Specific Risks */}
        <Paper sx={{ p: 4, mb: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            {t('specificRisks.title')}
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'error.main' }}>
              {t('specificRisks.marketRisk.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('specificRisks.marketRisk.description')}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'error.main' }}>
              {t('specificRisks.leverageRisk.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('specificRisks.leverageRisk.description')}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'error.main' }}>
              {t('specificRisks.liquidityRisk.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('specificRisks.liquidityRisk.description')}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'error.main' }}>
              {t('specificRisks.technologyRisk.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('specificRisks.technologyRisk.description')}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'error.main' }}>
              {t('specificRisks.counterpartyRisk.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('specificRisks.counterpartyRisk.description')}
            </Typography>
          </Box>
        </Paper>

        {/* Disclaimer */}
        <Alert
          severity="warning"
          icon={<Info fontSize="large" />}
          sx={{ mb: 6 }}
        >
          <AlertTitle sx={{ fontWeight: 600 }}>
            {t('disclaimer.title')}
          </AlertTitle>
          <Typography variant="body2">
            {t('disclaimer.content')}
          </Typography>
        </Alert>

        {/* Recommendations */}
        <Paper sx={{ p: 4, bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            {t('recommendations.title')}
          </Typography>
          <List>
            {recommendations.map((item) => (
              <ListItem key={item.key}>
                <ListItemIcon>
                  <CheckCircle sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText
                  primary={item.primary}
                  secondary={item.secondary}
                  secondaryTypographyProps={{ sx: { color: 'rgba(255, 255, 255, 0.8)' } }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Final Notice */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {t('finalNotice.lastUpdate', { date: currentDate })}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {t('finalNotice.acknowledgment')}
          </Typography>
        </Box>
      </Container>
    </Box>
    <ProfessionalFooter />
    </>
  );
}