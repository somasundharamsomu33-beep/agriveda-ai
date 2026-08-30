import React from 'react';
import { LogOut, X, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../../types';

interface SignOutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmLogout: () => void;
  profile: UserProfile;
}

export const SignOutConfirmModal: React.FC<SignOutConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmLogout,
  profile
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl border border-slate-800 relative overflow-hidden flex flex-col space-y-5">
        
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Cancel"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Icon & Header */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
            <LogOut className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white tracking-tight">
              Proceed to logout?
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Confirm closing your active AgriVeda session
            </p>
          </div>
        </div>

        {/* User Card Information */}
        <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center gap-3">
          <img
            src={profile.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80'}
            alt={profile.name}
            className="w-11 h-11 rounded-xl object-cover border border-slate-700 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-black text-white truncate">{profile.name}</h4>
              <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {profile.role || 'Farmer'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono truncate">{profile.phone || profile.email}</p>
            <p className="text-[10px] text-slate-500 truncate">{profile.location}</p>
          </div>
        </div>

        {/* Data Security Note */}
        <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-500/20 text-xs text-emerald-300 font-medium flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-snug">
            Your saved crop diagnosis reports and farmland plot telemetry remain safely stored and synced for your next sign-in.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition-all active:scale-95 text-center cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onClose();
              onConfirmLogout();
            }}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs shadow-lg shadow-rose-950/50 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Proceed to logout</span>
          </button>
        </div>

      </div>
    </div>
  );
};
