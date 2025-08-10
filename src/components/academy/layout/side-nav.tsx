'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useClientAuth } from '@/hooks/use-client-auth';
import {
  Box,
  Button,
  Divider,
  Stack,
  Typography,
  Paper,
  Chip,
  IconButton,
  useMediaQuery,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { SafeDrawer } from '@/components/ui/safe-drawer';
import { alpha, useTheme as useMuiTheme } from '@mui/material/styles';
import { 
  CaretDown, 
  CaretUp, 
  Crown, 
  Lightning,
  List as MenuIcon,
  X as CloseIcon 
} from '@phosphor-icons/react';

import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';
import { isNavItemActive } from '@/lib/is-nav-item-active';
import { getNavItems } from './config';
import { navIcons } from './nav-icons';
import { Role } from '@/types/user';
import { useTranslation } from 'react-i18next';

// Export the context and provider for mobile menu state
export const MobileMenuContext = React.createContext<{
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}>({
  mobileOpen: false,
  setMobileOpen: () => {},
});

export function useMobileMenu() {
  return React.useContext(MobileMenuContext);
}

export function SideNav(): React.JSX.Element {
  const pathname = usePathname();
  const theme = useMuiTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const { t } = useTranslation('academy');
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Use auth hook for stable values
  const { userSubscriptions, userRole } = useClientAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Provide the mobile menu state to children
  React.useEffect(() => {
    // @ts-ignore
    if (window.toggleAcademyMobileMenu) {
      // @ts-ignore
      window.toggleAcademyMobileMenu = handleDrawerToggle;
    }
  }, [mobileOpen]);

  // Add global function for toggling menu
  React.useEffect(() => {
    // @ts-ignore
    window.toggleAcademyMobileMenu = () => {
      setMobileOpen(prev => !prev);
    };
    
    return () => {
      // @ts-ignore
      delete window.toggleAcademyMobileMenu;
    };
  }, []);

  const sidebarContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: isDarkMode ? '#1a1a1a' : '#ffffff',
        borderRight: '1px solid',
        borderColor: 'divider',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Stock Ticker Background Effect */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          opacity: isDarkMode ? 0.08 : 0.06,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        {/* Stock Tickers */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            fontSize: '0.75rem',
            fontFamily: 'monospace',
            color: '#16a34a',
            transform: 'rotate(-45deg)',
            fontWeight: 600,
          }}
        >
          SPY +0.78%
        </Box>
        <Box
          sx={{
            position: 'absolute',
            top: '25%',
            right: '15%',
            fontSize: '0.7rem',
            fontFamily: 'monospace',
            color: '#22c55e',
            transform: 'rotate(30deg)',
            fontWeight: 600,
          }}
        >
          QQQ ↑ 574.55
        </Box>
        <Box
          sx={{
            position: 'absolute',
            bottom: '30%',
            left: '20%',
            fontSize: '0.8rem',
            fontFamily: 'monospace',
            color: '#16a34a',
            fontWeight: 600,
          }}
        >
          AAPL 229.35
        </Box>
        <Box
          sx={{
            position: 'absolute',
            top: '45%',
            left: '40%',
            fontSize: '0.65rem',
            fontFamily: 'monospace',
            color: '#22c55e',
            transform: 'rotate(-15deg)',
            fontWeight: 600,
          }}
        >
          NVDA +1.07%
        </Box>
        <Box
          sx={{
            position: 'absolute',
            bottom: '15%',
            right: '25%',
            fontSize: '0.75rem',
            fontFamily: 'monospace',
            color: '#16a34a',
            transform: 'rotate(45deg)',
            fontWeight: 600,
          }}
        >
          MSFT 522.04
        </Box>
        
        {/* Candlestick Patterns */}
        <svg 
          width="100%" 
          height="100%" 
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          {/* Candlestick 1 */}
          <g transform="translate(50, 150)">
            <line x1="0" y1="0" x2="0" y2="40" stroke="#22c55e" strokeWidth="2" />
            <rect x="-4" y="10" width="8" height="20" fill="#22c55e" />
          </g>
          
          {/* Candlestick 2 */}
          <g transform="translate(80, 180)">
            <line x1="0" y1="0" x2="0" y2="35" stroke="#ef4444" strokeWidth="2" />
            <rect x="-4" y="8" width="8" height="18" fill="none" stroke="#ef4444" strokeWidth="2" />
          </g>
          
          {/* Candlestick 3 */}
          <g transform="translate(110, 160)">
            <line x1="0" y1="0" x2="0" y2="45" stroke="#22c55e" strokeWidth="2" />
            <rect x="-4" y="12" width="8" height="22" fill="#22c55e" />
          </g>
          
          {/* Candlestick 4 */}
          <g transform="translate(140, 170)">
            <line x1="0" y1="0" x2="0" y2="38" stroke="#22c55e" strokeWidth="2" />
            <rect x="-4" y="9" width="8" height="20" fill="#22c55e" />
          </g>
          
          {/* Trading Line Chart */}
          <path
            d="M 20 250 Q 60 240 100 220 T 180 200 Q 220 190 260 180"
            stroke="#16a34a"
            strokeWidth="2"
            fill="none"
            opacity="0.8"
          />
          
          {/* Another Trading Line */}
          <path
            d="M 10 350 L 50 340 L 90 345 L 130 330 L 170 335 L 210 320"
            stroke="#22c55e"
            strokeWidth="1.5"
            fill="none"
            opacity="0.7"
          />
        </svg>
        
        {/* ETF Labels */}
        <Box
          sx={{
            position: 'absolute',
            top: '60%',
            right: '10%',
            fontSize: '0.9rem',
            fontFamily: 'monospace',
            color: '#f59e0b',
            fontWeight: 'bold',
          }}
        >
          ETF
        </Box>
        <Box
          sx={{
            position: 'absolute',
            top: '75%',
            left: '15%',
            fontSize: '0.85rem',
            fontFamily: 'monospace',
            color: '#3b82f6',
            fontWeight: 'bold',
            transform: 'rotate(-30deg)',
          }}
        >
          STOCKS
        </Box>
      </Box>

      {/* Logo Section */}
      <Box 
        sx={{ 
          p: 3, 
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'transparent',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box 
            component={RouterLink} 
            href={paths.home} 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              textDecoration: 'none',
            }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700,
                color: isDarkMode ? '#ffffff' : '#000000',
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
                ml: 0.5,
              }}
            >
              DAK
            </Typography>
          </Box>
          {/* Close button for mobile */}
          {isMobile && (
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
              }}
            >
              <CloseIcon size={20} />
            </IconButton>
          )}
        </Stack>
        <Typography 
          variant="caption" 
          align="center" 
          display="block"
          sx={{ 
            color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
            letterSpacing: '0.08em',
            fontWeight: 500,
            textTransform: 'uppercase',
            fontSize: '0.7rem',
            mt: 1,
          }}
        >
          {t('navigation.tradingAcademy')}
        </Typography>
      </Box>

      {/* Navigation Items */}
      <Box 
        component="nav" 
        sx={{ 
          flex: '1 1 auto', 
          overflowY: 'auto',
          overflowX: 'hidden',
          p: 2,
          bgcolor: 'transparent',
          position: 'relative',
          zIndex: 1,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
            borderRadius: '3px',
            '&:hover': {
              bgcolor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
            },
          },
        }}
      >
        <NavItemList 
          pathname={pathname} 
          userSubscriptions={userSubscriptions} 
          userRole={userRole as Role} 
          t={t}
          onItemClick={() => isMobile && setMobileOpen(false)}
        />
      </Box>

      {/* Premium Upgrade Section */}
      <Box sx={{ 
        p: 2, 
        borderTop: '1px solid', 
        borderColor: 'divider', 
        bgcolor: 'transparent',
        position: 'relative',
        zIndex: 1,
      }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            background: isDarkMode
              ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.2)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`
              : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.15)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
            border: '1px solid',
            borderColor: alpha(theme.palette.primary.main, 0.2),
          }}
        >
          <Stack spacing={1.5}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Crown size={20} color={theme.palette.primary.main} weight="fill" />
              <Typography variant="subtitle2" fontWeight={600} color={isDarkMode ? '#ffffff' : '#000000'}>
                {t('navigation.becomePremium')}
              </Typography>
            </Stack>
            <Typography variant="caption" color={isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'}>
              {t('navigation.unlockFeatures')}
            </Typography>
            <Button
              component={RouterLink}
              href={paths.academy.subscriptions.plans}
              variant="contained"
              size="small"
              fullWidth
              startIcon={<Lightning size={16} />}
              onClick={() => isMobile && setMobileOpen(false)}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                bgcolor: theme.palette.primary.main,
                color: '#ffffff',
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
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

  // Export the toggle function for external use
  React.useEffect(() => {
    // @ts-ignore
    window.academySidebarToggle = handleDrawerToggle;
    return () => {
      // @ts-ignore
      delete window.academySidebarToggle;
    };
  }, []);

  if (isMobile) {
    return (
      <SafeDrawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            bgcolor: isDarkMode ? '#1a1a1a' : '#ffffff',
          },
        }}
      >
        {sidebarContent}
      </SafeDrawer>
    );
  }

  return (
    <Box
      sx={{
        display: { xs: 'none', lg: 'block' },
        width: 'var(--SideNav-width)',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1200,
        bgcolor: isDarkMode ? '#1a1a1a' : '#ffffff',
        boxShadow: theme.shadows[4],
      }}
    >
      {sidebarContent}
    </Box>
  );
}

interface NavItemListProps {
  pathname: string;
  userSubscriptions: string[];
  userRole: Role;
  t: any;
  onItemClick?: () => void;
}

function NavItemList({
  pathname,
  userSubscriptions,
  userRole,
  t,
  onItemClick,
}: NavItemListProps): React.JSX.Element {
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const navItems = getNavItems(t);
  
  // Filter items based on role and mobile visibility
  const filteredItems = navItems.filter(
    (item) => {
      // Filter out home item on desktop
      if (item.id === 'home' && !isMobile) return false;
      // Check role requirements
      return !item.requiredRole || item.requiredRole === userRole;
    }
  );

  return (
    <List sx={{ p: 0 }}>
      {filteredItems.map((item) => (
        <NavItem
          key={item.id}
          pathname={pathname}
          {...item}
          userSubscriptions={userSubscriptions}
          userRole={userRole}
          items={item.items}
          onItemClick={onItemClick}
        />
      ))}
    </List>
  );
}

interface NavItemProps extends Omit<NavItemConfig, 'items'> {
  pathname: string;
  userSubscriptions: string[];
  userRole: Role;
  items?: NavItemConfig[];
  onItemClick?: () => void;
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
  onItemClick,
}: NavItemProps): React.JSX.Element {
  const theme = useMuiTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const active = isNavItemActive({ disabled, external, href, matcher, pathname });
  const Icon = icon ? navIcons[icon] : null;
  const hasChildren = items && items.length > 0;
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    if (hasChildren) {
      setOpen(!open);
    } else if (onItemClick && href) {
      onItemClick();
    }
  };

  const content = (
    <ListItemButton
      component={href && !hasChildren ? RouterLink : 'div'}
      href={href && !hasChildren ? href : undefined}
      onClick={handleClick}
      disabled={disabled}
      sx={{
        borderRadius: 1,
        mb: 0.5,
        color: isDarkMode ? '#ffffff' : '#000000',
        bgcolor: active 
          ? alpha(theme.palette.primary.main, isDarkMode ? 0.2 : 0.1)
          : 'transparent',
        '&:hover': {
          bgcolor: active
            ? alpha(theme.palette.primary.main, isDarkMode ? 0.25 : 0.15)
            : isDarkMode 
              ? 'rgba(255,255,255,0.08)' 
              : 'rgba(0,0,0,0.04)',
        },
        '&.Mui-disabled': {
          opacity: 0.5,
        },
        position: 'relative',
        ...(active && {
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 3,
            height: '60%',
            borderRadius: '0 3px 3px 0',
            bgcolor: theme.palette.primary.main,
          },
        }),
      }}
    >
      {Icon && (
        <ListItemIcon 
          sx={{ 
            minWidth: 40,
            color: active 
              ? theme.palette.primary.main
              : isDarkMode 
                ? 'rgba(255,255,255,0.7)' 
                : 'rgba(0,0,0,0.6)',
          }}
        >
          <Icon size={20} weight={active ? 'fill' : 'regular'} />
        </ListItemIcon>
      )}
      <ListItemText 
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: active ? 600 : 500,
                color: active 
                  ? theme.palette.primary.main
                  : isDarkMode 
                    ? 'rgba(255,255,255,0.9)' 
                    : 'rgba(0,0,0,0.8)',
              }}
            >
              {title}
            </Typography>
            {badge && (
              <Chip
                label={badge}
                size="small"
                sx={{
                  height: 18,
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  bgcolor: theme.palette.primary.main,
                  color: '#ffffff',
                }}
              />
            )}
          </Box>
        }
      />
      {hasChildren && (
        <Box sx={{ color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
          {open ? <CaretUp size={16} /> : <CaretDown size={16} />}
        </Box>
      )}
    </ListItemButton>
  );

  if (hasChildren) {
    return (
      <ListItem disablePadding sx={{ display: 'block' }}>
        {content}
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 4 }}>
            {items?.map((child) => (
              <NavItem
                key={child.id}
                pathname={pathname}
                {...child}
                userSubscriptions={userSubscriptions}
                userRole={userRole}
                onItemClick={onItemClick}
              />
            ))}
          </List>
        </Collapse>
      </ListItem>
    );
  }

  return <ListItem disablePadding>{content}</ListItem>;
}