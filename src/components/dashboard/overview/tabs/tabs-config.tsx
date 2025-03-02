import React from 'react';
import type { SubscriptionPlan } from "@/types/user";
// import { DashboardSection } from "./dashboard";
// import { EconomicCalendar } from "./calendar";
import { EarningsSection } from "./earnings";

export interface TabConfig {
  label: string;
  component: React.JSX.Element;
  requiredSubscription?: SubscriptionPlan; // Optional subscription requirement
}

export const overviewTabs: TabConfig[] = [
  // {
  //   label: 'Dashboard',
  //   component: <DashboardSection />,
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
