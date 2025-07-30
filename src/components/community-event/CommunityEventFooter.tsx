'use client';

import * as React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  IconButton, 
  Stack,
  Link as MuiLink,
  alpha
} from '@mui/material';
import { 
  Facebook, 
  Instagram, 
  YouTube,
  Email,
  Phone
} from '@mui/icons-material';
import { FaTiktok } from 'react-icons/fa';

export function CommunityEventFooter() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#1a1a1a',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Typography 
              variant="h5" 
              fontWeight={700} 
              sx={{ color: '#22c55e', mb: 2 }}
            >
              DayTradeDak
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: alpha('#ffffff', 0.8) }}>
              Tu plataforma de confianza para el trading profesional. Formación, mentoría y 
              comunidad para traders serios.
            </Typography>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ fontSize: 20, color: alpha('#ffffff', 0.6) }} />
                <MuiLink 
                  href="mailto:support@daytradedak.com" 
                  sx={{ 
                    color: alpha('#ffffff', 0.8), 
                    textDecoration: 'none',
                    '&:hover': { color: '#22c55e' }
                  }}
                >
                  support@daytradedak.com
                </MuiLink>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ fontSize: 20, color: alpha('#ffffff', 0.6) }} />
                <MuiLink 
                  href="tel:+17863551346" 
                  sx={{ 
                    color: alpha('#ffffff', 0.8), 
                    textDecoration: 'none',
                    '&:hover': { color: '#22c55e' }
                  }}
                >
                  +1 (786) 355-1346
                </MuiLink>
              </Box>
            </Stack>
          </Grid>

          {/* Spacer */}
          <Grid item xs={12} md={4} />

          {/* Social Media Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Síguenos
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: alpha('#ffffff', 0.8) }}>
              Únete a nuestra comunidad de traders en las redes sociales
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton
                component="a"
                href="https://www.facebook.com/daytradedak"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: 'white',
                  backgroundColor: alpha('#ffffff', 0.1),
                  '&:hover': { 
                    backgroundColor: alpha('#1877f2', 0.3),
                    color: '#1877f2'
                  }
                }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                component="a"
                href="https://www.instagram.com/daytradedak"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: 'white',
                  backgroundColor: alpha('#ffffff', 0.1),
                  '&:hover': { 
                    backgroundColor: alpha('#e4405f', 0.3),
                    color: '#e4405f'
                  }
                }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                component="a"
                href="https://www.tiktok.com/@daytradedak"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: 'white',
                  backgroundColor: alpha('#ffffff', 0.1),
                  '&:hover': { 
                    backgroundColor: alpha('#000000', 0.3),
                    color: '#ffffff'
                  }
                }}
              >
                <FaTiktok size={20} />
              </IconButton>
              <IconButton
                component="a"
                href="https://www.youtube.com/@daytradedak"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: 'white',
                  backgroundColor: alpha('#ffffff', 0.1),
                  '&:hover': { 
                    backgroundColor: alpha('#ff0000', 0.3),
                    color: '#ff0000'
                  }
                }}
              >
                <YouTube />
              </IconButton>
            </Stack>
          </Grid>
        </Grid>

        {/* Bottom Section */}
        <Box 
          sx={{ 
            mt: 6, 
            pt: 3, 
            borderTop: `1px solid ${alpha('#ffffff', 0.1)}`,
            textAlign: 'center'
          }}
        >
          <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.6) }}>
            © 2025 DayTradeDak. Todos los derechos reservados.
          </Typography>
          <Stack 
            direction="row" 
            spacing={2} 
            justifyContent="center" 
            sx={{ mt: 1 }}
          >
            <MuiLink 
              href="/terms/terms-conditions#privacy"
              sx={{ 
                color: alpha('#ffffff', 0.6), 
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': { 
                  color: '#22c55e',
                  textDecoration: 'underline'
                }
              }}
            >
              Política de Privacidad
            </MuiLink>
            <Typography sx={{ color: alpha('#ffffff', 0.4) }}>•</Typography>
            <MuiLink 
              href="/terms/terms-conditions#terms"
              sx={{ 
                color: alpha('#ffffff', 0.6), 
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': { 
                  color: '#22c55e',
                  textDecoration: 'underline'
                }
              }}
            >
              Términos y Condiciones
            </MuiLink>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}