'use client';

import * as React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';

export interface TradingBookItemProps {
  title: string;
  author: string;
  image: string;
  link: string;
  format?: string;
  showFormatButton?: boolean; // Determines button type
}

export function TradingBookItem({ title, author, image, link, format, showFormatButton }: TradingBookItemProps): React.JSX.Element {
  return (
    <Card
      sx={{
        display: 'flex',
        bgcolor: 'rgba(0,0,0,1)',
        color: 'white',
        borderRadius: 2,
        boxShadow: 3,
        overflow: 'hidden',
        height: '100%', // Ensures all cards have the same height
      }}
    >
      {/* Left: Book Image */}
      <Box
        component="img"
        src={image}
        alt={title}
        sx={{
          width: 140, // Fixed width
          height: '100%', // Ensures full height
          objectFit: 'cover',
          borderTopLeftRadius: 8,
          borderBottomLeftRadius: 8,
        }}
      />

      {/* Right: Book Details */}
      <CardContent
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: 200, // Ensures all cards have consistent height
          p: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          <strong>Autor:</strong> {author}
        </Typography>
        
        {/* Button Aligned at the Bottom */}
        <Box sx={{ mt: 'auto' }}> {/* Pushes button to bottom */}
          <Button
            variant="contained"
            color="primary"
            href={link}
            target="_blank"
            fullWidth
          >
            {showFormatButton ? `Comprar en Amazon (${format})` : 'Ver en Amazon'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
