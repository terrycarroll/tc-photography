'use client';

import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Hero Image */}
      <div className="absolute inset-0">
        <Image
          src="/optimized/coast/A3-003 -impressive.webp"
          alt="Coast Photography"
          fill
          priority
          className="object-cover"
          quality={90}
        />
        {/* Subtle overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-6xl md:text-8xl font-bad-script text-white mb-4 fade-in drop-shadow-lg">
          Terry Carroll Photography
        </h1>
        <p className="text-xl md:text-2xl font-light text-white/90 tracking-wide mb-8 fade-in max-w-2xl drop-shadow-md">
          Capturing the beauty of nature through the lens
        </p>

        {/* Scroll indicator */}
        <a
          href="#coast"
          className="absolute bottom-12 animate-bounce"
          aria-label="Scroll to gallery"
        >
          <ChevronDown size={40} className="text-white/80 hover:text-grass-green transition-colors drop-shadow-md" />
        </a>
      </div>
    </section>
  );
}
