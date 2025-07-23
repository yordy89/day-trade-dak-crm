'use client';

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import ClasesIntroStandalone from '@/components/classes/classes-intro-standalone';
import ClasesVideoListStandalone from '@/components/classes/classes-video-list-standalone';
import { useClassesAuth } from '@/hooks/use-classes-auth';

export default function StandaloneClasesPage() {
  const router = useRouter();
  const [viewVideos, setViewVideos] = useState(false);
  const { isAuthenticated, hasAccess, loading, user } = useClassesAuth();
  
  // Check URL hash on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#videos') {
      if (isAuthenticated && hasAccess) {
        setViewVideos(true);
      }
    }
  }, [isAuthenticated, hasAccess]);

  const handleCTA = (paymentMethod?: 'card' | 'klarna') => {
    if (!isAuthenticated) {
      // Redirect to isolated sign-in
      router.push('/classes/sign-in');
      return;
    }

    if (hasAccess) {
      setViewVideos(true);
    } else {
      // Direct to checkout with payment method
      handleCheckout(paymentMethod || 'card');
    }
  };

  const handleCheckout = async (paymentMethod: 'card' | 'klarna') => {
    try {
      // Import payment service dynamically to avoid build issues
      const { paymentService } = await import('@/services/api/payment.service');
      
      const checkoutData = await paymentService.createClassesCheckout({
        userId: user?._id,
        paymentMethod,
      });
      
      // Redirect to Stripe Checkout
      window.location.href = checkoutData.url;
    } catch (error: any) {
      console.error('Checkout error:', error);
      // Show error message to user
      // TODO: Replace with proper error handling UI
      console.error(error.message || 'Error al procesar el pago. Por favor intenta nuevamente.');
    }
  };

  const getCtaText = () => {
    if (loading) return 'Cargando...';
    if (!isAuthenticated) return 'Iniciar Sesión';
    if (!hasAccess) return 'Obtener Acceso';
    return 'Ver Clases';
  };

  // No global layout - standalone page
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0a0a0a' }}>
      {!viewVideos ? (
        <ClasesIntroStandalone 
          onStart={handleCTA}
          ctaText={getCtaText()}
          hasAccess={hasAccess}
          isAuthenticated={isAuthenticated}
          loading={loading}
        />
      ) : (
        <ClasesVideoListStandalone 
          onBack={() => setViewVideos(false)}
        />
      )}
    </Box>
  );
}