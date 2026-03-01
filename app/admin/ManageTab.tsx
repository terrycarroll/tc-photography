'use client';

import { useState, useCallback, useEffect } from 'react';
import { GALLERIES, type Gallery } from '../../lib/galleries';
import PhotoCard, { type PhotoItem } from './PhotoCard';

interface Props {
  password: string;
}

type Message = { type: 'success' | 'error'; text: string };

export default function ManageTab({ password }: Props) {
  const [gallery, setGallery] = useState<Gallery>('coast');
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [movingId, setMovingId] = useState<string | null>(null);

  const loadPhotos = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    setPhotos([]);
    try {
      const res = await fetch(
        `/api/photos?gallery=${gallery}&password=${encodeURIComponent(password)}`
      );
      const data = await res.json();
      if (res.ok) {
        setPhotos(data.images);
      } else {
        setMessage({ type: 'error', text: data.error ?? 'Failed to load photos.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Something went wrong.' });
    } finally {
      setLoading(false);
    }
  }, [gallery, password]);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  async function handleDelete(public_id: string) {
    if (!confirm('Delete this photo? This cannot be undone.')) return;
    setDeletingId(public_id);
    setMessage(null);
    try {
      const res = await fetch('/api/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, public_id }),
      });
      const data = await res.json();
      if (res.ok) {
        setPhotos((prev) => prev.filter((p) => p.public_id !== public_id));
        setMessage({ type: 'success', text: 'Photo deleted.' });
      } else {
        setMessage({ type: 'error', text: data.error ?? 'Delete failed.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Something went wrong.' });
    } finally {
      setDeletingId(null);
    }
  }

  async function handleMove(public_id: string, to_gallery: Gallery) {
    setMovingId(public_id);
    setMessage(null);
    try {
      const res = await fetch('/api/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, public_id, to_gallery }),
      });
      const data = await res.json();
      if (res.ok) {
        setPhotos((prev) => prev.filter((p) => p.public_id !== public_id));
        setMessage({ type: 'success', text: `Photo moved to ${to_gallery}.` });
      } else {
        setMessage({ type: 'error', text: data.error ?? 'Move failed.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Something went wrong.' });
    } finally {
      setMovingId(null);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Gallery picker + refresh */}
      <div className="flex items-center gap-3 mb-6">
        <select
          value={gallery}
          onChange={(e) => {
            setGallery(e.target.value as Gallery);
            setMessage(null);
          }}
          className="border border-gray-300 rounded-lg px-4 py-2 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          {GALLERIES.map((g) => (
            <option key={g} value={g}>
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </option>
          ))}
        </select>
        <button
          onClick={loadPhotos}
          disabled={loading}
          className="px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
        {photos.length > 0 && (
          <span className="text-sm text-gray-400 ml-auto">
            {photos.length} photo{photos.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Status message */}
      {message && (
        <p
          className={`text-sm text-center rounded-lg py-3 px-4 mb-4 ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
          }`}
        >
          {message.text}
        </p>
      )}

      {/* Empty states */}
      {loading && (
        <p className="text-center text-gray-400 text-sm py-12">Loading photos...</p>
      )}
      {!loading && photos.length === 0 && (
        <p className="text-center text-gray-400 text-sm py-12">No photos in this gallery.</p>
      )}

      {/* Photo grid */}
      {!loading && photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {photos.map((photo) => (
            <PhotoCard
              key={photo.public_id}
              photo={photo}
              currentGallery={gallery}
              isDeleting={deletingId === photo.public_id}
              isMoving={movingId === photo.public_id}
              onDelete={handleDelete}
              onMove={handleMove}
            />
          ))}
        </div>
      )}
    </div>
  );
}
