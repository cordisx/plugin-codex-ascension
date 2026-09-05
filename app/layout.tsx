import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OpenAI Imperium',
  description: 'Petition for a Codex reset and witness Tibo ascend from promptly bankrupt to Codex Maximus.',
  icons: {
    icon: [{ url: '/favicon.png', type: 'image/png', sizes: '512x512' }],
    apple: [{ url: '/apple-touch-icon.png', type: 'image/png', sizes: '180x180' }],
  },
  openGraph: {
    title: 'OpenAI Imperium',
    description: 'Veni. Vidi. Reset. Join the live Codex reset petition.',
    images: [{ url: '/og.png', width: 1731, height: 909, alt: 'OpenAI Imperium — Veni. Vidi. Reset.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenAI Imperium',
    description: 'Veni. Vidi. Reset. Join the live Codex reset petition.',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
