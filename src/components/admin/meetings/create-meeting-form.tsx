'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { SubscriptionSelector } from './subscription-selector';
import { api } from '@/lib/api';
import { useSnackbar } from '@/hooks/use-snackbar';

interface CreateMeetingFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface MeetingFormData {
  title: string;
  description: string;
  scheduledAt: Date | null;
  duration: number;
  meetingType: string;
  maxParticipants: number;
  isPublic: boolean;
  requiresApproval: boolean;
  enableRecording: boolean;
  enableChat: boolean;
  enableScreenShare: boolean;
  enableWaitingRoom: boolean;
  // Subscription fields
  allowedSubscriptions: string[];
  restrictedToSubscriptions: boolean;
}

export function CreateMeetingForm({ open, onClose, onSuccess }: CreateMeetingFormProps) {
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<MeetingFormData>({
    title: '',
    description: '',
    scheduledAt: new Date(),
    duration: 60,
    meetingType: 'other',
    maxParticipants: 100,
    isPublic: false,
    requiresApproval: false,
    enableRecording: false,
    enableChat: true,
    enableScreenShare: true,
    enableWaitingRoom: false,
    allowedSubscriptions: [],
    restrictedToSubscriptions: false,
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Validate form
      if (!formData.title || !formData.scheduledAt) {
        showSnackbar('Please fill in all required fields', 'error');
        return;
      }

      // Prepare data for API
      const meetingData = {
        ...formData,
        scheduledAt: formData.scheduledAt.toISOString(),
      };

      // Create meeting via admin API
      await api.post('/admin/meetings', meetingData);
      
      showSnackbar('Meeting created successfully', 'success');
      onSuccess?.();
      onClose();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        scheduledAt: new Date(),
        duration: 60,
        meetingType: 'other',
        maxParticipants: 100,
        isPublic: false,
        requiresApproval: false,
        enableRecording: false,
        enableChat: true,
        enableScreenShare: true,
        enableWaitingRoom: false,
        allowedSubscriptions: [],
        restrictedToSubscriptions: false,
      });
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Failed to create meeting', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Meeting</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            label="Meeting Title"
            fullWidth
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Scheduled Date & Time"
              value={formData.scheduledAt}
              onChange={(date) => setFormData({ ...formData, scheduledAt: date })}
              slotProps={{ textField: { fullWidth: true, required: true } }}
            />
          </LocalizationProvider>

          <Stack direction="row" spacing={2}>
            <TextField
              label="Duration (minutes)"
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
              inputProps={{ min: 15, max: 480 }}
              sx={{ flex: 1 }}
            />

            <FormControl sx={{ flex: 1 }}>
              <InputLabel>Meeting Type</InputLabel>
              <Select
                value={formData.meetingType}
                onChange={(e) => setFormData({ ...formData, meetingType: e.target.value })}
                label="Meeting Type"
              >
                <MenuItem value="daily_live">Daily Live</MenuItem>
                <MenuItem value="mentorship">Mentorship</MenuItem>
                <MenuItem value="support">Support</MenuItem>
                <MenuItem value="special_event">Special Event</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <TextField
            label="Max Participants"
            type="number"
            value={formData.maxParticipants}
            onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) || 100 })}
            inputProps={{ min: 2, max: 500 }}
          />

          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                />
              }
              label="Public Meeting"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.requiresApproval}
                  onChange={(e) => setFormData({ ...formData, requiresApproval: e.target.checked })}
                />
              }
              label="Requires Approval"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.enableRecording}
                  onChange={(e) => setFormData({ ...formData, enableRecording: e.target.checked })}
                />
              }
              label="Enable Recording"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.enableChat}
                  onChange={(e) => setFormData({ ...formData, enableChat: e.target.checked })}
                />
              }
              label="Enable Chat"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.enableScreenShare}
                  onChange={(e) => setFormData({ ...formData, enableScreenShare: e.target.checked })}
                />
              }
              label="Enable Screen Share"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.enableWaitingRoom}
                  onChange={(e) => setFormData({ ...formData, enableWaitingRoom: e.target.checked })}
                />
              }
              label="Enable Waiting Room"
            />
          </Box>

          {/* Subscription Selector */}
          <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <SubscriptionSelector
              selectedSubscriptions={formData.allowedSubscriptions}
              onSubscriptionsChange={(subscriptions) => 
                setFormData({ ...formData, allowedSubscriptions: subscriptions })
              }
              restrictedToSubscriptions={formData.restrictedToSubscriptions}
              onRestrictedChange={(restricted) => 
                setFormData({ ...formData, restrictedToSubscriptions: restricted })
              }
            />
          </Box>

          {formData.restrictedToSubscriptions && formData.allowedSubscriptions.length === 0 && (
            <Alert severity="warning">
              No subscriptions selected. Only admins and the host will be able to join this meeting.
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading || !formData.title || !formData.scheduledAt}
        >
          {loading ? <CircularProgress size={24} /> : 'Create Meeting'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}