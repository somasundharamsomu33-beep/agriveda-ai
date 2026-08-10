import React, { useState } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { WelcomeModal } from './components/WelcomeModal';
import { AuthModal } from './components/AuthModal';
import { OfflineBanner } from './components/OfflineBanner';
import { DashboardView } from './components/DashboardView';
import { CropScanView } from './components/CropScanView';
import { VoiceAssistantView } from './components/VoiceAssistantView';
import { CropCalendarView } from './components/CropCalendarView';
import { WeatherView } from './components/WeatherView';
import { MarketInsightsView } from './components/MarketInsightsView';
import { CommunityView } from './components/CommunityView';
import { ProfileView } from './components/ProfileView';

import { ActiveTab, CropDiagnosisReport } from './types';
import { useFirebase } from './context/FirebaseContext';
import { Bell, X, ShieldAlert } from 'lucide-react';

export default function App() {
  const { profile, setProfile, savedReports, saveReport } = useFirebase();
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [activeReport, setActiveReport] = useState<CropDiagnosisReport | null>(null);

  // On diagnosis completion
  const handleDiagnosisComplete = async (report: CropDiagnosisReport) => {
    setActiveReport(report);
    await saveReport(report);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans selection:bg-emerald-200 selection:text-emerald-900 flex flex-col">
      
      {/* Offline Connectivity & Cache Banner */}
      <OfflineBanner />

      {/* Top Navigation Header */}
      <Header
        profile={profile}
        setProfile={setProfile}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenNotifications={() => setShowNotifications(true)}
        unreadCount={2}
      />

      {/* Main Content Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-24">
        {activeTab === 'home' && (
          <DashboardView
            profile={profile}
            setActiveTab={setActiveTab}
            onSelectReport={(report) => {
              setActiveReport(report);
              setActiveTab('scan');
            }}
            latestReport={activeReport}
          />
        )}

        {activeTab === 'scan' && (
          <CropScanView
            profile={profile}
            onDiagnosisComplete={handleDiagnosisComplete}
            activeReport={activeReport}
            setActiveReport={setActiveReport}
          />
        )}

        {activeTab === 'assistant' && (
          <VoiceAssistantView profile={profile} />
        )}

        {activeTab === 'calendar' && (
          <CropCalendarView profile={profile} />
        )}

        {activeTab === 'market' && (
          <MarketInsightsView profile={profile} />
        )}

        {activeTab === 'weather' && (
          <WeatherView profile={profile} />
        )}

        {activeTab === 'community' && (
          <CommunityView profile={profile} />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            profile={profile}
            setProfile={setProfile}
            onOpenAuth={() => setShowAuthModal(true)}
            savedReports={savedReports}
            onSelectReport={(report) => {
              setActiveReport(report);
              setActiveTab('scan');
            }}
            setActiveTab={setActiveTab}
          />
        )}
      </main>

      {/* Screen 1: Welcome Onboarding Modal */}
      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        profile={profile}
        setProfile={setProfile}
        onGetStarted={() => {
          setShowWelcomeModal(false);
        }}
      />

      {/* Screen 2: Login / Signup Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        profile={profile}
        setProfile={setProfile}
      />

      {/* Notifications Drawer */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-start justify-end p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 space-y-4 relative mt-12">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald-700" />
                <h3 className="text-sm font-black text-slate-900">Agri Alerts & Advisories</h3>
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
                <div className="flex items-center gap-1.5 text-amber-900 font-extrabold text-xs">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Irrigation Recommended Tomorrow</span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium">
                  Soil moisture level is low in Vellore region. Schedule drip irrigation before 9 AM.
                </p>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-900 font-extrabold text-xs">
                  <span>Tomato Mandi Price Peak (+16%)</span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium">
                  Tomato prices reached ₹36/kg at Vellore Main Mandi today. Consider harvesting mature crop.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setShowNotifications(false);
                setActiveTab('calendar');
              }}
              className="w-full py-2.5 bg-emerald-700 text-white font-bold text-xs rounded-xl hover:bg-emerald-800"
            >
              View Weather & Farming Calendar
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={profile.language}
      />

    </div>
  );
}
