'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import API from '@/lib/axios';
import { useAuthStore } from '@/store/auth-store';


export function AccountInfo(): React.JSX.Element {
  const [isUploading, setIsUploading] = React.useState(false);
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user); 

  console.log('user', user);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);

    try {
      const response = await API.post(`user/${user?._id}/upload-profile-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data?.avatarUrl) {
        setUser({ ...response.data });
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <Avatar src={user?.profileImage || '/assets/avatar.png'} sx={{ height: '80px', width: '80px' }} />
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{`${user?.firstName || 'User'} ${user?.lastName || ''}`}</Typography>
          </Stack>
        </Stack>
      </CardContent>
      <Divider />
      <CardActions>
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          id="upload-avatar"
          onChange={handleFileChange}
        />
        <label htmlFor="upload-avatar" style={{ width: '100%' }}>
          <Button component="span" fullWidth variant="text" disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Upload Picture'}
          </Button>
        </label>
      </CardActions>
    </Card>
  );
}
