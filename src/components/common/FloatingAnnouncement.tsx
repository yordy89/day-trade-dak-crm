'use client';

import React, { useState, useEffect } from 'react';
import { X, Bell, ChevronRight, TrendingUp, Calendar, BookOpen } from 'lucide-react';

interface Announcement {
  _id: string;
  title: string;
  content: string;
  type: 'webinar' | 'course' | 'mentorship' | 'market_news' | 'general';
  link?: string;
  linkText?: string;
  backgroundColor?: string;
  textColor?: string;
  priority?: 'low' | 'medium' | 'high';
  dismissible?: boolean;
  dismissDurationHours?: number;
  displayFrequency?: 'once' | 'daily' | 'weekly' | 'always';
  imageUrl?: string;
}

export default function FloatingAnnouncement() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // Add global styles for animations
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      @keyframes floating-pulse {
        0% { box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
        50% { box-shadow: 0 4px 30px rgba(0,0,0,0.25); }
        100% { box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
      }
      @keyframes floating-slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes floating-expandIn {
        from { transform: scale(0.9); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(styleEl);

    const loadAnnouncement = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const response = await fetch(`${apiUrl}/api/v1/auth/announcements/active`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (data && data.success && data.data) {
          const announcementData = data.data;

          // Check display frequency
          const lastShownKey = `announcement_lastshown_${announcementData._id}`;
          const lastShown = localStorage.getItem(lastShownKey);

          if (shouldShowAnnouncement(announcementData, lastShown)) {
            setAnnouncement(announcementData);

            // Update last shown time
            localStorage.setItem(lastShownKey, new Date().toISOString());

            // Delay showing for better UX (wait for user engagement)
            setTimeout(() => {
              checkUserEngagement();
            }, 3000);
          }
        }
      } catch (err) {
        console.error('[FloatingAnnouncement] Error:', err);
      }
    };

    const shouldShowAnnouncement = (ann: Announcement, lastShown: string | null): boolean => {
      if (!ann.displayFrequency || ann.displayFrequency === 'always') return true;
      if (ann.displayFrequency === 'once' && lastShown) return false;

      if (lastShown) {
        const hoursSinceShown = (Date.now() - new Date(lastShown).getTime()) / (1000 * 60 * 60);

        if (ann.displayFrequency === 'daily' && hoursSinceShown < 24) return false;
        if (ann.displayFrequency === 'weekly' && hoursSinceShown < 168) return false;
      }

      return true;
    };

    const checkUserEngagement = () => {
      // Check if user has scrolled or spent time on page
      let scrolled = false;
      let timeOnPage = 0;

      const scrollHandler = () => {
        if (window.scrollY > 100 && !scrolled) {
          scrolled = true;
          showAnnouncement();
        }
      };

      const timeHandler = setInterval(() => {
        timeOnPage += 1;
        if (timeOnPage >= 5 && !scrolled) {
          clearInterval(timeHandler);
          showAnnouncement();
        }
      }, 1000);

      window.addEventListener('scroll', scrollHandler);

      return () => {
        window.removeEventListener('scroll', scrollHandler);
        clearInterval(timeHandler);
      };
    };

    const showAnnouncement = () => {
      setIsVisible(true);
      setTimeout(() => setIsExpanded(true), 500);
    };

    loadAnnouncement();

    // Cleanup
    return () => {
      const styleEls = document.head.querySelectorAll('style');
      styleEls.forEach(el => {
        if (el.textContent?.includes('floating-pulse')) {
          el.remove();
        }
      });
    };
  }, []);

  const handleDismiss = () => {
    setIsExpanded(false);
    setTimeout(() => setIsVisible(false), 300);

    if (announcement) {
      const dismissedKey = `announcement_dismissed_${announcement._id}`;
      localStorage.setItem(dismissedKey, new Date().toISOString());

      // Track dismissal
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      fetch(`${apiUrl}/api/v1/auth/announcements/${announcement._id}/track-dismiss`, {
        method: 'POST',
      }).catch(console.error);
    }
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    setHasInteracted(true);
  };

  const handleAction = () => {
    if (!announcement?.link) return;

    // Track click
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    fetch(`${apiUrl}/api/v1/auth/announcements/${announcement._id}/track-click`, {
      method: 'POST',
    }).catch(console.error);

    window.open(announcement.link, '_blank', 'noopener,noreferrer');
  };

  const getIcon = () => {
    switch (announcement?.type) {
      case 'webinar':
        return <Calendar className="w-5 h-5" />;
      case 'course':
      case 'mentorship':
        return <BookOpen className="w-5 h-5" />;
      case 'market_news':
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getGradient = () => {
    switch (announcement?.priority) {
      case 'high':
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      case 'medium':
        return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
      default:
        return 'linear-gradient(135deg, #13547a 0%, #80d0c7 100%)';
    }
  };

  if (!announcement || !isVisible) return null;

  // Minimized state - just a small bubble
  if (isMinimized) {
    return (
      <div
        onClick={handleMinimize}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: getGradient(),
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9998,
          transition: 'all 0.3s ease',
          animation: hasInteracted ? 'none' : 'floating-pulse 2s infinite',
        }}
      >
        <div style={{ color: 'white' }}>{getIcon()}</div>
      </div>
    );
  }

  // Expanded floating card
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: isExpanded ? '360px' : '60px',
        maxWidth: 'calc(100vw - 48px)',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        zIndex: 9998,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        animation: 'floating-slideIn 0.5s ease-out',
        overflow: 'hidden',
      }}
    >
      {/* Header with gradient */}
      <div
        style={{
          background: getGradient(),
          padding: '16px 20px',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {getIcon()}
          <div>
            <div style={{ fontSize: '12px', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {announcement.type?.replace('_', ' ')}
            </div>
            <div style={{ fontWeight: 600, fontSize: '16px' }}>
              {announcement.title}
            </div>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      {isExpanded && (
        <div style={{ padding: '20px', animation: 'floating-expandIn 0.3s ease-out' }}>
          {announcement.imageUrl && (
            <img
              src={announcement.imageUrl}
              alt={announcement.title}
              style={{
                width: '100%',
                height: '140px',
                objectFit: 'cover',
                borderRadius: '8px',
                marginBottom: '16px',
              }}
            />
          )}

          <p style={{
            color: '#4a5568',
            fontSize: '14px',
            lineHeight: '1.6',
            marginBottom: '16px',
          }}>
            {announcement.content}
          </p>

          {announcement.link && (
            <button
              onClick={handleAction}
              style={{
                width: '100%',
                padding: '12px 20px',
                background: getGradient(),
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {announcement.linkText || 'Learn More'}
              <ChevronRight size={16} />
            </button>
          )}

          {announcement.dismissible !== false && (
            <button
              onClick={handleMinimize}
              style={{
                width: '100%',
                padding: '8px',
                background: 'transparent',
                color: '#718096',
                border: 'none',
                fontSize: '12px',
                cursor: 'pointer',
                marginTop: '8px',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#4a5568'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#718096'}
            >
              Minimize
            </button>
          )}
        </div>
      )}
    </div>
  );
}