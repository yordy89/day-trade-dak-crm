'use client'

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Alert,
} from '@mui/material'
import { Lock, ContactSupport, ArrowBack } from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { paths } from '@/paths'

export function TradingJournalAccessDenied() {
  const router = useRouter()
  const { t } = useTranslation('academy')

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        p: 3,
      }}
    >
      <Card sx={{ maxWidth: 600 }}>
        <CardContent sx={{ textAlign: 'center', py: 6 }}>
          <Stack spacing={3} alignItems="center">
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'error.lighter',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Lock sx={{ fontSize: 40, color: 'error.main' }} />
            </Box>

            <Box>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                {t('tradingJournal.accessDenied.title')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('tradingJournal.accessDenied.message')}
              </Typography>
            </Box>

            <Alert severity="info" sx={{ textAlign: 'left', width: '100%' }}>
              <Typography variant="body2" gutterBottom>
                <strong>{t('tradingJournal.accessDenied.howToGet')}</strong>
              </Typography>
              <Typography variant="body2" component="ul" sx={{ pl: 2, mb: 0 }}>
                <li>{t('tradingJournal.accessDenied.registerEvent')}</li>
                <li>{t('tradingJournal.accessDenied.contactMentor')}</li>
                <li>{t('tradingJournal.accessDenied.upgradeSubscription')}</li>
              </Typography>
            </Alert>

            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => router.push(paths.academy.overview)}
              >
                {t('tradingJournal.accessDenied.backToDashboard')}
              </Button>
              <Button
                variant="contained"
                startIcon={<ContactSupport />}
                onClick={() => router.push('/contact')}
              >
                {t('tradingJournal.accessDenied.contactSupport')}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}
