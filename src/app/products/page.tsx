import React from 'react';
import { MainNavbar } from '@/components/landing/main-navbar';
import { ProductsSection } from '@/components/landing/products-section';
import { ProfessionalFooter } from '@/components/landing/professional-footer';
import { Container, Typography, Box, Breadcrumbs, Link } from '@mui/material';
import { NavigateNext } from '@mui/icons-material';

export default function ProductsPage() {
  return (
    <div className="min-h-screen">
      <MainNavbar />
      <main>
        {/* Header Section */}
        <Box className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white py-20">
          <Container maxWidth="lg">
            <Breadcrumbs
              separator={<NavigateNext fontSize="small" />}
              aria-label="breadcrumb"
              className="text-white mb-4"
            >
              <Link underline="hover" color="inherit" href="/">
                Home
              </Link>
              <Typography color="text.primary">Products</Typography>
            </Breadcrumbs>
            
            <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
              Our Trading Products
            </Typography>
            <Typography variant="h5" className="opacity-90 max-w-3xl">
              Choose from our comprehensive suite of trading education products and tools designed to help you succeed in the financial markets.
            </Typography>
          </Container>
        </Box>

        {/* Products Section */}
        <ProductsSection />

        {/* Additional Info Section */}
        <Box className="py-16 bg-gray-100 dark:bg-gray-800">
          <Container maxWidth="lg">
            <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
              Why Choose DayTradeDak?
            </Typography>
            <Box className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <Box textAlign="center">
                <Typography variant="h2" color="primary" fontWeight="bold">
                  10K+
                </Typography>
                <Typography variant="h6">Active Traders</Typography>
                <Typography variant="body2" color="text.secondary" className="mt-2">
                  Join a thriving community of successful traders worldwide
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h2" color="primary" fontWeight="bold">
                  85%
                </Typography>
                <Typography variant="h6">Success Rate</Typography>
                <Typography variant="body2" color="text.secondary" className="mt-2">
                  Our students achieve consistent profitability within 6 months
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h2" color="primary" fontWeight="bold">
                  24/7
                </Typography>
                <Typography variant="h6">Support & Access</Typography>
                <Typography variant="body2" color="text.secondary" className="mt-2">
                  Round-the-clock support and platform access from anywhere
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>
      </main>
      <ProfessionalFooter />
    </div>
  );
}