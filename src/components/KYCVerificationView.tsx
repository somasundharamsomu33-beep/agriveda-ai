import React, { useState } from 'react';
import { ShieldCheck, Upload, FileText, Camera, CheckCircle2, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';

interface KYCVerificationViewProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onComplete: () => void;
}

export const KYCVerificationView: React.FC<KYCVerificationViewProps> = ({
  profile,
  setProfile,
  onComplete,
}) => {
  const [identityStatus, setIdentityStatus] = useState<'completed' | 'pending' | 'required'>('completed');
  const [farmStatus, setFarmStatus] = useState<'completed' | 'pending' | 'required'>('pending');
  const [photoStatus, setPhotoStatus] = useState<'completed' | 'pending' | 'required'>('required');

  const handleIdentityUpload = () => {
    setIdentityStatus('completed');
  };

  const handleFarmUpload = () => {
    setFarmStatus('completed');
  };

  const handlePhotoUpload = () => {
    setPhotoStatus('completed');
  };

  const handleContinue = () => {
    setProfile(prev => ({
      ...prev,
      verificationStatus: 'FULLY_VERIFIED'
    }));
    onComplete();
  };

  return (
    <div className="max-w-2xl w-full mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-blue-200 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official Kisan Verification</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Verify Your Farmer Profile
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 font-medium max-w-xl">
            Complete verification to unlock personalized farming services, government subsidies, and direct mandi buyer connections.
          </p>
        </div>
      </div>

      {/* KYC Cards */}
      <div className="space-y-4">
        {/* Card 1: Identity Verification */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100 shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900">Identity Verification</h3>
                <StatusBadge status={identityStatus} />
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Upload Aadhaar / Kisan Credit Card / Voter ID document.
              </p>
            </div>
          </div>

          <button
            onClick={handleIdentityUpload}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4 text-blue-600" />
            <span>{identityStatus === 'completed' ? 'Re-upload Doc' : 'Upload Aadhaar'}</span>
          </button>
        </div>

        {/* Card 2: Farm Verification */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900">Farm Verification</h3>
                <StatusBadge status={farmStatus} />
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Add land Patta / Chitta or survey number information.
              </p>
            </div>
          </div>

          <button
            onClick={handleFarmUpload}
            className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>{farmStatus === 'completed' ? 'Verified Land' : 'Add Land Info'}</span>
          </button>
        </div>

        {/* Card 3: Farmer Photo */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-50 text-amber-700 rounded-2xl border border-amber-100 shrink-0">
              <Camera className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900">Farmer Photo</h3>
                <StatusBadge status={photoStatus} />
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Upload or capture a clear profile photo for digital Farmer Passport.
              </p>
            </div>
          </div>

          <button
            onClick={handlePhotoUpload}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Camera className="w-4 h-4 text-amber-600" />
            <span>{photoStatus === 'completed' ? 'Photo Added' : 'Capture Photo'}</span>
          </button>
        </div>
      </div>

      {/* Primary CTA */}
      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 text-center space-y-4">
        <p className="text-xs text-slate-600 font-medium max-w-md mx-auto">
          Verification is processed automatically by AgriVeda AI. Your information is encrypted under standard data privacy laws.
        </p>

        <button
          onClick={handleContinue}
          className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 inline-flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>Continue Verification</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const StatusBadge: React.FC<{ status: 'completed' | 'pending' | 'required' }> = ({ status }) => {
  if (status === 'completed') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>✓ Completed</span>
      </span>
    );
  }
  if (status === 'pending') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        <span>○ Pending Review</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
      <span>○ Required</span>
    </span>
  );
};
