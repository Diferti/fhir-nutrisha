"use client";

import './globals.css';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
import { AppProvider } from '@/lib/hooks/AppContext/AppProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en">
      <head>
          <link rel="preconnect" href="https://fonts.googleapis.com"/>
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
          <link href="https://fonts.googleapis.com/css2?family=Andada+Pro:ital,wght@0,400..840;1,400..840&family=Lily+Script+One&display=swap"
              rel="stylesheet"/>
      </head>
      <title>MeldRx Patient Sphere</title>
      <body className={`${inter.className} bg-pageColor transition-colors duration-300`}>
      <AppProvider>
          {children}
      </AppProvider>
      </body>
      </html>
  )
}
