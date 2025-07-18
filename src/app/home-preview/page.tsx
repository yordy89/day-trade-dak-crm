'use client';

import React from 'react';

// Professional Design Components
import { MainNavbar } from '@/components/landing/main-navbar';
import { ProfessionalHero } from '@/components/landing/professional-hero';
import { ProfessionalServices } from '@/components/landing/professional-services';
import { LiveTradingSection } from '@/components/landing/live-trading-section';
import { EducationPrograms } from '@/components/landing/education-programs';
import { SuccessStories } from '@/components/landing/success-stories';
import { TradingTools } from '@/components/landing/trading-tools';
import { PricingPlans } from '@/components/landing/pricing-plans';
import { CallToAction } from '@/components/landing/call-to-action';
import { ProfessionalFooter } from '@/components/landing/professional-footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <MainNavbar />
      <main>
        <ProfessionalHero />
        <ProfessionalServices />
        <LiveTradingSection />
        <EducationPrograms />
        <TradingTools />
        <SuccessStories />
        <PricingPlans />
        <CallToAction />
      </main>
      <ProfessionalFooter />
    </div>
  );
}