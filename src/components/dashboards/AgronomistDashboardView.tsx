import React from 'react';
import { GraduationCap, CheckCircle2, AlertCircle, Calendar, MessageSquare, Sparkles, UserCheck } from 'lucide-react';
import { UserProfile } from '../../types';

interface AgronomistDashboardViewProps {
  profile: UserProfile;
}

export const AgronomistDashboardView: React.FC<AgronomistDashboardViewProps> = ({ profile }) => {
  const isVerified = profile.verificationStatus === 'FULLY_VERIFIED' || profile.verificationStatus === 'ROLE_VERIFIED';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-teal-600" />
            <span>Agronomist Expert Advisory Hub</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Provide farmer consultations, review crop pathology cases & issue advice</p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 text-xs font-black rounded-full border ${
            isVerified ? 'bg-teal-100 text-teal-800 border-teal-200' : 'bg-amber-100 text-amber-900 border-amber-200'
          }`}>
            {isVerified ? 'VERIFIED AGRONOMIST ✓' : 'CREDENTIAL REVIEW PENDING'}
          </span>
        </div>
      </div>

      {/* Verification Notice */}
      {!isVerified && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-900 font-medium">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Professional Profile Verification Pending</p>
            <p>Your academic degree and agricultural registration number are being verified. Unverified accounts cannot issue official certified prescription notes to farmers.</p>
          </div>
        </div>
      )}

      {/* Executive Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Farmer Requests</span>
          <p className="text-2xl font-black text-slate-900">28 Pending</p>
          <span className="text-[11px] font-bold text-teal-600 block">12 Urgent Pathology Cases</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Consultations Completed</span>
          <p className="text-2xl font-black text-blue-700">142 Farmers</p>
          <span className="text-[11px] font-bold text-slate-500 block">Tamil Nadu & Andhra</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">AI Prescription Score</span>
          <p className="text-2xl font-black text-emerald-600">96.8% Accuracy</p>
          <span className="text-[11px] font-bold text-slate-500 block">TNAU Aligned Advice</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Upcoming Appointments</span>
          <p className="text-2xl font-black text-slate-900">4 Scheduled</p>
          <span className="text-[11px] font-bold text-teal-600 block">Today 2:00 PM - 5:00 PM</span>
        </div>
      </div>

      {/* Pending Farmer Case Consultations */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Pending Farmer Case Reviews</h3>

        <div className="space-y-3">
          {[
            { farmer: 'Murugan Selvam', location: 'Kovilpatti', crop: 'Tomato (PKM 1)', issue: 'Severe Yellowing & Stem Wilting', urgent: true },
            { farmer: 'K. Parthiban', location: 'Tiruvallur', crop: 'Rice (CR 1009)', issue: 'Brown Leaf Spot & Blast Symptoms', urgent: false },
            { farmer: 'Lakshmi Ammal', location: 'Kanchipuram', crop: 'Groundnut', issue: 'Tikka Leaf Spot Assessment', urgent: false },
          ].map((c, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-semibold">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-slate-900 text-sm">{c.farmer} ({c.location})</h4>
                  {c.urgent && <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-black text-[10px] rounded-md">URGENT</span>}
                </div>
                <p className="text-slate-600">Crop: <span className="font-bold text-slate-900">{c.crop}</span> • Issue: <span className="font-bold text-rose-700">{c.issue}</span></p>
              </div>

              <div className="flex items-center gap-2">
                <button className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-colors cursor-pointer">
                  Review & Prescribe
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
