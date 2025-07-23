'use client';

import React, { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import ClassesAuthLayout from '@/components/classes/auth-layout';
import ClassesSignInForm from '@/components/classes/sign-in-form';

export default function ClassesSignInPage() {
  return (
    <ClassesAuthLayout>
      <Suspense fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress sx={{ color: '#22c55e' }} />
        </Box>
      }>
        <ClassesSignInForm />
      </Suspense>
    </ClassesAuthLayout>
  );
}