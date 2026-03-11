import NavBar from './components/NavBar';
import AwattsdevFooter from './components/AwattsdevFooter';
import Hero from './components/Hero';
import AboutBlurb from './components/AboutBlurb';
import MasonryGallery from './components/MasonryGallery';
import { getAllGalleryImages } from '../lib/cloudinary';
import { Instagram } from 'lucide-react';

export const revalidate = 60; // revalidate at most every 60 seconds

export default async function Home() {
  const images = await getAllGalleryImages();

  const sections: {
    id: string;
    title: string;
    description: string;
    accentColor: 'lavender' | 'green';
    bg: string;
  }[] = [
    { id: 'coast',     title: 'Coast',     description: "Where land meets sea in perfect harmony",               accentColor: 'lavender', bg: 'bg-white'   },
    { id: 'landscape', title: 'Landscape', description: "Breathtaking vistas and natural scenery",               accentColor: 'green',    bg: 'bg-gray-50' },
    { id: 'wildlife',  title: 'Wildlife',  description: "Intimate moments with nature's magnificent creatures",  accentColor: 'lavender', bg: 'bg-white'   },
    { id: 'birds',     title: 'Birds',     description: "From ducks to birds in flight, capturing avian beauty", accentColor: 'green',    bg: 'bg-gray-50' },
    { id: 'insects',   title: 'Insects',   description: "The intricate world of small wonders",                  accentColor: 'lavender', bg: 'bg-white'   },
    { id: 'river',     title: 'River',     description: "Flowing waters and riverside tranquility",              accentColor: 'green',    bg: 'bg-gray-50' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <Hero />
      <AboutBlurb />

      {sections.map((section) => (
        <div key={section.id} className={section.bg}>
          <MasonryGallery
            id={section.id}
            title={section.title}
            images={images[section.id as keyof typeof images] ?? []}
            description={section.description}
            accentColor={section.accentColor}
          />
        </div>
      ))}

      <footer className="bg-white py-16 text-center border-t border-gray-200">
        <a
          href="https://www.instagram.com/terr.ythebird/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-pink-500 transition-colors mb-6"
          aria-label="Terry Carroll Photography on Instagram"
        >
          <Instagram size={22} />
          <span className="text-sm tracking-wide">@terr.ythebird</span>
        </a>
        <p className="text-gray-500 text-sm tracking-wide mb-2">
          © {new Date().getFullYear()} Terry Carroll Photography. All rights reserved.
        </p>
        <p className="text-gray-400 text-xs">
          Capturing nature&apos;s beauty, one frame at a time
        </p>
        <AwattsdevFooter />
      </footer>
    </div>
  );
}
