/**
 * JobShield AI - Next-Generation AI-Powered Job & Internship Fraud Detection Platform
 * @license Apache-2.0
 */

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import { LanguageProvider } from './context/LanguageContext.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { ShieldBotWidget } from './components/ShieldBotWidget.js';
import { AuthModal } from './components/AuthModal.js';

// Pages
import { LandingPage } from './pages/LandingPage.js';
import { ScannerPage } from './pages/ScannerPage.js';
import { ScreenshotScannerPage } from './pages/ScreenshotScannerPage.js';
import { RecruiterCheckerPage } from './pages/RecruiterCheckerPage.js';
import { ScamDnaComparePage } from './pages/ScamDnaComparePage.js';
import { CommunityAlertsPage } from './pages/CommunityAlertsPage.js';
import { LearningCenterPage } from './pages/LearningCenterPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { AdminPage } from './pages/AdminPage.js';

export default function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <div className="min-h-screen flex flex-col bg-[#050811] text-slate-100 cyber-grid selection:bg-purple-500/30 selection:text-cyan-300">
            {/* Top Navigation */}
            <Navbar onOpenAuth={() => setAuthModalOpen(true)} />

            {/* Main Application Routes */}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/scanner" element={<ScannerPage />} />
                <Route path="/screenshot" element={<ScreenshotScannerPage />} />
                <Route path="/recruiter-check" element={<RecruiterCheckerPage />} />
                <Route path="/scam-dna-compare" element={<ScamDnaComparePage />} />
                <Route path="/community" element={<CommunityAlertsPage />} />
                <Route path="/learning" element={<LearningCenterPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Footer */}
            <Footer />

            {/* Floating ShieldBot AI Cyber Advisor */}
            <ShieldBotWidget />

            {/* Auth / Fast-Pass Modal */}
            <AuthModal
              isOpen={authModalOpen}
              onClose={() => setAuthModalOpen(false)}
            />
          </div>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
