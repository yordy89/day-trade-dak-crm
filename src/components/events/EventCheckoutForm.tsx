'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { eventService } from '@/services/api/event.service';
import {
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Grid,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

interface EventCheckoutFormProps {
  event: {
    _id: string;
    name: string;
    title?: string;
    type?: 'master_course' | 'community_event' | 'general';
    price?: number;
    requiresActiveSubscription?: boolean;
  };
  userId?: string;
  userEmail?: string;
  onSuccess?: () => void;
}

export function EventCheckoutForm({
  event,
  userId,
  userEmail,
  onSuccess,
}: EventCheckoutFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: userEmail || '',
    phoneNumber: '',
    tradingExperience: '',
    expectations: '',
    dietaryRestrictions: '',
    roomPreference: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email) {
        toast.error('Please fill in all required fields');
        setIsLoading(false);
        return;
      }

      // Prepare additional info based on event type
      const additionalInfo: any = {};
      if (event.type === 'master_course') {
        additionalInfo.tradingExperience = formData.tradingExperience;
        additionalInfo.expectations = formData.expectations;
      } else if (event.type === 'community_event') {
        additionalInfo.dietaryRestrictions = formData.dietaryRestrictions;
        additionalInfo.roomPreference = formData.roomPreference;
      }

      // Create checkout session
      const checkoutData = {
        eventId: event._id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        additionalInfo,
        userId,
      };

      const response = await eventService.createEventCheckout(checkoutData);
      
      // Redirect to Stripe hosted checkout
      if (response.url) {
        window.location.href = response.url;
      } else {
        throw new Error('No checkout URL received');
      }

      onSuccess?.();
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.message?.includes('active subscription required')) {
        toast.error('An active subscription is required to register for this event');
        router.push('/pricing');
      } else if (error.message?.includes('Event is full')) {
        toast.error('Sorry, this event is full');
      } else {
        toast.error('Failed to create checkout session');
      }
      setIsLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 800, mx: 'auto' }}>
      <CardHeader
        title={
          <Typography variant="h5" fontWeight={600}>
            Register for {event.title || event.name}
          </Typography>
        }
        subheader={
          event.price && event.price > 0 ? (
            <Typography variant="body2" color="text.secondary">
              Complete your registration to proceed to payment.
              <Typography component="span" fontWeight={600} sx={{ ml: 1 }}>
                Price: ${event.price}
              </Typography>
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Complete your registration for this event.
            </Typography>
          )
        }
      />
      <CardContent>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Optional"
                disabled={isLoading}
              />
            </Grid>

            {/* Master Course specific fields */}
            {event.type === 'master_course' && (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Trading Experience"
                    name="tradingExperience"
                    value={formData.tradingExperience}
                    onChange={handleInputChange}
                    multiline
                    rows={3}
                    placeholder="Tell us about your trading experience..."
                    disabled={isLoading}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="What do you expect from this course?"
                    name="expectations"
                    value={formData.expectations}
                    onChange={handleInputChange}
                    multiline
                    rows={3}
                    placeholder="Share your expectations..."
                    disabled={isLoading}
                  />
                </Grid>
              </>
            )}

            {/* Community Event specific fields */}
            {event.type === 'community_event' && (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Dietary Restrictions"
                    name="dietaryRestrictions"
                    value={formData.dietaryRestrictions}
                    onChange={handleInputChange}
                    placeholder="Any dietary restrictions we should know about?"
                    disabled={isLoading}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Room Preference"
                    name="roomPreference"
                    value={formData.roomPreference}
                    onChange={handleInputChange}
                    placeholder="Single, double, or no preference"
                    disabled={isLoading}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Button
                type="submit"
                disabled={isLoading}
                variant="contained"
                size="large"
                fullWidth
                startIcon={isLoading ? <CircularProgress size={20} /> : <CheckCircle />}
              >
                {isLoading ? (
                  'Processing...'
                ) : event.price && event.price > 0 ? (
                  `Proceed to Payment - $${event.price}`
                ) : (
                  'Complete Registration'
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}