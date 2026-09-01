import React from 'react';
import { Calendar, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CropCalendarViewProps {
  profile: UserProfile;
}

export const CropCalendarView: React.FC<CropCalendarViewProps> = ({ profile }) => {
  const { t } = useLanguage();

  const stages = [
    { title: '🌱 Sowing & Germination', status: 'Completed', date: 'Oct 12, 2025' },
    { title: '💧 First Irrigation Cycle', status: 'Completed', date: 'Oct 20, 2025' },
    { title: '🌿 Vegetative Growth', status: 'In Progress', date: 'Nov 01 - Nov 30' },
    { title: '🌾 NPK Fertigation (Urea)', status: 'Due Tomorrow', date: 'Nov 15, 2025' },
    { title: '🛡️ Pest Monitoring', status: 'Upcoming', date: 'Dec 05, 2025' },
    { title: '🌾 Harvest Phase', status: 'Upcoming', date: 'Jan 24, 2026' }
  ];

  return (
    <div className="max-w-3xl w-full mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-600" />
          <span>{t('cropManagementHeader')}</span>
        </h2>
        <p className="text-xs text-slate-500 font-medium">Smart AI Schedule for {profile.primaryCrop || 'Rice (Paddy)'}</p>
      </div>

      {/* Lifecycle Timeline Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">{t('lifecycleStages')}</h3>

        <div className="relative border-l-2 border-blue-200 ml-4 space-y-6">
          {stages.map((st, idx) => (
            <div key={idx} className="relative pl-6 space-y-1">
              <div className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full border-2 ${
                st.status === 'Completed' ? 'bg-emerald-600 border-white' :
                st.status === 'In Progress' ? 'bg-blue-600 border-white ring-4 ring-blue-100' :
                st.status === 'Due Tomorrow' ? 'bg-amber-500 border-white animate-pulse' :
                'bg-slate-300 border-white'
              }`} />

              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-900">{st.title}</h4>
                <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                  st.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                  st.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                  st.status === 'Due Tomorrow' ? 'bg-amber-100 text-amber-900 font-extrabold' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {st.status}
                </span>
              </div>

              <p className="text-xs font-semibold text-slate-500">{st.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
