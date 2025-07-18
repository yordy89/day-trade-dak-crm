import React from 'react';
import type { SubscriptionPlan } from "@/types/user";
// import { AcademySection } from "./academy-section";
// import { EconomicCalendar } from "./calendar";
import { EarningsSection } from "./earnings";

export interface TabConfig {
  label: string;
  component: React.JSX.Element;
  requiredSubscription?: SubscriptionPlan; // Optional subscription requirement
}

export const overviewTabs: TabConfig[] = [
  // {
  //   label: 'Academy',
  //   component: <AcademySection />,
  // },
  // {
  //   label: 'Calendar',
  //   component: <EconomicCalendar />,
  // },
  {
    label: 'Earnings',
    component: <EarningsSection />,
    // requiredSubscription: SubscriptionPlan.PRO
  }
];
