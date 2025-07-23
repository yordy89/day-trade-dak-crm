'use client';

import React from 'react';
import { Box, Typography, Card, Stack, alpha } from '@mui/material';
import { TrendingUp, School, BarChart } from '@mui/icons-material';
import Link from 'next/link';

export interface ClassesAuthLayoutProps {
  children: React.ReactNode;
}

export default function ClassesAuthLayout({ children }: ClassesAuthLayoutProps) {

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background gradient */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${alpha('#0a0a0a', 0.92)} 0%, ${alpha('#16a34a', 0.85)} 30%, ${alpha('#991b1b', 0.85)} 70%, ${alpha('#0a0a0a', 0.92)} 100%)`,
          opacity: 0.3,
          zIndex: 0,
        }}
      />

      {/* Logo - Positioned absolutely */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: 20, md: 40 },
          left: { xs: 20, md: 40 },
          zIndex: 2,
        }}
      >
        <Link href="/classes" style={{ textDecoration: 'none' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              component="img"
              src="/assets/logos/day_trade_dak_white_logo.png"
              alt="DayTradeDak"
              sx={{ 
                width: { xs: '140px', md: '160px' },
                height: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.5))'
              }}
            />
          </Box>
        </Link>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          px: 3,
          py: 6,
          gap: { xs: 4, md: 8 },
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Form Card */}
        <Card
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
            width: { xs: '100%', sm: '450px' },
            maxWidth: '450px',
            backgroundColor: alpha('#000000', 0.6),
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha('#22c55e', 0.15)}`,
            borderRadius: 3,
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: -1,
              borderRadius: 3,
              padding: 1,
              background: 'linear-gradient(135deg, transparent 30%, rgba(34, 197, 94, 0.2) 50%, transparent 70%)',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              pointerEvents: 'none',
            },
          }}
        >
          <Box sx={{ width: '100%' }}>{children}</Box>
        </Card>

        {/* Features */}
        <Box 
          sx={{ 
            display: { xs: 'none', md: 'block' },
            maxWidth: '400px',
          }}
        >
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800,
              mb: 2,
              color: 'white',
            }}
          >
            Aprende Trading
            <span style={{ color: '#22c55e' }}> Profesional</span>
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 4,
              color: alpha('#ffffff', 0.7),
            }}
          >
            Accede al curso intensivo de 15 días
          </Typography>
          
          <Stack spacing={3}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  backgroundColor: alpha('#22c55e', 0.2),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <School sx={{ color: '#22c55e', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={600} sx={{ color: 'white' }}>
                  8 Clases Intensivas
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.6) }}>
                  Contenido estructurado y práctico
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  backgroundColor: alpha('#22c55e', 0.2),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TrendingUp sx={{ color: '#22c55e', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={600} sx={{ color: 'white' }}>
                  Análisis de Mercado
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.6) }}>
                  Análisis de gráficos y toma de decisiones
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  backgroundColor: alpha('#22c55e', 0.2),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BarChart sx={{ color: '#22c55e', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={600} sx={{ color: 'white' }}>
                  Análisis Técnico
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.6) }}>
                  Domina los indicadores clave
                </Typography>
              </Box>
            </Stack>
          </Stack>

          <Box 
            sx={{ 
              mt: 6, 
              p: 3, 
              borderRadius: 2, 
              backgroundColor: alpha('#22c55e', 0.1),
              border: `1px solid ${alpha('#22c55e', 0.2)}`,
            }}
          >
            <Typography variant="h5" fontWeight={700} sx={{ color: '#22c55e', mb: 1 }}>
              Precio Especial
            </Typography>
            <Typography variant="h3" fontWeight={800} sx={{ color: 'white' }}>
              $500 USD
            </Typography>
            <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.6), mt: 1 }}>
              Acceso completo por 15 días
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Simple Footer */}
      <Box
        sx={{
          p: 3,
          textAlign: 'center',
          borderTop: `1px solid ${alpha('#ffffff', 0.1)}`,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Typography variant="caption" sx={{ color: alpha('#ffffff', 0.5) }}>
          © {new Date().getFullYear()} DayTradeDak. Todos los derechos reservados.
        </Typography>
      </Box>
    </Box>
  );
}