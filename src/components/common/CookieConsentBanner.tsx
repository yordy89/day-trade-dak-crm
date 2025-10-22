'use client';

import React, { useState } from 'react';
import CookieConsent, { Cookies } from 'react-cookie-consent';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  Stack,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import { Cookie, Settings, Shield } from '@mui/icons-material';

interface CookiePreferences {
  essential: boolean; // Always true
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export function CookieConsentBanner() {
  const theme = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    setCookiePreferences(allAccepted);
    saveCookiePreferences(allAccepted);
  };

  const handleRejectAll = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    setCookiePreferences(essentialOnly);
    saveCookiePreferences(essentialOnly);
  };

  const handleSavePreferences = () => {
    saveCookiePreferences(cookiePreferences);
    setShowSettings(false);
  };

  const saveCookiePreferences = (prefs: CookiePreferences) => {
    // Save preferences to localStorage
    localStorage.setItem('cookiePreferences', JSON.stringify(prefs));

    // Set individual cookies based on preferences
    if (prefs.analytics) {
      // Enable analytics (Google Analytics, etc.)
      Cookies.set('dtd_analytics_consent', 'true', { expires: 365 });
    } else {
      Cookies.remove('dtd_analytics_consent');
    }

    if (prefs.marketing) {
      // Enable marketing cookies
      Cookies.set('dtd_marketing_consent', 'true', { expires: 365 });
    } else {
      Cookies.remove('dtd_marketing_consent');
    }

    if (prefs.preferences) {
      // Enable preference cookies
      Cookies.set('dtd_preferences_consent', 'true', { expires: 365 });
    } else {
      Cookies.remove('dtd_preferences_consent');
    }
  };

  return (
    <>
      <CookieConsent
        location="bottom"
        buttonText="Aceptar Todo"
        declineButtonText="Rechazar Todo"
        enableDeclineButton
        onAccept={handleAcceptAll}
        onDecline={handleRejectAll}
        cookieName="dtd_cookie_consent"
        expires={365}
        overlay={false}
        style={{
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(22, 163, 74, 0.95) 0%, rgba(21, 128, 61, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(22, 163, 74, 0.98) 0%, rgba(21, 128, 61, 0.98) 100%)',
          padding: '20px 30px',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.15)',
          borderTop: '3px solid #16a34a',
          zIndex: 9999,
        }}
        buttonStyle={{
          background: 'white',
          color: '#16a34a',
          fontSize: '14px',
          fontWeight: 600,
          padding: '12px 24px',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
        declineButtonStyle={{
          background: 'transparent',
          color: 'white',
          fontSize: '14px',
          fontWeight: 500,
          padding: '12px 24px',
          borderRadius: '8px',
          border: '2px solid white',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          marginRight: '12px',
        }}
        contentStyle={{
          flex: '1 0 280px',
          margin: '0 20px',
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Cookie sx={{ fontSize: 32, color: 'white' }} />
          <Box>
            <Typography
              variant="h6"
              sx={{
                color: 'white',
                fontWeight: 700,
                mb: 0.5,
                fontSize: { xs: '1rem', sm: '1.1rem' },
              }}
            >
              🍪 Usamos Cookies
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.95)',
                fontSize: { xs: '0.875rem', sm: '0.9rem' },
                lineHeight: 1.5,
              }}
            >
              Utilizamos cookies esenciales para el funcionamiento del sitio y opcionales para mejorar tu experiencia.
              Puedes personalizar tus preferencias o aceptar todas las cookies.
            </Typography>
            <Button
              size="small"
              startIcon={<Settings fontSize="small" />}
              onClick={() => setShowSettings(true)}
              sx={{
                color: 'white',
                textTransform: 'none',
                mt: 1,
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Personalizar Cookies
            </Button>
          </Box>
        </Stack>
      </CookieConsent>

      {/* Cookie Settings Dialog */}
      <Dialog
        open={showSettings}
        onClose={() => setShowSettings(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Shield sx={{ color: 'primary.main', fontSize: 28 }} />
            <Typography variant="h6" fontWeight={700}>
              Configuración de Cookies
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Selecciona qué tipos de cookies deseas permitir. Las cookies esenciales no se pueden desactivar.
          </Typography>

          <Stack spacing={2}>
            {/* Essential Cookies */}
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                bgcolor: alpha(theme.palette.success.main, 0.05),
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={true}
                    disabled
                    color="success"
                  />
                }
                label={
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Cookies Esenciales (Obligatorias)
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Necesarias para el funcionamiento básico del sitio (autenticación, seguridad).
                    </Typography>
                  </Box>
                }
              />
            </Box>

            <Divider />

            {/* Analytics Cookies */}
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={cookiePreferences.analytics}
                    onChange={(e) =>
                      setCookiePreferences({ ...cookiePreferences, analytics: e.target.checked })
                    }
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Cookies Analíticas
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Nos ayudan a entender cómo usas el sitio para mejorar la experiencia.
                    </Typography>
                  </Box>
                }
              />
            </Box>

            {/* Marketing Cookies */}
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={cookiePreferences.marketing}
                    onChange={(e) =>
                      setCookiePreferences({ ...cookiePreferences, marketing: e.target.checked })
                    }
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Cookies de Marketing
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Usadas para mostrarte contenido relevante y ofertas personalizadas.
                    </Typography>
                  </Box>
                }
              />
            </Box>

            {/* Preference Cookies */}
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={cookiePreferences.preferences}
                    onChange={(e) =>
                      setCookiePreferences({ ...cookiePreferences, preferences: e.target.checked })
                    }
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Cookies de Preferencias
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Recuerdan tus preferencias (idioma, tema, configuraciones).
                    </Typography>
                  </Box>
                }
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setShowSettings(false)} variant="outlined">
            Cancelar
          </Button>
          <Button onClick={handleSavePreferences} variant="contained">
            Guardar Preferencias
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
