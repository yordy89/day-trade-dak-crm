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
      }}
    >
      {/* Logo Section */}
      <Box 
        sx={{ 
          p: 3, 
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: isDarkMode ? '#1a1a1a' : '#ffffff',
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
          bgcolor: isDarkMode ? '#1a1a1a' : '#ffffff',
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
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: isDarkMode ? '#1a1a1a' : '#ffffff' }}>
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