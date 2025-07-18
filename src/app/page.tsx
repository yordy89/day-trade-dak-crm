import { redirect } from 'next/navigation';

export default function HomePage() {
  // Temporary redirect to community event page
  // To revert: Replace this file with the content from /app/home-preview/page.tsx
  redirect('/community-event');
}