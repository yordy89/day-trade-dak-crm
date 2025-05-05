'use client';

import React from 'react';

interface GoogleMapProps {
  address: string;
  height?: string;
  width?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ address, height = '300px', width = '100%' }) => {
  const encodedAddress = encodeURIComponent(address);

  return (
    <iframe
      title="Event Location Map"
      width={width}
      height={height}
      loading="lazy"
      style={{ border: 0, borderRadius: 8 }}
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
      src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodedAddress}`}
    />
  );
};

export default GoogleMap;
