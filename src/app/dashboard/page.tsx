import type { Metadata } from 'next';
import { redirect } from 'next/navigation';


export const metadata = { title: `Overview | Dashboard | YourApp` } satisfies Metadata;

export default function Page(): never {
  return redirect('/dashboard/overview');
}
