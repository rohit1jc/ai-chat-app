'use client';

import { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import Chat from '@/components/Chat';

export default function Home() {
  const [user, setUser] = useState<any>(null);

  const handleLoginSuccess = async (credentialResponse: any) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      const data = await res.json();
      setUser(data.user);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      {!user ? (
        <div className="flex flex-col items-center gap-8 bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-800">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">AI Chat Hub</h1>
            <p className="text-gray-400">Sign in to join the conversation</p>
          </div>
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => console.log('Login Failed')}
            theme="filled_black"
            shape="pill"
          />
        </div>
      ) : (
        <div className="w-full max-w-4xl h-[80vh] flex flex-col bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
          <div className="flex items-center justify-between p-4 bg-gray-800/50 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <img src={user.picture} alt="Profile" className="w-10 h-10 rounded-full" />
              <div>
                <h2 className="font-semibold">{user.name}</h2>
                <p className="text-xs text-gray-400">{user.isPremium ? 'Premium User' : 'Free User'}</p>
              </div>
            </div>
            <button 
              onClick={() => setUser(null)}
              className="text-sm text-gray-400 hover:text-white transition"
            >
              Sign out
            </button>
          </div>
          <Chat user={user} setUser={setUser} />
        </div>
      )}
    </main>
  );
}
