'use client';

import React from 'react';

export default function AnnouncementBarStatic() {
  console.log('[AnnouncementBarStatic] Rendering static announcement');

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 9999,
        backgroundColor: '#4CAF50',
        color: '#ffffff',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: '14px',
        fontWeight: 'bold',
      }}
    >
      🔔 TEST ANNOUNCEMENT - If you see this, the component is rendering correctly!
    </div>
  );
}