'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './header';
import { getNavItems } from './config';
import { useTranslation } from 'react-i18next';

export function MainNav(): React.JSX.Element {
  const pathname = usePathname();
  const { t } = useTranslation('academy');
  
  // Get nav items with translations
  const navItems = getNavItems(t);
  
  // Find the current page title based on the pathname
  const getCurrentPageInfo = () => {
    // First check for exact match
    const currentItem = navItems.find(item => {
      if (item.href === pathname) return true;
      if (item.items) {
        return item.items.some(subItem => subItem.href === pathname);
      }
      return false;
    });
    
    if (currentItem) {
      return {
        title: currentItem.title,
        subtitle: currentItem.items?.find(sub => sub.href === pathname)?.title
      };
    }
    
    // If no exact match, check if pathname starts with any nav item href
    // This handles nested routes like /academy/masterclass/video/[videoKey]
    const parentItem = navItems.find(item => {
      if (item.href && pathname.startsWith(item.href)) return true;
      if (item.items) {
        return item.items.some(subItem => subItem.href && pathname.startsWith(subItem.href));
      }
      return false;
    });
    
    if (parentItem) {
      return {
        title: parentItem.title,
        subtitle: parentItem.items?.find(sub => sub.href && pathname.startsWith(sub.href))?.title
      };
    }
    
    // Default fallback
    return { title: t('navigation.dashboard'), subtitle: undefined };
  };
  
  const { title, subtitle } = getCurrentPageInfo();

  return (
    <React.Fragment>
      {/* Professional Header */}
      <Header pageTitle={title} pageSubtitle={subtitle} />
    </React.Fragment>
  );
}
