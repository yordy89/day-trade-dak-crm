'use client';

import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Grid,
  Chip,
  useTheme as useMuiTheme,
} from '@mui/material';
import { 
  Straighten,
  CheckCircle,
  Info,
} from '@mui/icons-material';
import { MainNavbar } from '@/components/landing/main-navbar';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/components/theme/theme-provider';

// Measurement Guide SVG
const MeasurementGuide = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <svg
    width="100%"
    height="300"
    viewBox="0 0 400 300"
    style={{ maxWidth: '400px' }}
  >
    {/* T-Shirt Outline */}
    <path
      d="M 100 50 L 150 30 L 180 60 L 180 80 L 220 80 L 220 60 L 250 30 L 300 50 L 280 100 L 260 90 L 260 250 L 140 250 L 140 90 L 120 100 Z"
      fill="none"
      stroke={isDarkMode ? '#666' : '#333'}
      strokeWidth="2"
    />
    
    {/* Measurement Lines */}
    {/* Chest Width */}
    <line x1="140" y1="120" x2="260" y2="120" stroke="#16a34a" strokeWidth="2" />
    <circle cx="140" cy="120" r="4" fill="#16a34a" />
    <circle cx="260" cy="120" r="4" fill="#16a34a" />
    <text x="200" y="110" textAnchor="middle" fill="#16a34a" fontSize="14" fontWeight="bold">A</text>
    
    {/* Length */}
    <line x1="320" y1="80" x2="320" y2="250" stroke="#2196F3" strokeWidth="2" />
    <circle cx="320" cy="80" r="4" fill="#2196F3" />
    <circle cx="320" cy="250" r="4" fill="#2196F3" />
    <text x="335" y="165" fill="#2196F3" fontSize="14" fontWeight="bold">B</text>
    
    {/* Sleeve */}
    <line x1="180" y1="60" x2="120" y2="100" stroke="#FF9800" strokeWidth="2" />
    <circle cx="180" cy="60" r="4" fill="#FF9800" />
    <circle cx="120" cy="100" r="4" fill="#FF9800" />
    <text x="140" y="75" fill="#FF9800" fontSize="14" fontWeight="bold">C</text>
  </svg>
);

export default function SizeGuidePage() {
  const { t } = useTranslation();
  const _muiTheme = useMuiTheme();
  const { isDarkMode } = useTheme();

  const sizeData = [
    { size: 'XS', chest: '86-91', length: '68', sleeve: '19' },
    { size: 'S', chest: '91-96', length: '70', sleeve: '20' },
    { size: 'M', chest: '96-101', length: '72', sleeve: '21' },
    { size: 'L', chest: '101-106', length: '74', sleeve: '22' },
    { size: 'XL', chest: '106-111', length: '76', sleeve: '23' },
    { size: '2XL', chest: '111-116', length: '78', sleeve: '24' },
    { size: '3XL', chest: '116-121', length: '80', sleeve: '25' },
  ];

  const sizeDataInches = [
    { size: 'XS', chest: '34-36', length: '27', sleeve: '7.5' },
    { size: 'S', chest: '36-38', length: '27.5', sleeve: '8' },
    { size: 'M', chest: '38-40', length: '28.5', sleeve: '8.25' },
    { size: 'L', chest: '40-42', length: '29', sleeve: '8.75' },
    { size: 'XL', chest: '42-44', length: '30', sleeve: '9' },
    { size: '2XL', chest: '44-46', length: '31', sleeve: '9.5' },
    { size: '3XL', chest: '46-48', length: '31.5', sleeve: '10' },
  ];

  const measurementTips = [
    { 
      titleKey: 'sizeGuide.tips.chest.title',
      descriptionKey: 'sizeGuide.tips.chest.description',
      color: '#16a34a' 
    },
    { 
      titleKey: 'sizeGuide.tips.length.title',
      descriptionKey: 'sizeGuide.tips.length.description',
      color: '#2196F3' 
    },
    { 
      titleKey: 'sizeGuide.tips.sleeve.title',
      descriptionKey: 'sizeGuide.tips.sleeve.description',
      color: '#FF9800' 
    },
  ];

  return (
    <>
      <MainNavbar />
      <Box sx={{ pt: 18, pb: 10, minHeight: '100vh' }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              {t('sizeGuide.title')}
            </Typography>
            <Typography variant="h5" color="text.secondary">
              {t('sizeGuide.subtitle')}
            </Typography>
          </Box>

          {/* Measurement Diagram */}
          <Card sx={{ 
            mb: 6,
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'background.paper',
            backdropFilter: 'blur(10px)',
          }}>
            <CardContent>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                {t('sizeGuide.howToMeasure')}
              </Typography>
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <MeasurementGuide isDarkMode={isDarkMode} />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ pl: { md: 4 } }}>
                    {measurementTips.map((tip, index) => (
                      <Box key={tip.titleKey} sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Chip 
                            label={String.fromCharCode(65 + index)} 
                            size="small" 
                            sx={{ 
                              bgcolor: tip.color,
                              color: 'white',
                              fontWeight: 700,
                              mr: 2,
                            }} 
                          />
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {t(tip.titleKey)}
                          </Typography>
                        </Box>
                        <Typography variant="body1" color="text.secondary">
                          {t(tip.descriptionKey)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Size Chart */}
          <Card sx={{
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'background.paper',
            backdropFilter: 'blur(10px)',
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                  {t('sizeGuide.sizeChart')}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Chip 
                    label={t('sizeGuide.centimeters')} 
                    color="primary" 
                    variant="outlined"
                  />
                  <Chip 
                    label={t('sizeGuide.inches')} 
                    variant="outlined"
                  />
                </Box>
              </Box>

              {/* Centimeters Table */}
              <TableContainer component={Paper} sx={{ mb: 4, bgcolor: 'transparent' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>{t('sizeGuide.size')}</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>
                        {t('sizeGuide.chest')} (cm)
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>
                        {t('sizeGuide.length')} (cm)
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>
                        {t('sizeGuide.sleeve')} (cm)
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sizeData.map((row) => (
                      <TableRow key={row.size}>
                        <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>
                          {row.size}
                        </TableCell>
                        <TableCell align="center">{row.chest}</TableCell>
                        <TableCell align="center">{row.length}</TableCell>
                        <TableCell align="center">{row.sleeve}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Inches Table */}
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                {t('sizeGuide.inchesChart')}
              </Typography>
              <TableContainer component={Paper} sx={{ bgcolor: 'transparent' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>{t('sizeGuide.size')}</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>
                        {t('sizeGuide.chest')} (in)
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>
                        {t('sizeGuide.length')} (in)
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>
                        {t('sizeGuide.sleeve')} (in)
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sizeDataInches.map((row) => (
                      <TableRow key={row.size}>
                        <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>
                          {row.size}
                        </TableCell>
                        <TableCell align="center">{row.chest}</TableCell>
                        <TableCell align="center">{row.length}</TableCell>
                        <TableCell align="center">{row.sleeve}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Additional Tips */}
          <Box sx={{ mt: 6 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, textAlign: 'center', mb: 4 }}>
              {t('sizeGuide.additionalTips')}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card sx={{
                  height: '100%',
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'background.paper',
                  backdropFilter: 'blur(10px)',
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Straighten sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {t('sizeGuide.tip1.title')}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {t('sizeGuide.tip1.description')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{
                  height: '100%',
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'background.paper',
                  backdropFilter: 'blur(10px)',
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {t('sizeGuide.tip2.title')}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {t('sizeGuide.tip2.description')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{
                  height: '100%',
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'background.paper',
                  backdropFilter: 'blur(10px)',
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Info sx={{ mr: 1, color: 'info.main' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {t('sizeGuide.tip3.title')}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {t('sizeGuide.tip3.description')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
}