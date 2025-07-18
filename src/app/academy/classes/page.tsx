'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowLeft } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { useClientAuth } from '@/hooks/use-client-auth';
import { SubscriptionPlan, Role } from '@/types/user';
import ClasesIntro from '@/components/academy/clases/clases-intro';
import ClasesVideoList from '@/components/academy/clases/clases-video-list';

export default function ClasesPage(): React.JSX.Element {
  const router = useRouter();
  const { t } = useTranslation('academy');
  const [viewVideos, setViewVideos] = useState(false);
  const { user } = useClientAuth();
  const userSubscriptions = user?.subscriptions || [];
  const userRole = user?.role;
  
  // Check URL hash on mount and handle navigation
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#videos') {
      setViewVideos(true);
    }
  }, []);
  
  // Check for CLASSES subscription with expiration
  const hasSubscriptionAccess = userSubscriptions.some(sub => {
    if (typeof sub === 'string') {
      return sub === (SubscriptionPlan.CLASSES as string);
    } else if (sub && typeof sub === 'object' && 'plan' in sub && 'expiresAt' in sub) {
      return sub.plan === (SubscriptionPlan.CLASSES as string) && 
        (!sub.expiresAt || new Date(sub.expiresAt) > new Date());
    }
    return false;
  });

  // Admin always has access
  const isAdmin = (userRole as string) === (Role.ADMIN as string);
  
  const hasAccess = hasSubscriptionAccess || isAdmin;

  // Calculate days remaining
  const getDaysRemaining = () => {
    if (isAdmin) return null;
    
    let expirationDate: Date | null = null;
    
    // Check subscription expiration
    const clasesSubscription = userSubscriptions.find(sub => {
      if (typeof sub === 'object' && 'plan' in sub && sub.plan === (SubscriptionPlan.CLASSES as string)) {
        return true;
      }
      return false;
    });
    
    if (clasesSubscription && typeof clasesSubscription === 'object' && 'expiresAt' in clasesSubscription && clasesSubscription.expiresAt) {
      expirationDate = new Date(clasesSubscription.expiresAt);
    }
    
    
    if (expirationDate) {
      const days = Math.ceil((expirationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return days > 0 ? days : 0;
    }
    
    return null;
  };

  const daysRemaining = getDaysRemaining();

  const handleCTA = () => {
    if (hasAccess) {
      setViewVideos(true);
    } else {
      router.push('/academy/subscription/plans?highlight=Classes');
    }
  };

  // Show intro page first, then videos for subscribers
  if (!viewVideos) {
    return (
      <Box sx={{ minHeight: '100vh', width: '100%' }}>
        <ClasesIntro 
          onStart={handleCTA}
          ctaText={hasAccess ? t('classes.viewClasses') : t('classes.getAccess')}
          hasAccess={hasAccess}
          daysRemaining={daysRemaining}
        />
      </Box>
    );
  }

  // Show videos for subscribers
  return (
    <Box sx={{ minHeight: '100vh', width: '100%', p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => setViewVideos(false)}
          sx={{ mb: 2 }}
        >
          {t('classes.backToIntro')}
        </Button>
        
        {/* Show expiration warning if applicable */}
        {daysRemaining !== null && daysRemaining <= 3 && (
          <Box sx={{ 
            mb: 3, 
            p: 2, 
            bgcolor: 'warning.main', 
            color: 'warning.contrastText',
            borderRadius: 2 
          }}>
            <Typography variant="body1" fontWeight={600}>
              ⚠️ {t('classes.accessExpiresIn', { days: daysRemaining })}
            </Typography>
            <Button 
              variant="contained" 
              size="small" 
              sx={{ mt: 1, bgcolor: 'white', color: 'warning.main' }}
              onClick={() => router.push('/pricing')}
            >
              {t('classes.renewAccess')}
            </Button>
          </Box>
        )}
        
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {t('classes.title')} - {t('classes.intensiveCourse')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('classes.courseDescription')}
        </Typography>
        
        {/* Show access type */}
        {user?.customClassAccess?.reason ? (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {t('classes.accessGrantedBy')}: {user.customClassAccess.reason}
          </Typography>
        ) : null}
      </Box>
      <ClasesVideoList />
    </Box>
  );
}