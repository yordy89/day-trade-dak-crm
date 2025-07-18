import * as React from 'react';

import { config } from '@/config';
import { AccountPageClient } from '@/components/academy/account/account-page-client';

export const metadata = { title: `Account | Academy | ${config.site.name}` };

export default function Page(): React.JSX.Element {
  return <AccountPageClient />;
}
