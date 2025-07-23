'use client';

import React, { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import ClassesAuthLayout from '@/components/classes/auth-layout';
import ClassesSignUpForm from '@/components/classes/sign-up-form';

export default function ClassesSignUpPage() {
  return (
    <ClassesAuthLayout>
      <Suspense fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress sx={{ color: '#22c55e' }} />
        </Box>
      }>
        <ClassesSignUpForm />
      </Suspense>
    </ClassesAuthLayout>
  );
}