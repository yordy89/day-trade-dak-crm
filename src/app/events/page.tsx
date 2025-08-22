'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  CardMedia,
  Button,
  Stack,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme as useMuiTheme,
  alpha,
  Skeleton,
  Paper,
  IconButton,
  Divider,
} from '@mui/material';
import { 
  Search,
  CalendarMonth,
  LocationOn,
  ArrowForward,
  FilterList,
  Event as EventIcon,
  Star,
  Groups,
  Close,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

import { MainNavbar } from '@/components/landing/main-navbar';
import { TopBar } from '@/components/landing/top-bar';
import { useTheme } from '@/components/theme/theme-provider';
import { eventService, type Event } from '@/services/api/event.service';
import { getUTCDateAsLocal, isUTCDateInPast } from '@/lib/date-utils';

// Event Card Component
const EventCard = ({ event, onClick }: { event: Event; onClick: () => void }) => {
  const theme = useMuiTheme();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const { isDarkMode } = useTheme();
  const { i18n } = useTranslation();
  
  // Use utility function to get correct date without timezone conversion
  const eventDate = getUTCDateAsLocal(event.date || event.startDate || '');
  const isPastEvent = isUTCDateInPast(event.date || event.startDate || '');
  const hasVipAccess = event.vipPrice && event.vipPrice > 0;
  
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: '1px solid',
        borderColor: 'divider',
        opacity: isPastEvent ? 0.7 : 1,
        '&:hover': {
          transform: isPastEvent ? 'none' : 'translateY(-4px)',
          boxShadow: isPastEvent ? 1 : theme.shadows[8],
          borderColor: isPastEvent ? 'divider' : alpha(theme.palette.primary.main, 0.3),
        },
      }}
      onClick={onClick}
    >
      {event.bannerImage && (
        <CardMedia
          component="img"
          height="200"
          image={event.bannerImage}
          alt={event.name}
          sx={{
            objectFit: 'cover',
            backgroundColor: theme.palette.action.hover,
          }}
        />
      )}
      
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Stack spacing={2}>
          {/* Event Type & Status */}
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {isPastEvent ? (
              <Chip 
                label={i18n.language === 'es' ? 'Finalizado' : 'Past Event'}
                size="small"
                sx={{ 
                  bgcolor: alpha(theme.palette.text.secondary, 0.1),
                  color: 'text.secondary',
                }}
              />
            ) : (
              <Chip 
                label={i18n.language === 'es' ? 'Próximo' : 'Upcoming'}
                size="small"
                color="success"
              />
            )}
            {hasVipAccess && (
              <Chip 
                icon={<Star sx={{ fontSize: 14 }} />}
                label="VIP"
                size="small"
                sx={{
                  bgcolor: alpha(theme.palette.warning.main, 0.1),
                  color: 'warning.main',
                }}
              />
            )}
            {event.type && (
              <Chip 
                label={event.type.replace('_', ' ').toUpperCase()}
                size="small"
                variant="outlined"
              />
            )}
          </Stack>
          
          {/* Event Title */}
          <Typography variant="h5" fontWeight={700} gutterBottom>
            {event.name || event.title}
          </Typography>
          
          {/* Event Description */}
          {event.description && (
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {event.description}
            </Typography>
          )}
          
          {/* Event Details */}
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarMonth sx={{ fontSize: 18, color: 'primary.main' }} />
              <Typography variant="body2">
                {format(eventDate, 'PPP', { 
                  locale: i18n.language === 'es' ? es : enUS 
                })}
              </Typography>
            </Box>
            
            {event.location && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn sx={{ fontSize: 18, color: 'primary.main' }} />
                <Typography variant="body2" noWrap>
                  {event.location}
                </Typography>
              </Box>
            )}
            
            {event.capacity && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Groups sx={{ fontSize: 18, color: 'primary.main' }} />
                <Typography variant="body2">
                  {event.currentRegistrations || 0} / {event.capacity} 
                  {i18n.language === 'es' ? ' registrados' : ' registered'}
                </Typography>
              </Box>
            )}
          </Stack>
          
          {/* Action Button */}
          <Button
            fullWidth
            variant={isPastEvent ? 'outlined' : 'contained'}
            endIcon={<ArrowForward />}
            disabled={isPastEvent}
            sx={{ mt: 'auto' }}
          >
            {isPastEvent 
              ? (i18n.language === 'es' ? 'Evento Finalizado' : 'Event Ended')
              : (i18n.language === 'es' ? 'Ver Detalles' : 'View Details')
            }
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default function EventsPage() {
  const theme = useMuiTheme();
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const { i18n } = useTranslation();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [eventType, setEventType] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Fetch only active events
  const { data: eventsData, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const params: any = {
        limit: 50,
        isActive: true,  // Only get active events
      };
      
      return eventService.getEvents(params);
    },
  });
  
  // Filter events based on search and type
  const filteredEvents = React.useMemo(() => {
    let events = eventsData?.data || [];
    
    // Search filter
    if (searchTerm) {
      events = events.filter(event => 
        event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Type filter
    if (eventType !== 'all') {
      events = events.filter(event => event.type === eventType);
    }
    
    // Sort by date (upcoming first)
    return events.sort((a, b) => {
      const dateA = new Date(a.date || a.startDate || '');
      const dateB = new Date(b.date || b.startDate || '');
      return dateA.getTime() - dateB.getTime();
    });
  }, [eventsData, searchTerm, eventType]);
  
  return (
    <>
      <TopBar />
      <MainNavbar />
      
      <Box
        sx={{
          minHeight: '100vh',
          pt: { xs: '100px', sm: '120px' },
          pb: 8,
          backgroundColor: theme.palette.background.default,
        }}
      >
        {/* Hero Section */}
        <Box
          sx={{
            background: isDarkMode 
              ? 'linear-gradient(180deg, rgba(22, 163, 74, 0.1) 0%, rgba(0, 0, 0, 0) 100%)'
              : 'linear-gradient(180deg, rgba(22, 163, 74, 0.05) 0%, rgba(255, 255, 255, 0) 100%)',
            py: { xs: 4, sm: 6 },
            mb: 4,
          }}
        >
          <Container maxWidth="xl">
            <Stack spacing={3} alignItems="center" textAlign="center">
              <Typography 
                variant="h2" 
                fontWeight={800}
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {i18n.language === 'es' ? 'Eventos y Talleres' : 'Events & Workshops'}
              </Typography>
              <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 600 }}>
                {i18n.language === 'es' 
                  ? 'Únete a nuestros eventos exclusivos y mejora tus habilidades de trading'
                  : 'Join our exclusive events and enhance your trading skills'
                }
              </Typography>
            </Stack>
          </Container>
        </Box>
        
        <Container maxWidth="xl">
          {/* Filters Section */}
          <Paper
            sx={{
              p: 3,
              mb: 4,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Stack spacing={3}>
              {/* Search and Filter Toggle */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder={i18n.language === 'es' ? 'Buscar eventos...' : 'Search events...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                    endAdornment: searchTerm && (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setSearchTerm('')}>
                          <Close fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={() => setShowFilters(!showFilters)}
                  sx={{ minWidth: 150 }}
                >
                  {i18n.language === 'es' ? 'Filtros' : 'Filters'}
                  {eventType !== 'all' && (
                    <Chip 
                      size="small" 
                      label="•" 
                      sx={{ ml: 1, minWidth: 20, height: 20 }}
                      color="primary"
                    />
                  )}
                </Button>
              </Stack>
              
              {/* Filter Options */}
              {showFilters && (
                <>
                  <Divider />
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <FormControl fullWidth>
                      <InputLabel>
                        {i18n.language === 'es' ? 'Tipo de Evento' : 'Event Type'}
                      </InputLabel>
                      <Select
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        label={i18n.language === 'es' ? 'Tipo de Evento' : 'Event Type'}
                      >
                        <MenuItem value="all">
                          {i18n.language === 'es' ? 'Todos los tipos' : 'All types'}
                        </MenuItem>
                        <MenuItem value="master_course">
                          {i18n.language === 'es' ? 'Curso Maestro' : 'Master Course'}
                        </MenuItem>
                        <MenuItem value="community_event">
                          {i18n.language === 'es' ? 'Evento Comunitario' : 'Community Event'}
                        </MenuItem>
                        <MenuItem value="general">
                          {i18n.language === 'es' ? 'General' : 'General'}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                </>
              )}
            </Stack>
          </Paper>
          
          {/* Results Summary */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" color="text.secondary">
              {filteredEvents.length} {i18n.language === 'es' ? 'eventos encontrados' : 'events found'}
            </Typography>
          </Box>
          
          {/* Events Grid */}
          {isLoading ? (
            <Grid container spacing={3}>
              {[...Array(6)].map((_, index) => (
                <Grid item xs={12} sm={6} lg={4} key={index}>
                  <Card sx={{ height: 400 }}>
                    <Skeleton variant="rectangular" height={200} />
                    <CardContent>
                      <Skeleton variant="text" sx={{ fontSize: '1.5rem' }} />
                      <Skeleton variant="text" />
                      <Skeleton variant="text" />
                      <Skeleton variant="rectangular" height={40} sx={{ mt: 2 }} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : filteredEvents.length > 0 ? (
            <Grid container spacing={3}>
              {filteredEvents.map((event) => (
                <Grid item xs={12} sm={6} lg={4} key={event._id}>
                  <EventCard 
                    event={event} 
                    onClick={() => router.push(`/events/${event._id}`)}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper
              sx={{
                p: 8,
                textAlign: 'center',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <EventIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                {i18n.language === 'es' ? 'No se encontraron eventos' : 'No events found'}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {searchTerm || eventType !== 'all'
                  ? i18n.language === 'es' 
                    ? 'Intenta ajustar tus filtros de búsqueda'
                    : 'Try adjusting your search filters'
                  : i18n.language === 'es'
                    ? 'No hay eventos activos en este momento'
                    : 'No active events at this time'
                }
              </Typography>
              {(searchTerm || eventType !== 'all') && (
                <Button
                  variant="outlined"
                  onClick={() => {
                    setSearchTerm('');
                    setEventType('all');
                  }}
                >
                  {i18n.language === 'es' ? 'Limpiar Filtros' : 'Clear Filters'}
                </Button>
              )}
            </Paper>
          )}
        </Container>
      </Box>
    </>
  );
}