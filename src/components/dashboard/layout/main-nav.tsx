'use client';

import * as React from 'react';
import { useAuthStore } from '@/store/auth-store';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List';

import { usePopover } from '@/hooks/use-popover';
import { MobileNav } from './mobile-nav';
import { UserPopover } from './user-popover';

export function MainNav(): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);
  const user = useAuthStore((state) => state.user);

  const userPopover = usePopover<HTMLDivElement>();

  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid var(--mui-palette-divider)',
          backgroundColor: 'var(--mui-palette-common-black)',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--mui-zIndex-appBar)',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', px: 2 }}
        >
          {/* Left Section: Mobile Menu Button (Visible Only on Mobile & Tablet) */}
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <IconButton
              onClick={() => setOpenNav(true)} // Open Mobile Nav
              sx={{ display: { xs: 'flex', lg: 'none'} }} // Show only in mobile & tablet
            >
              <ListIcon size={24} color="white" />
            </IconButton>
          </Stack>

          {/* ✅ Centered Red Message */}
          <Typography
            variant="h6"
            sx={{
              color: 'error.main',
              fontWeight: 'bold',
              textAlign: 'center',
              flexGrow: 1,
              textShadow: '0 0 10px rgba(255, 0, 0, 0.6)',
              animation: 'fadeIn 2s ease-in-out, blink 1s infinite alternate',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': { transform: 'scale(1.05)' },
              '@keyframes fadeIn': { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
              '@keyframes blink': { '0%': { opacity: 1 }, '50%': { opacity: 0.8 }, '100%': { opacity: 1 } },
            }}
          >
            📢 Próxima Reunión de la FOMC – (17-18) de Junio 📅
          </Typography>

          {/* Right Section: Avatar */}
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <Avatar
              onClick={userPopover.handleOpen}
              ref={userPopover.anchorRef}
              src={user?.profileImage || '/assets/profile_fallback.jpg'}
              sx={{ cursor: 'pointer' }}
            />
          </Stack>
        </Stack>
      </Box>

      {/* User Popover */}
      <UserPopover anchorEl={userPopover.anchorRef.current} onClose={userPopover.handleClose} open={userPopover.open} />

      {/* Mobile Nav - Opens when clicking the button */}
      <MobileNav onClose={() => setOpenNav(false)} open={openNav} />
    </React.Fragment>
  );
}
