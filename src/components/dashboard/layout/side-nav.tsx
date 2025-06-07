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
import { CaretDown, CaretUp } from '@phosphor-icons/react';

import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';
import { isNavItemActive } from '@/lib/is-nav-item-active';
import { Logo } from '@/components/core/logo';
import { navItems } from './config';
import { navIcons } from './nav-icons';
import { Role } from '@/types/user';
import { mapMembershipName } from '@/lib/memberships';

export function SideNav(): React.JSX.Element {
  const pathname = usePathname();

  const userSubscriptions = useAuthStore((state) => state.user?.subscriptions ?? []);
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role || Role.USER;

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
        <NavItemList pathname={pathname} userSubscriptions={userSubscriptions} userRole={userRole} />
      </Box>
      <Divider sx={{ borderColor: 'var(--mui-palette-neutral-700)' }} />
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
  userRole,
}: {
  pathname: string;
  userSubscriptions: string[];
  userRole: Role;
}): React.JSX.Element {
  const filteredItems = navItems.filter(
    (item) => !item.requiredRole || item.requiredRole === userRole
  );

  return (
    <Stack component="ul" spacing={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {filteredItems.map((item) => (
        <NavItem
          key={item.id}
          pathname={pathname}
          {...item}
          userSubscriptions={userSubscriptions}
          userRole={userRole}
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
    }
  };

  let linkProps = {};
  if (href && !isRestricted && !hasChildren) {
    if (external) {
      linkProps = {
        component: 'a',
        href,
        target: '_blank',
        rel: 'noreferrer',
      };
    } else {
      linkProps = {
        component: RouterLink,
        href,
      };
    }
  } else {
    linkProps = {
      component: 'span',
    };
  }

  return (
    <li>
      <Tooltip
        title={isRestricted ? `Esta función requiere la suscripción ${mapMembershipName(requiredSubscription)}.` : ''}
        disableInteractive
      >
        <Box
          {...linkProps}
          onClick={hasChildren ? () => setOpen(!open) : handleClick}
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
            ) : null }
            <Typography
              component="span"
              sx={{ color: 'inherit', fontSize: '0.875rem', fontWeight: 500, lineHeight: '28px' }}
            >
              {title}
            </Typography>
          </Box>

          {hasChildren ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {open ? <CaretUp size={16} weight="bold" /> : <CaretDown size={16} weight="bold" />}
            </Box>
          ) : null}
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
              items={subItem.items}
            />
          ))}
        </Stack>
      ) : null}
    </li>
  );
}
