import React from 'react';
import { Microscope, Database, FileText, Sparkles, BookOpen, Download, Search } from 'lucide-react';
import { UserProfile } from '../../types';

interface ResearchScholarDashboardViewProps {
  profile: UserProfile;
}

export const ResearchScholarDashboardView: React.FC<ResearchScholarDashboardViewProps> = ({ profile }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Microscope className="w-6 h-6 text-purple-600" />
            <span>Agricultural Research & Academic Portal</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Access GIS trial datasets, crop pathology archives & scholarly publications</p>
        </div>

        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-black rounded-full border border-purple-200">
          ACADEMIC SCHOLAR ACCESS ✓
        </span>
      </div>

      {/* Research Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Trial Datasets Access</span>
          <p className="text-2xl font-black text-slate-900">42 Datasets</p>
          <span className="text-[11px] font-bold text-purple-600 block">Soil GIS & Pathology</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Research Projects</span>
          <p className="text-2xl font-black text-blue-700">3 Active</p>
          <span className="text-[11px] font-bold text-slate-500 block">ICAR & TNAU Grants</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Citations & Exports</span>
          <p className="text-2xl font-black text-emerald-600">128 Downloads</p>
          <span className="text-[11px] font-bold text-slate-500 block">CSV & GeoJSON Formats</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">AI Query Credit</span>
          <p className="text-2xl font-black text-purple-700">Unlimited</p>
          <span className="text-[11px] font-bold text-slate-500 block">AgriVeda Research License</span>
        </div>
      </div>

      {/* Scholarly Datasets Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Available Agricultural Trial Datasets</h3>

        <div className="space-y-3">
          {[
            { title: 'Tamil Nadu Red Soil Micro-Nutrient Mapping (2025-2026)', category: 'Soil GIS', records: '14,200 samples', format: 'GeoJSON / CSV' },
            { title: 'Tomato Early Blight Pathology Image Corpus (Annotated)', category: 'Computer Vision', records: '8,500 images', format: 'ZIP / JSON' },
            { title: 'APMC Commodity Price Volatility Index (10-Year History)', category: 'Agri Economics', records: '120,000 rows', format: 'CSV' },
          ].map((d, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-semibold">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-slate-900 text-sm">{d.title}</h4>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-800 font-bold text-[10px] rounded-md">{d.category}</span>
                </div>
                <p className="text-slate-500">{d.records} • Format: {d.format}</p>
              </div>

              <button className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shrink-0">
                <Download className="w-4 h-4" />
                <span>Export Dataset</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
