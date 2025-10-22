'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha,
  CircularProgress,
  ButtonGroup,
  InputBase,
  Paper,
} from '@mui/material';
import {
  Download,
  Shield,
  Trash,
  CheckCircle,
  Lock,
  FileText,
  AlertTriangle,
  Info,
  Eye,
  FileJson,
  FileSpreadsheet,
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import API from '@/lib/axios';

export function PrivacyTab() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  // Data export mutation with format parameter
  const exportDataMutation = useMutation({
    mutationFn: async (format: 'json' | 'pdf' | 'excel') => {
      const response = await API.get(`/user/export-my-data/${format}`, {
        responseType: format === 'json' ? 'json' : 'blob',
      });
      return { data: response.data, format };
    },
    onSuccess: ({ data, format }) => {
      const timestamp = new Date().toISOString().split('T')[0];

      if (format === 'json') {
        // Handle JSON format
        const dataStr = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `daytradedak-data-${timestamp}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        // Handle PDF and Excel (blob format)
        const url = URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.download = `daytradedak-data-${timestamp}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      toast.success(`Tus datos han sido descargados exitosamente en formato ${format.toUpperCase()}`);
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Error al exportar tus datos');
    },
  });

  // Account deletion mutation
  const deletionMutation = useMutation({
    mutationFn: async () => {
      const response = await API.post('/user/request-deletion');
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      setDeleteDialogOpen(false);
      setConfirmText('');
      // Optionally logout user after 5 seconds
      setTimeout(() => {
        window.location.href = '/auth/sign-in';
      }, 5000);
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Error al solicitar eliminación de cuenta');
    },
  });

  const handleDownloadData = (format: 'json' | 'pdf' | 'excel') => {
    exportDataMutation.mutate(format);
  };

  const handleDeleteAccount = () => {
    if (confirmText !== 'ELIMINAR') {
      toast.error('Por favor escribe "ELIMINAR" para confirmar');
      return;
    }
    deletionMutation.mutate();
  };

  return (
    <Stack spacing={3}>
      {/* GDPR Rights Section */}
      <Card>
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <Shield size={24} color={theme.palette.primary.main} />
            <Typography variant="h6" fontWeight={600}>
              Tus Derechos bajo el RGPD
            </Typography>
          </Stack>

          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircle size={20} color={theme.palette.success.main} />
              </ListItemIcon>
              <ListItemText
                primary="Derecho de Acceso"
                secondary="Puedes solicitar una copia de todos tus datos personales"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle size={20} color={theme.palette.success.main} />
              </ListItemIcon>
              <ListItemText
                primary="Derecho de Portabilidad"
                secondary="Puedes descargar tus datos en formato JSON estructurado"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle size={20} color={theme.palette.success.main} />
              </ListItemIcon>
              <ListItemText
                primary="Derecho de Supresión"
                secondary="Puedes solicitar la eliminación de tu cuenta y datos"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle size={20} color={theme.palette.success.main} />
              </ListItemIcon>
              <ListItemText
                primary="Derecho de Rectificación"
                secondary="Puedes actualizar tus datos en cualquier momento desde tu perfil"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Download Data Section */}
      <Card>
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <Download size={24} color={theme.palette.info.main} />
            <Typography variant="h6" fontWeight={600}>
              Descargar Mis Datos
            </Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary" mb={2}>
            RGPD Artículo 20 - Derecho a la Portabilidad de Datos
          </Typography>

          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              Descarga una copia completa de todos tus datos personales almacenados en DayTradeDak,
              incluyendo perfil, suscripciones, transacciones y historial de actividad.
            </Typography>
          </Alert>

          <Typography variant="caption" color="text.secondary" component="div" mb={2}>
            Los datos se exportan en formato JSON legible por máquina e incluyen:
          </Typography>
          <Stack spacing={0.5} mb={3}>
            <Typography variant="caption" color="text.secondary">
              • Información personal (nombre, email, preferencias)
            </Typography>
            <Typography variant="caption" color="text.secondary">
              • Historial de suscripciones y permisos
            </Typography>
            <Typography variant="caption" color="text.secondary">
              • Transacciones y pagos realizados
            </Typography>
            <Typography variant="caption" color="text.secondary">
              • Fechas de creación y última actividad
            </Typography>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              variant="contained"
              startIcon={exportDataMutation.isPending ? <CircularProgress size={20} color="inherit" /> : <FileJson size={20} />}
              onClick={() => handleDownloadData('json')}
              disabled={exportDataMutation.isPending}
              sx={{
                flex: 1,
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                },
              }}
            >
              Descargar JSON
            </Button>
            <Button
              variant="contained"
              startIcon={exportDataMutation.isPending ? <CircularProgress size={20} color="inherit" /> : <FileText size={20} />}
              onClick={() => handleDownloadData('pdf')}
              disabled={exportDataMutation.isPending}
              sx={{
                flex: 1,
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)',
                },
              }}
            >
              Descargar PDF
            </Button>
            <Button
              variant="contained"
              startIcon={exportDataMutation.isPending ? <CircularProgress size={20} color="inherit" /> : <FileSpreadsheet size={20} />}
              onClick={() => handleDownloadData('excel')}
              disabled={exportDataMutation.isPending}
              sx={{
                flex: 1,
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)',
                },
              }}
            >
              Descargar Excel
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Delete Account Section */}
      <Card
        sx={{
          border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <Trash size={24} color={theme.palette.error.main} />
            <Typography variant="h6" fontWeight={600} color="error">
              Eliminar Mi Cuenta
            </Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary" mb={2}>
            RGPD Artículo 17 - Derecho al Olvido
          </Typography>

          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              ⚠️ Esta acción es irreversible
            </Typography>
            <Typography variant="body2">
              Al eliminar tu cuenta:
            </Typography>
            <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
              <li>Se cancelarán todas tus suscripciones activas</li>
              <li>Se eliminará tu información personal</li>
              <li>Perderás acceso a todo el contenido</li>
              <li>Los registros de pago se conservan anónimos por requisitos legales</li>
            </Box>
          </Alert>

          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Período de gracia de 30 días:</strong> Después de solicitar la eliminación,
              tendrás 30 días para cancelar la solicitud antes de que tus datos sean eliminados permanentemente.
            </Typography>
          </Alert>

          <Button
            variant="outlined"
            color="error"
            startIcon={<Trash size={20} />}
            onClick={() => setDeleteDialogOpen(true)}
            sx={{
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
                backgroundColor: alpha(theme.palette.error.main, 0.08),
              },
            }}
          >
            Solicitar Eliminación de Cuenta
          </Button>
        </CardContent>
      </Card>

      {/* Privacy Contact Section */}
      <Card>
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <Lock size={24} color={theme.palette.success.main} />
            <Typography variant="h6" fontWeight={600}>
              Contacto de Privacidad
            </Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary" mb={2}>
            Para ejercer otros derechos del RGPD o preguntas sobre privacidad:
          </Typography>

          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.success.main, 0.05),
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
            }}
          >
            <Typography variant="body2" fontWeight={600} gutterBottom>
              Email: support@daytradedak.com
            </Typography>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              Responsable de Datos: DayTradeDak
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Tiempo de respuesta: Máximo 30 días
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog - Professional Style */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setConfirmText('');
        }}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: isDarkMode
              ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.98) 0%, rgba(20, 20, 20, 0.98) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 250, 250, 0.98) 100%)',
            border: `2px solid ${alpha(theme.palette.error.main, 0.3)}`,
          },
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.15)} 0%, ${alpha(theme.palette.error.main, 0.05)} 100%)`,
                border: `2px solid ${alpha(theme.palette.error.main, 0.3)}`,
              }}
            >
              <AlertTriangle size={32} color={theme.palette.error.main} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                Confirmar Eliminación de Cuenta
              </Typography>
              <Typography variant="caption" color="text.secondary">
                RGPD Artículo 17 - Derecho al Olvido
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ pb: 2 }}>
          {/* Critical Warning Alert */}
          <Alert
            severity="error"
            icon={<AlertTriangle size={24} />}
            sx={{
              mb: 3,
              backgroundColor: alpha(theme.palette.error.main, 0.1),
              border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
              '& .MuiAlert-icon': {
                color: theme.palette.error.main,
              },
            }}
          >
            <Typography variant="body2" fontWeight={700} gutterBottom>
              ⚠️ ¡Advertencia! Esta acción eliminará permanentemente tu cuenta.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Al confirmar, tu cuenta será marcada para eliminación permanente después de 30 días.
            </Typography>
          </Alert>

          {/* What Will Happen */}
          <Paper
            sx={{
              p: 2.5,
              mb: 3,
              backgroundColor: alpha(theme.palette.warning.main, 0.05),
              border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
              borderRadius: 2,
            }}
          >
            <Typography variant="subtitle2" fontWeight={600} color="warning.main" gutterBottom>
              Al eliminar tu cuenta:
            </Typography>
            <Stack spacing={1} sx={{ mt: 1.5 }}>
              {[
                'Se cancelarán todas tus suscripciones activas',
                'Perderás acceso a todo el contenido y cursos',
                'Se eliminará tu información personal',
                'Los registros de pago se conservan anónimos (requisito legal)',
                'Tienes 30 días para cancelar esta solicitud',
              ].map((item, index) => (
                <Stack key={index} direction="row" spacing={1} alignItems="flex-start">
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: 'error.main',
                      mt: 0.8,
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {item}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Paper>

          {/* Confirmation Input */}
          <Typography variant="body2" color="text.secondary" mb={2} fontWeight={500}>
            Para confirmar, escribe <Typography component="span" fontWeight={700} color="error.main">ELIMINAR</Typography> en el campo de abajo:
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.04)',
              borderRadius: 2,
              border: `2px solid ${
                confirmText === 'ELIMINAR'
                  ? theme.palette.success.main
                  : confirmText.length > 0
                  ? theme.palette.error.main
                  : isDarkMode
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(0, 0, 0, 0.1)'
              }`,
              transition: 'all 0.3s',
              '&:hover': {
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)',
                borderColor: confirmText === 'ELIMINAR'
                  ? theme.palette.success.main
                  : theme.palette.error.main,
              },
              '&:focus-within': {
                borderColor: confirmText === 'ELIMINAR'
                  ? theme.palette.success.main
                  : theme.palette.error.main,
                borderWidth: 2,
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)',
              },
            }}
          >
            <Box
              sx={{
                ml: 1.5,
                mr: 1,
                display: 'flex',
                alignItems: 'center',
                color: confirmText === 'ELIMINAR'
                  ? theme.palette.success.main
                  : theme.palette.error.main,
              }}
            >
              {confirmText === 'ELIMINAR' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
            </Box>
            <InputBase
              fullWidth
              placeholder="Escribe ELIMINAR"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
              autoComplete="off"
              sx={{
                flex: 1,
                py: 1.5,
                pr: 2,
                fontSize: '16px',
                fontWeight: 700,
                textAlign: 'center',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                color: isDarkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.87)',
                '& input': {
                  padding: '0 8px',
                  textAlign: 'center',
                  color: confirmText === 'ELIMINAR'
                    ? theme.palette.success.main
                    : isDarkMode
                    ? 'rgba(255, 255, 255, 0.95)'
                    : 'rgba(0, 0, 0, 0.87)',
                  backgroundColor: 'transparent',
                  '&::placeholder': {
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                    opacity: 1,
                    textTransform: 'none',
                    letterSpacing: 'normal',
                    fontWeight: 400,
                  },
                },
              }}
            />
          </Box>

          {/* Visual Feedback */}
          {confirmText.length > 0 && (
            <Box sx={{ mt: 2 }}>
              {confirmText === 'ELIMINAR' ? (
                <Alert
                  severity="success"
                  icon={<CheckCircle size={20} />}
                  sx={{
                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                    border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                  }}
                >
                  <Typography variant="caption" fontWeight={600}>
                    ✓ Confirmación correcta. Ahora puedes proceder con la eliminación.
                  </Typography>
                </Alert>
              ) : (
                <Alert
                  severity="warning"
                  icon={<Info size={20} />}
                  sx={{
                    backgroundColor: alpha(theme.palette.warning.main, 0.1),
                    border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
                  }}
                >
                  <Typography variant="caption">
                    Debes escribir exactamente &quot;ELIMINAR&quot; para confirmar ({confirmText.length}/8)
                  </Typography>
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 3,
            pt: 2,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
              setConfirmText('');
            }}
            variant="outlined"
            size="large"
            sx={{
              px: 3,
              py: 1.25,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              borderColor: alpha(theme.palette.divider, 0.3),
              '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteAccount}
            variant="contained"
            size="large"
            disabled={confirmText !== 'ELIMINAR' || deletionMutation.isPending}
            startIcon={deletionMutation.isPending ? <CircularProgress size={20} color="inherit" /> : <Trash size={20} />}
            sx={{
              px: 4,
              py: 1.25,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 700,
              background: confirmText === 'ELIMINAR'
                ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
                : 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
              boxShadow: confirmText === 'ELIMINAR'
                ? '0 4px 16px rgba(220, 38, 38, 0.3)'
                : 'none',
              '&:hover': confirmText === 'ELIMINAR'
                ? {
                    background: 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)',
                    boxShadow: '0 6px 20px rgba(220, 38, 38, 0.4)',
                    transform: 'translateY(-1px)',
                  }
                : {},
              '&:disabled': {
                opacity: 0.6,
              },
              transition: 'all 0.3s ease',
            }}
          >
            {deletionMutation.isPending ? 'Eliminando...' : 'Eliminar Mi Cuenta'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
