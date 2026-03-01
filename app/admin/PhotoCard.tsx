'use client';

import { GALLERIES, type Gallery } from '../../lib/galleries';

export interface PhotoItem {
  public_id: string;
  secure_url: string;
}

interface Props {
  photo: PhotoItem;
  currentGallery: Gallery;
  isDeleting: boolean;
  isMoving: boolean;
  onDelete: (public_id: string) => void;
  onMove: (public_id: string, to_gallery: Gallery) => void;
}

function thumbUrl(secureUrl: string) {
  return secureUrl.replace('/upload/', '/upload/w_400,h_400,c_fill/');
}

export default function PhotoCard({
  photo,
  currentGallery,
  isDeleting,
  isMoving,
  onDelete,
  onMove,
}: Props) {
  const isBusy = isDeleting || isMoving;

  return (
    <div
      className={`relative group rounded-lg overflow-hidden border border-gray-200 ${isBusy ? 'opacity-50' : ''}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumbUrl(photo.secure_url)}
        alt=""
        className="w-full aspect-square object-cover"
      />

      {/* Overlay controls — visible on hover */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 gap-1">
        <button
          onClick={() => onDelete(photo.public_id)}
          disabled={isBusy}
          className="w-full text-xs py-1.5 rounded bg-red-600 text-white hover:bg-red-700 transition-colors disabled:cursor-not-allowed"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
        <select
          defaultValue=""
          disabled={isBusy}
          onChange={(e) => {
            if (e.target.value) onMove(photo.public_id, e.target.value as Gallery);
          }}
          className="w-full text-xs py-1.5 rounded bg-white text-gray-800 border-0 disabled:cursor-not-allowed"
        >
          <option value="" disabled>
            {isMoving ? 'Moving...' : 'Move to...'}
          </option>
          {GALLERIES.filter((g) => g !== currentGallery).map((g) => (
            <option key={g} value={g}>
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Spinner when busy */}
      {isBusy && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
