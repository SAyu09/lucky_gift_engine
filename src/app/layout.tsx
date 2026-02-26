// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lucky Engine Dashboard',
  description: 'Continuous Engine Administration & B2B Client Management Portal',
};

import { ToastContainer } from '@/components/ui/ToastContainer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="min-h-screen bg-neutral-950 antialiased">
      <body className={`${inter.className} min-h-screen overflow-x-hidden flex flex-col`}>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
