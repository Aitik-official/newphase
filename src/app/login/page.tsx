'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, LogIn, UserPlus } from 'lucide-react';

type Mode = 'login' | 'signup';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setError('Email and password are required.');
      return;
    }
    const stored = typeof window !== 'undefined' ? localStorage.getItem('users') : null;
    const users: { email: string; password: string; name: string }[] = stored ? JSON.parse(stored) : [];
    const user = users.find((u) => u.email.toLowerCase() === loginEmail.trim().toLowerCase());
    if (!user || user.password !== loginPassword) {
      setError('Invalid email or password.');
      return;
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify({ name: user.name, email: user.email }));
    }
    setMessage('Logged in. Redirecting...');
    setTimeout(() => router.push('/dashboard'), 800);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      setError('Name, email and password are required.');
      return;
    }
    if (signupPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    const stored = typeof window !== 'undefined' ? localStorage.getItem('users') : null;
    const users: { email: string; password: string; name: string }[] = stored ? JSON.parse(stored) : [];
    if (users.some((u) => u.email.toLowerCase() === signupEmail.trim().toLowerCase())) {
      setError('An account with this email already exists.');
      return;
    }
    users.push({
      name: signupName.trim(),
      email: signupEmail.trim().toLowerCase(),
      password: signupPassword,
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify({ name: signupName.trim(), email: signupEmail.trim().toLowerCase() }));
    }
    setMessage('Account created. Redirecting...');
    setTimeout(() => router.push('/dashboard'), 800);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h1 className="text-xl font-bold text-slate-900 text-center">
              {mode === 'login' ? 'Log in' : 'Sign up'}
            </h1>
            <p className="text-sm text-slate-500 text-center mt-1">
              {mode === 'login' ? 'Enter your credentials' : 'Create a new account'}
            </p>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
                {error}
              </div>
            )}
            {message && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-sm text-emerald-700">
                {message}
              </div>
            )}

            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <LogIn size={16} /> Log in
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="Your name"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password (min 6)</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <UserPlus size={16} /> Sign up
                </button>
              </form>
            )}

            <div className="mt-5 pt-4 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login');
                  setError('');
                  setMessage('');
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
              </button>
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-slate-400 mt-4">Basic demo — credentials stored locally only.</p>
      </div>
    </div>
  );
}
