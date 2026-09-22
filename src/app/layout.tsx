import type { Metadata } from 'next';
import { Anton, Roboto } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { CustomCursor } from '@/components/layout/CustomCursor';

const anton = Anton({
  subsets: ['latin'],
  variable: '--font-anton',
  weight: '400',
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Ramadhafidz — Creative Developer',
    template: '%s — Ramadhafidz',
  },
  description:
    'Portfolio of Hafidz Ramadhan Ghiffari, a Creative Developer building cinematic, interactive web experiences.',
  openGraph: {
    title: 'Ramadhafidz — Creative Developer',
    description:
      'Portfolio of Hafidz Ramadhan Ghiffari, a Creative Developer building cinematic, interactive web experiences.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${anton.variable} ${roboto.variable}`}>
      <body className="bg-bg-primary text-text-secondary antialiased">
        <CustomCursor />
        <SmoothScroll>
          <Navbar />
          {children}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
