'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Chip,
  IconButton,
  Button,
  Stack,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Skeleton,
  Badge,
  useTheme,
  alpha,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  PlayCircleOutline,
  Lock,
  Search,
  FilterList,
  Sort,
  ViewModule,
  ViewList,
  CheckCircle,
  Schedule,
  TrendingUp,
  NewReleases,
  Bookmark,
  BookmarkBorder,
} from '@mui/icons-material';
import { format, formatDistanceToNow } from 'date-fns';

export interface Video {
  id: string;
  key: string;
  title: string;
  description?: string;
  thumbnail?: string;
  duration?: number;
  category: string;
  instructor?: string;
  uploadDate: Date;
  views: number;
  signedUrl: string;
  captionsUrl?: string;
  isLocked?: boolean;
  progress?: number;
  isCompleted?: boolean;
  isBookmarked?: boolean;
  isNew?: boolean;
  isTrending?: boolean;
}

interface ProfessionalVideoListProps {
  videos: Video[];
  loading?: boolean;
  error?: any;
  onVideoSelect?: (video: Video) => void;
  onBookmark?: (videoId: string) => void;
  viewMode?: 'grid' | 'list';
}

const categories = [
  'All',
  'Trading Basics',
  'Technical Analysis',
  'Risk Management',
  'Advanced Strategies',
  'Market Psychology',
  'Live Sessions',
];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'progress', label: 'Progress' },
];

export function ProfessionalVideoList({
  videos,
  loading,
  error,
  onVideoSelect,
  onBookmark,
  viewMode: initialViewMode = 'grid',
}: ProfessionalVideoListProps) {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialViewMode);
  const [showFilters, setShowFilters] = useState(false);

  const filteredAndSortedVideos = useMemo(() => {
    let filtered = videos.filter(video => {
      const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort videos
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => a.uploadDate.getTime() - b.uploadDate.getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'progress':
        filtered.sort((a, b) => (b.progress || 0) - (a.progress || 0));
        break;
    }

    return filtered;
  }, [videos, searchQuery, selectedCategory, sortBy]);

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getVideoThumbnail = (video: Video) => {
    if (video.thumbnail) return video.thumbnail;
    
    // Generate a placeholder based on category
    const categoryColors: Record<string, string> = {
      'Trading Basics': '#3b82f6',
      'Technical Analysis': '#8b5cf6',
      'Risk Management': '#ef4444',
      'Advanced Strategies': '#f59e0b',
      'Market Psychology': '#ec4899',
      'Live Sessions': '#10b981',
    };
    
    const color = categoryColors[video.category] || '#6b7280';
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225'%3E%3Crect width='400' height='225' fill='${encodeURIComponent(color)}'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-family='Arial' font-size='24' font-weight='bold'%3E${encodeURIComponent(video.category)}%3C/text%3E%3C/svg%3E`;
  };

  if (loading) {
    return (
      <Box>
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map(n => (
            <Grid item xs={12} sm={6} md={4} key={n}>
              <Card>
                <Skeleton variant="rectangular" height={180} />
                <CardContent>
                  <Skeleton variant="text" height={32} />
                  <Skeleton variant="text" width="60%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Typography color="error" align="center">
            Error loading videos. Please try again later.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack spacing={2}>
            {/* Search and View Toggle */}
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
              
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
              </Button>
              
              <Stack direction="row">
                <IconButton
                  onClick={() => setViewMode('grid')}
                  color={viewMode === 'grid' ? 'primary' : 'default'}
                >
                  <ViewModule />
                </IconButton>
                <IconButton
                  onClick={() => setViewMode('list')}
                  color={viewMode === 'list' ? 'primary' : 'default'}
                >
                  <ViewList />
                </IconButton>
              </Stack>
            </Stack>

            {/* Filters */}
            {showFilters && (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    label="Category"
                  >
                    {categories.map(category => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    label="Sort By"
                  >
                    {sortOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Results Count */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Showing {filteredAndSortedVideos.length} of {videos.length} videos
      </Typography>

      {/* Video Grid/List */}
      {viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {filteredAndSortedVideos.map(video => (
            <Grid item xs={12} sm={6} md={4} key={video.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: video.isLocked ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: video.isLocked ? 'none' : 'translateY(-4px)',
                    boxShadow: video.isLocked ? 1 : 6,
                  },
                }}
                onClick={() => !video.isLocked && onVideoSelect?.(video)}
              >
                {/* Thumbnail */}
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={getVideoThumbnail(video)}
                    alt={video.title}
                    sx={{
                      opacity: video.isLocked ? 0.5 : 1,
                    }}
                  />
                  
                  {/* Overlay Icons */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {video.isLocked ? (
                      <Lock sx={{ fontSize: 48, color: 'white' }} />
                    ) : (
                      <IconButton
                        sx={{
                          backgroundColor: alpha(theme.palette.background.paper, 0.9),
                          '&:hover': {
                            backgroundColor: theme.palette.background.paper,
                          },
                        }}
                      >
                        <PlayCircleOutline sx={{ fontSize: 48 }} />
                      </IconButton>
                    )}
                  </Box>

                  {/* Badges */}
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                    }}
                  >
                    {video.isNew && (
                      <Chip
                        label="New"
                        size="small"
                        icon={<NewReleases />}
                        sx={{
                          backgroundColor: alpha(theme.palette.error.main, 0.9),
                          color: 'white',
                        }}
                      />
                    )}
                    {video.isTrending && (
                      <Chip
                        label="Trending"
                        size="small"
                        icon={<TrendingUp />}
                        sx={{
                          backgroundColor: alpha(theme.palette.warning.main, 0.9),
                          color: 'white',
                        }}
                      />
                    )}
                  </Stack>

                  {/* Duration */}
                  {video.duration && (
                    <Chip
                      label={formatDuration(video.duration)}
                      size="small"
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        color: 'white',
                      }}
                    />
                  )}

                  {/* Progress Bar */}
                  {video.progress !== undefined && video.progress > 0 && (
                    <LinearProgress
                      variant="determinate"
                      value={video.progress}
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                      }}
                    />
                  )}
                </Box>

                <CardContent sx={{ flex: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {video.title}
                      </Typography>
                      
                      {video.instructor && (
                        <Typography variant="body2" color="text.secondary">
                          {video.instructor}
                        </Typography>
                      )}
                    </Box>

                    <Stack>
                      {video.isCompleted && (
                        <Tooltip title="Completed">
                          <CheckCircle color="success" sx={{ fontSize: 20 }} />
                        </Tooltip>
                      )}
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onBookmark?.(video.id);
                        }}
                      >
                        {video.isBookmarked ? (
                          <Bookmark color="primary" sx={{ fontSize: 20 }} />
                        ) : (
                          <BookmarkBorder sx={{ fontSize: 20 }} />
                        )}
                      </IconButton>
                    </Stack>
                  </Stack>

                  <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Chip label={video.category} size="small" />
                    <Typography variant="caption" color="text.secondary">
                      {video.views.toLocaleString()} views
                    </Typography>
                  </Stack>
                  
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {formatDistanceToNow(video.uploadDate, { addSuffix: true })}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        // List View
        <Stack spacing={2}>
          {filteredAndSortedVideos.map(video => (
            <Card
              key={video.id}
              sx={{
                cursor: video.isLocked ? 'not-allowed' : 'pointer',
                opacity: video.isLocked ? 0.7 : 1,
              }}
              onClick={() => !video.isLocked && onVideoSelect?.(video)}
            >
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <Box sx={{ position: 'relative' }}>
                      <img
                        src={getVideoThumbnail(video)}
                        alt={video.title}
                        style={{
                          width: '100%',
                          height: 'auto',
                          borderRadius: 8,
                        }}
                      />
                      {video.isLocked && (
                        <Lock
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            color: 'white',
                          }}
                        />
                      )}
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={9}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight={600}>
                          {video.title}
                        </Typography>
                        {video.description && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              mt: 1,
                            }}
                          >
                            {video.description}
                          </Typography>
                        )}
                        
                        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                          <Chip label={video.category} size="small" />
                          {video.duration && (
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <Schedule sx={{ fontSize: 16 }} />
                              <Typography variant="caption">
                                {formatDuration(video.duration)}
                              </Typography>
                            </Stack>
                          )}
                          <Typography variant="caption" color="text.secondary">
                            {video.views.toLocaleString()} views
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDistanceToNow(video.uploadDate, { addSuffix: true })}
                          </Typography>
                        </Stack>

                        {video.progress !== undefined && video.progress > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                              <Typography variant="caption" color="text.secondary">
                                Progress
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {Math.round(video.progress)}%
                              </Typography>
                            </Stack>
                            <LinearProgress
                              variant="determinate"
                              value={video.progress}
                              sx={{ height: 6, borderRadius: 3 }}
                            />
                          </Box>
                        )}
                      </Box>
                      
                      <Stack direction="row" spacing={1} alignItems="center">
                        {video.isCompleted && (
                          <Tooltip title="Completed">
                            <CheckCircle color="success" />
                          </Tooltip>
                        )}
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            onBookmark?.(video.id);
                          }}
                        >
                          {video.isBookmarked ? (
                            <Bookmark color="primary" />
                          ) : (
                            <BookmarkBorder />
                          )}
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}