import type { Metadata } from "next";
import { Geist, Bad_Script } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const badScript = Bad_Script({
  weight: "400",
  variable: "--font-bad-script",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://terrycarrollphoto.com'),
  title: 'Wildlife & Nature Photographer | Terry Carroll Photography',
  description: 'Professional wildlife and nature photography by Terry Carroll, Bristol UK. Stunning galleries featuring birds, coast, landscape, insects and river scenes.',
  keywords: [
    'wildlife photographer Bristol',
    'nature photographer Bristol',
    'bird photographer UK',
    'landscape photographer Bristol',
    'coastal photography UK',
    'wildlife photography portfolio',
    'Terry Carroll Photography',
    'nature photography Bristol',
    'insect macro photography',
    'UK wildlife photographer',
    'bird photography portfolio',
    'Bristol photographer',
    'wildlife photography',
    'nature photography',
  ],
  authors: [{ name: 'Terry Carroll Photography' }],
  alternates: {
    canonical: 'https://terrycarrollphoto.com',
  },
  openGraph: {
    title: 'Terry Carroll Photography - Wildlife & Nature',
    description: 'Professional wildlife and nature photography by Terry Carroll, Bristol UK. Birds, coast, landscape, insects and river scenes.',
    url: 'https://terrycarrollphoto.com',
    siteName: 'Terry Carroll Photography',
    locale: 'en_GB',
    type: 'website',
    images: [
      {
        url: '/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Terry Carroll Photography - Wildlife & Nature',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terry Carroll Photography - Wildlife & Nature',
    description: 'Professional wildlife and nature photography by Terry Carroll, Bristol UK. Birds, coast, landscape, insects and river scenes.',
    images: ['/og-image.webp'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Photographer',
  name: 'Terry Carroll Photography',
  description: 'Professional wildlife and nature photographer based in Bristol, UK. Specialising in birds, coastal, landscape, wildlife, insects and river photography.',
  url: 'https://terrycarrollphoto.com',
  image: 'https://terrycarrollphoto.com/og-image.webp',
  areaServed: {
    '@type': 'Place',
    name: 'Bristol, United Kingdom',
  },
  knowsAbout: [
    'Wildlife Photography',
    'Bird Photography',
    'Nature Photography',
    'Landscape Photography',
    'Coastal Photography',
    'Macro Insect Photography',
    'River Photography',
  ],
  sameAs: [
    'https://www.instagram.com/terr.ythebird/',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${badScript.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
