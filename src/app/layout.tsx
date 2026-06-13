import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';
import ClientLayout from './client-layout';

export const metadata: Metadata = {
  title: 'Econ-IQ | Enterprise Intelligence',
  description: 'Stateful B2B trade network commercial risk and behavior scoring platform.',
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
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
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
