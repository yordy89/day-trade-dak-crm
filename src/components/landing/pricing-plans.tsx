'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Chip,
  useTheme as useMuiTheme,
  FormControlLabel,
} from '@mui/material';
import {
  CheckCircle,
  Star,
  ArrowForward,
  TrendingUp,
  School,
  Groups,
  Analytics,
  Support,
  Close,
} from '@mui/icons-material';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/components/theme/theme-provider';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: PlanFeature[];
  highlighted?: boolean;
  badge?: string;
  color: string;
  icon: React.ElementType;
}

const getPlans = (t: any): PricingPlan[] => {
  const getFeatures = (planId: string) => {
    const features = t(`landing:pricing.plans.${planId}.features`, { returnObjects: true });
    if (Array.isArray(features)) {
      return features.map(feature => ({ text: feature, included: true }));
    }
    return [];
  };

  return [
    {
      id: 'basic',
      name: t('landing:pricing.plans.basic.name'),
      description: t('landing:pricing.plans.basic.description'),
      monthlyPrice: 39,
      yearlyPrice: 374,
      color: '#a3a3a3',
      icon: TrendingUp,
      features: [
        ...getFeatures('basic'),
        { text: t('landing:pricing.plans.professional.features.2'), included: false }, // Live trading sessions
        { text: t('landing:pricing.plans.elite.features.1'), included: false }, // 1-on-1 mentorship
        { text: t('landing:pricing.plans.professional.features.3'), included: false }, // Advanced strategies
        { text: t('landing:pricing.plans.elite.features.4'), included: false }, // API access
      ],
    },
    {
      id: 'professional',
      name: t('landing:pricing.plans.professional.name'),
      description: t('landing:pricing.plans.professional.description'),
      monthlyPrice: 99,
      yearlyPrice: 950,
      highlighted: true,
      badge: t('landing:pricing.plans.professional.badge'),
      color: '#16a34a',
      icon: School,
      features: [
        ...getFeatures('professional'),
        { text: t('landing:pricing.plans.elite.features.1'), included: false }, // 1-on-1 mentorship
        { text: 'Custom trading bots', included: false }, // Not in translations, keeping as is
      ],
    },
    {
      id: 'elite',
      name: t('landing:pricing.plans.elite.name'),
      description: t('landing:pricing.plans.elite.description'),
      monthlyPrice: 299,
      yearlyPrice: 2870,
      badge: t('landing:pricing.plans.elite.badge'),
      color: '#ef4444',
      icon: Groups,
      features: getFeatures('elite'),
    },
  ];
};

export function PricingPlans() {
  const muiTheme = useMuiTheme();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation(['landing']);
  const [isYearly, setIsYearly] = useState(true);
  const plans = getPlans(t);

  return (
    <Box
      sx={{
        py: 10,
        backgroundColor: muiTheme.palette.background.default,
        position: 'relative',
      }}
    >
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="overline"
            sx={{
              color: '#16a34a',
              fontWeight: 600,
              letterSpacing: 1.5,
              mb: 2,
              display: 'block',
            }}
          >
            {t('landing:pricing.label')}
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 3,
              color: muiTheme.palette.text.primary,
            }}
          >
            {t('landing:pricing.title')}{' '}
            <span style={{ 
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {t('landing:pricing.titleHighlight')}
            </span>
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: muiTheme.palette.text.secondary,
              maxWidth: 700,
              mx: 'auto',
              lineHeight: 1.8,
              mb: 4,
            }}
          >
            {t('landing:pricing.subtitle')}
          </Typography>

          {/* Billing Toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: !isYearly ? 600 : 400,
                color: !isYearly ? muiTheme.palette.text.primary : muiTheme.palette.text.secondary,
              }}
            >
              {t('landing:pricing.billing.monthly')}
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={isYearly}
                  onChange={(e) => setIsYearly(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#16a34a',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#16a34a',
                    },
                  }}
                />
              }
              label=""
            />
            <Typography
              variant="body1"
              sx={{
                fontWeight: isYearly ? 600 : 400,
                color: isYearly ? muiTheme.palette.text.primary : muiTheme.palette.text.secondary,
              }}
            >
              {t('landing:pricing.billing.yearly')}
            </Typography>
            <Chip
              label={t('landing:pricing.billing.save')}
              size="small"
              sx={{
                backgroundColor: '#16a34a',
                color: 'white',
                fontWeight: 600,
              }}
            />
          </Box>
        </Box>

        {/* Pricing Cards */}
        <Grid container spacing={4} alignItems="stretch">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            const monthlyEquivalent = isYearly ? Math.round(plan.yearlyPrice / 12) : plan.monthlyPrice;

            return (
              <Grid item xs={12} md={4} key={plan.id}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    backgroundColor: muiTheme.palette.background.paper,
                    border: '2px solid',
                    borderColor: plan.highlighted
                      ? plan.color
                      : isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                    borderRadius: 3,
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    transform: plan.highlighted ? 'scale(1.05)' : 'scale(1)',
                    '&:hover': {
                      transform: plan.highlighted ? 'scale(1.07)' : 'scale(1.02)',
                      borderColor: plan.color,
                    },
                  }}
                >
                  {plan.badge ? <Box
                      sx={{
                        position: 'absolute',
                        top: -12,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: plan.highlighted ? '#16a34a' : '#ef4444',
                        color: 'white',
                        px: 3,
                        py: 0.5,
                        borderRadius: 20,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      {plan.badge}
                    </Box> : null}

                  <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* Header */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                      <Icon sx={{ fontSize: 48, color: plan.color, mb: 2 }} />
                      <Typography variant="h4" fontWeight="700" sx={{ mb: 1 }}>
                        {plan.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {plan.description}
                      </Typography>
                    </Box>

                    {/* Pricing */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
                        <Typography variant="h3" fontWeight="800">
                          ${isYearly ? monthlyEquivalent : price}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                          {t('landing:pricing.plans.basic.period')}
                        </Typography>
                      </Box>
                      {isYearly ? <Typography variant="body2" color="text.secondary">
                          ${price} {t('landing:pricing.plans.basic.billedAnnually')}
                        </Typography> : null}
                    </Box>

                    {/* Features */}
                    <List sx={{ flex: 1, mb: 4 }}>
                      {plan.features.map((feature, _index) => (
                        <ListItem key={_index} sx={{ px: 0, py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            {feature.included ? (
                              <CheckCircle sx={{ fontSize: 20, color: '#16a34a' }} />
                            ) : (
                              <Close sx={{ fontSize: 20, color: muiTheme.palette.text.disabled }} />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={feature.text}
                            primaryTypographyProps={{
                              variant: 'body2',
                              color: feature.included ? 'text.primary' : 'text.disabled',
                              sx: { textDecoration: feature.included ? 'none' : 'line-through' },
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>

                    {/* CTA */}
                    <Button
                      component={Link}
                      href="/auth/sign-up"
                      fullWidth
                      variant={plan.highlighted ? 'contained' : 'outlined'}
                      size="large"
                      endIcon={<ArrowForward />}
                      sx={{
                        ...(plan.highlighted
                          ? {
                              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                              color: 'white',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)',
                              },
                            }
                          : {
                              borderColor: plan.color,
                              color: plan.color,
                              '&:hover': {
                                borderColor: plan.color,
                                backgroundColor: `${plan.color}10`,
                              },
                            }),
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      {t('landing:pricing.cta')}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Additional Info */}
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Support sx={{ fontSize: 40, color: '#16a34a', mb: 2 }} />
              <Typography variant="h6" fontWeight="600" sx={{ mb: 1 }}>
                {t('landing:pricing.guarantees.support.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('landing:pricing.guarantees.support.description')}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Star sx={{ fontSize: 40, color: '#16a34a', mb: 2 }} />
              <Typography variant="h6" fontWeight="600" sx={{ mb: 1 }}>
                {t('landing:pricing.guarantees.moneyBack.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('landing:pricing.guarantees.moneyBack.description')}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Analytics sx={{ fontSize: 40, color: '#16a34a', mb: 2 }} />
              <Typography variant="h6" fontWeight="600" sx={{ mb: 1 }}>
                {t('landing:pricing.guarantees.cancel.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('landing:pricing.guarantees.cancel.description')}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}