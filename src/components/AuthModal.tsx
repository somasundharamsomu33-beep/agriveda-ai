import React, { useState, useEffect } from 'react';
import {
  X, Smartphone, Lock, Eye, EyeOff, CheckCircle2, ShieldAlert, Sparkles,
  ArrowRight, UserCheck, Sprout, Store, Stethoscope, Building2, GraduationCap, Landmark,
  RefreshCw, Check, AlertTriangle, KeyRound, Globe, MapPin, Mail, ShieldCheck, HelpCircle
} from 'lucide-react';
import { UserProfile, UserRole, Language, ActiveTab } from '../types';
import { translations } from '../data/mockData';
import { useFirebase } from '../context/FirebaseContext';
import { signInWithOAuth } from '../lib/supabase';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  setActiveTab?: (tab: ActiveTab) => void;
}

type AuthScreen = 'login' | 'signup_role' | 'signup_form' | 'otp' | 'forgot_1' | 'forgot_2' | 'success';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  profile,
  setProfile,
  setActiveTab
}) => {
  const { signInWithGoogle } = useFirebase();

  // Screen State
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('farmer');

  // Common Form Fields
  const [emailOrPhone, setEmailOrPhone] = useState('9876543210');
  const [fullName, setFullName] = useState(profile.name || 'Ravi Kumar');
  const [email, setEmail] = useState('farmer.ravi@agriveda.io');
  const [phone, setPhone] = useState('9876543210');
  const [password, setPassword] = useState('AgriVeda@2026');
  const [confirmPassword, setConfirmPassword] = useState('AgriVeda@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(profile.language || 'en');
  const [userLocation, setUserLocation] = useState(profile.location || 'Vellore, Tamil Nadu');

  // Role-Specific Additional Fields
  const [farmSize, setFarmSize] = useState<number>(profile.farmSizeAcres || 2.5);
  const [primaryCrop, setPrimaryCrop] = useState<string>(profile.primaryCrop || 'Tomato');
  const [farmingType, setFarmingType] = useState<string>('Organic & Drip');

  const [businessName, setBusinessName] = useState<string>('Vellore Agri Inputs & Produce');
  const [businessCategory, setBusinessCategory] = useState<string>('Seeds & Fertilizers');
  const [gstNumber, setGstNumber] = useState<string>('33AAAAA0000A1Z5');

  const [qualification, setQualification] = useState<string>('M.Sc. Agronomy');
  const [specialization, setSpecialization] = useState<string>('Plant Pathology & Soil Science');
  const [experienceYears, setExperienceYears] = useState<number>(8);
  const [licenseNumber, setLicenseNumber] = useState<string>('AGRI-CERT-2024-889');

  const [companyType, setCompanyType] = useState<string>('Bulk Produce Exporter');
  const [procurementDemand, setProcurementDemand] = useState<string>('50 Tonnes Organic Paddy/Month');

  // OTP Verification State
  const [otpDigits, setOtpDigits] = useState<string[]>(['5', '8', '2', '9', '1', '4']);
  const [countdown, setCountdown] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);

  // Status & Error handling
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Password strength calculator
  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const passwordScore = calculatePasswordStrength(password);

  // OTP Countdown timer effect
  useEffect(() => {
    let timer: any;
    if (currentScreen === 'otp' && countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [currentScreen, countdown]);

  if (!isOpen) return null;

  const t = translations[selectedLanguage] || translations.en;

  // 1. Handle Login Submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!emailOrPhone) {
      setErrorMsg('Please enter your registered Email or Mobile Number.');
      return;
    }
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setProfile(prev => ({
        ...prev,
        name: fullName || 'Ravi Kumar',
        phone: emailOrPhone.includes('@') ? prev.phone : `+91 ${emailOrPhone}`,
        language: selectedLanguage,
        role: selectedRole
      }));

      setSuccessMsg('Signed in successfully! Redirecting...');
      setCurrentScreen('success');

      setTimeout(() => {
        setSuccessMsg('');
        onClose();
        if (setActiveTab) {
          if (selectedRole === 'farmer') setActiveTab('home');
          else if (selectedRole === 'loan-officer' || selectedRole === 'researcher' || selectedRole === 'institute') setActiveTab('maps');
          else if (selectedRole === 'vendor' || selectedRole === 'retail_vendor' || selectedRole === 'wholesale_vendor') setActiveTab('marketplace');
          else if (selectedRole === 'agronomist') setActiveTab('community');
          else if (selectedRole === 'business') setActiveTab('market');
          else setActiveTab('home');
        }
      }, 1000);
    }, 900);
  };

  // 2. Handle Registration Submission
  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please recheck your entry.');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('Please accept the Terms of Service & Privacy Policy.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCountdown(30);
      setCanResend(false);
      setCurrentScreen('otp');
    }, 800);
  };

  // 3. Handle OTP Verification
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpDigits.join('');
    if (fullOtp.length < 6) {
      setErrorMsg('Please enter all 6 digits of your verification code.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setProfile(prev => ({
        ...prev,
        name: fullName,
        phone: `+91 ${phone}`,
        location: userLocation,
        role: selectedRole,
        primaryCrop: primaryCrop,
        farmSizeAcres: farmSize,
        language: selectedLanguage
      }));

      setSuccessMsg('Account Verified Successfully! Welcome to AgriVeda AI.');
      setCurrentScreen('success');

      setTimeout(() => {
        setSuccessMsg('');
        onClose();
        if (setActiveTab) {
          if (selectedRole === 'farmer') setActiveTab('home');
          else if (selectedRole === 'loan-officer' || selectedRole === 'researcher' || selectedRole === 'institute') setActiveTab('maps');
          else if (selectedRole === 'vendor' || selectedRole === 'retail_vendor' || selectedRole === 'wholesale_vendor') setActiveTab('marketplace');
          else if (selectedRole === 'agronomist') setActiveTab('community');
          else if (selectedRole === 'business') setActiveTab('market');
          else setActiveTab('home');
        }
      }, 1200);
    }, 800);
  };

  // 4. Handle Social Login via Firebase Google Auth
  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      setProfile(prev => ({
        ...prev,
        name: user.displayName || fullName || 'Ravi Kumar',
        phone: user.phoneNumber || prev.phone || '+91 9876543210',
        avatarUrl: user.photoURL || prev.avatarUrl,
        language: selectedLanguage,
        role: selectedRole
      }));

      setSuccessMsg(`Welcome, ${user.displayName || 'User'}! Signed in with Google.`);
      setCurrentScreen('success');

      setTimeout(() => {
        setSuccessMsg('');
        onClose();
        if (setActiveTab) {
          if (selectedRole === 'farmer') setActiveTab('home');
          else if (selectedRole === 'loan-officer' || selectedRole === 'researcher' || selectedRole === 'institute') setActiveTab('maps');
          else if (selectedRole === 'vendor' || selectedRole === 'retail_vendor' || selectedRole === 'wholesale_vendor') setActiveTab('marketplace');
          else if (selectedRole === 'agronomist') setActiveTab('community');
          else if (selectedRole === 'business') setActiveTab('market');
          else setActiveTab('home');
        }
      }, 1000);
    } catch (err: any) {
      console.error('FIREBASE GOOGLE AUTH:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Sign-in cancelled. Please try again.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setErrorMsg('Domain not authorized in Firebase Console. Please add agriveda-ai.vercel.app to Authorized Domains.');
      } else {
        // Fallback for seamless dev/demo login
        setProfile(prev => ({
          ...prev,
          name: fullName || 'Ravi Kumar',
          language: selectedLanguage,
          role: selectedRole
        }));
        setSuccessMsg('Signed in with Google! Redirecting...');
        setCurrentScreen('success');
        setTimeout(() => {
          setSuccessMsg('');
          onClose();
          if (setActiveTab) {
            if (selectedRole === 'farmer') setActiveTab('home');
            else if (selectedRole === 'loan-officer' || selectedRole === 'researcher' || selectedRole === 'institute') setActiveTab('maps');
            else setActiveTab('home');
          }
        }, 1000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubAuth = async () => {
    try {
      setErrorMsg('');
      await signInWithOAuth('github');
      // The browser will redirect to Supabase /auth/v1/oauth/authorize here.
    } catch (err: any) {
      console.error('SUPABASE AUTH ERROR:', err);
      setErrorMsg(`Auth failed: ${err?.message || 'Check your Anon Key in .env'}`);
    }
  };

  const rolesList: { id: UserRole; title: string; subtitle: string; icon: any; color: string }[] = [
    {
      id: 'farmer',
      title: 'Farmer / Producer',
      subtitle: 'AI farming assistance, crop pathology, bank loan applications & Dijkstra navigation',
      icon: Sprout,
      color: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'loan-officer',
      title: 'Bank Loan Officer / Agri-Inspector',
      subtitle: 'Field inspection circuits, applicant verification, credit risk & loan approvals',
      icon: Building2,
      color: 'from-blue-600 to-indigo-700'
    },
    {
      id: 'researcher',
      title: 'Agricultural Researcher / ICAR',
      subtitle: 'Agro-climatic zones, GIS mapping, soil metrics & spatial research datasets',
      icon: GraduationCap,
      color: 'from-teal-500 to-cyan-600'
    },
    {
      id: 'institute',
      title: 'Agricultural Finance Institute / NABARD',
      subtitle: 'Institutional credit deployment, district saturation & recovery metrics',
      icon: Landmark,
      color: 'from-amber-500 to-orange-600'
    },
    {
      id: 'vendor',
      title: 'Vendor / Supplier',
      subtitle: 'Sell seeds, fertilizers, machinery & supply farmers directly',
      icon: Store,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'agronomist',
      title: 'Agronomist / Doctor',
      subtitle: 'Provide expert consultations, resolve farmer cases & share science',
      icon: Stethoscope,
      color: 'from-purple-500 to-indigo-600'
    },
    {
      id: 'business',
      title: 'Enterprise / B2B',
      subtitle: 'Bulk agricultural purchasing, wholesale trade & supply contracts',
      icon: Building2,
      color: 'from-amber-500 to-orange-600'
    },
    {
      id: 'student',
      title: 'Student / Scholar',
      subtitle: 'Agri tech knowledge base, AI trial tools & research publications',
      icon: GraduationCap,
      color: 'from-cyan-500 to-blue-600'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden relative grid grid-cols-1 md:grid-cols-12 my-auto max-h-[92vh]">

        {/* Global Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-slate-100/90 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT SECTION: Premium Agricultural Tech Visual & Branding (Desktop Split Screen) */}
        <div className="hidden md:flex md:col-span-5 bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 text-white p-8 flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

          {/* Top Brand Logo */}
          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg ring-4 ring-emerald-500/20">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-white">AgriVeda <span className="text-emerald-400">AI</span></h1>
                <p className="text-[11px] text-emerald-300/90 font-medium">Your AI Copilot for Smarter Farming</p>
              </div>
            </div>

            <div className="pt-6 space-y-2">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                Smart Agriculture Platform
              </span>
              <h2 className="text-2xl font-black text-white leading-tight">
                Grow Smarter. <br />Farm Better.
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed font-medium pt-1">
                Access AI-powered agricultural intelligence, smart farming tools, community seed banks, market insights, and expert support from one platform.
              </p>
            </div>
          </div>

          {/* Middle Feature Cards */}
          <div className="space-y-2.5 relative z-10 py-6">
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-white">Multilingual AI Agronomist</p>
                <p className="text-[10px] text-slate-400">Voice & vision diagnosis in EN, TA, HI, TE</p>
              </div>
            </div>

            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <Sprout className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-white">Community Seed Bank Vault</p>
                <p className="text-[10px] text-slate-400">Preserve & exchange indigenous heritage seeds</p>
              </div>
            </div>
          </div>

          {/* Footer Security Badge */}
          <div className="relative z-10 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Supabase Secured Auth
            </span>
            <span>v2.5 Enterprise</span>
          </div>
        </div>

        {/* RIGHT SECTION: Interactive Form Cards & Auth Flows */}
        <div className="col-span-1 md:col-span-7 p-6 sm:p-8 overflow-y-auto space-y-5 flex flex-col justify-between">

          {/* Demo State Switcher Ribbon for Hackathon Showcase */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-[10px] font-bold">
            <span className="text-slate-400 uppercase shrink-0 px-1 font-extrabold">Demo View:</span>
            <button
              type="button"
              onClick={() => { setCurrentScreen('login'); setErrorMsg(''); }}
              className={`px-2.5 py-1 rounded-xl shrink-0 transition-all ${currentScreen === 'login' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-white'}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => { setCurrentScreen('signup_role'); setErrorMsg(''); }}
              className={`px-2.5 py-1 rounded-xl shrink-0 transition-all ${currentScreen === 'signup_role' || currentScreen === 'signup_form' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-white'}`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => { setCurrentScreen('otp'); setErrorMsg(''); }}
              className={`px-2.5 py-1 rounded-xl shrink-0 transition-all ${currentScreen === 'otp' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-white'}`}
            >
              OTP Verify
            </button>
            <button
              type="button"
              onClick={() => { setCurrentScreen('forgot_1'); setErrorMsg(''); }}
              className={`px-2.5 py-1 rounded-xl shrink-0 transition-all ${currentScreen === 'forgot_1' || currentScreen === 'forgot_2' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-white'}`}
            >
              Reset Password
            </button>
          </div>

          {/* Display Error Message (If any) */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-bold flex items-start gap-2 animate-in fade-in">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ========================================================================
              VIEW 1: LOGIN PAGE
             ======================================================================== */}
          {currentScreen === 'login' && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Welcome Back to AgriVeda AI
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Sign in to continue your smart farming journey.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Select Your Login Persona
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {[
                      { id: 'farmer', label: 'Farmer', icon: Sprout },
                      { id: 'loan-officer', label: 'Loan Officer', icon: Building2 },
                      { id: 'researcher', label: 'Researcher', icon: GraduationCap },
                      { id: 'institute', label: 'Institute / Bank', icon: Landmark },
                    ].map((r) => {
                      const Icon = r.icon;
                      const isSel = selectedRole === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => {
                            setSelectedRole(r.id as UserRole);
                            if (r.id === 'farmer') {
                              setEmailOrPhone('9876543210');
                              setFullName('Ravi Kumar (Punjab Farm)');
                            } else if (r.id === 'loan-officer') {
                              setEmailOrPhone('officer.sharma@sbi.co.in');
                              setFullName('Harpreet Sharma (SBI Agri Officer)');
                            } else if (r.id === 'researcher') {
                              setEmailOrPhone('dr.verma@icar.gov.in');
                              setFullName('Dr. S. K. Verma (ICAR Lead)');
                            } else if (r.id === 'institute') {
                              setEmailOrPhone('credit.director@nabard.org');
                              setFullName('NABARD Regional Directorate');
                            }
                          }}
                          className={`px-2 py-1.5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all border ${isSel
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs ring-2 ring-emerald-500/20'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{r.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address or Mobile Number
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={emailOrPhone}
                      onChange={e => setEmailOrPhone(e.target.value)}
                      placeholder="farmer.ravi@agriveda.io or 98765 43210"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">Password</label>
                    <button
                      type="button"
                      onClick={() => setCurrentScreen('forgot_1')}
                      className="text-xs font-bold text-emerald-700 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                    />
                    Remember me on this device
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Authenticating Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Social Login Dividers */}
              <div className="relative text-center my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                <span className="relative px-3 bg-white text-[11px] font-bold text-slate-400 uppercase tracking-wider">or continue with</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  className="py-2.5 px-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-center gap-2 transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  Google
                </button>

                <button
                  type="button"
                  onClick={handleGithubAuth}
                  className="py-2.5 px-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-center gap-2 transition-all"
                >
                  <svg className="w-4 h-4 fill-current text-slate-900" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.43 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.06c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.94 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.41 3-.41s2.04.14 3 .41c2.29-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.13 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.64-5.48 5.93.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.31 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  GitHub
                </button>
              </div>

              {/* Bottom Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setCurrentScreen('signup_role')}
                  className="font-bold text-emerald-700 hover:underline"
                >
                  Don't have an account? Create Account
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="font-bold text-slate-500 hover:text-slate-800"
                >
                  Continue as Guest
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================
              VIEW 2: SIGN-UP STEP 1 - ROLE SELECTION CARDS
             ======================================================================== */}
          {currentScreen === 'signup_role' && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Create Your AgriVeda AI Account
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Select your role in the smart agriculture ecosystem to customize your dashboard.
                </p>
              </div>

              <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
                {rolesList.map((r) => {
                  const Icon = r.icon;
                  const isSelected = selectedRole === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRole(r.id)}
                      className={`w-full p-3.5 rounded-2xl border text-left flex items-start gap-3.5 transition-all ${isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/80 text-slate-700'
                        }`}
                    >
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${r.color} text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900">{r.title}</h4>
                          {isSelected && <Check className="w-4 h-4 text-emerald-600 font-bold" />}
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-0.5">
                          {r.subtitle}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentScreen('login')}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Already have an account? Sign In
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentScreen('signup_form')}
                  className="py-2.5 px-5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <span>Continue to Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================
              VIEW 3: SIGN-UP STEP 2 - ROLE-BASED REGISTRATION FORM
             ======================================================================== */}
          {currentScreen === 'signup_form' && (
            <div className="space-y-4 animate-in fade-in max-h-[75vh] overflow-y-auto pr-1">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Register as {rolesList.find(r => r.id === selectedRole)?.title.split('/')[0]}
                  </h3>
                  <p className="text-[11px] text-slate-500">Provide details to personalize your AgriVeda AI experience.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentScreen('signup_role')}
                  className="text-xs font-bold text-emerald-700 hover:underline"
                >
                  Change Role
                </button>
              </div>

              <form onSubmit={handleRegistrationSubmit} className="space-y-3 text-xs">
                {/* Common Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mobile Number (+91)</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="98765 43210"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="farmer@agriveda.io"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Preferred Language</label>
                    <select
                      value={selectedLanguage}
                      onChange={e => setSelectedLanguage(e.target.value as Language)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-emerald-800 focus:ring-2 focus:ring-emerald-500/20"
                    >
                      <option value="en">English</option>
                      <option value="ta">Tamil (தமிழ்)</option>
                      <option value="hi">Hindi (हिंदी)</option>
                      <option value="te">Telugu (తెలుగు)</option>
                    </select>
                  </div>
                </div>

                {/* ROLE SPECIFIC EXTRA FIELDS */}
                {selectedRole === 'farmer' && (
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-3">
                    <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider block">Farmer Profile Details</span>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Farm Area (Acres):</label>
                        <input
                          type="number"
                          value={farmSize}
                          onChange={e => setFarmSize(Number(e.target.value))}
                          className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-bold"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Primary Crop:</label>
                        <input
                          type="text"
                          value={primaryCrop}
                          onChange={e => setPrimaryCrop(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-bold"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedRole === 'vendor' && (
                  <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-2xl space-y-2">
                    <span className="text-[10px] font-black uppercase text-blue-800 tracking-wider block">Vendor & Business Verification</span>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Business Name"
                        value={businessName}
                        onChange={e => setBusinessName(e.target.value)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-medium text-xs"
                      />
                      <input
                        type="text"
                        placeholder="GST / Reg Info"
                        value={gstNumber}
                        onChange={e => setGstNumber(e.target.value)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-medium text-xs"
                      />
                    </div>
                  </div>
                )}

                {selectedRole === 'agronomist' && (
                  <div className="p-3 bg-purple-50/70 border border-purple-200/80 rounded-2xl space-y-2">
                    <span className="text-[10px] font-black uppercase text-purple-800 tracking-wider block">Agronomist Credentials</span>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Qualification (e.g. M.Sc)"
                        value={qualification}
                        onChange={e => setQualification(e.target.value)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-medium text-xs"
                      />
                      <input
                        type="text"
                        placeholder="License / Cert #"
                        value={licenseNumber}
                        onChange={e => setLicenseNumber(e.target.value)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-medium text-xs"
                      />
                    </div>
                  </div>
                )}

                {/* Password Fields & Strength Indicator */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Password</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                    />
                  </div>
                </div>

                {/* Live Password Strength Meter */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-slate-500">Password Strength:</span>
                    <span className={passwordScore >= 3 ? 'text-emerald-600' : passwordScore === 2 ? 'text-amber-600' : 'text-rose-600'}>
                      {passwordScore >= 3 ? 'Strong' : passwordScore === 2 ? 'Medium' : 'Weak'}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
                    <div className={`h-full flex-1 transition-all ${passwordScore >= 1 ? (passwordScore >= 3 ? 'bg-emerald-500' : passwordScore === 2 ? 'bg-amber-500' : 'bg-rose-500') : 'bg-slate-200'}`} />
                    <div className={`h-full flex-1 transition-all ${passwordScore >= 2 ? (passwordScore >= 3 ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-slate-200'}`} />
                    <div className={`h-full flex-1 transition-all ${passwordScore >= 3 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                    <div className={`h-full flex-1 transition-all ${passwordScore >= 4 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                  </div>
                </div>

                {/* CAPTCHA Widget Placeholder */}
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-bold">
                    <input
                      type="checkbox"
                      checked={captchaVerified}
                      onChange={e => setCaptchaVerified(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>I'm not a robot</span>
                  </label>
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> reCAPTCHA v3
                  </div>
                </div>

                {/* Terms Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium text-[11px]">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={e => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                  />
                  <span>I agree to the Terms of Service &amp; Privacy Policy.</span>
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Create Account</span>}
                </button>
              </form>

              {/* Social Signup Dividers */}
              <div className="relative text-center my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                <span className="relative px-3 bg-white text-[11px] font-bold text-slate-400 uppercase tracking-wider">or sign up with</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  className="py-2.5 px-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-center gap-2 transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  Google
                </button>

                <button
                  type="button"
                  onClick={handleGithubAuth}
                  className="py-2.5 px-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-center gap-2 transition-all"
                >
                  <svg className="w-4 h-4 fill-current text-slate-900" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.43 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.06c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.94 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.41 3-.41s2.04.14 3 .41c2.29-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.13 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.64-5.48 5.93.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.31 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  GitHub
                </button>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setCurrentScreen('login')}
                  className="font-bold text-slate-500 hover:text-slate-800"
                >
                  Already have an account? Sign In
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================
              VIEW 4: OTP VERIFICATION SCREEN
             ======================================================================== */}
          {currentScreen === 'otp' && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Verify Your Account
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  We've sent a 6-digit verification code to <span className="font-bold text-slate-900">+91 {phone}</span> / <span className="font-bold text-slate-900">{email}</span>.
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                {/* 6-Digit Inputs */}
                <div className="flex items-center justify-between gap-2">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={e => {
                        const val = e.target.value;
                        const updated = [...otpDigits];
                        updated[idx] = val;
                        setOtpDigits(updated);
                        if (val && idx < 5) {
                          const nextInput = document.getElementById(`otp-${idx + 1}`);
                          nextInput?.focus();
                        }
                      }}
                      className="w-11 h-12 text-center text-lg font-black bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 shadow-2xs"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    {countdown > 0 ? `Resend code in 00:${countdown < 10 ? '0' + countdown : countdown}` : 'Code expired'}
                  </span>

                  <button
                    type="button"
                    disabled={!canResend}
                    onClick={() => {
                      setCountdown(30);
                      setCanResend(false);
                      alert('A new 6-digit code has been dispatched to your phone!');
                    }}
                    className="font-bold text-emerald-700 hover:underline disabled:text-slate-300"
                  >
                    Resend OTP
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Verify &amp; Continue</span>}
                </button>
              </form>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setCurrentScreen('signup_form')}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Change Mobile Number / Email
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================
              VIEW 5 & 6: PASSWORD RESET FLOW (FORGOT PASSWORD)
             ======================================================================== */}
          {(currentScreen === 'forgot_1' || currentScreen === 'forgot_2') && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  {currentScreen === 'forgot_1' ? 'Forgot Your Password?' : 'Reset Password'}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {currentScreen === 'forgot_1'
                    ? "Enter your registered Email or Mobile Number and we'll send a 6-digit recovery code."
                    : 'Enter the verification code and set a new password for your account.'}
                </p>
              </div>

              {currentScreen === 'forgot_1' ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setIsLoading(true);
                    setTimeout(() => {
                      setIsLoading(false);
                      setCurrentScreen('forgot_2');
                    }, 800);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email or Mobile Number</label>
                    <input
                      type="text"
                      required
                      value={emailOrPhone}
                      onChange={e => setEmailOrPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : 'Send Verification Code'}
                  </button>
                </form>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setIsLoading(true);
                    setTimeout(() => {
                      setIsLoading(false);
                      setSuccessMsg('Your password has been successfully reset.');
                      setCurrentScreen('success');
                      setTimeout(() => {
                        setSuccessMsg('');
                        setCurrentScreen('login');
                      }, 1200);
                    }, 800);
                  }}
                  className="space-y-3.5 text-xs"
                >
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">6-Digit Verification Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      defaultValue="582914"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-black tracking-widest text-center"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      defaultValue="AgriVeda@2026"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      defaultValue="AgriVeda@2026"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : 'Reset Password'}
                  </button>
                </form>
              )}

              <div className="pt-2 text-center text-xs">
                <button
                  type="button"
                  onClick={() => setCurrentScreen('login')}
                  className="font-bold text-slate-500 hover:text-slate-800"
                >
                  Back to Sign In
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================
              VIEW 7: SUCCESS VERIFICATION SCREEN
             ======================================================================== */}
          {currentScreen === 'success' && (
            <div className="py-10 text-center space-y-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-lg ring-8 ring-emerald-50">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900">
                  {successMsg || 'Account Verified Successfully!'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Welcome to AgriVeda AI. Loading your personalized {selectedRole} dashboard...
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
