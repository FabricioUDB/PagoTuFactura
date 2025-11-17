import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'ADACECAM - Pago de Recibo de Agua',
  description: 'Paga tu recibo de agua de forma rápida y segura.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <Header />
          <main>{children}</main>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
