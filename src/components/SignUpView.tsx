import React, { useState } from 'react';
import { User, Phone, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { AgriLogo } from './ui/AgriLogo';

interface SignUpViewProps {
  onSignUpSuccess: () => void;
  onNavigateLogin: () => void;
}

export const SignUpView: React.FC<SignUpViewProps> = ({
  onSignUpSuccess,
  onNavigateLogin,
}) => {
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignUpSuccess();
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-lg space-y-6">
      <div className="text-center space-y-3">
        <div className="inline-block p-3 bg-blue-50 rounded-2xl border border-blue-100 mb-1">
          <AgriLogo size={48} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create AgriVeda Account</h2>
        <p className="text-xs text-slate-500 font-medium">
          Start your smart farming journey today with AI insights.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Murugan Selvam"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>
        </div>

        {/* Mobile Number */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">Mobile Number</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Phone className="w-4 h-4" />
            </div>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="e.g. 98421 55432"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">Create Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2 pt-1 text-xs text-slate-600">
          <input
            type="checkbox"
            checked={agreedTerms}
            onChange={(e) => setAgreedTerms(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            required
          />
          <span className="font-medium">
            I agree to the <span className="font-bold text-slate-800">Terms of Service</span> and <span className="font-bold text-slate-800">Privacy Policy</span>.
          </span>
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Create Account & Setup Profile</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-center gap-2.5 text-xs text-blue-900 font-semibold">
        <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
        <span>100% Free for Indian Farmers & Smallholders</span>
      </div>

      <div className="text-center pt-2 border-t border-slate-100">
        <p className="text-xs text-slate-500 font-medium">
          Already have an account?{' '}
          <button
            onClick={onNavigateLogin}
            className="text-blue-600 hover:text-blue-700 font-bold underline"
          >
            Login Here
          </button>
        </p>
      </div>
    </div>
  );
};
