'use client';

import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button, Avatar, AvatarGroup, Chip } from '@mui/material';
import { Forum, Groups, School, EmojiEvents, Chat, Article } from '@mui/icons-material';
import { MainNavbar } from '@/components/landing/main-navbar';
import { useTranslation } from 'react-i18next';

const communityFeatures = [
  {
    icon: <Forum sx={{ fontSize: 48 }} />,
    title: 'Discussion Forums',
    description: 'Connect with traders, share strategies, and learn from each other',
    stats: '2,500+ Active Members',
  },
  {
    icon: <Groups sx={{ fontSize: 48 }} />,
    title: 'Trading Groups',
    description: 'Join specialized groups based on your trading style and interests',
    stats: '15+ Active Groups',
  },
  {
    icon: <School sx={{ fontSize: 48 }} />,
    title: 'Mentorship Program',
    description: 'Get paired with experienced traders for personalized guidance',
    stats: '50+ Mentors',
  },
  {
    icon: <EmojiEvents sx={{ fontSize: 48 }} />,
    title: 'Trading Challenges',
    description: 'Participate in monthly challenges and win prizes',
    stats: 'Monthly Competitions',
  },
];

const recentDiscussions = [
  {
    title: 'Best indicators for day trading?',
    author: 'John Trader',
    replies: 45,
    views: 1250,
    category: 'Technical Analysis',
  },
  {
    title: 'Risk management strategies that work',
    author: 'Sarah M.',
    replies: 32,
    views: 890,
    category: 'Risk Management',
  },
  {
    title: 'Options trading for beginners',
    author: 'Mike Options',
    replies: 67,
    views: 2100,
    category: 'Options',
  },
];

export default function CommunityPage() {
  const { t: _t } = useTranslation();

  return (
    <>
      <MainNavbar />
      <Box sx={{ pt: 18, pb: 10, minHeight: '100vh' }}>
        <Container maxWidth="lg">
          {/* Hero Section */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h2" component="h1" gutterBottom>
              Join Our Trading Community
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
              Connect, learn, and grow with thousands of traders worldwide
            </Typography>
            <AvatarGroup max={8} sx={{ justifyContent: 'center', mb: 3 }}>
              {[...Array(10)].map((_, i) => (
                <Avatar
                  key={`avatar-${i}`}
                  src={`/assets/avatar-${i + 1}.png`}
                  alt={`Member ${i + 1}`}
                />
              ))}
            </AvatarGroup>
            <Typography variant="body1" color="text.secondary">
              Join 5,000+ active traders in our community
            </Typography>
          </Box>

          {/* Features Grid */}
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {communityFeatures.map((feature) => (
              <Grid item xs={12} sm={6} md={3} key={feature.title}>
                <Card sx={{ height: '100%', textAlign: 'center' }}>
                  <CardContent>
                    <Box sx={{ color: 'primary.main', mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {feature.description}
                    </Typography>
                    <Chip label={feature.stats} size="small" color="primary" variant="outlined" />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Recent Discussions */}
          <Box sx={{ mb: 8 }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
              Trending Discussions
            </Typography>
            <Grid container spacing={3}>
              {recentDiscussions.map((discussion) => (
                <Grid item xs={12} key={discussion.title}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <Box sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <Article color="action" />
                            <Typography variant="h6">
                              {discussion.title}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                              by {discussion.author}
                            </Typography>
                            <Chip label={discussion.category} size="small" />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chat fontSize="small" color="action" />
                              <Typography variant="body2" color="text.secondary">
                                {discussion.replies}
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {discussion.views} views
                            </Typography>
                          </Box>
                        </Box>
                        <Button variant="outlined" size="small">
                          View Discussion
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* CTA Section */}
          <Card sx={{ 
            background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.1) 0%, rgba(21, 128, 61, 0.05) 100%)',
            textAlign: 'center',
            p: 6
          }}>
            <Typography variant="h4" gutterBottom>
              Ready to Join Our Community?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Get instant access to forums, groups, and exclusive content
            </Typography>
            <Button variant="contained" size="large">
              Join Community
            </Button>
          </Card>
        </Container>
      </Box>
    </>
  );
}