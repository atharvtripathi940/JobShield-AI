import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { X, Lock, Mail, User, ShieldCheck, Sparkles, Key, ShieldAlert, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, signup, switchDemoRole } = useAuth();
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [selectedRole, setSelectedRole] = useState<'user' | 'admin'>('user');

  // Form Inputs
  const [email, setEmail] = useState('atharv.student@university.edu');
  const [password, setPassword] = useState('StudentPass123!');
  const [fullName, setFullName] = useState('Atharv Tripathi');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isAdmin = selectedRole === 'admin';

  const handleRoleChange = (role: 'user' | 'admin') => {
    setSelectedRole(role);
    setError(null);
    if (role === 'admin') {
      setEmail('security.lead@jobshield.ai');
      setFullName('CyberSec Lead');
      setPassword('AdminSec2026!');
    } else {
      setEmail('atharv.student@university.edu');
      setFullName('Atharv Tripathi');
      setPassword('StudentPass123!');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (authMode === 'signin') {
      const res = await login(email, password, selectedRole, fullName);
      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'Sign in failed. Please check your email and password.');
      }
    } else {
      const res = await signup(email, password, fullName, selectedRole);
      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'Registration failed.');
      }
    }
    setIsSubmitting(false);
  };

  const handleQuickAccess = (role: 'user' | 'admin') => {
    switchDemoRole(role);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-md rounded-2xl bg-[#090e1f] border p-6 shadow-2xl text-slate-100 transition-all ${
          isAdmin
            ? 'border-red-500/40 shadow-[0_0_50px_rgba(239,68,68,0.2)]'
            : 'border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.2)]'
        }`}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Role Selector Tabs */}
        <div className="mb-6">
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 text-center mb-2 font-bold">
            Select Authentication Portal
          </p>
          <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-950 border border-slate-800">
            <button
              type="button"
              onClick={() => handleRoleChange('user')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                !isAdmin
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Candidate / Student</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                isAdmin
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.2)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Security Admin</span>
            </button>
          </div>
        </div>

        {/* Header Icon & Title */}
        <div className="text-center mb-5">
          <div className={`w-12 h-12 rounded-xl p-[1.5px] mx-auto mb-2.5 transition-transform ${
            isAdmin
              ? 'bg-gradient-to-tr from-red-500 to-purple-600'
              : 'bg-gradient-to-tr from-cyan-500 to-indigo-600'
          }`}>
            <div className="w-full h-full bg-[#080d1a] rounded-[10px] flex items-center justify-center">
              {isAdmin ? (
                <ShieldAlert className="w-6 h-6 text-red-400" />
              ) : (
                <Lock className="w-6 h-6 text-cyan-400" />
              )}
            </div>
          </div>

          <h3 className="text-lg font-bold text-white flex items-center justify-center gap-2">
            <span>
              {authMode === 'signin'
                ? (isAdmin ? 'Admin Portal Sign In' : 'Candidate Sign In')
                : (isAdmin ? 'Register Security Admin' : 'Create Candidate Profile')}
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
              isAdmin
                ? 'bg-red-950 text-red-300 border border-red-800'
                : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
            }`}>
              {isAdmin ? 'ADMIN' : 'CANDIDATE'}
            </span>
          </h3>

          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {isAdmin
              ? 'Moderate peer allegations, audit scam signatures, and manage security feeds.'
              : 'Analyze job offers, track verified scams, and safeguard your career.'}
          </p>
        </div>

        {/* 1-Click Quick Access Option */}
        <div className={`mb-4 p-3 rounded-xl border flex items-center justify-between text-xs ${
          isAdmin
            ? 'bg-red-950/30 border-red-500/30 text-red-300'
            : 'bg-cyan-950/30 border-cyan-500/30 text-cyan-300'
        }`}>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span className="font-semibold">Instant Access:</span>
          </div>
          <button
            type="button"
            onClick={() => handleQuickAccess(selectedRole)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
              isAdmin
                ? 'bg-red-500/30 hover:bg-red-500/40 border-red-400 text-red-200'
                : 'bg-cyan-500/30 hover:bg-cyan-500/40 border-cyan-400 text-cyan-200'
            }`}
          >
            Continue as {isAdmin ? 'Admin' : 'Candidate'} &rarr;
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-red-950/60 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Main Sign In / Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-300">
                {isAdmin ? 'Administrator Name' : 'Full Name'}
              </label>
              <span className="text-[10px] text-slate-400 font-mono">Visible on Profile</span>
            </div>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                required={authMode === 'signup'}
                placeholder={isAdmin ? 'e.g. CyberSec Lead' : 'e.g. Atharv Tripathi'}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-500 focus:outline-none text-white placeholder-slate-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              {isAdmin ? 'Corporate Admin Email' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                placeholder={isAdmin ? 'admin@jobshield.ai' : 'student@university.edu'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-500 focus:outline-none text-white placeholder-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-9 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-500 focus:outline-none text-white placeholder-slate-500 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2.5 top-2 p-0.5 text-slate-400 hover:text-slate-200"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2.5 rounded-xl text-white font-bold text-xs tracking-wider transition-all disabled:opacity-50 mt-3 shadow-lg ${
              isAdmin
                ? 'bg-gradient-to-r from-red-600 via-rose-600 to-purple-600 hover:opacity-90 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                : 'bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:opacity-90 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
            }`}
          >
            {isSubmitting
              ? 'Authenticating...'
              : authMode === 'signin'
              ? (isAdmin ? 'Sign In as Security Admin' : 'Sign In as Candidate')
              : (isAdmin ? 'Create Admin Account' : 'Create Candidate Account')}
          </button>
        </form>

        {/* Toggle between Sign In and Sign Up */}
        <div className="mt-4 pt-3 border-t border-slate-800 text-center text-xs text-slate-400">
          {authMode === 'signin' ? (
            <span>
              Need a new account?{' '}
              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setError(null); }}
                className="text-cyan-400 hover:underline font-bold"
              >
                Sign up here
              </button>
            </span>
          ) : (
            <span>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => { setAuthMode('signin'); setError(null); }}
                className="text-cyan-400 hover:underline font-bold"
              >
                Sign in to existing account
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
