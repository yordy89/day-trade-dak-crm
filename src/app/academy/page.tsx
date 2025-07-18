import type { Metadata } from 'next';
import { redirect } from 'next/navigation';


export const metadata = { title: `Overview | Academy | DayTradeDak` } satisfies Metadata;

export default function Page(): never {
  return redirect('/academy/overview');
}
