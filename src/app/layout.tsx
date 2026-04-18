import '@/shared/styles/globals.scss';

import { type Metadata } from 'next';
import { Inter } from 'next/font/google';

import { AuthRehydrationProvider } from './providers/AuthRehydrationProvider';
import { StoreProvider } from './providers/StoreProvider';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Orbitto — Auth',
  description: 'Orbitto authentication service',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={inter.variable}>
      <body>
        <StoreProvider>
          <AuthRehydrationProvider>{children}</AuthRehydrationProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
