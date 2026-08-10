import React, { useState } from 'react';
import { X, Smartphone, Lock, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';
import { translations } from '../data/mockData';
import { useFirebase } from '../context/FirebaseContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  profile,
  setProfile
}) => {
  const { signInWithGoogle } = useFirebase();
  const [isSignUp, setIsSignUp] = useState(false);
  const [phone, setPhone] = useState('9876543210');
  const [password, setPassword] = useState('••••••••');
  const [farmerName, setFarmerName] = useState(profile.name);
  const [location, setLocation] = useState(profile.location);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const t = translations[profile.language] || translations.en;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(prev => ({
      ...prev,
      name: farmerName,
      phone: `+91 ${phone}`,
      location
    }));
    setSuccessMsg(isSignUp ? 'Account Created Successfully!' : 'Logged in Successfully!');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  const handleGoogleSignIn = async () => {
    try {
      setErrorMsg('');
      await signInWithGoogle();
      setSuccessMsg('Signed in with Google!');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1000);
    } catch (err) {
      console.error(err);
      setErrorMsg('Google sign-in cancelled or failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl border border-slate-200 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <h3 className="text-lg font-bold text-slate-900">
            {isSignUp ? 'Create Farmer Account' : t.welcomeBack}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {isSignUp ? 'Join AgriVeda AI community for expert farming tips' : t.loginSub}
          </p>
        </div>

        {successMsg ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-blue-600 mx-auto animate-bounce" />
            <p className="text-sm font-bold text-slate-800">{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {isSignUp && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Farmer Full Name
                </label>
                <input
                  type="text"
                  required
                  value={farmerName}
                  onChange={e => setFarmerName(e.target.value)}
                  placeholder="e.g. Ravi Kumar"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.phoneLabel}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="98765 43210"
                  className="w-full pl-12 pr-3.5 py-2.5 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <Smartphone className="absolute right-3.5 top-2.5 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  {t.passwordLabel}
                </label>
                {!isSignUp && (
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('OTP reset link sent to your mobile number.'); }} className="text-[11px] font-bold text-blue-600 hover:underline">
                    {t.forgotPassword}
                  </a>
                )}
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <Lock className="absolute right-3.5 top-2.5 w-4 h-4 text-slate-400" />
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  District & State
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Vellore, Tamil Nadu"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm transition-colors"
            >
              {isSignUp ? 'Create Account' : t.loginBtn}
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-slate-400 font-medium">{t.orContinueWith}</span>
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-600 font-semibold text-center">{errorMsg}</p>
            )}

            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{t.googleSignIn}</span>
            </button>

            <div className="text-center mt-3">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                {isSignUp ? 'Already have an account? Login' : t.newFarmer}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
