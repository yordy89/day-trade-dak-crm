'use client';

import React from 'react';
import { Card, CardContent, Typography, Button, Chip } from '@mui/material';
import { School, Psychology, ShowChart, AutoGraph, MenuBook, Group } from '@mui/icons-material';
import Link from 'next/link';

const products = [
  {
    id: 'mentorship',
    title: 'Personal Mentorship',
    icon: Group,
    price: '$199/month',
    description: 'One-on-one guidance from experienced traders with personalized strategies',
    features: ['Weekly 1-on-1 sessions', 'Custom trading plan', 'Direct chat support', 'Portfolio review'],
    color: 'from-blue-500 to-cyan-500',
    popular: false,
  },
  {
    id: 'class',
    title: 'Trading Classes',
    icon: School,
    price: '$99/month',
    description: 'Comprehensive courses covering all aspects of day trading',
    features: ['50+ video lessons', 'Live webinars', 'Trading simulator', 'Certificate'],
    color: 'from-purple-500 to-pink-500',
    popular: true,
  },
  {
    id: 'stock',
    title: 'Stock Analysis',
    icon: ShowChart,
    price: '$149/month',
    description: 'Professional stock analysis and real-time trading signals',
    features: ['Daily stock picks', 'Technical analysis', 'Market reports', 'SMS alerts'],
    color: 'from-green-500 to-teal-500',
    popular: false,
  },
  {
    id: 'psicotrading',
    title: 'Trading Psychology',
    icon: Psychology,
    price: '$79/month',
    description: 'Master your emotions and develop a winning trader mindset',
    features: ['Psychology workshops', 'Mindset coaching', 'Stress management', 'Performance tracking'],
    color: 'from-orange-500 to-red-500',
    popular: false,
  },
  {
    id: 'moneypeace',
    title: 'Financial Peace',
    icon: AutoGraph,
    price: '$129/month',
    description: 'Complete financial education for long-term wealth building',
    features: ['Investment strategies', 'Risk management', 'Tax optimization', 'Retirement planning'],
    color: 'from-indigo-500 to-purple-500',
    popular: false,
  },
  {
    id: 'books',
    title: 'Trading Library',
    icon: MenuBook,
    price: '$49/month',
    description: 'Access to exclusive trading books and research materials',
    features: ['100+ eBooks', 'Research papers', 'Market studies', 'Audio books'],
    color: 'from-gray-600 to-gray-800',
    popular: false,
  },
];

export function ProductsSection() {
  return (
    <section id="products" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Trading Journey
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            From beginner to pro, we have the perfect plan to accelerate your trading success
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => {
            const Icon = product.icon;
            return (
              <Card
                key={product.id}
                className={`relative overflow-hidden transform transition-all duration-300 hover:scale-105 ${
                  product.popular ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {product.popular && (
                  <Chip
                    label="Most Popular"
                    color="primary"
                    size="small"
                    className="absolute top-4 right-4 z-10"
                  />
                )}
                
                <div className={`h-2 bg-gradient-to-r ${product.color}`} />
                
                <CardContent className="p-6">
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${product.color} mb-4`}>
                    <Icon className="text-white text-3xl" />
                  </div>
                  
                  <Typography variant="h5" className="font-bold mb-2">
                    {product.title}
                  </Typography>
                  
                  <Typography variant="h4" className="font-bold mb-4 text-gray-900 dark:text-white">
                    {product.price}
                  </Typography>
                  
                  <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mb-6">
                    {product.description}
                  </Typography>
                  
                  <ul className="space-y-2 mb-6">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Link href="/auth/sign-up" className="block">
                    <Button
                      fullWidth
                      variant={product.popular ? 'contained' : 'outlined'}
                      color="primary"
                      size="large"
                    >
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Typography variant="h6" className="text-gray-700 dark:text-gray-300 mb-4">
            All plans include:
          </Typography>
          <div className="flex flex-wrap justify-center gap-4">
            <Chip label="30-day money-back guarantee" variant="outlined" />
            <Chip label="Cancel anytime" variant="outlined" />
            <Chip label="24/7 support" variant="outlined" />
            <Chip label="Mobile app access" variant="outlined" />
          </div>
        </div>
      </div>
    </section>
  );
}