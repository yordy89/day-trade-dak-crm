'use client';

import * as React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { TradingBookItem } from '../../core/TradingBookItem';

export interface Book {
  title: string;
  author: string;
  image: string;
  link: string;
  format?: string; // Format for specific books
}

export interface TradingBooksListProps {
  title: string;
  books: Book[];
  showFormatButtons?: boolean; // Determines if format buttons should be used
}

export function TradingBooksList({ title, books, showFormatButtons = false }: TradingBooksListProps): React.JSX.Element {
  return (
    <Box sx={{ mb: 5, p: 3, borderRadius: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: 'black', textAlign: 'center' }}>
        {title}
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {books.map((book) => (
          <Grid item key={book.title} xs={12} sm={6} md={4}> {/* 3 columns on medium screens and larger */}
            <TradingBookItem {...book} showFormatButton={showFormatButtons} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
