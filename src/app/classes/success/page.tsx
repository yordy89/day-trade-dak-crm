import React, { Suspense } from 'react';
import ClassesSuccessContent from './success-content';
import { Box, CircularProgress } from '@mui/material';

export default function ClassesSuccessPage() {
  return (
    <Suspense 
      fallback={
        <Box
          sx={{
            minHeight: '100vh',
            backgroundColor: '#0a0a0a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress sx={{ color: '#22c55e' }} />
        </Box>
      }
    >
      <ClassesSuccessContent />
    </Suspense>
  );
}