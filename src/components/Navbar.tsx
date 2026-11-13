import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Scan, 
  Camera, 
  UserCheck, 
  Dna, 
  Users, 
  BookOpen, 
  Lock, 
  Menu, 
  X,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useLanguage } from '../context/LanguageContext.js';

interface NavbarProps {
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const { user, logout, switchDemoRole, updateProfile } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [customNameInput, setCustomNameInput] = useState('');
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
        setIsEditingName(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setUserMenuOpen(false);
        setIsEditingName(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const userInitial = (user?.fullName || user?.email || 'U').trim().charAt(0).toUpperCase();
  const displayUserName = user?.fullName?.trim() || user?.email?.split('@')[0] || 'User';

  const navLinks = [
    { to: '/scanner', label: t.scannerNav, icon: Scan },
    { to: '/screenshot', label: t.screenshotNav, icon: Camera },
    { to: '/recruiter-check', label: t.recruiterNav, icon: UserCheck },
    { to: '/scam-dna-compare', label: t.scamDnaNav, icon: Dna },
    { to: '/community', label: t.communityNav, icon: Users },
    { to: '/learning', label: t.learningNav, icon: BookOpen },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-[#070b14]/90 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-[1.5px] transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-[#090d1a] rounded-[10px] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-wider text-white flex items-center gap-1.5">
                JOBSHIELD <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">AI</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-mono -mt-1 font-semibold">
                CYBER CAREER GUARD
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
                  {link.label}
                </Link>
              );
            })}

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive('/admin')
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                    : 'text-red-400 hover:bg-red-950/40'
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-red-400" />
                {t.adminNav}
              </Link>
            )}
          </div>

          {/* Right Action Bar */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Sign In / User Profile Menu */}
            <div className="relative" ref={userMenuRef}>
              {user ? (
                <>
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    aria-expanded={userMenuOpen}
                    aria-haspopup="menu"
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-900/95 border border-slate-700/80 hover:border-cyan-500/60 transition-all text-xs shadow-sm hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] group cursor-pointer"
                    title={displayUserName}
                  >
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[11px] shrink-0 transition-transform group-hover:scale-105 ${
                      user.role === 'admin'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-[0_0_8px_rgba(239,68,68,0.2)]'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.2)]'
                    }`}>
                      {userInitial}
                    </div>
                    <div className="text-left flex flex-col justify-center min-w-0 max-w-[120px] sm:max-w-[180px]">
                      <p className="text-slate-100 font-semibold truncate leading-tight text-xs tracking-tight" title={displayUserName}>
                        {displayUserName}
                      </p>
                      <p className={`text-[10px] truncate leading-tight font-mono ${user.role === 'admin' ? 'text-red-400' : 'text-cyan-400'}`}>
                        {user.role === 'admin' ? 'Security Admin' : 'Candidate'}
                      </p>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 group-hover:text-slate-200 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-[#0c1222] border border-slate-700 rounded-xl shadow-2xl p-2.5 z-50 text-xs">
                      <div className="px-2 py-2 border-b border-slate-800 mb-2">
                        {isEditingName ? (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              if (customNameInput.trim()) {
                                updateProfile({ fullName: customNameInput.trim() });
                              }
                              setIsEditingName(false);
                            }}
                            className="space-y-1.5 py-1"
                          >
                            <label className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Change Profile Name:</label>
                            <input
                              type="text"
                              autoFocus
                              value={customNameInput}
                              onChange={(e) => setCustomNameInput(e.target.value)}
                              placeholder="Enter your name..."
                              className="w-full px-2.5 py-1 text-xs rounded bg-slate-950 border border-cyan-500/60 text-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
                            />
                            <div className="flex gap-1.5 pt-1">
                              <button
                                type="submit"
                                className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-bold"
                              >
                                Save Name
                              </button>
                              <button
                                type="button"
                                onClick={() => setIsEditingName(false)}
                                className="px-2.5 py-1 rounded bg-slate-800 text-slate-400 hover:text-white text-[10px]"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div>
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-slate-100 truncate text-xs" title={displayUserName}>
                                {displayUserName}
                              </p>
                              <button
                                type="button"
                                onClick={() => {
                                  setCustomNameInput(user.fullName || '');
                                  setIsEditingName(true);
                                }}
                                className="text-[10px] font-mono text-cyan-400 hover:underline shrink-0 ml-1.5 font-bold"
                              >
                                Edit Name
                              </button>
                            </div>
                            <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                            <div className="mt-1.5 flex items-center gap-1.5">
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-purple-900/40 text-purple-300 border border-purple-700/50">
                                Safety: {user.careerSafetyScore}/100
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <p className="px-2 py-1 text-[10px] font-mono uppercase text-slate-400">Account Mode</p>
                      <button
                        type="button"
                        onClick={() => { switchDemoRole('user'); setUserMenuOpen(false); }}
                        className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-cyan-300 flex items-center justify-between"
                      >
                        <span>Candidate / Student</span>
                        {user.role === 'user' && <span className="text-cyan-400 font-bold">✓</span>}
                      </button>
                      <button
                        type="button"
                        onClick={() => { switchDemoRole('admin'); setUserMenuOpen(false); }}
                        className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-red-300 flex items-center justify-between"
                      >
                        <span>Security Admin</span>
                        {user.role === 'admin' && <span className="text-red-400 font-bold">✓</span>}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          onOpenAuth();
                        }}
                        className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-between"
                      >
                        <span>Switch Account</span>
                        <span className="text-slate-500">&rarr;</span>
                      </button>

                      <div className="my-1 border-t border-slate-800"></div>

                      <button
                        type="button"
                        onClick={() => { logout(); setUserMenuOpen(false); }}
                        className="w-full text-left px-2 py-1.5 rounded hover:bg-red-500/10 text-red-400 flex items-center gap-1.5"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        {t.signOutBtn}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/95 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/60 text-slate-100 hover:text-cyan-300 font-semibold text-xs tracking-wide transition-all shadow-sm hover:shadow-[0_0_15px_rgba(6,182,212,0.18)] cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t.signInBtn}</span>
                </button>
              )}
            </div>

            {/* Quick Analyze CTA */}
            <Link
              to="/scanner"
              className="relative group overflow-hidden px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-semibold text-xs tracking-wide shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-200" />
              <span>{t.verifyJobCta}</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#090d19] border-b border-slate-800 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                  active ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-red-400 bg-red-950/20"
            >
              <Lock className="w-4 h-4" />
              {t.adminNav}
            </Link>
          )}

          <div className="pt-3 border-t border-slate-800 space-y-2">
            {user ? (
              <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-slate-900/90 border border-slate-800">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{displayUserName}</p>
                  <p className={`text-[10px] font-mono ${user.role === 'admin' ? 'text-red-400' : 'text-cyan-400'}`}>
                    {user.role === 'admin' ? 'Security Admin' : 'Candidate'}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth();
                    }}
                    className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 hover:text-white text-xs font-medium"
                  >
                    Switch
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-2.5 py-1 rounded-md bg-red-500/15 text-red-400 hover:bg-red-500/25 text-xs font-medium"
                  >
                    {t.signOutBtn}
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/60 text-slate-100 text-sm font-semibold transition-all"
              >
                <User className="w-4 h-4 text-cyan-400" />
                <span>{t.signInBtn}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
