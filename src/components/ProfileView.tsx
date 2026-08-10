import React, { useState } from 'react';
import { User, MapPin, Sprout, FileText, Globe, LogOut, Settings, ChevronRight, Bookmark, FileDown } from 'lucide-react';
import { UserProfile, CropDiagnosisReport, ActiveTab } from '../types';
import { translations, sampleCropImages } from '../data/mockData';
import { useFirebase } from '../context/FirebaseContext';
import { generateCropReportPDF } from '../utils/pdfExport';

interface ProfileViewProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onOpenAuth: () => void;
  savedReports: CropDiagnosisReport[];
  onSelectReport: (report: CropDiagnosisReport) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  setProfile,
  onOpenAuth,
  savedReports,
  onSelectReport,
  setActiveTab
}) => {
  const { logout } = useFirebase();
  const t = translations[profile.language] || translations.en;

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProfile(prev => ({ ...prev, language: e.target.value as any }));
  };

  return (
    <div className="space-y-5 pb-24 animate-in fade-in max-w-2xl mx-auto">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            <span>{t.myProfile}</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Manage digital farm credentials, diagnosis history & app preferences
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex items-center gap-4">
        <img
          src={profile.avatarUrl}
          alt={profile.name}
          className="w-16 h-16 rounded-xl object-cover border-2 border-slate-900 shadow-xs shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 truncate">{profile.name}</h3>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-50 text-blue-700 border border-blue-200/60">
              Verified Farmer
            </span>
          </div>

          <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" /> {profile.location}
          </p>

          <p className="text-xs font-bold text-slate-700 mt-1">
            Farm ID: {profile.farmId} • {profile.phone}
          </p>
        </div>

        <button
          onClick={onOpenAuth}
          className="p-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
          title="Edit Profile"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* My Farms Overview */}
      <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{t.myFarms}</h3>
          </div>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200/60">
            1 Active Plot
          </span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span>Primary Plot (Vellore Sector 4)</span>
            <span className="text-blue-600">{profile.farmSizeAcres} Acres</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 font-medium pt-2 border-t border-slate-100">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Primary Crop</span>
              <span className="font-bold text-slate-900">{profile.primaryCrop}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Soil Profile</span>
              <span className="font-bold text-slate-900">{profile.soilType}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnosis History & Saved Reports */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{t.diagnosisHistory}</h3>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {savedReports.length > 0 ? `${savedReports.length} Reports` : 'Sample Report'}
          </span>
        </div>

        <div className="space-y-2">
          {(savedReports.length > 0 ? savedReports : [
            {
              id: 'hist-1',
              timestamp: '30 Jul 2024',
              cropType: 'Tomato',
              soilType: 'Red Soil',
              location: profile.location,
              imageUrl: sampleCropImages[0].url,
              detectedIssue: sampleCropImages[0].issue,
              confidence: 94,
              riskLevel: sampleCropImages[0].riskLevel,
              farmHealthScore: sampleCropImages[0].healthScore,
              cause: sampleCropImages[0].cause,
              treatment: sampleCropImages[0].treatment,
              prevention: sampleCropImages[0].prevention,
              fertilizerSuggestion: sampleCropImages[0].fertilizer
            }
          ]).map((report) => (
            <div
              key={report.id}
              className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 transition-colors flex items-center justify-between gap-2"
            >
              <div
                onClick={() => {
                  onSelectReport(report);
                  setActiveTab('scan');
                }}
                className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
              >
                <img
                  src={report.imageUrl}
                  alt={report.detectedIssue}
                  className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-200"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{report.detectedIssue}</h4>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {report.cropType} • {report.timestamp}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    generateCropReportPDF(report, profile);
                  }}
                  className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-2xs transition-colors"
                  title="Export PDF"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Export PDF</span>
                </button>

                <button
                  onClick={() => {
                    onSelectReport(report);
                    setActiveTab('scan');
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-700"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings & Language Preferences */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <Settings className="w-4 h-4 text-slate-600" /> App Settings
        </h3>

        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-800">{t.language}</span>
          </div>

          <select
            value={profile.language}
            onChange={handleLanguageChange}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:outline-none"
          >
            <option value="en">English</option>
            <option value="ta">தமிழ் (Tamil)</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="te">తెలుగు (Telugu)</option>
          </select>
        </div>

        <button
          onClick={async () => {
            if (confirm('Are you sure you want to sign out?')) {
              try {
                await logout();
              } catch (err) {
                console.error(err);
              }
            }
          }}
          className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg border border-slate-200 flex items-center justify-center gap-2 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>{t.logout}</span>
        </button>
      </div>

    </div>
  );
};
