import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';
import ClientLayout from './client-layout';

export const metadata: Metadata = {
  metadataBase: new URL('https://econ-iq-client.vercel.app'),
  title: 'Econ-IQ | Commercial Risk & Behavior Scoring Platform',
  description: 'Stateful B2B trade network commercial risk and behavior scoring platform for enterprise intelligence.',
  openGraph: {
    title: 'Econ-IQ | Commercial Risk & Behavior Scoring Platform',
    description: 'Stateful B2B trade network commercial risk and behavior scoring platform for enterprise intelligence.',
    url: 'https://econ-iq-client.vercel.app',
    siteName: 'Econ-IQ',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 675,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Econ-IQ | Commercial Risk & Behavior Scoring Platform',
    description: 'Stateful B2B trade network commercial risk and behavior scoring platform for enterprise intelligence.',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Material Symbols Outlined stylesheet link */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="antialiased min-h-screen">
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
