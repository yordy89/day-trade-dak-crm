'use client';

import React from 'react';

// Navigation and Footer
import { MainNavbar } from '@/components/landing/main-navbar';
import { ProfessionalFooter } from '@/components/landing/professional-footer';
import TradingFloatingAnnouncement from '@/components/common/TradingFloatingAnnouncement';

// DayTradeDak Accurate Components
import { DayTradeDakHero } from '@/components/landing/daytradedak-hero';
import { DayTradeDakServices } from '@/components/landing/daytradedak-services';
import { DayTradeDakLiveClasses } from '@/components/landing/daytradedak-live-classes';
import { DayTradeDakPricingV2 } from '@/components/landing/daytradedak-pricing-v2';
// import { DayTradeDakTestimonials } from '@/components/landing/daytradedak-testimonials'; // Hidden for now
import { DayTradeDakCTA } from '@/components/landing/daytradedak-cta';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <MainNavbar />
      <main>
        <DayTradeDakHero />
        <DayTradeDakServices />
        <DayTradeDakLiveClasses />
        <DayTradeDakPricingV2 />
        {/* <DayTradeDakTestimonials /> Hidden for now - will be included later */}
        <DayTradeDakCTA />
      </main>
      <ProfessionalFooter />
      <TradingFloatingAnnouncement />
    </div>
  );
}