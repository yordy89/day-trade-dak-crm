'use client';

import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  Grid,
  Card,
  CardContent,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Gavel,
  Shield,
  CheckCircle,
  Info,
  Groups,
  School,
  Warning,
  Block,
  Handshake,
  Psychology,
  MenuBook,
  PersonOff,
} from '@mui/icons-material';
import { MainNavbar } from '@/components/landing/main-navbar';
import { ProfessionalFooter } from '@/components/landing/professional-footer';
import { useTranslation } from 'react-i18next';

export default function CommunityGuidelinesPage() {
  const theme = useTheme();
  const { t } = useTranslation('common');

  const sections = [
    {
      icon: <Gavel />,
      title: t('communityGuidelines.sections.regulation.title'),
      description: t('communityGuidelines.sections.regulation.description'),
    },
    {
      icon: <School />,
      title: t('communityGuidelines.sections.methodology.title'),
      description: t('communityGuidelines.sections.methodology.description'),
    },
    {
      icon: <Handshake />,
      title: t('communityGuidelines.sections.responsibility.title'),
      description: t('communityGuidelines.sections.responsibility.description'),
    },
    {
      icon: <Shield />,
      title: t('communityGuidelines.sections.compliance.title'),
      description: t('communityGuidelines.sections.compliance.description'),
    },
  ];

  const keyPoints = [
    t('communityGuidelines.keyPoints.acceptance'),
    t('communityGuidelines.keyPoints.methodology'),
    t('communityGuidelines.keyPoints.responsibility'),
    t('communityGuidelines.keyPoints.noSpam'),
    t('communityGuidelines.keyPoints.consequences'),
  ];

  return (
    <>
      <MainNavbar />
      <Box sx={{ minHeight: '100vh', pt: 10 }}>
        <Container maxWidth="lg" sx={{ py: 6 }}>
          {/* Header Section */}
          <Box
            sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
              borderRadius: 4,
              p: 6,
              mb: 6,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: alpha(theme.palette.primary.main, 0.1),
              }}
            />
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={8}>
                <Stack spacing={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        color: 'white',
                      }}
                    >
                      <Groups sx={{ fontSize: 32 }} />
                    </Box>
                    <Box>
                      <Typography variant="h3" fontWeight={800} gutterBottom>
                        {t('communityGuidelines.title')}
                      </Typography>
                      <Typography variant="h6" color="text.secondary">
                        {t('communityGuidelines.subtitle')}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                    {t('communityGuidelines.description')}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                <Grid container spacing={2}>
                  {sections.map((section, index) => (
                    <Grid item xs={6} key={index}>
                      <Card
                        sx={{
                          textAlign: 'center',
                          p: 2,
                          background: alpha(theme.palette.background.paper, 0.8),
                          backdropFilter: 'blur(10px)',
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        }}
                      >
                        <Box sx={{ color: theme.palette.primary.main, mb: 1 }}>
                          {section.icon}
                        </Box>
                        <Typography variant="caption" fontWeight={600}>
                          {section.title}
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Box>

          {/* Key Points Alert */}
          <Alert
            severity="info"
            icon={<Info />}
            sx={{
              mb: 4,
              borderRadius: 2,
              '& .MuiAlert-icon': {
                fontSize: 28,
              },
            }}
          >
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              {t('communityGuidelines.keyPointsTitle')}
            </Typography>
            <List dense sx={{ mt: 1 }}>
              {keyPoints.map((point, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    <CheckCircle sx={{ fontSize: 18, color: 'info.main' }} />
                  </ListItemIcon>
                  <ListItemText primary={point} />
                </ListItem>
              ))}
            </List>
          </Alert>

          {/* Main Content */}
          <Grid container spacing={4}>
            {/* Authorization Section */}
            <Grid item xs={12}>
              <Card sx={{ overflow: 'visible' }}>
                <CardContent sx={{ p: 4 }}>
                  <Stack spacing={4}>
                    {/* Section 1: Regulatory Framework */}
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                            mr: 2,
                          }}
                        >
                          <Gavel />
                        </Box>
                        <Typography variant="h5" fontWeight={700}>
                          {t('communityGuidelines.content.framework.title')}
                        </Typography>
                      </Box>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          background: alpha(theme.palette.grey[100], 0.5),
                          borderLeft: `4px solid ${theme.palette.primary.main}`,
                        }}
                      >
                        <Typography paragraph sx={{ textAlign: 'justify', lineHeight: 1.8 }}>
                          {t('communityGuidelines.content.framework.text')}
                        </Typography>
                      </Paper>
                    </Box>

                    <Divider />

                    {/* Section 2: Membership */}
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: alpha(theme.palette.info.main, 0.1),
                            color: theme.palette.info.main,
                            mr: 2,
                          }}
                        >
                          <Groups />
                        </Box>
                        <Typography variant="h5" fontWeight={700}>
                          {t('communityGuidelines.content.membership.title')}
                        </Typography>
                      </Box>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          background: alpha(theme.palette.info.light, 0.1),
                          borderLeft: `4px solid ${theme.palette.info.main}`,
                        }}
                      >
                        <Typography paragraph sx={{ textAlign: 'justify', lineHeight: 1.8 }}>
                          {t('communityGuidelines.content.membership.text')}
                        </Typography>
                      </Paper>
                    </Box>

                    <Divider />

                    {/* Section 3: Methodology */}
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: alpha(theme.palette.success.main, 0.1),
                            color: theme.palette.success.main,
                            mr: 2,
                          }}
                        >
                          <MenuBook />
                        </Box>
                        <Typography variant="h5" fontWeight={700}>
                          {t('communityGuidelines.content.methodology.title')}
                        </Typography>
                      </Box>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          background: alpha(theme.palette.success.light, 0.1),
                          borderLeft: `4px solid ${theme.palette.success.main}`,
                        }}
                      >
                        <Typography paragraph sx={{ textAlign: 'justify', lineHeight: 1.8 }}>
                          {t('communityGuidelines.content.methodology.text')}
                        </Typography>
                      </Paper>
                    </Box>

                    <Divider />

                    {/* Section 4: Community Values */}
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: alpha(theme.palette.secondary.main, 0.1),
                            color: theme.palette.secondary.main,
                            mr: 2,
                          }}
                        >
                          <Psychology />
                        </Box>
                        <Typography variant="h5" fontWeight={700}>
                          {t('communityGuidelines.content.values.title')}
                        </Typography>
                      </Box>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          background: alpha(theme.palette.secondary.light, 0.1),
                          borderLeft: `4px solid ${theme.palette.secondary.main}`,
                        }}
                      >
                        <Typography paragraph sx={{ textAlign: 'justify', lineHeight: 1.8 }}>
                          {t('communityGuidelines.content.values.text')}
                        </Typography>
                      </Paper>
                    </Box>

                    <Divider />

                    {/* Section 5: Individual Responsibility */}
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: alpha(theme.palette.warning.main, 0.1),
                            color: theme.palette.warning.main,
                            mr: 2,
                          }}
                        >
                          <Handshake />
                        </Box>
                        <Typography variant="h5" fontWeight={700}>
                          {t('communityGuidelines.content.responsibility.title')}
                        </Typography>
                      </Box>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          background: alpha(theme.palette.warning.light, 0.1),
                          borderLeft: `4px solid ${theme.palette.warning.main}`,
                        }}
                      >
                        <Typography paragraph sx={{ textAlign: 'justify', lineHeight: 1.8 }}>
                          {t('communityGuidelines.content.responsibility.text')}
                        </Typography>
                      </Paper>
                    </Box>

                    <Divider />

                    {/* Section 6: Prohibited Activities */}
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: alpha(theme.palette.error.main, 0.1),
                            color: theme.palette.error.main,
                            mr: 2,
                          }}
                        >
                          <Block />
                        </Box>
                        <Typography variant="h5" fontWeight={700}>
                          {t('communityGuidelines.content.prohibited.title')}
                        </Typography>
                      </Box>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          background: alpha(theme.palette.error.light, 0.1),
                          borderLeft: `4px solid ${theme.palette.error.main}`,
                        }}
                      >
                        <Typography paragraph sx={{ textAlign: 'justify', lineHeight: 1.8 }}>
                          {t('communityGuidelines.content.prohibited.text')}
                        </Typography>
                        <Alert severity="error" sx={{ mt: 2 }}>
                          <Typography variant="body2">
                            {t('communityGuidelines.content.prohibited.warning')}
                          </Typography>
                        </Alert>
                      </Paper>
                    </Box>

                    <Divider />

                    {/* Section 7: Compliance and Consequences */}
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: alpha(theme.palette.error.main, 0.1),
                            color: theme.palette.error.main,
                            mr: 2,
                          }}
                        >
                          <Warning />
                        </Box>
                        <Typography variant="h5" fontWeight={700}>
                          {t('communityGuidelines.content.compliance.title')}
                        </Typography>
                      </Box>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          background: alpha(theme.palette.error.light, 0.1),
                          borderLeft: `4px solid ${theme.palette.error.main}`,
                        }}
                      >
                        <Typography paragraph sx={{ textAlign: 'justify', lineHeight: 1.8 }}>
                          {t('communityGuidelines.content.compliance.text')}
                        </Typography>
                        <Alert severity="warning" sx={{ mt: 2 }}>
                          <Typography variant="body2">
                            {t('communityGuidelines.content.compliance.warning')}
                          </Typography>
                        </Alert>
                      </Paper>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Summary Card */}
            <Grid item xs={12}>
              <Card
                sx={{
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                  border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Shield sx={{ fontSize: 32, color: theme.palette.primary.main, mr: 2 }} />
                    <Typography variant="h5" fontWeight={700}>
                      {t('communityGuidelines.summary.title')}
                    </Typography>
                  </Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={2}>
                        <Typography variant="subtitle1" fontWeight={600} color="primary">
                          {t('communityGuidelines.summary.objectives.title')}
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemIcon>
                              <CheckCircle sx={{ color: theme.palette.primary.main }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={t('communityGuidelines.summary.objectives.quality')}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <CheckCircle sx={{ color: theme.palette.primary.main }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={t('communityGuidelines.summary.objectives.order')}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <CheckCircle sx={{ color: theme.palette.primary.main }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={t('communityGuidelines.summary.objectives.goals')}
                            />
                          </ListItem>
                        </List>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={2}>
                        <Typography variant="subtitle1" fontWeight={600} color="primary">
                          {t('communityGuidelines.summary.consequences.title')}
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemIcon>
                              <Warning sx={{ color: theme.palette.warning.main }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={t('communityGuidelines.summary.consequences.warning')}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <Block sx={{ color: theme.palette.error.main }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={t('communityGuidelines.summary.consequences.restriction')}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <PersonOff sx={{ color: theme.palette.error.main }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={t('communityGuidelines.summary.consequences.expulsion')}
                            />
                          </ListItem>
                        </List>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Contact Info */}
            <Grid item xs={12}>
              <Alert
                severity="info"
                sx={{
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    fontSize: 28,
                  },
                }}
              >
                <Typography variant="subtitle1" fontWeight={600}>
                  {t('communityGuidelines.contact.title')}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {t('communityGuidelines.contact.text')}
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <ProfessionalFooter />
    </>
  );
}
