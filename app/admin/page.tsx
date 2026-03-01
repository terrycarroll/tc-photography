'use client';

import { useState } from 'react';
import LoginForm from './LoginForm';
import UploadTab from './UploadTab';
import ManageTab from './ManageTab';

type Tab = 'upload' | 'manage';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [tab, setTab] = useState<Tab>('upload');

  if (!authenticated) {
    return (
      <LoginForm
        onAuthenticated={(pw) => {
          setPassword(pw);
          setAuthenticated(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Admin</h1>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('upload')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === 'upload'
                ? 'bg-gray-800 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Upload Photo
          </button>
          <button
            onClick={() => setTab('manage')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === 'manage'
                ? 'bg-gray-800 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Manage Photos
          </button>
        </div>

        {tab === 'upload' && <UploadTab password={password} />}
        {tab === 'manage' && <ManageTab password={password} />}
      </div>
    </div>
  );
}
