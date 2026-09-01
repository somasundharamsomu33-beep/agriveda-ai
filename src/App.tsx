import React, { useState, useEffect } from 'react';
import { useFirebase } from './context/FirebaseContext';
import { ActiveTab, CropDiagnosisReport, UserProfile, UserRole } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { SplashView } from './components/SplashView';
import { OnboardingView } from './components/OnboardingView';
import { LoginView } from './components/LoginView';
import { SignUpView } from './components/SignUpView';
import { ProfileSetupView } from './components/ProfileSetupView';
import { KYCVerificationView } from './components/KYCVerificationView';
import { DashboardView } from './components/DashboardView';
import { VoiceAssistantView } from './components/VoiceAssistantView';
import { CropScanView } from './components/CropScanView';
import { CropCalendarView } from './components/CropCalendarView';
import { WeatherView } from './components/WeatherView';
import { MarketPricesView } from './components/MarketPricesView';
import { FarmerPassportView } from './components/FarmerPassportView';
import { MyFarmView } from './components/MyFarmView';
import { NotificationsView } from './components/NotificationsView';
import { SettingsView } from './components/SettingsView';
import { HelpSupportView } from './components/HelpSupportView';
import { CommunityView } from './components/CommunityView';
import { MarketplaceView } from './components/MarketplaceView';
import { MapsView } from './components/MapsView';
import { MAPCNView } from './components/MAPCNView';
import { AuthModal } from './components/AuthModal';
import { RoleOnboardingModal } from './components/onboarding/RoleOnboardingModal';
import { VerificationAdminModal } from './components/verification/VerificationAdminModal';
import { AdminVerificationAuditPortal } from './components/verification/AdminVerificationAuditPortal';
import { SignOutConfirmModal } from './components/ui/SignOutConfirmModal';
import { MultiRoleAuthHub } from './components/auth/MultiRoleAuthHub';
import { RoleAuthModal } from './components/auth/RoleAuthModal';
import { B2BVendorDashboardView } from './components/dashboards/B2BVendorDashboardView';
import { B2CVendorDashboardView } from './components/dashboards/B2CVendorDashboardView';
import { AgronomistDashboardView } from './components/dashboards/AgronomistDashboardView';
import { ResearchScholarDashboardView } from './components/dashboards/ResearchScholarDashboardView';
import { EquipmentVendorDashboardView } from './components/dashboards/EquipmentVendorDashboardView';
import { TechnicianDashboardView } from './components/dashboards/TechnicianDashboardView';
import { SparePartsDashboardView } from './components/dashboards/SparePartsDashboardView';
import { AgriMarketplaceHub } from './components/marketplace/AgriMarketplaceHub';
import { NearbyServicesHub } from './components/nearby/NearbyServicesHub';
import { MyLandDashboard } from './components/land/MyLandDashboard';
import { VendorEcommerceDashboard } from './components/vendor/VendorEcommerceDashboard';
import { AuthService } from './lib/authService';
import { Bot, Sparkles } from 'lucide-react';

export default function App() {
  const { user, profile, setProfile, logout } = useFirebase();
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [activeReport, setActiveReport] = useState<CropDiagnosisReport | null>(null);

  // Auth Modals State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedAuthRole, setSelectedAuthRole] = useState<UserRole | null>(null);
  const [showRoleOnboardingModal, setShowRoleOnboardingModal] = useState(false);
  const [showVerificationAdminModal, setShowVerificationAdminModal] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  // Helper to redirect to role-specific dashboard
  const redirectToRoleDashboard = (userProfile: UserProfile) => {
    const role = userProfile.role || 'farmer';
    if (role === 'b2b_vendor') setActiveTab('b2b_vendor_dashboard');
    else if (role === 'b2c_vendor') setActiveTab('b2c_vendor_dashboard');
    else if (role === 'agronomist') setActiveTab('agronomist_dashboard');
    else if (role === 'research_scholar') setActiveTab('research_scholar_dashboard');
    else if (role === 'equipment_vendor') setActiveTab('equipment_vendor_dashboard');
    else if (role === 'technician') setActiveTab('technician_dashboard');
    else if (role === 'spare_parts_retailer') setActiveTab('spare_parts_dashboard');
    else setActiveTab('home');
  };

  const handleAuthSuccess = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    setSelectedAuthRole(null);
    setShowAuthModal(false);
    redirectToRoleDashboard(updatedProfile);
  };

  const handleAdminApproveUser = () => {
    setProfile((prev: UserProfile) => ({
      ...prev,
      verificationStatus: 'FULLY_VERIFIED',
      verificationScore: 100,
    }));
  };

  const handleConfirmLogout = () => {
    logout();
    AuthService.clearCurrentSession();
    setShowSignOutModal(false);
    setActiveTab('auth_hub');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      {/* Desktop Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
      />

      {/* Top Header */}
      <Header
        profile={profile}
        setProfile={setProfile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setActiveTab('auth_hub')}
        onOpenNotifications={() => setActiveTab('notifications')}
        onOpenSignOutConfirm={() => setShowSignOutModal(true)}
        unreadCount={2}
      />

      {/* Main Content View Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-28 lg:pl-72">
        {/* 1. Splash / Launch Screen */}
        {activeTab === 'splash' && (
          <SplashView onContinue={() => setActiveTab('onboarding')} />
        )}

        {/* 2. Onboarding */}
        {activeTab === 'onboarding' && (
          <OnboardingView
            onComplete={() => setActiveTab('auth_hub')}
            onSkip={() => setActiveTab('home')}
          />
        )}

        {/* 3. Multi-Role Authentication Hub */}
        {activeTab === 'auth_hub' && (
          <MultiRoleAuthHub
            onSelectRole={(role) => setSelectedAuthRole(role)}
          />
        )}

        {/* 4. Login & Sign Up Compatibility Views */}
        {activeTab === 'login' && (
          <LoginView
            onLoginSuccess={() => setActiveTab('home')}
            onNavigateSignUp={() => setActiveTab('signup')}
            onForgotPassword={() => alert("Password reset link sent to your registered mobile/email.")}
          />
        )}

        {activeTab === 'signup' && (
          <SignUpView
            onSignUpSuccess={() => setActiveTab('profile_setup')}
            onNavigateLogin={() => setActiveTab('login')}
          />
        )}

        {/* 5. Farmer Profile Setup */}
        {activeTab === 'profile_setup' && (
          <ProfileSetupView
            profile={profile}
            setProfile={setProfile}
            onComplete={() => setActiveTab('kyc')}
          />
        )}

        {/* 6. KYC Verification */}
        {activeTab === 'kyc' && (
          <KYCVerificationView
            profile={profile}
            setProfile={setProfile}
            onComplete={() => setActiveTab('passport')}
          />
        )}

        {/* 7. Main Farmer Dashboard */}
        {activeTab === 'home' && (
          <DashboardView
            profile={profile}
            setActiveTab={setActiveTab}
          />
        )}

        {/* 8. Role-Specific Dashboards */}
        {activeTab === 'b2b_vendor_dashboard' && (
          <B2BVendorDashboardView profile={profile} />
        )}

        {activeTab === 'b2c_vendor_dashboard' && (
          <B2CVendorDashboardView profile={profile} />
        )}

        {activeTab === 'agronomist_dashboard' && (
          <AgronomistDashboardView profile={profile} />
        )}

        {activeTab === 'research_scholar_dashboard' && (
          <ResearchScholarDashboardView profile={profile} />
        )}

        {activeTab === 'equipment_vendor_dashboard' && (
          <EquipmentVendorDashboardView profile={profile} />
        )}

        {activeTab === 'technician_dashboard' && (
          <TechnicianDashboardView profile={profile} />
        )}

        {activeTab === 'spare_parts_dashboard' && (
          <SparePartsDashboardView profile={profile} />
        )}

        {/* AI Assistant & Core Features */}
        {activeTab === 'assistant' && (
          <VoiceAssistantView profile={profile} />
        )}

        {activeTab === 'scan' && (
          <CropScanView profile={profile} activeReport={activeReport} onNavigateTab={setActiveTab} />
        )}

        {activeTab === 'calendar' && (
          <CropCalendarView profile={profile} />
        )}

        {activeTab === 'weather' && (
          <WeatherView profile={profile} />
        )}

        {activeTab === 'market' && (
          <MarketPricesView profile={profile} />
        )}

        {activeTab === 'passport' && (
          <FarmerPassportView profile={profile} />
        )}

        {activeTab === 'my_farm' && (
          <MyFarmView profile={profile} />
        )}

        {activeTab === 'notifications' && (
          <NotificationsView />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            profile={profile}
            setProfile={setProfile}
            onNavigateTab={setActiveTab}
            onOpenSignOutConfirm={() => setShowSignOutModal(true)}
          />
        )}

        {activeTab === 'help' && (
          <HelpSupportView />
        )}

        {activeTab === 'my_land' && (
          <MyLandDashboard profile={profile} />
        )}

        {activeTab === 'nearby' && (
          <NearbyServicesHub profile={profile} onNavigateTab={setActiveTab} />
        )}

        {activeTab === 'marketplace' && (
          <AgriMarketplaceHub profile={profile} onNavigateTab={setActiveTab} />
        )}

        {activeTab === 'vendor_dashboard' && (
          <VendorEcommerceDashboard profile={profile} />
        )}

        {activeTab === 'maps' && (
          <MapsView profile={profile} targetFocusCoords={null} />
        )}

        {(activeTab === 'mapcn' || activeTab === 'seedbank') && (
          <MAPCNView profile={profile} setActiveTab={setActiveTab} />
        )}

        {activeTab === 'community' && (
          <CommunityView profile={profile} />
        )}

        {activeTab === 'profile' && (
          <FarmerPassportView profile={profile} />
        )}
      </main>

      {/* Floating AI Assistant FAB */}
      {activeTab !== 'assistant' && (
        <button
          onClick={() => setActiveTab('assistant')}
          className="fixed bottom-20 right-4 sm:right-6 z-40 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-3 rounded-full shadow-2xl hover:shadow-blue-500/30 flex items-center gap-2 border border-blue-400 hover:scale-105 active:scale-95 transition-all group animate-bounce cursor-pointer"
        >
          <div className="relative">
            <Bot className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping"></span>
          </div>
          <span className="text-xs font-black">Ask AgriVeda AI</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </button>
      )}

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={profile.language}
      />

      {/* Role Dedicated Authentication Modal */}
      {selectedAuthRole && (
        <RoleAuthModal
          role={selectedAuthRole}
          onClose={() => setSelectedAuthRole(null)}
          onSuccess={handleAuthSuccess}
          onBackToHub={() => setSelectedAuthRole(null)}
        />
      )}

      {/* Existing Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        profile={profile}
        setProfile={setProfile}
        setActiveTab={setActiveTab}
      />

      <RoleOnboardingModal
        isOpen={showRoleOnboardingModal}
        onClose={() => setShowRoleOnboardingModal(false)}
        profile={profile}
        setProfile={setProfile}
      />

      <VerificationAdminModal
        isOpen={showVerificationAdminModal}
        onClose={() => setShowVerificationAdminModal(false)}
        onApproveUser={handleAdminApproveUser}
      />

      <SignOutConfirmModal
        isOpen={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        onConfirmLogout={handleConfirmLogout}
        profile={profile}
      />
    </div>
  );
}
