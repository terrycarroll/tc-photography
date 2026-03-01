'use client';

import { useState, useRef } from 'react';
import { GALLERIES, type Gallery } from '../../lib/galleries';

interface Props {
  password: string;
}

type Message = { type: 'success' | 'error'; text: string };

export default function UploadTab({ password }: Props) {
  const [gallery, setGallery] = useState<Gallery>('coast');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('gallery', gallery);
    formData.append('password', password);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) {
        setMessage({
          type: 'success',
          text: `Photo uploaded to ${gallery} successfully. It will appear on the site within a minute.`,
        });
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        setMessage({ type: 'error', text: data.error ?? 'Upload failed. Please try again.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-8 max-w-md mx-auto">
      <p className="text-gray-500 text-sm text-center mb-8">
        Choose a gallery, pick your photo, and upload.
      </p>
      <form onSubmit={handleUpload} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Gallery</label>
          <select
            value={gallery}
            onChange={(e) => setGallery(e.target.value as Gallery)}
            className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            {GALLERIES.map((g) => (
              <option key={g} value={g}>
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Photo</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="border border-gray-300 rounded-lg px-4 py-3 text-gray-700 text-base file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-gray-100 file:text-gray-700 file:text-sm hover:file:bg-gray-200"
          />
        </div>

        <button
          type="submit"
          disabled={!file || uploading}
          className="bg-gray-800 text-white rounded-lg py-3 text-base font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Uploading...' : 'Upload Photo'}
        </button>

        {message && (
          <p
            className={`text-sm text-center rounded-lg py-3 px-4 ${
              message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
            }`}
          >
            {message.text}
          </p>
        )}
      </form>
    </div>
  );
}
