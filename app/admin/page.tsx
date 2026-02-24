'use client';

import { useState, useRef } from 'react';
import { GALLERIES, type Gallery } from '../../lib/galleries';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [gallery, setGallery] = useState<Gallery>('coast');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password is sent to the API to verify — never exposed to the browser
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setAuthenticated(true);
      } else {
        setAuthError('Incorrect password.');
      }
    } catch {
      setAuthError('Something went wrong. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  }

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
        setMessage({ type: 'success', text: `Photo uploaded to ${gallery} successfully. It will appear on the site within a minute.` });
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

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-gray-400"
              autoFocus
            />
            {authError && <p className="text-red-500 text-sm">{authError}</p>}
            <button
              type="submit"
              disabled={authLoading}
              className="bg-gray-800 text-white rounded-lg py-3 text-base font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {authLoading ? 'Checking...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2 text-center">Add a Photo</h1>
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
                message.type === 'success'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-600'
              }`}
            >
              {message.text}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
