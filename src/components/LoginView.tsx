import React, { useState } from 'react';
import { Lock, Smartphone, Mail, ArrowRight, Chrome } from 'lucide-react';
import { AgriLogo } from './ui/AgriLogo';

interface LoginViewProps {
  onLoginSuccess: () => void;
  onNavigateSignUp: () => void;
  onForgotPassword?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onNavigateSignUp,
  onForgotPassword,
}) => {
  const [identifier, setIdentifier] = useState('9842155432');
  const [password, setPassword] = useState('••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess();
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-lg space-y-6">
      <div className="text-center space-y-3">
        <div className="inline-block p-3 bg-blue-50 rounded-2xl border border-blue-100 mb-1">
          <AgriLogo size={48} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Welcome to AgriVeda</h2>
        <p className="text-xs text-slate-500 font-medium">
          Your smart farming companion is ready to help.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mobile Number / Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">Mobile Number / Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Smartphone className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. 9842155432 or farmer@agriveda.in"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>
        </div>

        {/* Options */}
        <div className="flex items-center justify-between text-xs font-semibold pt-1">
          <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <span>Remember me</span>
          </label>

          <button
            type="button"
            onClick={onForgotPassword}
            className="text-blue-600 hover:text-blue-700 font-bold"
          >
            Forgot password?
          </button>
        </div>

        {/* Primary Login Button */}
        <button
          type="submit"
          className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Login</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="border-t border-slate-200 w-full" />
        <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider absolute">
          Or
        </span>
      </div>

      {/* Google Login */}
      <button
        onClick={onLoginSuccess}
        className="w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
      >
        <Chrome className="w-4 h-4 text-blue-600" />
        <span>Continue with Google</span>
      </button>

      {/* Secondary Action */}
      <div className="text-center pt-2 border-t border-slate-100">
        <p className="text-xs text-slate-500 font-medium">
          Don't have an account yet?{' '}
          <button
            onClick={onNavigateSignUp}
            className="text-blue-600 hover:text-blue-700 font-bold underline"
          >
            Create New Account
          </button>
        </p>
      </div>
    </div>
  );
};
