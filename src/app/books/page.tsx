'use client';

import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  Button,
  Chip,
  useTheme as useMuiTheme,
  alpha,
  Rating,
  Stack,
  Paper,
} from '@mui/material';
import { 
  AutoStories,
  MenuBook,
  TrendingUp,
  Psychology,
  ShoppingCart,
  LocalOffer,
  Verified,
  ArrowForward,
  FormatQuote,
  EmojiEvents,
  CheckCircle,
  School,
  AttachMoney,
} from '@mui/icons-material';
import { MainNavbar } from '@/components/landing/main-navbar';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/components/theme/theme-provider';

interface Book {
  id: string;
  title: string;
  titleEn?: string;
  author: string;
  image: string;
  category: 'trading' | 'finance' | 'personal';
  featured?: boolean;
  ceoBook?: boolean;
  rating?: number;
  price?: string;
  description?: string;
  descriptionEn?: string;
  amazonLinks?: {
    hardcover?: string;
    paperback?: string;
    kindle?: string;
  };
}

const books: Book[] = [
  {
    id: 'invertir-con-confianza',
    title: 'Invertir con confianza: El arte de ganar en el mercado de Valores',
    titleEn: 'Invest with Confidence: The Art of Winning in the Stock Market',
    author: 'Mijail Medina',
    image: '/assets/images/books/invertir-con-confianza.jpg',
    category: 'trading',
    featured: true,
    ceoBook: true,
    rating: 5,
    description: 'Una guía completa que revela las estrategias probadas y la mentalidad necesaria para triunfar en el trading. Basado en experiencias reales y años de éxito en los mercados.',
    descriptionEn: 'A complete guide that reveals proven strategies and the mindset needed to succeed in trading. Based on real experiences and years of success in the markets.',
    amazonLinks: {
      hardcover: 'https://www.amazon.com/Invertir-confianza-mercado-valores-Spanish/dp/B0DZR1J9VX/ref=sr_1_1?crid=1HSLWA4OMM5XZ&dib=eyJ2IjoiMSJ9.ADL4QGcX7ZQ6JRYJYYd0hWXJhSyaHw30LzmAXFoY_lgCbsquOE6Ap67rFWABSdV5tFZ6waulQLHsfuI5eGYvk7sfFvq6y6fZgBalEtDuqkwnuG3EpSrd5_9GzpZ8DURHG2Rz19Tbr02CerHB4dUHLg.9zyjGZMZx3vp5G82R3FxYNgnZV1dVVfspTE4adBk9Xg&dib_tag=se&keywords=invertir+con+confianza&qid=1741470563&sprefix=invertir+con+confianza%2Caps%2C105&sr=8-1',
      paperback: 'https://www.amazon.com/Invertir-confianza-mercado-valores-Spanish/dp/B0DZRCLTMP/ref=sr_1_1?crid=1HSLWA4OMM5XZ&dib=eyJ2IjoiMSJ9.ADL4QGcX7ZQ6JRYJYYd0hWXJhSyaHw30LzmAXFoY_lgCbsquOE6Ap67rFWABSdV5tFZ6waulQLHsfuI5eGYvk7sfFvq6y6fZgBalEtDuqkwnuG3EpSrd5_9GzpZ8DURHG2Rz19Tbr02CerHB4dUHLg.9zyjGZMZx3vp5G82R3FxYNgnZV1dVVfspTE4adBk9Xg&dib_tag=se&keywords=invertir+con+confianza&qid=1741470563&sprefix=invertir+con+confianza%2Caps%2C105&sr=8-1',
      kindle: 'https://www.amazon.com/Invertir-confianza-mercado-valores-Spanish-ebook/dp/B0DZRD4K7C/ref=sr_1_1?crid=1HSLWA4OMM5XZ&dib=eyJ2IjoiMSJ9.ADL4QGcX7ZQ6JRYJYYd0hWXJhSyaHw30LzmAXFoY_lgCbsquOE6Ap67rFWABSdV5tFZ6waulQLHsfuI5eGYvk7sfFvq6y6fZgBalEtDuqkwnuG3EpSrd5_9GzpZ8DURHG2Rz19Tbr02CerHB4dUHLg.9zyjGZMZx3vp5G82R3FxYNgnZV1dVVfspTE4adBk9Xg&dib_tag=se&keywords=invertir+con+confianza&qid=1741470563&sprefix=invertir+con+confianza%2Caps%2C105&sr=8-1'
    },
  },
  {
    id: 'los-magos-del-mercado',
    title: 'Los Magos del Mercado',
    titleEn: 'Market Wizards',
    author: 'Jack D. Schwager',
    image: '/assets/images/books/los-magos-del-mercado.jpg',
    category: 'trading',
    rating: 4.5,
    amazonLinks: {
      paperback: 'https://www.amazon.com/Los-magos-del-mercado/dp/8494276840/ref=sr_1_1?crid=37ZIBW270ZP4V&dib=eyJ2IjoiMSJ9.a4O8Z-L39OOz-6k66okht-d-UM6lKnwiIDtsktxecYiwtdFnGZHnO6keME9HudZiQqMf8nE2q64C_2vbvZlfMgwy9zyTjh70OciUjla8pdgM_4rsWQsvOCBFlBWzoRowCZcnTCg9nOmM5HcO3adk6BVks3tBB1CWrzhnvVO-IU2Zv2zZ2TycP66V1ZjTyPzkQRHiRXwHJUnWZWV2PftNNrDk8YrR9kFlhMHQ_Nz8yhs.0cX9rx-TXmjreCIaOtepbXjeXKofPyd9SUKk8VGocmk&dib_tag=se&keywords=los+magos+del+mercado&qid=1741470914&sprefix=Los+magos%2Caps%2C143&sr=8-1',
    },
  },
  {
    id: 'piense-y-hagase-rico',
    title: 'Piense y hágase rico',
    titleEn: 'Think and Grow Rich',
    author: 'Napoleon Hill',
    image: '/assets/images/books/piense-y-hagase-rico.jpg',
    category: 'finance',
    rating: 4.8,
    amazonLinks: {
      paperback: 'https://www.amazon.com/Piense-H%C3%A1gase-Rico-Traducci%C3%B3n-Collection/dp/1535598093/ref=sr_1_1?crid=1H2P6GWLMRNW4&dib=eyJ2IjoiMSJ9.xSSXoB4c_4iqJ7UtFfvSznsNeq0s7CcDD1ajSc0eRnZ8K9b-cPvQYcY-Ou0_kEE5XCjE_C3bSuwOenqdd0vEZLUJWkKzt70Ter44X_G8A8vNRYIAYiNKR7E8spF99cOPwnMr-2aNISFNaGqS7Tqi91NOsKEEa84lx_c2P1qEqOc1oHMWNHr7IaUNLx0vR0IaWQb86DOSP18E8pCAmPJ8_vIX3QBVQSIwdoG4h3ll200.Wdeer1WLKRE78cBHSvfsgtaJYwMqSr0oOrRdosP76Mg&dib_tag=se&keywords=piense+y+h%C3%A1gase+rico&qid=1741471018&sprefix=Piense+%2Caps%2C135&sr=8-1',
    },
  },
  {
    id: 'el-millonario-instantaneo',
    title: 'El Millonario instantáneo',
    titleEn: 'The Instant Millionaire',
    author: 'Mark Fisher',
    image: '/assets/images/books/el-millonario-instantaneo.jpg',
    category: 'finance',
    rating: 4.3,
    amazonLinks: {
      paperback: 'https://www.amazon.com/millonario-instantaneo-Spanish-Mark-Fisher/dp/8495787083/ref=sr_1_1?crid=PPM1U60TBEUS&dib=eyJ2IjoiMSJ9.2Yv42NRUOYLrRhDRgn82KnjfKoAMYo0Q0Xgolk50ApmcK1eufiVfI_5r7F9g4aDQ.15kIAUzLxA25TfXhjS45KCktbXxd8FT86jNoCSt3p2U&dib_tag=se&keywords=el+millonario+instantaneo+libro&qid=1741471106&sprefix=El+millonario%2Caps%2C115&sr=8-1',
    },
  },
  {
    id: 'solo-una-cosa',
    title: 'Solo una Cosa',
    titleEn: 'The One Thing',
    author: 'Gary Keller',
    image: '/assets/images/books/solo-una-cosa.jpg',
    category: 'personal',
    rating: 4.6,
    amazonLinks: {
      paperback: 'https://www.amazon.com/Solo-una-cosa-Thing-Spanish/dp/6071136962/ref=sr_1_1?crid=288MKM7X0CYQO&dib=eyJ2IjoiMSJ9.PlBCuhojOa8scnc2ypgobPe2m-2u7mKZpvx1XZ8nhobDz-IrW521wCcWC4uhrlGiWiB-BnMHIaxaUjNN3c3_54mroJBavSU5VIOjnDi28RQ.4D0iWKJQJWR4ZzfHufC-vpQVIw6zMCWOsMEnEAcYSm8&dib_tag=se&keywords=solo+una+cosa+libro+espa%C3%B1ol&qid=1741471215&sprefix=Solo+una+cosa%2Caps%2C120&sr=8-1',
    },
  },
  {
    id: 'el-monje-que-vendio-su-ferrari',
    title: 'El Monje que vendió su Ferrari',
    titleEn: 'The Monk Who Sold His Ferrari',
    author: 'Robin Sharma',
    image: '/assets/images/books/el-monje-que-vendio-su-ferrari.jpg',
    category: 'personal',
    rating: 4.4,
    amazonLinks: {
      paperback: 'https://www.amazon.com/vendi%C3%B3-Ferrari-edici%C3%B3n-limitada-Spanish/dp/8466376194/ref=sr_1_2?crid=1LW4PWGKL8259&dib=eyJ2IjoiMSJ9.pVosyTZtUgOqT_P4W7lKKgW3K82JVck0j-Va1UIY3QuQzrsnwEe2v1N4i0-J3mFaEwyCGyRs55oXrBhg9wwGCXpMUTOuZ28XfKTH6ApK0yFv1YM-WDB-K5beQGIst_yiq60MiLbt6w12RHeyQAiGmsYEILSF9Ah7pe0I3Pgj2io5YJuc9sOeYpVKLom60tPRpDtWNf9n8C6f2ZOU4D8C8Oxu2vSm-nR5G0Ac836eWik.FXiXul9rmKsHJbHFijpziOojczel0_ZJwXGC9xRl6Mk&dib_tag=se&keywords=el+monje+que+vendio+su+ferrari&qid=1741471291&sprefix=El+monje%2Caps%2C125&sr=8-2',
    },
  },
  {
    id: 'los-cuatro-acuerdos',
    title: 'Los cuatro acuerdos',
    titleEn: 'The Four Agreements',
    author: 'Don Miguel Ruiz',
    image: '/assets/images/books/los-cuatro-acuerdos.jpg',
    category: 'personal',
    rating: 4.7,
    amazonLinks: {
      paperback: 'https://www.amazon.com/Los-cuatro-acuerdos-audiolibro/dp/B07PGXC1L1/ref=sr_1_2?crid=DXXOL97X70UV&dib=eyJ2IjoiMSJ9.iiyUxoHi0yfFYVcqzoTVsCeeY3vOsK8sCofQ7ODSdIp-cBBUyee3M7zFGj91E_9Y_whu2ULUBaRYgAlvR0abvw8yVDzuxOzUt5N4_erJwS04A82pYXz4BZqQYK3W0jXR33Jqzc3AQplNZqHOufl6aYP1qeKG6-85XitzqziMVaLLhKvOt3GwaECZ2kLU383HHNMUEzwY78rJBuW2Y0ofXL6RF30unCE-sdJsG1cgyT8.PIgP3AUCImYLY8BuMUgk71cAJtaEPZwEvD6zhCTbxxE&dib_tag=se&keywords=los+cuatro+acuerdos&qid=1741471371&sprefix=los+cuatro+acuerdos%2Caps%2C119&sr=8-2',
    },
  },
];

// Professional Market Background
const MarketBackground = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <Box
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      opacity: isDarkMode ? 0.03 : 0.02,
      pointerEvents: 'none',
    }}
  >
    <svg width="100%" height="100%" viewBox="0 0 1200 800">
      {/* Grid Pattern */}
      <defs>
        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#16a34a" strokeWidth="0.5" opacity="0.3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      
      {/* Abstract Chart Lines */}
      <path
        d="M 0 400 Q 300 350 600 300 T 1200 250"
        stroke="#16a34a"
        strokeWidth="2"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M 0 500 Q 400 450 800 400 T 1200 350"
        stroke="#22c55e"
        strokeWidth="1.5"
        fill="none"
        opacity="0.4"
      />
    </svg>
  </Box>
);

export default function BooksPage() {
  const { t, i18n } = useTranslation();
  const muiTheme = useMuiTheme();
  const { isDarkMode } = useTheme();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'trading':
        return <TrendingUp />;
      case 'finance':
        return <AttachMoney />;
      case 'personal':
        return <School />;
      default:
        return <MenuBook />;
    }
  };

  return (
    <>
      <MainNavbar />
      <Box sx={{ pt: 18, minHeight: '100vh', position: 'relative', backgroundColor: '#0d1117' }}>
        <MarketBackground isDarkMode={isDarkMode} />

        {/* Hero Section with CEO Book */}
        <Box
          sx={{
            background: 'linear-gradient(180deg, rgba(22, 163, 74, 0.15) 0%, rgba(13, 17, 23, 0) 100%)',
            pb: 10,
            position: 'relative',
          }}
        >
          <Container maxWidth="lg">
            {/* Page Header */}
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 3 }}>
                <AutoStories sx={{ fontSize: 48, color: '#22c55e' }} />
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #ffffff 0%, #22c55e 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {t('books.title')}
                </Typography>
              </Stack>
              <Typography variant="h5" sx={{ maxWidth: 800, mx: 'auto', color: 'rgba(255, 255, 255, 0.7)' }}>
                {t('books.subtitle')}
              </Typography>
            </Box>

            {/* Featured CEO Book */}
            {books.filter(book => book.ceoBook).map((book) => (
              <Paper
                key={book.id}
                elevation={0}
                sx={{
                  background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.15) 0%, rgba(22, 163, 74, 0.05) 100%)',
                  border: '2px solid rgba(22, 163, 74, 0.4)',
                  borderRadius: 4,
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: '0 8px 32px rgba(22, 163, 74, 0.2)',
                }}
              >
                {/* Success Badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    zIndex: 1,
                  }}
                >
                  <Chip
                    icon={<EmojiEvents sx={{ color: '#fbbf24 !important' }} />}
                    label={t('books.ceoBook.label')}
                    sx={{
                      fontWeight: 700,
                      backgroundColor: 'rgba(251, 191, 36, 0.15)',
                      color: '#fbbf24',
                      border: '1px solid rgba(251, 191, 36, 0.3)',
                      boxShadow: '0 4px 14px rgba(251, 191, 36, 0.2)',
                    }}
                  />
                </Box>

                <Grid container>
                  <Grid item xs={12} md={5}>
                    <Box
                      sx={{
                        p: 6,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        background: 'radial-gradient(circle, rgba(22, 163, 74, 0.15) 0%, transparent 70%)',
                      }}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          sx={{ 
                            width: '100%',
                            maxWidth: '300px',
                            height: 'auto',
                            borderRadius: 2,
                            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                            transform: 'perspective(1000px) rotateY(-5deg)',
                            transition: 'transform 0.3s',
                            '&:hover': {
                              transform: 'perspective(1000px) rotateY(0deg) scale(1.05)',
                            },
                          }}
                          image={book.image}
                          alt={book.title}
                        />
                        {/* Bestseller Tag */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: -10,
                            left: -10,
                            backgroundColor: 'error.main',
                            color: 'white',
                            px: 2,
                            py: 0.5,
                            borderRadius: 2,
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            boxShadow: 3,
                          }}
                        >
                          BESTSELLER
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={7}>
                    <Box sx={{ p: 6, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      {/* Title and Author */}
                      <Typography
                        variant="h3"
                        gutterBottom
                        sx={{
                          fontWeight: 800,
                          mb: 1,
                          color: '#ffffff',
                          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        {i18n.language === 'es' ? book.title : (book.titleEn || book.title)}
                      </Typography>
                      <Typography variant="h5" gutterBottom sx={{ mb: 3, color: '#22c55e' }}>
                        {t('books.author')} {book.author}
                      </Typography>

                      {/* Rating */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                        <Rating value={book.rating} readOnly precision={0.5} size="large" sx={{ '& .MuiRating-iconFilled': { color: '#fbbf24' } }} />
                        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          ({book.rating}/5.0)
                        </Typography>
                        <Chip
                          icon={<Verified sx={{ color: '#22c55e !important' }} />}
                          label={i18n.language === 'es' ? 'Verificado' : 'Verified'}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(34, 197, 94, 0.15)',
                            color: '#22c55e',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                          }}
                        />
                      </Box>

                      {/* Description */}
                      <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8, color: 'rgba(255, 255, 255, 0.8)' }}>
                        {i18n.language === 'es' ? book.description : (book.descriptionEn || book.description)}
                      </Typography>

                      {/* Key Benefits */}
                      <Box sx={{ mb: 4 }}>
                        <Grid container spacing={2}>
                          {[
                            { icon: <TrendingUp />, text: i18n.language === 'es' ? 'Estrategias Probadas' : 'Proven Strategies', id: 'strategies', color: '#22c55e' },
                            { icon: <Psychology />, text: i18n.language === 'es' ? 'Mentalidad Ganadora' : 'Winning Mindset', id: 'mindset', color: '#60a5fa' },
                            { icon: <CheckCircle />, text: i18n.language === 'es' ? 'Casos Reales' : 'Real Cases', id: 'cases', color: '#a78bfa' },
                          ].map((benefit) => (
                            <Grid item xs={12} sm={4} key={benefit.id}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                  p: 1.5,
                                  borderRadius: 2,
                                  backgroundColor: `rgba(${benefit.color === '#22c55e' ? '34, 197, 94' : benefit.color === '#60a5fa' ? '96, 165, 250' : '167, 139, 250'}, 0.1)`,
                                  border: `1px solid rgba(${benefit.color === '#22c55e' ? '34, 197, 94' : benefit.color === '#60a5fa' ? '96, 165, 250' : '167, 139, 250'}, 0.3)`,
                                }}
                              >
                                <Box sx={{ color: benefit.color }}>{benefit.icon}</Box>
                                <Typography variant="body2" fontWeight={600} sx={{ color: '#ffffff' }}>
                                  {benefit.text}
                                </Typography>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>

                      {/* Quote */}
                      <Paper
                        sx={{
                          p: 3,
                          mb: 4,
                          backgroundColor: 'rgba(22, 163, 74, 0.1)',
                          borderLeft: '4px solid #22c55e',
                          position: 'relative',
                          borderRadius: 2,
                        }}
                      >
                        <FormatQuote sx={{
                          position: 'absolute',
                          top: -10,
                          left: 10,
                          fontSize: 40,
                          color: '#22c55e',
                          opacity: 0.5,
                        }} />
                        <Typography variant="body1" fontStyle="italic" sx={{ pl: 4, color: 'rgba(255, 255, 255, 0.9)' }}>
                          {i18n.language === 'es'
                            ? '"El éxito en el trading no es casualidad, es el resultado de preparación, disciplina y aprendizaje constante."'
                            : '"Success in trading is not by chance, it&apos;s the result of preparation, discipline and constant learning."'
                          }
                        </Typography>
                      </Paper>

                      {/* CTA Buttons */}
                      <Box sx={{ mt: 'auto' }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#ffffff' }}>
                          {i18n.language === 'es' ? 'Disponible en:' : 'Available in:'}
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <Button
                              variant="contained"
                              fullWidth
                              size="large"
                              href={book.amazonLinks?.hardcover || '#'}
                              target="_blank"
                              startIcon={<ShoppingCart />}
                              sx={{
                                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                                color: 'white',
                                fontWeight: 600,
                                py: 1.5,
                                borderRadius: 2,
                                textTransform: 'none',
                                boxShadow: '0 4px 14px rgba(22, 163, 74, 0.4)',
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 6px 20px rgba(22, 163, 74, 0.5)',
                                },
                              }}
                            >
                              {t('books.buyOnAmazon.hardcover')}
                            </Button>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Button
                              variant="outlined"
                              fullWidth
                              size="large"
                              href={book.amazonLinks?.paperback || '#'}
                              target="_blank"
                              startIcon={<ShoppingCart />}
                              sx={{
                                borderColor: 'rgba(34, 197, 94, 0.5)',
                                color: '#22c55e',
                                fontWeight: 600,
                                py: 1.5,
                                borderRadius: 2,
                                borderWidth: 2,
                                textTransform: 'none',
                                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                                '&:hover': {
                                  borderColor: '#22c55e',
                                  backgroundColor: 'rgba(34, 197, 94, 0.2)',
                                  transform: 'translateY(-2px)',
                                  borderWidth: 2,
                                },
                              }}
                            >
                              {t('books.buyOnAmazon.paperback')}
                            </Button>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Button
                              variant="outlined"
                              fullWidth
                              size="large"
                              href={book.amazonLinks?.kindle || '#'}
                              target="_blank"
                              startIcon={<ShoppingCart />}
                              sx={{
                                borderColor: 'rgba(96, 165, 250, 0.5)',
                                color: '#60a5fa',
                                fontWeight: 600,
                                py: 1.5,
                                borderRadius: 2,
                                borderWidth: 2,
                                textTransform: 'none',
                                backgroundColor: 'rgba(96, 165, 250, 0.1)',
                                '&:hover': {
                                  borderColor: '#60a5fa',
                                  backgroundColor: 'rgba(96, 165, 250, 0.2)',
                                  transform: 'translateY(-2px)',
                                  borderWidth: 2,
                                },
                              }}
                            >
                              {t('books.buyOnAmazon.kindle')}
                            </Button>
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Container>
        </Box>

        {/* Recommended Books Section */}
        <Box sx={{ py: 10, backgroundColor: '#161b22' }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
                <LocalOffer sx={{ fontSize: 36, color: '#fbbf24' }} />
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #ffffff 0%, #fbbf24 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {t('books.recommendedBooks')}
                </Typography>
              </Stack>
              <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                {i18n.language === 'es'
                  ? 'Lecturas esenciales seleccionadas por nuestros expertos'
                  : 'Essential readings selected by our experts'
                }
              </Typography>
            </Box>

            <Grid container spacing={4}>
              {books.filter(book => !book.ceoBook).map((book, index) => {
                const cardColors = [
                  { border: 'rgba(34, 197, 94, 0.3)', glow: 'rgba(34, 197, 94, 0.3)', hoverBorder: '#22c55e' },
                  { border: 'rgba(96, 165, 250, 0.3)', glow: 'rgba(96, 165, 250, 0.3)', hoverBorder: '#60a5fa' },
                  { border: 'rgba(167, 139, 250, 0.3)', glow: 'rgba(167, 139, 250, 0.3)', hoverBorder: '#a78bfa' },
                  { border: 'rgba(251, 191, 36, 0.3)', glow: 'rgba(251, 191, 36, 0.3)', hoverBorder: '#fbbf24' },
                  { border: 'rgba(244, 114, 182, 0.3)', glow: 'rgba(244, 114, 182, 0.3)', hoverBorder: '#f472b6' },
                  { border: 'rgba(34, 211, 238, 0.3)', glow: 'rgba(34, 211, 238, 0.3)', hoverBorder: '#22d3ee' },
                ];
                const colorScheme = cardColors[index % cardColors.length];

                return (
                <Grid item xs={12} sm={6} md={4} key={book.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: '#0d1117',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s',
                      border: `1px solid ${colorScheme.border}`,
                      borderRadius: 3,
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 12px 24px ${colorScheme.glow}`,
                        borderColor: colorScheme.hoverBorder,
                      },
                    }}
                  >
                    {/* Book Cover */}
                    <Box sx={{ p: 3, pb: 0 }}>
                      <Box sx={{ position: 'relative', mb: 3 }}>
                        <CardMedia
                          component="img"
                          sx={{
                            width: '100%',
                            height: '320px',
                            objectFit: 'contain',
                            borderRadius: 2,
                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                            p: 2,
                          }}
                          image={book.image}
                          alt={book.title}
                        />
                        <Chip
                          icon={getCategoryIcon(book.category)}
                          label={
                            book.category === 'trading' ? t('books.categories.trading') :
                            book.category === 'finance' ? t('books.categories.finance') :
                            t('books.categories.personalGrowth')
                          }
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            backgroundColor: 'rgba(13, 17, 23, 0.9)',
                            backdropFilter: 'blur(10px)',
                            color: book.category === 'trading' ? '#22c55e' : book.category === 'finance' ? '#fbbf24' : '#a78bfa',
                            border: `1px solid ${book.category === 'trading' ? 'rgba(34, 197, 94, 0.3)' : book.category === 'finance' ? 'rgba(251, 191, 36, 0.3)' : 'rgba(167, 139, 250, 0.3)'}`,
                            '& .MuiChip-icon': {
                              color: book.category === 'trading' ? '#22c55e' : book.category === 'finance' ? '#fbbf24' : '#a78bfa',
                            },
                          }}
                        />
                      </Box>
                    </Box>
                    
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', pt: 0 }}>
                      {/* Title & Author */}
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, minHeight: '64px', lineHeight: 1.3, color: '#ffffff' }}>
                        {i18n.language === 'es' ? book.title : (book.titleEn || book.title)}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.6)' }}>
                        {t('books.author')} {book.author}
                      </Typography>

                      {/* Rating */}
                      {book.rating ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <Rating value={book.rating} readOnly size="small" precision={0.5} sx={{ '& .MuiRating-iconFilled': { color: '#fbbf24' } }} />
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                            ({book.rating})
                          </Typography>
                        </Box>
                      ) : null}


                      {/* CTA */}
                      <Box sx={{ mt: 'auto' }}>
                        <Button
                          variant="outlined"
                          fullWidth
                          href={book.amazonLinks?.paperback || book.amazonLinks?.kindle || book.amazonLinks?.hardcover || '#'}
                          target="_blank"
                          endIcon={<ArrowForward />}
                          sx={{
                            borderColor: colorScheme.border,
                            color: colorScheme.hoverBorder,
                            fontWeight: 600,
                            borderRadius: 2,
                            textTransform: 'none',
                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                            '&:hover': {
                              borderColor: colorScheme.hoverBorder,
                              color: colorScheme.hoverBorder,
                              backgroundColor: `${colorScheme.glow.replace('0.3', '0.15')}`,
                              '& .MuiButton-endIcon': {
                                transform: 'translateX(4px)',
                              },
                            },
                            '& .MuiButton-endIcon': {
                              transition: 'transform 0.2s',
                            },
                          }}
                        >
                          {t('books.buyOnAmazon.view')}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                );
              })}
            </Grid>
          </Container>
        </Box>

        {/* Footer Spacer */}
        <Box sx={{ py: 6, backgroundColor: '#0d1117' }} />
      </Box>
    </>
  );
}