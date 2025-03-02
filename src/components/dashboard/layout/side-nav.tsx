'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';
import { isNavItemActive } from '@/lib/is-nav-item-active';
import { Logo } from '@/components/core/logo';

import { navItems } from './config';
import { navIcons } from './nav-icons';

export function SideNav(): React.JSX.Element {
  const pathname = usePathname();

  const userSubscriptions = useAuthStore((state) => state.user?.subscriptions ?? []);

  return (
    <Box
      sx={{
        '--SideNav-background': 'var(--mui-palette-common-black)',
        '--SideNav-color': 'var(--mui-palette-common-white)',
        '--NavItem-color': 'var(--mui-palette-neutral-300)',
        '--NavItem-hover-background': 'rgba(255, 255, 255, 0.04)',
        '--NavItem-active-background': 'var(--mui-palette-primary-main)',
        '--NavItem-active-color': 'var(--mui-palette-primary-contrastText)',
        '--NavItem-disabled-color': 'var(--mui-palette-neutral-500)',
        '--NavItem-icon-color': 'var(--mui-palette-neutral-400)',
        '--NavItem-icon-active-color': 'var(--mui-palette-primary-contrastText)',
        '--NavItem-icon-disabled-color': 'var(--mui-palette-neutral-600)',
        bgcolor: 'var(--SideNav-background)',
        color: 'var(--SideNav-color)',
        display: { xs: 'none', lg: 'flex' },
        flexDirection: 'column',
        height: '100%',
        left: 0,
        maxWidth: '100%',
        position: 'fixed',
        scrollbarWidth: 'none',
        top: 0,
        width: 'var(--SideNav-width)',
        zIndex: 'var(--SideNav-zIndex)',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      <Stack spacing={2} sx={{ p: 3 }}>
        <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-flex', justifyContent: 'center' }}>
          <Logo color="light" height={82} width={120} />
        </Box>
      </Stack>
      <Divider sx={{ borderColor: 'var(--mui-palette-neutral-700)' }} />
      <Box component="nav" sx={{ flex: '1 1 auto', p: '12px' }}>
        <NavItemList pathname={pathname} userSubscriptions={userSubscriptions} />
      </Box>
      <Divider sx={{ borderColor: 'var(--mui-palette-neutral-700)' }} />
      {/* Upgrade Now Button at the Bottom */}
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: 'var(--NavItem-color)', mb: 1 }}>
        ¡Suscríbete y accede a herramientas exclusivas para potenciar tu trading!
        </Typography>
        <Button
          component={RouterLink}
          href={paths.dashboard.subscriptions.plans}
          variant="contained"
          size="small"
          sx={{ width: '100%' }}
        >
          Mejora tu plan ahora
        </Button>
      </Box>
    </Box>
  );
}

function NavItemList({
  pathname,
  userSubscriptions,
}: {
  pathname: string;
  userSubscriptions: string[];
}): React.JSX.Element {
  return (
    <Stack component="ul" spacing={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {navItems.map((item) => (
        <NavItem
          key={item.id} // FIXED: Passing key separately
          pathname={pathname}
          {...item} // Spreading props (without key)
          userSubscriptions={userSubscriptions}
        />
      ))}
    </Stack>
  );
}

interface NavItemProps extends Omit<NavItemConfig, 'items'> {
  pathname: string;
  userSubscriptions: string[];
}

function NavItem({
  disabled,
  external,
  href,
  icon,
  matcher,
  pathname,
  title,
  requiredSubscription,
  userSubscriptions,
}: NavItemProps): React.JSX.Element {
  const active = isNavItemActive({ disabled, external, href, matcher, pathname });
  const Icon = icon ? navIcons[icon] : null;
  const isRestricted = requiredSubscription && !userSubscriptions.includes(requiredSubscription);

  const handleClick = (event: React.MouseEvent) => {
    if (isRestricted) {
      event.preventDefault(); // Prevent navigation if restricted
    }
  };

  return (
    <li>
      <Tooltip
        title={isRestricted ? `This feature requires the ${requiredSubscription} subscription.` : ''}
        disableInteractive
      >
        <Box
          {...(href && !isRestricted
            ? {
                component: external ? 'a' : RouterLink,
                href,
                target: external ? '_blank' : undefined,
                rel: external ? 'noreferrer' : undefined,
              }
            : { component: 'span', onClick: handleClick })} // FIXED: Prevents navigation on restricted items
          sx={{
            alignItems: 'center',
            borderRadius: 1,
            color: isRestricted ? 'var(--NavItem-disabled-color)' : 'var(--NavItem-color)',
            cursor: isRestricted ? 'not-allowed' : 'pointer',
            display: 'flex',
            flex: '0 0 auto',
            gap: 1,
            p: '6px 16px',
            position: 'relative',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            ...(isRestricted && {
              bgcolor: 'var(--NavItem-disabled-background)',
            }),
            ...(active && { bgcolor: 'var(--NavItem-active-background)', color: 'var(--NavItem-active-color)' }),
          }}
        >
          <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', flex: '0 0 auto' }}>
            {Icon ? (
              <Icon
                fill={active ? 'var(--NavItem-icon-active-color)' : 'var(--NavItem-icon-color)'}
                fontSize="var(--icon-fontSize-md)"
                weight={active ? 'fill' : undefined}
              />
            ) : null}
          </Box>
          <Box sx={{ flex: '1 1 auto' }}>
            <Typography
              component="span"
              sx={{ color: 'inherit', fontSize: '0.875rem', fontWeight: 500, lineHeight: '28px' }}
            >
              {title}
            </Typography>
          </Box>
        </Box>
      </Tooltip>
    </li>
  );
}
