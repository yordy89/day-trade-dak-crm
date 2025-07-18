import React from 'react';
import { Box } from '@mui/material';

interface GoogleMapProps {
  location?: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  height?: string | number;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ 
  location = { lat: 18.4861, lng: -69.9312 }, // Default to Santo Domingo
  zoom = 14,
  height = 400 
}) => {
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&q=${location.lat},${location.lng}&zoom=${zoom}`;

  return (
    <Box
      sx={{
        width: '100%',
        height,
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <iframe
        title="Google Map - DayTradeDak Location"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={mapUrl}
      />
    </Box>
  );
};

export default GoogleMap;