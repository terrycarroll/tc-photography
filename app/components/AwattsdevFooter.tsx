import Link from 'next/link';
import { Genos } from 'next/font/google';

const genos = Genos({ weight: ['500'], subsets: ['latin'] });

export default function AwattsdevFooter() {
  return (
    <div className="flex justify-center py-4 mt-4 border-t border-gray-200">
      <div className="flex items-center gap-2 text-base text-gray-600">
        <span>site powered by</span>
        <Link
          href="https://www.awattsdev.eu"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block"
        >
          <span className={`${genos.className} awattsdev-link inline-block`}>
            awattsdev
          </span>
        </Link>
      </div>
    </div>
  );
}
