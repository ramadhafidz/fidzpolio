import type { Metadata } from 'next';
import { Syne, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { CustomCursor } from '@/components/layout/CustomCursor';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['600', '700', '800'],
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
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
    <html lang="en" className={`${syne.variable} ${spaceGrotesk.variable}`}>
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
