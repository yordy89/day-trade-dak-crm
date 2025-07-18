'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Collapse,
  IconButton,
  Chip,
  LinearProgress,
  Divider,
  Button,
  Stack,
  alpha,
  useTheme,
} from '@mui/material';
import {
  PlayCircleOutline,
  CheckCircle,
  Lock,
  ExpandMore,
  ExpandLess,
  Download,
  Assignment,
  Quiz,
  Timer,
  Description,
} from '@mui/icons-material';
import { useParams, useRouter } from 'next/navigation';
import { ProfessionalVideoPlayer } from '@/components/academy/video/professional-video-player';

interface CourseModule {
  id: string;
  title: string;
  description: string;
  videos: Video[];
  resources?: Resource[];
  quiz?: Quiz;
}

interface Video {
  id: string;
  title: string;
  duration: number;
  isCompleted?: boolean;
  isLocked?: boolean;
  description?: string;
  thumbnail?: string;
}

interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'worksheet';
  url: string;
}

interface Quiz {
  id: string;
  title: string;
  questions: number;
  passingScore: number;
  isCompleted?: boolean;
  score?: number;
}

// Mock data - replace with real API call
const courseData = {
  id: 'trading-fundamentals',
  title: 'Trading Fundamentals Masterclass',
  instructor: 'Alex Thompson',
  modules: [
    {
      id: 'module-1',
      title: 'Introduction to Trading',
      description: 'Learn the basics of trading and market fundamentals',
      videos: [
        {
          id: 'video-1',
          title: 'Welcome to Trading',
          duration: 600,
          isCompleted: true,
          description: 'An introduction to the world of trading',
        },
        {
          id: 'video-2',
          title: 'Market Types and Structures',
          duration: 1200,
          isCompleted: true,
          description: 'Understanding different market types',
        },
        {
          id: 'video-3',
          title: 'Trading Terminology',
          duration: 900,
          isCompleted: false,
          description: 'Essential trading terms you need to know',
        },
      ],
      resources: [
        {
          id: 'res-1',
          title: 'Trading Glossary PDF',
          type: 'pdf' as const,
          url: '/resources/glossary.pdf',
        },
        {
          id: 'res-2',
          title: 'Market Types Worksheet',
          type: 'worksheet' as const,
          url: '/resources/worksheet-1.pdf',
        },
      ],
      quiz: {
        id: 'quiz-1',
        title: 'Module 1 Quiz',
        questions: 10,
        passingScore: 70,
        isCompleted: true,
        score: 85,
      },
    },
    {
      id: 'module-2',
      title: 'Technical Analysis Basics',
      description: 'Understanding charts, patterns, and indicators',
      videos: [
        {
          id: 'video-4',
          title: 'Introduction to Charts',
          duration: 1500,
          isCompleted: false,
          isLocked: false,
        },
        {
          id: 'video-5',
          title: 'Candlestick Patterns',
          duration: 1800,
          isCompleted: false,
          isLocked: true,
        },
        {
          id: 'video-6',
          title: 'Support and Resistance',
          duration: 1200,
          isCompleted: false,
          isLocked: true,
        },
      ],
    },
    {
      id: 'module-3',
      title: 'Risk Management',
      description: 'Protecting your capital and managing risk',
      videos: [
        {
          id: 'video-7',
          title: 'Position Sizing',
          duration: 1000,
          isCompleted: false,
          isLocked: true,
        },
        {
          id: 'video-8',
          title: 'Stop Loss Strategies',
          duration: 1200,
          isCompleted: false,
          isLocked: true,
        },
      ],
    },
  ],
};

export default function CourseVideoPage() {
  const theme = useTheme();
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const videoId = params.videoId as string;

  const [expandedModules, setExpandedModules] = useState<string[]>(['module-1', 'module-2']);
  const [completedVideos, setCompletedVideos] = useState<string[]>(['video-1', 'video-2']);
  const [bookmarks, setBookmarks] = useState<{ time: number; note: string }[]>([]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleVideoComplete = () => {
    if (!completedVideos.includes(videoId)) {
      setCompletedVideos([...completedVideos, videoId]);
    }
  };

  const handleVideoProgress = (progress: number) => {
    // Save progress to backend
    console.log('Video progress:', progress);
  };

  const handleAddBookmark = (time: number, note: string) => {
    setBookmarks([...bookmarks, { time, note }]);
  };

  const navigateToVideo = (newVideoId: string) => {
    router.push(`/academy/course/${courseId}/${newVideoId}`);
  };

  // Calculate course progress
  const totalVideos = courseData.modules.reduce((acc, module) => acc + module.videos.length, 0);
  const completedCount = completedVideos.length;
  const progressPercentage = (completedCount / totalVideos) * 100;

  // Find current video
  let currentVideo: Video | null = null;
  let currentModule: CourseModule | null = null;
  let relatedVideos: Video[] = [];

  courseData.modules.forEach(module => {
    module.videos.forEach(video => {
      if (video.id === videoId) {
        currentVideo = video;
        currentModule = module;
        // Get other videos from the same module as related
        relatedVideos = module.videos.filter(v => v.id !== videoId);
      }
    });
  });

  if (!currentVideo) {
    return <Typography>Video not found</Typography>;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Grid container spacing={3}>
        {/* Course Navigation Sidebar */}
        <Grid item xs={12} lg={3}>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                {courseData.title}
              </Typography>
              
              {/* Course Progress */}
              <Box sx={{ mb: 3 }}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Course Progress
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {Math.round(progressPercentage)}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={progressPercentage}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  {completedCount} of {totalVideos} videos completed
                </Typography>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* Module List */}
              <List sx={{ p: 0 }}>
                {courseData.modules.map((module, moduleIndex) => (
                  <Box key={module.id} sx={{ mb: 1 }}>
                    <ListItem
                      disablePadding
                      sx={{
                        backgroundColor:
                          currentModule?.id === module.id
                            ? alpha(theme.palette.primary.main, 0.08)
                            : 'transparent',
                        borderRadius: 1,
                      }}
                    >
                      <ListItemButton onClick={() => toggleModule(module.id)}>
                        <ListItemText
                          primary={
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Typography variant="subtitle2" fontWeight={600}>
                                Module {moduleIndex + 1}: {module.title}
                              </Typography>
                            </Stack>
                          }
                          secondary={`${module.videos.length} videos`}
                        />
                        <IconButton size="small">
                          {expandedModules.includes(module.id) ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      </ListItemButton>
                    </ListItem>

                    <Collapse in={expandedModules.includes(module.id)}>
                      <List component="div" disablePadding sx={{ pl: 2 }}>
                        {module.videos.map((video, videoIndex) => (
                          <ListItem key={video.id} disablePadding>
                            <ListItemButton
                              onClick={() => !video.isLocked && navigateToVideo(video.id)}
                              disabled={video.isLocked}
                              selected={video.id === videoId}
                              sx={{
                                borderRadius: 1,
                                mb: 0.5,
                                '&.Mui-selected': {
                                  backgroundColor: alpha(theme.palette.primary.main, 0.12),
                                },
                              }}
                            >
                              <ListItemIcon sx={{ minWidth: 36 }}>
                                {video.isCompleted || completedVideos.includes(video.id) ? (
                                  <CheckCircle color="success" fontSize="small" />
                                ) : video.isLocked ? (
                                  <Lock color="disabled" fontSize="small" />
                                ) : (
                                  <PlayCircleOutline fontSize="small" />
                                )}
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Typography variant="body2">
                                    {videoIndex + 1}. {video.title}
                                  </Typography>
                                }
                                secondary={
                                  <Typography variant="caption" color="text.secondary">
                                    {Math.floor(video.duration / 60)} min
                                  </Typography>
                                }
                              />
                            </ListItemButton>
                          </ListItem>
                        ))}

                        {/* Module Resources */}
                        {module.resources && module.resources.length > 0 && (
                          <ListItem disablePadding>
                            <ListItemButton sx={{ borderRadius: 1, mb: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 36 }}>
                                <Description fontSize="small" />
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Typography variant="body2">
                                    Resources ({module.resources.length})
                                  </Typography>
                                }
                              />
                            </ListItemButton>
                          </ListItem>
                        )}

                        {/* Module Quiz */}
                        {module.quiz && (
                          <ListItem disablePadding>
                            <ListItemButton sx={{ borderRadius: 1 }}>
                              <ListItemIcon sx={{ minWidth: 36 }}>
                                {module.quiz.isCompleted ? (
                                  <CheckCircle color="success" fontSize="small" />
                                ) : (
                                  <Quiz fontSize="small" />
                                )}
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Typography variant="body2">
                                    {module.quiz.title}
                                  </Typography>
                                }
                                secondary={
                                  module.quiz.isCompleted ? (
                                    <Typography variant="caption" color="success.main">
                                      Score: {module.quiz.score}%
                                    </Typography>
                                  ) : (
                                    <Typography variant="caption" color="text.secondary">
                                      {module.quiz.questions} questions
                                    </Typography>
                                  )
                                }
                              />
                            </ListItemButton>
                          </ListItem>
                        )}
                      </List>
                    </Collapse>
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Video Player Area */}
        <Grid item xs={12} lg={9}>
          <ProfessionalVideoPlayer
            video={{
              id: currentVideo.id,
              title: currentVideo.title,
              description: currentVideo.description,
              duration: currentVideo.duration,
              category: currentModule?.title,
              instructor: courseData.instructor,
              uploadDate: 'December 1, 2024',
              views: 1234,
            }}
            src="/api/video/stream/sample-video.mp4" // Replace with actual video URL
            captionsUrl="/api/video/captions/sample-video.vtt"
            onProgress={handleVideoProgress}
            onComplete={handleVideoComplete}
            relatedVideos={relatedVideos.map(v => ({
              ...v,
              category: currentModule?.title,
              instructor: courseData.instructor,
            }))}
            bookmarks={bookmarks}
            onBookmark={handleAddBookmark}
          />

          {/* Module Resources */}
          {currentModule?.resources && currentModule.resources.length > 0 && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Module Resources
                </Typography>
                <Grid container spacing={2}>
                  {currentModule.resources.map(resource => (
                    <Grid item xs={12} sm={6} md={4} key={resource.id}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Download />}
                        href={resource.url}
                        target="_blank"
                        sx={{
                          justifyContent: 'flex-start',
                          textAlign: 'left',
                          py: 1.5,
                        }}
                      >
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {resource.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {resource.type.toUpperCase()}
                          </Typography>
                        </Box>
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}