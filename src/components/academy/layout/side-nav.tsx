'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useClientAuth } from '@/hooks/use-client-auth';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import { alpha , useTheme as useMuiTheme } from '@mui/material/styles';
import { CaretDown, CaretUp, Crown, Lightning } from '@phosphor-icons/react';

import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';
import { isNavItemActive } from '@/lib/is-nav-item-active';
import { getNavItems } from './config';
import { navIcons } from './nav-icons';
import { Role } from '@/types/user';
import { useTranslation } from 'react-i18next';

export function SideNav(): React.JSX.Element {
  const pathname = usePathname();
  const theme = useMuiTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const { t } = useTranslation('academy');

  // Use auth hook for stable values
  const { userSubscriptions, userRole } = useClientAuth();

  return (
    <Box
      sx={{
        '--NavItem-color': (muiTheme) => muiTheme.palette.mode === 'dark' ? muiTheme.palette.grey[300] : muiTheme.palette.grey[700],
        '--NavItem-hover-background': (muiTheme) => muiTheme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
        '--NavItem-active-background': () => alpha(theme.palette.primary.main, 0.12),
        '--NavItem-active-color': 'var(--mui-palette-primary-main)',
        '--NavItem-disabled-color': (muiTheme) => muiTheme.palette.mode === 'dark' ? muiTheme.palette.grey[600] : muiTheme.palette.grey[400],
        '--NavItem-icon-color': (muiTheme) => muiTheme.palette.mode === 'dark' ? muiTheme.palette.grey[400] : muiTheme.palette.grey[600],
        '--NavItem-icon-active-color': 'var(--mui-palette-primary-main)',
        '--NavItem-icon-disabled-color': (muiTheme) => muiTheme.palette.mode === 'dark' ? muiTheme.palette.grey[700] : muiTheme.palette.grey[400],
        bgcolor: (muiTheme) => muiTheme.palette.mode === 'dark' ? muiTheme.palette.background.paper : muiTheme.palette.background.default,
        borderRight: '1px solid',
        borderColor: 'divider',
        color: 'text.primary',
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
        boxShadow: (muiTheme) => muiTheme.palette.mode === 'dark' ? muiTheme.shadows[8] : muiTheme.shadows[1],
        overflow: 'hidden',
      }}
    >
      {/* Floating Stock Symbols Background Effect */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {/* Floating Symbols */}
        {['AAPL', 'GOOGL', 'TSLA', 'AMZN', 'MSFT', 'SPY', 'QQQ', 'BTC'].map((symbol) => (
          <Typography
            key={symbol}
            sx={{
              position: 'absolute',
              fontSize: '12px',
              fontWeight: 600,
              color: theme.palette.text.primary,
              opacity: isDarkMode ? 0.06 : 0.04,
              top: `${15 + (symbol.charCodeAt(0) % 8 * 12)}%`,
              left: symbol.charCodeAt(0) % 2 === 0 ? '15%' : '65%',
              animation: `float${symbol.charCodeAt(0) % 3} ${20 + symbol.charCodeAt(0) % 10 * 2}s ease-in-out infinite`,
              '@keyframes float0': {
                '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
                '33%': { transform: 'translateY(-10px) translateX(5px)' },
                '66%': { transform: 'translateY(5px) translateX(-5px)' },
              },
              '@keyframes float1': {
                '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
                '33%': { transform: 'translateY(10px) translateX(-5px)' },
                '66%': { transform: 'translateY(-5px) translateX(5px)' },
              },
              '@keyframes float2': {
                '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
                '33%': { transform: 'translateY(-5px) translateX(-5px)' },
                '66%': { transform: 'translateY(10px) translateX(5px)' },
              },
            }}
          >
            {symbol}
          </Typography>
        ))}
        
        {/* Price Changes */}
        {['+2.4%', '-1.2%', '+0.8%', '+3.1%', '-0.5%'].map((change) => (
          <Typography
            key={change}
            sx={{
              position: 'absolute',
              fontSize: '10px',
              fontWeight: 500,
              color: change.startsWith('+') ? theme.palette.success.main : theme.palette.error.main,
              opacity: isDarkMode ? 0.08 : 0.06,
              top: `${25 + (change.charCodeAt(0) % 5 * 15)}%`,
              right: '20%',
              animation: `drift${change.charCodeAt(0) % 2} ${25 + change.charCodeAt(0) % 10 * 3}s ease-in-out infinite`,
              '@keyframes drift0': {
                '0%, 100%': { transform: 'translateX(0px)' },
                '50%': { transform: 'translateX(-10px)' },
              },
              '@keyframes drift1': {
                '0%, 100%': { transform: 'translateX(0px)' },
                '50%': { transform: 'translateX(10px)' },
              },
            }}
          >
            {change}
          </Typography>
        ))}
        
        {/* Candlesticks */}
        {[
          { type: 'green', top: '40%', left: '45%' },
          { type: 'red', top: '70%', left: '30%' },
          { type: 'green', top: '85%', left: '70%' },
          { type: 'red', top: '20%', left: '85%' },
        ].map((candle) => (
          <Box
            key={`${candle.type}-${candle.top}-${candle.left}`}
            sx={{
              position: 'absolute',
              top: candle.top,
              left: candle.left,
              opacity: isDarkMode ? 0.06 : 0.04,
              animation: `float${candle.top.charCodeAt(0) % 3} ${30 + candle.top.charCodeAt(0) % 10 * 4}s ease-in-out infinite`,
            }}
          >
            {/* Wick */}
            <Box
              sx={{
                width: '1px',
                height: '20px',
                bgcolor: candle.type === 'green' ? theme.palette.success.main : theme.palette.error.main,
                margin: '0 auto',
              }}
            />
            {/* Body */}
            <Box
              sx={{
                width: '8px',
                height: '12px',
                bgcolor: candle.type === 'green' ? theme.palette.success.main : theme.palette.error.main,
                mt: '-16px',
                borderRadius: '1px',
              }}
            />
          </Box>
        ))}
      </Box>
      <Box sx={{ height: 64, display: 'flex', flexDirection: 'column', justifyContent: 'center', px: 3, position: 'relative', zIndex: 1 }}>
        <Box 
          component={RouterLink} 
          href={paths.home} 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            mb: 0.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 500,
                color: isDarkMode ? 'white' : theme.palette.grey[800],
                letterSpacing: '0.02em',
                fontSize: '1.3rem',
              }}
            >
              DAY TRADE
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 800,
                color: theme.palette.primary.main,
                letterSpacing: '0.02em',
                fontSize: '1.3rem',
              }}
            >
              DAK
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ width: 60, mx: 'auto', borderColor: 'primary.main', opacity: 0.5, mb: 1 }} />
        <Typography 
          variant="caption" 
          align="center" 
          sx={{ 
            color: 'text.secondary',
            letterSpacing: '0.08em',
            fontWeight: 500,
            textTransform: 'uppercase',
            fontSize: '0.7rem',
          }}
        >
          {t('navigation.tradingAcademy')}
        </Typography>
      </Box>
      <Divider sx={{ borderColor: 'divider', position: 'relative', zIndex: 1 }} />
      <Box component="nav" sx={{ flex: '1 1 auto', p: '12px', position: 'relative', zIndex: 1 }}>
        <NavItemList pathname={pathname} userSubscriptions={userSubscriptions} userRole={userRole as Role} t={t} />
      </Box>
      <Divider sx={{ borderColor: 'divider', opacity: 0.5, position: 'relative', zIndex: 1 }} />
      <Box sx={{ p: 3, position: 'relative', zIndex: 1 }}>
        <Paper
          sx={{
            p: 2.5,
            background: (muiTheme) => 
              muiTheme.palette.mode === 'dark'
                ? `linear-gradient(135deg, ${alpha(muiTheme.palette.primary.dark, 0.2)} 0%, ${alpha(muiTheme.palette.primary.main, 0.1)} 100%)`
                : `linear-gradient(135deg, ${alpha(muiTheme.palette.primary.light, 0.15)} 0%, ${alpha(muiTheme.palette.primary.main, 0.05)} 100%)`,
            border: '1px solid',
            borderColor: () => alpha(theme.palette.primary.main, 0.2),
          }}
        >
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Crown size={24} color="var(--mui-palette-primary-main)" weight="fill" />
              <Typography variant="subtitle2" fontWeight={600}>
                {t('navigation.becomePremium')}
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              {t('navigation.unlockFeatures')}
            </Typography>
            <Button
              component={RouterLink}
              href={paths.academy.subscriptions.plans}
              variant="contained"
              size="small"
              fullWidth
              startIcon={<Lightning size={16} />}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                background: () => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                '&:hover': {
                  background: () => `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                },
              }}
            >
              {t('navigation.viewPlans')}
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}

function NavItemList({
  pathname,
  userSubscriptions,
  userRole,
  t,
}: {
  pathname: string;
  userSubscriptions: string[];
  userRole: Role;
  t: any;
}): React.JSX.Element {
  const navItems = getNavItems(t);
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
  badge,
  requiredSubscription,
  userSubscriptions,
  userRole,
  items,
}: NavItemProps): React.JSX.Element {
  const active = isNavItemActive({ disabled, external, href, matcher, pathname });
  const Icon = icon ? navIcons[icon] : null;
  const _isRestricted =
    requiredSubscription && !userSubscriptions.includes(requiredSubscription) && userRole !== Role.ADMIN;
  const hasChildren = items && items.length > 0;
  const [open, setOpen] = React.useState(false);

  const handleClick = (event: React.MouseEvent) => {
    if (hasChildren) {
      event.preventDefault();
      setOpen(!open);
    }
  };

  let linkProps = {};
  if (href && !hasChildren) {
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
      <Box
        {...linkProps}
        onClick={handleClick}
        sx={{
          alignItems: 'center',
          borderRadius: 2,
          color: (muiTheme) => muiTheme.palette.mode === 'dark' ? muiTheme.palette.grey[300] : muiTheme.palette.grey[700],
          cursor: 'pointer !important',
          display: 'flex',
          justifyContent: 'space-between',
          gap: 1.5,
          px: 2,
          py: 1.5,
          mx: 1,
          textDecoration: 'none',
          transition: 'all 0.2s ease',
          position: 'relative',
          '&:hover': {
            bgcolor: (muiTheme) => muiTheme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
            color: (muiTheme) => muiTheme.palette.mode === 'dark' ? muiTheme.palette.grey[100] : muiTheme.palette.grey[900],
          },
          ...(active && {
            bgcolor: 'var(--NavItem-active-background)',
            color: 'var(--NavItem-active-color)',
            fontWeight: 600,
            '&::before': {
              content: '""',
              position: 'absolute',
              left: -12,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 4,
              height: '70%',
              borderRadius: '0 4px 4px 0',
              bgcolor: 'primary.main',
            },
          }),
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {Icon ? (
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                flex: '0 0 auto',
                color: active 
                  ? 'primary.main' 
                  : (muiTheme) => muiTheme.palette.mode === 'dark' ? muiTheme.palette.grey[400] : muiTheme.palette.grey[600],
              }}
            >
              <Icon
                size={22}
                weight={active ? 'fill' : 'regular'}
              />
            </Box>
          ) : null }
          <Typography
            component="span"
            sx={{ color: 'inherit', fontSize: '0.875rem', fontWeight: 500, lineHeight: '28px' }}
          >
            {title}
          </Typography>
          {badge ? <Chip
              label={badge}
              size="small"
              sx={{
                ml: 1,
                height: 20,
                fontSize: '0.65rem',
                fontWeight: 700,
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                '& .MuiChip-label': {
                  px: 1,
                },
              }}
            /> : null}
        </Box>

        {hasChildren ? <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {open ? <CaretUp size={16} weight="bold" /> : <CaretDown size={16} weight="bold" />}
          </Box> : null}
      </Box>

      {hasChildren && open ? (
        <Stack component="ul" spacing={0.5} sx={{ listStyle: 'none', pl: 2, mt: 1, position: 'relative' }}>
          {items.map((subItem) => (
            <Box key={subItem.id} sx={{ position: 'relative' }}>
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '16px',
                  height: '1px',
                  bgcolor: 'divider',
                  opacity: 0.5,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: -8,
                    width: '1px',
                    height: '16px',
                    bgcolor: 'divider',
                    opacity: 0.5,
                  }
                }}
              />
              <Box sx={{ pl: 2.5 }}>
                <NavItem
                  {...subItem}
                  pathname={pathname}
                  userSubscriptions={userSubscriptions}
                  userRole={userRole}
                  items={subItem.items}
                />
              </Box>
            </Box>
          ))}
        </Stack>
      ) : null}
    </li>
  );
}
