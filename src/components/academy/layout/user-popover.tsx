import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
// import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { SignOut as SignOutIcon } from '@phosphor-icons/react/dist/ssr/SignOut';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';

import { paths } from '@/paths';
import { useAuthStore } from '@/store/auth-store';
import { useMutation } from '@tanstack/react-query';
import API from '@/lib/axios';
import { logger } from '@/lib/default-logger';

export interface UserPopoverProps {
  anchorEl: Element | null;
  onClose: () => void;
  open: boolean;
}

// Create stable selectors outside the component
const selectUser = (state: any) => state.user;
const selectLogout = (state: any) => state.logout;

export function UserPopover({ anchorEl, onClose, open }: UserPopoverProps): React.JSX.Element {
  const router = useRouter();
  
  // Use stable selectors
  const user = useAuthStore(selectUser);
  const logout = useAuthStore(selectLogout);

  // Prevent infinite re-renders by using useCallback for logout
  const handleLogout = React.useCallback(() => {
    logout();
    setTimeout(() => {
      router.replace(paths.auth.signIn); // 🚨 Use replace instead of refresh to prevent infinite renders
    }, 100); // Small delay ensures Zustand state updates first
  }, [logout, router]);
  

  // Sign-out mutation using React Query
  const { mutate: signOut } = useMutation({
    mutationFn: async () => {
      const response = await API.get('/auth/signout');
      return response.data;
    },
    onSuccess: handleLogout, // Call handleLogout safely
    onError: (error) => {
      logger.error('Sign out error', error);
    },
  });

  const isLoading = false; // We don't need to show loading state here

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      onClose={onClose}
      open={open}
      slotProps={{ paper: { sx: { width: '240px' } } }}
    >
      <Box sx={{ p: '16px 20px ' }}>
        <Typography variant="subtitle1">{user?.firstName || 'Guest'}</Typography>
        <Typography color="text.secondary" variant="body2">
          {user?.email || 'guest@example.com'}
        </Typography>
      </Box>
      <Divider />
      <MenuList disablePadding sx={{ p: '8px', '& .MuiMenuItem-root': { borderRadius: 1 } }}>
        {/* <MenuItem component={RouterLink} href={paths.academy.settings} onClick={onClose}>
          <ListItemIcon>
            <GearSixIcon fontSize="var(--icon-fontSize-md)" />
          </ListItemIcon>
          Settings
        </MenuItem> */}
        <MenuItem component={RouterLink} href={paths.academy.account} onClick={onClose}>
          <ListItemIcon>
            <UserIcon fontSize="var(--icon-fontSize-md)" />
          </ListItemIcon>
          Perfil
        </MenuItem>
        <MenuItem onClick={() => signOut()} disabled={isLoading}>
          <ListItemIcon>
            <SignOutIcon fontSize="var(--icon-fontSize-md)" />
          </ListItemIcon>
          {isLoading ? 'Cerrando sesión...' : 'Cerrar Sesión'}
        </MenuItem>
      </MenuList>
    </Popover>
  );
}
