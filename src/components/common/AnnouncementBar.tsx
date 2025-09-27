'use client';

import React, { useState, useEffect } from 'react';

export default function AnnouncementBar() {
  console.log('[AnnouncementBar] Component mounting');
  const [announcement, setAnnouncement] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [isVisible, setIsVisible] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>('Initializing...');

  useEffect(() => {
    console.log('[AnnouncementBar] useEffect running');
    setDebugInfo('useEffect triggered');

    const loadAnnouncement = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const fullUrl = `${apiUrl}/api/v1/auth/announcements/active`;

        console.log('[AnnouncementBar] API URL:', apiUrl);
        console.log('[AnnouncementBar] Full URL:', fullUrl);
        setDebugInfo(`Fetching from: ${fullUrl}`);

        const response = await fetch(fullUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        console.log('[AnnouncementBar] Response status:', response.status);
        console.log('[AnnouncementBar] Response OK:', response.ok);
        setDebugInfo(`Response received: ${response.status}`);

        const data = await response.json();
        console.log('[AnnouncementBar] Response data:', JSON.stringify(data, null, 2));

        if (data && data.success && data.data) {
          console.log('[AnnouncementBar] Found active announcement:', data.data.title);

          // Check if dismissed
          const announcementId = data.data._id;
          const dismissedKey = `announcement_dismissed_${announcementId}`;
          console.log('[AnnouncementBar] Checking dismissal key:', dismissedKey);

          if (data.data.dismissible !== false) {
            const dismissedTime = localStorage.getItem(dismissedKey);
            console.log('[AnnouncementBar] Dismissed time from localStorage:', dismissedTime);

            if (dismissedTime) {
              const hoursSinceDismiss = (Date.now() - new Date(dismissedTime).getTime()) / (1000 * 60 * 60);
              console.log('[AnnouncementBar] Hours since dismiss:', hoursSinceDismiss);

              if (hoursSinceDismiss < (data.data.dismissDurationHours || 24)) {
                console.log('[AnnouncementBar] Already dismissed, not showing');
                setDebugInfo('Announcement was previously dismissed');
                return;
              }
            }
          }

          console.log('[AnnouncementBar] Setting announcement to state');
          setAnnouncement(data.data);
          setDebugInfo(`Announcement loaded: ${data.data.title}`);
        } else {
          console.log('[AnnouncementBar] No active announcement in response');
          setDebugInfo('No active announcement');
        }
      } catch (err) {
        console.error('[AnnouncementBar] Error occurred:', err);
        console.error('[AnnouncementBar] Error stack:', (err as any).stack);
        setError(String(err));
        setDebugInfo(`Error: ${String(err)}`);
      }
    };

    // Run immediately
    console.log('[AnnouncementBar] Calling loadAnnouncement');
    loadAnnouncement();
  }, []);

  const handleDismiss = () => {
    if (!announcement || announcement.dismissible === false) return;

    const dismissedKey = `announcement_dismissed_${announcement._id}`;
    localStorage.setItem(dismissedKey, new Date().toISOString());

    // Track dismiss
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    fetch(`${apiUrl}/api/v1/auth/announcements/${announcement._id}/track-dismiss`, {
      method: 'POST',
    }).catch(console.error);

    setIsVisible(false);
  };

  const handleLinkClick = () => {
    if (!announcement?.link) return;

    // Track click
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    fetch(`${apiUrl}/api/v1/auth/announcements/${announcement._id}/track-click`, {
      method: 'POST',
    }).catch(console.error);

    window.open(announcement.link, '_blank', 'noopener,noreferrer');
  };

  // Always show debug info in development
  const isDevelopment = process.env.NODE_ENV === 'development';

  console.log('[AnnouncementBar] Render check - announcement:', announcement);
  console.log('[AnnouncementBar] Render check - isVisible:', isVisible);
  console.log('[AnnouncementBar] Render check - error:', error);

  // Show debug banner in development
  if (isDevelopment && (!announcement || !isVisible)) {
    return (
      <div
        style={{
          backgroundColor: '#ff9800',
          color: '#000',
          padding: '8px',
          fontSize: '12px',
          fontFamily: 'monospace',
          borderBottom: '1px solid #f57c00',
        }}
      >
        [DEBUG] AnnouncementBar: {debugInfo} | Has announcement: {announcement ? 'YES' : 'NO'} | Visible: {isVisible ? 'YES' : 'NO'} | Error: {error || 'None'}
      </div>
    );
  }

  // Don't render if no announcement or not visible
  if (!announcement || !isVisible) {
    console.log('[AnnouncementBar] Not rendering - no announcement or not visible');
    return null;
  }

  const bgColor = announcement.backgroundColor || '#1976d2';
  const textColor = announcement.textColor || '#ffffff';

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 9999,
        backgroundColor: bgColor,
        color: textColor,
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: '14px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
        <strong>{announcement.title}</strong>
        {announcement.content && (
          <span style={{ opacity: 0.9 }}>— {announcement.content}</span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {announcement.link && (
          <button
            onClick={handleLinkClick}
            style={{
              background: 'none',
              border: 'none',
              color: announcement.linkColor || textColor,
              cursor: 'pointer',
              fontSize: '14px',
              textDecoration: 'underline',
              padding: '4px 8px',
            }}
          >
            {announcement.linkText || 'Learn More'}
          </button>
        )}

        {announcement.dismissible !== false && (
          <button
            onClick={handleDismiss}
            style={{
              background: 'none',
              border: 'none',
              color: textColor,
              cursor: 'pointer',
              fontSize: '18px',
              padding: '0 4px',
              lineHeight: 1,
              opacity: 0.8,
            }}
            aria-label="Close announcement"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}