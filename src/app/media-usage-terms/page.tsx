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
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  useTheme,
  alpha,
} from '@mui/material';
import {
  CameraAlt,
  Videocam,
  Gavel,
  Shield,
  CheckCircle,
  Info,
  Description,
  AccessTime,
  Language,
  Security,
  PhotoCamera,
  VideoLibrary,
  MicNone,
  Groups,
} from '@mui/icons-material';
import { MainNavbar } from '@/components/landing/main-navbar';
import { ProfessionalFooter } from '@/components/landing/professional-footer';

export default function MediaUsageTermsPage() {
  const theme = useTheme();

  const sections = [
    {
      icon: <CameraAlt />,
      title: 'Grabación de Imagen',
      description: 'Autorización para captura de fotografías',
    },
    {
      icon: <Videocam />,
      title: 'Grabación de Video',
      description: 'Autorización para grabación audiovisual',
    },
    {
      icon: <MicNone />,
      title: 'Grabación de Audio',
      description: 'Autorización para grabación de voz y testimonios',
    },
    {
      icon: <Language />,
      title: 'Uso Global',
      description: 'Derechos de uso en todo el mundo',
    },
  ];

  const keyPoints = [
    'Autorización completa para uso de imagen en todos los eventos de Day Trade Dak',
    'Cesión de derechos para material educativo y promocional',
    'Sin compensación económica adicional por el uso de imagen',
    'Aplicable a todos los cursos, eventos y actividades de trading',
    'Vigencia permanente mientras no se solicite lo contrario',
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
                    <PhotoCamera sx={{ fontSize: 32 }} />
                  </Box>
                  <Box>
                    <Typography variant="h3" fontWeight={800} gutterBottom>
                      Términos de Uso de Imagen
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      Day Trade Dak - Academia de Trading
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                  Autorización completa para el uso de imagen, voz y contenido audiovisual
                  en todas las actividades educativas y promocionales de Day Trade Dak.
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
            Puntos Importantes
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
                  {/* Section 1: Authorization */}
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
                        Autorización de Participación y Cesión de Derechos
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
                        Por la presente, Yo, al hacer click en "suscribirse" o "registrarse",
                        autorizo que la empresa <strong>Day Trade Dak</strong>, en lo sucesivo "la Empresa",
                        haga uso de mi imagen para los fines que estos consideren en pro del desarrollo
                        de la academia de trading, sin hacer uso indebido o cometer cualquier acto ilícito.
                        Por lo que acepto que el Equipo de Producción Audiovisual que responde a la "Empresa",
                        pueda grabarme en video y fotografiarme, para la producción con fines educativos,
                        promocionales y de marketing, incluyendo testimonios y/o historias relatadas en
                        relación con los productos y servicios de formación en trading ofertados por
                        <strong> Day Trade Dak</strong> y todos sus eventos y cursos realizados.
                      </Typography>
                    </Paper>
                  </Box>

                  <Divider />

                  {/* Section 2: No Compensation */}
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
                        <Description />
                      </Box>
                      <Typography variant="h5" fontWeight={700}>
                        Condiciones de Participación
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
                        Comprendo y acepto que la autorización antes mencionada se realiza para una
                        producción audiovisual de <strong>Day Trade Dak</strong> en la que <strong>no habrá
                        remuneración</strong> u otro tipo de pago pendiente, ni ningún tipo de contraprestación.
                        Por lo que renuncio expresamente a cualquier compensación económica,
                        confirmando que mi participación será a título gratuito y no solicitaré
                        ningún tipo de contraprestación presente o futura.
                      </Typography>
                    </Paper>
                  </Box>

                  <Divider />

                  {/* Section 3: Irrevocable Consent */}
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
                        <CheckCircle />
                      </Box>
                      <Typography variant="h5" fontWeight={700}>
                        Consentimiento Irrevocable
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
                        Doy mi consentimiento de forma <strong>irrevocable</strong> para que
                        <strong> Day Trade Dak</strong> pueda utilizar mi participación en las
                        producciones audiovisuales, fragmentos de estas, en vivo e imagen, videos,
                        fotografías que se requieran. Asimismo, confirmo que cualquier declaración
                        que realice durante mi participación será verdadera y no violará ni
                        infringirá derechos de terceros.
                      </Typography>
                    </Paper>
                  </Box>

                  <Divider />

                  {/* Section 4: Copyright */}
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
                        <VideoLibrary />
                      </Box>
                      <Typography variant="h5" fontWeight={700}>
                        Derechos de Autor
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
                        Por este medio otorgo mi consentimiento para que <strong>Day Trade Dak</strong> sea
                        la única propietaria del derecho de autor y otros derechos derivados de las piezas
                        audiovisuales realizadas para sus medios digitales y/o impresos, relativos a la
                        producción educativa y promocional de trading, otorgándole expresamente los derechos
                        de comunicación y de reproducción, pudiendo hacer uso de ellos <strong>a perpetuidad</strong>,
                        en todo el mundo y en cualquier medio conocido o por conocerse, siempre y cuando no
                        sean utilizadas para un fin ilícito.
                      </Typography>
                    </Paper>
                  </Box>

                  <Divider />

                  {/* Section 5: Liability Release */}
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
                        <Shield />
                      </Box>
                      <Typography variant="h5" fontWeight={700}>
                        Liberación de Responsabilidad
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
                        Libero y eximo a <strong>Day Trade Dak</strong> de todo tipo de responsabilidad,
                        reclamo o demanda de cualquier tipo o naturaleza (civil, penal, mercantil, laboral, etc.)
                        que pudiere llegar a generarse por motivo de mi participación. De manera voluntaria
                        y bajo protesta, no presentaré demandas contra la "Empresa" y en ningún caso tendré
                        el derecho de prohibir el desarrollo, la producción, la distribución, uso o explotación
                        de mi voz e imagen, o solicitar compensación económica por este tipo de uso legítimo
                        que <strong>Day Trade Dak</strong> decida.
                      </Typography>
                      <Alert severity="warning" sx={{ mt: 2 }}>
                        <Typography variant="body2">
                          En caso de incumplimiento, acepto ser responsable de los perjuicios causados
                          a Day Trade Dak, incluyendo honorarios de abogados y gastos legales.
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
                  <Security sx={{ fontSize: 32, color: theme.palette.primary.main, mr: 2 }} />
                  <Typography variant="h5" fontWeight={700}>
                    Resumen de Términos
                  </Typography>
                </Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={2}>
                      <Typography variant="subtitle1" fontWeight={600} color="primary">
                        ✓ Aplicable a:
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <Groups sx={{ color: theme.palette.primary.main }} />
                          </ListItemIcon>
                          <ListItemText
                            primary="Todos los eventos presenciales y virtuales"
                            secondary="Seminarios, workshops, masterclasses"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <VideoLibrary sx={{ color: theme.palette.primary.main }} />
                          </ListItemIcon>
                          <ListItemText
                            primary="Material educativo y promocional"
                            secondary="Cursos, testimonios, contenido de marketing"
                          />
                        </ListItem>
                      </List>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={2}>
                      <Typography variant="subtitle1" fontWeight={600} color="primary">
                        ⚡ Vigencia:
                      </Typography>
                      <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <AccessTime sx={{ color: theme.palette.warning.main }} />
                          <Box>
                            <Typography variant="body1" fontWeight={600}>
                              Permanente
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Desde el momento de aceptación
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                      <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Language sx={{ color: theme.palette.info.main }} />
                          <Box>
                            <Typography variant="body1" fontWeight={600}>
                              Mundial
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Uso en cualquier país o plataforma
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
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
                ¿Tienes preguntas sobre estos términos?
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Contacta a nuestro equipo legal en: legal@daytradedak.com
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