'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Divider, 
  Paper,
  Stack,
  Tab,
  Tabs,
  Chip,
  IconButton,
  useTheme,
  alpha,
  Fade,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { 
  Shield, 
  FileText, 
  Lock, 
  CurrencyDollar, 
  Clock, 
  Info,
  CheckCircle,
  Warning,
  Globe,
  Scales,
  ArrowLeft,
  UserCheck,
  ShieldCheck,
  CreditCard,
  Prohibit,
  Key,
  Buildings,
  Envelope
} from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { useTheme as useAppTheme } from '@/components/theme/theme-provider';

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
      id={`legal-tabpanel-${index}`}
      aria-labelledby={`legal-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Fade in={true} timeout={600}>
          <Box>{children}</Box>
        </Fade>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `legal-tab-${index}`,
    'aria-controls': `legal-tabpanel-${index}`,
  };
}

export default function TermsAndPrivacy(): React.JSX.Element {
  const router = useRouter();
  const theme = useTheme();
  const { isDarkMode } = useAppTheme();
  const { t, i18n } = useTranslation();
  const [tabValue, setTabValue] = React.useState(0);

  // Check URL hash on mount to determine which tab to show
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash === '#privacy') {
        setTabValue(1);
      } else if (hash === '#terms') {
        setTabValue(0);
      }
    }
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    // Update URL hash when tab changes
    if (newValue === 0) {
      window.location.hash = 'terms';
    } else if (newValue === 1) {
      window.location.hash = 'privacy';
    }
  };

  const isSpanish = i18n.language === 'es';

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: isDarkMode 
        ? 'linear-gradient(180deg, #0a0a0a 0%, #141414 100%)'
        : 'linear-gradient(180deg, #f9fafb 0%, #ffffff 100%)',
      pt: 12,
      pb: 8
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 3 }}>
            <IconButton 
              onClick={() => router.back()} 
              sx={{ 
                position: 'absolute',
                left: 0,
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                '&:hover': {
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                }
              }}
            >
              <ArrowLeft size={24} />
            </IconButton>
            <Shield size={48} weight="duotone" color={theme.palette.primary.main} />
          </Stack>
          
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 800,
              fontSize: { xs: '2rem', md: '3rem' },
              mb: 2,
              background: isDarkMode 
                ? 'linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.7) 100%)'
                : 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('legal.title')}
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              color: theme.palette.text.secondary,
              fontWeight: 400,
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            {t('legal.subtitle')}
          </Typography>
        </Box>

        {/* Tabs */}
        <Paper 
          elevation={0}
          sx={{ 
            mb: 4,
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                py: 2,
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                }
              },
              '& .MuiTabs-indicator': {
                height: 3,
                backgroundColor: theme.palette.primary.main,
              }
            }}
          >
            <Tab 
              icon={<FileText size={20} />} 
              iconPosition="start" 
              label={t('legal.termsTab')} 
              {...a11yProps(0)} 
            />
            <Tab 
              icon={<Lock size={20} />} 
              iconPosition="start" 
              label={t('legal.privacyTab')} 
              {...a11yProps(1)} 
            />
          </Tabs>
        </Paper>

        {/* Terms of Service Content */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={4}>
            {/* Tools and Resources Section */}
            <Grid item xs={12}>
              <Card 
                elevation={0}
                sx={{
                  backgroundColor: isDarkMode ? 'rgba(22, 163, 74, 0.05)' : 'rgba(22, 163, 74, 0.02)',
                  border: `1px solid ${isDarkMode ? 'rgba(22, 163, 74, 0.2)' : 'rgba(22, 163, 74, 0.1)'}`,
                  borderRadius: 3,
                  overflow: 'hidden'
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        backgroundColor: isDarkMode ? 'rgba(22, 163, 74, 0.1)' : 'rgba(22, 163, 74, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Buildings size={28} weight="duotone" color={theme.palette.primary.main} />
                    </Box>
                    <Box>
                      <Typography variant="h5" fontWeight={700}>
                        {t('legal.terms.toolsTitle')}
                      </Typography>
                      <Chip 
                        label={t('legal.terms.educational')} 
                        size="small" 
                        color="primary" 
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </Stack>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    {t('legal.terms.toolsDescription')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Order Processing */}
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                  border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                  borderRadius: 3,
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3
                  }}
                >
                  <Clock size={24} weight="duotone" color="#3b82f6" />
                </Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  {t('legal.terms.orderProcessing.title')}
                </Typography>
                <Typography variant="subtitle2" color="primary" fontWeight={600} sx={{ mb: 2 }}>
                  {t('legal.terms.orderProcessing.subtitle')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {t('legal.terms.orderProcessing.description')}
                </Typography>
              </Paper>
            </Grid>

            {/* Pricing in USD */}
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                  border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                  borderRadius: 3,
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3
                  }}
                >
                  <CurrencyDollar size={24} weight="duotone" color="#10b981" />
                </Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  {t('legal.terms.pricing.title')}
                </Typography>
                <Typography variant="subtitle2" color="success.main" fontWeight={600} sx={{ mb: 2 }}>
                  {t('legal.terms.pricing.subtitle')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {t('legal.terms.pricing.description')}
                </Typography>
              </Paper>
            </Grid>

            {/* Important Policies */}
            <Grid item xs={12}>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
                {t('legal.terms.policies.title')}
              </Typography>
              <Grid container spacing={3}>
                {/* Cancellation Policy */}
                <Grid item xs={12} md={6}>
                  <Card 
                    elevation={0}
                    sx={{
                      height: '100%',
                      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                      border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[8],
                        borderColor: theme.palette.primary.main,
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            backgroundColor: isDarkMode ? 'rgba(251, 191, 36, 0.1)' : 'rgba(251, 191, 36, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <UserCheck size={20} weight="duotone" color="#fbbf24" />
                        </Box>
                        <Box>
                          <Typography variant="h6" fontWeight={700} gutterBottom>
                            {t('legal.terms.cancellation.title')}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 2 }}>
                            {t('legal.terms.cancellation.description')}
                          </Typography>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <CheckCircle size={16} weight="fill" color={theme.palette.success.main} />
                            <Typography variant="caption" color="success.main" fontWeight={600}>
                              {t('legal.terms.cancellation.benefit')}
                            </Typography>
                          </Stack>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Refund Policy */}
                <Grid item xs={12} md={6}>
                  <Card 
                    elevation={0}
                    sx={{
                      height: '100%',
                      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                      border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[8],
                        borderColor: theme.palette.error.main,
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <Prohibit size={20} weight="duotone" color="#ef4444" />
                        </Box>
                        <Box>
                          <Typography variant="h6" fontWeight={700} gutterBottom>
                            {t('legal.terms.refunds.title')}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 2 }}>
                            {t('legal.terms.refunds.description')}
                          </Typography>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Warning size={16} weight="fill" color={theme.palette.warning.main} />
                            <Typography variant="caption" color="warning.main" fontWeight={600}>
                              {t('legal.terms.refunds.warning')}
                            </Typography>
                          </Stack>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>

            {/* Additional Terms */}
            <Grid item xs={12}>
              <Divider sx={{ my: 4 }} />
              <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
                {t('legal.terms.additional.title')}
              </Typography>
              <Stack spacing={3}>
                {/* Risk Disclaimer */}
                <Paper 
                  elevation={0}
                  sx={{
                    p: 3,
                    backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.05)' : 'rgba(239, 68, 68, 0.02)',
                    border: `1px solid ${isDarkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)'}`,
                    borderRadius: 2,
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Warning size={24} weight="duotone" color={theme.palette.error.main} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700} color="error.main" gutterBottom>
                        {t('legal.terms.risk.title')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('legal.terms.risk.description')}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>

                {/* No Financial Advice */}
                <Paper 
                  elevation={0}
                  sx={{
                    p: 3,
                    backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.02)',
                    border: `1px solid ${isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'}`,
                    borderRadius: 2,
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Info size={24} weight="duotone" color={theme.palette.info.main} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700} color="info.main" gutterBottom>
                        {t('legal.terms.noAdvice.title')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('legal.terms.noAdvice.description')}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Stack>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Privacy Policy Content */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={4}>
            {/* Privacy Introduction */}
            <Grid item xs={12}>
              <Card 
                elevation={0}
                sx={{
                  backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.02)',
                  border: `1px solid ${isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'}`,
                  borderRadius: 3,
                  overflow: 'hidden'
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <ShieldCheck size={28} weight="duotone" color="#3b82f6" />
                    </Box>
                    <Box>
                      <Typography variant="h5" fontWeight={700}>
                        {t('legal.privacy.title')}
                      </Typography>
                      <Chip 
                        label={t('legal.privacy.commitment')} 
                        size="small" 
                        color="info" 
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </Stack>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    {t('legal.privacy.introduction')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Data Collection */}
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                  border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                  borderRadius: 3,
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      backgroundColor: isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <FileText size={24} weight="duotone" color="#8b5cf6" />
                  </Box>
                  <Typography variant="h6" fontWeight={700}>
                    {t('legal.privacy.dataCollection.title')}
                  </Typography>
                </Stack>
                <Stack spacing={2}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {t('legal.privacy.dataCollection.subtitle')}
                  </Typography>
                  <Stack spacing={1}>
                    {['name', 'email', 'payment', 'usage'].map((item) => (
                      <Stack key={item} direction="row" spacing={1} alignItems="center">
                        <CheckCircle size={16} weight="fill" color={theme.palette.success.main} />
                        <Typography variant="body2" color="text.secondary">
                          {t(`legal.privacy.dataCollection.${item}`)}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              </Paper>
            </Grid>

            {/* Data Usage */}
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                  border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                  borderRadius: 3,
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Key size={24} weight="duotone" color="#10b981" />
                  </Box>
                  <Typography variant="h6" fontWeight={700}>
                    {t('legal.privacy.dataUsage.title')}
                  </Typography>
                </Stack>
                <Stack spacing={2}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {t('legal.privacy.dataUsage.subtitle')}
                  </Typography>
                  <Stack spacing={1}>
                    {['service', 'communication', 'improvement', 'legal'].map((item) => (
                      <Stack key={item} direction="row" spacing={1} alignItems="center">
                        <CheckCircle size={16} weight="fill" color={theme.palette.primary.main} />
                        <Typography variant="body2" color="text.secondary">
                          {t(`legal.privacy.dataUsage.${item}`)}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              </Paper>
            </Grid>

            {/* Data Security */}
            <Grid item xs={12}>
              <Card 
                elevation={0}
                sx={{
                  backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.05)' : 'rgba(16, 185, 129, 0.02)',
                  border: `1px solid ${isDarkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)'}`,
                  borderRadius: 3,
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Lock size={28} weight="duotone" color="#10b981" />
                    </Box>
                    <Box>
                      <Typography variant="h5" fontWeight={700}>
                        {t('legal.privacy.security.title')}
                      </Typography>
                      <Chip 
                        label={t('legal.privacy.security.badge')} 
                        size="small" 
                        color="success" 
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </Stack>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 3 }}>
                    {t('legal.privacy.security.description')}
                  </Typography>
                  <Grid container spacing={2}>
                    {['encryption', 'access', 'monitoring', 'updates'].map((item) => (
                      <Grid item xs={12} sm={6} md={3} key={item}>
                        <Stack spacing={1} alignItems="center" textAlign="center">
                          <Box
                            sx={{
                              width: 64,
                              height: 64,
                              borderRadius: '50%',
                              backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <ShieldCheck size={28} weight="duotone" color="#10b981" />
                          </Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {t(`legal.privacy.security.${item}`)}
                          </Typography>
                        </Stack>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* User Rights */}
            <Grid item xs={12}>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
                {t('legal.privacy.rights.title')}
              </Typography>
              <Grid container spacing={3}>
                {['access', 'rectification', 'deletion', 'portability'].map((right, index) => (
                  <Grid item xs={12} sm={6} md={3} key={right}>
                    <Card 
                      elevation={0}
                      sx={{
                        height: '100%',
                        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                        border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: theme.shadows[8],
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3, textAlign: 'center' }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            backgroundColor: theme.palette.primary.main + '20',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 2
                          }}
                        >
                          <Typography variant="h6" fontWeight={700} color="primary">
                            {index + 1}
                          </Typography>
                        </Box>
                        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                          {t(`legal.privacy.rights.${right}.title`)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t(`legal.privacy.rights.${right}.description`)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Footer */}
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Divider sx={{ mb: 4 }} />
          <Stack spacing={3} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              {t('legal.lastUpdated')}: {new Date().toLocaleDateString(isSpanish ? 'es-ES' : 'en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Typography>
            
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip 
                icon={<Globe size={16} />} 
                label={isSpanish ? 'Español' : 'English'} 
                size="small" 
                variant="outlined"
              />
              <Chip 
                icon={<Envelope size={16} />} 
                label="support@daytradedak.com" 
                size="small" 
                variant="outlined"
                onClick={() => window.location.href = 'mailto:support@daytradedak.com'}
                sx={{ cursor: 'pointer' }}
              />
            </Stack>

            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/')}
              startIcon={<ArrowLeft size={20} />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                background: theme.palette.primary.main,
                '&:hover': {
                  background: theme.palette.primary.dark,
                }
              }}
            >
              {t('legal.backToHome')}
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}