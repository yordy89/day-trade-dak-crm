'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  Chip,
  Button,
  Card,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  ExpandMore,
  Search,
  AccountCircle,
  Payment,
  TrendingUp,
  School,
  Security,
  Settings,
  HelpOutline,
  Email,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { MainNavbar } from '@/components/landing/main-navbar';
import { ProfessionalFooter } from '@/components/landing/professional-footer';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

const categoryIcons: Record<string, React.ElementType> = {
  all: HelpOutline,
  account: AccountCircle,
  payments: Payment,
  trading: TrendingUp,
  education: School,
  security: Security,
  technical: Settings,
};

export default function FAQPage() {
  const { t } = useTranslation('faq');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Generate FAQ items from translations
  const faqData = useMemo<FAQItem[]>(() => {
    const items: FAQItem[] = [];
    const faqItems = t('items', { returnObjects: true }) as any;
    
    // Define category mapping for each item
    const categoryMapping: Record<string, string> = {
      acc1: 'account', acc2: 'account', acc3: 'account',
      pay1: 'payments', pay2: 'payments',
      trade1: 'trading', trade2: 'trading', trade3: 'trading', trade4: 'trading',
      edu1: 'education', edu2: 'education', edu3: 'education', edu4: 'education',
      sec1: 'security', sec3: 'security',
      tech1: 'technical', tech2: 'technical', tech3: 'technical', tech4: 'technical',
    };

    for (const key in faqItems) {
      if (faqItems[key] && typeof faqItems[key] === 'object') {
        items.push({
          id: key,
          question: faqItems[key].question || '',
          answer: faqItems[key].answer || '',
          category: categoryMapping[key] || 'all',
          tags: faqItems[key].tags || [],
        });
      }
    }

    return items;
  }, [t]);

  // Generate categories from translations
  const categories = useMemo(() => {
    const categoryTranslations = t('categories', { returnObjects: true }) as any;
    return Object.keys(categoryTranslations).map(key => ({
      id: key,
      label: categoryTranslations[key],
      icon: categoryIcons[key] || HelpOutline,
    }));
  }, [t]);

  const handleAccordionChange = (itemId: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedItems(prev =>
      isExpanded
        ? [...prev, itemId]
        : prev.filter(id => id !== itemId)
    );
  };

  const filteredFAQs = faqData.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (categoryId: string) => {
    const Icon = categoryIcons[categoryId] || HelpOutline;
    return <Icon />;
  };

  return (
    <>
      <MainNavbar />
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pt: 16, pb: 8 }}>
        {/* Hero Section */}
        <Box
        sx={{
          background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
          color: 'white',
          py: 10,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            {t('title')}
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            {t('subtitle')}
          </Typography>
          
          {/* Search Bar */}
          <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <TextField
              fullWidth
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                  borderRadius: 2,
                  '& fieldset': { border: 'none' },
                  '& input': {
                    color: '#000000 !important',
                    caretColor: '#000000 !important',
                    WebkitTextFillColor: '#000000 !important',
                    '&::placeholder': {
                      color: 'rgba(0, 0, 0, 0.6) !important',
                      WebkitTextFillColor: 'rgba(0, 0, 0, 0.6) !important',
                      opacity: '1 !important',
                    },
                  },
                },
                '& .MuiInputBase-input': {
                  color: '#000000 !important',
                  WebkitTextFillColor: '#000000 !important',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'rgba(0, 0, 0, 0.5)' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Category Buttons */}
        <Box sx={{ mb: 4 }}>
          <ToggleButtonGroup
            value={selectedCategory}
            exclusive
            onChange={(e, newValue) => {
              if (newValue !== null) {
                setSelectedCategory(newValue);
              }
            }}
            sx={{
              flexWrap: 'wrap',
              gap: 1,
              '& .MuiToggleButton-root': {
                textTransform: 'none',
                borderRadius: 2,
                px: 2,
                py: 1,
                border: '1px solid',
                borderColor: 'divider',
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                },
              },
            }}
          >
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <ToggleButton key={category.id} value={category.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Icon fontSize="small" />
                    <span>{category.label}</span>
                  </Box>
                </ToggleButton>
              );
            })}
          </ToggleButtonGroup>
        </Box>

        {/* Results Count */}
        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
          {t('resultsCount', { count: filteredFAQs.length })}
        </Typography>

        {/* FAQ Items */}
        <Box sx={{ mb: 6 }}>
          {filteredFAQs.map((item) => (
            <Accordion
              key={item.id}
              expanded={expandedItems.includes(item.id)}
              onChange={handleAccordionChange(item.id)}
              sx={{
                mb: 2,
                '&:before': { display: 'none' },
                boxShadow: 1,
                '&.Mui-expanded': {
                  boxShadow: 2,
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{
                  '& .MuiAccordionSummary-content': {
                    alignItems: 'center',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                  <Box sx={{ color: 'primary.main' }}>
                    {getCategoryIcon(item.category)}
                  </Box>
                  <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 500 }}>
                    {item.question}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                  {item.answer}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {item.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      variant="outlined"
                      sx={{ borderRadius: 1 }}
                    />
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {/* Still Need Help */}
        <Card
          sx={{
            background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.08) 0%, rgba(22, 163, 74, 0.12) 100%)',
            backdropFilter: 'blur(10px)',
            p: 4,
            textAlign: 'center',
            border: '2px solid',
            borderColor: 'rgba(22, 163, 74, 0.3)',
            boxShadow: '0 8px 32px rgba(22, 163, 74, 0.15)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 40px rgba(22, 163, 74, 0.2)',
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #16a34a, #15803d)',
              animation: 'shimmer 2s infinite',
            },
            '@keyframes shimmer': {
              '0%': { transform: 'translateX(-100%)' },
              '100%': { transform: 'translateX(100%)' },
            },
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
            {t('stillNeedHelp.title')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.primary', fontWeight: 500 }}>
            {t('stillNeedHelp.description')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<Email />}
              href="/contact"
              sx={{
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)',
                },
              }}
            >
              {t('stillNeedHelp.contactSupport')}
            </Button>
          </Box>
        </Card>
      </Container>
    </Box>
    <ProfessionalFooter />
    </>
  );
}