'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  FormHelperText,
  Switch,
  Button,
} from '@mui/material';
import { SubscriptionPlan } from '@/types/user';
import API from '@/lib/axios';

interface SubscriptionSelectorProps {
  selectedSubscriptions: string[];
  onSubscriptionsChange: (subscriptions: string[]) => void;
  restrictedToSubscriptions: boolean;
  onRestrictedChange: (restricted: boolean) => void;
}

interface SubscriptionPlanData {
  planId: string;
  displayName: string;
  displayNameES: string;
  type: string;
  features: string[];
  meetingPermissions: {
    hasLiveMeetingAccess: boolean;
  };
}

export function SubscriptionSelector({
  selectedSubscriptions,
  onSubscriptionsChange,
  restrictedToSubscriptions,
  onRestrictedChange,
}: SubscriptionSelectorProps) {
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchSubscriptionPlans();
  }, []);

  const fetchSubscriptionPlans = async () => {
    try {
      setLoading(true);
      const response = await API.get('/subscriptions/plans');
      setAvailablePlans(response.data);
    } catch (err) {
      setError('Failed to fetch subscription plans');
      console.error('Error fetching subscription plans:', err);
      // Fallback to hardcoded plans if API fails
      setAvailablePlans(getDefaultPlans());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultPlans = (): SubscriptionPlanData[] => {
    return Object.values(SubscriptionPlan).map(planId => ({
      planId,
      displayName: formatPlanName(planId),
      displayNameES: formatPlanName(planId),
      type: getPlanType(planId),
      features: [],
      meetingPermissions: {
        hasLiveMeetingAccess: ['LiveWeeklyManual', 'LiveWeeklyRecurring', 'MasterClases', 'LiveRecorded'].includes(planId),
      },
    }));
  };

  const formatPlanName = (planId: string): string => {
    return planId
      .replace(/(?<uppercase>[A-Z])/g, ' $<uppercase>')
      .trim()
      .replace(/^./, str => str.toUpperCase());
  };

  const getPlanType = (planId: string): string => {
    if (planId.includes('Live')) return 'live';
    if (planId.includes('Event')) return 'event';
    if (planId.includes('Master') || planId.includes('Classes')) return 'course';
    return 'other';
  };

  const handleToggleSubscription = (planId: string) => {
    const newSelected = selectedSubscriptions.includes(planId)
      ? selectedSubscriptions.filter(id => id !== planId)
      : [...selectedSubscriptions, planId];
    onSubscriptionsChange(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedSubscriptions.length === availablePlans.length) {
      onSubscriptionsChange([]);
    } else {
      onSubscriptionsChange(availablePlans.map(plan => plan.planId));
    }
  };

  const groupPlansByType = () => {
    const grouped: Record<string, SubscriptionPlanData[]> = {};
    availablePlans.forEach(plan => {
      if (!grouped[plan.type]) {
        grouped[plan.type] = [];
      }
      grouped[plan.type].push(plan);
    });
    return grouped;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && availablePlans.length === 0) {
    return <Alert severity="error">{error}</Alert>;
  }

  const groupedPlans = groupPlansByType();

  return (
    <Box>
      <FormControl component="fieldset" fullWidth>
        <FormLabel component="legend">Meeting Access Control</FormLabel>
        
        <FormControlLabel
          control={
            <Switch
              checked={restrictedToSubscriptions}
              onChange={(e) => onRestrictedChange(e.target.checked)}
              color="primary"
            />
          }
          label="Restrict to selected subscriptions only"
          sx={{ mb: 2 }}
        />
        
        {restrictedToSubscriptions ? <>
            <FormHelperText sx={{ mb: 2 }}>
              Only users with the selected subscriptions will be able to join this meeting.
              Admins and the host will always have access.
            </FormHelperText>

            <Box sx={{ mb: 2 }}>
              <Button
                size="small"
                onClick={handleSelectAll}
                sx={{ mb: 1 }}
              >
                {selectedSubscriptions.length === availablePlans.length ? 'Deselect All' : 'Select All'}
              </Button>
            </Box>

            {Object.entries(groupedPlans).map(([type, plans]) => (
              <Box key={type} sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, textTransform: 'capitalize' }}>
                  {type} Subscriptions
                </Typography>
                <FormGroup>
                  {plans.map((plan) => (
                    <FormControlLabel
                      key={plan.planId}
                      control={
                        <Checkbox
                          checked={selectedSubscriptions.includes(plan.planId)}
                          onChange={() => handleToggleSubscription(plan.planId)}
                          disabled={!restrictedToSubscriptions}
                        />
                      }
                      label={
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography>{plan.displayName}</Typography>
                          {plan.meetingPermissions.hasLiveMeetingAccess ? <Chip label="Live Access" size="small" color="primary" /> : null}
                        </Stack>
                      }
                    />
                  ))}
                </FormGroup>
              </Box>
            ))}

            {restrictedToSubscriptions && selectedSubscriptions.length === 0 ? (
              <Alert severity="warning" sx={{ mt: 2 }}>
                No subscriptions selected. Only admins and the host will be able to join this meeting.
              </Alert>
            ) : null}

            {selectedSubscriptions.length > 0 ? (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Selected subscriptions:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {selectedSubscriptions.map(planId => (
                    <Chip
                      key={planId}
                      label={availablePlans.find(p => p.planId === planId)?.displayName || planId}
                      size="small"
                      onDelete={() => handleToggleSubscription(planId)}
                    />
                  ))}
                </Stack>
              </Box>
            ) : null}
          </> : null}
      </FormControl>
    </Box>
  );
}