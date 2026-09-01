import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  Building, 
  FileText, 
  Award, 
  GraduationCap, 
  Tractor, 
  Wrench, 
  Settings2, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw 
} from 'lucide-react';
import { UserRole, UserProfile } from '../../types';
import { AuthService } from '../../lib/authService';
import { useLanguage } from '../../context/LanguageContext';

interface RoleAuthModalProps {
  role: UserRole;
  onClose: () => void;
  onSuccess: (profile: UserProfile) => void;
  onBackToHub?: () => void;
}

export const ROLE_HEADERS: Record<UserRole, { title: string; subtitle: string; emailLabel: string; primaryCta: string }> = {
  farmer: {
    title: 'Welcome back, Farmer',
    subtitle: 'Manage your farm, crops and agricultural decisions with AgriVeda.',
    emailLabel: 'Email / Mobile Number',
    primaryCta: 'Login as Farmer'
  },
  b2b_vendor: {
    title: 'B2B Vendor Portal',
    subtitle: 'Connect your agricultural business with buyers and farming communities.',
    emailLabel: 'Business Email',
    primaryCta: 'Login as B2B Vendor'
  },
  b2c_vendor: {
    title: 'B2C Vendor Portal',
    subtitle: 'Sell agricultural products directly to customers.',
    emailLabel: 'Email / Mobile Number',
    primaryCta: 'Login as B2C Vendor'
  },
  agronomist: {
    title: 'Agronomist Portal',
    subtitle: 'Help farmers make better agricultural decisions.',
    emailLabel: 'Professional Email',
    primaryCta: 'Login as Agronomist'
  },
  research_scholar: {
    title: 'Research Scholar Portal',
    subtitle: 'Access agricultural research tools, datasets and knowledge resources.',
    emailLabel: 'Academic Email',
    primaryCta: 'Login as Research Scholar'
  },
  equipment_vendor: {
    title: 'Agri Equipment Marketplace',
    subtitle: 'Buy, sell and manage agricultural machinery and equipment.',
    emailLabel: 'Business Email / Mobile',
    primaryCta: 'Login as Equipment Vendor'
  },
  technician: {
    title: 'Agri Technician Portal',
    subtitle: 'Provide reliable agricultural machinery service and technical support.',
    emailLabel: 'Mobile Number / Email',
    primaryCta: 'Login as Technician'
  },
  spare_parts_retailer: {
    title: 'Agri Spare Parts Marketplace',
    subtitle: 'Manage agricultural spare parts inventory, orders and customers.',
    emailLabel: 'Business Email / Mobile',
    primaryCta: 'Login as Spare Parts Retailer'
  },
  // Fallbacks
  'loan-officer': { title: 'Loan Officer Portal', subtitle: 'Access agricultural credit & Kisan Credit Card portal.', emailLabel: 'Official Email', primaryCta: 'Login' },
  researcher: { title: 'Researcher Portal', subtitle: 'Access crop trial data.', emailLabel: 'Email', primaryCta: 'Login' },
  institute: { title: 'Institution Portal', subtitle: 'Manage campus research.', emailLabel: 'Email', primaryCta: 'Login' },
  vendor: { title: 'Vendor Portal', subtitle: 'Manage produce catalog.', emailLabel: 'Email', primaryCta: 'Login' },
  retail_vendor: { title: 'Retail Vendor Portal', subtitle: 'Manage store orders.', emailLabel: 'Email', primaryCta: 'Login' },
  wholesale_vendor: { title: 'Wholesale Portal', subtitle: 'Bulk trading.', emailLabel: 'Email', primaryCta: 'Login' },
  input_vendor: { title: 'Input Vendor Portal', subtitle: 'Manage seed & fertilizer sales.', emailLabel: 'Email', primaryCta: 'Login' },
  business: { title: 'Business Portal', subtitle: 'Agricultural trade.', emailLabel: 'Email', primaryCta: 'Login' },
  student: { title: 'Student Portal', subtitle: 'Learn agriculture.', emailLabel: 'Email', primaryCta: 'Login' },
  institution: { title: 'Institution Portal', subtitle: 'Research portal.', emailLabel: 'Email', primaryCta: 'Login' },
  bank: { title: 'Bank Portal', subtitle: 'Agri loans.', emailLabel: 'Email', primaryCta: 'Login' },
  financial_institution: { title: 'Financial Portal', subtitle: 'KCC loans.', emailLabel: 'Email', primaryCta: 'Login' },
  government: { title: 'Government Portal', subtitle: 'APMC supervision.', emailLabel: 'Email', primaryCta: 'Login' },
  buyer: { title: 'Buyer Portal', subtitle: 'Buy produce.', emailLabel: 'Email', primaryCta: 'Login' },
  fpo: { title: 'FPO Portal', subtitle: 'Farmer Producer Organization.', emailLabel: 'Email', primaryCta: 'Login' },
  admin: { title: 'Admin Audit Portal', subtitle: 'Supervise system.', emailLabel: 'Email', primaryCta: 'Login' },
  verifier: { title: 'Verification Officer', subtitle: 'Verify identity.', emailLabel: 'Email', primaryCta: 'Login' }
};

export const RoleAuthModal: React.FC<RoleAuthModalProps> = ({
  role,
  onClose,
  onSuccess,
  onBackToHub
}) => {
  const { t } = useLanguage();
  const headerInfo = ROLE_HEADERS[role] || ROLE_HEADERS.farmer;

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Role-Specific Register Fields State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regBusinessName, setRegBusinessName] = useState('');
  const [regGstNumber, setRegGstNumber] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regState, setRegState] = useState('Tamil Nadu');
  const [regDistrict, setRegDistrict] = useState('Tiruvallur');
  const [regSpecialization, setRegSpecialization] = useState('Crop Pathology');
  const [regInstitution, setRegInstitution] = useState('');
  const [regScholarId, setRegScholarId] = useState('');
  const [regServiceArea, setRegServiceArea] = useState('Local District');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);
    setLoadingText('Signing you in...');

    setTimeout(() => {
      const res = AuthService.authenticateUser(identifier, password, role);
      setIsLoading(false);

      if (res.success && res.profile) {
        onSuccess(res.profile);
      } else {
        setErrorMessage(res.error || 'We couldn\'t sign you in. Please check your details and try again.');
      }
    }, 600);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);
    setLoadingText('Creating your account...');

    setTimeout(() => {
      const res = AuthService.registerAccount({
        name: regName || regBusinessName,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
        role: role,
        businessName: regBusinessName,
        gstNumber: regGstNumber,
        specialization: regSpecialization,
        institution: regInstitution,
        scholarId: regScholarId,
        serviceArea: regServiceArea,
        location: `${regDistrict}, ${regState}, India`
      });

      setIsLoading(false);

      if (res.success && res.account) {
        setSuccessMessage('Account registered successfully! Signing you in...');
        setTimeout(() => {
          const authRes = AuthService.authenticateUser(regEmail || regPhone, regPassword, role);
          if (authRes.profile) onSuccess(authRes.profile);
        }, 800);
      } else {
        setErrorMessage(res.error || 'Could not complete registration. Please check your information.');
      }
    }, 800);
  };

  const handleGoogleOAuth = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    setLoadingText('Connecting to Google...');

    try {
      const res = await AuthService.signInWithGoogle(role);
      setIsLoading(false);
      if (res.profile) {
        onSuccess(res.profile);
      } else {
        setErrorMessage('Google sign-in couldn\'t be completed. Please try again.');
      }
    } catch {
      setIsLoading(false);
      setErrorMessage('Google sign-in couldn\'t be completed. Please try again.');
    }
  };

  const handleGitHubOAuth = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    setLoadingText('Connecting to GitHub...');

    try {
      const res = await AuthService.signInWithGitHub(role);
      setIsLoading(false);
      if (res.profile) {
        onSuccess(res.profile);
      } else {
        setErrorMessage('GitHub sign-in couldn\'t be completed. Please try again.');
      }
    } catch {
      setIsLoading(false);
      setErrorMessage('GitHub sign-in couldn\'t be completed. Please try again.');
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const res = AuthService.resetPassword(identifier);
    if (res.success) {
      setSuccessMessage(res.message);
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden my-8 relative">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-6 sm:p-8 relative">
          <div className="flex items-center justify-between">
            {onBackToHub && (
              <button
                onClick={onBackToHub}
                className="flex items-center gap-1 text-xs font-bold text-blue-200 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Switch Role</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors ml-auto cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-1 mt-3">
            <h3 className="text-xl sm:text-2xl font-black text-white">{headerInfo.title}</h3>
            <p className="text-xs sm:text-sm text-blue-200 font-medium leading-relaxed">
              {headerInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="p-6 sm:p-8 space-y-6">

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-xs text-rose-900 font-semibold animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-xs text-emerald-900 font-semibold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 1. LOGIN MODE */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">{headerInfo.emailLabel}</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter email or 10-digit mobile..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 block">Password</label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Primary Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-black text-sm rounded-2xl shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>{loadingText}</span>
                  </>
                ) : (
                  <span>{headerInfo.primaryCta}</span>
                )}
              </button>

              {/* OAuth Separator */}
              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider absolute">
                  OR
                </span>
              </div>

              {/* OAuth Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleGoogleOAuth}
                  disabled={isLoading}
                  className="py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={handleGitHubOAuth}
                  disabled={isLoading}
                  className="py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  <span>GitHub</span>
                </button>
              </div>

              {/* Create Account Link */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  New to AgriVeda? Create {headerInfo.title.replace('Welcome back, ', '')} Account
                </button>
              </div>
            </form>
          )}

          {/* 2. REGISTER MODE */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
              
              {/* Universal Fields */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  {role === 'b2b_vendor' || role === 'equipment_vendor' || role === 'spare_parts_retailer' ? 'Business / Store Name' : 'Full Name'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Enter full name or business title..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Mobile Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="10-digit mobile"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Role Specific Extra Fields */}
              {(role === 'b2b_vendor' || role === 'equipment_vendor' || role === 'spare_parts_retailer') && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">GST Number (Optional)</label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={regGstNumber}
                      onChange={(e) => setRegGstNumber(e.target.value)}
                      placeholder="33AABCS1429B1Z0"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {role === 'agronomist' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Agronomy Specialization</label>
                  <div className="relative">
                    <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={regSpecialization}
                      onChange={(e) => setRegSpecialization(e.target.value)}
                      placeholder="Plant Pathology, Soil Health, Entomology..."
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {role === 'research_scholar' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Institution / University</label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={regInstitution}
                        onChange={(e) => setRegInstitution(e.target.value)}
                        placeholder="ICAR / TNAU / IARI"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Scholar ID</label>
                    <input
                      type="text"
                      value={regScholarId}
                      onChange={(e) => setRegScholarId(e.target.value)}
                      placeholder="SCH-9842"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {role === 'technician' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Service District / Coverage Area</label>
                  <div className="relative">
                    <Wrench className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={regServiceArea}
                      onChange={(e) => setRegServiceArea(e.target.value)}
                      placeholder="Tiruvallur & Kanchipuram Districts"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">State</label>
                  <input
                    type="text"
                    value={regState}
                    onChange={(e) => setRegState(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">District</label>
                  <input
                    type="text"
                    value={regDistrict}
                    onChange={(e) => setRegDistrict(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Create Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="At least 6 characters..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-black text-xs rounded-2xl shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>{loadingText}</span>
                  </>
                ) : (
                  <span>Complete Account Registration</span>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  Already registered? Back to Login
                </button>
              </div>
            </form>
          )}

          {/* 3. FORGOT PASSWORD MODE */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Registered Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="enter registered email..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-2xl shadow-md cursor-pointer"
              >
                Send Password Reset Instructions
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
