'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { CaretDown, CaretUp } from '@phosphor-icons/react';

import type { NavItemConfig } from '@/types/nav';
import { Role } from '@/types/user';
import { paths } from '@/paths';
import { isNavItemActive } from '@/lib/is-nav-item-active';
import { mapMembershipName } from '@/lib/memberships';
import { Logo } from '@/components/core/logo';

import { getNavItems } from './config';
import { navIcons } from './nav-icons';
import { useTranslation } from 'react-i18next';

export interface MobileNavProps {
  onClose: () => void;
  open: boolean;
}

// Create stable selector outside the component
const selectUser = (state: any) => state.user;

export function MobileNav({ open, onClose }: MobileNavProps): React.JSX.Element {
  const pathname = usePathname();
  const user = useAuthStore(selectUser);
  const userSubscriptions = user?.subscriptions ?? [];
  const userRole = user?.role || Role.USER;
  const { t } = useTranslation('academy');
  
  // Get nav items with translations
  const navItems = getNavItems(t);

  return (
    <Drawer
      anchor="left"
      PaperProps={{
        sx: {
          '--MobileNav-background': 'var(--mui-palette-common-black)',
          '--MobileNav-color': 'var(--mui-palette-common-white)',
          '--NavItem-color': 'var(--mui-palette-neutral-300)',
          '--NavItem-hover-background': 'rgba(255, 255, 255, 0.04)',
          '--NavItem-active-background': 'var(--mui-palette-primary-main)',
          '--NavItem-active-color': 'var(--mui-palette-primary-contrastText)',
          '--NavItem-disabled-color': 'var(--mui-palette-neutral-500)',
          '--NavItem-icon-color': 'var(--mui-palette-neutral-400)',
          '--NavItem-icon-active-color': 'var(--mui-palette-primary-contrastText)',
          '--NavItem-icon-disabled-color': 'var(--mui-palette-neutral-600)',
          bgcolor: 'var(--MobileNav-background)',
          color: 'var(--MobileNav-color)',
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '100%',
          width: '280px',
          zIndex: 'var(--MobileNav-zIndex)',
          '&::-webkit-scrollbar': { display: 'none' },
        },
      }}
      onClose={onClose}
      open={open}
    >
      <Stack spacing={2} sx={{ p: 3, alignItems: 'center' }}>
        <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-flex' }} onClick={onClose}>
          <Logo color="light" height={82} width={120} />
        </Box>
      </Stack>

      <Divider sx={{ borderColor: 'var(--mui-palette-neutral-700)' }} />

      <Box component="nav" sx={{ flex: '1 1 auto', p: '12px' }}>
        {renderNavItems({ pathname, items: navItems, userSubscriptions, userRole, onClose })}
      </Box>

      <Divider sx={{ borderColor: 'var(--mui-palette-neutral-700)' }} />

      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: 'var(--NavItem-color)', mb: 1 }}>
          {t('navigation.unlockFeatures')}
        </Typography>
        <Button
          component={RouterLink}
          href={paths.academy.subscriptions.plans}
          variant="contained"
          size="small"
          sx={{ width: '100%' }}
          onClick={onClose}
        >
          {t('account.upgradeSubscription')}
        </Button>
      </Box>
    </Drawer>
  );
}

function renderNavItems({
  items = [],
  pathname,
  userSubscriptions,
  userRole,
  onClose,
}: {
  items?: NavItemConfig[];
  pathname: string;
  userSubscriptions: string[];
  userRole: Role;
  onClose: () => void;
}): React.JSX.Element {
  const filteredItems = items.filter((item) => !item.requiredRole || item.requiredRole === userRole);

  return (
    <Stack component="ul" spacing={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {filteredItems.map((item) => (
        <NavItem
          key={item.id}
          pathname={pathname}
          {...item}
          userSubscriptions={userSubscriptions}
          userRole={userRole}
          onClose={onClose}
          items={item.items}
        />
      ))}
    </Stack>
  );
}

interface NavItemProps extends Omit<NavItemConfig, 'items'> {
  pathname: string;
  userSubscriptions: string[];
  userRole: Role;
  onClose: () => void;
  items?: NavItemConfig[];
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
  userRole,
  onClose,
  items,
}: NavItemProps): React.JSX.Element {
  const active = isNavItemActive({ disabled, external, href, matcher, pathname });
  const Icon = icon ? navIcons[icon] : null;
  const isRestricted =
    requiredSubscription && !userSubscriptions.includes(requiredSubscription) && userRole !== Role.ADMIN;
  const hasChildren = items && items.length > 0;
  const [open, setOpen] = React.useState(false);

  const handleClick = (event: React.MouseEvent) => {
    if (isRestricted) {
      event.preventDefault();
    } else if (hasChildren) {
      event.preventDefault();
      setOpen(!open);
    } else if (href) {
      onClose();
    }
  };

  const linkProps: any = {};

  if (href && !isRestricted && !hasChildren) {
    if (external) {
      linkProps.component = 'a';
      linkProps.href = href;
      linkProps.target = '_blank';
      linkProps.rel = 'noreferrer';
    } else {
      linkProps.component = RouterLink;
      linkProps.href = href;
    }
  }

  linkProps.onClick = handleClick;

  return (
    <li>
      <Tooltip
        title={isRestricted ? `Esta función requiere la suscripción ${mapMembershipName(requiredSubscription)}.` : ''}
        disableInteractive
      >
        <Box
          {...linkProps}
          sx={{
            alignItems: 'center',
            borderRadius: 1,
            color: isRestricted ? 'var(--NavItem-disabled-color)' : 'var(--NavItem-color)',
            cursor: isRestricted ? 'not-allowed' : 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            gap: 1,
            p: '6px 16px',
            textDecoration: 'none',
            ...(active && {
              bgcolor: 'var(--NavItem-active-background)',
              color: 'var(--NavItem-active-color)',
            }),
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {Icon ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', flex: '0 0 auto' }}>
                <Icon
                  fill={active ? 'var(--NavItem-icon-active-color)' : 'var(--NavItem-icon-color)'}
                  fontSize="var(--icon-fontSize-md)"
                  weight={active ? 'fill' : undefined}
                />
              </Box>
            ): null}
            <Typography
              component="span"
              sx={{ color: 'inherit', fontSize: '0.875rem', fontWeight: 500, lineHeight: '28px' }}
            >
              {title}
            </Typography>
          </Box>
          {hasChildren ? (open ? <CaretUp size={16} /> : <CaretDown size={16} />) : null}
        </Box>
      </Tooltip>

      {hasChildren && open ? (
        <Stack component="ul" spacing={0.5} sx={{ listStyle: 'none', pl: 4, mt: 1 }}>
          {items.map((subItem) => (
            <NavItem
              key={subItem.id}
              {...subItem}
              pathname={pathname}
              userSubscriptions={userSubscriptions}
              userRole={userRole}
              onClose={onClose}
              items={subItem.items}
            />
          ))}
        </Stack>
      ) : null}
    </li>
  );
}
